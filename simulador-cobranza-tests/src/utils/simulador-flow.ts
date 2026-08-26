import { expect, type Locator, type Page } from '@playwright/test';
import { getValue, type CsvRow } from './csv-data';
import { PRINCIPAL } from './selectors';

export function normalizedText(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function normalizedGxcText(value: string): string {
  const normalized = normalizedMechanismText(value);
  return normalized.includes('piloto') && normalized.includes('gxc')
    ? 'pilotogxc'
    : normalizedText(value);
}

function normalizedMechanismText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

export function nonEmpty(value: string): boolean {
  return value.trim() !== '';
}

function getStartUrl(): string {
  const baseUrl = process.env.BASE_URL?.trim();
  const startRoute = process.env.START_ROUTE?.trim();
  expect(baseUrl, 'Falta BASE_URL en .env').toBeTruthy();
  expect(startRoute, 'Falta START_ROUTE en .env').toBeTruthy();
  return new URL(startRoute!, baseUrl!).toString();
}

export async function loginWithCredentials(page: Page): Promise<void> {
  const username = process.env.User?.trim();
  const password = process.env.Password?.trim();
  expect(username, 'Falta User en .env').toBeTruthy();
  expect(password, 'Falta Password en .env').toBeTruthy();

  const usernameInput = page.getByRole('textbox', { name: /Usuario/ }).first();
  await expect(usernameInput).toBeVisible({ timeout: 30_000 });
  await usernameInput.fill(username!);

  const nextButton = page.getByRole('button', { name: 'Siguiente' });
  if (await nextButton.isVisible()) {
    await nextButton.click();
  }

  const passwordInput = page.getByRole('textbox', { name: 'Contraseña' });
  await expect(passwordInput).toBeVisible({ timeout: 30_000 });
  await passwordInput.fill(password!);
  await page.getByRole('button', { name: 'Login' }).click();

  const authError = page.getByText(
    /(nombre de usuario [oó] contraseña son incorrectos|cuenta esta bloqueada)/i
  );
  await expect(authError).toBeHidden({ timeout: 3_000 });
  await expect(page.locator(PRINCIPAL.tab.tabpanel)).toBeVisible({ timeout: 30_000 });
}

export async function login(page: Page): Promise<void> {
  await page.goto(getStartUrl(), { waitUntil: 'domcontentloaded' });

  const principal = page.locator(PRINCIPAL.tab.tabpanel);
  const hasPersistentSession = await expect(principal)
    .toBeVisible({ timeout: 15_000 })
    .then(() => true)
    .catch(() => false);

  if (hasPersistentSession) {
    console.log('[login] Sesión persistente detectada; se omite el login.');
    return;
  }

  console.log('[login] Sesión no encontrada; iniciando sesión con las credenciales de .env.');
  await loginWithCredentials(page);
}

export async function selectLabel(
  page: Page,
  select: Locator,
  expectedValue: string
): Promise<void> {
  const expected = normalizedText(expectedValue);
  const options = await select.locator('option').evaluateAll((elements) =>
    elements.map((element) => {
      const option = element as HTMLOptionElement;
      return { label: option.textContent?.trim() ?? '', value: option.value };
    })
  );
  const option = options.find(
    (current) =>
      normalizedText(current.label) === expected ||
      normalizedText(current.label).startsWith(expected)
  );

  expect(option, `No existe la opción "${expectedValue}"`).toBeTruthy();

  if (await select.isVisible()) {
    await select.selectOption({ value: option!.value });
    return;
  }

  const id = await select.getAttribute('id');
  const host = id
    ? page.locator(`[role="listbox"][aria-owns="${id}_listbox"]:visible`).first()
    : null;
  if (!host || (await host.count()) === 0) {
    await select.evaluate((element, value) => {
      const nativeSelect = element as HTMLSelectElement;
      nativeSelect.value = value;
      nativeSelect.dispatchEvent(new Event('input', { bubbles: true }));
      nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }, option!.value);
    return;
  }

  await host!.click();

  const visibleListbox = page.locator(`[id="${id}_listbox"]:visible`);
  await visibleListbox
    .getByRole('option', { name: option!.label, exact: true })
    .click();
}

export async function fillNumeric(
  page: Page,
  selector: string | Locator,
  value: string
): Promise<void> {
  const hiddenInput = typeof selector === 'string' ? page.locator(selector) : selector;
  let input: Locator | undefined;

  for (let index = 0; index < (await hiddenInput.count()); index += 1) {
    const currentInput = hiddenInput.nth(index);
    const displayInput = currentInput.locator('xpath=preceding-sibling::input[1]').first();

    if ((await displayInput.count()) > 0 && (await displayInput.isVisible())) {
      input = displayInput;
      break;
    }

    if (await currentInput.isVisible()) {
      input = currentInput;
      break;
    }
  }

  expect(input, `No se encontró un campo numérico visible para ${String(selector)}`).toBeTruthy();

  await input!.click();
  await input!.press('ControlOrMeta+A');
  await input!.type(value.replace(/[$,\s]/g, ''), { delay: 10 });
  await input!.press('Tab');
}

export async function readNumeric(page: Page, selector: string): Promise<string> {
  return page.locator(selector).inputValue();
}

export async function readSelectLabel(page: Page, selector: string): Promise<string> {
  return page
    .locator(selector)
    .locator('option:checked')
    .textContent()
    .then((value) => value?.trim() ?? '');
}

async function waitForPrincipalData(
  page: Page,
  obligationHost: Locator,
  verificationDialog: Locator,
  timeout = 30_000
): Promise<void> {
  const deadline = Date.now() + timeout;

  while (Date.now() < deadline) {
    if (await verificationDialog.isVisible().catch(() => false)) {
      const message = (await verificationDialog.textContent())?.replace(/\s+/g, ' ').trim();
      throw new Error(message || 'El simulador no encontró registros para el cliente.');
    }

    if (await obligationHost.isVisible().catch(() => false)) {
      const isBusy = (await obligationHost.getAttribute('aria-busy')) === 'true';
      if (!isBusy) {
        return;
      }
    }

    await page.waitForTimeout(250);
  }

  if (await verificationDialog.isVisible().catch(() => false)) {
    const message = (await verificationDialog.textContent())?.replace(/\s+/g, ' ').trim();
    throw new Error(message || 'El simulador no encontró registros para el cliente.');
  }

  throw new Error(
    'La información del cliente no terminó de cargar y tampoco apareció el modal de verificación.'
  );
}

export async function loadPrincipal(page: Page, row: CsvRow): Promise<void> {
  const poblamientoResponse = page
    .waitForResponse(
      (response) => response.url().includes('PoblamientoDatos'),
      { timeout: 15_000 }
    )
    .catch(() => null);

  await selectLabel(page, page.locator(PRINCIPAL.tipoDocumento.css), getValue(row, 'tipo_doc'));
  await page.locator(PRINCIPAL.identificacion.css).fill(getValue(row, 'num_documento'));
  await page.locator(PRINCIPAL.identificacion.css).press('Enter');
  await page.waitForTimeout(1_000);

  const response = await poblamientoResponse;
  if (response) {
    const sessionInfo = await page.evaluate(() => ({
      localStorageKeys: Object.keys(localStorage),
      sessionStorageKeys: Object.keys(sessionStorage),
    }));
    const cookieNames = (await page.context().cookies()).map((cookie) => ({
      name: cookie.name,
      domain: cookie.domain,
      path: cookie.path,
    }));

    console.log('[PoblamientoDatos] status =', response.status());
    console.log('[PoblamientoDatos] url =', response.url());
    console.log('[PoblamientoDatos] localStorage keys =', sessionInfo.localStorageKeys);
    console.log('[PoblamientoDatos] sessionStorage keys =', sessionInfo.sessionStorageKeys);
    console.log('[PoblamientoDatos] cookie names =', cookieNames);
  }

  const obligation = getValue(row, 'obligacion');
  expect(obligation, 'El caso no tiene obligación').toBeTruthy();
  const obligationHost = page.locator(PRINCIPAL.noObligacion.hostSelector);
  const verificationDialog = page.getByRole('dialog', {
    name: '¡Verifica tu información!',
  });

  await waitForPrincipalData(page, obligationHost, verificationDialog);
  await obligationHost.click();

  const obligationOption = page
    .locator(PRINCIPAL.noObligacion.listboxSelector)
    .getByRole('option', { name: obligation, exact: true });
  await expect(obligationOption).toBeVisible({ timeout: 30_000 });
  await obligationOption.click();
  await expect(obligationHost).toContainText(obligation);
  await expect(page.locator(PRINCIPAL.nombreCliente.css)).not.toHaveValue('');

  const marca = getValue(row, 'marcaobl', 'marca_obligacion');
  if (nonEmpty(marca)) {
    await selectLabel(page, page.locator(PRINCIPAL.marcaObligacion.css), marca);
  }

  const edadMora = getValue(row, 'edad_mora');
  if (nonEmpty(edadMora)) {
    await selectLabel(page, page.locator(PRINCIPAL.edadMora.css), edadMora);
  }

  const gestionTelefonica = getValue(row, 'gestion_telefonica');
  if (nonEmpty(gestionTelefonica)) {
    await selectLabel(page, page.locator(PRINCIPAL.gestionTelefonica.css), gestionTelefonica);
  }
}

export async function retryMechanismNavigation(
  page: Page,
  mechanismSelector: string,
  expectedTabpanel: Locator,
  maxRetries = 5,
  retryDelayMs = 50,
  attemptTimeoutMs = 10_000
): Promise<void> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    if (!page.isClosed()) {
      console.log(`[retryMechanismNavigation] Intento ${attempt}/${maxRetries}...`);
    }

    try {
      if (page.isClosed()) {
        throw new Error('Página cerrada antes de poder hacer click');
      }
      await page.locator(mechanismSelector).click();
      await expectedTabpanel.waitFor({ state: 'visible', timeout: attemptTimeoutMs });
      return;
    } catch (error) {
      if (attempt === maxRetries || page.isClosed()) {
        throw new Error(
          `Navegación al mecanismo falló después de ${attempt} intentos. ` +
            `Último error: ${error instanceof Error ? error.message : String(error)}`
        );
      }
      console.log(
        `[retryMechanismNavigation] Reintentando en ${retryDelayMs}ms...`
      );
      await page.waitForTimeout(retryDelayMs);
    }
  }
}

export async function waitForSox(
  page: Page,
  soxSelector: string,
  timeout = 30_000
): Promise<void> {
  const sox = page.locator(soxSelector);
  const deadline = Date.now() + timeout;
  const intervals = [500, 1000, 2000, 3000, 5000];

  while (Date.now() < deadline) {
    const value = await sox.inputValue();
    if (
      /FECHAPAGOXX[0-9]{8}(?:LLL|$)/i.test(value) &&
      /VALORCONSIGSNRXX[1-9][0-9]*(?:LLL|$)/i.test(value) &&
      /INTERES CORRIENTE(?:\s+DE)?\s+[1-9][0-9]*(?:\s|,|LLL|$)/i.test(value)
    ) {
      return;
    }
    const waitTime = intervals.shift() ?? 5000;
    intervals.push(waitTime);
    await page.waitForTimeout(waitTime);
  }

  const finalValue = await sox.inputValue();
  throw new Error(
    `El campo SOX no se actualizó correctamente dentro de ${timeout}ms. ` +
      `Valor actual: "${finalValue.substring(0, 200)}..."`
  );
}

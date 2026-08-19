import { expect, type Locator, type Page } from '@playwright/test';
import { getValue, type CsvRow } from './csv-data';
import { PRINCIPAL } from './selectors';

export function normalizedText(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
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

export async function selectLabel(select: Locator, expectedValue: string): Promise<void> {
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
  await select.selectOption({ value: option!.value });
}

export async function fillNumeric(page: Page, selector: string, value: string): Promise<void> {
  const hiddenInput = page.locator(selector);
  const displayInput = hiddenInput.locator('xpath=preceding-sibling::input[1]');
  const input = (await displayInput.count()) > 0 ? displayInput : hiddenInput;

  await input.click();
  await input.press('ControlOrMeta+A');
  await input.type(value.replace(/[$,\s]/g, ''), { delay: 10 });
  await input.press('Tab');
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

  await selectLabel(page.locator(PRINCIPAL.tipoDocumento.css), getValue(row, 'tipo_doc'));
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
    await selectLabel(page.locator(PRINCIPAL.marcaObligacion.css), marca);
  }

  const edadMora = getValue(row, 'edad_mora');
  if (nonEmpty(edadMora)) {
    await selectLabel(page.locator(PRINCIPAL.edadMora.css), edadMora);
  }

  const gestionTelefonica = getValue(row, 'gestion_telefonica');
  if (nonEmpty(gestionTelefonica)) {
    await selectLabel(page.locator(PRINCIPAL.gestionTelefonica.css), gestionTelefonica);
  }
}

import path from 'node:path';
import { type Page, type TestInfo } from '@playwright/test';
import { expect, test } from '../../fixtures/persistent-playwright';
import {
  findCase,
  getValue,
  normalizeMechanism,
  parseNumber,
  readCsv,
  type CsvRow,
} from '../../utils/csv-data';
import { MECANISMOS, NAV, NOVACION_PAG1, NOVACION_PAG2 } from '../../utils/selectors';
import {
  fillNumeric,
  loadPrincipal,
  login,
  nonEmpty,
  normalizedGxcText,
  normalizedText,
  readNumeric,
  readSelectLabel,
  retryMechanismNavigation,
  selectLabel,
} from '../../utils/simulador-flow';

const dataPath = path.resolve(__dirname, '../../../data/datos_negociacion.csv');
const comparePath = path.resolve(__dirname, '../../../data/data_compare.csv');
const negotiationRows = readCsv(dataPath);
const comparisonRows = readCsv(comparePath);

function normalizeComprasAuto(value: string): string {
  const normalized = normalizeMechanism(value);
  if (normalized.startsWith('no')) {
    return 'NO - 0';
  }

  const months = value.match(/\d+/)?.[0];
  return months ? `SI a ${months}` : value;
}

async function fillDate(page: Page, value: string): Promise<void> {
  const digits = value.replace(/\D/g, '');
  const dateDigits =
    digits.length === 6
      ? `20${digits.slice(4)}${digits.slice(2, 4)}${digits.slice(0, 2)}`
      : digits;
  const dateInput = page.locator('input[role="combobox"]:visible').last();
  await dateInput.click();
  await dateInput.press('ControlOrMeta+A');
  await dateInput.press('Backspace');
  await dateInput.type(dateDigits, { delay: 10 });
  await dateInput.press('Tab');
}

async function waitForNovacionFields(page: Page, expected: CsvRow): Promise<void> {
  const fields = {
    facturacion_2_a_6: NOVACION_PAG1.facturacion2a6.css,
    '1er_facturacion': NOVACION_PAG1.primeraFacturacion.css,
    cuota_proyectada: NOVACION_PAG1.cuotaProyectada.css,
    gastosgxc: NOVACION_PAG1.gastosGXC.css,
    maximohonorarios: NOVACION_PAG1.honorariosMaxPermitido.css,
    honorarioscomfirm: NOVACION_PAG1.honorariosNovacion.css,
    valormaximopilotos: NOVACION_PAG1.valorMaximoPilotos.css,
    valorGXCpilotoconfirm: NOVACION_PAG1.honorariosNovacion.css,
  } as const;
  const pollOptions = { timeout: 30_000, intervals: [250, 500, 1_000] };

  for (const [field, selector] of Object.entries(fields)) {
    const expectedValue = getValue(expected, field);
    if (!nonEmpty(expectedValue)) {
      continue;
    }

    await expect
      .poll(() => readNumeric(page, selector), pollOptions)
      .toMatch(/[1-9][0-9]*/);
  }
}

async function waitForNovacionSox(page: Page): Promise<void> {
  const sox = page.locator(NOVACION_PAG2.plantillaSOX.css);
  const pollOptions = { timeout: 30_000, intervals: [250, 500, 1_000] };

  await expect.poll(() => sox.inputValue(), pollOptions).toMatch(/FECHAPAGOXX\d+/i);
  await expect.poll(() => sox.inputValue(), pollOptions).toMatch(/COMPRASAUTXX/i);
  await expect.poll(() => sox.inputValue(), pollOptions).toMatch(/PLAZOAUTXX/i);
}

async function loadNovacion(page: Page, row: CsvRow, expected: CsvRow): Promise<void> {
  await retryMechanismNavigation(
    page,
    MECANISMOS.novacion,
    page.locator(NOVACION_PAG1.tab.tabpanel)
  );

  const linea = getValue(row, 'linea');
  if (nonEmpty(linea)) {
    await selectLabel(page, page.locator(NOVACION_PAG1.linea.css), linea);
  }

  const tipoCartera = getValue(row, 'tipo_cartera');
  if (nonEmpty(tipoCartera)) {
    await selectLabel(page, page.locator(NOVACION_PAG1.tipoCartera.css), tipoCartera);
  }

  const numericFields = [
    ['saldo_total', NOVACION_PAG1.saldoTotalDiferir.css],
    ['dias_mora', NOVACION_PAG1.diasMora.css],
    ['pago_minimo', NOVACION_PAG1.pagoMinimoCliente.css],
    ['interes_cte', NOVACION_PAG1.interesCorriente.css],
    ['interes_extracontables_tc', NOVACION_PAG1.interesExtracontable.css],
    ['otros_cargos_exigibles', NOVACION_PAG1.otrosCargosExigibles.css],
    ['interes_mora', NOVACION_PAG1.interesesMora.css],
    ['pago_gestion_recuperacion', NOVACION_PAG1.pagoGestionRecuperacion.css],
  ] as const;

  for (const [field, selector] of numericFields) {
    const value = getValue(row, field);
    if (nonEmpty(value)) {
      await fillNumeric(page, selector, value);
    }
  }

  const tasa = getValue(row, 'tasa');
  if (nonEmpty(tasa)) {
    await selectLabel(page, page.locator(NOVACION_PAG1.tasa.css), tasa);
  }

  const tasaNovacion = getValue(row, 'por_tasa_novacion', 'por_tasa');
  if (nonEmpty(tasaNovacion)) {
    await fillNumeric(page, NOVACION_PAG1.porcentajeTasaNovacion.css, tasaNovacion);
  }

  const tasaGxc = getValue(row, 'por_tasa_gxc', 'tasa_gxc');
  if (nonEmpty(tasaGxc)) {
    await fillNumeric(page, NOVACION_PAG1.tasaGXC.css, tasaGxc);
  }

  const plazo = getValue(row, 'plazo_meses');
  if (nonEmpty(plazo)) {
    await selectLabel(page, page.locator(NOVACION_PAG1.plazo.css), plazo);
  }

  const honorarios = getValue(row, 'honorarios');
  if (nonEmpty(honorarios)) {
    await fillNumeric(page, NOVACION_PAG1.honorariosNovacion.css, honorarios);
  }

  const fechaPago = getValue(row, 'fecha_pago');
  if (nonEmpty(fechaPago)) {
    await fillDate(page, fechaPago);
  }

  await waitForNovacionFields(page, expected);

  await page
    .locator(NOVACION_PAG1.tab.tabpanel)
    .locator(`${NAV.rightArrow}:visible`)
    .click();
  await expect(page.locator(NOVACION_PAG2.tab.tabpanel)).toBeVisible({ timeout: 30_000 });

  const comprasAuto = getValue(row, 'compras_auto');
  if (nonEmpty(comprasAuto)) {
    await selectLabel(
      page,
      page.locator(NOVACION_PAG2.comprasAuto.css),
      normalizeComprasAuto(comprasAuto)
    );
  }

  const actividadEconomica = getValue(row, 'actividad_economica');
  if (nonEmpty(actividadEconomica)) {
    await selectLabel(page, page.locator(NOVACION_PAG2.actividadEconomica.css), actividadEconomica);
  }

  const ocupacion = getValue(row, 'ocupa_ingresos_adicionales');
  if (nonEmpty(ocupacion)) {
    await selectLabel(
      page,
      page.locator(NOVACION_PAG2.ocupacionIngresosAdicionales.css),
      ocupacion
    );
  }

  const page2NumericFields = [
    ['ingreso_bruto', NOVACION_PAG2.ingresoBruto.css],
    ['ingresos_adicional', NOVACION_PAG2.ingresosAdicionales.css],
    ['cuotas_finaz_bdb', NOVACION_PAG2.cuotasFinancierasMensuales.css],
  ] as const;

  for (const [field, selector] of page2NumericFields) {
    const value = getValue(row, field);
    if (nonEmpty(value) && (field !== 'ingresos_adicional' || parseNumber(value) !== 0)) {
      await fillNumeric(page, selector, value);
    }
  }

  const requiereTramite = getValue(row, 'requiere_tramite');
  if (nonEmpty(requiereTramite)) {
    await selectLabel(
      page,
      page.locator(NOVACION_PAG2.requiereTramiteExcepcion.css),
      requiereTramite
    );
  }

  const codigoExcepcion = getValue(row, 'codigo_excepcion');
  if (normalizeMechanism(codigoExcepcion) === 'vacio') {
    await page.locator(NOVACION_PAG2.codigoExcepcion.css).selectOption({ index: 1 });
  } else if (nonEmpty(codigoExcepcion)) {
    await selectLabel(page, page.locator(NOVACION_PAG2.codigoExcepcion.css), codigoExcepcion);
  }

  // La aplicación crea la plantilla al entrar a la página 2. Volver a entrar
  // después de completar sus campos fuerza la generación con todos los datos.
  await page
    .locator(NOVACION_PAG2.tab.tabpanel)
    .locator(`${NAV.leftArrow2}:visible`)
    .click();
  await expect(page.locator(NOVACION_PAG1.tab.tabpanel)).toBeVisible({ timeout: 30_000 });
  await page
    .locator(NOVACION_PAG1.tab.tabpanel)
    .locator(`${NAV.rightArrow}:visible`)
    .click();
  await expect(page.locator(NOVACION_PAG2.tab.tabpanel)).toBeVisible({ timeout: 30_000 });
  await waitForNovacionSox(page);
}

const comparisonFields = [
  'gxc_honorarios',
  'linea',
  'tipo_cartera',
  'diasmora',
  'Facturacion 2 a 6',
  '1er Facturacion',
  'cuota proyectada',
  'gastosgxc',
  'maximohonorarios',
  'honorarioscomfirm',
  'valormaximopilotos',
  'valorGXCpilotoconfirm',
  'sox',
] as const;

function isNovacionCase(row: CsvRow): boolean {
  return (
    getValue(row, 'id_caso').toUpperCase().startsWith('NOV_') ||
    normalizeMechanism(getValue(row, 'mecanismo')) === 'novacion'
  );
}

function getNovacionCaseIds(): string[] {
  const ids = [...negotiationRows, ...comparisonRows]
    .filter(isNovacionCase)
    .map((row) => getValue(row, 'id_caso').trim().toUpperCase())
    .filter(Boolean);

  return [...new Set(ids)];
}

function getCaseDataError(
  caseId: string,
  negotiationCase: CsvRow | undefined,
  expectedCase: CsvRow | undefined
): string | undefined {
  if (!negotiationCase) {
    return `El caso ${caseId} existe en data_compare.csv, pero no en datos_negociacion.csv.`;
  }

  if (!expectedCase) {
    return `El caso ${caseId} existe en datos_negociacion.csv, pero no en data_compare.csv.`;
  }

  const negotiationMechanism = normalizeMechanism(getValue(negotiationCase, 'mecanismo'));
  const expectedMechanism = normalizeMechanism(getValue(expectedCase, 'mecanismo'));
  if (negotiationMechanism !== 'novacion' || expectedMechanism !== 'novacion') {
    return `El caso ${caseId} debe tener mecanismo Novación en ambos archivos.`;
  }

  const negotiationDocument = getValue(negotiationCase, 'num_documento');
  const expectedDocument = getValue(expectedCase, 'num_documento');
  if (negotiationDocument && expectedDocument && negotiationDocument !== expectedDocument) {
    return (
      `El caso ${caseId} tiene documentos diferentes: ` +
      `${negotiationDocument} en datos_negociacion.csv y ${expectedDocument} en data_compare.csv.`
    );
  }

  return undefined;
}

async function compareNovacion(
  page: Page,
  row: CsvRow,
  expected: CsvRow,
  testInfo: TestInfo
): Promise<void> {
  const gastosGxc = await readNumeric(page, NOVACION_PAG1.gastosGXC.css);
  const actual: Record<string, string> = {
    gxc_honorarios: await readSelectLabel(page, NOVACION_PAG1.gxcHonorarios.css),
    linea: await readSelectLabel(page, NOVACION_PAG1.linea.css),
    tipo_cartera: await readSelectLabel(page, NOVACION_PAG1.tipoCartera.css),
    diasmora: await readNumeric(page, NOVACION_PAG1.diasMora.css),
    'Facturacion 2 a 6': await readNumeric(page, NOVACION_PAG1.facturacion2a6.css),
    '1er Facturacion': await readNumeric(page, NOVACION_PAG1.primeraFacturacion.css),
    'cuota proyectada': await readNumeric(page, NOVACION_PAG1.cuotaProyectada.css),
    gastosgxc: gastosGxc,
    maximohonorarios: await readNumeric(page, NOVACION_PAG1.honorariosMaxPermitido.css),
    honorarioscomfirm: await readNumeric(page, NOVACION_PAG1.honorariosNovacion.css),
    valormaximopilotos: await readNumeric(page, NOVACION_PAG1.valorMaximoPilotos.css),
    valorGXCpilotoconfirm: await readNumeric(page, NOVACION_PAG1.honorariosNovacion.css),
    sox: await page.locator(NOVACION_PAG2.plantillaSOX.css).inputValue(),
  };
  const actualFields = new Set(Object.keys(actual).map(normalizeMechanism));

  for (const field of Object.keys(expected)) {
    if (['id_caso', 'mecanismo', 'num_documento'].includes(field)) {
      continue;
    }

    const expectedValue = getValue(expected, field);
    if (nonEmpty(expectedValue) && !actualFields.has(normalizeMechanism(field))) {
      throw new Error(
        `El campo esperado "${field}" del caso ${getValue(row, 'id_caso')} ` +
          'no tiene una lectura configurada para Novación.'
      );
    }
  }

  const comparisons = comparisonFields.map((field) => {
    const expectedValue = getValue(expected, field);
    if (!nonEmpty(expectedValue)) {
      return { field, skipped: true, expected: '', actual: actual[field], pass: true };
    }

    if (field === 'gxc_honorarios') {
      return {
        field,
        skipped: false,
        expected: expectedValue,
        actual: actual[field],
        pass: normalizedGxcText(actual[field]) === normalizedGxcText(expectedValue),
      };
    }

    if (['linea', 'tipo_cartera', 'sox'].includes(field)) {
      return {
        field,
        skipped: false,
        expected: expectedValue,
        actual: actual[field],
        pass: normalizedText(actual[field]) === normalizedText(expectedValue),
      };
    }

    return {
      field,
      skipped: false,
      expected: expectedValue,
      actual: actual[field],
      pass: parseNumber(actual[field]) === parseNumber(expectedValue),
    };
  });

  await testInfo.attach('datos-cargados.json', {
    body: JSON.stringify(row, null, 2),
    contentType: 'application/json',
  });
  await testInfo.attach('resultado-comparacion.json', {
    body: JSON.stringify({ actual, comparisons }, null, 2),
    contentType: 'application/json',
  });

  expect(comparisons.filter((comparison) => !comparison.pass), 'Diferencias de Novación').toEqual(
    []
  );
}

const novacionCases = negotiationRows.filter(isNovacionCase);

for (const caseId of getNovacionCaseIds()) {
  const row = findCase(novacionCases, caseId);
  const expected = findCase(comparisonRows, caseId);
  const dataError = getCaseDataError(caseId, row, expected);

  if (dataError) {
    test(`${caseId} - Novación - validación de datos`, () => {
      throw new Error(dataError);
    });
    continue;
  }

  test(`${caseId} - Novación`, async ({ page }, testInfo) => {
    await login(page);
    await loadPrincipal(page, row!);
    await loadNovacion(page, row!, expected!);
    await compareNovacion(page, row!, expected!, testInfo);
  });
}

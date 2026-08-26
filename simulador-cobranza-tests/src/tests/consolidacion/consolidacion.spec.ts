import path from 'node:path';
import { type Locator, type Page, type TestInfo } from '@playwright/test';
import { expect, test } from '../../fixtures/persistent-playwright';
import {
  findCase,
  getValue,
  normalizeMechanism,
  parseNumber,
  readCsv,
  type CsvRow,
} from '../../utils/csv-data';
import {
  CONSOLIDACION_ACTIVIDAD,
  CONSOLIDACION_PAG1,
  CONSOLIDACION_PAG2,
  CONSOLIDACION_PAG4,
  MECANISMOS,
  NAV,
} from '../../utils/selectors';
import {
  fillNumeric,
  loadPrincipal,
  login,
  nonEmpty,
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

const cardFields = {
  saldo_total_obl: CONSOLIDACION_PAG1.labels.saldoTotal,
  honorarios_obl: CONSOLIDACION_PAG1.labels.honorarios,
  interes_cte_obl: CONSOLIDACION_PAG1.labels.interesCorriente,
  interes_mora_obl: CONSOLIDACION_PAG1.labels.interesMora,
  interes_extracontables_obl: CONSOLIDACION_PAG1.labels.interesExtracontablesTC,
} as const;

function readObligationList(row: CsvRow, field: string): string[] {
  const value = getValue(row, field);
  if (!nonEmpty(value)) {
    return [];
  }

  return value.split(';').map((item) => item.trim());
}

function readAlignedValues(
  row: CsvRow,
  field: string,
  expectedLength: number,
  caseId: string
): string[] {
  const value = getValue(row, field);
  if (!nonEmpty(value)) {
    return Array.from({ length: expectedLength }, () => '');
  }

  const values = value.split(';').map((item) => item.trim());
  if (values.length !== expectedLength) {
    throw new Error(
      `El campo ${field} del caso ${caseId} debe tener ${expectedLength} posiciones; ` +
        `recibió ${values.length}.`
    );
  }

  return values;
}

function cardField(card: Locator, label: string): Locator {
  return card.locator('.field-container').filter({ hasText: label }).locator('input.input').first();
}

async function selectConsolidatedObligations(page: Page, obligations: string[]): Promise<void> {
  const uniqueObligations = new Set(obligations);
  expect(obligations.every(nonEmpty), 'Toggle-obl-consolidacion contiene posiciones vacías').toBeTruthy();
  expect(uniqueObligations.size, 'Toggle-obl-consolidacion contiene obligaciones repetidas').toBe(
    obligations.length
  );

  for (const obligation of obligations) {
    const card = page.locator(CONSOLIDACION_PAG1.cards.byObligation(obligation)).first();
    await expect(card, `No se encontró la tarjeta de obligación ${obligation}`).toBeVisible({
      timeout: 30_000,
    });

    const toggle = card.locator('input[type="checkbox"]').first();
    if (!(await toggle.isChecked())) {
      await toggle.evaluate((element) => (element as HTMLInputElement).click());
    }
    await expect(toggle).toBeChecked();
  }
}

async function editObligationFields(page: Page, row: CsvRow, obligations: string[]): Promise<void> {
  const caseId = getValue(row, 'id_caso');

  for (const [field, label] of Object.entries(cardFields)) {
    const values = readAlignedValues(row, field, obligations.length, caseId);
    for (const [index, value] of values.entries()) {
      if (!nonEmpty(value)) {
        continue;
      }

      const obligation = obligations[index];
      const card = page.locator(CONSOLIDACION_PAG1.cards.byObligation(obligation)).first();
      const input = cardField(card, label);
      await expect(input, `No se encontró ${label} en la obligación ${obligation}`).toBeVisible();
      await expect(input, `El campo ${label} no quedó habilitado en ${obligation}`).toBeEnabled();
      await fillNumeric(page, input, value);
    }
  }
}

async function fillDate(page: Page, value: string): Promise<void> {
  const digits = value.replace(/\D/g, '');
  const dateDigits =
    digits.length === 6
      ? `${digits.slice(0, 2)}${digits.slice(2, 4)}20${digits.slice(4)}`
      : digits;
  const dateInput = page.locator('input[role="combobox"]:visible').last();
  await dateInput.click();
  await dateInput.press('ControlOrMeta+A');
  await dateInput.press('Backspace');
  await dateInput.type(dateDigits, { delay: 10 });
  await dateInput.press('Tab');
}

async function waitForConsolidacionSox(page: Page): Promise<void> {
  const sox = page.locator(CONSOLIDACION_PAG4.plantillaSOX.css);
  const pollOptions = { timeout: 30_000, intervals: [250, 500, 1_000] };

  await expect
    .poll(() => sox.inputValue(), pollOptions)
    .toMatch(/FECHAPAGOXX[0-9]{8}(?:LLL|$)/i);
  await expect
    .poll(() => sox.inputValue(), pollOptions)
    .toMatch(/VALORPAGOPRODUCTOXX[1-9][0-9]*(?:LLL|$)/i);
  await expect
    .poll(() => sox.inputValue(), pollOptions)
    .toMatch(/CUOTAPROYECTADAXX[1-9][0-9]*(?:\s|LLL|$)/i);
}

function normalizedConsolidacionSox(value: string): string {
  return normalizedText(value).replace(
    /producto terminados en (.*?) a un plazo de/,
    (_match: string, obligations: string) =>
      `producto terminados en ${obligations.trim().split(/\s+/).sort().join(' ')} a un plazo de`
  );
}

async function loadConsolidacion(page: Page, row: CsvRow): Promise<void> {
  await retryMechanismNavigation(
    page,
    MECANISMOS.consolidacion,
    page.locator(CONSOLIDACION_PAG1.tab.tabpanel)
  );

  const obligations = readObligationList(row, 'Toggle-obl-consolidacion');
  expect(obligations.length, 'El caso no tiene obligaciones para Consolidación').toBeGreaterThan(0);
  await expect(page.locator(CONSOLIDACION_PAG1.cards.container).first()).toBeVisible({ timeout: 30_000 });
  await selectConsolidatedObligations(page, obligations);
  await editObligationFields(page, row, obligations);

  await page
    .locator(CONSOLIDACION_PAG1.tab.tabpanel)
    .locator(`${NAV.rightArrowC}:visible`)
    .click();
  await expect(page.locator(CONSOLIDACION_PAG2.tab.tabpanel)).toBeVisible({ timeout: 30_000 });
  await expect
    .poll(() => readNumeric(page, CONSOLIDACION_PAG2.saldoTotalDesembolsar.css), {
      timeout: 30_000,
      intervals: [250, 500, 1_000],
    })
    .toMatch(/[1-9][0-9]*/);

  const amortizacion = getValue(row, 'amortizacion');
  if (nonEmpty(amortizacion)) {
    await selectLabel(page, page.locator(CONSOLIDACION_PAG2.amortizacion.css), amortizacion);
  }

  const plazo = getValue(row, 'plazo_meses');
  if (nonEmpty(plazo)) {
    await fillNumeric(page, CONSOLIDACION_PAG2.plazoMeses.css, plazo);
  }

  const tasaEa = getValue(row, 'tasaint_E.A');
  if (nonEmpty(tasaEa)) {
    await fillNumeric(page, CONSOLIDACION_PAG2.tasaEA.css, tasaEa);
  }

  const pagoNegociacion = getValue(row, 'pagonegociacion');
  if (nonEmpty(pagoNegociacion)) {
    await fillNumeric(page, CONSOLIDACION_PAG2.pagoNegociacion.css, pagoNegociacion);
  }

  const requiereTramite = getValue(row, 'requiere_tramite');
  if (nonEmpty(requiereTramite)) {
    await selectLabel(
      page,
      page.locator(CONSOLIDACION_PAG2.requiereTramiteExcepcion.css),
      requiereTramite
    );
  }

  const fechaPago = getValue(row, 'fecha_pago');
  if (nonEmpty(fechaPago)) {
    await fillDate(page, fechaPago);
  }

  await page
    .locator(CONSOLIDACION_PAG2.tab.tabpanel)
    .locator(`${NAV.rightArrowC2}:visible`)
    .click();
  await expect(page.locator(CONSOLIDACION_ACTIVIDAD.tab.tabpanel)).toBeVisible({ timeout: 30_000 });

  const actividad = getValue(row, 'actividad_economica');
  if (nonEmpty(actividad)) {
    await selectLabel(page, page.locator(CONSOLIDACION_ACTIVIDAD.actividadEconomica.css), actividad);
  }

  const ocupacion = getValue(row, 'ocupa_ingresos_adicionales');
  if (nonEmpty(ocupacion)) {
    await selectLabel(
      page,
      page.locator(CONSOLIDACION_ACTIVIDAD.ocupacionIngresosAdicionales.css),
      ocupacion
    );
  }

  const numericActivityFields = [
    ['cuotas_finaz_BDB', CONSOLIDACION_ACTIVIDAD.cuotasFinancierasMensuales.css],
    ['ingreso_bruto', CONSOLIDACION_ACTIVIDAD.ingresoBruto.css],
    ['ingresos_adicional', CONSOLIDACION_ACTIVIDAD.ingresosAdicionales.css],
  ] as const;
  for (const [field, selector] of numericActivityFields) {
    const value = getValue(row, field);
    if (nonEmpty(value)) {
      await fillNumeric(page, selector, value);
    }
  }

  await page
    .locator(CONSOLIDACION_ACTIVIDAD.tab.tabpanel)
    .locator(`${NAV.rightArrowC3}:visible`)
    .click();
  await expect(page.locator(CONSOLIDACION_PAG4.tab.tabpanel)).toBeVisible({ timeout: 30_000 });
  await waitForConsolidacionSox(page);
}

const comparisonFields = [
  'total_baja_int_corrientes',
  'total_baja_int_mora',
  'total_baja_extracontables',
  'porcentaje_baja_int_cte',
  'porcentaje_baja_int_mora',
  'porcentaje_baja_int_extra',
  'total_honorarios',
  'saldo_total_desembolsar',
  'marca_obligacion',
  'amortizacion',
  'plazo_meses',
  'tasa_ea',
  'cuota_proyectada',
  'pago_negociacion',
  'sox',
] as const;

function isConsolidacionCase(row: CsvRow): boolean {
  const mechanism = normalizeMechanism(getValue(row, 'mecanismo'));
  return getValue(row, 'id_caso').toUpperCase().startsWith('CONS_') ||
    mechanism === 'consolidacion' ||
    mechanism === 'concolidacion';
}

function getConsolidacionCaseIds(): string[] {
  const ids = [...negotiationRows, ...comparisonRows]
    .filter(isConsolidacionCase)
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

  const mechanism = normalizeMechanism(getValue(negotiationCase, 'mecanismo'));
  const expectedMechanism = normalizeMechanism(getValue(expectedCase, 'mecanismo'));
  const validMechanisms = new Set(['consolidacion', 'concolidacion']);
  if (!validMechanisms.has(mechanism) || !validMechanisms.has(expectedMechanism)) {
    return `El caso ${caseId} debe tener mecanismo Consolidación en ambos archivos.`;
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

async function compareConsolidacion(
  page: Page,
  row: CsvRow,
  expected: CsvRow,
  testInfo: TestInfo
): Promise<void> {
  const actual: Record<string, string> = {
    total_baja_int_corrientes: await readNumeric(page, CONSOLIDACION_PAG2.totalBajaIntCorrientes.css),
    total_baja_int_mora: await readNumeric(page, CONSOLIDACION_PAG2.totalBajaIntMora.css),
    total_baja_extracontables: await readNumeric(page, CONSOLIDACION_PAG2.totalBajaExtracontables.css),
    porcentaje_baja_int_cte: await readNumeric(page, CONSOLIDACION_PAG2.porcentajeBajaIntCte.css),
    porcentaje_baja_int_mora: await readNumeric(page, CONSOLIDACION_PAG2.porcentajeBajaIntMora.css),
    porcentaje_baja_int_extra: await readNumeric(page, CONSOLIDACION_PAG2.porcentajeBajaIntExtracTC.css),
    total_honorarios: await readNumeric(page, CONSOLIDACION_PAG2.totalHonorarios.css),
    saldo_total_desembolsar: await readNumeric(page, CONSOLIDACION_PAG2.saldoTotalDesembolsar.css),
    marca_obligacion: await readNumeric(page, CONSOLIDACION_PAG2.marcaObligacion.css),
    amortizacion: await readSelectLabel(page, CONSOLIDACION_PAG2.amortizacion.css),
    plazo_meses: await readNumeric(page, CONSOLIDACION_PAG2.plazoMeses.css),
    tasa_ea: await readNumeric(page, CONSOLIDACION_PAG2.tasaEA.css),
    cuota_proyectada: await readNumeric(page, CONSOLIDACION_PAG2.cuotaProyectada.css),
    pago_negociacion: await readNumeric(page, CONSOLIDACION_PAG2.pagoNegociacion.css),
    sox: await page.locator(CONSOLIDACION_PAG4.plantillaSOX.css).inputValue(),
  };

  const comparisons = comparisonFields.map((field) => {
    const expectedValue = getValue(expected, field);
    if (!nonEmpty(expectedValue)) {
      return { field, skipped: true, expected: '', actual: actual[field], pass: true };
    }

    if (field === 'sox') {
      return {
        field,
        skipped: false,
        expected: expectedValue,
        actual: actual[field],
        pass: normalizedConsolidacionSox(actual[field]) === normalizedConsolidacionSox(expectedValue),
      };
    }

    if (field === 'amortizacion' || field === 'marca_obligacion') {
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

  expect(comparisons.filter((comparison) => !comparison.pass), 'Diferencias de Consolidación').toEqual(
    []
  );
}

const consolidationCases = negotiationRows.filter(isConsolidacionCase);

for (const caseId of getConsolidacionCaseIds()) {
  const row = findCase(consolidationCases, caseId);
  const expected = findCase(comparisonRows, caseId);
  const dataError = getCaseDataError(caseId, row, expected);

  if (dataError) {
    test(`${caseId} - Consolidación - validación de datos`, () => {
      throw new Error(dataError);
    });
    continue;
  }

  test(`${caseId} - Consolidación`, async ({ page }, testInfo) => {
    await login(page);
    await loadPrincipal(page, row!);
    await loadConsolidacion(page, row!);
    await compareConsolidacion(page, row!, expected!, testInfo);
  });
}

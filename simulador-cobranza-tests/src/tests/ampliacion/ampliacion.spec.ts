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
import {
  AMPLIACION_PAG1,
  AMPLIACION_PAG2,
  AMPLIACION_PAG3,
  MECANISMOS,
  NAV,
} from '../../utils/selectors';
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
  waitForSox,
} from '../../utils/simulador-flow';

const dataPath = path.resolve(__dirname, '../../../data/datos_negociacion.csv');
const comparePath = path.resolve(__dirname, '../../../data/data_compare.csv');
const negotiationRows = readCsv(dataPath);
const comparisonRows = readCsv(comparePath);

async function waitForAmpliacionFields(page: Page, expected: CsvRow): Promise<void> {
  const pollOptions = { timeout: 30_000, intervals: [250, 500, 1_000] };
  const fields = {
    abono_minimo_max: AMPLIACION_PAG1.abonoConBajaMax.css,
    maximohonorarios: AMPLIACION_PAG1.valorHonorariosMaximo.css,
    max_total_baja: AMPLIACION_PAG1.totalBajasEnCuentas.css,
    bajacuentaIntCte: AMPLIACION_PAG1.bajaCuentaIntCte.css,
    bajacuentaIntMora: AMPLIACION_PAG1.bajaCuentaIntMora.css,
  } as const;

  for (const [field, selector] of Object.entries(fields)) {
    const expectedValue = getValue(expected, field);
    if (!nonEmpty(expectedValue)) {
      continue;
    }

    await expect
      .poll(() => readNumeric(page, selector), pollOptions)
      .toBe(expectedValue);
  }
}

async function waitForAmpliacionSox(page: Page, expected: CsvRow): Promise<void> {
  const honorariosExpected = nonEmpty(getValue(expected, 'maximohonorarios'));
  const sox = page.locator(AMPLIACION_PAG3.plantillaSOX.css);
  const pollOptions = { timeout: 30_000, intervals: [250, 500, 1_000] };
  await expect.poll(() => sox.inputValue(), pollOptions).toMatch(/FECHAPAGOXX\d+/i);
  await expect
    .poll(() => sox.inputValue(), pollOptions)
    .toMatch(/VALORCONSIGSNRXX\d+/i);
  await expect
    .poll(() => sox.inputValue(), pollOptions)
    .toMatch(/INTERES CORRIENTE DE\s+\d+/i);

  if (honorariosExpected) {
    await expect
      .poll(() => sox.inputValue(), pollOptions)
      .toMatch(/VALORHONORARIOSXX[1-9][0-9]*/i);
  }
}

async function loadAmpliacion(page: Page, row: CsvRow, expected: CsvRow): Promise<void> {
  await retryMechanismNavigation(
    page,
    MECANISMOS.ampliacion,
    page.locator(AMPLIACION_PAG1.tab.tabpanel)
  );

  const linea = getValue(row, 'linea');
  if (nonEmpty(linea)) {
    await selectLabel(page, page.locator(AMPLIACION_PAG1.linea.css), linea);
  }

  const diasMora = getValue(row, 'dias_mora');
  if (nonEmpty(diasMora)) {
    await fillNumeric(page, AMPLIACION_PAG1.diasMora.css, diasMora);
  }

  const tipoCartera = getValue(row, 'tipo_cartera');
  if (nonEmpty(tipoCartera)) {
    await selectLabel(page, page.locator(AMPLIACION_PAG1.tipoCartera.css), tipoCartera);
  }

  const otrosCargos = getValue(row, 'otros_cargos_exigibles');
  if (nonEmpty(otrosCargos)) {
    await fillNumeric(page, AMPLIACION_PAG1.otrosCargosExigibles.css, otrosCargos);
  }

  const interesesGastos = getValue(row, 'intereses_gastos_no_facturados');
  if (nonEmpty(interesesGastos)) {
    await fillNumeric(page, AMPLIACION_PAG1.interesesGastosNoFacturados.css, interesesGastos);
  }

  const convenioPrima = getValue(row, 'convenio_prima_unica');
  if (nonEmpty(convenioPrima)) {
    await fillNumeric(page, AMPLIACION_PAG1.convenioPrimaUnica.css, convenioPrima);
  }

  const interesCorriente = getValue(row, 'interes_cte');
  if (nonEmpty(interesCorriente)) {
    await fillNumeric(page, AMPLIACION_PAG1.interesCorriente.css, interesCorriente);
  }

  const interesMora = getValue(row, 'interes_mora');
  if (nonEmpty(interesMora)) {
    await fillNumeric(page, AMPLIACION_PAG1.interesesMora.css, interesMora);
  }

  const pagoSnr = getValue(row, 'pago_snr', 'pago_al_snr');
  if (nonEmpty(pagoSnr)) {
    await fillNumeric(page, AMPLIACION_PAG1.pagoAlSNR.css, pagoSnr);
  }

  const honorarios = getValue(row, 'valorgastosGXC', 'honorarios');
  if (nonEmpty(honorarios)) {
    await fillNumeric(page, AMPLIACION_PAG1.honorarios.css, honorarios);
  }

  const fechaPago = getValue(row, 'fecha_pago');
  if (nonEmpty(fechaPago)) {
    const digits = fechaPago.replace(/\D/g, '');
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

  await page
    .locator(AMPLIACION_PAG1.tab.tabpanel)
    .locator(`${NAV.rightArrowAM}:visible`)
    .click();
  await expect(page.locator(AMPLIACION_PAG2.tab.tabpanel)).toBeVisible({ timeout: 30_000 });

  const actividadEconomica = getValue(row, 'actividad_economica');
  if (nonEmpty(actividadEconomica)) {
    await selectLabel(
      page,
      page.locator(AMPLIACION_PAG2.actividadEconomica.css),
      actividadEconomica
    );
  }

  const ocupacionIngresos = getValue(row, 'ocupa_ingresos_adicionales');
  if (nonEmpty(ocupacionIngresos)) {
    await selectLabel(
      page,
      page.locator(AMPLIACION_PAG2.ocupacionIngresosAdicionales.css),
      ocupacionIngresos
    );
  }

  const ingresoBruto = getValue(row, 'ingreso_bruto');
  if (nonEmpty(ingresoBruto)) {
    await fillNumeric(page, AMPLIACION_PAG2.ingresoBruto.css, ingresoBruto);
  }

  const ingresosAdicionales = getValue(row, 'ingresos_adicional');
  if (nonEmpty(ingresosAdicionales)) {
    await fillNumeric(page, AMPLIACION_PAG2.ingresosAdicionales.css, ingresosAdicionales);
  }

  const cuotasSinBdb = getValue(row, 'cuotas_finaz_BDB');
  if (nonEmpty(cuotasSinBdb)) {
    await fillNumeric(page, AMPLIACION_PAG2.cuotasFinancierasSinBDB.css, cuotasSinBdb);
  }

  const capitalTotal = getValue(row, 'capital_total');
  if (nonEmpty(capitalTotal)) {
    await fillNumeric(page, AMPLIACION_PAG2.capitalTotal.css, capitalTotal);
  }

  const amortizacion = getValue(row, 'amortizacion');
  if (nonEmpty(amortizacion)) {
    await selectLabel(page, page.locator(AMPLIACION_PAG2.amortizacion.css), amortizacion);
  }

  const plazoMeses = getValue(row, 'plazo_meses');
  if (nonEmpty(plazoMeses)) {
    await fillNumeric(page, AMPLIACION_PAG2.plazoMeses.css, plazoMeses);
  }

  const tasaEa = getValue(row, 'tasaEAampliacion', 'tasaint_E.A');
  if (nonEmpty(tasaEa)) {
    await fillNumeric(page, AMPLIACION_PAG2.tasaEA.css, tasaEa);
  }

  const requiereTramite = getValue(row, 'requiere_tramite');
  if (nonEmpty(requiereTramite)) {
    await selectLabel(
      page,
      page.locator(AMPLIACION_PAG2.requiereTramiteExcepcion.css),
      requiereTramite
    );
  }

  await waitForAmpliacionFields(page, expected);
  await waitForSox(page, AMPLIACION_PAG3.plantillaSOX.css);

  await page
    .locator(AMPLIACION_PAG2.tab.tabpanel)
    .locator(`${NAV.rightArrowAM2}:visible`)
    .click();
  await expect(page.locator(AMPLIACION_PAG3.tab.tabpanel)).toBeVisible({ timeout: 30_000 });
  await waitForAmpliacionSox(page, expected);
}

const comparisonFields = [
  'gxc_honorarios',
  'linea',
  'tipo_cartera',
  'diasmora',
  'abono_minimo_max',
  'maximohonorarios',
  'honorarioscomfirm',
  'max_total_baja',
  'bajacuentaIntCte',
  'bajacuentaIntMora',
  'bajacuentaIntExtra',
  'valormaximopilotos',
  'valorGXCpilotoconfirm',
  'sox',
] as const;

function isAmpliacionCase(row: CsvRow): boolean {
  return (
    getValue(row, 'id_caso').toUpperCase().startsWith('AMP_') ||
    normalizeMechanism(getValue(row, 'mecanismo')) === 'ampliacion'
  );
}

function getAmpliacionCaseIds(): string[] {
  const ids = [...negotiationRows, ...comparisonRows]
    .filter(isAmpliacionCase)
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
  if (negotiationMechanism !== 'ampliacion' || expectedMechanism !== 'ampliacion') {
    return `El caso ${caseId} debe tener mecanismo Ampliación en ambos archivos.`;
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

async function compareAmpliacion(
  page: Page,
  row: CsvRow,
  expected: CsvRow,
  testInfo: TestInfo
): Promise<void> {
  const actual: Record<string, string> = {
    gxc_honorarios: await readSelectLabel(page, AMPLIACION_PAG1.aplicaHonorarios.css),
    linea: await readSelectLabel(page, AMPLIACION_PAG1.linea.css),
    tipo_cartera: await readSelectLabel(page, AMPLIACION_PAG1.tipoCartera.css),
    diasmora: await readNumeric(page, AMPLIACION_PAG1.diasMora.css),
    abono_minimo_max: await readNumeric(page, AMPLIACION_PAG1.abonoConBajaMax.css),
    maximohonorarios: await readNumeric(page, AMPLIACION_PAG1.valorHonorariosMaximo.css),
    honorarioscomfirm: await readNumeric(page, AMPLIACION_PAG1.honorarios.css),
    max_total_baja: await readNumeric(page, AMPLIACION_PAG1.totalBajasEnCuentas.css),
    bajacuentaIntCte: await readNumeric(page, AMPLIACION_PAG1.bajaCuentaIntCte.css),
    bajacuentaIntMora: await readNumeric(page, AMPLIACION_PAG1.bajaCuentaIntMora.css),
    valormaximopilotos: await readNumeric(page, AMPLIACION_PAG1.valorHonorariosMaximo.css),
    valorGXCpilotoconfirm: await readNumeric(page, AMPLIACION_PAG1.honorarios.css),
    sox: await page.locator(AMPLIACION_PAG3.plantillaSOX.css).inputValue(),
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
          'no tiene una lectura configurada para Ampliación.'
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

  expect(comparisons.filter((comparison) => !comparison.pass), 'Diferencias de Ampliación').toEqual(
    []
  );
}

const ampliacionCases = negotiationRows.filter(isAmpliacionCase);

for (const caseId of getAmpliacionCaseIds()) {
  const row = findCase(ampliacionCases, caseId);
  const expected = findCase(comparisonRows, caseId);
  const dataError = getCaseDataError(caseId, row, expected);

  if (dataError) {
    test(`${caseId} - Ampliación - validación de datos`, () => {
      throw new Error(dataError);
    });
    continue;
  }

  test(`${caseId} - Ampliación`, async ({ page }, testInfo) => {
    await login(page);
    await loadPrincipal(page, row!);
    await loadAmpliacion(page, row!, expected!);
    await compareAmpliacion(page, row!, expected!, testInfo);
  });
}

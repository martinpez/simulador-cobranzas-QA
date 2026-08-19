import path from 'node:path';
import { expect, test } from '../fixtures/persistent-playwright';
import { findCase, readCsv } from '../utils/csv-data';
import { loadPrincipal, login } from '../utils/simulador-flow';

const dataPath = path.resolve(__dirname, '../../data/datos_negociacion.csv');
const negotiationRows = readCsv(dataPath);

test('ac_0001 - carga de obligación de control', async ({ page }) => {
  const control = findCase(negotiationRows, 'ac_0001');
  expect(control, 'Debe existir el caso ac_0001 en datos_negociacion.csv').toBeTruthy();

  await login(page);
  await loadPrincipal(page, control!);
});

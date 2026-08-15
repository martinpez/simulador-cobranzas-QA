/**
 * Selectors del Simulador DNC
 *
 * Mapeo de IDs y selectores de la aplicación.
 * Generado con Playwright MCP navegando la app real.
 *
 * NOTA: Los GUIDs son generados por Lappiz y pueden variar entre ambientes.
 *       Los IDs listados corresponden al ambiente de pruebas actual.
 *       Los datos sensibles de prueba se cargan desde .env_data.
 */

// ============================================================
// SHARED - Botones de navegación entre páginas
// ============================================================
export const NAV = {
  /** Botón en el header para volver al formulario principal */
  simuladorDNC: 'a.nav-link[name="SimiladorDNC_Lappiz_Simulador"]',
  /** Flecha izquierda (volver) dentro de un mecanismo */
  leftArrow: '.button.left-button',
  /** Flecha derecha (avanzar) dentro de un mecanismo */
  rightArrow: '.button.right-button',
  /** Flecha izquierda variantes por mecanismo */
  leftArrowM: '.left-buttonM',
  rightArrowM: '.right-buttonM',
  leftArrowM2: '.left-buttonM2',
  rightArrowM2: '.right-buttonM2',
  leftArrowAM: '.left-buttonAM',
  rightArrowAM: '.right-buttonAM',
  leftArrowAM2: '.left-buttonAM2',
  rightArrowAM2: '.right-buttonAM2',
  leftArrowAM3: '.left-buttonAM3',
  rightArrowAM3: '.right-buttonAM3',
  leftArrowCA1: '.left-buttonCA1',
  rightArrowCA1: '.right-buttonCA1',
  leftArrowCA2: '.left-buttonCA2',
  rightArrowCA2: '.right-buttonCA2',
  leftArrowCA3: '.left-buttonCA3',
  rightArrowCA3: '.right-buttonCA3',
  leftArrowC: '.left-buttonC',
  rightArrowC: '.right-buttonC',
  leftArrowC2: '.left-buttonC2',
  rightArrowC2: '.right-buttonC2',
  leftArrowC4: '.left-buttonC4',
  rightArrowC4: '.right-buttonC4',
  leftArrow2: '.left-button2',
  rightArrow2: '.right-button2',
  leftArrowInf: '.left-buttonInf',
} as const;

// ============================================================
// SHARED - Botones de selección de mecanismo
// ============================================================
export const MECANISMOS = {
  consolidacion: 'button.consolidacion',
  novacion: 'button.novaciones',
  pagoMora: 'button.pagomora',
  cancelacion: 'button.cancelacion',
  ampliacion: 'button.ampliacion',
  itau: 'button.itau',
} as const;

// ============================================================
// PRINCIPAL - Sección compartida para todos los mecanismos
// ============================================================
export const PRINCIPAL = {
  tab: {
    /** Panel de la pestaña Principal */
    tabpanel: '[role="tabpanel"][aria-labelledby="ngb-nav-0"]',
  },

  tipoDocumento: {
    label: 'Tipo documento',
    /** Select nativo con opciones: CC, CE, NIT, PAS, TI */
    id: '15fb0de1-4989-4986-a662-61fb88b3aba1',
    /** Selector CSS alternativo */
    css: 'select[id="15fb0de1-4989-4986-a662-61fb88b3aba1"]',
    /** Valor por defecto en la app */
    defaultValue: 'CC',
    options: ['CC', 'CE', 'NIT', 'PAS', 'TI'] as const,
  },

  identificacion: {
    label: 'Ingrese No Identificación:',
    /** Input nativo para CC/cédula */
    id: '75fda36b-9317-4062-93d7-26d45e6188d6',
    css: 'input[id="75fda36b-9317-4062-93d7-26d45e6188d6"]',
    /** Placeholder para buscar por */
    placeholder: 'Ingrese No Identificación:',
    /** Para Playwright: */
    getByRole: { role: 'textbox' as const, name: 'Ingrese No Identificación:' },
  },

  noObligacion: {
    label: 'No Obligación (4 últimos dígitos)',
    /** ID del select oculto detrás del Kendo dropdown */
    id: 'caae86ca-b4e0-4e59-918e-8f7a1a4d4114',
    /** Host visible del Kendo dropdown (role="listbox") */
    hostSelector:
      'span[role="listbox"][aria-owns="caae86ca-b4e0-4e59-918e-8f7a1a4d4114_listbox"]',
    listboxSelector: '#caae86ca-b4e0-4e59-918e-8f7a1a4d4114_listbox',
    css: 'select[id="caae86ca-b4e0-4e59-918e-8f7a1a4d4114"]',
    /** Texto mostrado cuando no hay selección */
    placeholderText: 'Seleccione un registro...',
    /** Para Playwright: */
    getByRole: { role: 'listbox' as const },
    /** La obligación de prueba se carga desde .env_data (CONTROL_OBLIGATION). */
  },

  nombreCliente: {
    label: 'Nombre cliente',
    id: '1ad60ed2-e515-4164-8270-54efa1e574fa',
    css: 'input[id="1ad60ed2-e515-4164-8270-54efa1e574fa"]',
    placeholder: 'Nombre cliente',
    getByRole: { role: 'textbox' as const, name: 'Nombre cliente' },
  },

  mecanismoCambiaCondiciones: {
    label: 'Mecanismo cambia condiciones?',
    id: '4eedfe97-8bf2-499c-a05f-ff25e3ca9b95',
    css: 'select[id="4eedfe97-8bf2-499c-a05f-ff25e3ca9b95"]',
    options: ['SI', 'NO'] as const,
  },

  marcaObligacion: {
    label: 'Marca obligación',
    id: '8676efb4-1857-48d2-b604-8c4e23917fd0',
    hostSelector: '[aria-owns="8676efb4-1857-48d2-b604-8c4e23917fd0_listbox"]',
    css: 'select[id="8676efb4-1857-48d2-b604-8c4e23917fd0"]',
    options: [
      { text: 'Modificado (M)', value: '6FEFD558-02A1-46ED-ADD5-4D8FC3D4C935' },
      { text: 'Perfilado (P)', value: 'B0B3210B-0605-41FF-B6BB-82FBCC29B14B' },
      { text: 'Sin Marca (N)', value: 'CA12EE0E-E4DA-4813-9FE5-DFAC6A3EA0C9' },
      { text: 'Reestructurado (R)', value: '4DBEAEFC-971D-42F5-BC11-E8F132ABD3DD' },
    ],
    defaultValue: 'Modificado (M)',
  },

  edadMora: {
    label: 'Edad Mora',
    id: '5b9ce178-27fe-4c52-b91d-ba6a898ff546',
    hostSelector: '[aria-owns="5b9ce178-27fe-4c52-b91d-ba6a898ff546_listbox"]',
    css: 'select[id="5b9ce178-27fe-4c52-b91d-ba6a898ff546"]',
    options: [
      { text: '0 - Al día', value: '2239094D-E2EA-4E94-B993-DAB8EF49F34B' },
      { text: '1-30 Días', value: '656C2945-ECAE-4B37-822E-9F27C84FB95C' },
      { text: '31-60 Días', value: '265BA9F7-2D10-49B6-8348-8B0DAF518E33' },
      { text: '61-90 Días', value: '9E05461E-03E8-4414-9036-A364B3704A40' },
      { text: '91-120 Días', value: 'A506A769-A59A-4BAE-BE21-98ADB8F60418' },
      { text: '121-150 Días', value: 'F7AE62A4-BF00-403D-B573-CD46BEC7554D' },
      { text: '151-180 Días', value: '19BD6554-B84B-4D8A-9F4F-907987A88FBC' },
      { text: '181-210 Días', value: 'C08E989D-92CD-467E-850A-3B44FD71368C' },
      { text: '>=210 Días', value: '409BB998-0B46-4B57-A29E-A60D5D199DCA' },
    ],
    defaultValue: '31-60 Días',
  },

  gestionTelefonica: {
    label: 'Gestión telefónica',
    id: '8235c54b-36bd-4880-a29e-fa021ff71595',
    css: 'select[id="8235c54b-36bd-4880-a29e-fa021ff71595"]',
    options: ['Si', 'No'] as const,
    defaultValue: 'Si',
  },

  // Campos que se ocultan al seleccionar obligación
  obligacion: {
    label: 'Obligación.',
    /** Input que se oculta tras seleccionar obligación en el dropdown */
    getByRole: { role: 'textbox' as const, name: 'Obligación.' },
  },

  cantidad: {
    label: 'Cantidad.',
    /** Spinbutton que se oculta tras seleccionar obligación */
    getByRole: { role: 'spinbutton' as const },
  },
} as const;

// ============================================================
// NOVACIÓN - Página 1
// ============================================================
export const NOVACION_PAG1 = {
  tab: {
    tabpanel: '[aria-label="Novacion Pag.1"]',
  },

  gxcHonorarios: {
    label: 'GXC / Honorarios',
    id: '7f0df958-9e6d-48ba-95e3-0b3a8bc2e0fe',
    css: 'select[id="7f0df958-9e6d-48ba-95e3-0b3a8bc2e0fe"]',
    options: ['No aplica', 'Gastos por cobranza', 'Honorarios', 'PILOTOS - Call int tabla GXC'] as const,
    defaultValue: 'Gastos por cobranza',
    disabled: true,
  },

  linea: {
    label: 'Línea N',
    id: '46155d51-2885-490a-8a71-d75a35da95b4',
    hostSelector: '[aria-owns="46155d51-2885-490a-8a71-d75a35da95b4_listbox"]',
    css: 'select[id="46155d51-2885-490a-8a71-d75a35da95b4"]',
    defaultValue: 'Credito Vivienda Directo',
  },

  tipoCartera: {
    label: 'Tipo de Cartera N',
    id: 'baa0e784-8248-45b8-9394-8932fe45094e',
    hostSelector: '[aria-owns="baa0e784-8248-45b8-9394-8932fe45094e_listbox"]',
    css: 'select[id="baa0e784-8248-45b8-9394-8932fe45094e"]',
    options: ['COMERCIAL', 'VEHICULO', 'HIPOTECARIO', 'MICROCREDITO', 'CAMPAÑA', 'CONSUMO'] as const,
    defaultValue: 'HIPOTECARIO',
  },

  saldoTotalDiferir: {
    label: 'Saldo total TC a diferir: *',
    id: '616e6102-56e5-48e9-bfc2-fce8497e629d',
    css: 'input[id="616e6102-56e5-48e9-bfc2-fce8497e629d"]',
    getByRole: { role: 'spinbutton' as const, name: '6,400,194.00' },
    defaultValue: '6,400,194.00',
  },

  diasMora: {
    label: 'Días Mora *',
    id: '0cb35f96-ddc9-40e7-b948-8f0d4d86bf79',
    css: 'input[id="0cb35f96-ddc9-40e7-b948-8f0d4d86bf79"]',
    getByRole: { role: 'spinbutton' as const, name: '57' },
    defaultValue: '57',
  },

  pagoMinimoCliente: {
    label: 'Pago mínimo del cliente *',
    id: '1f7c2b79-87a6-402f-95f2-414aea88a4bf',
    css: 'input[id="1f7c2b79-87a6-402f-95f2-414aea88a4bf"]',
    getByRole: { role: 'spinbutton' as const, name: '$154,600' },
    defaultValue: '$154,600',
  },

  abonoMinimoRequerido: {
    label: 'Abono mínimo requerido:',
    id: '4cbf2d64-0442-4c98-964f-e741a6a4e6a1',
    css: 'input[id="4cbf2d64-0442-4c98-964f-e741a6a4e6a1"]',
    disabled: true,
    defaultValue: '$7,730',
  },

  fechaPago: {
    label: 'Fecha pago: *',
    /** Date picker / combobox (DevExtreme o nativo) */
    getByRole: { role: 'combobox' as const },
    /** Botón del date picker */
    selectButton: 'button[aria-label="Select"]',
  },

  tasa: {
    label: 'Tasa *',
    id: '91d24002-ea79-468e-8375-8fee8964b2f8',
    hostSelector: '[aria-owns="91d24002-ea79-468e-8375-8fee8964b2f8_listbox"]',
    css: 'select[id="91d24002-ea79-468e-8375-8fee8964b2f8"]',
    defaultValue: 'TASA VIGENTE',
  },

  porcentajeTasaNovacion: {
    label: '%Tasa novación',
    id: 'b76668b5-0710-4eee-9718-a2633605c35e',
    css: 'input[id="b76668b5-0710-4eee-9718-a2633605c35e"]',
    getByRole: { role: 'textbox' as const, name: '%Tasa novación' },
    defaultValue: '2.13',
  },

  plazo: {
    label: 'Plazo: *',
    id: '9382c5a1-0445-4ed9-a785-850d06da2cd2',
    hostSelector: '[aria-owns="9382c5a1-0445-4ed9-a785-850d06da2cd2_listbox"]',
    css: 'select[id="9382c5a1-0445-4ed9-a785-850d06da2cd2"]',
    options: [
      { text: '6', value: '4B153AC7-6930-4A2F-8E6E-0FD57481DEC7' },
      { text: '12', value: '9BA94C96-0EA6-441D-929D-38B8B7AD8431' },
      { text: '24', value: 'A7E6D6EB-FD45-45BB-AE8C-B27CAAB3DBDE' },
      { text: '36', value: '51CE5144-3C68-4FF1-A402-C005B74CDC27' },
      { text: '48', value: '99B2CA9F-3BDC-4B33-BA16-DFE052F37E14' },
      { text: '60', value: 'EDDC1820-D954-439E-9E7E-E5B4439F5C3E' },
      { text: '72', value: 'BF8AE0A0-10CC-48BA-8A90-F594EDFA7CBD' },
    ],
    defaultValue: 'Seleccione un registro...',
  },

  tasaGXC: {
    label: 'Tasa GXC %',
    id: '435298fd-5cda-4327-9e83-079eda46f0a9',
    css: 'input[id="435298fd-5cda-4327-9e83-079eda46f0a9"]',
    getByRole: { role: 'spinbutton' as const, name: '10.71' },
    defaultValue: '10.71',
  },

  gastosGXC: {
    label: 'Gastos GXC',
    id: '3300e7e1-8d86-47d1-b709-2aa4773ec615',
    css: 'input[id="3300e7e1-8d86-47d1-b709-2aa4773ec615"]',
    disabled: true,
    defaultValue: '$15,729',
  },

  interesCorriente: {
    label: 'Interes Corriente Novacion',
    id: 'e2c2ca76-e568-413d-8aac-b7bd2c3b9f52',
    css: 'input[id="e2c2ca76-e568-413d-8aac-b7bd2c3b9f52"]',
    getByRole: { role: 'spinbutton' as const, name: '$79,788' },
    defaultValue: '$79,788',
  },

  interesExtracontable: {
    label: 'Interes Extracontable Novacion',
    id: 'a710006e-72a9-4388-84ed-cc3b743ef45f',
    css: 'input[id="a710006e-72a9-4388-84ed-cc3b743ef45f"]',
    getByRole: { role: 'spinbutton' as const, name: '$0' },
    defaultValue: '$0',
  },

  otrosCargosExigibles: {
    label: 'Otros Cargos Exigibles Novacion',
    id: '51440ec8-1f3c-49fa-8672-15870130cb90',
    css: 'input[id="51440ec8-1f3c-49fa-8672-15870130cb90"]',
    getByRole: { role: 'spinbutton' as const, name: '$3,990' },
    defaultValue: '$3,990',
  },

  interesesMora: {
    label: 'Intereses Mora Novacion',
    id: 'ce31f456-c5d9-4476-a56f-f5f44d2c8827',
    css: 'input[id="ce31f456-c5d9-4476-a56f-f5f44d2c8827"]',
    getByRole: { role: 'spinbutton' as const, name: '$956' },
    defaultValue: '$956',
  },

  cuotaProyectada: {
    label: 'Cuota proyectada:',
    id: 'd157fb29-fd6f-450b-b637-8fa18c824cd2',
    css: 'input[id="d157fb29-fd6f-450b-b637-8fa18c824cd2"]',
    disabled: true,
    defaultValue: '$136,159',
  },

  primeraFacturacion: {
    label: '1er Facturacion',
    id: 'eb81310f-a2f4-4cac-8dee-cd877f840a0f',
    css: 'input[id="eb81310f-a2f4-4cac-8dee-cd877f840a0f"]',
    disabled: true,
    defaultValue: '$166,011',
  },

  facturacion2a6: {
    label: 'Facturacion 2 a 6',
    id: '9f4dc8d9-4df5-46b4-89b5-4e9271b003eb',
    css: 'input[id="9f4dc8d9-4df5-46b4-89b5-4e9271b003eb"]',
    disabled: true,
    defaultValue: '$150,281',
  },

  saldoFinalDiferir: {
    label: 'Saldo final a diferir',
    id: 'c6923383-8eec-4efe-81a5-954ce52b8882',
    css: 'input[id="c6923383-8eec-4efe-81a5-954ce52b8882"]',
    disabled: true,
    defaultValue: '$6,392,464',
  },

  pagoGestionRecuperacion: {
    label: 'Pago para la gestión de recuperación: *',
    id: '92bcba6d-4dab-459e-bd8f-164da7eeb526',
    css: 'input[id="92bcba6d-4dab-459e-bd8f-164da7eeb526"]',
    getByRole: { role: 'spinbutton' as const, name: '22,010.00' },
    defaultValue: '22,010.00',
  },
} as const;

// ============================================================
// NOVACIÓN - Página 2
// ============================================================
export const NOVACION_PAG2 = {
  tab: {
    tabpanel: '[aria-label="Novaciones pag.2"]',
  },

  comprasAuto: {
    label: 'Compras auto:',
    id: '5822926e-f256-4631-b01f-c63de416f711',
    css: 'select[id="5822926e-f256-4631-b01f-c63de416f711"]',
    options: ['NO - 0', 'SI a 12', 'SI a 24', 'SI a 36', 'SI a 48'] as const,
    defaultValue: 'Seleccione un registro',
  },

  actividadEconomica: {
    label: 'Actividad Económica:',
    id: '13a8a1c2-3026-481b-bddb-d62c2f321d2c',
    hostSelector: '[aria-owns="13a8a1c2-3026-481b-bddb-d62c2f321d2c_listbox"]',
    css: 'select[id="13a8a1c2-3026-481b-bddb-d62c2f321d2c"]',
    options: [
      'Profesional Independiente', 'Servicios', 'No Refiere', 'Agropecuario',
      'Pensionado', 'Otras Actividades de Servicio', 'Desempleado',
      'Manufactura', 'Comerciante', 'Trasportador', 'Rentista Capital', 'Asalariado',
    ] as const,
    defaultValue: 'Seleccione un registro...',
  },

  ocupacionIngresosAdicionales: {
    label: 'Ocupación ingresos adicionales',
    id: '10d62ee5-6dc2-4452-9a91-e8acae95a3d3',
    hostSelector: '[aria-owns="10d62ee5-6dc2-4452-9a91-e8acae95a3d3_listbox"]',
    css: 'select[id="10d62ee5-6dc2-4452-9a91-e8acae95a3d3"]',
    defaultValue: 'Seleccione un registro...',
  },

  ingresoBruto: {
    label: 'Ingreso Bruto:',
    id: 'e1b74a38-af43-4dbe-ae4e-8430eda34573',
    css: 'input[id="e1b74a38-af43-4dbe-ae4e-8430eda34573"]',
    getByRole: { role: 'spinbutton' as const, name: '$0' },
    defaultValue: '$0',
  },

  ingresosAdicionales: {
    label: 'Ingresos adicionales:',
    id: '3f181299-b8fb-437e-aaa1-e21af8c747d1',
    css: 'input[id="3f181299-b8fb-437e-aaa1-e21af8c747d1"]',
    getByRole: { role: 'spinbutton' as const, name: '$0' },
    defaultValue: '$0',
  },

  requiereTramiteExcepcion: {
    label: 'Requiere tramite excepcion:',
    id: '9f53f77e-2ed6-48f2-a6f9-87552428a4db',
    css: 'select[id="9f53f77e-2ed6-48f2-a6f9-87552428a4db"]',
    options: ['Si', 'No'] as const,
    defaultValue: 'Seleccione un registro',
  },

  codigoExcepcion: {
    label: 'Código excepción:',
    id: 'e1c2af3d-be0b-45ea-b91c-9add93cbf7f9',
    css: 'select[id="e1c2af3d-be0b-45ea-b91c-9add93cbf7f9"]',
    options: ['DPT', 'M_210', 'P_M', 'PICP', 'SP'] as const,
    defaultValue: 'Seleccione un registro',
  },

  cuotasFinancierasMensuales: {
    label: 'Cuotas Financieras Mensuales sin la de BDB N',
    id: '6bf36825-81e3-4383-8f78-ae13c7c394c6',
    css: 'input[id="6bf36825-81e3-4383-8f78-ae13c7c394c6"]',
    getByRole: { role: 'spinbutton' as const, name: '0' },
    defaultValue: '0',
  },

  observaciones: {
    label: 'Observaciones',
    /** GUID del textarea de observaciones de Novación */
    id: '637cda5e-a8da-499a-98be-564521dd6c25',
    css: 'textarea[id="637cda5e-a8da-499a-98be-564521dd6c25"]',
    getByRole: { role: 'textbox' as const, name: 'Observaciones' },
  },

  plantillaSOX: {
    label: 'Plantilla SOX',
    /** GUID del textarea SOX de Novación */
    id: '07b4e087-95c8-4867-b91f-1f9e9a4a1ea0',
    css: 'textarea[id="07b4e087-95c8-4867-b91f-1f9e9a4a1ea0"]',
    getByRole: { role: 'textbox' as const, name: 'Plantilla SOX' },
  },

  copiarButton: {
    text: 'Copiar',
    css: 'button.copiar',
  },
} as const;

// ============================================================
// PAGO MORA - Página 1
// ============================================================
export const PAGO_MORA_PAG1 = {
  tab: {
    tabpanel: '[aria-label="Mora pag1."]',
  },

  aplicaHonorarios: {
    label: 'Aplica Honorarios ?',
    id: 'e321eed7-845b-46e4-89f8-0bdf0c53e0e4',
    css: 'select[id="e321eed7-845b-46e4-89f8-0bdf0c53e0e4"]',
    options: ['No aplica', 'Honorarios', 'Piloto-GXC'] as const,
    defaultValue: 'No aplica',
    disabled: true,
  },

  esUnaTC: {
    label: 'ES UNA "TC"?*',
    id: '7a5c89e8-a431-4b76-b3bc-24f6a187978c',
    css: 'select[id="7a5c89e8-a431-4b76-b3bc-24f6a187978c"]',
    options: ['Si', 'No'] as const,
    defaultValue: 'No',
  },

  pagoMinimo: {
    label: 'Pago mínimo *',
    id: 'af9911f8-4a06-4483-b25d-6bec9e1647fe',
    css: 'input[id="af9911f8-4a06-4483-b25d-6bec9e1647fe"]',
    getByRole: { role: 'spinbutton' as const, name: '$154,600' },
    defaultValue: '$154,600',
  },

  interesCorriente: {
    label: 'Interés Corriente *',
    id: '9b3ac68c-68ff-4928-864d-906e9d851621',
    css: 'input[id="9b3ac68c-68ff-4928-864d-906e9d851621"]',
    getByRole: { role: 'spinbutton' as const, name: '$79,788' },
    defaultValue: '$79,788',
  },

  maxBajaCuentaIntCte: {
    label: 'Max Baja en cuenta Int Cte',
    id: '36329717-6123-40c7-b4c9-d5f447a3cac4',
    css: 'input[id="36329717-6123-40c7-b4c9-d5f447a3cac4"]',
    disabled: true,
    defaultValue: '$59,841',
  },

  bajaCuentaIntCte: {
    label: 'Baja en cuenta Int Cte',
    id: '49ed37fa-10f7-46d1-b2d3-bd4e28bef0db',
    css: 'input[id="49ed37fa-10f7-46d1-b2d3-bd4e28bef0db"]',
    disabled: true,
    defaultValue: '$173,644',
  },

  porcentajeBajaCuentaIntCte: {
    label: '%Baja en cuenta Int Cte',
    id: 'e076d650-c5d6-48b1-920b-295d431604b0',
    css: 'input[id="e076d650-c5d6-48b1-920b-295d431604b0"]',
    disabled: true,
    defaultValue: '217.63',
  },

  interesMora: {
    label: 'Interés Mora *',
    id: 'c13b3910-1960-422f-835d-7ea89982f8b6',
    css: 'input[id="c13b3910-1960-422f-835d-7ea89982f8b6"]',
    getByRole: { role: 'spinbutton' as const, name: '$956' },
    defaultValue: '$956',
  },

  maxBajaCuentaIntMora: {
    label: 'Max Baja en cuenta Int Mora',
    id: '24a29872-6b5f-40fd-bae7-cb072e972ff5',
    css: 'input[id="24a29872-6b5f-40fd-bae7-cb072e972ff5"]',
    disabled: true,
    defaultValue: '$956',
  },

  bajaCuentaIntMora: {
    label: 'Baja en cuenta Int Mora.*',
    id: 'db8c0e77-0029-4bf9-ba9a-ebc141721c33',
    css: 'input[id="db8c0e77-0029-4bf9-ba9a-ebc141721c33"]',
    disabled: true,
    defaultValue: '$956',
  },

  porcentajeBajaCuentaIntMora: {
    label: '%Baja en cuenta Int Mora',
    id: '64fcdf9f-c6b3-4742-b4b2-e259759290d9',
    css: 'input[id="64fcdf9f-c6b3-4742-b4b2-e259759290d9"]',
    disabled: true,
    defaultValue: '100',
  },

  intExtracontablesTC: {
    label: 'Int Extracontables TC *',
    id: 'aef7fd98-0a00-4ec8-95d9-37840df1fe67',
    css: 'input[id="aef7fd98-0a00-4ec8-95d9-37840df1fe67"]',
    disabled: true,
    defaultValue: '$0',
  },

  maxBajaCuentaExtraCTC: {
    label: 'Max Baja en cuenta ExtraC TC',
    id: 'de744073-f3bd-4c05-ac6f-9ca493664262',
    css: 'input[id="de744073-f3bd-4c05-ac6f-9ca493664262"]',
    disabled: true,
    defaultValue: '$0',
  },

  descIntExtraCTC: {
    label: 'Desc Int ExtraC TC.',
    id: 'a01eeadb-b99e-4e08-9d93-3fe44b9e1cf8',
    css: 'input[id="a01eeadb-b99e-4e08-9d93-3fe44b9e1cf8"]',
    disabled: true,
    defaultValue: '$0',
  },

  porcentajeBajaCuentaExtraCTC: {
    label: '%Baja en cuenta Int ExtraC TC',
    id: '0456eeb3-8809-48a5-8726-87e416efdcb3',
    css: 'input[id="0456eeb3-8809-48a5-8726-87e416efdcb3"]',
    disabled: true,
    defaultValue: '0',
  },

  maxTotalBajaCuenta: {
    label: 'MAX Total Baja en cuenta',
    id: '6cfd4b2c-6ef4-4821-95d5-364657fda787',
    css: 'input[id="6cfd4b2c-6ef4-4821-95d5-364657fda787"]',
    disabled: true,
    defaultValue: '$60,797',
  },

  abonoMinimoMaxPermitido: {
    label: 'Abono minimo Max %Permitido',
    id: '8f7266d7-dfc0-4ff4-afad-c50fbfa67062',
    css: 'input[id="8f7266d7-dfc0-4ff4-afad-c50fbfa67062"]',
    disabled: true,
    defaultValue: '$113,803',
  },

  bajasCuentasAplicadas: {
    label: 'Bajas en cuentas Aplicadas',
    id: '6af98cad-1f96-4ad5-b33c-b0ddc8f68133',
    css: 'input[id="6af98cad-1f96-4ad5-b33c-b0ddc8f68133"]',
    disabled: true,
    defaultValue: '$174,600',
  },

  pagoAlSNR: {
    label: 'Pago al SNR *',
    id: '3539dba8-0c22-491e-a05b-84642d675d59',
    css: 'input[id="3539dba8-0c22-491e-a05b-84642d675d59"]',
    getByRole: { role: 'spinbutton' as const, name: '$0' },
    defaultValue: '$0',
  },
} as const;

// ============================================================
// PAGO MORA - Página 2
// ============================================================
export const PAGO_MORA_PAG2 = {
  tab: {
    tabpanel: '[aria-label="Mora pag2"]',
  },

  cuotaVencida: {
    label: 'Cuota Vencida *',
    id: 'fc42583f-067a-4bd6-9985-2962d447ad0f',
    css: 'select[id="fc42583f-067a-4bd6-9985-2962d447ad0f"]',
    options: ['Si', 'No'] as const,
    defaultValue: 'Seleccione un registro',
  },

  fechaPago: {
    label: 'Fecha Pago *',
    getByRole: { role: 'combobox' as const },
    selectButton: 'button[aria-label="Select"]',
  },

  requiereTramiteExcepcion: {
    label: 'Requiere Tramite Excepción *',
    id: 'd3b8782c-c94a-4b7a-a2aa-00baba7bfbd5',
    css: 'select[id="d3b8782c-c94a-4b7a-a2aa-00baba7bfbd5"]',
    options: ['Si', 'No'] as const,
    defaultValue: 'Seleccione un registro',
  },

  observaciones: {
    label: 'Observaciones',
    /** GUID del textarea de observaciones de Pago Mora */
    id: '96c93177-4705-4bd2-ac50-e304c007afa3',
    css: 'textarea[id="96c93177-4705-4bd2-ac50-e304c007afa3"]',
    getByRole: { role: 'textbox' as const, name: 'Observaciones' },
  },

  sox: {
    label: 'SOX',
    /** GUID del textarea SOX de Pago Mora */
    id: 'b24357e4-d1be-443d-8fa0-5b8790a1c508',
    css: 'textarea[id="b24357e4-d1be-443d-8fa0-5b8790a1c508"]',
    getByRole: { role: 'textbox' as const, name: 'SOX' },
  },

  copiarButton: {
    text: 'Copiar',
    css: 'button.copiarM',
  },
} as const;

// ============================================================
// CANCELACIÓN TOTAL - Página 1
// ============================================================
export const CANCELACION_PAG1 = {
  tab: { tabpanel: '[role="tabpanel"][aria-labelledby="ngb-nav-38"]' },

  aplicaHonorarios: {
    label: 'Aplica Honorarios ?',
    id: 'bda37ca7-d503-4d41-8ff4-aebde2cb7c30',
    css: 'select[id="bda37ca7-d503-4d41-8ff4-aebde2cb7c30"]',
    disabled: true,
  },
  pagoMinimo: {
    label: 'Pago minimo:',
    id: 'aa665762-9b2f-47f8-8d8c-cabca1924771',
    css: 'input[id="aa665762-9b2f-47f8-8d8c-cabca1924771"]',
  },
  linea: {
    label: 'Línea',
    id: '8e8d6cf2-299c-4b45-8059-64cf50b2bd11',
    hostSelector: '[aria-owns="8e8d6cf2-299c-4b45-8059-64cf50b2bd11_listbox"]',
    css: 'select[id="8e8d6cf2-299c-4b45-8059-64cf50b2bd11"]',
  },
  diasMora: {
    label: 'Días Mora*',
    id: '27cfef98-5ca4-415e-8149-7149479d487a',
    css: 'input[id="27cfef98-5ca4-415e-8149-7149479d487a"]',
  },
  tipoCartera: {
    label: 'Tipo de Cartera',
    id: 'dfe46e30-5328-485e-bc80-bec20aab2d02',
    hostSelector: '[aria-owns="dfe46e30-5328-485e-bc80-bec20aab2d02_listbox"]',
    css: 'select[id="dfe46e30-5328-485e-bc80-bec20aab2d02"]',
  },
  esUnaTC: {
    label: 'ES UNA "TC"? *',
    id: '876c30bc-ba27-4ec4-ad2e-1635b23cdccb',
    css: 'select[id="876c30bc-ba27-4ec4-ad2e-1635b23cdccb"]',
  },
  saldoTotal: {
    label: 'Saldo Total *',
    id: 'f47f1a89-6743-4f60-9cf6-0696e6c841ca',
    css: 'input[id="f47f1a89-6743-4f60-9cf6-0696e6c841ca"]',
  },
  interesCorriente: {
    label: 'Int corrientes *',
    id: '48f8260e-5e81-43d3-b69c-d94808cb229e',
    css: 'input[id="48f8260e-5e81-43d3-b69c-d94808cb229e"]',
  },
  maxBajaCuentaIntCte: {
    label: 'Max Baja en cuenta Int Cte',
    id: '1c23cf01-dd67-4c9a-a4b6-871c781eec02',
    css: 'input[id="1c23cf01-dd67-4c9a-a4b6-871c781eec02"]',
    disabled: true,
  },
  bajaCuentaIntCte: {
    label: 'Baja en cuenta Int Cte Cancelación',
    id: '86f86bd7-d119-4d2a-a6c0-e711b1d835a6',
    css: 'input[id="86f86bd7-d119-4d2a-a6c0-e711b1d835a6"]',
    disabled: true,
  },
  porcentajeBajaCuentaIntCte: {
    label: '%Baja en cuenta Int Cte',
    id: 'bcfd54b6-d1cf-40dc-8677-686652eedbb8',
    css: 'input[id="bcfd54b6-d1cf-40dc-8677-686652eedbb8"]',
    disabled: true,
  },
  interesMora: {
    label: 'Interés en Mora *',
    id: 'd85c85c3-2a7c-44db-b240-2420990d7375',
    css: 'input[id="d85c85c3-2a7c-44db-b240-2420990d7375"]',
  },
  maxBajaCuentaIntMora: {
    label: 'Max Baja en cuenta Int Mora',
    id: '0c422603-5f6e-4c23-a7b5-b78cf30ba1d8',
    css: 'input[id="0c422603-5f6e-4c23-a7b5-b78cf30ba1d8"]',
    disabled: true,
  },
  bajaCuentaIntMora: {
    label: 'Baja en cuenta Int Mora',
    id: 'a6ee4c8b-a6c5-4bd8-8c30-9e29b9c40115',
    css: 'input[id="a6ee4c8b-a6c5-4bd8-8c30-9e29b9c40115"]',
    disabled: true,
  },
  porcentajeBajaCuentaIntMora: {
    label: '% Baja en cuenta Int Mora',
    id: '433ffa22-78e7-4004-be47-2b0ccf497ad1',
    css: 'input[id="433ffa22-78e7-4004-be47-2b0ccf497ad1"]',
    disabled: true,
  },
  interesExtracontablesTC: {
    label: 'Interés ExtraContables TC cancelación',
    id: 'a9977387-4683-4d89-9e58-851cb72f9886',
    css: 'input[id="a9977387-4683-4d89-9e58-851cb72f9886"]',
    disabled: true,
  },
  maxBajaCuentaIntExtracTC: {
    label: 'Max Baja en cuenta Int Extrac "TC"',
    id: '6e01ec4d-1391-4878-8886-be49eef96d27',
    css: 'input[id="6e01ec4d-1391-4878-8886-be49eef96d27"]',
    disabled: true,
  },
  bajaCuentaIntExtracTC: {
    label: 'Baja en cuenta Int Extrac "TC"',
    id: '8ea64929-53a9-41b4-a01f-a14b74293d01',
    css: 'input[id="8ea64929-53a9-41b4-a01f-a14b74293d01"]',
    disabled: true,
  },
  porcentajeBajaCuentaIntExtracTC: {
    label: '% Dcsc Int Extrac "TC"',
    id: 'a724067d-e7bf-435c-94ac-bf44f72575e7',
    css: 'input[id="a724067d-e7bf-435c-94ac-bf44f72575e7"]',
    disabled: true,
  },
  capitalTotal: {
    label: 'Capital Total *',
    id: '9dc154b0-5d64-4682-a76d-5e946415c253',
    css: 'input[id="9dc154b0-5d64-4682-a76d-5e946415c253"]',
  },
  maxBajaCuentaCapital: {
    label: 'Max Baja en cuenta Capital',
    id: '79b6141f-1973-4c00-b0ae-a26b657115e5',
    css: 'input[id="79b6141f-1973-4c00-b0ae-a26b657115e5"]',
    disabled: true,
  },
  bajaCuentaCapital: {
    label: 'Baja en cuenta Capital *',
    id: '60bebeab-d3ca-4547-9eff-00cc8db69b82',
    css: 'input[id="60bebeab-d3ca-4547-9eff-00cc8db69b82"]',
    disabled: true,
  },
  porcentajeBajaCuentaCapital: {
    label: '% Baja en cuenta Capital',
    id: 'aa7aeaf3-6bc8-4939-9896-212d5efcd93e',
    css: 'input[id="aa7aeaf3-6bc8-4939-9896-212d5efcd93e"]',
    disabled: true,
  },
  maxBajaEnCuentas: {
    label: 'Max Baja en cuentas *',
    id: '7a94fe37-1d84-4232-9298-4e1986cdead2',
    css: 'input[id="7a94fe37-1d84-4232-9298-4e1986cdead2"]',
    disabled: true,
  },
  abonoMinimoMaxPermitido: {
    label: 'Abono minimo con Max % permitido',
    id: '0864b793-256f-41f6-ab7c-5b5c18c1f51f',
    css: 'input[id="0864b793-256f-41f6-ab7c-5b5c18c1f51f"]',
    disabled: true,
  },
  bajasCuentasAplicadas: {
    label: 'Bajas en cuentas Aplicadas',
    id: '7ed52d26-15c9-4f11-9177-55a380d1427d',
    css: 'input[id="7ed52d26-15c9-4f11-9177-55a380d1427d"]',
    disabled: true,
  },
  pagoAlSNR: {
    label: 'Pago al SNR',
    id: 'b5c33a6d-9d65-4920-8a39-e73621b7daa9',
    css: 'input[id="b5c33a6d-9d65-4920-8a39-e73621b7daa9"]',
  },
  valorHonorariosMaximo: {
    label: 'Valor Honorarios Maximo',
    id: '9ee8ee24-5ae5-42da-83c5-36948592e72b',
    css: 'input[id="9ee8ee24-5ae5-42da-83c5-36948592e72b"]',
    disabled: true,
  },
  honorarios: {
    label: 'Honorarios',
    id: 'a0a2b9b0-17cc-41fe-be98-2ac2157e33ef',
    css: 'input[id="a0a2b9b0-17cc-41fe-be98-2ac2157e33ef"]',
  },
  requiereTramite: {
    label: 'Requiere trámite *',
    id: 'e99362f1-b8da-4cca-8982-c8af8dcb5caf',
    css: 'select[id="e99362f1-b8da-4cca-8982-c8af8dcb5caf"]',
  },
  fechaPago: {
    label: 'Fecha de pago Cancelación *',
    getByRole: { role: 'combobox' as const },
    selectButton: 'button[aria-label="Select"]',
  },
} as const;

// ============================================================
// CANCELACIÓN TOTAL - Página 2
// ============================================================
export const CANCELACION_PAG2 = {
  tab: { tabpanel: '[role="tabpanel"][aria-labelledby="ngb-nav-39"]' },
  observaciones: {
    label: 'Observaciones de cancelación',
    id: '24e68f6c-b401-40d9-bb2d-ec6d246426f9',
    css: 'textarea[id="24e68f6c-b401-40d9-bb2d-ec6d246426f9"]',
    getByRole: { role: 'textbox' as const, name: 'Observaciones de cancelación' },
  },
  plantillaSOX: {
    label: 'Plantilla SOX',
    id: 'd4f89a7c-0207-4756-9bd7-e2e669ac3ce0',
    css: 'textarea[id="d4f89a7c-0207-4756-9bd7-e2e669ac3ce0"]',
    getByRole: { role: 'textbox' as const, name: 'Plantilla SOX' },
  },
  copiarButton: { text: 'Copiar', css: 'button.copiarCA' },
} as const;

// ============================================================
// AMPLIACIÓN DE PLAZO - Página 1
// ============================================================
export const AMPLIACION_PAG1 = {
  tab: { tabpanel: '[role="tabpanel"][aria-label="Ampliacion pag 1"]' },
  aplicaHonorarios: {
    label: 'Aplica Honorarios ?',
    id: '020563ab-b407-433b-bcf3-c534456818f3',
    css: 'select[id="020563ab-b407-433b-bcf3-c534456818f3"]',
  },
  linea: {
    label: 'Línea',
    id: '8e1dc11f-e65c-4141-a1d5-42850fd9b214',
    hostSelector: '[aria-owns="8e1dc11f-e65c-4141-a1d5-42850fd9b214_listbox"]',
    css: 'select[id="8e1dc11f-e65c-4141-a1d5-42850fd9b214"]',
  },
  diasMora: {
    label: 'Días Mora*',
    id: '7ba8643d-9438-4ade-bb3f-bab7948e2cbf',
    css: 'input[id="7ba8643d-9438-4ade-bb3f-bab7948e2cbf"]',
  },
  tipoCartera: {
    label: 'Tipo de Cartera',
    id: '93f08e21-47c5-48ee-8acc-b093afe84a38',
    hostSelector: '[aria-owns="93f08e21-47c5-48ee-8acc-b093afe84a38_listbox"]',
    css: 'select[id="93f08e21-47c5-48ee-8acc-b093afe84a38"]',
  },
  otrosCargosExigibles: {
    label: 'Otros Cargos Exigibles *',
    id: 'e64cbac2-f6de-49eb-a9ec-79695d0e655a',
    css: 'input[id="e64cbac2-f6de-49eb-a9ec-79695d0e655a"]',
  },
  interesesGastosNoFacturados: {
    label: 'Int y Gastos NO Facturados *',
    id: 'c54e9fde-a861-4446-ab8e-37b4473d231b',
    css: 'input[id="c54e9fde-a861-4446-ab8e-37b4473d231b"]',
  },
  convenioPrimaUnica: {
    label: 'Convenio Prima Unica',
    id: '5954a70c-f39c-4356-bbcf-385a73d11e6a',
    css: 'input[id="5954a70c-f39c-4356-bbcf-385a73d11e6a"]',
  },
  interesCorriente: {
    label: 'Interés Corriente *',
    id: '70101be7-9330-44e4-913c-e6772c5b8167',
    css: 'input[id="70101be7-9330-44e4-913c-e6772c5b8167"]',
  },
  porcentajeBajaCuentaIntCte: {
    label: '%Baja en cuenta Int Cte',
    id: 'd8e6669a-3079-4248-88d5-5f01cca53106',
    css: 'input[id="d8e6669a-3079-4248-88d5-5f01cca53106"]',
    disabled: true,
  },
  bajaCuentaIntCte: {
    label: 'Baja en cuenta Int Cte',
    id: '15a75d66-7dc0-4e25-b3e3-213a984a22fe',
    css: 'input[id="15a75d66-7dc0-4e25-b3e3-213a984a22fe"]',
    disabled: true,
  },
  interesesMora: {
    label: 'Intereses en Mora *',
    id: 'aea118a4-8a99-4d3a-adf9-ffd5151db4f6',
    css: 'input[id="aea118a4-8a99-4d3a-adf9-ffd5151db4f6"]',
  },
  porcentajeBajaCuentaIntMora: {
    label: '% Baja en cuenta Int Mora',
    id: '4f9627f2-7ada-415b-bf0c-cf308407c82a',
    css: 'input[id="4f9627f2-7ada-415b-bf0c-cf308407c82a"]',
    disabled: true,
  },
  bajaCuentaIntMora: {
    label: 'Baja en cuenta Int Mora',
    id: 'e4b7cc87-de9e-4fa1-9d65-d9595ed2cca2',
    css: 'input[id="e4b7cc87-de9e-4fa1-9d65-d9595ed2cca2"]',
    disabled: true,
  },
  totalBajasEnCuentas: {
    label: 'Total Bajas en cuentas',
    id: '312df4ed-17a6-4e38-899a-e075171f9d84',
    css: 'input[id="312df4ed-17a6-4e38-899a-e075171f9d84"]',
    disabled: true,
  },
  abonoMinSinBaja: {
    label: 'Abono Min sin Baja en cuenta',
    id: '3a14031a-7edd-4540-8e52-e199892cba9a',
    css: 'input[id="3a14031a-7edd-4540-8e52-e199892cba9a"]',
    disabled: true,
  },
  abonoConBajaMax: {
    label: 'Abono con Baja en cuenta Max',
    id: '9b88d521-a3dd-4948-8c3f-6dece97a17a5',
    css: 'input[id="9b88d521-a3dd-4948-8c3f-6dece97a17a5"]',
    disabled: true,
  },
  pagoAlSNR: {
    label: 'Pago al SNR *',
    id: '44770cdb-4d75-4b2a-957f-400410e65e8d',
    css: 'input[id="44770cdb-4d75-4b2a-957f-400410e65e8d"]',
  },
  valorHonorariosMaximo: {
    label: 'Valor Honorarios Maximo',
    id: 'd647e41b-7a50-46b0-ba5f-e30eeb44b463',
    css: 'input[id="d647e41b-7a50-46b0-ba5f-e30eeb44b463"]',
    disabled: true,
  },
  honorarios: {
    label: 'Honorarios *',
    id: 'e2a45a6f-d7e5-40ea-813f-cdbee2c58c4b',
    css: 'input[id="e2a45a6f-d7e5-40ea-813f-cdbee2c58c4b"]',
  },
  fechaPago: {
    label: 'Fecha Pago *',
    getByRole: { role: 'combobox' as const },
    selectButton: 'button[aria-label="Select"]',
  },
} as const;

// ============================================================
// AMPLIACIÓN DE PLAZO - Página 2
// ============================================================
export const AMPLIACION_PAG2 = {
  tab: { tabpanel: '[role="tabpanel"][aria-label="Ampliacion pag 2"]' },
  actividadEconomica: {
    label: 'Actividad Economica',
    id: '51550b53-1a9f-49cd-8274-abd718d04b51',
    hostSelector: '[aria-owns="51550b53-1a9f-49cd-8274-abd718d04b51_listbox"]',
    css: 'select[id="51550b53-1a9f-49cd-8274-abd718d04b51"]',
  },
  ingresoBruto: {
    label: 'Ingreso Bruto',
    id: 'f51fe08e-3b3b-4064-9ae0-fb9584fd93b3',
    css: 'input[id="f51fe08e-3b3b-4064-9ae0-fb9584fd93b3"]',
  },
  ocupacionIngresosAdicionales: {
    label: 'Ocupacion Ing. Adicionales',
    id: '3a3c6541-bfed-459a-9a8d-608eebb2ad63',
    hostSelector: '[aria-owns="3a3c6541-bfed-459a-9a8d-608eebb2ad63_listbox"]',
    css: 'select[id="3a3c6541-bfed-459a-9a8d-608eebb2ad63"]',
  },
  ingresosAdicionales: {
    label: 'Ingreso Adicionales',
    id: 'ee3c91d9-9f6c-4ea5-bd31-047686ce4c76',
    css: 'input[id="ee3c91d9-9f6c-4ea5-bd31-047686ce4c76"]',
  },
  cuotasFinancierasSinBDB: {
    label: 'Cuotas Financieras sin BdB',
    id: 'e637400b-996d-45b2-bccd-a360dcbc6fa7',
    css: 'input[id="e637400b-996d-45b2-bccd-a360dcbc6fa7"]',
  },
  capitalTotal: {
    label: 'Capital Total *',
    id: '12671e00-a829-472f-b644-be49ea7ebdbf',
    css: 'input[id="12671e00-a829-472f-b644-be49ea7ebdbf"]',
  },
  amortizacion: {
    label: 'Amortización *',
    id: 'dedcc32e-8f76-4a0a-b676-dcb0b3aa9b44',
    css: 'select[id="dedcc32e-8f76-4a0a-b676-dcb0b3aa9b44"]',
  },
  plazoMeses: {
    label: 'Plazo en Meses *',
    id: 'f43686aa-8f4e-4203-9733-b483660e6ab1',
    css: 'input[id="f43686aa-8f4e-4203-9733-b483660e6ab1"]',
  },
  tipoTasa: {
    label: 'Tipo Tasa Ampliacion',
    id: '6b210c35-666b-47fa-bdff-66ffbc355c5f',
    css: 'input[id="6b210c35-666b-47fa-bdff-66ffbc355c5f"]',
    disabled: true,
  },
  tasaEA: {
    label: 'Tasa EA Ampliacion *',
    id: '1540984f-2b52-4a6f-8b34-01236dfd291c',
    css: 'input[id="1540984f-2b52-4a6f-8b34-01236dfd291c"]',
  },
  cuotaProyectada: {
    label: 'Cuota Proyectada + seguro + papeleria + iva',
    id: '2edec98b-a7b5-49a8-8cae-623f05fe0cd5',
    css: 'input[id="2edec98b-a7b5-49a8-8cae-623f05fe0cd5"]',
    disabled: true,
  },
  requiereTramiteExcepcion: {
    label: 'Requiere Tramite Excepcion *',
    id: '13719b60-17be-4c9f-a190-d6fe27ab12f6',
    css: 'select[id="13719b60-17be-4c9f-a190-d6fe27ab12f6"]',
  },
} as const;

// ============================================================
// AMPLIACIÓN DE PLAZO - Página 3
// ============================================================
export const AMPLIACION_PAG3 = {
  tab: { tabpanel: '[role="tabpanel"][aria-label="Ampliacion pag 3"]' },
  observaciones: {
    label: 'Observaciones',
    id: '68d8ce24-c9fd-440b-995a-7ff027f628b6',
    css: 'textarea[id="68d8ce24-c9fd-440b-995a-7ff027f628b6"]',
    getByRole: { role: 'textbox' as const, name: 'Observaciones' },
  },
  plantillaSOX: {
    label: 'Plantilla SOX',
    id: 'eec3136d-46bf-438c-b7cc-4aaa5fba776b',
    css: 'textarea[id="eec3136d-46bf-438c-b7cc-4aaa5fba776b"]',
    getByRole: { role: 'textbox' as const, name: 'Plantilla SOX' },
  },
  copiarButton: { text: 'Copiar', css: 'button.copiar4' },
} as const;

// ============================================================
// CONSOLIDACIÓN DE PRODUCTOS - Página 1
// ============================================================
export const CONSOLIDACION_PAG1 = {
  tab: { tabpanel: '[role="tabpanel"][aria-labelledby="ngb-nav-14"]' },

  /** Contenedor de tarjetas; su cantidad depende de las obligaciones del cliente. */
  cards: {
    container: '#consolidacion .card1',
    byObligation: (obligation: string) =>
      `#consolidacion .card1:has(h3:has-text("Obligación: ${obligation}"))`,
    heading: (obligation: string) =>
      `#consolidacion .card1:has(h3:has-text("Obligación: ${obligation}")) > h3`,
    toggle: (obligation: string) =>
      `#consolidacion .card1:has(h3:has-text("Obligación: ${obligation}")) input[type="checkbox"]`,
    toggleLabel: (obligation: string) =>
      `#consolidacion .card1:has(h3:has-text("Obligación: ${obligation}")) .toggle-switch label`,
    field: (obligation: string, dataLabel: string) =>
      `#consolidacion .card1:has(h3:has-text("Obligación: ${obligation}")) [data-label='${dataLabel}']`,
    marcaObligacion: (obligation: string) =>
      `#consolidacion .card1:has(h3:has-text("Obligación: ${obligation}")) select.marca-obligacion`,
  },

  /** Caso usado durante el levantamiento: solo esta obligación se selecciona. */
  casoMapeo: {
    obligacionSeleccionada: '4254',
    toggle: '#toggle-4254',
    toggleLabel: 'label[for="toggle-4254"]',
    obligacionNoSeleccionada: '6588',
    toggleNoSeleccionado: '#toggle-6588',
  },

  agregarObligacion: {
    label: 'Adicionar obligación',
    id: 'adicionar-obligacion',
    css: 'button#adicionar-obligacion',
  },

  /** Campos repetidos dentro de cada tarjeta. */
  labels: {
    saldoTotal: 'Saldo Total *',
    honorarios: 'Honorarios *',
    interesCorriente: 'Interes Corriente *',
    interesMora: 'Interes Mora *',
    interesExtracontablesTC: 'Int Extracontables "TC"',
    marcaObligacion: 'Marca Obligación',
  },
} as const;

// ============================================================
// CONSOLIDACIÓN DE PRODUCTOS - Página 2
// ============================================================
export const CONSOLIDACION_PAG2 = {
  tab: { tabpanel: '[role="tabpanel"][aria-labelledby="ngb-nav-8"]' },

  totalBajaIntCorrientes: {
    label: 'Total Baja en cuenta Int Corrientes',
    id: '04dbcb19-8f74-4eac-81f3-6bcc76cd7f9a',
    css: 'input[id="04dbcb19-8f74-4eac-81f3-6bcc76cd7f9a"]',
    disabled: true,
  },
  totalBajaIntMora: {
    label: 'Total Baja en cuenta Int Mora',
    id: 'f848cad9-f94d-4e56-9468-863a2a55e402',
    css: 'input[id="f848cad9-f94d-4e56-9468-863a2a55e402"]',
    disabled: true,
  },
  totalBajaExtracontables: {
    label: 'Total Baja en cuenta Extracontables',
    id: 'dc9166ce-a5c8-4fc7-ad2b-4c6479d63f12',
    css: 'input[id="dc9166ce-a5c8-4fc7-ad2b-4c6479d63f12"]',
    disabled: true,
  },
  porcentajeBajaIntCte: {
    label: '% Baja en cuenta Int Cte',
    id: 'b42b41d8-cd57-4233-9bff-8a5ceec5af03',
    css: 'input[id="b42b41d8-cd57-4233-9bff-8a5ceec5af03"]',
    disabled: true,
  },
  porcentajeBajaIntMora: {
    label: '% Baja en cuenta Int Mora',
    id: 'e079d101-5148-42ed-854e-9be982adc01e',
    css: 'input[id="e079d101-5148-42ed-854e-9be982adc01e"]',
    disabled: true,
  },
  porcentajeBajaIntExtracTC: {
    label: '% Baja en cuenta Int Extrac "TC"',
    id: 'e970af6e-de8d-47b3-97d0-98e4950c9bdf',
    css: 'input[id="e970af6e-de8d-47b3-97d0-98e4950c9bdf"]',
    disabled: true,
  },
  totalHonorarios: {
    label: 'Total Honorarios',
    id: '4f89c370-65c2-43d8-90aa-6b3e3b29906b',
    css: 'input[id="4f89c370-65c2-43d8-90aa-6b3e3b29906b"]',
    disabled: true,
  },
  saldoTotalDesembolsar: {
    label: 'Saldo total a desembolsar',
    id: '69b7fc43-675b-4984-bd64-9fd68799a97b',
    css: 'input[id="69b7fc43-675b-4984-bd64-9fd68799a97b"]',
    disabled: true,
  },
  marcaObligacion: {
    label: 'Marca de Obligación',
    id: '183f4194-c998-41a4-9a8c-1436cc78132f',
    css: 'input[id="183f4194-c998-41a4-9a8c-1436cc78132f"]',
    disabled: true,
  },
  amortizacion: {
    label: 'Amortización *',
    id: '03011879-0560-4a41-826b-888c89f6ab83',
    css: 'select[id="03011879-0560-4a41-826b-888c89f6ab83"]',
    options: ['Mes vencido'] as const,
  },
  plazoMeses: {
    label: 'Indique el plazo en meses(max 72) *',
    id: 'aa4de771-cbaf-486d-8de2-06941dc220d5',
    css: 'input[id="aa4de771-cbaf-486d-8de2-06941dc220d5"]',
  },
  tasaEA: {
    label: 'Tasa de int E.A.%',
    id: 'c9f5317e-9099-43f1-9b7f-78b93d99aa6a',
    css: 'input[id="c9f5317e-9099-43f1-9b7f-78b93d99aa6a"]',
  },
  cuotaProyectada: {
    label: 'Cuota proyectada+Seguro+Papeleria+IVA',
    id: 'e74b2587-dccc-4395-8333-f6c2f34338aa',
    css: 'input[id="e74b2587-dccc-4395-8333-f6c2f34338aa"]',
    disabled: true,
  },
  pagoNegociacion: {
    label: 'Pago para la negociación *',
    id: '0ee03528-b018-47d1-856b-9e30dbae2ddf',
    css: 'input[id="0ee03528-b018-47d1-856b-9e30dbae2ddf"]',
  },
  fechaPago: {
    label: 'Fecha de Pago: *',
    getByRole: { role: 'combobox' as const },
    selectButton: 'button[aria-label="Select"]',
  },
  requiereTramiteExcepcion: {
    label: 'Requiere tramite de excepción *',
    id: '48dfc177-18ab-4c7c-91a9-e2a63c92dc15',
    css: 'select[id="48dfc177-18ab-4c7c-91a9-e2a63c92dc15"]',
    options: ['Si', 'No'] as const,
  },
} as const;

// ============================================================
// CONSOLIDACIÓN DE PRODUCTOS - Actividad Económica
// ============================================================
export const CONSOLIDACION_ACTIVIDAD = {
  tab: { tabpanel: '[role="tabpanel"][aria-labelledby="ngb-nav-10"]' },

  cuotasFinancierasMensuales: {
    label: 'Cuotas financieras mensuales sin la del BDB: *',
    id: 'bae90b7e-42e0-40a3-a806-9f9a6227b20e',
    css: 'input[id="bae90b7e-42e0-40a3-a806-9f9a6227b20e"]',
  },
  actividadEconomica: {
    label: 'Actividad económica *',
    id: 'c852f2a7-6f9c-48f6-96b5-6fdc26c399ef',
    hostSelector: '[aria-owns="c852f2a7-6f9c-48f6-96b5-6fdc26c399ef_listbox"]',
    css: 'select[id="c852f2a7-6f9c-48f6-96b5-6fdc26c399ef"]',
    options: [
      'Profesional Independiente', 'Servicios', 'No Refiere', 'Agropecuario',
      'Pensionado', 'Otras Actividades de Servicio', 'Desempleado',
      'Manufactura', 'Comerciante', 'Trasportador', 'Rentista Capital', 'Asalariado',
    ] as const,
  },
  ingresoBruto: {
    label: 'Ingreso bruto: *',
    id: '67631aed-75e4-4b23-8601-17cadd1c7003',
    css: 'input[id="67631aed-75e4-4b23-8601-17cadd1c7003"]',
  },
  ocupacionIngresosAdicionales: {
    label: 'Ocupación ingresos adicionales: *',
    id: 'b54af750-167e-4831-bb8c-c374e7f45202',
    hostSelector: '[aria-owns="b54af750-167e-4831-bb8c-c374e7f45202_listbox"]',
    css: 'select[id="b54af750-167e-4831-bb8c-c374e7f45202"]',
    options: [
      'Profesional Independiente', 'Servicios', 'No Refiere', 'Agropecuario',
      'Pensionado', 'Otras Actividades de Servicio', 'Desempleado',
      'Manufactura', 'Comerciante', 'Trasportador', 'Rentista Capital', 'Asalariado',
    ] as const,
  },
  ingresosAdicionales: {
    label: 'Ingresos adicionales *',
    id: '1a47c2c1-4551-4d13-89ca-82e89ce655c0',
    css: 'input[id="1a47c2c1-4551-4d13-89ca-82e89ce655c0"]',
  },
} as const;

// ============================================================
// CONSOLIDACIÓN DE PRODUCTOS - Página 4 / SOX
// ============================================================
export const CONSOLIDACION_PAG4 = {
  tab: { tabpanel: '[role="tabpanel"][aria-labelledby="ngb-nav-7"]' },
  observaciones: {
    label: 'Observaciones:',
    id: 'be70a202-71a9-40ea-851b-945702693b51',
    css: 'textarea[id="be70a202-71a9-40ea-851b-945702693b51"]',
    getByRole: { role: 'textbox' as const, name: 'Observaciones:' },
  },
  plantillaSOX: {
    label: 'Plantilla SOX',
    id: 'f3979225-f563-48a2-a206-6b5866a7dc6c',
    css: 'textarea[id="f3979225-f563-48a2-a206-6b5866a7dc6c"]',
    getByRole: { role: 'textbox' as const, name: 'Plantilla SOX' },
  },
  copiarButton: { text: 'Copiar', css: 'button.copiar2' },
} as const;

// ============================================================
// MAPA DE GUIDs SOX (para validación cruzada)
// ============================================================
export const SOX_MAP = {
  novacion: {
    observacionesId: '637cda5e-a8da-499a-98be-564521dd6c25',
    soxId: '07b4e087-95c8-4867-b91f-1f9e9a4a1ea0',
  },
  pagoMora: {
    observacionesId: '96c93177-4705-4bd2-ac50-e304c007afa3',
    soxId: 'b24357e4-d1be-443d-8fa0-5b8790a1c508',
  },
  cancelacion: {
    observacionesId: '24e68f6c-b401-40d9-bb2d-ec6d246426f9',
    soxId: 'd4f89a7c-0207-4756-9bd7-e2e669ac3ce0',
  },
  ampliacion: {
    observacionesId: '68d8ce24-c9fd-440b-995a-7ff027f628b6',
    soxId: 'eec3136d-46bf-438c-b7cc-4aaa5fba776b',
  },
  consolidacion: {
    observacionesId: 'be70a202-71a9-40ea-851b-945702693b51',
    soxId: 'f3979225-f563-48a2-a206-6b5866a7dc6c',
  },
} as const;

// ============================================================
// HELPER - Para buscar un campo por label en cualquier página
// ============================================================
/**
 * Busca un elemento visible por su label text dentro del panel activo.
 * Útil para validaciones dinámicas cuando no se conoce el ID exacto.
 *
 * @example
 * const field = findByLabel('Días Mora *');
 * await expect(page.locator(field.css)).toHaveValue('57');
 */
export function findByLabel(label: string): { css: string; getByRole?: { role: string; name?: string } } | null {
  const allSections = [
    PRINCIPAL,
    NOVACION_PAG1,
    NOVACION_PAG2,
    PAGO_MORA_PAG1,
    PAGO_MORA_PAG2,
    CANCELACION_PAG1,
    CANCELACION_PAG2,
    AMPLIACION_PAG1,
    AMPLIACION_PAG2,
    AMPLIACION_PAG3,
    CONSOLIDACION_PAG1,
    CONSOLIDACION_PAG2,
    CONSOLIDACION_ACTIVIDAD,
    CONSOLIDACION_PAG4,
  ];
  for (const section of allSections) {
    for (const [, field] of Object.entries(section)) {
      if (field && typeof field === 'object' && 'label' in field && field.label === label) {
        return field as { css: string; getByRole?: { role: string; name?: string } };
      }
    }
  }
  return null;
}

# Pruebas de Cancelación Total

[Volver al README principal](../../README.md)

## Objetivo

Verificar que una negociación de Cancelación Total cargue correctamente la obligación, permita registrar el pago definido y refleje los valores esperados para la cancelación.

## Flujo común

1. Cargar el cliente y seleccionar la obligación definida en el caso.
2. Seleccionar Cancelación Total.
3. Confirmar que la información inicial esté disponible.
4. Diligenciar el pago y las condiciones de la cancelación.
5. Avanzar por las páginas del mecanismo.
6. Validar los valores de la negociación y los campos adicionales.
7. Validar la información final y registrar evidencias.

## Escenarios

- **Caso base:** carga correcta de la obligación y cancelación con los valores esperados.
- **Negociación con variaciones:** cancelaciones parciales, cobros o pagos con valores diferentes a los del caso base.
- **Validaciones individuales:** honorarios, gastos, FUN y demás campos que apliquen.
- **Tarjetas:** confirmar el resultado esperado cuando la obligación corresponda a una tarjeta de crédito.
- **Piloto-GXC:** validar el valor GXC ingresado y el máximo de honorarios permitido.

## Validaciones implementadas

- Carga de datos de la obligación y selección de Cancelación Total.
- Diligenciamiento condicional de los valores presentes en `datos_negociacion.csv`.
- Navegación entre las dos páginas del mecanismo.
- Línea, tipo de cartera, pago mínimo, días de mora, saldos, intereses, capital, pago al SNR, honorarios, trámite y fecha de pago cuando estén definidos.
- `gxc_honorarios`, abono mínimo, bajas en cuenta, máximo total de baja y SOX contra `data_compare.csv`.
- Campos numéricos como números y campos de texto, incluido SOX, con texto normalizado.
- Evidencias de datos cargados y resultado de comparación por caso.
- En casos piloto-GXC se validan `valormaximopilotos`, `valorGXCpilotoconfirm` y `honorarioscomfirm` cuando exista el campo.

## Datos y casos

Los casos deben registrarse con el identificador del mecanismo, por ejemplo `CAN_001`. La suite se ejecuta mediante el proyecto Playwright `cancelacion`, después de que pase el proyecto `control`. La estructura general se encuentra en [Casos y datos de prueba](../casos-de-prueba.md).

Para referencias de selectores, SOX y ambiente, consultar las [consideraciones técnicas](../consideraciones-tecnicas.md).

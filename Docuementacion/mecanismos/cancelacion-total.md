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

## Validaciones

- Carga de datos de la obligación.
- Pago y valores de cancelación.
- Porcentajes, baja total, abonos y demás valores esperados.
- Honorarios, gastos y FUN cuando correspondan.
- Indicador esperado para tarjeta de crédito cuando aplique.
- Valores clave de la información SOX.

## Datos y casos

Los casos deben registrarse con el identificador del mecanismo, por ejemplo `CAN_001`. La estructura general se encuentra en [Casos y datos de prueba](../casos-de-prueba.md).

Para referencias de selectores, SOX y ambiente, consultar las [consideraciones técnicas](../consideraciones-tecnicas.md).

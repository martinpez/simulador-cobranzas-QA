# Pruebas de Pago de Mora

[Volver al README principal](../../README.md)

## Objetivo

Verificar que una negociación de Pago de Mora cargue correctamente la obligación, permita diligenciar el pago correspondiente y genere los valores esperados para el caso.

## Flujo común

1. Cargar el cliente y seleccionar la obligación definida en el caso.
2. Seleccionar Pago de Mora.
3. Confirmar que la información inicial esté disponible.
4. Diligenciar el pago SNR y los demás valores definidos.
5. Avanzar por las páginas de la negociación.
6. Validar porcentajes, pagos, abonos y valores de la negociación.
7. Validar la información final y registrar evidencias.

## Escenarios

- **Caso base:** carga correcta de la obligación y negociación con los valores esperados.
- **Negociación con variaciones:** campañas, cobros menores, cobros mayores u otros valores definidos por los asesores.
- **Validaciones individuales:** honorarios, gastos 90 y demás campos específicos que apliquen.
- **Tarjetas:** confirmar el resultado esperado cuando el caso incluya una obligación asociada a tarjeta de crédito.

## Validaciones

- Carga de datos de la obligación.
- Valor del pago SNR.
- Porcentajes de interés corriente y de mora.
- Baja total, abono y demás valores definidos en el caso.
- Campos de honorarios y gastos cuando correspondan.
- Indicador esperado para tarjeta de crédito cuando aplique.
- Valores clave de la información SOX.

## Datos y casos

Los casos deben registrarse con el identificador del mecanismo, por ejemplo `PM_001`. La estructura general se encuentra en [Casos y datos de prueba](../casos-de-prueba.md).

Para referencias de selectores, SOX y ambiente, consultar las [consideraciones técnicas](../consideraciones-tecnicas.md).

# Pruebas de Ampliación de Plazo

[Volver al README principal](../../README.md)

## Objetivo

Verificar que una negociación de Ampliación de Plazo cargue correctamente la obligación, permita modificar el plazo según el caso y calcule los valores esperados.

## Flujo común

1. Cargar el cliente y seleccionar la obligación definida en el caso.
2. Seleccionar Ampliación de Plazo.
3. Confirmar que la información inicial esté disponible.
4. Diligenciar el nuevo plazo y las condiciones definidas.
5. Avanzar por las páginas del mecanismo.
6. Validar los cálculos, porcentajes, pagos y demás valores esperados.
7. Validar la información final y registrar evidencias.

## Escenarios

- **Caso base:** carga correcta de la obligación y ampliación con las condiciones esperadas.
- **Negociación con variaciones:** diferentes plazos, tasas, pagos o condiciones definidas por los asesores.
- **Validaciones individuales:** campos y cálculos propios de la ampliación.
- **Casos excepcionales:** plazos o condiciones poco usuales con resultado previamente validado.

## Validaciones implementadas

- Carga de datos de la obligación y selección de Ampliación de Plazo.
- Diligenciamiento condicional de los valores presentes en `datos_negociacion.csv`.
- Navegación entre las tres páginas del mecanismo.
- Intereses, pagos, honorarios, fecha, actividad económica, ingresos, plazo, amortización, tasa E.A. y trámite cuando estén definidos.
- `gxc_honorarios`, línea, tipo de cartera, abono, bajas en cuenta y SOX contra `data_compare.csv`.
- Campos numéricos como números y campos de texto, incluido SOX, con texto normalizado.
- Evidencias de datos cargados y resultado de comparación por caso.

## Datos y casos

Los casos deben registrarse con el identificador del mecanismo, por ejemplo `AMP_001`. La suite se ejecuta mediante el proyecto Playwright `ampliacion`, después de que pase el proyecto `control`. La estructura general se encuentra en [Casos y datos de prueba](../casos-de-prueba.md).

Para referencias de selectores, SOX y ambiente, consultar las [consideraciones técnicas](../consideraciones-tecnicas.md).

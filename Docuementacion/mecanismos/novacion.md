# Pruebas de Novación

[Volver al README principal](../../README.md)

## Objetivo

Verificar que una negociación de Novación cargue correctamente la obligación, permita configurar las condiciones del nuevo acuerdo y produzca los valores esperados.

## Flujo común

1. Cargar el cliente y seleccionar la obligación definida en el caso.
2. Seleccionar Novación.
3. Confirmar que la información inicial esté disponible.
4. Diligenciar las condiciones de la negociación, incluido el plazo cuando aplique.
5. Avanzar por las páginas del mecanismo.
6. Validar tasas, porcentajes, pagos y demás valores definidos.
7. Validar la información final y registrar evidencias.

## Escenarios

- **Caso base:** carga correcta de la obligación y negociación con las condiciones esperadas.
- **Negociación con variaciones:** cambios de plazo, tasa, pagos u otras condiciones definidas por los asesores.
- **Validaciones individuales:** campos propios de Novación y validación de GXC cuando corresponda.
- **Casos excepcionales:** condiciones poco usuales que deban conservar un resultado previamente validado.

## Validaciones

- Carga de datos de la obligación.
- Plazo, tasa y condiciones de la nueva negociación.
- Porcentajes, pagos, abonos y demás valores esperados.
- Campos y cálculos de GXC cuando apliquen.
- Valores clave de la información SOX.

## Datos y casos

Los casos deben registrarse con el identificador del mecanismo, por ejemplo `NOV_001`. La estructura general se encuentra en [Casos y datos de prueba](../casos-de-prueba.md).

Para referencias de selectores, SOX y ambiente, consultar las [consideraciones técnicas](../consideraciones-tecnicas.md).

# Pruebas de Consolidación de Productos

[Volver al README principal](../../README.md)

## Objetivo

Verificar que una negociación de Consolidación de Productos cargue correctamente las obligaciones y productos involucrados, permita completar la negociación y refleje los valores esperados.

## Flujo común

1. Cargar el cliente y seleccionar la obligación definida en el caso.
2. Seleccionar Consolidación de Productos.
3. Confirmar que la información inicial esté disponible.
4. Seleccionar o confirmar los productos que serán consolidados.
5. Diligenciar las condiciones de la negociación.
6. Avanzar por las páginas del mecanismo.
7. Validar los cálculos, porcentajes, pagos y valores resultantes.
8. Validar la información final y registrar evidencias.

## Escenarios

- **Caso base:** carga correcta de la información y consolidación con las condiciones esperadas.
- **Negociación con variaciones:** combinaciones de productos, pagos o condiciones diferentes a las del caso base.
- **Validaciones individuales:** campos y cálculos propios de la consolidación.
- **Casos excepcionales:** combinaciones poco usuales previamente validadas por los asesores.

## Validaciones

- Carga de las obligaciones y productos.
- Selección correcta de los productos a consolidar.
- Porcentajes, pagos, abonos y demás valores esperados.
- Campos adicionales definidos para el caso.
- Valores clave de la información SOX.

## Datos y casos

Los casos deben registrarse con el identificador del mecanismo, por ejemplo `CON_001`. La estructura general se encuentra en [Casos y datos de prueba](../casos-de-prueba.md).

Para referencias de selectores, SOX y ambiente, consultar las [consideraciones técnicas](../consideraciones-tecnicas.md).

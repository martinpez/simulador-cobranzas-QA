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

## Validaciones

- Carga de datos de la obligación.
- Nuevo plazo y condiciones de la negociación.
- Tasa, porcentajes, pagos, abonos y demás valores esperados.
- Campos adicionales definidos para el caso.
- Valores clave de la información SOX.

## Datos y casos

Los casos deben registrarse con el identificador del mecanismo, por ejemplo `AMP_001`. La estructura general se encuentra en [Casos y datos de prueba](../casos-de-prueba.md).

Para referencias de selectores, SOX y ambiente, consultar las [consideraciones técnicas](../consideraciones-tecnicas.md).

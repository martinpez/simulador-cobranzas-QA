# Automatización de pruebas del Simulador de Cobranza

Este repositorio reúne la documentación y el plan de automatización de pruebas del **Simulador de Normalización de Cartera (DNC)** del Banco de Bogotá.

## Idea principal

El proyecto busca reducir las pruebas manuales repetitivas y facilitar la detección temprana de errores en las negociaciones de cartera. Para lograrlo, se ejecutarán de forma controlada casos de prueba previamente validados por los asesores y se compararán los resultados obtenidos con los resultados esperados.

La automatización seguirá el mismo proceso general que una prueba manual: cargar la información de un cliente, seleccionar un mecanismo de normalización, diligenciar la negociación, confirmar los cálculos y verificar los resultados de la operación. Cada mecanismo tendrá sus propios casos y validaciones, porque sus reglas de negocio no son iguales.

## Mecanismos incluidos

| Mecanismo | Documento |
| --- | --- |
| Pago de Mora | [Ver pruebas de Pago de Mora](Docuementacion/mecanismos/pago-de-mora.md) |
| Novación | [Ver pruebas de Novación](Docuementacion/mecanismos/novacion.md) |
| Cancelación Total | [Ver pruebas de Cancelación Total](Docuementacion/mecanismos/cancelacion-total.md) |
| Ampliación de Plazo | [Ver pruebas de Ampliación de Plazo](Docuementacion/mecanismos/ampliacion-de-plazo.md) |
| Consolidación de Productos | [Ver pruebas de Consolidación de Productos](Docuementacion/mecanismos/consolidacion-de-productos.md) |

## Qué se validará

- Que la información de la obligación y del cliente se cargue correctamente.
- Que la negociación pueda completarse de principio a fin.
- Que los valores, porcentajes, pagos y condiciones correspondan al caso esperado.
- Que los campos adicionales requeridos por cada mecanismo presenten el resultado correcto.
- Que la información final de la negociación coincida con los valores esperados.
- Que los resultados de cada ejecución queden disponibles para su revisión.

## Orden general de ejecución

La ejecución comenzará con un caso de control llamado `CONTROL_001`, utilizando una cédula y una obligación estables del ambiente de pruebas. Este caso confirmará que el ingreso, la carga de información y la disponibilidad del simulador sean correctos.

Cuando `CONTROL_001` termine correctamente, se habilitarán las pruebas de Pago de Mora, Novación, Cancelación Total, Ampliación de Plazo y Consolidación de Productos. Cada mecanismo tendrá sus propios casos y resultados, sin reutilizar la ejecución del caso de control.

La definición detallada de este flujo está en las [consideraciones del proyecto](Docuementacion/consideraciones-proyecto.md) y en la [arquitectura del proyecto](Docuementacion/arquitectura-proyecto.md).

## Información del proyecto

- [Casos y datos de prueba](Docuementacion/casos-de-prueba.md)
- [Arquitectura del proyecto](Docuementacion/arquitectura-proyecto.md)
- [Consideraciones del proyecto](Docuementacion/consideraciones-proyecto.md)
- [Consideraciones técnicas](Docuementacion/consideraciones-tecnicas.md)
- [Contexto de trabajo](opencode/contexto-sesion.md)

## Resultado esperado

Se espera contar con una base de pruebas repetible para los cinco mecanismos, con casos independientes, resultados comparables y documentación suficiente para que el equipo pueda mantenerlos y ampliar la cobertura cuando se incorporen nuevas funcionalidades.

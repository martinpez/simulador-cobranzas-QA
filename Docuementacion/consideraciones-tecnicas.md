# Consideraciones técnicas

[Volver al README principal](../README.md)

Este documento concentra las decisiones y referencias técnicas que no forman parte de la descripción funcional del proyecto.

## Tecnologías y ambiente

- La aplicación bajo prueba está construida sobre Lappiz, una plataforma low-code.
- La interfaz utiliza Angular 15.2.10, Kendo UI, DevExtreme, Bootstrap y componentes auxiliares de interfaz.
- Las pruebas se implementarán con Playwright y TypeScript.
- Los datos de entrada se administrarán en archivos CSV o Excel.
- Los resultados podrán consultarse en el reporte HTML generado por la ejecución.
- El ambiente de pruebas utiliza un dominio fijo y requiere credenciales de prueba.

## Referencias de la interfaz

Los campos de la aplicación utilizan identificadores GUID generados por Lappiz. El selector de obligación identificado utiliza el GUID `caae86ca-b4e0-4e59-918e-8f7a1a4d4114` y la obligación se selecciona por sus últimos cuatro dígitos.

Las clases principales de los botones de mecanismo son:

| Mecanismo | Clase |
| --- | --- |
| Consolidación | `.consolidacion` |
| Novación | `.novaciones` |
| Pago de Mora | `.pagomora` |
| Cancelación | `.cancelacion` |
| Ampliación | `.ampliacion` |

La navegación entre páginas usa clases diferentes según el mecanismo. El detalle de selectores, GUID y navegación debe mantenerse centralizado en la implementación para facilitar su actualización.

## Información SOX

La información SOX es una cadena construida con los valores de la negociación y separadores como `XX` y `LLL`. Su estructura cambia según el mecanismo.

No se recomienda comparar la cadena completa como un texto fijo. Las pruebas deben extraer y validar valores clave definidos en cada caso, como porcentajes, abonos, pagos mínimos, intereses y otros valores esperados.

## Referencias del código revisado

En el repositorio de eventos se identificaron referencias para:

- Navegación y clases de botones en `navegacion/navegacion.js`.
- Construcción de SOX en `validaciones-sox/ReflejaSox.js` y `validaciones-sox/plantillasSox/`.
- Poblamiento de información en `calculos/poblamientoGen/Poblamiento.js`.
- Cálculos de Pago de Mora, Ampliación, Consolidación y Cancelación en sus respectivas carpetas.
- Lectura de información para FUN en `formatos-fun/EventoGeneral.js`.

## Recomendaciones de implementación

- Centralizar los selectores y GUID en un único mapa.
- Reutilizar páginas y acciones comunes mediante el patrón Page Object.
- Usar esperas propias de la herramienta de pruebas en lugar de pausas fijas.
- No guardar credenciales, tokens ni información sensible en el repositorio.
- Mantener separados los datos de prueba y los valores esperados.

## Control y aislamiento en Playwright

El caso `CONTROL_001` debe modelarse como una prueba o proyecto previo. Los proyectos de los mecanismos deben depender de ese control para que Playwright no los ejecute cuando la prueba inicial falle.

La configuración debe distinguir estos conceptos:

- **Caso de prueba:** validación funcional, como `CONTROL_001` o `PM_001`.
- **Cédula:** dato del cliente utilizado por un caso de prueba.
- **Contexto de Playwright:** sesión aislada de navegador que debe pertenecer a cada ejecución independiente.
- **Worker o proceso:** unidad que Playwright utiliza para ejecutar pruebas.

El caso de control utilizará un único worker y contexto. Después, cada mecanismo tendrá su suite y contexto independiente. No se debe compartir la misma página entre el control y los mecanismos. Una sesión autenticada podría reutilizarse mediante `storageState` si se confirma que esto no altera el aislamiento de los datos.

La ejecución paralela debe habilitarse únicamente cuando cada mecanismo tenga clientes y obligaciones independientes. Si varios casos modifican la misma obligación, se debe mantener una ejecución secuencial para evitar resultados contaminados.

Para la organización de archivos y componentes, consultar la [arquitectura del proyecto](arquitectura-proyecto.md).

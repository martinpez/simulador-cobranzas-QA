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
| Itaú | `.itau` |

La navegación entre páginas usa clases diferentes según el mecanismo (por ejemplo `.right-buttonM`, `.left-buttonCA1`, `.right-buttonC2`, `.right-button4`). El detalle de selectores, GUID y navegación se mantiene centralizado en `src/utils/selectors.ts` para facilitar su actualización.

## Archivos de configuración

La ejecución utiliza dos archivos de variables de entorno, ambos ignorados por git:

- **`.env`:** define `BASE_URL` (URL del ambiente de pruebas), `User` y `Password`. Se carga en `playwright.config.ts` y lo usa la función de login.
- **`.env_data`:** define los datos estables del caso de control: `CONTROL_DOCUMENT_TYPE`, `CONTROL_DOCUMENT_NUMBER` y `CONTROL_OBLIGATION`. Se carga junto con `.env`.
- **`.env_data.example`:** plantilla versionada que documenta las variables de `.env_data` sin valores reales.

No se deben versionar `.env` ni `.env_data` ni subir credenciales al repositorio.

## Información SOX

La información SOX es una cadena construida con los valores de la negociación y separadores como `XX` y `LLL`. Su estructura cambia según el mecanismo.

La implementación actual compara la cadena SOX completa de forma normalizada (minúsculas y espacios colapsados) contra el valor esperado en `data_compare.csv`. Esta comparación de cadena completa difiere de la recomendación inicial de extraer y validar solo valores clave (porcentajes, abonos, pagos mínimos, intereses); si se requiere validar valores puntuales, se debe migrar la comparación a una extracción por campo en `data_compare.csv`.

## Mapa de GUIDs

`src/utils/selectors.ts` concentra los selectores de la aplicación:

- `PRINCIPAL`: campos de la pestaña principal (tipo documento, identificación, obligación, marca, edad de mora, gestión telefónica).
- `NOVACION_PAG1`/`NOVACION_PAG2`, `PAGO_MORA_PAG1`/`PAGO_MORA_PAG2`, `CANCELACION_PAG1`/`CANCELACION_PAG2`, `AMPLIACION_PAG1`/`AMPLIACION_PAG2`/`AMPLIACION_PAG3` y `CONSOLIDACION_PAG1`/`CONSOLIDACION_PAG2`/`CONSOLIDACION_ACTIVIDAD`/`CONSOLIDACION_PAG4`: campos de cada página de cada mecanismo.
- `NAV` y `MECANISMOS`: botones de navegación y de selección de mecanismo.
- `SOX_MAP`: mapeo de los GUID de las cajas de observaciones y SOX de cada mecanismo.

Los GUID son generados por Lappiz y pueden variar entre ambientes; por eso se mantienen centralizados en este archivo y se referencian desde los `spec` y el flujo.

## Referencias del código revisado

En el repositorio de eventos se identificaron referencias para:

- Navegación y clases de botones en `navegacion/navegacion.js`.
- Construcción de SOX en `validaciones-sox/ReflejaSox.js` y `validaciones-sox/plantillasSox/`.
- Poblamiento de información en `calculos/poblamientoGen/Poblamiento.js`.
- Cálculos de Pago de Mora, Ampliación, Consolidación y Cancelación en sus respectivas carpetas.
- Lectura de información para FUN en `formatos-fun/EventoGeneral.js`.

## Recomendaciones de implementación

- Centralizar los selectores y GUID en un único mapa (`src/utils/selectors.ts`).
- Reutilizar acciones comunes (login, carga principal, lectura y escritura de campos) en utilidades compartidas (`src/utils/simulador-flow.ts`).
- Usar esperas propias de la herramienta de pruebas en lugar de pausas fijas.
- No guardar credenciales, tokens ni información sensible en el repositorio.
- Mantener separados los datos de prueba (`datos_negociacion.csv`) y los valores esperados (`data_compare.csv`).

## Control y aislamiento en Playwright

El caso `AC_0001` debe modelarse como una prueba o proyecto previo. Los proyectos de los mecanismos deben depender de ese control para que Playwright no los ejecute cuando la prueba inicial falle.

La configuración debe distinguir estos conceptos:

- **Caso de prueba:** validación funcional, como `AC_0001` o `pm_001`.
- **Cédula:** dato del cliente utilizado por un caso de prueba.
- **Contexto de Playwright:** sesión aislada de navegador que debe pertenecer a cada ejecución independiente.
- **Worker o proceso:** unidad que Playwright utiliza para ejecutar pruebas.

El caso de control utilizará un único worker y contexto. Después, cada mecanismo tendrá su suite y contexto independiente. No se debe compartir la misma página entre el control y los mecanismos. Una sesión autenticada podría reutilizarse mediante `storageState` si se confirma que esto no altera el aislamiento de los datos.

La ejecución paralela debe habilitarse únicamente cuando cada mecanismo tenga clientes y obligaciones independientes. Si varios casos modifican la misma obligación, se debe mantener una ejecución secuencial para evitar resultados contaminados.

Para la organización de archivos y componentes, consultar la [arquitectura del proyecto](arquitectura-proyecto.md).

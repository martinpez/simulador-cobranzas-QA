# Arquitectura del proyecto

[Volver al README principal](../README.md)

La automatización se organiza separando la configuración, los datos, las utilidades y las pruebas. La estructura refleja el estado actual de la implementación y puede ajustarse cuando se incorporen los mecanismos pendientes.

```text
AutomatizacionDev/
├── README.md
├── Docuementacion/
│   ├── arquitectura-proyecto.md
│   ├── casos-de-prueba.md
│   ├── consideraciones-proyecto.md
│   ├── consideraciones-tecnicas.md
│   └── mecanismos/
│       ├── README.md
│       ├── pago-de-mora.md
│       ├── novacion.md
│       ├── cancelacion-total.md
│       ├── ampliacion-de-plazo.md
│       └── consolidacion-de-productos.md
├── *.json                          # Snapshots de levantamiento de campos (solo locales, gitignored)
└── simulador-cobranza-tests/
    ├── playwright.config.ts
    ├── package.json
    ├── .env                         # BASE_URL, User, Password (gitignored)
    ├── .env_data                    # Datos del caso de control (gitignored)
    ├── .env_data.example
    ├── data/
    │   ├── datos_negociacion.csv    # Entradas de la negociación por caso
    │   ├── data_compare.csv         # Valores esperados para comparar
    │   └── data.csv                 # Exportación base de clientes/obligaciones (referencia)
    ├── src/
    │   ├── tests/
    │   │   ├── main.spec.ts                       # Caso de control AC_0001
    │   │   ├── pagomora/pagomora.spec.ts          # Suite de Pago de Mora
    │   │   ├── novacion/                          # Pendiente
     │   │   ├── cancelacion/cancelacion.spec.ts    # Suite de Cancelación Total
     │   │   ├── ampliacion/ampliacion.spec.ts       # Suite de Ampliación de Plazo
    │   │   └── consolidacion/                     # Pendiente
    │   └── utils/
    │       ├── csv-data.ts        # Lectura de CSV y helpers de filas
    │       ├── selectors.ts       # Mapa central de GUIDs, selectores y SOX_MAP
    │       └── simulador-flow.ts  # Login, carga principal y helpers de lectura/escritura
    ├── playwright-report/          # Reporte HTML de ejecuciones (gitignored)
    └── test-results/               # Evidencias y trazabilidad (gitignored)
```

## Responsabilidad de cada parte

- `data/`: casos, datos de entrada y valores esperados en CSV.
- `src/utils/csv-data.ts`: lectura de CSV, normalización de encabezados, búsqueda de casos por `id_caso` y conversión de números.
- `src/utils/selectors.ts`: mapa centralizado de GUIDs y selectores por página de cada mecanismo, botones de navegación y de mecanismo, y `SOX_MAP` para localizar las cajas de observaciones y SOX de cada mecanismo.
- `src/utils/simulador-flow.ts`: login, carga de la pestaña principal (tipo documento, identificación, obligación, marca, edad de mora y gestión telefónica) y helpers de lectura/escritura de campos.
- `src/tests/`: casos de prueba por mecanismo. `main.spec.ts` contiene el caso de control `AC_0001`.
- `Docuementacion/`: definición funcional y técnica del proyecto.
- Los artefactos `*.json` de la raíz (por ejemplo `cancelacion-pag1-fields.json`) son snapshots locales de levantamiento de campos y no se versionan.

Cada suite reutiliza el flujo general de ingreso, selección de obligación, selección del mecanismo, diligenciamiento y validación. Las diferencias propias de cada negocio permanecen en la utilidad de flujo y en los casos del mecanismo correspondiente.

## Estado de implementación

- `control`: implementado (`main.spec.ts`).
- `pagomora`: implementado (`pagomora/pagomora.spec.ts`).
- `cancelacion`: implementado (`cancelacion/cancelacion.spec.ts`).
- `ampliacion`: implementado (`ampliacion/ampliacion.spec.ts`).
- `novacion` y `consolidacion`: carpetas creadas, suites pendientes.

## Estrategia de ejecución

La ejecución tiene un caso de control previo y las suites de mecanismos:

1. El proyecto `control` ejecuta `AC_0001` con una cédula y una obligación estables.
2. Si `AC_0001` falla, las suites de mecanismos no deben ejecutarse.
3. Si `AC_0001` pasa, se habilitan las suites de mecanismos. Los proyectos dependientes (`dependencies`) se definen en `playwright.config.ts`; actualmente `pagomora`, `cancelacion` y `ampliacion` dependen de `control`.
4. Cada mecanismo utiliza su propio contexto de Playwright y no comparte la página del caso de control.
5. Las suites pueden ejecutarse en paralelo únicamente cuando sus clientes y obligaciones no se interfieran.

En esta documentación, una **cédula** es un dato de entrada y un **caso de prueba** es la validación que utiliza ese dato. `AC_0001` es el caso de control; la cédula estable asociada se mantiene en `.env_data`.

## Documentos relacionados

- [Casos y datos de prueba](casos-de-prueba.md)
- [Consideraciones técnicas](consideraciones-tecnicas.md)
- [Documentos por mecanismo](mecanismos/)

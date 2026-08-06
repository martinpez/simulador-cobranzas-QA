# Arquitectura del proyecto

[Volver al README principal](../README.md)

La automatización se organizará separando la configuración, los datos, las páginas de la aplicación, las utilidades y las pruebas. La estructura es una referencia para la implementación y puede ajustarse cuando se confirme la ubicación definitiva del proyecto de automatización.

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
├── opencode/
│   └── contexto-sesion.md
└── simulador-cobranza-tests/
    ├── playwright.config.ts
    ├── package.json
    ├── tsconfig.json
    ├── data/
    │   ├── casos-prueba.csv
    │   └── datos-prueba.csv
    ├── src/
    │   ├── pages/
    │   │   ├── LoginPage.ts
    │   │   ├── SimuladorPage.ts
    │   │   ├── PagoMoraPage.ts
    │   │   ├── NovacionPage.ts
    │   │   ├── CancelacionPage.ts
    │   │   ├── AmpliacionPage.ts
    │   │   └── ConsolidacionPage.ts
    │   ├── utils/
    │   │   ├── mapeo-guids.ts
    │   │   ├── sox-parser.ts
    │   │   ├── csv-loader.ts
    │   │   └── reporte.ts
    │   └── tests/
    │       ├── control.spec.ts
    │       ├── pago-de-mora.spec.ts
    │       ├── novacion.spec.ts
    │       ├── cancelacion-total.spec.ts
    │       ├── ampliacion-de-plazo.spec.ts
    │       └── consolidacion-de-productos.spec.ts
    └── reportes/
```

## Responsabilidad de cada parte

- `data/`: casos, datos y valores esperados.
- `pages/`: acciones y elementos de cada página o mecanismo.
- `utils/`: lectura de datos, interpretación de resultados y funciones compartidas.
- `tests/`: pruebas independientes por mecanismo.
- `reportes/`: resultados y evidencias de las ejecuciones.
- `Docuementacion/`: definición funcional y técnica del proyecto.
- `opencode/`: contexto de trabajo utilizado para retomar sesiones de desarrollo.

Cada suite debe reutilizar el flujo general de ingreso, selección de obligación, selección del mecanismo, diligenciamiento y validación. Las diferencias propias de cada negocio deben permanecer en la página y en los casos del mecanismo correspondiente.

## Estrategia de ejecución

La ejecución tendrá un caso de control previo y cinco suites independientes:

1. `control.spec.ts` ejecuta `CONTROL_001` con una cédula y una obligación estables.
2. Si `CONTROL_001` falla, las suites de mecanismos no deben ejecutarse.
3. Si `CONTROL_001` pasa, se habilitan las suites de Pago de Mora, Novación, Cancelación Total, Ampliación de Plazo y Consolidación de Productos.
4. Cada mecanismo utiliza su propio contexto de Playwright y no comparte la página del caso de control.
5. Las suites pueden ejecutarse en paralelo únicamente cuando sus clientes y obligaciones no se interfieran.

En esta documentación, una **cédula** es un dato de entrada y un **caso de prueba** es la validación que utiliza ese dato. `CONTROL_001` es el caso de control; la cédula estable asociada se mantiene en los datos de prueba.

## Documentos relacionados

- [Casos y datos de prueba](casos-de-prueba.md)
- [Consideraciones técnicas](consideraciones-tecnicas.md)
- [Documentos por mecanismo](mecanismos/)

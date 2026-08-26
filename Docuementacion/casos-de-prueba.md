# Casos y datos de prueba

[Volver al README principal](../README.md)

Este documento define la información que debe tener cada caso de prueba y la forma de organizar los datos utilizados durante las pruebas. Los casos deben construirse con clientes y obligaciones previamente probados y validados por los asesores.

## Separación de archivos

Los datos se organizan en tres archivos independientes dentro de `simulador-cobranza-tests/data/`:

- **`datos_negociacion.csv`:** contiene los casos de prueba con los valores de entrada que se diligencian en la aplicación durante la negociación. Es la fuente que leen los `spec` para ejecutar cada caso.
- **`data_compare.csv`:** contiene los valores esperados con los que se comparan los resultados obtenidos de la aplicación. Se cruza con `datos_negociacion.csv` por el identificador de caso (`id_caso`).
- **`data.csv`:** exportación base de clientes y obligaciones proveniente del sistema (separador `;`). No se lee directamente en las pruebas; sirve como referencia y material de auditoría para validar los datos cargados.

Los archivos `datos_negociacion.csv` y `data_compare.csv` usan coma (`,`) como separador y son los únicos que consume la automatización. Los datos de prueba son únicos y se mantienen separados de los valores esperados, de modo que una modificación de los datos no altere accidentalmente las condiciones o los resultados esperados.

## Convención de identificadores

Cada fila de los archivos tiene un `id_caso` único. La convención actual es:

- `AC_` para el caso de control (por ejemplo `AC_0001`).
- Prefijos por mecanismo para el resto de casos (por ejemplo `PM_` para Pago de Mora, `NV_` para Novación, `CAN_` para Cancelación, `AMP_` para Ampliación y `CON_` para Consolidación).

En el archivo se pueden escribir en minúsculas (`pm_001`); los `spec` normalizan el identificador antes de filtrar o buscar.

## Caso de control

Antes de ejecutar los mecanismos se ejecuta el caso `AC_0001`. Este caso utiliza la cédula y la obligación estables definidas en el archivo `.env_data` (`CONTROL_DOCUMENT_TYPE`, `CONTROL_DOCUMENT_NUMBER` y `CONTROL_OBLIGATION`) y valida como mínimo:

- Ingreso correcto al ambiente.
- Carga del cliente y de la obligación.
- Disponibilidad de la información necesaria para iniciar una negociación.
- Acceso correcto al simulador.

La cédula es un dato de prueba; `AC_0001` es el caso que utiliza ese dato. La cédula no debe confundirse con el identificador del caso.

## `datos_negociacion.csv` — Entradas de la negociación

Este archivo indica qué se diligencian en la aplicación para cada caso. Una fila no necesita llenar todas las columnas: los `spec` solo diligencian los campos cuyo valor esté presente, y las columnas vacías se ignoran.

| Columna | Descripción |
| --- | --- |
| `id_caso` | Identificador único del caso, por ejemplo `pm_001`. |
| `tipo_doc` | Tipo de documento del cliente (CC, CE, NIT, PAS, TI). |
| `num_documento` | Número de identificación del cliente. |
| `obligacion` | Últimos cuatro dígitos de la obligación que se selecciona. |
| `marcaobl` | Marca de la obligación (Modificado, Perfilado, Sin Marca, Reestructurado). |
| `edad_mora` | Edad de mora del cliente (por ejemplo `31-60 Días`). |
| `mecanismo` | Mecanismo de normalización: `pago mora`, `novacion`, `cancelacion`, `ampliacion`, `consolidacion`. |
| `gestion_telefonica` | Gestión telefónica (`Si` / `No`). |
| `es_una_tc` | Indicador de si la obligación es tarjeta de crédito (`Si` / `No`). |
| `linea` | Línea de la negociación cuando el mecanismo la solicite. |
| `tipo_cartera` | Tipo de cartera cuando el mecanismo lo solicite. |
| `saldo_total` | Saldo total para Cancelación Total. |
| `interes_cte` | Interés corriente. |
| `interes_mora` | Interés de mora. |
| `interes_extracontables_tc` | Intereses extracontables de tarjeta de crédito. |
| `cuota_vencida` | Cuota vencida (`Si` / `No`). |
| `fecha_pago` | Fecha de pago de la negociación. |
| `tramite_excepción` | Requiere trámite de excepción (`Si` / `No`). |
| `tasa` | Tasa de la novación. |
| `por_tasa` | Porcentaje de la tasa. |
| `por_tasa_GXC` | Porcentaje de tasa GXC. |
| `compras_auto` | Opción de compras automáticas de novación. |
| `dias_mora` | Días de mora. |
| `pago_minimo` | Pago mínimo de la obligación. |
| `por_tasa_novacion` | Porcentaje de tasa de novación. |
| `tasa_gxc` | Tasa GXC. |
| `otros_cargos_exigibles` | Otros cargos exigibles. |
| `intereses_gastos_no_facturados` | Intereses y gastos no facturados (ampliación). |
| `convenio_prima_unica` | Convenio de prima única (ampliación). |
| `pago_gestion_recuperacion` | Pago para la gestión de recuperación (novación). |
| `actividad_economica` | Actividad económica. |
| `ocupa_ingresos_adicionales` | Ocupación con ingresos adicionales. |
| `ingreso_bruto` | Ingreso bruto. |
| `ingresos_adicional` | Ingresos adicionales. |
| `codigo_excepcion` | Código de excepción. |
| `cuotas_finaz_BDB` | Cuotas financieras mensuales sin las del BDB. |
| `capital_total` | Capital total (cancelación / ampliación). |
| `requiere_tramite` | Requiere trámite (`Si` / `No`). |
| `plazo_meses` | Plazo en meses (ampliación / consolidación). |
| `tasaEAampliacion` | Tasa E.A. de ampliación. |
| `amortizacion` | Tipo de amortización. |
| `tasaint_E.A` | Tasa de interés E.A. (consolidación). |
| `pagonegociacion` | Pago para la negociación (consolidación). |
| `honorarios` | Honorarios. |
| `pago_snr` | Pago al SNR. |
| `valorgastosGXC` | Valor que se diligencia en el campo de valor GXC cuando el caso es piloto-GXC. |
| `Toggle-obl-consolidacion` | Obligaciones que se incluirán en Consolidación, separadas por `;`. El orden de esta lista define la posición de las ediciones por obligación. |
| `saldo_total_obl` | Valores opcionales de saldo por obligación, alineados con `Toggle-obl-consolidacion`. |
| `honorarios_obl` | Valores opcionales de honorarios por obligación, alineados con `Toggle-obl-consolidacion`. |
| `interes_cte_obl` | Valores opcionales de interés corriente por obligación, alineados con `Toggle-obl-consolidacion`. |
| `interes_mora_obl` | Valores opcionales de interés de mora por obligación, alineados con `Toggle-obl-consolidacion`. |
| `interes_extracontables_obl` | Valores opcionales de intereses extracontables por obligación, alineados con `Toggle-obl-consolidacion`. |

El encabezado real del archivo es la lista de estas columnas en el orden mostrado. Como las columnas son por mecanismo, se diligencian únicamente las que corresponden al caso en cuestión.

Para Consolidación, las columnas terminadas en `_obl` conservan las posiciones vacías. Por ejemplo, `;;20122;;;;;;;` modifica únicamente el tercer elemento de una lista de diez obligaciones. Si una lista posicional no tiene la misma cantidad de elementos que `Toggle-obl-consolidacion`, el caso se considera inválido.

## `data_compare.csv` — Valores esperados

Contiene los valores esperados con los que se comparan los resultados leídos de la aplicación. Se busca la fila por el mismo `id_caso` del caso ejecutado.

| Columna | Descripción |
| --- | --- |
| `id_caso` | Identificador único del caso, debe coincidir con el de `datos_negociacion.csv`. |
| `mecanismo` | Mecanismo de normalización. |
| `num_documento` | Número de identificación del cliente. |
| `gxc_honorarios` | Valor esperado del campo GXC / Honorarios (texto). |
| `linea` | Línea esperada. |
| `tipo_cartera` | Tipo de cartera esperado. |
| `diasmora` | Días de mora esperados en la negociación. |
| `abono_minimo_max` | Abono mínimo con máximo porcentaje permitido. |
| `maximohonorarios` | Valor máximo de honorarios. |
| `honorarioscomfirm` | Valor de honorarios que debe coincidir con el valor diligenciado cuando aplique. |
| `max_total_baja` | Máximo total de baja en cuentas. |
| `bajacuentaIntCte` | Baja en cuenta de interés corriente. |
| `bajacuentaIntMora` | Baja en cuenta de interés de mora. |
| `bajacuentaIntExtra` | Baja en cuenta de intereses extracontables. |
| `valormaximopilotos` | Máximo permitido para el valor del piloto-GXC. |
| `valorGXCpilotoconfirm` | Valor GXC del piloto confirmado por la aplicación. |
| `sox` | Cadena SOX esperada (texto). |

## Comparación de resultados

Los `spec` leen los campos calculados de la aplicación y los comparan contra `data_compare.csv`:

- Los campos numéricos (`diasmora`, `abono_minimo_max`, `maximohonorarios`, `honorarioscomfirm`, `max_total_baja`, `bajacuentaIntCte`, `bajacuentaIntMora`, `bajacuentaIntExtra`, `valormaximopilotos`, `valorGXCpilotoconfirm`) se comparan como números.
- Los campos de texto (`gxc_honorarios`, `linea`, `tipo_cartera` y `sox`) se comparan con el texto normalizado (minúsculas, espacios colapsados). Las variantes de label de piloto-GXC se consideran equivalentes.
- Si una columna esperada está vacía, la comparación de ese campo se omite.
- El resultado de la comparación y los datos cargados se adjuntan como evidencia al caso (`datos-cargados.json` y `resultado-comparacion.json`).

## Ejemplo

`datos_negociacion.csv`:

```csv
id_caso,tipo_doc,num_documento,obligacion,marcaobl,edad_mora,mecanismo,gestion_telefonica,es_una_tc,interes_cte,interes_mora,interes_extracontables_tc,cuota_vencida,fecha_pago,tramite_excepción,...
ac_0001,CC,1000000100,1000
pm_001,CC,1047221940,6588,,,pago mora,,,,,,no,14/08/26,si,...
```

`data_compare.csv`:

```csv
id_caso,mecanismo,num_documento,gxc_honorarios,linea,tipo_cartera,abono_minimo_max,maximohonorarios,max_total_baja,bajacuentaIntCte,bajacuentaIntMora,bajacuentaIntExtra,sox
pm_001,pagomora,1047221940,no aplica,,,113803,,60861,59841,1020,,"FECHAPAGOXX..."
```

## Flujo común de ejecución

1. Ejecutar `AC_0001` con su cédula y obligación estables.
2. Detener la ejecución si el caso de control falla.
3. Si el control pasa, ejecutar los casos de cada mecanismo.
4. Cargar el cliente y seleccionar la obligación definida en `datos_negociacion.csv`.
5. Seleccionar el mecanismo indicado.
6. Diligenciar la negociación según los valores de entrada del caso.
7. Confirmar los valores y campos propios del mecanismo.
8. Obtener la información final de la negociación.
9. Comparar los valores obtenidos contra `data_compare.csv`.
10. Registrar el resultado y las evidencias de la prueba.

Los detalles particulares de cada flujo están en los documentos de [Pago de Mora](mecanismos/pago-de-mora.md), [Novación](mecanismos/novacion.md), [Cancelación Total](mecanismos/cancelacion-total.md), [Ampliación de Plazo](mecanismos/ampliacion-de-plazo.md) y [Consolidación de Productos](mecanismos/consolidacion-de-productos.md).

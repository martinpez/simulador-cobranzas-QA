# Casos y datos de prueba

[Volver al README principal](../README.md)

Este documento define la información que debe tener cada caso de prueba y la forma de organizar los datos utilizados durante las pruebas. Los casos deben construirse con clientes y obligaciones previamente probados y validados por los asesores.

## Separación de archivos

Se deben conservar dos fuentes de información independientes:

- **Casos de prueba:** contiene el escenario, los valores esperados, las validaciones y el resultado que debe producir la negociación.
- **Datos de prueba:** contiene los datos de los clientes y obligaciones usados para ejecutar los casos.

Los datos de prueba deben ser únicos y mantenerse separados de los casos. Así se evita que una modificación de los datos altere accidentalmente las condiciones o los resultados esperados.

## Caso de control

Antes de ejecutar los mecanismos se ejecutará el caso `CONTROL_001`. Este caso utilizará una cédula y una obligación estables, definidas en el archivo de datos de prueba, y validará como mínimo:

- Ingreso correcto al ambiente.
- Carga del cliente y de la obligación.
- Disponibilidad de la información necesaria para iniciar una negociación.
- Acceso correcto al simulador.

La cédula es un dato de prueba; `CONTROL_001` es el caso que utiliza ese dato. La cédula no debe confundirse con el identificador del caso.

## Estructura del caso

| Columna | Descripción |
| --- | --- |
| `id_caso` | Identificador único del caso, por ejemplo `PM_001`. |
| `mecanismo` | `control`, `pagomora`, `novacion`, `cancelacion`, `ampliacion` o `consolidacion`. |
| `obligacion_4digitos` | Últimos cuatro dígitos de la obligación que se utilizará. |
| `escenario` | Tipo de escenario: `base`, negociación especial, validación individual, tarjeta u otro definido por el mecanismo. |
| `pago_snr` | Valor que se utilizará para el pago SNR. Para un caso que no requiera pago, se puede usar `1` según la definición del caso. |
| `plazo` | Plazo o valor relacionado con el plazo cuando aplique. |
| `tasa` | Tasa esperada cuando aplique. |
| `porc_int_cte_esperado` | Porcentaje de interés corriente esperado. |
| `porc_int_mora_esperado` | Porcentaje de interés de mora esperado. |
| `baja_total_esperada` | Valor de baja total esperado. |
| `abono_esperado` | Valor del abono esperado. |
| `sox_regex` | Patrón o valores clave que deben encontrarse en la información final de la negociación. |
| `notas` | Descripción, condiciones y observaciones del caso. |

Las columnas pueden ampliarse cuando un mecanismo necesite valores propios. Esas ampliaciones deben documentarse en el archivo del mecanismo correspondiente.

## Ejemplo

```csv
id_caso,mecanismo,obligacion_4digitos,escenario,pago_snr,plazo,tasa,porc_int_cte_esperado,porc_int_mora_esperado,baja_total_esperada,abono_esperado,sox_regex,notas
CONTROL_001,control,5700,control,,,,,,,,,Validación inicial del ambiente y de la obligación estable
PM_001,pagomora,5700,base,1093853,,,100,100,284518,1093853,VALORCONSIGSNRXX1093853,Cliente base
PM_002,pagomora,7597,campana,900000,,,90,80,,,VALORCONSIGSNRXX900000,Cliente con campaña
CAN_001,cancelacion,2009,base,1500000,,,100,100,88000,,,Cancelación parcial
```

## Flujo común de ejecución

1. Ejecutar `CONTROL_001` con su cédula y obligación estables.
2. Detener la ejecución si el caso de control falla.
3. Si el control pasa, ejecutar los casos de cada mecanismo.
4. Cargar el cliente y seleccionar la obligación definida en cada caso.
5. Seleccionar el mecanismo indicado.
6. Diligenciar la negociación según el escenario.
7. Confirmar los valores y campos propios del mecanismo.
8. Obtener la información final de la negociación.
9. Comparar los valores obtenidos con los valores esperados.
10. Registrar el resultado y las evidencias de la prueba.

Los detalles particulares de cada flujo están en los documentos de [Pago de Mora](mecanismos/pago-de-mora.md), [Novación](mecanismos/novacion.md), [Cancelación Total](mecanismos/cancelacion-total.md), [Ampliación de Plazo](mecanismos/ampliacion-de-plazo.md) y [Consolidación de Productos](mecanismos/consolidacion-de-productos.md).

# Consideraciones del proyecto

[Volver al README principal](../README.md)

## Alcance del primer entregable

El primer entregable cubrirá los cinco mecanismos de normalización con casos basados en clientes y obligaciones que ya hayan sido validados por los asesores.

## Decisión sobre el flujo de ejecución

La ejecución se dividirá en dos etapas:

1. **Control inicial:** ejecutar `CONTROL_001` utilizando una cédula y una obligación estables. El caso verificará que el ambiente, el ingreso, la carga de información y el simulador estén disponibles.
2. **Pruebas por mecanismo:** si el control es exitoso, ejecutar las suites independientes de los cinco mecanismos.

Cada mecanismo tendrá su propio contexto de ejecución y sus propios datos. Las pruebas podrán ejecutarse en paralelo cuando utilicen clientes y obligaciones independientes. Mientras los datos sean compartidos, se ejecutarán de forma secuencial para evitar que una negociación afecte a otra.

Se contemplan como mínimo estos escenarios para cada mecanismo:

- Caso base: carga correcta de la obligación y confirmación de que la información está disponible.
- Negociación correcta: verificación de valores, porcentajes, pagos y condiciones.
- Validaciones individuales: revisión de campos o reglas específicas del mecanismo.
- Tarjetas: validación únicamente en los mecanismos donde aplique.

## Fuera del alcance inicial

No se incluirán inicialmente escenarios sin información cargada o sin un conjunto de datos de prueba validado. Para este primer alcance se verificará el comportamiento con información disponible y estable.

## Riesgos y tratamiento

| Riesgo | Tratamiento |
| --- | --- |
| Los datos de prueba pueden cambiar. | Usar clientes y obligaciones estables, documentados y exclusivos para pruebas. |
| Los casos esperados pueden quedar desactualizados. | Revisar los casos con un asesor cuando cambie una regla de negocio. |
| Un mecanismo puede requerir validaciones no previstas. | Mantener un documento independiente por mecanismo y ampliar sus casos cuando sea necesario. |
| Las pruebas pueden depender del estado del ambiente. | Registrar el ambiente usado y confirmar su disponibilidad antes de ejecutar. |
| Los resultados pueden ser difíciles de analizar. | Conservar evidencias y un reporte por ejecución. |
| El caso de control y los mecanismos pueden modificar los mismos datos. | Reservar datos estables para `CONTROL_001` y datos independientes para cada mecanismo. |

## Definiciones pendientes

1. Cantidad final de casos para cada mecanismo.
2. Casos que deben priorizarse para la primera ejecución.
3. Datos de clientes y obligaciones que serán entregados por los asesores.
4. Formato final de los reportes y evidencias.
5. Necesidad futura de ejecutar las pruebas automáticamente en un proceso de integración.
6. Datos de acceso y procedimiento exacto de ingreso al ambiente de pruebas.

## Documentos relacionados

- [Casos y datos de prueba](casos-de-prueba.md)
- [Arquitectura del proyecto](arquitectura-proyecto.md)
- [Consideraciones técnicas](consideraciones-tecnicas.md)
- [Documentación de mecanismos](mecanismos/)

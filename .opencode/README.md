# Contexto de la sesión — Automatización Simulador de Cobranza

> Archivo de contexto para retomar rápidamente la conversación en una nueva sesión de OpenCode.

---

## 1. Problema a resolver

Automatizar pruebas repetitivas del **Simulador de Normalización de Cartera (DNC)** de Banco de Bogotá, el cual es una aplicación web low-code sobre **Lappiz**. La automatización busca reducir el tiempo que toman las pruebas manuales y permitir que los asesores de pruebas se enfoquen solo en funcionalidades nuevas.

---

## 2. Características de la aplicación

- **Plataforma:** Lappiz (low-code).
- **Frontend:** Angular 15.2.10, con Vue.js, React, Zone.js.
- **UI Libraries:** Kendo UI 2020.1.406, DevExtreme, Bootstrap 5, SweetAlert2 (Swal), toastr.
- **Campos del formulario:** usan GUIDs generados por Lappiz (ej: `caae86ca-b4e0-4e59-918e-8f7a1a4d4114`).
- **Funciones globales de Lappiz:** `getFieldValue()`, `setFieldValue()`, `disableField()`, `execLF()`, `execQuery()`, `backandGlobal`.
- **Mecanismos:** 5 mecanismos de normalización:
  1. Pago de Mora
  2. Novación
  3. Cancelación Total
  4. Ampliación de Plazo
  5. Consolidación de Productos
- **Datos:** se cargan automáticamente desde base de datos al seleccionar una obligación del cliente.
- **SOX:** cadena de texto concatenada con separadores `XX` y `LLL`, que refleja los datos de la negociación (porcentajes, abonos, pagos mínimos, intereses, etc.). Cada mecanismo genera un SOX con estructura diferente.
- **Ambiente:** entorno de pruebas desplegado con dominio fijo. Acceso mediante usuario y contraseña.
- **No hay API expuesta** para consumir directamente; todo pasa por la UI.

---

## 3. Decisión tecnológica

Se decidió usar:

- **Playwright** como framework de pruebas E2E.
- **TypeScript** como lenguaje (preferencia del desarrollador).
- **CSV/Excel** como fuente de datos de prueba.
- **Reporte HTML** generado por Playwright.
- **Ejecución local** con `npx playwright test`.

**Motivo:** Playwright maneja bien Angular, Kendo UI, DevExtreme, esperas automáticas, screenshots, trazas y videos. Es robusto y mantenible.

---

## 4. Código fuente revisado

Se revisó el repositorio local:

```text
/home/appex/Documents/CDS/simulador-cobranza-banco-bogota/
```

Archivos relevantes revisados:

- `README.md`: estructura general del repositorio.
- `navegacion/navegacion.js`: mapa de vistas, navegación entre páginas y clases de botones por mecanismo.
- `validaciones-sox/ReflejaSox.js`: funciones que construyen la cadena SOX por mecanismo.
- `validaciones-sox/plantillasSox/*.js`: generación de SOX para Mora, Cancelación y Novación.
- `calculos/poblamientoGen/Poblamiento.js`: poblamiento de campos al seleccionar cliente.
- `calculos/pagomora/cualculosmora.jsx`: cálculos de Pago de Mora.
- `calculos/Ampliacion/CalculosAm.js`: cálculos de Ampliación.
- `calculos/Consolidacion/CalculosConsolidacion.js`: cálculos de Consolidación.
- `calculos/Cancelacion/CalculosCancelacion.jsx`: cálculos de Cancelación Total.
- `formatos-fun/EventoGeneral.js`: lectura de datos de formulario para generación de FUN.

---

## 5. Elementos de UI identificados

### Selector de obligación

Es un Kendo DropDownList con:

```html
<select id="caae86ca-b4e0-4e59-918e-8f7a1a4d4114" data-role="dropdownlist">
  <option value="">Seleccione un registro...</option>
  <option value="7C829481-DB3C-4344-8FBD-F17CB4DB5489">5700</option>
  <option value="12E3BE6E-515C-47F8-926B-B59BF01ACF70">2009</option>
  <option value="AC05701B-52E6-4EAD-BB30-6604AD0CD0C0">7597</option>
</select>
```

Se selecciona por los **últimos 4 dígitos** de la obligación.

### Botones de mecanismos (clases CSS)

Según `navegacion/navegacion.js`:

| Mecanismo | Clase del botón |
| --- | --- |
| Consolidación | `.consolidacion` |
| Novación | `.novaciones` |
| Pago de Mora | `.pagomora` |
| Cancelación | `.cancelacion` |
| Ampliación | `.ampliacion` |

### Botones de navegación entre páginas

| Mecanismo | Siguiente | Anterior |
| --- | --- | --- |
| Novación | `.right-button`, `.right-button2` | `.left-button`, `.left-button2` |
| Pago Mora | `.right-buttonM`, `.right-buttonM2` | `.left-buttonM`, `.left-buttonM2` |
| Cancelación | `.right-buttonCA1`, `.right-buttonCA2`, `.right-buttonCA3` | `.left-buttonCA1`, `.left-buttonCA2`, `.left-buttonCA3` |
| Ampliación | `.right-buttonAM`, `.right-buttonAM2`, `.right-buttonAM3` | `.left-buttonAM`, `.left-buttonAM2`, `.left-buttonAM3` |
| Consolidación | `.right-buttonC`, `.right-buttonC2`, `.right-buttonC4` | `.left-buttonC`, `.left-buttonC2`, `.left-buttonC4` |

### Mapa de campos SOX (`OBSERVATION_SOX_MAP`)

| Observación GUID | SOX GUID | Mecanismo |
| --- | --- | --- |
| `be70a202-71a9-40ea-851b-945702693b51` | `f3979225-f563-48a2-a206-6b5866a7dc6c` | Consolidación |
| `96c93177-4705-4bd2-ac50-e304c007afa3` | `b24357e4-d1be-443d-8fa0-5b8790a1c508` | Pago de Mora |
| `24e68f6c-b401-40d9-bb2d-ec6d246426f9` | `d4f89a7c-0207-4756-9bd7-e2e669ac3ce0` | Cancelación |
| `68d8ce24-c9fd-440b-995a-7ff027f628b6` | `eec3136d-46bf-438c-b7cc-4aaa5fba776b` | Ampliación |
| `637cda5e-a8da-499a-98be-564521dd6c25` | `07b4e087-95c8-4867-b91f-1f9e9a4a1ea0` | Novación |

---

## 6. Flujo de automatización propuesto

1. Login con usuario de pruebas.
2. Navegar al simulador.
3. Seleccionar obligación por últimos 4 dígitos.
4. Seleccionar mecanismo.
5. Avanzar por las páginas del formulario.
6. Aplicar variaciones según caso de prueba (pago SNR, plazo, etc.).
7. Generar/extraer el SOX.
8. Validar valores esperados.
9. Generar reporte HTML.

---

## 7. Estructura del CSV de casos de prueba (plantilla)

```csv
id_caso,mecanismo,obligacion_4digitos,escenario,pago_snr,plazo,tasa,porc_int_cte_esperado,porc_int_mora_esperado,baja_total_esperada,abono_esperado,sox_regex,notas
PM_001,pagomora,5700,base,1093853,,,100,100,284518,1093853,VALORCONSIGSNRXX1093853,Cliente base
PM_002,pagomora,7597,campana,900000,,,90,80,,,VALORCONSIGSNRXX900000,Cliente con campaña
CAN_001,cancelacion,2009,base,1500000,,,100,100,88000,,,Cancelación parcial
```

---

## 8. Documentación del proyecto

El documento principal del repositorio se encuentra en:

```text
/home/appex/Documents/CDS/AutomatizacionDev/README.md
```

La documentación funcional y técnica está separada en `Docuementacion/` y los documentos específicos de cada mecanismo están en `Docuementacion/mecanismos/`.

---

## 9. Preguntas respondidas

- **¿Tienes acceso al código fuente?** No, es low-code Lappiz, pero se tiene el repositorio de eventos/código inyectado.
- **¿Framework frontend?** Angular 15.2.10 con Kendo UI, DevExtreme, Bootstrap.
- **¿Cómo se seleccionan los mecanismos?** Por botones con clases CSS.
- **¿Qué es el SOX?** Cadena de texto concatenada con los valores de la negociación.
- **¿Dónde se ejecutan las pruebas?** Localmente en el entorno de pruebas.
- **¿Cuántos casos por mecanismo?** Aún por definir, estimación inicial de 5–10 por mecanismo.
- **¿Los datos cambian?** Serán casos estables validados por un asesor.
- **¿Hay API?** No, todo pasa por UI.
- **¿Qué lenguaje?** TypeScript con Playwright.
- **¿Cómo se selecciona la obligación?** Dropdown Kendo con ID `caae86ca-b4e0-4e59-918e-8f7a1a4d4114`, por últimos 4 dígitos.
- **¿Validar SOX completo?** No, solo valores clave extraídos del SOX.

---

## 10. Preguntas pendientes

1. ¿Cuántos casos de prueba por mecanismo se esperan finalmente?
2. ¿El reporte debe ser HTML, JSON, o también consola?
3. ¿Se requiere integración con CI/CD en el futuro?
4. ¿Los datos de prueba ya están definidos o se construyen desde cero?
5. ¿Cómo es el login exacto? (URL, campo de usuario, campo de contraseña, botón).
6. ¿Existen usuarios de prueba ya creados?

---

## 11. Estrategia de ejecución definida

La ejecución tendrá dos etapas:

1. Ejecutar el caso de control `CONTROL_001` con una cédula y una obligación estables del ambiente de pruebas.
2. Si el caso de control pasa, ejecutar las pruebas independientes de Pago de Mora, Novación, Cancelación Total, Ampliación de Plazo y Consolidación de Productos.

Cada mecanismo debe utilizar su propio contexto de Playwright y datos que no interfieran con los demás. La ejecución paralela solo se habilitará cuando los clientes y obligaciones sean independientes; si comparten datos, las pruebas deben ejecutarse de forma secuencial.

Una cédula es un dato de entrada. `CONTROL_001` es el caso de prueba que utiliza ese dato, por lo que no deben confundirse ambos conceptos.

---

## 12. Notas adicionales

- Node.js v26.4.0 y npm 12.0.1 están instalados en el sistema.
- El repositorio de eventos no debe contener credenciales ni tokens sensibles.
- Los GUIDs son propios del ambiente de desarrollo/pruebas.
- Se recomienda usar el patrón **Page Object** para mantener selectores reutilizables.
- Se recomienda no comparar el SOX completo como string fijo, sino extraer y validar valores clave.

---

*Última actualización: sesión de trabajo con OpenCode.*

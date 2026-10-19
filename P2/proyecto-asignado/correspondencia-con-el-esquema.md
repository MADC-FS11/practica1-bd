## 1. Fuentes y versión reconstruida

Se reconstruye el dominio del proyecto PublicMunicipalWorks_DWH a partir del capítulo de González Casiano et al. (2026), el esquema operacional db/DDLBASEObPub.sql, el almacén y las funciones/disparadores de db/arquitectura/. Revisión del código original: dd5766e46c2f7e06719868f2a0cf0cd8451fe867. Este identificador acredita la versión consultada para el diseño; no acredita que el estudiante la haya ejecutado en su máquina.

## 2. Alcance conceptual

El municipio administra obras, ejecutores, supervisores, financiamiento, presupuestos e informes. El expediente reúne permisos, candidaturas de contratación, fotografías y actas. Los pobladores presentan propuestas y emiten votos. Las modificaciones producen eventos de auditoría y el análisis observa cada obra por período. Se reconstruyen estos objetos y dependencias, sin utilizar las diez dimensiones como diez entidades del mundo real ni interpretar cada versión SCD como un objeto nuevo.

El diagrama completo eer.png se divide en tres módulos del mismo modelo: administración y financiamiento, expediente, y participación/seguimiento. Las cajas marcadas como referencia repiten la identidad de una entidad para evitar líneas ilegibles; no agregan tablas ni duplican objetos.

## 3. Jerarquía de Personal

Personal se especializa en Supervisor, Proyectista, Director y Secretario. Supervisor añade teléfono; Proyectista añade empresa y relación con Constructora. Director y Secretario se distinguen por su rol aunque no tienen atributos exclusivos publicados. La especialización conceptual es total y disjunta según el campo rol obligatorio y sus cuatro valores permitidos. Las subtablas supervisor/proyectista y sus FK no garantizan por sí solas que ese rol sea coherente ni que no haya membresías contradictorias: esa limitación se declara.

## 4. Dependencias y reglas reconstruidas

Costo depende de un Presupuesto para interpretar su gasto y EvidenciaFotografica depende de un InformeAvance que le da contexto. Se consideran dependencias de existencia. Sus claves id_gasto e id_imagen son globales en el SQL, por lo que no se afirman como entidades débiles por identificación.

SeguimientoMensual se identifica conceptualmente por obra y fecha de corte. Su representación física depende de la versión SCD de Obra. Si se producen varias versiones de una obra en el mismo período, deben seleccionarse o reconciliarse antes de formar un único seguimiento conceptual; la PK física no equivale a unicidad por identificador de negocio y mes.

Cada Obra tiene exactamente una Constructora, Region y Supervisor según FK obligatorias. Cada informe pertenece a una Obra y un Supervisor. Obra puede tener cero o un Presupuesto y cero o un ActaEntrega, pues la FK inversa UNIQUE impide más de uno pero no obliga a crearlos. FuenteFinanciamiento y Obra participan en una relación N:M con mínimo cero en el esquema.

El modelo conserva como texto la región de la propuesta y la constructora de una opción de contratación. No dibuja esas referencias como FK verificadas. No inventa relaciones directas de aprobación entre Director y Obra ni archivos técnicos ausentes del esquema.

## 5. Correspondencia entidad por entidad

| Entidad conceptual | Operacional / dimensión o hecho | Transformación o diferencia |
| --- | --- | --- |
| Personal | public.personal; warehouse.dim_personal | Nombre y apellidos se combinan. Se añaden claves sustitutas, marcas de rol y vigencia SCD2; una persona puede tener varias versiones. |
| Supervisor | public.supervisor + personal; dim_personal | Teléfono propio. En el almacén se aplana el subtipo como es_supervisor y atributos dentro de Personal. |
| Proyectista | public.proyectista + personal; dim_personal | Empresa y constructora asignada se aplanan. No hay una dimensión independiente del subtipo. |
| Director / Secretario | public.personal.rol; dim_personal | Son subtipos conceptuales inferidos del dominio. El SQL no crea tablas separadas, los representa con rol y banderas. |
| Constructora | public.constructora; warehouse.dim_constructora | Nombre, RFC y tipo de ejecutor. SCD2 añade versiones; una clave sustituta no es una constructora nueva. |
| Region | public.region; warehouse.dim_region | Conserva comunidad, barrio y colonia; SCD2 añade vigencia. El DDL no aporta polígonos ni latitud/longitud persistidas en esta dimensión. |
| Obra | public.obra; warehouse.dim_obra | Conserva expediente y relaciones; añade duración programada, fecha final real y nombres de estados. SCD2 conserva estados históricos de la misma obra. |
| FuenteFinanciamiento | public.fuente_presupuestaria; warehouse.dim_fuente | Programa y nivel son dominio; acumulados total_obras_financiadas y monto_total_asignado son información analítica añadida. SCD1 conserva último valor. |
| Financia (relación N:M) | public.financia; dim_fuente + consultas | La unión obra-fuente es explícita en public.financia. El esquema no registra monto por fuente y obra. No se debe sumar el presupuesto completo por cada fuente como si fuera asignación individual. |
| Presupuesto | public.presupuesto_obra; warehouse.dim_presupuesto | Monto e identidad del proyectista; SCD2 añade historial. La conexión operacional con Obra sigue siendo necesaria para el contexto. |
| Costo | public.costos; fact_eventos_auditoria / fact_obra_mensual | Detalle por gasto en el esquema operacional. Los hechos guardan eventos o costo acumulado; el detalle de cada categoría puede perderse en la agregación. |
| InformeAvance | public.informes; ambos hechos | Documento y descripción se retienen operacionalmente. En el almacén se representan eventos y avances/conteos por mes; no hay dim_informe. |
| EvidenciaFotografica | public.imagenes_informe; hechos por URL o conteo | Binario en R2/objetos; el SQL guarda URL, ruta y metadatos. Los conteos no permiten recuperar por sí solos cada fotografía. |
| Permiso | public.permisos; eventos/conteos mensuales | La entidad conserva oficina y acreditación; el snapshot prioriza cantidades. No existe dim_permiso. |
| OpcionContratacion | public.opcion_seleccion; sin dimensión propia | Candidatura, decisión y razones se quedan en operacional. constructora es texto, no FK a Constructora; no se presume una unión automática. |
| ActaEntrega | public.acta_entrega; eventos de entrega | Un acta por obra como máximo. Documento y fecha en operacional; el evento de entrega no representa todo el documento. |
| Firmante | public.firmantes; sin dimensión propia | Datos de firmantes del acta. La tabla identifica firmantes por registro y no reconstruye una identidad global de personas que firman distintas actas. |
| Poblador | public.pobladores; warehouse.dim_poblador | Se conserva identidad, comunidad y nombre. Credenciales no se proyectan. SCD1 evita histórico de correcciones de datos personales. |
| PropuestaCiudadana | public.propuestas_obras; warehouse.dim_propuesta | Descripción y convocatoria; region es texto libre, sin FK a Region. SCD1 conserva versión actual y puede perder redacciones anteriores. |
| Voto | public.votos_propuestas; fact_eventos_auditoria | Se transforma en evento VOTO_EMITIDO con vínculo a poblador/propuesta. El DDL no declara unicidad por poblador y período; no se inventa esa restricción. |
| EventoAuditoria | warehouse.fact_eventos_auditoria + dim_tipo_evento + dim_tiempo | El dominio comprende acción, fecha, actor y objeto. El almacén añade particiones, claves de versión y métricas; algunos eventos no refieren a Obra o Personal. |
| SeguimientoMensual | warehouse.fact_obra_mensual + dim_obra + dim_tiempo | Observación derivada por obra y fecha de corte; acumula presupuesto, costo, avances y evidencias. PK física (tiempo_key, obra_key), sensible a versión SCD. |

## 6. Qué se pierde y qué se agrega al pasar al almacén

**Se agrega:** vigencia de versiones, claves sustitutas, calendario analítico, tipos de evento, indicadores derivados y snapshots por mes. Una obra mantiene su identificador de negocio aunque cambie su estado o su responsable. Las cinco dimensiones SCD2 son Obra, Region, Constructora, Personal y Presupuesto; Fuente, Poblador y Propuesta usan SCD1; Tiempo y TipoEvento son inmutables SCD0.

**Se reduce o se aplana:** atributos de subtipos en una sola dimensión Personal; detalle de fotografías, permisos, firmantes y costos al convertirlos en conteos o eventos. Los nombres de meses, trimestre y día hábil son atributos de calendario, no nuevas entidades independientes del dominio.

**Se conserva fuera del almacén:** expedientes y relaciones finas en el esquema operacional, y binarios en almacenamiento de objetos. El artículo declara que el sistema actual es un almacén con objetos enlazados, no un lakehouse plenamente consultable.

## 7. Preguntas que permite responder el modelo

¿Qué obra, supervisor e informe respaldan una evidencia determinada? ¿Qué presupuesto y categorías de gasto forman el expediente de una obra? ¿Qué fuentes están vinculadas con ella? ¿Qué propuestas y votos corresponden a un poblador? ¿Qué cambios de estado se registraron y qué seguimiento mensual representa la obra? La correspondencia indica qué preguntas requieren tablas operacionales y cuáles pueden apoyarse en vistas analíticas.

## 8. Límites de los datos y de la revisión

El artículo evalúa datos sintéticos. Su sitio estático usa seis obras ilustrativas y el generador del almacén usa una población distinta. No deben presentarse cifras del prototipo como resultados reales del municipio ni como el resultado obtenido en la computadora del estudiante. La interfaz estática local y la API PostgreSQL son componentes diferentes; la evidencia de la consulta debe venir de PostgreSQL.

Esta revisión es del código y del manuscrito. La instalación, datos efectivamente cargados y resultados de la consulta quedan documentados posteriormente en levantamiento.md. Las fotografías del demo son ilustrativas y no se reutilizan como evidencia de ejecución del estudiante.

## Fuentes

González Casiano, U., Maldonado Mejía, M. T., & Hurtado Avilés, G. (2026). A dimensional data warehouse for geospatial monitoring of municipal public works, with an evolution path toward a lakehouse architecture [Manuscrito aceptado para ICOKG 2026, versión de repositorio]. https://github.com/gabrielhuav/PublicMunicipalWorks_DWH/blob/dd5766e46c2f7e06719868f2a0cf0cd8451fe867/paper/Paper_37_1.pdf

González Casiano, U., Maldonado Mejía, M. T., & Hurtado Avilés, G. (2026). PublicMunicipalWorks_DWH [Código fuente, revisión dd5766e46c2f7e06719868f2a0cf0cd8451fe867]. GitHub. https://github.com/gabrielhuav/PublicMunicipalWorks_DWH

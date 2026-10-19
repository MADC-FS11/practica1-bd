# Validación de informes y evidencia verificable

Autor: Marco Dichi. Asignar el issue a MADC-FS11.

## Necesidad

La calidad del análisis depende de lo que captura el supervisor. La presencia de una URL y un porcentaje no permite saber si alguien revisó el informe, si el archivo cambió o si corresponde al lugar reportado.

## Funcionalidad

El supervisor envía un informe a revisión. El director revisa sus fotografías y documentos, acepta o rechaza con una observación y conserva las decisiones anteriores. El panel distingue un avance declarado de uno validado y muestra la fecha de la última revisión.

## Cambios al modelo

Añadir ValidacionInforme(id_validacion, id_informe, codigo_revisor, fecha, resultado, observacion). InformeAvance tiene 0..N validaciones y cada validación corresponde a un informe y un Personal habilitado para revisar. Añadir a EvidenciaFotografica hash_sha256, fecha_captura, latitud y longitud, admitiendo metadatos desconocidos. El hash corresponde a los bytes recibidos y no demuestra autenticidad de la escena.

## Fundamento

Capítulo de obras, §8.2(3), sobre cobertura, calidad y actualización de datos de campo, y esquema imagenes_informe, que no incluye estado de revisión, ubicación capturada ni huella de contenido.

## Criterios de aceptación

Una aceptación conserva autor, fecha y hash asociado. Un rechazo exige motivo. Reemplazar el archivo genera una nueva evidencia y requiere revisión. Los reportes públicos muestran solo evidencia aprobada; el histórico interno conserva rechazos. Se permite ubicación ausente y se marca como pendiente, sin fabricar coordenadas.

## Dificultad

Media: añade flujo de revisión, metadatos y estados sin sustituir el almacén ni el almacenamiento de archivos.

Diagrama del cambio: P2/propuestas/eer-mejora-01.png

# Alertas por costo unitario y brecha físico-financiera

Autor: Marco Dichi. Asignar el issue a MADC-FS11.

## Necesidad

El criterio de monto absoluto puede señalar una obra grande aunque su costo sea normal y omitir una pequeña sobrevaluada. Además, el avance financiero puede superar al físico sin activar la regla existente.

## Funcionalidad

El director consulta alertas explicables por tipo de obra, unidad y período. Cada alerta muestra el valor observado, la referencia utilizada y la regla que la produjo. El responsable la revisa, documenta la explicación y la cierra o escala, sin considerar automáticamente el caso como corrupción.

## Cambios al modelo

Añadir TipoObra(id_tipo_obra, nombre, descripcion) y vincular Obra a un tipo. Añadir PartidaContrato(id_partida, id_obra, concepto, unidad, cantidad, precio_unitario), ReferenciaCosto(id_referencia, id_tipo_obra, region, unidad, costo_ref, inicio_vigencia, fin_vigencia), ReglaAlerta(id_regla, tipo, version, parametros, vigencia) y AlertaRevision(id_alerta, id_obra, id_regla, periodo, valor, umbral, estado, observacion). Mantener avance_fisico y avance_presupuestario por período sin sumar porcentajes.

## Fundamento

Capítulo de obras, §7.4: fallos de recuperación de sobreprecio y pagos adelantados. §8.3(5) propone reformular el criterio por tipo de obra; aquí se desarrolla el dato necesario, versionado y revisión humana.

## Criterios de aceptación

Comparar solo partidas con unidad y tipo compatibles; una referencia faltante produce dato insuficiente, no alerta de sobreprecio. Aplicar umbrales publicados al cociente precio observado/referencia y a la diferencia de porcentajes del mismo corte. Deduplicar por obra, período y versión de regla. Evaluar con la misma verdad de terreno sintética y registrar precisión/recuperación antes de aplicarlo a datos municipales.

## Dificultad

Alta: exige catálogo comparable de costos, granularidad por partida, reglas versionadas y evaluación de su comportamiento.

Diagrama del cambio: P2/propuestas/eer-mejora-02.png

# Convocatorias con presupuesto de créditos de participación

Autor: Marco Dichi. Asignar el issue a MADC-FS11.

## Necesidad

El voto simple puede concentrar preferencias sin expresar su intensidad y representar mal propuestas minoritarias. El esquema actual usa un período textual y no define un presupuesto de participación verificable.

## Funcionalidad

Cada poblador recibe la misma cantidad de créditos por convocatoria. Puede repartirlos entre propuestas y ve cuánto cuesta aumentar su apoyo. El portal publica reglas, fecha de cierre y conteos agregados; no publica la identidad del voto individual.

## Cambios al modelo

Añadir Convocatoria(id_convocatoria, inicio, cierre, limite_creditos, reglas_publicadas), vincular PropuestaCiudadana a ella y crear BolsaCreditos(id_poblador, id_convocatoria, creditos_iniciales, saldo) con PK compuesta. Añadir a Voto intensidad y creditos_consumidos. Usar una asignación vigente por poblador y propuesta, con registro separado de cambios si se habilita edición. Costo de intensidad k = k²; costo incremental de k a k+1 = 2k+1.

## Fundamento

Capítulo de obras, §8.2(2) sobre representatividad del voto simple y §8.3(3) sobre voto cuadrático. La propuesta concreta cuotas, cierre, unicidad, auditoría y privacidad.

## Criterios de aceptación

Descontar y registrar el voto en una sola transacción. Dos peticiones simultáneas no pueden gastar más créditos que el saldo. El cierre impide nuevas asignaciones. Un ajuste devuelve o descuenta la diferencia de costo. Comparar con voto simple en una simulación y una prueba voluntaria; no afirmar que la equidad mejoró sin medir participación y distribución de apoyo.

## Dificultad

Alta: requiere control transaccional de saldos, calendario, reglas de cambio, auditoría y evaluación de participación.

Diagrama del cambio: P2/propuestas/eer-mejora-03.png

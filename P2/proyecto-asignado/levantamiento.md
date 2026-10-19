# Levantamiento local del proyecto de obras públicas

**Estado: pendiente de ejecutar y verificar en la computadora del estudiante.**

## Identificación

- Estudiante: Marco Dichi.
- Original: https://github.com/gabrielhuav/PublicMunicipalWorks_DWH
- Fork propio: https://github.com/MADC-FS11/Data_Warehouse_static
- Commit realmente ejecutado del fork: c9b79491f731e2fb3174ceef496294465f291cac
- Versión usada para la revisión documental: `dd5766e46c2f7e06719868f2a0cf0cd8451fe867` 

## Requisitos identificados en el código

- Git, Docker Desktop con Compose y navegador.
- pgAdmin es un cliente opcional; no es el servidor de PostgreSQL.
- La configuración publicada es `docker/compose.yml` del repositorio asignado.
- PostgreSQL: base `obras_publicas`, usuario `obras`, contraseña local `obras_local`, host `localhost`, puerto `55432`.
- API Flask: puerto `5000`. Servicio Docker de base: `db`; servicio API: `api`; poblado: `seed` bajo perfil `tools`.
- Los datos sembrados son sintéticos. El almacenamiento R2 remoto no viene configurado con credenciales en este paquete.
- El Compose de P1 del estudiante está en `entorno/compose.yaml`, puerto local `5433`. Se conserva por separado.


## Consulta y resultados

Se entrega `consulta.sql` con consultas de solo lectura. Falta ejecutarlas y guardar resultado real (TXT o CSV) y captura con SQL y tabla visibles. Un resultado vacío no se debe cambiar manualmente por los números del artículo.


Los comandos operativos se trabajarán con el estudiante después de integrar los archivos del paquete.

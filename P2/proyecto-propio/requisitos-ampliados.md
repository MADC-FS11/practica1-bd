## 1. Problema y alcance

Los postres de Malu es un negocio de repostería casera que vende pasteles, gelatinas y galletas. Recibe pedidos por WhatsApp y registra clientes, productos, precios y fechas en libretas. La dispersión dificulta buscar un encargo, consultar el historial, conocer existencias y preparar reportes de ventas. La solución propuesta centraliza catálogo, solicitudes, entregas e inventario de productos terminados. El cliente puede ser atendido sin correo ni cuenta web.

Se conserva la base conceptual de P1 y P3.1: Cliente, Usuario, Pedido, DetallePedido, Producto e Inventario. El EER añade MovimientoInventario y distingue cuentas de clientes y personal. Los ingresos por ventas se estiman a partir de pedidos entregados. Este alcance no representa pagos efectivamente cobrados, anticipos, materias primas ni recetas.

## 2. Requisitos funcionales ampliados

RF01. Registrar y consultar clientes con nombre, teléfono y dirección opcional; el historial permanece aunque no exista cuenta web. RF02. Mantener productos con nombre, descripción, categoría, precio base, disponibilidad comercial e imagen. RF03. Registrar pedidos con fecha de solicitud, fecha de entrega, estado y uno o más detalles. RF04. Conservar cantidad, precio acordado y personalización por renglón, sin sustituir el precio histórico por el precio actual del catálogo.

RF05. Registrar existencias de productos terminados y movimientos de entrada o salida con fecha, cantidad y motivo. RF06. Consultar pedidos por cliente, estado y fecha, así como productos vendidos e ingresos estimados por período. RF07. Dar acceso mediante cuentas de cliente o cuentas de personal, con rol empleado o administrador. RF08. Desactivar productos sin borrar su presencia en pedidos anteriores.

## 3. Cardinalidades justificadas

En Chen, el par junto a cada entidad expresa cuántas veces puede participar esa entidad en la relación. En Crow’s Foot, el símbolo de cada extremo expresa cuántas instancias de ese extremo se vinculan a una instancia del otro. Los dos diagramas representan las mismas reglas, aunque sus etiquetas se leen con convenciones diferentes.

| Relación | Participación (mín,máx) en cada entidad | Regla de negocio |
| --- | --- | --- |
| Cliente - solicita - Pedido | (0,N) : (1,1) | Un cliente puede registrarse sin pedidos. Cada pedido pertenece a un solo cliente. |
| Pedido - contiene - DetallePedido | (1,N) : (1,1) | Todo pedido registrado contiene al menos un renglón. Un detalle no se comparte entre pedidos. |
| DetallePedido - incluye - Producto | (1,1) : (0,N) | Cada detalle corresponde a un producto. Un producto puede no haberse vendido todavía. |
| Producto - tiene - Inventario | (1,1) : (1,1) | Cada producto tiene un registro de existencias, incluso cuando la cantidad sea cero. |
| MovimientoInventario - pertenece a - Inventario | (1,1) : (0,N) | Cada movimiento afecta un inventario. Un inventario recién creado puede no tener movimientos. |
| Cliente - vincula - CuentaCliente | (0,1) : (1,1) | La cuenta es opcional para el cliente. Cada cuenta de cliente vincula exactamente un cliente. |

## 4. Entidades débiles y claves parciales

**DetallePedido.** Dependencia de identificación y de existencia respecto de Pedido. Su clave parcial es nro_renglon; el identificador completo es (id_pedido, nro_renglon). Un renglón 1 puede existir en diferentes pedidos sin conflicto. Cantidad, precio_unitario y personalizacion describen el renglón en el contexto de ese pedido.

**MovimientoInventario.** Dependencia de identificación y de existencia respecto de Inventario. Su clave parcial es nro_movimiento; el identificador completo es (id_inventario, nro_movimiento). Un movimiento sin inventario no permite determinar qué existencias modifica. Los consecutivos solo son únicos dentro del inventario propietario.

Ambas entidades usan doble rectángulo y relaciones identificadoras con doble rombo en Chen. En Crow’s Foot se muestran sus PK compuestas. Producto e Inventario son fuertes: la dependencia 1:1 no convierte automáticamente Inventario en una entidad débil de identificación.

## 5. Generalización y especialización

Usuario es el supertipo con id_usuario, nombre_usuario y contrasena_hash. La especialización es **disjunta (d)** y **total (t)**: cada cuenta pertenece exactamente a CuentaCliente o CuentaPersonal. La disyunción aplica a cuentas, no a personas. Una persona empleada que también compre puede figurar como Cliente y, si requiere acceso de cliente, tener otra cuenta.

| Subtipo | Dos atributos propios añadidos o conservados | Identidad heredada |
| --- | --- | --- |
| CuentaCliente | fecha_alta_cliente: fecha de habilitación de la cuenta; canal_preferido: WhatsApp o web. | id_usuario. Se vincula 1:1 a un Cliente, que puede existir sin cuenta. |
| CuentaPersonal | rol: empleado o administrador; fecha_ingreso: incorporación al negocio. | id_usuario. El rol no se confunde con el tipo de cuenta. |

Los atributos fecha_alta_cliente, canal_preferido y fecha_ingreso son requisitos de ampliación propuestos para P2. No se presentan como datos ya confirmados en la entrevista original. Se conservan los nombres y las claves de P3.1. El modelo viejo necesitaba estos atributos para cumplir el mínimo de dos por subtipo.

## 6. Atributos y conceptos adicionales

total es derivado: SUM(cantidad × precio_unitario). En Chen se representa con un óvalo discontinuo y en el relacional se calcula mediante consulta o vista. Se mantienen nombre y dirección como campos simples para ser compatibles con P3.1. No se introduce un atributo multivaluado de teléfonos porque el alcance actual registra uno por cliente.

No se requiere categorización: ningún subtipo depende de la unión de diferentes tipos de entidad. Tampoco se requiere agregación, porque las relaciones se describen con Pedido, DetallePedido e Inventario sin tratar una relación como participante de otra. Estos conceptos se evalúan y se justifican, en lugar de incorporarlos artificialmente.

## 7. Tres preguntas que aprovechan la ampliación

**Q1. ¿Qué renglones personalizados componen cada pedido y cuál fue su importe acordado?** DetallePedido conserva nro_renglon, personalizacion y precio_unitario. Se pueden distinguir dos renglones del mismo producto con personalizaciones diferentes.

**Q2. ¿Qué entradas y salidas explican las existencias de un producto en un período?** MovimientoInventario aporta secuencia local, fecha, tipo y cantidad. El modelo inicial solo guardaba un saldo y no permitía reconstruir su trayectoria.

**Q3. ¿Qué cuentas de cliente prefieren WhatsApp y qué personal con determinado rol está habilitado desde su fecha de ingreso?** Los atributos propios de los subtipos permiten consultas que el diseño previo no representaba.

La imposibilidad es relativa al **modelo inicial y a la información que conservaba**. Un MER sin notación EER podría responder estas preguntas si se ampliara para guardar la misma información con relaciones y restricciones equivalentes. El EER expresa con mayor claridad la herencia, la dependencia y la disyunción; la notación por sí sola no aumenta el poder del lenguaje SQL.

## 8. Integridad y transformación relacional

Las cantidades y claves parciales deben ser positivas; precios y existencias, no negativos. fecha_entrega no puede preceder a fecha_pedido. Los estados propuestos son solicitado, confirmado, en_preparacion, listo, entregado y cancelado. disponible expresa oferta comercial; cantidad_disponible expresa unidades terminadas.

Las FK no imponen por sí solas la especialización total y disjunta, un detalle mínimo por pedido ni un inventario obligatorio por producto. La implementación futura requiere transacciones y restricciones o disparadores apropiados. Al registrar un movimiento se actualiza el saldo en la misma transacción. Eliminar un cliente, producto o inventario con historia requiere una política de conservación; se recomienda desactivación o cancelación antes de borrar registros históricos.

## 9. Archivos y herramienta utilizada

eer-chen.png contiene rectángulos, óvalos, rombos, dobles contornos y triángulo d,t. eer-crows-feet.png muestra cajas, PK/FK y símbolos de cardinalidad. Ambos proceden de fuentes SVG editables, elaboradas con un generador estructural y exportadas a PNG. El DBML describe el modelo relacional y se puede abrir en dbdiagram.io. Se elige SVG por su legibilidad al ampliar y DBML para inspeccionar claves sin depender de una imagen.

## 10. Continuidad con P3.1

El documento cambios-respecto-p31.md identifica las ampliaciones y la copia DBML incluye los atributos propios añadidos. Los archivos de P3.1 no se reemplazan con este paquete. Al actualizar posteriormente su sitio, deben sincronizarse sus modelos con esta versión de P2, manteniendo las mismas claves. La fuente del caso es docs/caso-de-estudio.pdf y la del diseño previo es P3.1/modelo/modelos.md del ZIP del estudiante.

## Bibliografía

Dichi, M. (2026). Los postres de Malu: caso de estudio [Trabajo de curso, Práctica 1]. Escuela Superior de Cómputo, Instituto Politécnico Nacional.

Dichi, M. (2026). Los postres de Malu: modelos del negocio [Diseño de curso, Práctica 3.1]. Repositorio practica1-bd.

Instituto Politécnico Nacional, Escuela Superior de Cómputo. (2026). Práctica 2: Modelo Entidad-Relación Extendido: proyecto propio y proyecto asignado [Guía de práctica de Bases de Datos].

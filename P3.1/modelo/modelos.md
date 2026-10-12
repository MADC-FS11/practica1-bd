# Los postres de Malu: modelos del negocio

Estos modelos son una **propuesta reconstruida sobre el caso de estudio de la Práctica 1**. En el contexto recuperado no se encontró un EER final de la Práctica 2 ni un diagrama relacional final de la Práctica 3. Por eso no se presentan como copias de diagramas previamente entregados. Antes de entregar la Práctica 3.1, comparar con los modelos que sí se hayan realizado en esas prácticas y sustituir las imágenes si difieren.

## Punto de partida conservado

El negocio recibe pedidos por WhatsApp y registra información en libretas. Se venden productos terminados y los precios pueden ser de catálogo o cotizados por presentación y personalización. Se requieren clientes, historial de pedidos, fechas de entrega e inventario; existen usuarios de tipo cliente, empleado y administrador. Las ventas se obtienen de los pedidos entregados, sin crear una entidad Venta.

Se conservan las entidades Cliente, Usuario, Producto, Inventario, Pedido y DetallePedido. Cliente puede existir sin una cuenta de usuario. Esto permite registrar pedidos recibidos por WhatsApp sin obligar al cliente a crear una cuenta.

## Evolución propuesta para el EER

La ampliación incorpora dos entidades débiles y una especialización total y disjunta. Estas decisiones se agregaron para representar explícitamente conceptos del EER que no estaban desarrollados en el modelo inicial.

| Elemento | Identificación | Decisión |
| --- | --- | --- |
| DetallePedido | Pedido + nro_renglon | Entidad débil de Pedido. nro_renglon es su clave parcial. Reemplaza el id_detalle global sugerido en P1. |
| MovimientoInventario | Inventario + nro_movimiento | Segunda entidad débil. Registra entradas y salidas de productos terminados; se agrega al modelo inicial. |
| Usuario | id_usuario | Supertipo de las cuentas de acceso. |
| CuentaCliente | id_usuario heredado | Subtipo que se vincula con un cliente. |
| CuentaPersonal | id_usuario heredado | Subtipo con rol empleado o administrador. |

La especialización es **total** porque toda cuenta de Usuario pertenece a un subtipo y **disjunta** porque una misma cuenta no pertenece a ambos. Si una persona del negocio también compra, puede tener un registro de Cliente y, si lo necesita, una cuenta de cliente distinta; la disyunción se aplica a cuentas, no a personas físicas.

El atributo contrasena del bosquejo inicial pasa a llamarse contrasena_hash, como definición para una implementación futura. No hay valores de acceso ni credenciales en los archivos del sitio. El vínculo opcional Usuario–Cliente se representa mediante CuentaCliente. El rol administrativo se ubica en CuentaPersonal. personalizacion se agrega al detalle para documentar cotizaciones o variantes solicitadas.

## Relaciones y cardinalidades

| Relación | Regla de negocio |
| --- | --- |
| Cliente–Pedido | Un cliente puede tener 0..N pedidos. Cada pedido pertenece a exactamente 1 cliente. |
| Pedido–DetallePedido | Un pedido debe tener 1..N renglones. Cada detalle pertenece a exactamente 1 pedido. La solicitud con productos debe registrarse como una unidad. |
| Producto–DetallePedido | Un producto puede aparecer en 0..N renglones. Cada detalle corresponde a exactamente 1 producto. |
| Producto–Inventario | Cada producto tiene exactamente 1 inventario y cada inventario corresponde a exactamente 1 producto. Cantidad cero no elimina ese registro. |
| Inventario–MovimientoInventario | Un inventario puede tener 0..N movimientos. Cada movimiento pertenece a exactamente 1 inventario. |
| Cliente–CuentaCliente | Un cliente puede tener 0..1 cuenta de cliente. Cada CuentaCliente se asocia a exactamente 1 cliente. |
| Usuario–subtipos | Cada usuario pertenece a exactamente 1 de CuentaCliente o CuentaPersonal. Cada fila de subtipo corresponde a exactamente 1 usuario. |

En el EER se usa una notación de cajas con atributos y relaciones mediante rombos. Las entidades débiles y sus relaciones identificadoras tienen contorno doble. Las claves parciales tienen subrayado discontinuo. El círculo d indica disyunción y la línea doble que llega desde Usuario indica totalidad. El número junto a una entidad expresa su participación mínima y máxima en esa relación. Los atributos de identificación de los subtipos se heredan.

## Transformación al modelo relacional

| Tabla | Clave primaria | Claves foráneas y unicidad |
| --- | --- | --- |
| usuario | id_usuario | nombre_usuario único; tipo_cuenta es cliente o personal. |
| cuenta_cliente | id_usuario | id_usuario → usuario; id_cliente → cliente y UNIQUE. |
| cuenta_personal | id_usuario | id_usuario → usuario; rol es empleado o administrador. |
| cliente | id_cliente | — |
| pedido | id_pedido | id_cliente → cliente. |
| detalle_pedido | (id_pedido, nro_renglon) | id_pedido → pedido; id_producto → producto. |
| producto | id_producto | — |
| inventario | id_inventario | id_producto → producto y UNIQUE. |
| movimiento_inventario | (id_inventario, nro_movimiento) | id_inventario → inventario. |

Las claves parciales nro_renglon y nro_movimiento **no** son únicas globalmente: adquieren unicidad junto con la clave de su entidad propietaria.

En el diagrama relacional la barra representa uno, el círculo opcionalidad y la pata de cuervo muchos. La marca junto a una tabla indica cuántas filas de esa tabla pueden vincularse con una fila del otro extremo. Esta convención es diferente de la participación mínima/máxima escrita junto a las entidades del EER; ambas expresan las mismas reglas de negocio descritas en la tabla anterior.

## Valores derivados y coherencia

- total_pedido = SUM(cantidad × precio_unitario) de sus detalles. El EER lo muestra como atributo derivado; el relacional lo explica en una nota y no lo duplica como columna. Puede obtenerse con una consulta o vista cuando se implemente la base de datos. Es un cambio explícito respecto al atributo total inicialmente sugerido en P1.
- Las ventas e ingresos por ventas se calculan con pedidos de estado entregado. Esto no representa pagos ni anticipos: si después se requieren, deben modelarse por separado.
- precio_unitario conserva el precio cotizado al solicitar el pedido. No se reemplaza por el precio vigente del catálogo.
- Los movimientos y cantidad_disponible deberán mantenerse coherentes en una transacción. No hay cálculo ni actualización de inventario en esta página estática.
- Cantidad y claves parciales deben ser positivas; precios y existencias no negativos; fecha_entrega no debe ser anterior a fecha_pedido.
- En este modelo disponible expresa si se ofrece un producto, mientras cantidad_disponible representa unidades terminadas en inventario. No son el mismo atributo.

## Restricciones que necesitan implementación adicional

El archivo DBML describe tablas, tipos, PK, FK y UNIQUE; **no implementa** por sí solo todas las reglas del negocio. Una futura implementación deberá asegurar:

1. La existencia de exactamente un subtipo por Usuario y su concordancia con tipo_cuenta.
2. La creación de cada Producto con su Inventario en la misma transacción, y la consistencia al eliminarlos.
3. La existencia de al menos un DetallePedido por Pedido al terminar su transacción de creación.
4. Las validaciones de cantidades, fechas y precios, y la coherencia entre movimientos y existencias.

No basta una FK para exigir que cada padre tenga hijos ni para imponer especialización total/disjunta. Podrán emplearse transacciones y restricciones o disparadores adecuados en PostgreSQL. Esta entrega solo documenta el diseño: no configura ni programa un backend.

## Archivos y edición

- [EER en SVG](../docs/assets/modelo-eer.svg): imagen vectorial editable, sin pérdida al ampliar.
- [EER en PNG](../docs/assets/modelo-eer.png): imagen de alta resolución para otras entregas.
- [Relacional en SVG](../docs/assets/diagrama-relacional.svg).
- [Relacional en PNG](../docs/assets/diagrama-relacional.png).
- [Relacional en DBML](diagrama-relacional.dbml): pegar en el editor de https://dbdiagram.io y exportar una imagen si se modifica el esquema. Es un archivo descriptivo; no se ejecuta en el navegador.

Los SVG pueden editarse como texto o en un editor vectorial. Si se cambia alguno, actualizar también su PNG para que las dos versiones coincidan.

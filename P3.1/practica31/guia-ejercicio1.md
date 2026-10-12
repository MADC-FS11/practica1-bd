# Publicar Los postres de Malu en GitHub Pages

Esta guía cubre **únicamente el ejercicio 1** de la Práctica 3.1. La entrega solicitada es la dirección pública de GitHub Pages. Descargar el paquete o abrir index.html no genera esa dirección; publicar requiere copiar los archivos a tu repositorio y activar Pages.

## 1. Ubica tu repositorio y prepara la rama

Abre tu repositorio original de las prácticas de Bases de Datos en VS Code. Abre una terminal PowerShell en esa carpeta. Conserva tus avances existentes y parte de la rama que los tenga más actualizados.

```powershell
git status
git branch --show-current
git remote -v
```

Si hay trabajo previo pendiente, revísalo y guárdalo antes de cambiar de rama. No uses git reset ni git clean para preparar esta práctica. Crea la rama pedida desde los avances actuales:

```powershell
git switch -c practica31
```

Si practica31 ya existe, usa git switch practica31 en lugar de crearla otra vez. Si tu versión de Git no admite switch, el equivalente para crearla es git checkout -b practica31.

## 2. Copia las carpetas del paquete

Descomprime Los-postres-de-Malu-Ejercicio1.zip. Copia **el contenido de la carpeta Los-postres-de-Malu** dentro de la raíz de tu repositorio, donde están README.md y las carpetas de las prácticas anteriores:

```text
TU_REPOSITORIO/
  README.md                           ← conserva tu README existente
  docs/
    index.html
    estilos.css
    config.js
    script.js
    .nojekyll
    assets/
      favicon.svg
      modelo-eer.svg
      modelo-eer.png
      diagrama-relacional.svg
      diagrama-relacional.png
  modelo/
    modelos.md
    diagrama-relacional.dbml
  practica31/
    guia-ejercicio1.md
    encabezado-README.md
```

No copies la carpeta contenedora completa como un subdirectorio: docs tiene que quedar directamente en la raíz del repositorio. Si ya tienes docs con documentos de P1, **conserva esos archivos** y agrega los del sitio. Si existen otros archivos index.html, estilos.css, config.js o script.js del mismo nombre, guarda una copia antes de sustituirlos.

GitHub permite publicar desde la raíz de una rama o desde su carpeta docs. Esta entrega usa docs en la rama practica31. No uses P3/docs ni practica31/docs como carpetas físicas de publicación: practica31 es el nombre de la rama.

## 3. Completa los dos enlaces reales

Abre docs/config.js y pega la dirección de tu repositorio original y la dirección de **tu fork**, no la del repositorio de gabrielhuav:

```javascript
window.MALU_CONFIG = Object.freeze({
  repositorioEquipo: "https://github.com/TU_USUARIO/TU_REPOSITORIO",
  forkAsignado: "https://github.com/TU_USUARIO/NOMBRE_REAL_DE_TU_FORK"
});
```

El sitio deja deshabilitado un enlace vacío o inválido para no publicar una dirección inventada. La franja de configuración desaparece cuando ambos enlaces tienen una URL de repositorio de GitHub válida. Validar su formato no demuestra que el repositorio exista o sea público: **abre ambos enlaces en privado**.

Para encontrar el enlace de tu repositorio, abre la página de GitHub de tus prácticas y copia la dirección de la barra del navegador. git remote -v también permite localizarlo; convierte una dirección SSH git@github.com:usuario/repositorio.git a la dirección web https://github.com/usuario/repositorio.

Si aún no tienes el fork de P2, abre https://github.com/gabrielhuav/Data_Warehouse_static, pulsa Fork y luego Create fork en tu cuenta. Abre el fork resultante y copia su URL. No hay que clonar ese proyecto dentro de la carpeta docs ni dentro de tu repositorio de prácticas.

El campo Integrantes permanece en blanco por solicitud del autor.

## 4. Revisa los modelos antes de publicarlos

Los diagramas toman como base el caso de P1 y sus seis entidades principales. Son una reconstrucción propuesta: no se recuperó un EER final de P2 ni un relacional final de P3. La ampliación incorpora CuentaCliente, CuentaPersonal y MovimientoInventario, cambia la identificación de DetallePedido por una clave compuesta y calcula el total del pedido a partir de sus detalles.

Lee modelo/modelos.md. Si tus modelos finales de P2 y P3 ya son diferentes, usa esos modelos para cumplir la consigna: exporta sus imágenes y sustituye los SVG/PNG en docs/assets. Actualiza también las descripciones de los diagramas en index.html y las notas del modelo. Los modelos publicados deben corresponder a tus prácticas reales.

Para editar el relacional generado, pega modelo/diagrama-relacional.dbml en https://dbdiagram.io. No se requiere instalar PostgreSQL ni Docker para mostrar estas imágenes.

## 5. Abre y comprueba el sitio en tu computadora

Puedes hacer doble clic en docs/index.html. Todos los recursos del sitio son locales y tienen rutas relativas. Verifica:

- Nombre Los postres de Malu, problema e integrantes en blanco.
- Las dos pestañas del modelo y la ampliación de cada imagen.
- Botones + y −, cierre del visor y tecla Escape.
- Los dos enlaces reales a repositorios públicos.
- Legibilidad al reducir el ancho de la ventana.

Como alternativa, con Python instalado:

```powershell
python -m http.server 8000 --directory docs
```

Abre http://localhost:8000/ y detén el servidor con Ctrl+C al terminar. Para esta práctica no se requiere instalación de bibliotecas, npm, servidor de aplicaciones ni base de datos.

## 6. Agrega la dirección al encabezado del README

La URL de un sitio de proyecto normalmente es:

```text
https://TU_USUARIO.github.io/TU_REPOSITORIO/
```

GitHub Pages te mostrará la dirección definitiva después de publicar. Abre README.md en la raíz y agrega su dirección al comienzo, por ejemplo:

```markdown
**Live website:** https://TU_USUARIO.github.io/TU_REPOSITORIO/
```

Puedes adaptar el bloque de practica31/encabezado-README.md para ese encabezado y la declaración de uso de IA. **No reemplaces ni borres la documentación previa de P1/P2.** Reemplaza cada marcador TU_USUARIO, TU_REPOSITORIO y NOMBRE_REAL_DE_TU_FORK por el dato real. Mantén en blanco los integrantes como solicitaste. Esto es solo un fragmento para el ejercicio 1 y no desarrolla todo el README del ejercicio 2.

## 7. Confirma y sube los archivos

Desde la raíz de tu repositorio:

```powershell
git status
git add docs/index.html docs/estilos.css docs/config.js docs/script.js docs/.nojekyll docs/assets modelo/modelos.md modelo/diagrama-relacional.dbml practica31/guia-ejercicio1.md practica31/encabezado-README.md README.md
git diff --cached --stat
git diff --cached -- docs/config.js README.md
git commit -m "Publica frontend de Los postres de Malu para practica 3.1"
git push -u origin practica31
```

La revisión permite confirmar que subes los enlaces correctos. No agregues contraseñas, archivos .env ni cadenas de conexión. Los nombres de atributos del diagrama son definiciones del modelo, no credenciales reales.

## 8. Activa GitHub Pages

En la página de **tu repositorio de prácticas** en GitHub:

1. Confirma que sea público y que aparezca la rama practica31 con docs/index.html.
2. Entra a Settings → Pages.
3. En Build and deployment, establece Source: Deploy from a branch.
4. En Branch selecciona practica31.
5. En la carpeta selecciona /docs.
6. Pulsa Save.
7. Revisa Actions si la publicación sigue pendiente. Espera al resultado exitoso y vuelve a Pages.
8. Copia la URL que aparezca junto a Your site is live at. Entrega esa dirección, no la de un archivo de GitHub ni una ruta de Windows.

Las confirmaciones posteriores en practica31 que cambien docs actualizarán el sitio publicado. No necesitas fusionar a main para este ejercicio; la fuente de Pages seguirá siendo la rama que seleccionaste.

## 9. Comprueba la entrega como visitante

Abre una ventana privada o InPrivate (Ctrl+Shift+N en Chrome/Edge) y pega la URL del sitio. Comprueba de nuevo la presentación, ambas imágenes y los dos enlaces de repositorios. Estos también deben abrir sin iniciar sesión.

Si falta una imagen o un estilo, revisa que la ruta no empiece con / y que el nombre coincida en mayúsculas y minúsculas. Se usan estilos.css, assets/modelo-eer.svg y assets/diagrama-relacional.svg, sin diagonal inicial. Si aparece 404, revisa rama practica31, carpeta /docs, existencia de index.html y resultado de Actions.

## 10. Coloca el enlace en los dos lugares pedidos

1. **Encabezado de README.md:** usa la URL exacta que devolvió Pages. Si cambia respecto de la prevista, actualiza el README, confirma y sube el cambio:

```powershell
git add README.md
git commit -m "Agrega direccion verificada de GitHub Pages"
git push
```

2. **Campo Website del repositorio:** vuelve a la pestaña Code de tu repositorio. A la derecha, pulsa el engrane de About. Pega la dirección en Website y guarda con Save changes.

La entrega es el **enlace público del sitio funcionando**. Conserva el sitio y repositorios accesibles al profesor.

## Comprobación final del ejercicio 1

| Requisito | Qué verificar |
| --- | --- |
| Rama practica31 | La seleccionaste en Pages y subiste los archivos. |
| Sitio estático | HTML, CSS y JS; sin peticiones a backend ni conexión a BD. |
| Nombre y problema | Aparecen en el inicio y en El proyecto. |
| Integrantes | Campo presente y vacío. |
| EER y relacional legibles | Imágenes SVG/PNG, pestañas y visor; corresponden a las prácticas 2 y 3 finales. |
| Dos enlaces | Repositorio de prácticas y fork propio del proyecto asignado; ambos públicos. |
| Rutas relativas | Recursos dentro de docs sin / inicial. |
| Datos de acceso | Ninguna contraseña real ni cadena de conexión. |
| Comprobación privada | El sitio y ambos repositorios abren en una ventana privada. |
| Enlace en README y Website | La dirección definitiva está en ambos lugares. |
| Uso de IA declarado | Adaptaste la declaración propuesta del encabezado. |

## Fuente para los pasos de Pages

GitHub Docs. Configurar un origen de publicación para tu sitio de GitHub Pages. https://docs.github.com/es/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

Los ejercicios 2 al 6 quedan fuera de este paquete.

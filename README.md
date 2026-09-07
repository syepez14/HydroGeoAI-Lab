# HydroGeoAI Lab — Modular Website v4

Esta versión mantiene el diseño del sitio, pero separa **diseño** y **contenido**. Para agregar información nueva normalmente **no se edita `index.html`**: se crea una carpeta y un `.txt`.

## Flujo normal

1. Crear una carpeta dentro del módulo correspondiente.
2. Copiar la plantilla desde `Templates/`.
3. Completar el `.txt`.
4. Agregar una imagen, GIF o video si corresponde.
5. Hacer **Commit**.
6. El workflow `Build HydroGeoAI data` se ejecuta automáticamente y actualiza `data/*.json`.

No es necesario entrar a **Actions** en cada cambio; `Run workflow` queda como opción manual si alguna actualización no se ejecuta.

---

## Estructura

```text
About/
News/
Projects/
Services/
Team/
Collaborations/
  National/
  International/
Equipment/
Technologies/
Resources/
Publications/
Contact/
Templates/
```

## Multimedia automática

Dentro de cualquier carpeta de contenido puedes usar:

- imágenes: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`
- video: `.mp4`, `.webm`, `.mov`, `.m4v`

El sistema prioriza nombres como `photo`, `image`, `media`, `cover`, `video` o `logo`, pero también puede detectar otro archivo multimedia dentro de la carpeta.

Las imágenes, GIF y videos mostrados en la web se pueden abrir en tamaño grande haciendo clic sobre ellos.

Para `Resources`, además se detectan automáticamente archivos `.pdf`, `.pptx`, `.docx`, `.xlsx`, `.zip`, `.csv`, entre otros.

---

# 1. About automático

`About/about.txt`

```text
Intro: Texto introductorio.

Mission: Misión del laboratorio.

Vision: Visión del laboratorio.
```

Las áreas se agregan en:

```text
About/Areas/Artificial Intelligence/area.txt
```

```text
Icon: ai
Summary: Descripción del área.
```

Iconos disponibles actualmente: `remote`, `ai`, `water`.

---

# 2. News & Notices

```text
News/
└── Nombre de la noticia/
    ├── news.txt
    └── image.jpg   # opcional
```

```text
Date: 2026-09-06
Type: News
Summary: Resumen breve.
Link:
```

Las noticias se ordenan por fecha y se muestran horizontalmente.

---

# 3. Projects

```text
Projects/
└── Nombre del proyecto/
    ├── project.txt
    └── image.jpg   # opcional
```

```text
Type: FONDECYT
Scope: National
Status: Ongoing
Period: 2026 – 2029
Role: Principal Investigator
Summary: Descripción breve.
Link:
Publications:
Results:
```

`Link:` genera el botón genérico **Open project**.

---

# 4. Services

```text
Services/
└── Nombre del servicio/
    ├── service.txt
    └── image.jpg   # opcional
```

```text
Icon: ai
Summary: Descripción del servicio.
Website:
```

Si existe multimedia, se muestra; si no, se utiliza el icono.

---

# 5. Team

El nombre de la carpeta es el nombre del integrante:

```text
Team/
└── Santiago Yepez/
    ├── profile.txt
    └── photo.jpg
```

Formato estándar:

```text
Position: Principal Investigator · HydroGeoAI Lab

Studies: Forest Sciences

Organization: University of Concepción · Chile

Summary: Researcher specializing in...

Keywords: Fluvial Geomorphology; Hydrology; Hyperspectral Remote Sensing

LinkedIn:

ResearchGate:

ORCID:

Website:
```

La web ordena automáticamente los integrantes en:

1. Lab Leader
2. Researchers
3. Postgraduate Students
4. Undergraduate Students
5. Other Members

El grupo **Lab Leader** queda abierto inicialmente; los demás son desplegables.

---

# 6. Collaborations

Se mantiene separado en:

```text
Collaborations/National/
Collaborations/International/
```

Cada colaborador puede utilizar el mismo nivel de información visual que Team:

```text
Position:
Studies:
Organization: Institution name
Country: Chile
Summary: Área principal de colaboración.
Keywords: Keyword 1; Keyword 2
LinkedIn:
ResearchGate:
ORCID:
Website:
```

La bandera se genera automáticamente a partir de `Country:`. National e International son desplegables para no saturar la página.

---

# 7. Equipment

```text
Equipment/
└── Nombre del equipo/
    ├── equipment.txt
    └── image.jpg
```

```text
Model: Modelo del equipo
Summary: Descripción.
Website:
```

---

# 8. Technologies

Para software, modelos y desarrollos digitales:

```text
Technologies/
└── Nombre del software/
    ├── technology.txt
    └── image.png   # opcional
```

```text
Version:
Summary: Descripción del desarrollo.
Link:
Repository:
```

---

# 9. Resources

Para manuales, clases, guías, datos y material educativo:

```text
Resources/
└── Manual Hyperspectral/
    ├── resource.txt
    ├── image.jpg      # opcional
    └── manual.pdf     # opcional, detectado automáticamente
```

```text
Type: Manual
Summary: Descripción del recurso.
Link:
```

---

# 10. Publications

El nombre de la carpeta es el título de la publicación:

```text
Publications/
└── Título del artículo/
    └── publication.txt
```

```text
Year: 2026
DOI: 10.1234/example.2026.001
Link:
```

Puedes pegar el DOI como `10.xxxx/...` o como `https://doi.org/...`; la web genera automáticamente el enlace DOI. Las publicaciones se ordenan de más reciente a más antigua.

---

# 11. Contact y redes sociales

`Contact/contact.txt`

```text
Email: syepez@udec.cl
Location: HydroGeoAI Lab · Concepción, Chile
Latitude: -36.834495
Longitude: -73.032547
MapLink: https://maps.app.goo.gl/EthMW9VcD7aecfzE7
Instagram:
Facebook:
LinkedIn:
YouTube:
X:
ResearchGate:
Website:
```

Solo aparecen los botones de las redes que tengan un enlace.

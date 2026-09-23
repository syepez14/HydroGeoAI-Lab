# HydroGeoAI Lab

HydroGeoAI Lab es un laboratorio de investigación fundado en 2026 por Santiago Yépez, académico de la Facultad de Ciencias Forestales de la Universidad de Concepción.

El laboratorio está orientado al estudio de sistemas acuáticos y fluviales mediante la integración de teledetección, geomática, inteligencia artificial, modelación ambiental y análisis de datos.

Sus líneas de trabajo incluyen, entre otras:

- Teledetección aplicada a ríos, lagos y cuencas.
- Inteligencia artificial y aprendizaje automático.
- Hidrología y geomorfología fluvial.
- Imágenes hiperespectrales y multiespectrales.
- Fotogrametría, UAV y modelación 3D.
- Calidad de agua y monitoreo ambiental.
- Desarrollo de herramientas y plataformas digitales para investigación.

## Página web

La página web oficial de HydroGeoAI Lab fue desarrollada por Bastián Rivas Maldonado con apoyo de ChatGPT Plus.

El sitio fue diseñado como una plataforma modular y dinámica, permitiendo incorporar y actualizar contenidos del laboratorio de forma sencilla mediante carpetas y archivos de texto, incluyendo:

- Noticias.
- Proyectos.
- Servicios.
- Cursos.
- Equipo de trabajo.
- Colaboraciones.
- Equipamiento.
- Tecnologías.
- Recursos.
- Publicaciones.
- Información de contacto.

La página es compatible con computadores, tablets y dispositivos móviles.

## Repositorio

Este repositorio contiene los archivos necesarios para el funcionamiento y mantenimiento de la página web de HydroGeoAI Lab.

El contenido del sitio se organiza mediante carpetas independientes, lo que permite mantener la información actualizada sin modificar directamente la estructura principal de la página.

## Mantención, incorporación y actualización

- 2026, Septiembre 09: Bastián Rivas M. — Creación, configuración y actualización general de la página web.

## Versión 6 — navegación y contenidos dinámicos

La versión actual incorpora movimiento horizontal automático en las colecciones de contenido, filtros dinámicos, galerías multimedia automáticas y contadores generales del laboratorio.

### Proyectos

Los proyectos pueden filtrarse por `Type` y `Status`. Los valores se leen directamente desde cada `project.txt`, por lo que se pueden usar categorías como `FONDECYT`, `VRID`, `CORFO`, etc., y estados en inglés como `Open`, `Ongoing`, `In Progress`, `Closed` o `Completed`.

### Servicios

Los servicios admiten el campo `Type:` para filtrar la sección. Al seleccionar o abrir un servicio se muestra una vista ampliada con su información y enlaces.

### Cursos

La carpeta `/Courses` permite publicar cursos pagados, talleres y programas de formación. Cada curso utiliza una carpeta propia con `course.txt` y multimedia opcional. La página permite filtrar por tema, nivel, formato y estado.

### Multimedia

Una carpeta puede contener una o más imágenes, GIF o videos. Cuando hay varios archivos, la tarjeta los rota automáticamente y mantiene navegación manual y apertura en pantalla completa.

### Varios enlaces en un mismo campo

Los campos como `Publications:`, `Results:`, `Documentation:`, `Link:` y otros admiten múltiples URLs. Se pueden separar por punto y coma o escribir una URL por línea. La página crea automáticamente un botón para cada enlace.

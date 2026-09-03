# HydroGeoAI Lab — modular website

## Main idea

Do not edit `index.html` to add content.

Add a folder to the appropriate category and place a standardized `.txt` file inside it.
GitHub Actions will detect the folders and generate JSON files used by the website.

## Structure

```text
Team/
Projects/
Services/
Equipment/
Collaborations/
  National/
  International/
Publications/
```

### Team

```text
Team/
└── Santiago Yepez/
    ├── profile.txt
    └── photo.jpeg
```

`profile.txt`:

```text
Badge: Lab Leader
Position: Principal Investigator · HydroGeoAI Lab
Studies: Forest Sciences
Organization: University of Concepción · Chile
Summary: ...
Keywords: Fluvial Geomorphology; Hydrology; Hyperspectral Remote Sensing
LinkedIn: https://...
ResearchGate: https://...
ORCID: https://...
Website: https://...
```

The folder name becomes the person's name automatically.

### Projects

```text
Projects/
└── Project Name/
    └── project.txt
```

```text
Type: FONDECYT
Scope: National
Status: Ongoing
Period: 2026 – 2029
Role: Principal Investigator
Summary:
Project:
Publications:
Results:
```

### Services

```text
Services/
└── Hyperspectral Imaging/
    └── service.txt
```

```text
Icon: 🌈
Summary: Hyperspectral acquisition and analysis for vegetation, water quality and environmental characterization.
Website:
```

### Equipment

```text
Equipment/
└── DJI Matrice/
    ├── equipment.txt
    └── photo.jpeg
```

```text
Model: DJI Matrice
Summary: UAV platform for high-resolution environmental remote sensing.
Website:
```

### Collaborations

```text
Collaborations/
├── National/
│   └── Institution Name/
│       └── collaboration.txt
└── International/
    └── Institution Name/
        └── collaboration.txt
```

```text
Organization: University / Research Center
Country: Chile
Summary: Main area of collaboration.
Website:
LinkedIn:
```

### Publications

```text
Publications/
└── Short Publication Name/
    └── publication.txt
```

```text
Year: 2026
Authors: Author A; Author B
Journal: Journal Name
Project Name: Related HydroGeoAI project
DOI: https://doi.org/...
PDF:
```

## GitHub Pages

Use GitHub Pages from branch `main`, root `/`.

The action `.github/workflows/build-data.yml` runs automatically whenever content folders change.

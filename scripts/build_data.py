from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
DATA.mkdir(exist_ok=True)

def parse_txt(path):
    result = {}
    if not path.exists():
        return result

    current_key = None
    buffer = []

    def flush():
        nonlocal current_key, buffer
        if current_key is not None:
            result[current_key] = "\n".join(buffer).strip()
        current_key = None
        buffer = []

    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.rstrip()

        m = re.match(r"^([A-Za-zÁÉÍÓÚáéíóúÑñ0-9_ -]+):\s*(.*)$", line)
        if m:
            flush()
            current_key = m.group(1).strip().lower().replace(" ", "_")
            buffer = [m.group(2).strip()]
        elif current_key is not None:
            buffer.append(line)

    flush()
    return result

def image_in(folder):
    for name in ["photo.jpeg","photo.jpg","photo.png","image.jpeg","image.jpg","image.png","logo.png","logo.jpeg","logo.jpg"]:
        p = folder / name
        if p.exists():
            return p.relative_to(ROOT).as_posix()
    return ""

def semicolon_list(v):
    return [x.strip() for x in (v or "").split(";") if x.strip()]

def scan_folder(base, txt_name, transform=None):
    items = []
    if not base.exists():
        return items

    for folder in sorted([p for p in base.iterdir() if p.is_dir()], key=lambda x: x.name.lower()):
        data = parse_txt(folder / txt_name)
        data["name"] = folder.name

        photo = image_in(folder)
        if photo:
            data["photo"] = photo

        if "keywords" in data:
            data["keywords"] = semicolon_list(data["keywords"])

        if transform:
            data = transform(data, folder)

        items.append(data)

    return items

team = scan_folder(ROOT/"Team", "profile.txt")
projects = scan_folder(ROOT/"Projects", "project.txt")
services = scan_folder(ROOT/"Services", "service.txt")
equipment = scan_folder(ROOT/"Equipment", "equipment.txt")
national = scan_folder(ROOT/"Collaborations"/"National", "collaboration.txt")
international = scan_folder(ROOT/"Collaborations"/"International", "collaboration.txt")
publications = scan_folder(ROOT/"Publications", "publication.txt")

outputs = {
    "team.json": team,
    "projects.json": projects,
    "services.json": services,
    "equipment.json": equipment,
    "collaborations_national.json": national,
    "collaborations_international.json": international,
    "publications.json": publications
}

for filename, payload in outputs.items():
    (DATA/filename).write_text(
        json.dumps(payload, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )
    print(f"{filename}: {len(payload)} items")

from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
DATA.mkdir(exist_ok=True)

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
VIDEO_EXTS = {".mp4", ".webm", ".mov", ".m4v"}
MEDIA_EXTS = IMAGE_EXTS | VIDEO_EXTS
DOWNLOAD_EXTS = {".pdf", ".ppt", ".pptx", ".doc", ".docx", ".xls", ".xlsx", ".zip", ".csv"}


def parse_txt(path: Path):
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


def media_in(folder: Path):
    """Return first preferred media file in a folder."""
    preferred_stems = ["photo", "image", "media", "cover", "video", "logo"]
    files = [p for p in folder.iterdir() if p.is_file() and p.suffix.lower() in MEDIA_EXTS]
    if not files:
        return "", ""

    def priority(p):
        stem = p.stem.lower()
        try:
            stem_rank = preferred_stems.index(stem)
        except ValueError:
            stem_rank = len(preferred_stems)
        ext_rank = 0 if p.suffix.lower() in IMAGE_EXTS else 1
        return (stem_rank, ext_rank, p.name.lower())

    p = sorted(files, key=priority)[0]
    media_type = "video" if p.suffix.lower() in VIDEO_EXTS else "image"
    return p.relative_to(ROOT).as_posix(), media_type


def downloadable_in(folder: Path):
    files = [p for p in folder.iterdir() if p.is_file() and p.suffix.lower() in DOWNLOAD_EXTS]
    if not files:
        return ""
    p = sorted(files, key=lambda x: x.name.lower())[0]
    return p.relative_to(ROOT).as_posix()


def semicolon_list(value):
    return [x.strip() for x in (value or "").split(";") if x.strip()]


def scan_folder(base: Path, txt_name: str):
    items = []
    if not base.exists():
        return items

    for folder in sorted([p for p in base.iterdir() if p.is_dir()], key=lambda x: x.name.lower()):
        if folder.name.startswith("_") or folder.name.upper().startswith("EXAMPLE"):
            continue

        data = parse_txt(folder / txt_name)
        data["name"] = folder.name

        media, media_type = media_in(folder)
        if media:
            data["media"] = media
            data["media_type"] = media_type
            # compatibility with the old website
            data["photo"] = media

        download = downloadable_in(folder)
        if download:
            data["download"] = download

        if "keywords" in data:
            data["keywords"] = semicolon_list(data["keywords"])

        items.append(data)

    return items


def write_json(filename, payload):
    (DATA / filename).write_text(
        json.dumps(payload, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )
    print(f"{filename}: {len(payload) if isinstance(payload, list) else 'ok'}")


# ABOUT
about = parse_txt(ROOT / "About" / "about.txt")
about_areas = scan_folder(ROOT / "About" / "Areas", "area.txt")
about["areas"] = about_areas
write_json("about.json", about)

# DYNAMIC MODULES
write_json("news.json", scan_folder(ROOT / "News", "news.txt"))
write_json("team.json", scan_folder(ROOT / "Team", "profile.txt"))
write_json("projects.json", scan_folder(ROOT / "Projects", "project.txt"))
write_json("services.json", scan_folder(ROOT / "Services", "service.txt"))
write_json("equipment.json", scan_folder(ROOT / "Equipment", "equipment.txt"))
write_json("technologies.json", scan_folder(ROOT / "Technologies", "technology.txt"))
write_json("resources.json", scan_folder(ROOT / "Resources", "resource.txt"))
write_json("collaborations_national.json", scan_folder(ROOT / "Collaborations" / "National", "collaboration.txt"))
write_json("collaborations_international.json", scan_folder(ROOT / "Collaborations" / "International", "collaboration.txt"))
write_json("publications.json", scan_folder(ROOT / "Publications", "publication.txt"))

# CONTACT
contact = parse_txt(ROOT / "Contact" / "contact.txt")
write_json("contact.json", contact)

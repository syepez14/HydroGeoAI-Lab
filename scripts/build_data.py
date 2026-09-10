from pathlib import Path
import json
import re
import urllib.parse
import urllib.request

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


def decode_display_name(name: str):
    # GitHub web uploads can preserve escaped fragments such as #U00e9.
    def repl(m):
        try:
            return chr(int(m.group(1), 16))
        except Exception:
            return m.group(0)
    return re.sub(r"#U([0-9A-Fa-f]{4})", repl, name)


def media_in(folder: Path):
    files = [p for p in folder.iterdir() if p.is_file() and p.suffix.lower() in MEDIA_EXTS]
    if not files:
        return []
    preferred_stems = ["photo", "image", "media", "cover", "video", "logo"]
    def priority(p):
        stem = p.stem.lower()
        base = re.sub(r"\d+$", "", stem)
        try:
            rank = preferred_stems.index(base)
        except ValueError:
            try:
                rank = preferred_stems.index(stem)
            except ValueError:
                rank = len(preferred_stems)
        ext_rank = 0 if p.suffix.lower() in IMAGE_EXTS else 1
        return (rank, ext_rank, p.name.lower())
    result=[]
    for p in sorted(files,key=priority):
        result.append({
            "src": p.relative_to(ROOT).as_posix(),
            "type": "video" if p.suffix.lower() in VIDEO_EXTS else "image",
            "name": p.name,
        })
    return result


def downloadable_in(folder: Path):
    files = [p for p in folder.iterdir() if p.is_file() and p.suffix.lower() in DOWNLOAD_EXTS]
    return [p.relative_to(ROOT).as_posix() for p in sorted(files, key=lambda x: x.name.lower())]


def semicolon_list(value):
    return [x.strip() for x in (value or "").split(";") if x.strip()]


def normalize_doi(v):
    doi = (v or "").strip()
    doi = re.sub(r"^https?://(dx\.)?doi\.org/", "", doi, flags=re.I)
    doi = re.sub(r"^doi:\s*", "", doi, flags=re.I)
    return doi.strip()


def crossref_metadata(doi):
    doi = normalize_doi(doi)
    if not doi:
        return {}
    try:
        url = "https://api.crossref.org/works/" + urllib.parse.quote(doi, safe="")
        req = urllib.request.Request(url, headers={"User-Agent": "HydroGeoAI-Lab/1.0 (mailto:syepez@udec.cl)"})
        with urllib.request.urlopen(req, timeout=8) as r:
            msg = json.load(r).get("message", {})
        authors=[]
        for a in msg.get("author", []):
            name = " ".join(x for x in [a.get("given", ""), a.get("family", "")] if x).strip()
            if name: authors.append(name)
        year=""
        for key in ("published-print","published-online","published","issued"):
            parts=msg.get(key,{}).get("date-parts",[])
            if parts and parts[0]:
                year=str(parts[0][0]); break
        title = (msg.get("title") or [""])[0]
        journal = (msg.get("container-title") or [""])[0]
        return {"title":title,"authors":"; ".join(authors),"journal":journal,"year":year}
    except Exception as e:
        print(f"Crossref lookup failed for {doi}: {e}")
        return {}


def scan_folder(base: Path, txt_name: str, enrich_publication=False):
    items=[]
    if not base.exists(): return items
    for folder in sorted([p for p in base.iterdir() if p.is_dir()], key=lambda x: x.name.lower()):
        if folder.name.startswith("_") or folder.name.upper().startswith("EXAMPLE"):
            continue
        data=parse_txt(folder/txt_name)
        data["name"]=decode_display_name(folder.name)
        media=media_in(folder)
        if media:
            data["media"]=media
            data["photo"]=media[0]["src"]
            data["media_type"]=media[0]["type"]
        downloads=downloadable_in(folder)
        if downloads:
            data["downloads"]=downloads
            data["download"]=downloads[0]
        if "keywords" in data:
            data["keywords"]=semicolon_list(data["keywords"])
        if enrich_publication:
            doi=normalize_doi(data.get("doi",""))
            if doi:
                data["doi"]=doi
                meta=crossref_metadata(doi)
                if not data.get("authors") and meta.get("authors"): data["authors"]=meta["authors"]
                if not data.get("journal") and meta.get("journal"): data["journal"]=meta["journal"]
                if not data.get("year") and meta.get("year"): data["year"]=meta["year"]
                if data["name"].lower().startswith(("publication","paper","article")) and meta.get("title"):
                    data["name"]=meta["title"]
        items.append(data)
    return items


def write_json(filename,payload):
    (DATA/filename).write_text(json.dumps(payload,ensure_ascii=False,indent=2),encoding="utf-8")
    print(f"{filename}: {len(payload) if isinstance(payload,list) else 'ok'}")

about=parse_txt(ROOT/"About"/"about.txt")
about["areas"]=scan_folder(ROOT/"About"/"Areas","area.txt")
write_json("about.json",about)
write_json("news.json",scan_folder(ROOT/"News","news.txt"))
write_json("team.json",scan_folder(ROOT/"Team","profile.txt"))
write_json("projects.json",scan_folder(ROOT/"Projects","project.txt"))
write_json("services.json",scan_folder(ROOT/"Services","service.txt"))
write_json("equipment.json",scan_folder(ROOT/"Equipment","equipment.txt"))
write_json("technologies.json",scan_folder(ROOT/"Technologies","technology.txt"))
write_json("resources.json",scan_folder(ROOT/"Resources","resource.txt"))
write_json("collaborations_national.json",scan_folder(ROOT/"Collaborations"/"National","collaboration.txt"))
write_json("collaborations_international.json",scan_folder(ROOT/"Collaborations"/"International","collaboration.txt"))
write_json("publications.json",scan_folder(ROOT/"Publications","publication.txt",enrich_publication=True))
write_json("contact.json",parse_txt(ROOT/"Contact"/"contact.txt"))

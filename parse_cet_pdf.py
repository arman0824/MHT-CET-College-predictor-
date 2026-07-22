import pdfplumber
import json
import re

PDF_PATH = "CAP-round-2025.pdf"
OUTPUT_JSON = "src/data/colleges_exact.json"

# Master list of standard MHT CET categories
STANDARD_CATEGORIES = [
    "GOPENH", "GSCH", "GSTH", "GVJH", "GNT1H", "GNT2H", "GNT3H", "GOBCH", "GSEBCH",
    "LOPENH", "LSCH", "LSTH", "LVJH", "LNT1H", "LNT2H", "LNT3H", "LOBCH", "LSEBCH",
    "GOPENO", "GSCO", "GSTO", "GVJO", "GNT1O", "GNT2O", "GNT3O", "GOBCO", "GSEBCO",
    "LOPENO", "LSCO", "LSTO", "LVJO", "LNT1O", "LNT2O", "LNT3O", "LOBCO", "LSEBCO",
    "GOPENS", "GSCS", "GSTS", "GVJS", "GNT1S", "GNT2S", "GNT3S", "GOBCS", "GSEBCS",
    "LOPENS", "LSCS", "LSTS", "LVJS", "LNT1S", "LNT2S", "LNT3S", "LOBCS", "LSEBCS",
    "PWDOPENH", "PWDSCH", "PWDOBCH", "PWDOPENS", "PWDSCS", "PWDOBCS",
    "DEFOPENH", "DEFOPENS", "DEFOBCS", "DEFSEBCS", "DEFRSEBCS",
    "TFWS", "EWS", "ORPHAN", "MI"
]

def clean_category_name(raw_cat):
    """Clean OCR typos commonly found in official MHT CET PDFs."""
    cat = re.sub(r"[^A-Z0-9]", "", raw_cat.upper())
    if cat in STANDARD_CATEGORIES:
        return cat
    
    replacements = {
        "GORENS": "GOPENS", "GORENH": "GOPENH", "GOBCE": "GOBCS", "LOBCE": "LOBCS",
        "GNT28": "GNT2S", "GN725": "GNT2S", "008CS": "GOBCS", "GSEBCE": "GSEBCS"
    }
    if cat in replacements:
        return replacements[cat]
        
    for std in STANDARD_CATEGORIES:
        if cat == std or (len(cat) > 3 and std in cat):
            return std
    return None

IGNORE_CODES = {"2024", "2025", "2026", "2027"}

colleges_dict = {}
current_college = None
current_branch = None
active_categories = []

print(f"Reading '{PDF_PATH}'... Please wait.")

with pdfplumber.open(PDF_PATH) as pdf:
    total_pages = len(pdf.pages)
    print(f"Processing {total_pages} pages...")

    for page_num, page in enumerate(pdf.pages, start=1):
        text = page.extract_text()
        if not text:
            continue

        lines = [line.strip() for line in text.split("\n") if line.strip()]

        for line in lines:
            # 1. Match College Header (e.g., 01002 - Government College of Engineering, Amravati)
            college_match = re.search(r"^\s*(\d{4,5})\s*[\-–—:]\s*(.+)", line)
            if college_match:
                code = college_match.group(1).zfill(5)
                name = college_match.group(2).strip()

                if code not in IGNORE_CODES and not name.startswith("26"):
                    if code not in colleges_dict:
                        colleges_dict[code] = {
                            "code": code,
                            "name": name,
                            "branches": {}
                        }
                    current_college = code
                    current_branch = None
                    active_categories = []
                    continue

            # 2. Match Branch Choice Code Header (e.g., 0100219110 - Civil Engineering)
            branch_match = re.search(r"^\s*(\d{9,10}[A-Z]?)\s*[\-–—:]\s*(.+)", line)
            if branch_match:
                b_code = branch_match.group(1)
                b_name = branch_match.group(2).strip()
                c_code = b_code[:5]

                if c_code not in colleges_dict and current_college:
                    c_code = current_college

                if c_code in colleges_dict:
                    current_college = c_code
                    if b_code not in colleges_dict[current_college]["branches"]:
                        colleges_dict[current_college]["branches"][b_code] = {
                            "code": b_code,
                            "name": b_name,
                            "cutoffs2025": {}
                        }
                    current_branch = b_code
                    active_categories = []
                    continue

            # 3. Extract Cutoffs for active branch in stream order
            if current_college and current_branch:
                # Identify Category Headers in this line
                words = re.findall(r"[A-Za-z0-9]+", line)
                detected_cats = []
                for w in words:
                    c = clean_category_name(w)
                    if c:
                        detected_cats.append(c)

                # If this line contains category names and no percentiles, record active categories
                if len(detected_cats) >= 1 and not re.search(r"\d{1,2}\.\d{4,9}", line):
                    active_categories = detected_cats
                    continue

                # If this line contains percentiles (e.g. (91.7307220) or 91.7307220), map them
                percentiles = re.findall(r"\(?(\d{1,2}\.\d{4,9})\)?", line)
                if percentiles and active_categories:
                    cutoff_map = colleges_dict[current_college]["branches"][current_branch]["cutoffs2025"]
                    for cat, perc in zip(active_categories, percentiles):
                        cutoff_map[cat] = float(perc)

# Format into final React-friendly array
final_list = []
for c_code, c_data in colleges_dict.items():
    if not c_data["branches"]:
        continue
    branches_list = []
    for b_code, b_data in c_data["branches"].items():
        branches_list.append({
            "code": b_code,
            "name": b_data["name"],
            "cutoffs2025": b_data["cutoffs2025"]
        })
    final_list.append({
        "code": c_code,
        "name": c_data["name"],
        "branches": branches_list
    })

with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
    json.dump(final_list, f, indent=2)

print(f"Done! Extracted {len(final_list)} colleges with full cutoff data into '{OUTPUT_JSON}'.")
const fs = require('fs');
const path = require('path');
const { PDFParse } = require("pdf-parse");

// Adjust paths if needed based on your project structure
const PDF_PATH = path.join(__dirname, '..', '..', 'CAP-round-2025.pdf');
const OUTPUT_JSON = path.join(__dirname, 'src', 'data', 'colleges.json');

const STANDARD_CATEGORIES = [
  "GOPENH", "GSCH", "GSTH", "GVJH", "GNT1H", "GNT2H", "GNT3H", "GOBCH", "GSEBCH",
  "LOPENH", "LSCH", "LSTH", "LVJH", "LNT1H", "LNT2H", "LNT3H", "LOBCH", "LSEBCH",
  "GOPENO", "GSCO", "GSTO", "GVJO", "GNT1O", "GNT2O", "GNT3O", "GOBCO", "GSEBCO",
  "LOPENO", "LSCO", "LSTO", "LVJO", "LNT1O", "LNT2O", "LNT3O", "LOBCO", "LSEBCO",
  "GOPENS", "GSCS", "GSTS", "GVJS", "GNT1S", "GNT2S", "GNT3S", "GOBCS", "GSEBCS",
  "LOPENS", "LSCS", "LSTS", "LVJS", "LNT1S", "LNT2S", "LNT3S", "LOBCS", "LSEBCS",
  "PWDOPENH", "PWDSCH", "PWDOBCH", "PWDOPENS", "PWDSCS", "PWDOBCS",
  "DEFOPENH", "DEFOPENS", "DEFOBCS", "DEFSEBCS", "DEFRSEBCS",
  "TFWS", "EWS", "ORPHAN", "MI"
];

function cleanCategoryName(raw) {
  const cat = raw.replace(/[^A-Z0-9]/g, '').toUpperCase();
  if (STANDARD_CATEGORIES.includes(cat)) return cat;

  const replacements = {
    "GORENS": "GOPENS", "GORENH": "GOPENH", "GOBCE": "GOBCS", "LOBCE": "LOBCS",
    "GNT28": "GNT2S", "GN725": "GNT2S", "008CS": "GOBCS", "GSEBCE": "GSEBCS"
  };
  return replacements[cat] || null;
}

async function parsePDF() {
  console.log("Processing PDF... Please wait.");
  const dataBuffer = fs.readFileSync(PDF_PATH);
  const data = await PDFParse(dataBuffer);

  const lines = data.text.split('\n').map(l => l.trim()).filter(Boolean);

  const collegesDict = {};
  let currentCollege = null;
  let currentBranch = null;
  let activeCategories = [];

  const IGNORE_CODES = new Set(["2024", "2025", "2026", "2027"]);

  for (const line of lines) {
    // 1. Match College Header (e.g., 01002 - Government College of Engineering, Amravati)
    const collegeMatch = line.match(/^\s*(\d{4,5})\s*[-–—:]\s*(.+)/);
    if (collegeMatch) {
      const code = collegeMatch[1].padStart(5, '0');
      const name = collegeMatch[2].trim();

      if (!IGNORE_CODES.has(code) && !name.startsWith("26")) {
        if (!collegesDict[code]) {
          collegesDict[code] = { code, name, branches: {} };
        }
        currentCollege = code;
        currentBranch = null;
        activeCategories = [];
        continue;
      }
    }

    // 2. Match Branch Code Header (e.g., 0100219110 - Civil Engineering)
    const branchMatch = line.match(/^\s*(\d{9,10}[A-Z]?)\s*[-–—:]\s*(.+)/);
    if (branchMatch) {
      const bCode = branchMatch[1];
      const bName = branchMatch[2].trim();
      let cCode = bCode.substring(0, 5);

      if (!collegesDict[cCode] && currentCollege) {
        cCode = currentCollege;
      }

      if (collegesDict[cCode]) {
        currentCollege = cCode;
        if (!collegesDict[currentCollege].branches[bCode]) {
          collegesDict[currentCollege].branches[bCode] = {
            code: bCode,
            name: bName,
            cutoffs2025: {}
          };
        }
        currentBranch = bCode;
        activeCategories = [];
        continue;
      }
    }

    // 3. Extract Cutoffs for active branch in stream order
    if (currentCollege && currentBranch) {
      const words = line.match(/[A-Za-z0-9]+/g) || [];
      const detectedCats = words.map(cleanCategoryName).filter(Boolean);
      const percentiles = line.match(/\(?(\d{1,2}\.\d{4,9})\)?/g);

      if (detectedCats.length >= 1 && !percentiles) {
        activeCategories = detectedCats;
      } else if (percentiles && activeCategories.length > 0) {
        const branchObj = collegesDict[currentCollege].branches[currentBranch];
        percentiles.forEach((pStr, idx) => {
          if (idx < activeCategories.length) {
            const cat = activeCategories[idx];
            const val = parseFloat(pStr.replace(/[()]/g, ''));
            branchObj.cutoffs2025[cat] = val;
          }
        });
      }
    }
  }

  // Format into final array
  const finalList = Object.values(collegesDict)
    .filter(c => Object.keys(c.branches).length > 0)
    .map(c => ({
      code: c.code,
      name: c.name,
      branches: Object.values(c.branches)
    }));

  fs.mkdirSync(path.dirname(OUTPUT_JSON), { recursive: true });
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(finalList, null, 2));
  console.log(` Done! Successfully generated full cutoff data for ${finalList.length} colleges into '${OUTPUT_JSON}'.`);
}

parsePDF().catch(console.error);
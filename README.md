# 🎓 MHT-CET Cutoff & College Predictor

An all-in-one web application for MHT-CET engineering aspirants in Maharashtra to explore official CAP round cutoffs, predict eligible colleges based on percentile, compare branches side-by-side, and build preference option forms.

🚀 **Live:** [https://cet-vault.vercel.app](https://cet-vault.vercel.app)

---

## ✨ Features

- 🎯 **Smart College Predictor:** Recommends safe, competitive, and target colleges based on your MHT-CET percentile and reservation category.
- 📊 **Official CAP Cutoffs:** Complete, accurate category-wise cutoff data (GOPENS, EWS, TFWS, OBC, SC, ST, etc.) extracted directly from official CET Cell PDFs.
- 🔍 **Advanced Filtering:** Search and filter 370+ engineering colleges by city/region, branch, autonomous status, or percentile range.
- ⚖️ **Side-by-Side Comparison:** Compare up to 3 colleges side-by-side to evaluate options before filling preference lists.

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Icons:** Lucide React
- **Data Pipeline:** Python (`pdfplumber`) & Node.js for parsing and structuring raw CAP PDFs into JSON.
- **Deployment:** Vercel

---

## Project structure

```text
src/
  app/        Application composition and navigation types
  features/   Feature-specific screens and components
  shared/     Reusable UI, layout, domain utilities, and types
  shared/api/ Cached client-side access to the generated dataset
  styles/     Global Tailwind styles
data/source/  Source cutoff data used to generate the dataset
scripts/      Data extraction and generation utilities
```

## Development

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Data workflow

`data/source/colleges.json` is the source dataset. Run the following after updating it to regenerate the cached static dataset at `public/data/colleges.json`:

```bash
npm run data:generate
```

`npm run data:extract` extracts raw cutoff data from `public/CAP-round-2025.pdf` into `data/source/colleges-extracted.json`. It requires Python and `pdfplumber`.

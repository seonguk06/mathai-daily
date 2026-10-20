# MathAI Daily — bilingual mathematics × AI news MVP

> **Status:** runnable static website + automated RSS/arXiv collector + GitHub Pages deployment.  
> **Languages:** Korean / English (UI immediately; bilingual article summaries when `OPENAI_API_KEY` is configured).  
> **Cost:** GitHub Pages + GitHub Actions can be started without a hosting bill for a qualifying public repository. An optional OpenAI API key incurs usage-based charges.

![No-build architecture](https://img.shields.io/badge/frontend-HTML%20%2B%20CSS%20%2B%20JS-91ead5) ![Python](https://img.shields.io/badge/collector-Python%20stdlib-b5b0ff) ![Pages](https://img.shields.io/badge/deploy-GitHub%20Pages-e5e7eb)

## 1. What is included?

- An editorial-style responsive site, mobile/desktop layouts, dark/light themes.
- Fully translated KR/EN UI; toggle from the upper-right corner.
- Topic filters for **AI × Math**, **formal proof**, **math**, and **AI research**.
- Search, date-based editions (Korean calendar days), newest/relevance/oldest sorting.
- Source links, editorial context modal, bookmarks saved in the same browser.
- Seven source feeds: **Quanta**, **Quanta Mathematics**, **OpenAI**, **Google DeepMind**, **Google Research**, **Hugging Face**, **arXiv**. Edit [`data/sources.json`](data/sources.json) to customize RSS sources.
- A Python feed collection process, topic scoring, HTTPS URL normalization, deduplication, source diversity limits, and a rolling 180-day archive (up to 360 entries).
- Optional structured AI translations/summaries via OpenAI API, using **only feed title/excerpt** as reference material.
- A combined GitHub Actions workflow that tests, optionally refreshes, commits and *directly publishes* the website to GitHub Pages. No database or Node.js required.
- Offline parsing/ingestion tests that run without network or API keys.

**Important:** The repository initially includes nine **historical, manually curated examples**, marked `"demo": true` in `data/news.json`. They are **not** shown as yesterday's news. The first successful manual/scheduled feed update replaces the sample articles with live RSS/arXiv metadata. Because the current coding environment has no outbound network access, we did **not** perform a real remote-feed fetch here; the parsers were exercised with local XML fixtures.

## 2. Run locally (no installation beyond Python)

Install **Python 3.10 or newer**. From this directory:

```bash
python3 -m http.server 8000
```

Open **http://localhost:8000**. The site is fully interactive even without fetching feeds. Do **not** open `index.html` with `file://` because browsers can block JSON fetches from local files.

On Windows, the command may be `py -m http.server 8000` instead of `python3`.

### Optional: collect real feeds right now

```bash
python3 scripts/update_news.py --days 14
python3 scripts/check_data.py
```

- This command accesses public RSS and arXiv Atom endpoints via HTTPS. It needs a network connection.
- On the first run it **replaces demo content** with genuine feed entries. It skips articles without an interpretable publication time.
- Feed failures are logged; if **all** sources fail, the script exits without overwriting the last good archive.
- `--days 14` includes up to 14 previous Seoul calendar days for bootstrapping, while the scheduled action uses the last seven days to catch late feed publications.
- The source date is used, **not the time the story was collected**. Look at the metadata before calling an item “new.”
- For offline pipeline tests:

```bash
python3 -m unittest discover -s tests -v
```

No `pip install` or `npm install` step is needed.

## 3. Publish a working public URL using GitHub Pages

1. Create a **public** GitHub repository, e.g. `mathai-daily`, leaving it empty (do not generate a conflicting README in the remote repo).
2. Put all files from this folder in the repository **root**, including hidden files/directories: `.github/workflows/publish.yml`, `.nojekyll`, `.gitignore`.
3. In a terminal inside the folder:

   ```bash
   git init -b main
   git add .
   git commit -m "Launch MathAI Daily MVP"
   git remote add origin https://github.com/YOUR_USERNAME/mathai-daily.git
   git push -u origin main
   ```

4. In GitHub, go to **Settings → Pages → Build and deployment → Source → GitHub Actions**.
5. Under **Settings → Actions → General → Workflow permissions**, ensure the workflow can write the repository contents (`Read and write permissions`, if your organization permits it). The workflow itself requests `contents: write`, `pages: write`, and `id-token: write`.
6. Open **Actions → Publish MathAI Daily**. Once the first push deploy finishes, choose **Run workflow** to immediately ingest real sources and publish them. (Manual runs require the workflow to be present on the default branch.)
7. Your public URL will look like:

   **`https://YOUR_USERNAME.github.io/mathai-daily/`**

   The precise URL is displayed in the successful workflow's **Deploy to GitHub Pages** step.

**Why only one workflow?** A `push` triggered by `GITHUB_TOKEN` from inside a GitHub Actions job generally does **not** trigger a second `push` workflow. Our workflow updates and deploys in the **same** run, preventing the common failure where the data file is committed but the website is never rebuilt. Ordinary user pushes also deploy the site.

### Scheduled updates

[`publish.yml`](.github/workflows/publish.yml) runs every day at **22:17 UTC, corresponding to 07:17 KST the following morning**, then publishes the refreshed site. GitHub schedule times are **best effort**, not guaranteed to the minute, and public repository scheduled workflows may be disabled after prolonged inactivity. You can always use **Run workflow** manually. If a protected `main` branch forbids the automated data commit, adjust repository permissions or use a pull-request publishing design.

## 4. Enable Korean article translation and bilingual research summaries

The **UI is bilingual without any API key**. But most upstream RSS feeds are in English. To publish Korean translations and editorial summaries automatically:

1. Generate an OpenAI API key in your API account. **ChatGPT subscription and API billing are separate**.
2. Navigate to **GitHub → repository → Settings → Secrets and variables → Actions → New repository secret**.
3. Add the secret name **`OPENAI_API_KEY`** and its value. It is read only by the GitHub workflow's server-side Python script.
4. Open **Actions → Publish MathAI Daily → Run workflow**.

The collector uses `gpt-4o-mini` by default (`OPENAI_MODEL` can be changed in the workflow), with JSON-schema-constrained output to obtain Korean titles, summaries, and explanatory context. To limit expenses, a maximum of **10 new articles per run** are sent to the AI API by default (`MAX_AI_ITEMS`). Other new articles are still published from the original English feed metadata and are marked internally with `"languageQuality": "source-only"`.

For a **local shell only**, you can optionally set a key without saving it to the repository:

```bash
export OPENAI_API_KEY="your-key-here"
python3 scripts/update_news.py --days 7
```

Windows PowerShell: `$env:OPENAI_API_KEY="your-key-here"`. Never put real secrets into `assets/app.js`, committed files, or public Pages settings.

## 5. File structure

```text
mathai-daily-mvp/
├── index.html                 # Responsive page
├── assets/
│   ├── styles.css             # Theming, layout, mobile responsiveness
│   ├── app.js                 # Rendering, search, filters, date, bookmarks, KR/EN
│   └── favicon.svg
├── data/
│   ├── news.json              # Public JSON archive (starts as marked demo)
│   └── sources.json           # Feed configuration
├── scripts/
│   ├── update_news.py         # RSS/Atom ingestion, classification, optional AI
│   └── check_data.py          # JSON integrity validation
├── tests/
│   ├── test_pipeline.py
│   └── fixtures/              # Offline RSS/Atom samples
├── .github/workflows/publish.yml
├── .nojekyll
├── .gitignore
├── .env.example
└── README.md
```

## 6. Editorial and operational limits

**Do not treat this MVP as a verified mathematical-news service yet.**

- **No full-article scraping.** The program only sees title, date and abstract/excerpt published by the source feed. In particular, it does not assess a paper's proof, priority, peer review, citation count, or mathematical correctness.
- **A relevance score is not an academic importance judgment.** It is a reproducible keyword/source-weight heuristic; it may miss important papers and include marginal ones. The featured article is selected by this score for the current date/filter.
- **Not exhaustive coverage.** arXiv results are drawn from selected categories, and feeds may delay or omit entries. Both arXiv searches fetch the latest 100 matching results, not the full database. For production coverage, use arXiv OAI-PMH, more sources, or a dedicated index.
- **Dates are publication timestamps.** Updates to an old article are not automatically marked as new unless its source feed changes the publication date. Summaries may be stale after an author edits their work.
- **No human verification stage.** For sensitive research claims, add approval before public publication, external fact-check metadata and corrections. All summaries retain original links.
- **Language fallback.** Without `OPENAI_API_KEY` or if enrichment fails, Korean interface elements work but the article's headline and excerpt may remain in English. This is intentional rather than pretending an untranslated article was translated.
- **Public archive.** JSON files are downloadable, no authentication or paid storage. Saved articles are private to the visitor's browser via `localStorage`, not synchronized across devices.
- **Hosting limits.** GitHub Pages has usage and repository constraints, and GitHub Actions schedules can be delayed or stopped. The site does not promise real-time updates.
- **Feeds can change.** Check errors in the Actions logs and update URLs in `data/sources.json` if a publisher changes endpoints.
- **Financial costs.** Public hosting may qualify for a free plan; OpenAI API calls incur usage-based charges. Adjust `MAX_AI_ITEMS` if needed.

### Potential next iterations

Add a human editorial approval queue; store provenance for mathematical proof verification and independent peer review; track errata/retractions; author/topic subscriptions; full-text search, citations, DOI/arXiv identifiers, RSS output and automated email delivery.

---

**English quick start:** Run `python3 -m http.server 8000` locally. To publish, push the folder to a public GitHub repository, select **Settings → Pages → GitHub Actions**, then run the **Publish MathAI Daily** action. Configure optional `OPENAI_API_KEY` in repository **Actions secrets** for automatic KR/EN story summaries. Daily schedule is 07:17 Asia/Seoul, subject to GitHub Actions scheduling delays.

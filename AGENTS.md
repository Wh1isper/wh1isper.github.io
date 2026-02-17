# AGENTS.md

## Project Overview
- Project type: Hexo static blog site
- Runtime: Node.js
- Main framework: `hexo@^6.3.0`
- Main themes: `hexo-theme-fluid`, `hexo-theme-landscape`

## Repository Structure
- `source/_posts/`: Published blog posts (Markdown)
- `draft/`: Draft articles
- `source/about/`: About page content
- `source/css/`: Custom styles
- `source/img/`: Static images
- `scaffolds/`: Hexo scaffold templates
- `draw/`: Draw.io architecture/design files
- `public/`: Generated site output (build artifacts)

## Common Commands
- Install dependencies:
  - `npm install`
- Start local server:
  - `npm run server`
- Build static site:
  - `npm run build`
- Clean generated artifacts:
  - `npm run clean`
- Deploy:
  - `npm run deploy`

## Content and Editing Conventions
- Write posts in Markdown under `source/_posts/`.
- Blog post language is Chinese by default for this project.
- Keep file names date-prefixed when following existing pattern.
- Put reusable/custom style changes in `source/css/custom.css` when possible.
- Store diagrams in `draw/` and reference exported assets in posts when needed.
- Prefer Mermaid for diagrams in Markdown docs when practical.
- For architecture articles, prefer an evolution narrative (e.g., from Chatbot to Agent) with less marketing tone and more practical reasoning.

## Configuration Notes
- Main Hexo config: `_config.yml`
- Theme config: `_config.fluid.yml`
- Keep configuration changes minimal and scoped to the requested task.

## Technical Blog Writing Style (Architecture Articles)
- Use analytical, engineering-oriented tone; avoid marketing language.
- Prefer declarative structure: definition -> boundary -> flow -> constraints -> conclusion.
- Reduce rhetorical transitions (e.g., excessive “但是/如果/只” style pivots); keep statements direct.
- Focus on system behavior and trade-offs, not persuasion.
- Keep section goals explicit; each subsection should answer one technical question.
- Prefer small, single-purpose diagrams over one overloaded diagram.
- For diagrams, pair static architecture view with runtime/request flow when needed.
- Keep terminology stable across sections (e.g., Display Layer vs Business Layer).
- Summaries should capture concrete architectural outcomes, not generic benefits.
- Keep evolution narrative practical: from current constraints to next architectural need.

## Agent Working Guidelines
- Follow existing naming and content conventions in this repository.
- Do not manually edit generated output under `public/` unless explicitly requested.
- Validate changes with a local build (`npm run build`) when content/config is modified.
- Keep commits focused and task-scoped.

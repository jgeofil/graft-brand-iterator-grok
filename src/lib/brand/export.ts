import {
  ROLE_LABEL,
  colorOf,
  formatRatio,
  slugify,
  type Direction,
  type Project,
} from "@/lib/brand/model";

const SPACE: Record<Direction["density"], Record<string, string>> = {
  tight: { "1": "4px", "2": "8px", "3": "12px", "4": "16px", "5": "24px" },
  balanced: { "1": "8px", "2": "12px", "3": "16px", "4": "24px", "5": "40px" },
  airy: { "1": "8px", "2": "16px", "3": "24px", "4": "40px", "5": "64px" },
};

function cssOf(project: Project, direction: Direction): string {
  const space = SPACE[direction.density];
  const lines = [
    `/* ${project.brief.name} — ${direction.title}`,
    `   Design system from Graft */`,
    `:root {`,
    ...direction.palette.map(
      (color) =>
        `  --color-${color.role.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}: ${color.hex};`,
    ),
    `  --radius: ${direction.radius};`,
    `  --font-display: "${direction.displayFont}", Georgia, serif;`,
    `  --font-body: "${direction.bodyFont}", "Avenir Next", sans-serif;`,
    `  --font-mono: "${direction.monoFont}", ui-monospace, monospace;`,
    `  --text-display: 2.75rem;`,
    `  --text-title: 1.5rem;`,
    `  --text-body: 1rem;`,
    `  --text-label: 0.75rem;`,
    ...Object.entries(space).map(([step, value]) => `  --space-${step}: ${value};`),
    `}`,
  ];
  return lines.join("\n");
}

export function markdownOf(project: Project, direction: Direction): string {
  const ink = colorOf(direction, "ink").hex;
  const canvas = colorOf(direction, "canvas").hex;
  const accent = colorOf(direction, "accent").hex;
  const onAccent = colorOf(direction, "onAccent").hex;
  const name = project.brief.name;
  const palette = direction.palette
    .map((color) => `| ${ROLE_LABEL[color.role]} | ${color.name} | ${color.hex} | ${color.usage} |`)
    .join("\n");

  return [
    `# ${name} — ${direction.title}`,
    ``,
    `Design system. ${direction.epithet}.`,
    ``,
    direction.rationale,
    ``,
    `## Color palette`,
    ``,
    `Ink on canvas ${formatRatio(ink, canvas)}. Accent pair ${formatRatio(onAccent, accent)}.`,
    ``,
    `| Role | Name | Hex | Usage |`,
    `| --- | --- | --- | --- |`,
    palette,
    ``,
    `## Type`,
    ``,
    `- Display: ${direction.displayFont}`,
    `- Body: ${direction.bodyFont}`,
    `- Mono: ${direction.monoFont}`,
    `- Radius: ${direction.radius}`,
    `- Density: ${direction.density}`,
    ``,
    direction.typeNotes,
    ``,
    `Wordmark: ${direction.wordmarkStyle}`,
    ``,
    `| Step | Size | Use |`,
    `| --- | --- | --- |`,
    `| Display | 2.75rem | Headlines |`,
    `| Title | 1.5rem | Sections |`,
    `| Body | 1rem | Reading |`,
    `| Label | 0.75rem | Tracked UI labels |`,
    ``,
    `## Visual guidelines`,
    ``,
    `### Voice`,
    direction.voice,
    ``,
    `### Imagery`,
    direction.imagery,
    ``,
    `### Shape`,
    direction.shape,
    ``,
    `### Motion`,
    direction.motion,
    ``,
    `### Spacing`,
    direction.spacing,
    ``,
    `### Interface`,
    direction.uiNotes,
    ``,
    `### Do`,
    ...direction.dos.map((line) => `- ${line}`),
    ``,
    `### Don't`,
    ...direction.donts.map((line) => `- ${line}`),
    ``,
    `## CSS variables`,
    ``,
    "```css",
    cssOf(project, direction),
    "```",
    ``,
  ].join("\n");
}

export function cssExport(project: Project, direction: Direction): string {
  return cssOf(project, direction);
}

export function exportBasename(project: Project, direction: Direction): string {
  return `${slugify(project.brief.name)}-${slugify(direction.title)}`;
}

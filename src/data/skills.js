// Each category is one "save" on the Memory Card screen.
//   glyph — 2D fallback icon (SaveGlyph), shown until the 3D model is ready / if WebGL fails
//   model — 3D model id (see components/ps2/models.js)
export const skillCategories = [
  { id: 'linguagens', label: 'Linguagens', glyph: 'code', model: 'laptop', items: ['Python', 'JavaScript', 'TypeScript', 'C', 'C# (básico)'] },
  { id: 'frontend', label: 'Front-end', glyph: 'browser', model: 'browser', items: ['React', 'HTML', 'CSS'] },
  { id: 'backend', label: 'Back-end / Dados', glyph: 'database', model: 'database', items: ['Node.js', 'Flask', 'SQL'] },
  { id: 'ia', label: 'IA / ML', glyph: 'neural', model: 'robot', items: ['Machine Learning', 'Análise de Dados'] },
  { id: 'ferramentas', label: 'Ferramentas', glyph: 'wrench', model: 'toolbox', items: ['Git', 'GitHub', 'Figma'] },
  {
    id: 'idiomas',
    label: 'Idiomas',
    glyph: 'speech',
    model: 'speech',
    items: ['Português (nativo)', 'Inglês (fluente)', 'Espanhol (fluente)'],
    note: 'Experiência em tradução e interpretação.',
  },
]

// Attribution for the downloaded 3D models (CC BY requires it). Source: poly.pizza
export const modelCredits = [
  { name: 'Laptop', author: 'Alex Safayan', license: 'CC BY 3.0', href: 'https://poly.pizza/m/27hcX_w47Jb' },
  { name: 'Toolbox', author: 'jeremy', license: 'CC BY 3.0', href: 'https://poly.pizza/m/20JcnkCnbAc' },
  { name: 'Robot', author: 'Quaternius', license: 'CC0', href: 'https://poly.pizza/m/QCm7qe9uNJ' },
]

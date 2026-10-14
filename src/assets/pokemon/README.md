Coloque aqui os ícones dos Pokémon (`.png`, `.webp` ou `.jpg`).

O código em `src/components/SkillCard.jsx` carrega **todos** os arquivos de imagem
desta pasta automaticamente (via `import.meta.glob`) — não precisa registrar nome
nenhum em lugar nenhum. É só soltar os arquivos aqui.

A cada carregamento da página, cada card de skill sorteia um ícone aleatório
dessa lista.

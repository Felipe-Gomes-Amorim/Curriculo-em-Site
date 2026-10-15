import scx from '../assets/projects/scx.jpg'
import iamon from '../assets/projects/iamon.jpg'
import scxIcon from '../assets/projects/scx-icon.jpg'
import cronostadiaIcon from '../assets/projects/cronostadia-icon.jpg'
import tetraplaIcon from '../assets/projects/tetrapla-icon.jpg'
import iamonIcon from '../assets/projects/iamon-icon.jpg'
import mixEngineIcon from '../assets/projects/mix-engine-icon.jpg'
import kirbyRecompIcon from '../assets/projects/kirby-recomp-icon.jpg'

// `icon` is the square tile in the project picker row; `image` is the banner
// shown in the expanded project card. They're separate on purpose.

export const projects = [
  {
    id: 'kirby-recomp',
    name: 'Kirby & The Amazing Mirror — Recompilação Estática',
    stack: ['C', 'Python', 'ARM7TDMI', 'Engenharia Reversa'],
    description:
      'Projeto educacional que recompila estaticamente um jogo de Game Boy Advance para C, rodando nativamente no PC, sem emulador. Um recompilador traduz o código de máquina ARM7TDMI/Thumb instrução por instrução e o liga a um runtime que reproduz o hardware do console (vídeo, DMA, timers, interrupções, BIOS). Inclui análise da ROM (5.669 funções mapeadas, separando ARM, Thumb e dados), tratamento de desvios indiretos por tabelas de ponteiros e testes instrução a instrução contra o Unicorn. O jogo já inicia e roda mais de 8.000 frames, com janela, teclado e save. Nenhuma ROM ou asset é distribuído.',
    image: null,
    icon: kirbyRecompIcon,
    github: 'https://github.com/Felipe-Gomes-Amorim/kirby-amazing-mirror-recomp',
  },
  {
    id: 'scx',
    name: 'SCX — Sistema de Controle de Exames',
    stack: ['React', 'Node.js', 'SQL'],
    description:
      'Sistema web completo para gerenciamento de exames médicos, integrando clínicas, laboratórios, médicos, secretárias e pacientes em uma única plataforma. Desenvolvido como TCC, com foco em segurança, escalabilidade, acessibilidade e fluxo clínico real — múltiplos perfis de usuário com permissões e fluxos distintos.',
    image: scx,
    icon: scxIcon,
    github: 'https://github.com/Felipe-Gomes-Amorim/SCX',
  },
  {
    id: 'cronostadia',
    name: 'Cronostadia',
    stack: ['Electron', 'React', 'Vite', 'SQLite'],
    description:
      'Aplicativo desktop de produtividade com estética Windows 98/2000 (Y2K). Inclui gerenciamento de tarefas, timer integrado e sistema de progressão gamificado (XP/níveis). Demonstra domínio de empacotamento de aplicação desktop nativa e persistência local de dados, além de um trabalho visual autoral forte.',
    image: null,
    icon: cronostadiaIcon,
    github: 'https://github.com/Felipe-Gomes-Amorim/ChronoStadia',
  },
  {
    id: 'mix-engine',
    name: 'Mix Engine',
    stack: ['React', 'TypeScript', 'Playwright'],
    description:
      'Editor web (React + TypeScript) para criar e exportar assets de um jogo de plataforma para SNES — importar imagem, fatiar metasprites, ajustar pivô/hitbox, sequenciar animações, montar tilesets e pintar fases, tudo pelo navegador. Funciona de forma independente, mas também integra opcionalmente com uma engine em C/PVSnesLib via um contrato de dados documentado e versionado — bastando "Salvar" para exportar os arquivos e, opcionalmente, compilar e abrir no emulador com um clique.',
    image: null,
    icon: mixEngineIcon,
    github: 'https://github.com/Felipe-Gomes-Amorim/mix-engine',
  },
  {
    id: 'tetrapla',
    name: 'Tetrapla',
    stack: ['React Native', 'Expo', 'Python'],
    description:
      'Aplicativo mobile de leitura poliglota, com textos em português, latim (Vulgata), grego, hebraico e aramaico alinhados versículo a versículo — incluindo dois alfabetos não-latinos, um com direção de escrita da direita para a esquerda. Inclui 12.482 referências dos Pais Ante-Nicenos por versículo e os prefácios de Jerônimo. O desafio técnico central é internacionalização real (parsing e renderização multi-script), com uma camada de gamificação (progressão e conquistas) por cima.',
    image: null,
    icon: tetraplaIcon,
    github: 'https://github.com/Felipe-Gomes-Amorim/Tetrapla',
  },
  {
    id: 'iamon',
    name: 'IAMon',
    stack: ['Python', 'SVM', 'Machine Learning'],
    description:
      'Projeto de Inteligência Artificial desenvolvido para o SUMMIT 2024: um modelo SVM (Support Vector Machine) para classificação de Pokémon em categorias — comuns, lendários, sub-lendários e míticos. Projeto acadêmico de Machine Learning e análise de dados.',
    image: iamon,
    icon: iamonIcon,
    github: 'https://github.com/Felipe-Gomes-Amorim/IAMon',
  },
]

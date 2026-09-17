import iamon from '../assets/projects/iamon.png'
import wolfenstein3d from '../assets/projects/wolfenstein3d.png'
import scx from '../assets/projects/scx.png'

export const projects = [
  {
    id: 'iamon',
    stack: 'python / SVM',
    name: 'IAMon',
    type: 'Estudo com Inteligência Artificial',
    description:
      'O Projeto visa demonstrar como o modelo de Inteligência Artificial SVM se comporta na classificação de indíviduos criados manualmente. Para isso, foi usado um dataset da Franquia Pokémon, contendo 898 Indivíduos. O Objetivo do Algorítmo é classificar quais dentre esses Pokémon são Comuns, Lendários, Sub-lendários e Míticos.',
    image: iamon,
    github: 'https://github.com/Felipe-Gomes-Amorim',
  },
  {
    id: 'wolfenstein3d',
    stack: 'python / pygame',
    name: 'Wolfeinstein3D Render',
    type: 'Estudo de Biblioteca python / Trigonometria',
    description:
      'Este projeto é uma recriação do estilo clássico de renderização 3D usado em Wolfenstein 3D, totalmente feito com Python e Pygame. Ele utiliza Raycasting para simular uma perspectiva 3D a partir de um mapa 2D, com renderização de paredes, céu, chão e objetos (sprites), oferecendo uma base simples para entender como jogos 3D antigos funcionavam internamente.',
    image: wolfenstein3d,
    github: 'https://github.com/Felipe-Gomes-Amorim',
  },
  {
    id: 'scx',
    stack: 'react / html / css / js',
    name: 'SCX - Sistema de Controle de Exames',
    type: 'Projeto de Conclusão de Curso / Estudo de React e Front-End',
    description:
      'O SCX visa atender a crescente necessidade de um sistema integrado entre laboratório, médicos e também incluindo pacientes por meio da fácil criação, gestão, vizualização e integração de exames.',
    image: scx,
    github: 'https://github.com/Felipe-Gomes-Amorim',
  },
]

const WORLDS = [
  {
    id:'determinants', subject:'MATEMÁTICAS II', icon:'🎃', title:'Pumpkin Dungeon',
    story:'Las puertas del calabozo solo se abren con determinantes correctos.', glow:'#ff8a1f',
    questions:[
      {q:'Si det(A)=0, ¿qué afirmación es correcta?', a:['A es invertible','A no es invertible','A es identidad','A tiene determinante 1'], correct:1, explain:'Una matriz cuadrada es invertible si y solo si su determinante es distinto de cero.'},
      {q:'Si una fila de una matriz se multiplica por 3, ¿qué ocurre con el determinante?', a:['No cambia','Se divide entre 3','Se multiplica por 3','Se hace cero'], correct:2, explain:'Multiplicar una fila por k multiplica el determinante por k.'},
      {q:'Dos filas proporcionales convierten el determinante en…', a:['1','−1','0','Depende del orden'], correct:2, explain:'Filas linealmente dependientes implican determinante nulo.'}
    ]
  },
  {
    id:'carbs', subject:'BIOLOGÍA Y12', icon:'🍬', title:'Candy Lab',
    story:'Identifica las muestras dulces antes de que el laboratorio quede sellado.', glow:'#ff4fa3',
    questions:[
      {q:'¿Cuál de estos glúcidos es un monosacárido?', a:['Sacarosa','Glucosa','Almidón','Glucógeno'], correct:1, explain:'La glucosa es una hexosa y un monosacárido.'},
      {q:'El enlace que une dos monosacáridos se denomina…', a:['Peptídico','Éster','O-glucosídico','Fosfodiéster'], correct:2, explain:'Los monosacáridos se unen mediante enlace O-glucosídico.'},
      {q:'¿Qué reactivo identifica almidón con coloración azul-negruzca?', a:['Benedict','Biuret','Lugol','Sudán III'], correct:2, explain:'El Lugol forma un complejo coloreado con la amilosa del almidón.'}
    ]
  },
  {
    id:'chemistry', subject:'QUÍMICA Y12', icon:'🧪', title:'Witch Molecular Lab',
    story:'Reconstruye las moléculas de la bruja y estabiliza el laboratorio.', glow:'#a8ff3e',
    questions:[
      {q:'Según Lewis, ¿cuántos enlaces covalentes forma normalmente el carbono?', a:['1','2','3','4'], correct:3, explain:'El carbono completa su octeto formando habitualmente cuatro enlaces covalentes.'},
      {q:'La geometría molecular de CH₄ es…', a:['Lineal','Angular','Trigonal plana','Tetraédrica'], correct:3, explain:'Cuatro pares enlazantes alrededor del C generan una geometría tetraédrica.'},
      {q:'Una molécula puede tener enlaces polares y ser globalmente apolar cuando…', a:['No tiene electrones','Los dipolos se cancelan por simetría','Tiene carga positiva','Contiene hidrógeno'], correct:1, explain:'La geometría puede hacer que los momentos dipolares se compensen.'}
    ]
  },
  {
    id:'gravity', subject:'FÍSICA Y13', icon:'☢️', title:'Radioactive Pumpkin',
    story:'Los núcleos de la calabaza están decayendo. Calcula antes de que el contador llegue a cero.', glow:'#7affc1',
    questions:[
      {q:'Tras una semivida queda aproximadamente…', a:['100 %','75 %','50 %','25 %'], correct:2, explain:'Por definición, tras una semivida queda la mitad de los núcleos iniciales.'},
      {q:'La relación correcta entre semivida y constante de desintegración es…', a:['T½=λ/ln2','T½=ln2/λ','T½=λ·ln2','T½=1/λ²'], correct:1, explain:'T½ = ln(2)/λ.'},
      {q:'La ley de desintegración radiactiva tiene comportamiento…', a:['Lineal','Cuadrático','Exponencial decreciente','Sinusoidal'], correct:2, explain:'N=N₀e^(−λt), por tanto es exponencial decreciente.'}
    ]
  },
  {
    id:'probability', subject:'MATEMÁTICAS CCSS', icon:'🍭', title:'Trick or Treat Loot Box',
    story:'Cada bolsa puede esconder un objeto común, raro o legendario. Calcula antes de abrirla.', glow:'#9f6bff',
    questions:[
      {q:'Una bolsa tiene 5 caramelos rojos y 5 verdes. P(rojo)=', a:['0,2','0,5','1','5'], correct:1, explain:'Hay 5 casos favorables de 10 posibles: 5/10=0,5.'},
      {q:'Si extraes dos caramelos SIN reemplazamiento, los sucesos son…', a:['Independientes','Dependientes','Incompatibles siempre','Equiprobables siempre'], correct:1, explain:'La primera extracción modifica la composición de la bolsa.'},
      {q:'P(A|B) se lee…', a:['A unión B','A intersección B','Probabilidad de A dado B','Complementario de A'], correct:2, explain:'Es la probabilidad condicionada de A sabiendo que ha ocurrido B.'}
    ]
  }
];

const BOSS = [
  {q:'Código 1: número de mundos necesarios para desbloquear el Boss.', answer:'5'},
  {q:'Código 2: si det(A)=0, escribe SI o NO: ¿A tiene inversa?', answer:'NO'},
  {q:'Código 3: después de una semivida, ¿qué porcentaje de núcleos queda? (solo número)', answer:'50'}
];

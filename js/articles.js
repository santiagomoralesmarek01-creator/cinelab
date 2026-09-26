// Artículos de CineLab: notas de opinión sobre cine, series y sus géneros.
//
// Para sumar uno, agregá un objeto a la lista con un `id` único (minúsculas y
// guiones). El `cuerpo` es una lista de bloques:
//   "texto"            → un párrafo
//   "## Subtítulo"     → un subtítulo
//   ["a", "b", "c"]    → una lista con viñetas
// Dentro del texto, [[id-del-titulo]] enlaza a su ficha del catálogo y
// [[id-del-titulo|otro texto]] hace lo mismo mostrando otro texto.
// `titulos` lista las fichas que se muestran al final del artículo.
window.CINELAB_ARTICULOS = [
  {
    id: "marvel-series",
    titulo: "Marvel: por qué sus series siguen conquistando al público",
    bajada: "Más allá de los superpoderes, las series de Marvel encontraron en el streaming una forma de acercarnos a sus personajes.",
    etiquetas: ["Series de Marvel", "Superhéroes"],
    titulos: ["wandavision", "loki", "falcon-and-the-winter-soldier", "daredevil"],
    cuerpo: [
      "Cuando pensamos en Marvel, probablemente lo primero que se nos viene a la cabeza son sus grandes películas y sus superhéroes más conocidos. Sin embargo, durante los últimos años, las series se convirtieron en una parte fundamental de este universo. Desde [[daredevil|Daredevil]] y Jessica Jones hasta [[wandavision|WandaVision]], [[loki|Loki]], Moon Knight y Ms. Marvel, Marvel encontró en la televisión y el streaming una manera diferente de contar sus historias y de acercarnos mucho más a sus personajes.",
      "Con la llegada de Disney+, Marvel comenzó una nueva etapa. [[wandavision|WandaVision]] fue probablemente una de las propuestas más originales: utilizó diferentes estilos de televisión para contar una historia relacionada con Wanda Maximoff y, al mismo tiempo, explorar emociones como el duelo y la pérdida. [[loki|Loki]], por otro lado, aprovechó al personaje para jugar con los viajes temporales, las distintas posibilidades del universo y la identidad del propio protagonista. [[falcon-and-the-winter-soldier|The Falcon and the Winter Soldier]] se enfocó más en la herencia del legado del Capitán América y en los conflictos sociales y políticos que rodean a sus protagonistas.",
      "Y si hay una serie que merece una mención especial, es [[daredevil|Daredevil]]. El personaje de Matt Murdock funciona porque combina dos mundos: durante el día es abogado y busca justicia a través de la ley; por la noche se convierte en un vigilante que protege su barrio. Esa dualidad hace que la historia sea mucho más que una serie de superhéroes. Marvel incluso volvió a recuperar al personaje para una nueva etapa televisiva, demostrando cuánto interés continúa generando entre los espectadores.",
      "## ¿Por qué son tan buenas?",
      "Creo que la respuesta está justamente en que no dependen únicamente de los superpoderes. Lo interesante está en los personajes, sus conflictos, sus vínculos y las decisiones que tienen que tomar. Algunas series funcionan mejor que otras, por supuesto, pero el atractivo está en que Marvel se anima a experimentar con diferentes géneros: drama, comedia, ciencia ficción, fantasía, acción e incluso misterio.",
      "Además, las series permiten conocer aspectos de los personajes que en una película de dos horas muchas veces quedarían afuera. Podemos acompañarlos durante más tiempo, entender sus motivaciones y ver cómo cambian. Esa conexión hace que el público no solamente quiera saber qué villano aparecerá después, sino también qué va a pasar con los personajes que ya aprendió a querer.",
      "En definitiva, las series de Marvel consiguieron ampliar un universo que parecía estar reservado para el cine. Y quizás ese sea su mayor logro: demostrar que detrás de cada traje, cada poder y cada batalla hay una historia humana capaz de generar identificación. Por eso, más allá de ser producciones de superhéroes, las series de Marvel siguen encontrando distintas maneras de entretenernos, sorprendernos y, algunas veces, hacernos pensar."
    ]
  },
  {
    id: "cris-morena",
    titulo: "Cris Morena: el fenómeno que marcó a generaciones",
    bajada: "Música, historias de crecimiento y personajes inolvidables: cómo sus series transformaron la televisión juvenil argentina.",
    etiquetas: ["Series infantojuveniles", "Televisión argentina"],
    titulos: ["chiquititas", "rebelde-way", "floricienta"],
    cuerpo: [
      "Hablar de las series juveniles e infantiles en Argentina es hablar de Cris Morena. Autora, compositora y productora, transformó la televisión local desde los años 90 en adelante, creando un universo propio lleno de música, historias de crecimiento y personajes inolvidables. Sus producciones traspasaron fronteras, conquistando a audiencias de América Latina, Europa y Medio Oriente, además de ayudar a dar inicio a las carreras de los actores más destacados del entretenimiento argentino.",
      "## Top 3 producciones emblemáticas",
      [
        "[[chiquititas|Chiquititas]] (1995–2001 / 2006): marcó un hito en la televisión infantil por su narrativa, sus canciones y sus icónicas temporadas teatrales en el Gran Rex.",
        "[[rebelde-way|Rebelde Way]] (2002–2003): la ficción que redefinió el drama juvenil en la región. Abordó temáticas adolescentes con un tono más realista y dio origen a la banda Erreway, que realizó giras internacionales masivas.",
        "[[floricienta|Floricienta]] (2004–2005): una adaptación moderna de los cuentos de hadas que se convirtió en un fenómeno de público y comercialización (merchandising, discos y giras mundiales)."
      ],
      "## Puntos fuertes",
      [
        "Poder musical e identitario: las bandas sonoras eran el motor de la historia, logrando una conexión emocional duradera con los espectadores.",
        "Ojo para el talento: funcionó como la gran cantera de actores de la televisión argentina (Lali Espósito, Peter Lanzani, Luisana Lopilato, Felipe Colombo, entre muchos otros).",
        "Producción visual: destacó por la calidad de escenografía, vestuario y despliegue en teatro."
      ],
      "## Datos curiosos",
      [
        "Impacto internacional: proyectos como Rebelde Way y Chiquititas contaron con adaptaciones locales en países como México (Rebelde), Chile, Brasil y Portugal.",
        "Continuidad del legado: el universo narrativo se mantiene activo con producciones recientes como Margarita (spin-off de Floricienta), lo que demuestra la vigencia de sus formatos en las plataformas de streaming actuales."
      ],
      "## Recomendación para ver un fin de semana",
      [
        "Para nostalgia pura: [[chiquititas|Chiquititas]] (temporadas 1997–1998).",
        "Para maratonear drama y música: [[rebelde-way|Rebelde Way]] (temporada 1) o Casi Ángeles (temporadas 2 y 3).",
        "Para público familiar: [[floricienta|Floricienta]]."
      ]
    ]
  },
  {
    id: "thrillers-actuacion",
    titulo: "Thrillers y policiales: lo que se cuenta en los silencios",
    bajada: "Una mirada actoral sobre el género, con Barreda como ejemplo de composición de personaje.",
    etiquetas: ["Thrillers / Policiales", "Actuación"],
    titulos: ["barreda"],
    cuerpo: [
      "En esta sección reseñamos películas y series que tengan definido un marco policial, de suspenso o de terror psicológico. Sugerencias y comparaciones, el desempeño actoral, la credibilidad, los giros y los gags que podamos notar dentro del estilo en cuestión.",
      "Como actriz valoro mucho el desarrollo de los personajes dentro de la historia: lo que transmiten y cuentan, cómo lo vivencian, los silencios, sus pausas, cómo se relacionan con el entorno y el contexto de lo no dicho.",
      "## A modo de ejemplo: Barreda (2026)",
      "Ricardo Barreda mató a su mujer, su suegra y sus dos hijas con una escopeta. Confesó y dijo que fue en defensa propia. En el juicio, su abogado lo presentó como víctima. La Argentina de los noventa le creyó: le hicieron canciones, sketches y estampitas. Lo llamaron el Santo Patrono de los hombres maltratados. Nadie preguntó por las cuatro mujeres muertas. Basada en hechos reales.",
      "¡Tremenda! Realmente sorprendente desempeño, sublime creación de Luis Machín en el cuerpo del protagonista. Si hablamos de composición de personajes, ya sabemos que Luis representa de forma excelente esos roles donde se genera algo en el espectador: tiene la calidad y capacidad de transmitir sensaciones cuando el personaje requiere llevarlo al extremo, y nunca pasa desapercibido un personaje dentro de su performance. Pero en esta ocasión creo que llegó al punto exacto de la perfección. Siempre se puede más, pero a veces menos es más, y acá está el salto actoral, que resalta en esta composición precisa y hermosa.",
      "Acompañan acorde al desarrollo Carla Peterson, la incómoda Mercedes Morán y Maite Lanata. Un trabajo en equipo muy bien logrado, contando una de las historias más incómodas de relatar, por lo que pasó y por cómo la sociedad reaccionó frente al asesinato de cuatro mujeres. [[barreda|Ver la ficha de Barreda]]."
    ]
  },
  {
    id: "top-terror-2025",
    titulo: "Top 3: las películas de terror de 2025",
    bajada: "Historia, actuaciones y la forma de generar miedo: nuestro ranking combina la crítica, el público y nuestra opinión.",
    etiquetas: ["Terror y Suspenso", "Rankings"],
    titulos: ["sinners", "weapons", "el-conjuro-ultimos-ritos"],
    cuerpo: [
      "En esta sección de CineLab analizamos películas y series de terror y suspenso. Las reseñas tienen en cuenta la historia, las actuaciones, los personajes, los giros y la forma en que cada producción logra generar miedo o tensión.",
      "También nos interesa observar cómo trabajan los actores: qué transmiten sus personajes, cómo reaccionan ante las situaciones y cómo se relacionan con el lugar y las personas que los rodean. Para este ranking elegimos tres películas de terror destacadas de 2025, teniendo en cuenta las opiniones de la crítica y del público, pero también la nuestra.",
      "## 🥇 1. Sinners",
      "[[sinners|Sinners]], dirigida por Ryan Coogler y protagonizada por Michael B. Jordan, mezcla terror, vampiros y drama. La historia sigue a dos hermanos que regresan a su pueblo y se encuentran con una amenaza inesperada. Uno de los puntos más interesantes es la actuación de Michael B. Jordan, ya que interpreta a dos personajes diferentes. También se destacan la música, la ambientación y la forma en que la película combina el terror con temas como la familia y la violencia.",
      "## 🥈 2. Weapons",
      "[[weapons|Weapons]], dirigida por Zach Cregger, comienza con la desaparición de varios niños de una misma clase durante la misma noche. A partir de ahí comienza un misterio para descubrir qué pasó. La película se destaca por el suspenso y por la forma en que va dando pistas poco a poco. También se puede analizar el trabajo de Josh Brolin y Julia Garner y cómo sus personajes enfrentan una situación cada vez más extraña.",
      "## 🥉 3. El Conjuro: Últimos Ritos",
      "[[el-conjuro-ultimos-ritos|El Conjuro: Últimos Ritos]] continúa la historia de Ed y Lorraine Warren, interpretados por Patrick Wilson y Vera Farmiga, que vuelven a enfrentarse a un caso paranormal. En este caso analizamos principalmente las actuaciones, la relación entre los protagonistas y la forma en que la película utiliza los sonidos, los silencios y la ambientación para generar miedo. También se puede comparar con las películas anteriores de la saga."
    ]
  }
];

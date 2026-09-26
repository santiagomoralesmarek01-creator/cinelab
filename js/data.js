// Catálogo de CineLab. Para sumar un título, agregá un objeto a `items`
// con un `id` único (sin espacios): se usa en la URL y para guardar reseñas.
window.CINELAB_DATA = {
  categorias: {
    "Series infantojuveniles": {
      titulo: "Cris Morena: el fenómeno que marcó a generaciones",
      intro: "Hablar de las series juveniles e infantiles en Argentina es hablar de Cris Morena. Autora, compositora y productora, transformó la televisión local desde los años 90 creando un universo propio lleno de música, historias de crecimiento y personajes inolvidables. Sus producciones conquistaron audiencias de América Latina, Europa y Medio Oriente, y fueron la cantera de actores como Lali Espósito, Peter Lanzani, Luisana Lopilato y Felipe Colombo.",
      recomendacion: [
        "Para nostalgia pura: Chiquititas (temporadas 1997–1998).",
        "Para maratonear drama y música: Rebelde Way (temporada 1) o Casi Ángeles (temporadas 2 y 3).",
        "Para público familiar: Floricienta."
      ]
    },
    "Thrillers / Policiales": {
      titulo: "Thrillers y policiales",
      intro: "Películas y series con marco policial, suspenso o terror psicológico. Sugerencias y comparaciones, el desempeño actoral, la credibilidad y los giros de cada historia. Valoramos el desarrollo de los personajes: lo que transmiten, sus silencios y pausas, cómo se relacionan con el entorno y el contexto de lo no dicho."
    },
    "Terror y Suspenso": {
      titulo: "Terror y suspenso",
      intro: "Analizamos la historia, las actuaciones, los personajes, los giros y la forma en que cada producción logra generar miedo o tensión. El Top 3 de 2025 combina la opinión de la crítica, del público y la nuestra."
    },
    "Series de Marvel": {
      titulo: "Marvel: por qué sus series siguen conquistando al público",
      intro: "Desde Daredevil y Jessica Jones hasta WandaVision, Loki, Moon Knight y Ms. Marvel, Marvel encontró en la televisión y el streaming una manera diferente de contar sus historias y de acercarnos mucho más a sus personajes. Lo interesante no son solo los superpoderes, sino los personajes, sus conflictos y las decisiones que tienen que tomar."
    }
  },

  items: [
    {
      id: "chiquititas",
      titulo: "Chiquititas",
      categoria: "Series infantojuveniles",
      tipo: "Serie",
      anio: "1995–2001 / 2006",
      anioNum: 1995,
      reparto: "Producción de Cris Morena",
      rating: 8.5,
      sinopsis: "Marcó un hito en la televisión infantil argentina por su narrativa, sus canciones y sus icónicas temporadas teatrales en el Gran Rex.",
      resenaEquipo: "Tuvo adaptaciones locales en países como Brasil y Portugal. Las bandas sonoras eran el motor de la historia y lograron una conexión emocional duradera con los espectadores. Para nostalgia pura: las temporadas 1997–1998."
    },
    {
      id: "rebelde-way",
      titulo: "Rebelde Way",
      categoria: "Series infantojuveniles",
      tipo: "Serie",
      anio: "2002–2003",
      anioNum: 2002,
      reparto: "Producción de Cris Morena · dio origen a la banda Erreway",
      rating: 8.7,
      sinopsis: "La ficción que redefinió el drama juvenil en la región. Abordó temáticas adolescentes con un tono más realista y tuvo giras internacionales masivas.",
      resenaEquipo: "Dio origen a la banda Erreway y tuvo su versión mexicana, Rebelde. Ideal para maratonear drama y música: arrancá por la temporada 1."
    },
    {
      id: "floricienta",
      titulo: "Floricienta",
      categoria: "Series infantojuveniles",
      tipo: "Serie",
      anio: "2004–2005",
      anioNum: 2004,
      reparto: "Producción de Cris Morena",
      rating: 8.2,
      sinopsis: "Adaptación moderna de los cuentos de hadas que se convirtió en un fenómeno de público, con merchandising, discos y giras mundiales. Tuvo un spin-off reciente: Margarita.",
      resenaEquipo: "Destacó por la calidad de escenografía, vestuario y despliegue en teatro. Su universo sigue vigente en streaming con Margarita. La recomendación ideal para ver en familia."
    },
    {
      id: "barreda",
      titulo: "Barreda",
      categoria: "Thrillers / Policiales",
      tipo: "Película",
      anio: "2026",
      anioNum: 2026,
      reparto: "Luis Machín, Carla Peterson, Mercedes Morán, Maite Lanata",
      rating: 9,
      sinopsis: "Ricardo Barreda mató a su mujer, su suegra y sus dos hijas con una escopeta y se presentó como víctima. La Argentina de los noventa le creyó: le hicieron canciones, sketches y estampitas. Nadie preguntó por las cuatro mujeres muertas. Basada en hechos reales.",
      resenaEquipo: "¡Tremenda! Sublime creación de Luis Machín en el cuerpo del protagonista. Luis representa de forma excelente esos roles donde se genera algo en el espectador, pero en esta ocasión llegó al punto exacto: a veces menos es más, y acá está el salto actoral. Acompañan acorde al desarrollo Carla Peterson, la incómoda Mercedes Morán y Maite Lanata, en un trabajo en equipo muy bien logrado que cuenta una de las historias más incómodas de relatar."
    },
    {
      id: "sinners",
      titulo: "Sinners",
      categoria: "Terror y Suspenso",
      tipo: "Película",
      anio: "2025",
      anioNum: 2025,
      reparto: "Michael B. Jordan · dir. Ryan Coogler",
      rating: 9,
      top: 1,
      sinopsis: "Mezcla terror, vampiros y drama. Dos hermanos regresan a su pueblo y se encuentran con una amenaza inesperada.",
      resenaEquipo: "Uno de los puntos más interesantes es la actuación de Michael B. Jordan, que interpreta a dos personajes diferentes. También se destacan la música, la ambientación y la forma en que combina el terror con temas como la familia y la violencia."
    },
    {
      id: "weapons",
      titulo: "Weapons",
      categoria: "Terror y Suspenso",
      tipo: "Película",
      anio: "2025",
      anioNum: 2025,
      reparto: "Josh Brolin, Julia Garner · dir. Zach Cregger",
      rating: 8.5,
      top: 2,
      sinopsis: "Varios niños de una misma clase desaparecen la misma noche, dando inicio a un misterio que se revela de a poco.",
      resenaEquipo: "Se destaca por el suspenso y por la forma en que va dando pistas poco a poco. Vale la pena mirar el trabajo de Josh Brolin y Julia Garner y cómo sus personajes enfrentan una situación cada vez más extraña."
    },
    {
      id: "el-conjuro-ultimos-ritos",
      titulo: "El Conjuro: Últimos Ritos",
      categoria: "Terror y Suspenso",
      tipo: "Película",
      anio: "2025",
      anioNum: 2025,
      reparto: "Patrick Wilson, Vera Farmiga",
      rating: 8,
      top: 3,
      sinopsis: "Ed y Lorraine Warren vuelven a enfrentarse a un caso paranormal.",
      resenaEquipo: "Se destaca la relación entre los protagonistas y el uso de sonidos, silencios y ambientación para generar miedo. Una buena excusa para compararla con las películas anteriores de la saga."
    },
    {
      id: "wandavision",
      titulo: "WandaVision",
      categoria: "Series de Marvel",
      tipo: "Serie",
      anio: "2021",
      anioNum: 2021,
      reparto: "Elizabeth Olsen, Paul Bettany · Disney+",
      rating: null,
      sinopsis: "Wanda Maximoff y Visión viven una vida suburbana ideal que cambia de estilo de televisión episodio a episodio, hasta que empiezan a sospechar que nada es lo que parece.",
      resenaEquipo: "Probablemente una de las propuestas más originales de Marvel en Disney+: utilizó diferentes estilos de televisión para contar una historia relacionada con Wanda Maximoff y, al mismo tiempo, explorar emociones como el duelo y la pérdida."
    },
    {
      id: "loki",
      titulo: "Loki",
      categoria: "Series de Marvel",
      tipo: "Serie",
      anio: "2021–2023",
      anioNum: 2021,
      reparto: "Tom Hiddleston, Owen Wilson, Sophia Di Martino · Disney+",
      rating: null,
      sinopsis: "El dios del engaño queda atrapado por la Autoridad de Variación Temporal y tiene que ayudar a reparar la línea del tiempo que él mismo alteró.",
      resenaEquipo: "Aprovecha al personaje para jugar con los viajes temporales, las distintas posibilidades del universo y la identidad del propio protagonista."
    },
    {
      id: "falcon-and-the-winter-soldier",
      titulo: "The Falcon and the Winter Soldier",
      categoria: "Series de Marvel",
      tipo: "Serie",
      anio: "2021",
      anioNum: 2021,
      reparto: "Anthony Mackie, Sebastian Stan · Disney+",
      rating: null,
      sinopsis: "Sam Wilson y Bucky Barnes se unen tras el retiro de Steve Rogers y enfrentan una amenaza global mientras discuten quién debe cargar con el escudo.",
      resenaEquipo: "Se enfoca en la herencia del legado del Capitán América y en los conflictos sociales y políticos que rodean a sus protagonistas."
    },
    {
      id: "daredevil",
      titulo: "Daredevil",
      categoria: "Series de Marvel",
      tipo: "Serie",
      anio: "2015–2018 / 2025",
      anioNum: 2015,
      reparto: "Charlie Cox, Vincent D'Onofrio, Deborah Ann Woll",
      rating: null,
      sinopsis: "Matt Murdock, abogado ciego de Hell's Kitchen, busca justicia de día en los tribunales y de noche como un vigilante enmascarado. Volvió en una nueva etapa con Daredevil: Born Again.",
      resenaEquipo: "La serie que merece una mención especial. Matt Murdock funciona porque combina dos mundos: durante el día es abogado y busca justicia a través de la ley; por la noche se convierte en un vigilante que protege su barrio. Esa dualidad hace que la historia sea mucho más que una serie de superhéroes, y que Marvel haya vuelto a recuperar al personaje demuestra cuánto interés sigue generando."
    }
  ]
};

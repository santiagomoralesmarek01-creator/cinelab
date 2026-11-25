// Catálogo de CineLab. Para sumar un título, agregá un objeto a `items`
// con un `id` único (sin espacios): se usa en la URL y para guardar reseñas.
// Campos opcionales: `detalles` (plataforma, duración…), `foto` (ruta a una
// imagen en img/) y `resena` = { autor, titulo, calificacion, cuerpo } para la
// reseña firmada; `cuerpo` usa el mismo formato que los artículos.
window.CINELAB_DATA = {
  // Integrantes del proyecto: se sugieren al firmar un artículo.
  equipo: [
    "Rocío Stagno", "Rocío Nicole Murillo Yñiguez", "Daiana Solis", "Camila Cardozo",
    "Facundo Britez", "Ramiro García", "Priscila Alvarado", "Carolina Ardenghi"
  ],

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
    },
    "Películas de Marvel": {
      titulo: "Películas de Marvel",
      intro: "Del origen de Iron Man al legado de Wakanda: reseñas de las películas que construyeron el universo cinematográfico de Marvel, con atención a sus personajes, sus conflictos y lo que dejan más allá de la acción."
    },
    "Fantasía y animación": {
      titulo: "Fantasía y animación",
      intro: "Mundos imposibles, stop-motion, cuentos y aventuras para toda la familia: películas que se animan a imaginar."
    },
    "Acción y drama": {
      titulo: "Acción y drama",
      intro: "Persecuciones, conspiraciones, juicios y forajidos: historias de alto voltaje y dilemas morales, muchas de ellas entre lo más visto en las plataformas."
    },
    "Películas románticas": {
      titulo: "Películas románticas",
      intro: "Comedias románticas, dramas y romances pensados para el streaming: reseñas que miran más allá del final feliz, con atención a cómo cada película representa el amor, los vínculos y el crecimiento de sus personajes."
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
    },
    {
      id: "animales",
      titulo: "Animales",
      categoria: "Thrillers / Policiales",
      tipo: "Película",
      anio: "2026",
      anioNum: 2026,
      reparto: "Ben Affleck, Kerry Washington, Gillian Anderson, Steven Yeun · dir. Ben Affleck",
      detalles: "Netflix · 106 min · Guion: Ben Affleck, Connor O. McIntyre y Billy Ray",
      rating: 7,
      sinopsis: "Cuando el hijo del candidato político Mark Kimball (Ben Affleck) y su esposa (Kerry Washington) es secuestrado, la pareja se ve arrastrada a una violenta red de extorsión, ambición y secretos del pasado. Con un reloj en contra y la presión de los medios y de sus propios asesores, la búsqueda del niño los obligará a cruzar límites morales irreversibles.",
      resena: {
        autor: "Carolina Ardenghi",
        titulo: "El dilema moral de Ben Affleck en un thriller sofocante",
        calificacion: "3,5 / 5",
        cuerpo: [
          "## El regreso de Affleck al thriller de tensión dura",
          "En su sexto largometraje como director, Ben Affleck demuestra su solidez en el género del thriller criminal y de suspenso urbano. Lejos del tono político/biográfico de Argo o Air, Animales conecta con la desesperación moral de Desapareció una noche (Gone Baby Gone) y la tensión inmediata de Atraco en la ciudad (The Town).",
          "La temática del secuestro no es nueva en el cine, pero el guion coescrito con Billy Ray logra esquivar la fórmula habitual centrándose en el dilema ético: ¿hasta qué punto la fachada de perfección de la élite política es capaz de sacrificar vidas con tal de mantenerse a salvo?",
          "## Dirección técnica y puesta en escena",
          "La película destaca por ser ágil y por tener una atmósfera claustrofóbica. Affleck utiliza encuadres cerrados y tonos fríos para reflejar el aislamiento psicológico de los personajes. La banda sonora de Harry Gregson-Williams acentúa el ritmo constante de cuenta regresiva sin caer en estridencias.",
          "## Las actuaciones: sólidos personajes e interpretaciones",
          [
            "Ben Affleck ofrece una interpretación sobria y fatigada, encarnando con soltura a un hombre devorado por la ambición y el pánico contenido.",
            "Kerry Washington aporta la carga emocional más compleja de la trama, moviéndose con precisión entre la desesperación maternal y la ira.",
            "Gillian Anderson y Steven Yeun funcionan como pilares secundarios sólidos: la presencia magnética de Anderson domina cada escena en la que aparece, aportando un matiz frío que eleva el misterio alrededor del complot."
          ],
          "## Puntos débiles",
          "A pesar de su ritmo impecable, el tercer acto peca de precipitación. El clímax busca un giro dramático que puede resultar algo forzado o convencional para los espectadores habituados a tramas de extorsión y traición. Además, el desarrollo de algunos personajes secundarios queda desdibujado en función del avance implacable del reloj.",
          "## Conclusión",
          "Animales es un thriller eficaz, sobrio y directo. Si bien no reinventa el género de los secuestros ni alcanza la maestría narrativa de sus primeros trabajos detrás de cámara, confirma la destreza de Ben Affleck para construir tensión constante y ofrecer un entretenido drama oscuro sobre las grietas morales del poder.",
          [
            "Lo mejor: el pulso narrativo, la química conflictiva entre Affleck y Washington y la actuación de Gillian Anderson.",
            "Lo peor: un tramo final predecible que sacrifica la complejidad temática en favor del impacto rápido."
          ]
        ]
      }
    },
    {
      id: "el-contador",
      titulo: "El contador",
      categoria: "Thrillers / Policiales",
      tipo: "Película",
      anio: "2016",
      anioNum: 2016,
      reparto: "Ben Affleck, Anna Kendrick, J.K. Simmons, Jon Bernthal, John Lithgow · dir. Gavin O'Connor",
      detalles: "Netflix · 2 h 8 min · Título original: The Accountant · Guion: Bill Dubuque",
      rating: null,
      sinopsis: "Christian Wolff es un genio de los números con trastorno del espectro autista, moldeado por una severa disciplina militar paterna, que trabaja en las sombras mientras una investigación del Departamento del Tesoro y una conspiración corporativa lo ponen en la mira.",
      resena: {
        autor: "Carolina Ardenghi",
        titulo: "Más allá de los números: una mirada analítica de “El contador”",
        cuerpo: [
          "Cuando pensamos en los protagonistas del cine de acción, solemos imaginar al clásico espía a prueba de balas, al detective cínico con pasado trágico o al superhéroe. Sin embargo, en 2016 el director Gavin O'Connor (Warrior) rompió parcialmente el molde con El contador (The Accountant), un thriller que pone en el centro de la narrativa a un protagonista atípico: un genio de los números con trastorno del espectro autista (TEA) interpretado por Ben Affleck.",
          "Pochoclera, sí, pero más allá de sus impresionantes secuencias de acción, la película plantea debates interesantes sobre la neurodivergencia, la ética corporativa y la construcción del arquetipo heroico en el cine comercial.",
          "## La neurodivergencia en pantalla: ¿superpoder o representación compleja?",
          "El tema central del filme es Christian Wolff (Affleck), un hombre con una capacidad matemática prodigiosa y una extrema dificultad para la interacción social, moldeado por una disciplina militar paterna severa. Desde una perspectiva analítica, la película transita por una delgada línea: por un lado, utiliza la condición de Wolff como el motor de sus \"habilidades especiales\" (acercándose al tropo de la discapacidad convertida en superpoder); por otro, humaniza al personaje a través de sus rituales sensoriales, sus crisis y su búsqueda constante de orden en un mundo caótico.",
          "La pregunta acá sería si el director, desde su perspectiva, ¿fomenta la empatía y la visibilidad, o perpetúa mitos al vincular la genialidad matemática con el perfil letal de un asesino altamente entrenado?",
          "## La estética de la precisión",
          "Uno de los aciertos de O'Connor es cómo la puesta en escena refleja la psiquis del protagonista. La cinematografía prioriza la simetría, los encuadres limpios y una paleta de colores fríos que simulan la lógica de un balance contable.",
          "Del mismo modo, las coreografías de acción —lejos del caos artificial de los cortes rápidos habituales— apuestan por técnicas reales. Cada movimiento de Wolff en combate no es una muestra de ira gratuita, sino la aplicación de un algoritmo físico: economía de energía, eficiencia y resolución geométrica del peligro. La forma en que se mueve es, literalmente, la forma en que piensa.",
          "## El guion: ambición desmedida",
          "El filme sufre de un exceso de tramas paralelas: la investigación federal liderada por el Departamento del Tesoro, los flashbacks formativos de la infancia, la conspiración corporativa de la empresa de robótica y la subtrama criminal. Esta saturación narrativa fragmenta el ritmo, impidiendo que el espectador profundice tanto como desearía en los dilemas éticos y humanos de su protagonista.",
          "## ¿Vale la pena?",
          "El contador no pretende ser una obra maestra, pero abre el género del thriller de acción estadounidense hacia el drama psicológico, el cine negro y la acción táctica, y apela a audiencias masivas sin dejar del todo de lado la inclusión y la salud mental."
        ]
      }
    },
    {
      id: "el-affaire-miu-miu",
      titulo: "El affaire Miu Miu",
      categoria: "Thrillers / Policiales",
      tipo: "Cortometraje",
      anio: "2024",
      anioNum: 2024,
      reparto: "Laura Paredes, Ezequiel Pierri, Verónica Llinás, Mariana Chaud, Cintia Choza · dir. Laura Citarella",
      detalles: "Argentina · 29 min · Dirección y guion: Laura Citarella",
      rating: 8,
      sinopsis: "La llegada de una marca italiana de alta costura a Trenque Lauquen se transforma en una investigación cuando la modelo desaparece misteriosamente. Una detective, una vidente y una policía intentan reconstruir lo que pasó, en un relato donde el misterio, el humor y lo absurdo se entrelazan.",
      resena: {
        autor: "Carolina Ardenghi",
        calificacion: "4 / 5 — Una pequeña joya del cortometraje argentino contemporáneo",
        cuerpo: [
          "En El affaire Miu Miu, la directora argentina Laura Citarella construye una historia en la que el misterio, el humor y lo absurdo se entrelazan. La trama comienza con la llegada de una marca de alta costura italiana a Trenque Lauquen, una ciudad de la provincia de Buenos Aires. Sin embargo, lo que inicialmente parece ser un acontecimiento vinculado con la moda se transforma en una investigación cuando la modelo desaparece misteriosamente.",
          "A partir de esta situación, la película se aleja de las convenciones del policial tradicional. La investigación no avanza de manera lineal ni ofrece respuestas definitivas. Por el contrario, las pistas, los diálogos y las situaciones cotidianas construyen un universo en el que lo inexplicable parece formar parte de la realidad. Esta decisión narrativa invita al espectador a abandonar la necesidad de encontrar una explicación lógica para cada acontecimiento y a disfrutar de la incertidumbre.",
          "## Comedia, absurdo y misterio",
          "La investigación está protagonizada por personajes femeninos que ocupan posiciones centrales. Una detective, una vidente y una policía intentan reconstruir los acontecimientos relacionados con la desaparición de la modelo. No obstante, sus métodos y comportamientos se alejan de la solemnidad que suele caracterizar a los personajes de las historias policiales.",
          "El humor surge, en parte, de la manera en que estas mujeres se relacionan con las pistas y desarrollan la investigación. En lugar de presentar una búsqueda completamente racional, la película incorpora intuiciones, situaciones insólitas y momentos que parecen responder más al juego que a la necesidad de resolver el caso.",
          "Esta elección narrativa permite pensar en la representación de las mujeres desde una perspectiva diferente. Los personajes no están construidos exclusivamente en función de una mirada romántica ni aparecen subordinados a una figura masculina que conduzca la investigación. Son ellas quienes observan, interpretan y construyen sus propias versiones de los hechos.",
          "Por otra parte, la desaparición de la modelo introduce una cuestión relevante: ¿qué sucede cuando una mujer deja de ocupar el lugar que otros le han asignado? Su ausencia interrumpe el acontecimiento organizado alrededor de su imagen y obliga a los demás personajes a buscarla, interpretarla y reconstruir sus movimientos.",
          "En este sentido, la película permite una lectura que trasciende el misterio argumental: la mujer que inicialmente aparece como objeto de observación termina convirtiéndose en el centro de una historia que nadie consigue controlar por completo.",
          "## La imagen, el paisaje y el ritmo cinematográfico",
          "El paisaje pampeano cumple una función fundamental en la construcción del universo de la película. La inmensidad del campo contrasta con el mundo de la moda internacional y contribuye a generar la atmósfera enrarecida. En este escenario, lo cotidiano puede adquirir un carácter misterioso y los objetos más comunes pueden convertirse en señales de algo desconocido.",
          "El entorno participa en el relato y condiciona la manera en que los personajes perciben los acontecimientos. La modelo desaparecida parece integrarse progresivamente en ese espacio, como si su figura y el paisaje comenzaran a formar parte de una misma experiencia.",
          "El ritmo también se distancia del cine comercial convencional. La película permite detenerse en conversaciones, gestos y situaciones que no necesariamente hacen avanzar la investigación pero que contribuyen a construir una atmósfera particular. El espectador no recibe toda la información organizada de manera clara, sino que debe relacionar elementos, formular hipótesis y aceptar que algunas preguntas permanezcan abiertas. Así, el misterio deja de ser solamente un problema que debe resolverse y se convierte en una forma de experimentar el relato.",
          "## Conclusión",
          "El affaire Miu Miu es una propuesta cinematográfica sumamente refinada e inteligente. Demuestra cómo el cine de autor puede dialogar con marcas globales sin perder su esencia. Lejos de dar respuestas masticadas sobre el paradero de la modelo, el filme nos invita a celebrar el misterio, la libertad de perderse y la belleza de lo inexplorado."
        ]
      }
    },
    {
      id: "gordon",
      titulo: "Gordon",
      categoria: "Thrillers / Policiales",
      tipo: "Serie",
      anio: "2026",
      anioNum: 2026,
      reparto: "Rodrigo de la Serna, Matías Recalt, Camila Peralta, Fiorella Bottaioli, Agustín Pardella, Matías Mayer · dir. Pablo Trapero y Pablo Fendrik",
      detalles: "Netflix · Miniserie de 7 episodios (37 a 53 min) · Basada en los libros de Marcelo Larraquy",
      foto: "img/gordon.jpg",
      rating: null,
      sinopsis: "Gordon reconstruye el recorrido criminal de Aníbal Gordon, una de las figuras más oscuras de la historia argentina: de delincuente común dedicado al robo de autos, joyerías y bancos —como el célebre golpe en Bariloche— a integrante del servicio de inteligencia (SIDE) y de los grupos parapoliciales de la Triple A en la convulsionada década de 1970.",
      resena: {
        autor: "Carolina Ardenghi",
        titulo: "El descenso hacia las sombras de los años setenta",
        cuerpo: [
          "## El thriller criminal como radiografía histórica",
          "Lejos de plantear una biografía convencional o buscar empatía con su protagonista, la dupla creativa conformada por Pablo Trapero (El clan, Carancho) y Pablo Fendrik (El ardor, La sangre brota) aborda el relato desde un thriller criminal crudo, tenso y de enorme verosimilitud. Con la colaboración en el guion del propio Marcelo Larraquy, autor de las investigaciones periodísticas en las que se basa la serie, la narrativa evita adornos para mostrar cómo la violencia de la delincuencia común encontró un terreno fértil y funcional dentro del terrorismo de Estado.",
          "El gran sostén dramático de la miniserie es la interpretación de Rodrigo de la Serna. El actor compone a un Gordon magnético pero profundamente inquietante: un sujeto pragmático, camaleónico (capaz de operar bajo múltiples identidades falsas) que transita del delito marginal al ejercicio de la crueldad institucionalizada con una frialdad perturbadora. Lo acompañan Camila Peralta como una agente de inteligencia, Matías Recalt y Fiorella Bottaioli, quienes aportan profundidad y tensión dramática a un entramado donde la traición y la paranoia son moneda corriente.",
          "En el plano técnico, la reconstrucción de época resulta impecable: desde la fotografía granulada y sombría de Julián Apezteguía hasta el diseño de arte en locaciones de Buenos Aires y Bariloche, acompañados por una selección musical que cruza el rock nacional y el folclore de los setenta para subrayar el contraste entre la efervescencia cultural de la época y el avance de la represión.",
          "## Conclusión",
          "Gordon se consolida como uno de los thrillers políticos más contundentes de la producción argentina reciente en streaming. Con pulso cinematográfico y una narración que atrapa desde la mecánica del policial para luego sumergirse en el horror histórico, Trapero, Fendrik y De la Serna entregan un retrato incómodo y necesario sobre los vínculos entre el crimen organizado y los aparatos clandestinos del poder."
        ]
      }
    },
    {
      id: "agatha-all-along",
      titulo: "Agatha All Along",
      categoria: "Series de Marvel",
      tipo: "Serie",
      anio: "2024",
      anioNum: 2024,
      reparto: "Kathryn Hahn, Aubrey Plaza, Joe Locke · Disney+",
      foto: "img/agatha-all-along.jpg",
      rating: null,
      sinopsis: "Agatha Harkness, una bruja que perdió sus poderes, busca recuperarlos recorriendo el Sendero de las Brujas junto a un grupo de brujas.",
      resena: {
        autor: "Ramiro García",
        cuerpo: [
          "Uno de los puntos en los que más se destaca es en sus actores. Kathryn Hahn realiza una interpretación excelente, logrando que Agatha sea un personaje divertido, manipulador y mucho más profundo de lo que parece. También se destacan las actuaciones de Aubrey Plaza y Joe Locke, que aportan personalidad y misterio a la historia.",
          "Visualmente, la serie se ve muy bien, tanto los filtros usados como sus efectos especiales. La ambientación oscura, los escenarios, el vestuario y los elementos relacionados con la brujería construyen una atmósfera similar a [[wandavision|WandaVision]], siguiendo muy bien la trilogía.",
          "Sin embargo, no toda la serie es perfecta. Algunos episodios pueden sentirse repetitivos, ya que el ritmo de la historia pierde fuerza en determinados momentos. Los episodios tienen el mismo objetivo y aburre. También hay situaciones que podrían haberse desarrollado con mayor profundidad."
        ]
      }
    },
    {
      id: "visionquest",
      titulo: "VisionQuest",
      categoria: "Series de Marvel",
      tipo: "Serie",
      anio: "2026",
      anioNum: 2026,
      reparto: "Paul Bettany · Disney+",
      foto: "img/visionquest.jpg",
      rating: null,
      sinopsis: "Tras lo ocurrido en WandaVision, Visión se propone descubrir quién es, averiguar sobre su pasado y encontrar a su hijo Thomas Maximoff.",
      resena: {
        autor: "Ramiro García",
        cuerpo: [
          "Uno de los aspectos más interesantes de la serie es su profundidad temática. Más allá de las escenas de acción características de Marvel, propone una reflexión sobre la inteligencia artificial, la conciencia, la humanidad y lo que significa tener sentimientos. Visión sufre de su falta de identidad y carga con el peso de su pasado. Tras lo ocurrido en [[wandavision|WandaVision]], Visión se propone saber quién es y averiguar sobre su pasado y su hijo Thomas Maximoff.",
          "Sin embargo, la serie tiene algunos puntos débiles. En determinados momentos, la trama se vuelve demasiado compleja y presenta demasiadas explicaciones sobre el universo de Marvel, lo que puede dificultar la comprensión para quienes no conocen la historia. Además, algunas situaciones podrían haber tenido un mayor desarrollo emocional. Como presentan demasiados personajes nuevos, es complicado empatizar con lo que pasa en la serie."
        ]
      }
    },
    {
      id: "gente-que-conocemos-en-vacaciones",
      titulo: "Gente que conocemos en vacaciones",
      categoria: "Películas románticas",
      tipo: "Película",
      anio: "2026",
      anioNum: 2026,
      reparto: "Basada en la novela de Emily Henry",
      detalles: "Título original: People We Meet on Vacation",
      rating: null,
      sinopsis: "Dos mejores amigos con tensión sentimental repasan, entre saltos temporales, los viajes que hicieron juntos y la última excursión que pone a prueba su vínculo. Adaptación de la novela de Emily Henry.",
      resena: {
        autor: "Facundo Britez",
        cuerpo: [
          "La película se inserta dentro de la renovación contemporánea de la comedia romántica para plataformas de streaming, un subgénero que recicla la figura de los “mejores amigos con tensión sentimental” ya consolidada en la novela original de Emily Henry. La narrativa recurre a una estructura de saltos temporales que va alternando los viajes pasados y la última excursión de la pareja protagónica, con el objetivo de dar cuenta del desgaste progresivo de su vínculo afectivo. Formalmente, la propuesta funciona en sus momentos de mayor contención, como la escena de la fiebre en Noruega, donde se reduce la banda sonora para centrarse en la intimidad de los personajes; sin embargo, la adaptación suaviza la voz introspectiva e irónica del texto literario.",
          "Esta simplificación traslada la historia hacia una estética más cercana a la postal turística. Los escenarios, entre ellos Barcelona, funcionan más como atractivo visual para el catálogo de la plataforma que como espacio con significado dramático. A nivel de análisis cultural, el éxito masivo de la producción no responde únicamente a su calidad cinematográfica, sino a una demanda del público por historias románticas predecibles y reconfortantes. El filme termina siendo un producto correcto, pero poco arriesgado: reproduce los códigos del género sin profundizar en la complejidad emocional que hacía atractiva la obra original."
        ]
      }
    },
    {
      id: "el-encanto-del-champan",
      titulo: "El encanto del champán",
      categoria: "Películas románticas",
      tipo: "Película",
      anio: "2025",
      anioNum: 2025,
      reparto: "Minka Kelly",
      detalles: "Título original: Champagne Problems",
      rating: null,
      sinopsis: "Una ejecutiva estadounidense agobiada por el mundo corporativo viaja a Francia para cerrar la compra de un viñedo de champán y termina enamorándose de un heredero local, en un romance pensado para la época navideña.",
      resena: {
        autor: "Facundo Britez",
        cuerpo: [
          "Esta obra ejemplifica el modelo de romance estacional pensado para la época navideña, con todos los rasgos típicos de la producción para streaming: protagonista profesional agobiada por el mundo corporativo, escenario europeo pintoresco, conflicto comercial y romance con un heredero local. Si bien la previsibilidad es un rasgo esperable dentro de este tipo de relatos, la crítica principal apunta a su construcción ideológica. La historia opone dos mundos: el capitalismo agresivo estadounidense, encarnado por la ejecutiva protagonista, y la tradición artesanal francesa representada por el viñedo de champán.",
          "La resolución del conflicto no cuestiona la lógica de las compras empresariales, sino que propone una especie de “capitalismo bondadoso”: la protagonista aprende a valorar la tradición sin modificar de raíz su forma de trabajar. Se trata de una fantasía muy recurrente en las películas románticas actuales, donde el desarrollo personal se reduce a un cambio de actitud superficial. La fotografía cuidada y la actuación de Minka Kelly logran sostener la cinta, pero no alcanzan para disimular que es una narración muy cómoda, que no invita a reflexionar más allá de la entretención ligera."
        ]
      }
    },
    {
      id: "mi-lista-de-deseos",
      titulo: "Mi lista de deseos",
      categoria: "Películas románticas",
      tipo: "Película",
      anio: "2025",
      anioNum: 2025,
      reparto: "Sofía Carson",
      detalles: "Título original: The Life List",
      rating: null,
      sinopsis: "Tras la muerte de su madre, una joven emprende un recorrido de autodescubrimiento siguiendo la lista de sueños que escribió en su adolescencia.",
      resena: {
        autor: "Facundo Britez",
        cuerpo: [
          "De las cuatro propuestas, esta es la que presenta la premisa narrativa más interesante, al vincular el duelo por la madre fallecida con un recorrido de autodescubrimiento a partir de la lista de sueños que la protagonista escribió en su adolescencia. La estructura, en episodios donde cada meta cumplida funciona como un reencuentro con la versión más joven de sí misma, abre la posibilidad de analizar la tensión entre la niñez soñada y la adultez real. La actuación de Sofía Carson consigue transmitir la vulnerabilidad del personaje, especialmente en las escenas relacionadas con la pérdida.",
          "No obstante, la historia cae en una contradicción central: la “libertad” y el autoconocimiento de la mujer adulta dependen de las instrucciones que le dejó su madre. Desde una lectura de género, se puede interpretar que el relato reproduce una idea limitada del crecimiento personal: la protagonista no construye su identidad por sí misma, sino que la recupera siguiendo un plan ajeno. A su vez, la subtrama romántica se siente forzada, agregada por cumplir con las reglas del género y no por una necesidad propia de la historia. Aun así, es la más cercana a un drama maduro, y explica su recepción positiva por parte de espectadores que se identifican con la nostalgia por los sueños de juventud."
        ]
      }
    },
    {
      id: "mensajes-de-voz-para-isabelle",
      titulo: "Mensajes de voz para Isabelle",
      categoria: "Películas románticas",
      tipo: "Película",
      anio: "2026",
      anioNum: 2026,
      reparto: "Zoey Deutch",
      detalles: "Título original: Voicemails for Isabelle",
      rating: null,
      sinopsis: "Un hombre escucha los mensajes de voz de una mujer sin que ella lo sepa y, a partir de esos audios, construye una imagen idealizada de ella; después la busca para conocerla.",
      resena: {
        autor: "Facundo Britez",
        cuerpo: [
          "Es la más original y compleja de las cuatro, ya que usa la tecnología de los mensajes de voz como eje central de la relación sentimental. Durante gran parte de la película, los protagonistas no se ven cara a cara: el vínculo se construye de forma asimétrica, porque él escucha los audios de ella sin que ella lo sepa. Este recurso permite reflexionar sobre las formas de amar en la actualidad, donde es muy frecuente construir una imagen idealizada de la otra persona a partir de fragmentos: audios, mensajes y publicaciones digitales.",
          "Aquí aparece el punto más polémico de la obra: la figura masculina accede a información muy íntima de la protagonista sin su consentimiento, la investiga y viaja para buscarla. La película intenta presentar esa conducta como romántica, pero una lectura crítica la vincula con una representación problemática de la conquista amorosa. Si bien Zoey Deutch brilla en sus monólogos por teléfono y la dirección logra mantener la tensión emocional, la resolución del conflicto es demasiado rápida: el enfado de la protagonista dura muy poco tiempo antes del final feliz. Por eso es la más rica para debatir: funciona como un espejo de los relatos románticos modernos y sus mensajes muchas veces contradictorios sobre el amor."
        ]
      }
    },
    {
      id: "black-panther-wakanda-forever",
      titulo: "Black Panther: Wakanda Forever",
      categoria: "Películas de Marvel",
      tipo: "Película",
      anio: "2022",
      anioNum: 2022,
      reparto: "Letitia Wright, Angela Bassett",
      foto: "img/black-panther-wakanda-forever.jpg",
      rating: null,
      sinopsis: "Wakanda atraviesa el duelo por la muerte de su rey T'Challa. Shuri debe encontrar su propio camino mientras el reino enfrenta nuevas amenazas internacionales y la aparición de Namor, líder de Talokan.",
      resena: {
        titulo: "El poder de un legado que nunca desaparece",
        cuerpo: [
          "Marvel volvió a Wakanda con una historia que va mucho más allá de los superhéroes, las batallas y los efectos especiales. Black Panther: Wakanda Forever es una de las películas más emotivas del universo cinematográfico de Marvel, no solamente por lo que cuenta, sino también por lo que representa. Después de la muerte de Chadwick Boseman, quien interpretó a T'Challa, la producción tuvo el enorme desafío de continuar una historia que había conquistado a millones de espectadores en todo el mundo.",
          "La película comienza mostrando a Wakanda atravesando un momento de profundo dolor por la pérdida de su rey. En medio de ese escenario, Shuri, interpretada por Letitia Wright, debe encontrar su propio camino y aprender a ocupar un lugar que nunca imaginó. Mientras tanto, el reino enfrenta nuevas amenazas internacionales que ponen en peligro su independencia y sus recursos. La aparición de Namor, líder de Talokan, introduce un nuevo conflicto y presenta a un personaje que no responde simplemente al estereotipo del villano, sino que tiene sus propias razones para defender a su pueblo.",
          "Uno de los grandes aciertos de esta producción es la manera en que combina el espectáculo de Marvel con temas mucho más profundos, como el duelo, la identidad, la familia, el poder y la responsabilidad. Wakanda no es solamente un escenario ficticio: representa una cultura, una historia y una identidad que se construyeron a lo largo de generaciones. Su estética, su música, sus tradiciones y su tecnología hacen que el espectador sienta que está entrando en un mundo con personalidad propia.",
          "También merece destacarse la presencia de Angela Bassett como la reina Ramonda, quien ofrece una interpretación cargada de fuerza y sensibilidad. Su personaje representa el dolor de una madre, pero también la responsabilidad de proteger a todo un pueblo.",
          "Desde mi punto de vista, Wakanda Forever es una película que demuestra que Marvel puede emocionar tanto como entretener. No intenta reemplazar a T'Challa, sino reconocer su importancia y construir una nueva etapa a partir de su legado. Quizás no tenga el mismo impacto narrativo que su primera entrega, pero consigue algo muy importante: recordar que los verdaderos héroes no solamente se definen por sus poderes, sino también por lo que dejan en los demás.",
          "En definitiva, es una película que merece ser vista no solo por los fanáticos de Black Panther, sino por cualquier espectador que disfrute de historias sobre la identidad, la pérdida y la capacidad de seguir adelante."
        ]
      }
    },
    {
      id: "thor",
      titulo: "Thor",
      categoria: "Películas de Marvel",
      tipo: "Película",
      anio: "2011",
      anioNum: 2011,
      reparto: "Chris Hemsworth, Tom Hiddleston",
      foto: "img/marvel-thor-1.jpg",
      rating: null,
      sinopsis: "Thor, príncipe de Asgard y heredero al trono, es desterrado a la Tierra por su padre Odín y pierde sus poderes. Allí conoce a la científica Jane Foster, mientras su hermano Loki trama quedarse con el trono.",
      resena: {
        titulo: "Cuando ser un héroe significa aprender a ser humano",
        cuerpo: [
          "Antes de convertirse en uno de los Vengadores más reconocidos, Thor tuvo que aprender una lección que ningún entrenamiento ni poder podía enseñarle: la verdadera fuerza no está en un martillo, sino en las decisiones que tomamos. Estrenada en 2011, Thor fue una de las películas fundamentales para ampliar el universo cinematográfico de Marvel, incorporando la mitología nórdica, los mundos fantásticos y una historia familiar atravesada por la ambición, los celos y la búsqueda de identidad.",
          "La película presenta a Thor, interpretado por Chris Hemsworth, como el príncipe de Asgard, un guerrero poderoso y heredero al trono. Sin embargo, su personalidad arrogante y su impulsividad lo llevan a cometer un error que provoca que su padre, Odín, lo destierre a la Tierra y le quite sus poderes. Allí conoce a Jane Foster, una científica que termina convirtiéndose en una figura importante en su transformación personal.",
          "Mientras Thor intenta adaptarse a una vida completamente diferente, su hermano Loki comienza a desarrollar sus propios planes para quedarse con el trono de Asgard. Esta relación es uno de los puntos más interesantes de la película. Loki, interpretado por Tom Hiddleston, no es simplemente un antagonista: es un personaje atravesado por los celos, la necesidad de reconocimiento y los conflictos con su propia identidad. Su vínculo con Thor aporta una dimensión emocional que va mucho más allá de las escenas de acción.",
          "Uno de los aspectos más atractivos de esta producción es la combinación de dos escenarios completamente diferentes: la majestuosidad de Asgard y la cotidianidad de la Tierra. Marvel logra construir un universo visualmente impactante sin perder de vista el desarrollo de sus protagonistas. Además, el humor aparece en momentos oportunos y ayuda a que el espectador conecte con Thor desde una perspectiva más humana.",
          "En mi opinión, lo mejor de esta película es su mensaje. Thor comienza siendo un personaje convencido de que merece el poder por su nacimiento y sus habilidades, pero termina comprendiendo que ser digno implica responsabilidad, humildad y sacrificio. Esa evolución es lo que realmente convierte su historia en algo interesante.",
          "Aunque con el paso del tiempo Marvel exploró versiones mucho más humorísticas y descontracturadas del personaje, esta primera película tiene una importancia especial porque establece sus orígenes y presenta una de las relaciones fraternales más complejas de la franquicia.",
          "Thor es una aventura de fantasía y acción que demuestra que incluso los personajes más poderosos necesitan aprender, equivocarse y cambiar para convertirse en verdaderos héroes."
        ]
      }
    },
    {
      id: "iron-man",
      titulo: "Iron Man",
      categoria: "Películas de Marvel",
      tipo: "Película",
      anio: "2008",
      anioNum: 2008,
      reparto: "Robert Downey Jr.",
      foto: "img/iron-man.jpg",
      rating: null,
      sinopsis: "Tony Stark, magnate y genio creador de armamento, es secuestrado durante una exhibición tecnológica en Afganistán. En cautiverio construye un traje blindado para escapar y decide cambiar el rumbo de su vida y de su empresa.",
      resena: {
        titulo: "El origen del héroe que transformó el cine moderno",
        cuerpo: [
          "Hacia el año 2008, la industria cinematográfica presenció la llegada de una figura que alteraría para siempre el panorama del entretenimiento contemporáneo. La entrega inaugural de Iron Man, estelarizada magistralmente por Robert Downey Jr., no únicamente trajo a la pantalla a Tony Stark, sino que también cimentó las bases del afamado Universo Cinematográfico de Marvel, transformándose en una piedra angular de la cultura popular.",
          "La narrativa nos introduce a Tony Stark, un magnate industrial, genio de la ingeniería y creador de armamento que parece disfrutar de un estilo de vida inigualable, caracterizado por la opulencia y el prestigio. No obstante, tras sufrir una emboscada durante una exhibición tecnológica en territorio afgano, resulta secuestrado por una facción insurgente. Durante su confinamiento, toma conciencia del verdadero impacto de sus creaciones y deduce que su intelecto debe orientarse hacia un propósito superior al lucro financiero.",
          "Valiéndose de los recursos disponibles en su cautiverio, concibe un traje blindado que le posibilita huir y retornar a su hogar. Sin embargo, dicha peripecia marca un punto de inflexión definitivo en su trayectoria. El magnate opta por reestructurar el rumbo de su corporación y diseñar una innovación destinada a la protección ciudadana en lugar del peligro, dando inicio formal al surgimiento de Iron Man.",
          "Uno de los mayores aciertos de esta producción radica en la brillante interpretación de Robert Downey Jr., cuyo carisma, sarcasmo y soltura convierten al personaje en una figura icónica. No se trata de un arquetipo heroico impecable; al contrario, es soberbio, impulsivo y posee defectos evidentes. Precisamente esa imperfección resulta cautivadora, pues el público presencia tanto la construcción de la armadura como su profunda metamorfosis interior.",
          "Asimismo, la cinta destaca por su destreza al entrelazar momentos de acción deslumbrante, ciencia avanzada, dinamismo humorístico y un arco de superación personal muy bien estructurado. Las secuencias dedicadas a la elaboración de los primeros prototipos revelan la esencia inventiva del protagonista, permitiendo entender la devoción que siente por cada avance técnico.",
          "Desde mi punto de vista, Iron Man se mantiene como un pilar fundamental en la franquicia debido a que logró algo nada sencillo: tomar a un personaje secundario para la audiencia general y consagrarlo como una figura central. Además, su célebre desenlace, donde Stark revela públicamente su identidad secreta, preparó el camino hacia un proyecto narrativo sin precedentes.",
          "Años después de su debut, el largometraje conserva intacta su relevancia. No solo por haber sido la chispa de un imperio multimillonario, sino por instaurar una fórmula narrativa donde las figuras principales pueden evolucionar, aprender de sus fallos y madurar a través de múltiples entregas.",
          "En definitiva, Iron Man trasciende la simple etiqueta de aventura y acción: fue la primera pieza de un fenómeno cinematográfico que conquistó las salas del mundo entero."
        ]
      }
    },
    {
      id: "split",
      titulo: "Split",
      categoria: "Thrillers / Policiales",
      tipo: "Película",
      anio: "2016",
      anioNum: 2016,
      reparto: "James McAvoy · dir. M. Night Shyamalan",
      foto: "img/split.jpg",
      rating: null,
      sinopsis: "Kevin Crumb, un hombre con 23 personalidades diferentes, secuestra a tres adolescentes, que intentan encontrar una manera de escapar mientras descubren las distintas identidades que conviven dentro de él.",
      resena: {
        autor: "Ramiro García",
        cuerpo: [
          "Es un thriller psicológico que logra mantener al espectador en tensión desde el comienzo hasta el final. La película cuenta la historia de Kevin Crumb, un hombre que tiene 23 personalidades diferentes y que secuestra a tres chicas adolescentes. A medida que avanza la historia, las chicas intentan encontrar una manera de escapar mientras descubren las distintas identidades que conviven dentro de Kevin.",
          "Uno de los aspectos más destacados de la película es la actuación de James McAvoy, quien consigue interpretar personalidades completamente diferentes, cambiando su voz, sus gestos y su comportamiento de una manera impresionante. La película juega con la expectativa del espectador y va revelando información de a poco, logrando que cada escena tenga algo que aportar. Se la recomienda para quienes disfrutan de los thrillers psicológicos, las historias misteriosas y los finales inesperados."
        ]
      }
    },
    {
      id: "no-nos-rendimos", titulo: "No nos rendimos", categoria: "Acción y drama", tipo: "Película", anio: null, anioNum: null,
      reparto: "", detalles: "Título original: Never Surrender · Netflix", rating: null,
      sinopsis: "Un excombatiente de las fuerzas especiales que intenta dejar atrás su pasado violento se ve obligado a regresar al circuito clandestino de peleas ilegales para saldar una deuda que amenaza la vida de su hermano menor."
    },
    {
      id: "the-mongoose", titulo: "The Mongoose", categoria: "Acción y drama", tipo: "Película", anio: null, anioNum: null,
      reparto: "Liam Neeson", detalles: "Prime Video", rating: null,
      sinopsis: "Un condecorado veterano de guerra es incriminado en un crimen de Estado y debe emprender una huida contrarreloj mientras las agencias de inteligencia despliegan una cacería nacional para capturarlo."
    },
    {
      id: "backrooms", titulo: "Backrooms", categoria: "Terror y Suspenso", tipo: "Película", anio: null, anioNum: null,
      reparto: "", detalles: "Disney+", rating: null,
      sinopsis: "Basada en el fenómeno viral de internet: un grupo de investigadores queda atrapado en una dimensión paralela infinita de pasillos amarillos, oficinas vacías y luces fluorescentes, donde descubren que no están solos."
    },
    {
      id: "matilda", titulo: "Matilda", categoria: "Fantasía y animación", tipo: "Película", anio: "1996", anioNum: 1996,
      reparto: "Mara Wilson · dir. Danny DeVito", detalles: "HBO Max", rating: null,
      sinopsis: "Una niña extraordinariamente inteligente y amante de los libros, que crece en una familia que desprecia su talento, enfrenta a la temible directora Tronchatoro y descubre que tiene poderes telequinéticos."
    },
    {
      id: "the-one", titulo: "The One", categoria: "Películas románticas", tipo: "Película", anio: null, anioNum: null,
      reparto: "", detalles: "Netflix", rating: null,
      sinopsis: "En un futuro cercano, una prueba de ADN identifica a la pareja genéticamente perfecta de cada persona, y las vidas sentimentales de distintos personajes cambian de rumbo tras someterse al test."
    },
    {
      id: "drive-the-pretenders", titulo: "Drive - The Pretenders", categoria: "Acción y drama", tipo: "Película", anio: null, anioNum: null,
      reparto: "", detalles: "Prime Video", rating: null,
      sinopsis: "Un conductor solitario especializado en fugas nocturnas acepta un último encargo que termina en una emboscada, y debe atravesar la ciudad durante una madrugada interminable esquivando a la policía y a sicarios."
    },
    {
      id: "spider-man-no-way-home", titulo: "Spider-Man: Sin camino a casa", categoria: "Películas de Marvel", tipo: "Película", anio: "2021", anioNum: 2021,
      reparto: "Tom Holland, Zendaya · dir. Jon Watts", detalles: "Título original: Spider-Man: No Way Home · Disney+", foto: "img/marvel-spiderman-3.jpg", rating: null,
      sinopsis: "Con su identidad secreta expuesta, Peter Parker le pide al Doctor Strange un hechizo para que el mundo la olvide. El hechizo falla, fractura el multiverso y trae de regreso a villanos y aliados de otras realidades."
    },
    {
      id: "un-bon-avocat", titulo: "Un buen abogado", categoria: "Acción y drama", tipo: "Película", anio: null, anioNum: null,
      reparto: "", detalles: "Título original: Un bon avocat · Netflix", rating: null,
      sinopsis: "Un prestigioso abogado penalista de París ve su carrera, su matrimonio y sus convicciones puestas a prueba al aceptar la defensa de un caso mediático lleno de contradicciones y presiones políticas."
    },
    {
      id: "the-pout-pout-fish", titulo: "The Pout-Pout Fish", categoria: "Fantasía y animación", tipo: "Película", anio: null, anioNum: null,
      reparto: "", detalles: "HBO Max", rating: null,
      sinopsis: "Adaptación del libro infantil sobre el señor Pez, una criatura marina melancólica que emprende una aventura submarina con sus amigos cuando una crisis amenaza su arrecife."
    },
    {
      id: "rust", titulo: "Rust", categoria: "Acción y drama", tipo: "Película", anio: null, anioNum: null,
      reparto: "Alec Baldwin", detalles: "Prime Video", rating: null,
      sinopsis: "En Kansas, a finales del siglo XIX, un veterano forajido rescata a su nieto de trece años, condenado a la horca, y ambos huyen hacia la frontera mexicana perseguidos por un alguacil federal y un cazarrecompensas."
    },
    {
      id: "a-todos-los-chicos", titulo: "A todos los chicos de los que me enamoré", categoria: "Películas románticas", tipo: "Película", anio: "2018", anioNum: 2018,
      reparto: "Lana Condor, Noah Centineo", detalles: "Netflix", rating: null,
      sinopsis: "Lara Jean escribe cartas secretas a los chicos de los que estuvo enamorada, pero su vida cambia cuando esas cartas llegan inesperadamente a sus destinatarios."
    },
    {
      id: "corazones-malheridos", titulo: "Corazones malheridos", categoria: "Películas románticas", tipo: "Película", anio: "2022", anioNum: 2022,
      reparto: "Sofia Carson, Nicholas Galitzine", detalles: "Netflix", rating: null,
      sinopsis: "Cassie, una cantante, y Luke, un militar, aceptan un matrimonio por conveniencia para resolver problemas económicos y, con el tiempo, empiezan a desarrollar sentimientos verdaderos."
    },
    {
      id: "la-ultima-cancion", titulo: "La última canción", categoria: "Películas románticas", tipo: "Película", anio: "2010", anioNum: 2010,
      reparto: "Miley Cyrus, Liam Hemsworth", detalles: "Netflix", rating: null,
      sinopsis: "Ronnie pasa el verano con su padre, con quien tiene una relación distante. Allí conoce a Will y se enamora, mientras empieza a reconstruir el vínculo familiar."
    },
    {
      id: "fabricante-de-lagrimas", titulo: "Fabricante de lágrimas", categoria: "Películas románticas", tipo: "Película", anio: "2024", anioNum: 2024,
      reparto: "", detalles: "Netflix", rating: null,
      sinopsis: "Nica y Rigel crecieron en un orfanato y, tras ser adoptados por la misma familia, deben adaptarse a una nueva vida juntos entre conflictos, secretos y emociones intensas."
    },
    {
      id: "a-traves-de-mi-ventana", titulo: "A través de mi ventana", categoria: "Películas románticas", tipo: "Película", anio: "2022", anioNum: 2022,
      reparto: "Clara Galle, Julio Peña", detalles: "Netflix", rating: null,
      sinopsis: "Raquel está enamorada de su vecino Ares desde hace mucho tiempo. Cuando por fin se acercan, las diferencias personales y familiares ponen a prueba la relación."
    },
    {
      id: "el-extrano-mundo-de-jack", titulo: "El extraño mundo de Jack", categoria: "Fantasía y animación", tipo: "Película", anio: "1993", anioNum: 1993,
      reparto: "dir. Henry Selick · producida por Tim Burton", foto: "img/burton-extrano-mundo-de-jack.jpg", rating: null,
      sinopsis: "Jack Skellington, el rey de la Ciudad de Halloween, cansado de la misma rutina, descubre la Ciudad de la Navidad y decide adueñarse de esa fiesta. Un clásico de la animación stop-motion."
    },
    {
      id: "el-cadaver-de-la-novia", titulo: "El cadáver de la novia", categoria: "Fantasía y animación", tipo: "Película", anio: "2005", anioNum: 2005,
      reparto: "Johnny Depp, Helena Bonham Carter · dir. Tim Burton", foto: "img/burton-cadaver-de-la-novia.jpg", rating: null,
      sinopsis: "La víspera de su boda, un joven tímido ensaya sus votos en un bosque y, sin querer, termina casado con una novia muerta que lo lleva al mundo de los muertos."
    },
    {
      id: "charlie-y-la-fabrica-de-chocolate", titulo: "Charlie y la fábrica de chocolate", categoria: "Fantasía y animación", tipo: "Película", anio: "2005", anioNum: 2005,
      reparto: "Johnny Depp · dir. Tim Burton", foto: "img/burton-charlie-fabrica-de-chocolate.jpg", rating: null,
      sinopsis: "Charlie, un chico humilde, gana uno de los cinco boletos dorados para recorrer la misteriosa fábrica de chocolate del excéntrico Willy Wonka."
    },
    {
      id: "guardianes-de-la-galaxia", titulo: "Guardianes de la Galaxia", categoria: "Películas de Marvel", tipo: "Película", anio: "2014", anioNum: 2014,
      reparto: "Chris Pratt, Zoe Saldaña, Dave Bautista · dir. James Gunn", foto: "img/marvel-guardianes-1.jpg", rating: null,
      sinopsis: "Peter Quill, un aventurero espacial, forma un equipo improbable con un grupo de inadaptados para proteger un poderoso orbe que amenaza a toda la galaxia."
    },
    {
      id: "guardianes-de-la-galaxia-vol-2", titulo: "Guardianes de la Galaxia Vol. 2", categoria: "Películas de Marvel", tipo: "Película", anio: "2017", anioNum: 2017,
      reparto: "Chris Pratt, Zoe Saldaña, Dave Bautista · dir. James Gunn", foto: "img/marvel-guardianes-2.jpg", rating: null,
      sinopsis: "Los Guardianes siguen recorriendo el espacio mientras Peter Quill descubre la verdad sobre su padre."
    },
    {
      id: "guardianes-de-la-galaxia-vol-3", titulo: "Guardianes de la Galaxia Vol. 3", categoria: "Películas de Marvel", tipo: "Película", anio: "2023", anioNum: 2023,
      reparto: "Chris Pratt, Zoe Saldaña, Dave Bautista · dir. James Gunn", foto: "img/marvel-guardianes-3.jpg", rating: null,
      sinopsis: "Los Guardianes emprenden una misión para salvar a Rocket, mientras se revela el doloroso origen de su compañero."
    },
    {
      id: "spider-man-de-regreso-a-casa", titulo: "Spider-Man: De regreso a casa", categoria: "Películas de Marvel", tipo: "Película", anio: "2017", anioNum: 2017,
      reparto: "Tom Holland, Zendaya · dir. Jon Watts", foto: "img/marvel-spiderman-1.jpg", rating: null,
      sinopsis: "Peter Parker intenta equilibrar su vida de estudiante secundario con su rol de Spider-Man mientras busca demostrarle a Tony Stark que está listo para ser un Vengador."
    },
    {
      id: "spider-man-lejos-de-casa", titulo: "Spider-Man: Lejos de casa", categoria: "Películas de Marvel", tipo: "Película", anio: "2019", anioNum: 2019,
      reparto: "Tom Holland, Zendaya · dir. Jon Watts", foto: "img/marvel-spiderman-2.jpg", rating: null,
      sinopsis: "Durante un viaje escolar por Europa, Peter Parker se ve obligado a volver a la acción para enfrentar nuevas amenazas."
    },
    {
      id: "deadpool", titulo: "Deadpool", categoria: "Películas de Marvel", tipo: "Película", anio: "2016", anioNum: 2016,
      reparto: "Ryan Reynolds", foto: "img/marvel-deadpool-1.jpg", rating: null,
      sinopsis: "Wade Wilson, un exmercenario, queda desfigurado pero con un poder de curación acelerada tras un experimento, y sale a buscar venganza con mucho humor."
    },
    {
      id: "deadpool-2", titulo: "Deadpool 2", categoria: "Películas de Marvel", tipo: "Película", anio: "2018", anioNum: 2018,
      reparto: "Ryan Reynolds, Josh Brolin", foto: "img/marvel-deadpool-2.jpg", rating: null,
      sinopsis: "Deadpool arma su propio equipo para proteger a un joven mutante de Cable, un soldado que viene del futuro."
    },
    {
      id: "deadpool-y-wolverine", titulo: "Deadpool & Wolverine", categoria: "Películas de Marvel", tipo: "Película", anio: "2024", anioNum: 2024,
      reparto: "Ryan Reynolds, Hugh Jackman", foto: "img/marvel-deadpool-3.jpg", rating: null,
      sinopsis: "Deadpool se une a una versión de Wolverine para salvar su universo, en una aventura que lo conecta con el universo cinematográfico de Marvel."
    },
    {
      id: "thor-un-mundo-oscuro", titulo: "Thor: Un mundo oscuro", categoria: "Películas de Marvel", tipo: "Película", anio: "2013", anioNum: 2013,
      reparto: "Chris Hemsworth, Natalie Portman, Tom Hiddleston", foto: "img/marvel-thor-2.jpg", rating: null,
      sinopsis: "Thor debe enfrentar a los elfos oscuros, que buscan sumir el universo en la oscuridad, y para lograrlo necesita la ayuda de su hermano Loki."
    },
    {
      id: "thor-ragnarok", titulo: "Thor: Ragnarok", categoria: "Películas de Marvel", tipo: "Película", anio: "2017", anioNum: 2017,
      reparto: "Chris Hemsworth, Tom Hiddleston, Cate Blanchett · dir. Taika Waititi", foto: "img/marvel-thor-3.jpg", rating: null,
      sinopsis: "Prisionero en un planeta lejano, Thor debe sobrevivir a una pelea de gladiadores y volver a Asgard para detener a Hela antes del Ragnarok."
    },
    {
      id: "capitan-america-el-primer-vengador", titulo: "Capitán América: El primer vengador", categoria: "Películas de Marvel", tipo: "Película", anio: "2011", anioNum: 2011,
      reparto: "Chris Evans, Hayley Atwell", foto: "img/marvel-capitan-america-1.jpg", rating: null,
      sinopsis: "Durante la Segunda Guerra Mundial, Steve Rogers, un joven frágil pero valiente, se convierte en el Capitán América gracias a un suero experimental."
    },
    {
      id: "capitan-america-el-soldado-del-invierno", titulo: "Capitán América: El soldado del invierno", categoria: "Películas de Marvel", tipo: "Película", anio: "2014", anioNum: 2014,
      reparto: "Chris Evans, Scarlett Johansson, Sebastian Stan", foto: "img/marvel-capitan-america-2.jpg", rating: null,
      sinopsis: "Steve Rogers descubre una conspiración dentro de S.H.I.E.L.D. y se enfrenta a un misterioso asesino conocido como el Soldado del Invierno."
    },
    {
      id: "capitan-america-civil-war", titulo: "Capitán América: Civil War", categoria: "Películas de Marvel", tipo: "Película", anio: "2016", anioNum: 2016,
      reparto: "Chris Evans, Robert Downey Jr.", foto: "img/marvel-capitan-america-3.jpg", rating: null,
      sinopsis: "Un acuerdo para controlar a los superhéroes divide a los Vengadores en dos bandos, liderados por el Capitán América y por Iron Man."
    }
  ]
};

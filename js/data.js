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
    }
  ]
};

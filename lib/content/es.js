const CTA = {
    title: '¿Organizas tú el sorteo este año?',
    desc: 'Carga la lista, marca las exclusiones y deja que cada participante reciba su enlace secreto. Gratis y sin registro para empezar.',
    label: 'Crear mi sorteo gratis',
};

export const pagesEs = [
    {
        key: 'pricing',
        type: 'pricing',
        slug: 'precios',
        priority: 0.9,
        changeFrequency: 'monthly',
        title: 'Precios - Amigo Invisible online',
        h1: 'Precios',
        description:
            'Organiza tu Amigo Invisible gratis hasta 15 participantes. Planes Premium y Empresas con participantes ilimitados, sin publicidad y con recordatorios.',
        keywords: ['amigo invisible precio', 'sorteo amigo invisible premium', 'amigo invisible empresas'],
        intro:
            'La herramienta es gratuita para la mayoría de los sorteos. Los planes de pago existen para grupos grandes y para quienes organizan el intercambio de una empresa.',
        showPricing: true,
        faqs: [
            {
                q: '¿El pago es una suscripción?',
                a: 'No. Es un pago único por temporada: pagas una vez y usas todas las funciones durante ese período, sin renovaciones automáticas ni cargos sorpresa.',
            },
            {
                q: '¿Qué medios de pago aceptan?',
                a: 'Puedes elegir entre MercadoPago y PayPal. MercadoPago acepta tarjetas de crédito y débito, transferencias y saldo en cuenta según el país. PayPal está disponible en más de 200 países y permite pagar con tarjeta internacional, tengas o no cuenta de PayPal.',
            },
            {
                q: '¿Puedo pagar si estoy fuera de Uruguay?',
                a: 'Sí. Si estás fuera de LatAm te conviene PayPal: el cobro se hace en dólares (USD) y funciona con tarjetas de casi cualquier país. Con MercadoPago el precio se cobra en pesos uruguayos porque nuestra cuenta es uruguaya, y tu banco hace la conversión automáticamente.',
            },
            {
                q: '¿Qué pasa si ya sorteé y después quiero Premium?',
                a: 'Puedes pasarte a Premium en cualquier momento. Las funciones nuevas se aplican al sorteo actual y a los que hagas después; los enlaces ya enviados siguen funcionando igual.',
            },
            {
                q: '¿Hay reembolsos?',
                a: 'Si el servicio no funcionó como esperabas, escríbenos dentro de los primeros 14 días y te devolvemos el importe. Preferimos eso a que alguien pague por algo que no le sirvió.',
            },
        ],
        cta: CTA,
    },
    {
        key: 'faq',
        type: 'faq',
        slug: 'preguntas-frecuentes',
        priority: 0.8,
        changeFrequency: 'monthly',
        title: 'Preguntas frecuentes sobre el Amigo Invisible',
        h1: 'Preguntas frecuentes',
        description:
            'Cómo funciona el sorteo de Amigo Invisible online: exclusiones, notificaciones, privacidad, límites del plan gratuito y qué pasa si alguien pierde su enlace.',
        keywords: ['como funciona amigo invisible', 'dudas amigo invisible', 'sorteo amigo invisible online'],
        intro: 'Estas son las dudas que más nos llegan por email. Si la tuya no está, escríbenos y la agregamos.',
        faqs: [
            {
                q: '¿Cómo funciona el sorteo?',
                a: 'Cargas los nombres de los participantes con su email o teléfono, marcas las exclusiones si hace falta y pulsas "Realizar sorteo". El sistema genera una asignación válida al azar y le envía a cada persona un enlace secreto donde ve —sólo ella— a quién le toca regalar.',
            },
            {
                q: '¿El organizador puede participar sin hacer trampa?',
                a: 'Sí. Los resultados nunca se muestran completos en pantalla. Como organizador ves si las notificaciones se enviaron correctamente, pero no las asignaciones del resto. Tú recibes tu propio enlace secreto igual que todos.',
            },
            {
                q: '¿Cuántas personas pueden participar?',
                a: 'El plan gratuito permite hasta 15 participantes por sorteo. Con Premium no hay límite: hemos visto sorteos de más de 100 personas en empresas.',
            },
            {
                q: '¿Qué son las reglas de exclusión?',
                a: 'Son restricciones del tipo "esta persona no puede regalarle a esta otra". Se usan sobre todo para que las parejas no se toquen entre sí, para separar a hermanos o para no repetir la asignación del año anterior. Puedes poner tantas como quieras, siempre que quede al menos una combinación posible.',
            },
            {
                q: '¿Qué pasa si las exclusiones hacen el sorteo imposible?',
                a: 'El algoritmo reintenta cientos de veces buscando una combinación válida. Si no existe ninguna (por ejemplo, tres personas que no pueden regalarse entre sí), te avisa con un error para que relajes alguna regla.',
            },
            {
                q: '¿Cómo se enteran los participantes?',
                a: 'Automáticamente por email, y por WhatsApp si cargaste el teléfono con el código de país. Además, en la tabla de resultados tienes un botón para compartir el enlace de cada persona manualmente por el canal que prefieras.',
            },
            {
                q: '¿Y si a alguien no le llegó el mensaje?',
                a: 'En la lista verás una cruz roja junto a esa persona y un botón para reintentar el envío. Si sigue fallando (email mal escrito, teléfono sin código de país), puedes copiar su enlace secreto y mandárselo tú.',
            },
            {
                q: '¿Puedo repetir el sorteo si me equivoqué?',
                a: 'Sí. Pulsa "Nuevo sorteo" y se genera una asignación nueva conservando la lista de participantes. Ten en cuenta que los enlaces anteriores quedan obsoletos, así que conviene avisar al grupo antes de repetirlo.',
            },
            {
                q: '¿Los enlaces caducan?',
                a: 'Los enlaces siguen activos mientras el sorteo exista. Son direcciones largas y aleatorias, imposibles de adivinar, pero cualquiera que reciba el enlace de otra persona vería su asignación: por eso pedimos no reenviarlos.',
            },
            {
                q: '¿Guardan los datos de mis amigos?',
                a: 'Guardamos nombres, emails y teléfonos para poder enviar las notificaciones y para que el enlace secreto siga funcionando. No los vendemos, no hacemos marketing con ellos y los eliminamos si nos lo pides.',
            },
            {
                q: '¿Sirve para el intercambio de la oficina?',
                a: 'Sí, es uno de los usos más comunes. Para equipos grandes conviene el plan Premium o Empresas: participantes ilimitados, recordatorios antes del evento y panel con el estado de envío de cada persona.',
            },
            {
                q: '¿Funciona en el móvil?',
                a: 'Sí, no hay que instalar nada. Tanto el panel del organizador como la página de revelación funcionan en el navegador de cualquier teléfono.',
            },
        ],
        cta: CTA,
    },
    {
        key: 'generator',
        type: 'landing',
        slug: 'amigo-secreto',
        priority: 0.9,
        changeFrequency: 'monthly',
        title: 'Amigo Secreto Online - Sorteo automático y gratis',
        h1: 'Sorteo de Amigo Secreto online',
        description:
            'Haz el sorteo de Amigo Secreto online gratis. Agrega participantes, define quién no puede tocarle a quién y avisa a todos por WhatsApp o email en segundos.',
        keywords: ['amigo secreto', 'sorteo amigo secreto', 'amigo secreto online', 'amigo secreto virtual'],
        intro:
            'Amigo Secreto, Amigo Invisible, Secret Santa o intercambio de regalos: cambia el nombre según el país, pero el problema es siempre el mismo. Alguien tiene que sortear, y esa persona termina sabiendo más de lo que debería.',
        sections: [
            {
                h2: 'Sortear a mano tiene tres problemas',
                p: [
                    'El primero es logístico: hay que juntar a todo el mundo en el mismo lugar y momento, algo que con familias grandes o equipos de trabajo casi nunca pasa.',
                    'El segundo es que quien reparte los papelitos suele quedar fuera del sorteo o ver alguna asignación sin querer.',
                    'El tercero son las repeticiones: sin registro de años anteriores, es habitual que a la misma persona le toque el mismo amigo secreto dos años seguidos.',
                ],
            },
            {
                h2: 'Cómo lo resuelve el sorteo online',
                ul: [
                    'Cada participante recibe un enlace privado: nadie ve la lista completa, ni siquiera quien organiza.',
                    'Las exclusiones se configuran una vez y el algoritmo las respeta siempre.',
                    'No hace falta que estén todos juntos: se avisa por email y WhatsApp.',
                    'La lista de deseos de cada persona viaja con el enlace, así el regalo se acierta más.',
                ],
            },
            {
                h2: 'Cuántas personas necesito',
                p: [
                    'Con tres personas ya funciona, aunque la gracia empieza a partir de cinco o seis: cuantos más participantes, menos predecible es el resultado.',
                    'En grupos de menos de cuatro personas con exclusiones de pareja, el sorteo puede volverse matemáticamente imposible. Si pasa, la herramienta te avisa en lugar de darte una asignación inválida.',
                ],
            },
            {
                h2: 'Cuándo conviene hacerlo',
                p: [
                    'La recomendación práctica es sortear entre dos y tres semanas antes del intercambio. Da tiempo a comprar sin agobios y evita que la gente se olvide de a quién le tocó.',
                    'Si el grupo es de trabajo, conviene fijar el presupuesto en el mismo momento del sorteo: es la principal fuente de incomodidad cuando alguien gasta mucho más que el resto.',
                ],
            },
        ],
        faqs: [
            {
                q: '¿Amigo Secreto y Amigo Invisible son lo mismo?',
                a: 'Sí. Es el mismo juego con distinto nombre según el país: Amigo Invisible en España, Amigo Secreto en buena parte de Latinoamérica, Amigo Oculto en Brasil y Secret Santa en inglés. La herramienta funciona igual para todos.',
            },
            {
                q: '¿Puedo hacer el sorteo si estamos en ciudades distintas?',
                a: 'Sí, es justamente para eso. Nadie tiene que estar presente: cada persona recibe su enlace por email o WhatsApp y lo abre cuando quiere.',
            },
            {
                q: '¿Es gratis?',
                a: 'Sí, hasta 15 participantes, con notificaciones incluidas y sin límite de sorteos.',
            },
        ],
        cta: CTA,
    },
    {
        key: 'work',
        type: 'landing',
        slug: 'amigo-invisible-oficina',
        priority: 0.8,
        changeFrequency: 'monthly',
        title: 'Amigo Invisible para la oficina - Organiza el intercambio del trabajo',
        h1: 'Amigo Invisible para la oficina',
        description:
            'Organiza el amigo invisible de tu empresa sin planillas ni cadenas de correos. Participantes ilimitados, exclusiones por equipo, recordatorios y control de envíos.',
        keywords: [
            'amigo invisible oficina',
            'amigo invisible empresa',
            'intercambio de regalos trabajo',
            'amigo invisible rrhh',
        ],
        intro:
            'El intercambio de fin de año en el trabajo suele recaer en la misma persona de Recursos Humanos, que termina gestionando una planilla, una cadena de correos y quince mensajes preguntando "¿a quién me tocó?".',
        sections: [
            {
                h2: 'Lo que suele salir mal en un sorteo de oficina',
                ul: [
                    'La planilla circula por email y alguien ve las asignaciones de los demás.',
                    'Se suman personas después del sorteo y hay que rehacerlo todo.',
                    'Nadie recuerda el presupuesto acordado y los regalos quedan desparejos.',
                    'Quien organiza no puede participar sin saber a quién le tocó.',
                    'La gente se olvida y hay que perseguirla la semana del evento.',
                ],
            },
            {
                h2: 'Cómo organizarlo en 10 minutos',
                ol: [
                    'Junta los nombres y los emails corporativos del equipo.',
                    'Cárgalos en el panel: puedes pegar la lista de a poco, se guarda sola.',
                    'Marca las exclusiones que tengan sentido (por ejemplo, que no se toquen dos personas del mismo equipo pequeño).',
                    'Define la fecha del intercambio y el presupuesto sugerido.',
                    'Ejecuta el sorteo: cada persona recibe su enlace privado por email.',
                    'Revisa el panel de envíos y reenvía el enlace a quien no lo haya recibido.',
                ],
            },
            {
                h2: 'Presupuesto: el punto que más conflictos evita',
                p: [
                    'Fijar un rango claro (por ejemplo, un mínimo y un máximo) evita la situación incómoda de recibir un regalo mucho más caro del que diste.',
                    'En equipos con sueldos dispares conviene un presupuesto bajo. El objetivo del intercambio es el gesto, no la competencia.',
                ],
            },
            {
                h2: 'Qué aporta el plan Empresas',
                ul: [
                    'Participantes ilimitados, para equipos de cualquier tamaño.',
                    'Logo y colores de la empresa en la página que ven los participantes.',
                    'Varios sorteos en paralelo, útil si cada sede o área hace el suyo.',
                    'Recordatorios automáticos antes de la fecha del intercambio.',
                    'Panel con el estado de envío persona por persona.',
                    'Sin publicidad en la experiencia que ve tu equipo.',
                ],
            },
        ],
        faqs: [
            {
                q: '¿Sirve para equipos remotos o híbridos?',
                a: 'Sí. Como todo pasa por email y enlaces individuales, no hace falta que nadie esté en la oficina. Para equipos distribuidos suele usarse con regalos digitales o envíos a domicilio.',
            },
            {
                q: '¿Puedo agregar gente después de sortear?',
                a: 'Tendrías que repetir el sorteo para incluirla, lo que invalida los enlaces anteriores. La recomendación es cerrar la lista de inscriptos unos días antes y recién ahí sortear.',
            },
            {
                q: '¿Los datos de los empleados están seguros?',
                a: 'Sólo usamos nombre, email y teléfono para enviar las notificaciones de ese sorteo. No se comparten con terceros ni se usan con fines publicitarios, y se eliminan a pedido.',
            },
        ],
        cta: {
            title: 'Organiza el intercambio de tu equipo',
            desc: 'Empieza gratis y pásate al plan Empresas si necesitas participantes ilimitados, recordatorios y la marca de tu empresa.',
            label: 'Crear el sorteo de la oficina',
        },
    },
    {
        key: 'gift-ideas',
        type: 'article',
        slug: 'ideas-de-regalos-baratos',
        priority: 0.7,
        changeFrequency: 'yearly',
        title: 'Ideas de regalos baratos para el Amigo Invisible',
        h1: 'Ideas de regalos baratos para el Amigo Invisible',
        description:
            'Más de 40 ideas de regalo para amigo invisible con presupuesto ajustado, ordenadas por tipo de persona: oficina, familia, adolescentes y regalos hechos a mano.',
        keywords: [
            'regalos amigo invisible baratos',
            'ideas amigo invisible',
            'que regalar amigo invisible',
            'regalos economicos navidad',
        ],
        intro:
            'El problema del amigo invisible casi nunca es el presupuesto: es no saber nada de la persona que te tocó. Estas ideas están ordenadas por situación, que es como realmente se compra.',
        sections: [
            {
                h2: 'Si apenas conoces a la persona',
                p: [
                    'La regla es simple: elige algo consumible o de uso cotidiano. Nadie tiene que fingir que le gustó, y no ocupa lugar en su casa.',
                ],
                ul: [
                    'Café de especialidad o una selección de tés',
                    'Una buena tableta de chocolate o dulces regionales',
                    'Una planta pequeña de interior, tipo suculenta o potus',
                    'Una taza sobria (evita las de frases graciosas si no hay confianza)',
                    'Velas aromáticas o un difusor pequeño',
                    'Un cuaderno de buena calidad y un bolígrafo decente',
                ],
            },
            {
                h2: 'Para el intercambio de la oficina',
                ul: [
                    'Un soporte para el móvil o para el portátil',
                    'Auriculares sencillos o un organizador de cables',
                    'Una botella térmica reutilizable',
                    'Un juego de escritorio pequeño o un rompecabezas',
                    'Un vale para una cafetería cercana a la oficina',
                    'Un calendario de escritorio bonito',
                ],
            },
            {
                h2: 'Para la familia',
                ul: [
                    'Un marco con una foto impresa del grupo',
                    'Un juego de mesa corto, de esos que se juegan en media hora',
                    'Guantes, bufanda o medias térmicas si es invierno',
                    'Un libro de cocina o un utensilio específico que le falte',
                    'Un álbum o un pendrive con fotos y videos familiares',
                ],
            },
            {
                h2: 'Para adolescentes',
                ul: [
                    'Fundas o accesorios para el móvil',
                    'Un power bank pequeño',
                    'Stickers, pósteres o merchandising de algo que siga',
                    'Una suscripción de un mes a un servicio de música o streaming',
                    'Materiales de arte o papelería si dibuja',
                ],
            },
            {
                h2: 'Regalos hechos a mano que sí funcionan',
                p: [
                    'Un regalo casero funciona cuando implica tiempo y no improvisación. Estos son los que más se agradecen:',
                ],
                ul: [
                    'Galletas o mermelada en un frasco decorado',
                    'Una playlist con una nota explicando por qué elegiste cada canción',
                    'Un vale por algo concreto: una cena cocinada, ayuda con una mudanza, cuidar sus plantas',
                    'Una foto impresa y enmarcada de un momento compartido',
                ],
            },
            {
                h2: 'Qué evitar',
                ul: [
                    'Ropa con talla, salvo que la conozcas con certeza',
                    'Perfumes: el gusto es demasiado personal',
                    'Regalos que hagan referencia a una broma privada que la persona quizá no comparta',
                    'Cualquier cosa que obligue a devolver el gesto con algo más caro',
                    'Adornos grandes: ocupan espacio y son difíciles de tirar sin culpa',
                ],
            },
            {
                h2: 'El truco que ahorra todo esto',
                p: [
                    'Si cada participante escribe dos o tres cosas que le gustarían al momento de anotarse, el problema desaparece. En nuestro sorteo esa lista de deseos viaja junto al enlace secreto: quien te tocó ve directamente qué te vendría bien.',
                ],
            },
        ],
        faqs: [
            {
                q: '¿Cuánto se suele gastar en un amigo invisible?',
                a: 'Depende del grupo, pero lo importante es que el rango se acuerde antes del sorteo y sea el mismo para todos. Un presupuesto bajo y explícito funciona mejor que uno alto y ambiguo.',
            },
            {
                q: '¿Está bien regalar una tarjeta de regalo?',
                a: 'Funciona cuando no conoces a la persona, aunque se percibe como menos personal. Si eliges esa opción, acompáñala con una nota escrita a mano: cambia por completo cómo se recibe.',
            },
        ],
        cta: CTA,
    },
    {
        key: 'rules',
        type: 'article',
        slug: 'reglas-del-amigo-invisible',
        priority: 0.7,
        changeFrequency: 'yearly',
        title: 'Reglas del Amigo Invisible: cómo organizarlo bien',
        h1: 'Las reglas del Amigo Invisible',
        description:
            'Cómo se juega al amigo invisible: número de participantes, presupuesto, fechas, reglas de exclusión y variantes como el amigo invisible con pistas o el robo de regalos.',
        keywords: ['reglas amigo invisible', 'como se juega amigo invisible', 'como organizar amigo invisible'],
        intro:
            'El amigo invisible tiene reglas mínimas, pero acordarlas antes evita casi todos los problemas típicos: regalos desparejos, gente que se olvida y sorteos que hay que repetir.',
        sections: [
            {
                h2: 'Las reglas básicas',
                ol: [
                    'Cada participante regala a una sola persona y recibe de una sola persona.',
                    'Nadie puede tocarse a sí mismo.',
                    'La asignación es secreta hasta el día del intercambio.',
                    'Todos gastan dentro del mismo rango de presupuesto.',
                    'Todos entregan el regalo en la fecha acordada, estén presentes o no.',
                ],
            },
            {
                h2: 'Cuántos participantes hacen falta',
                p: [
                    'Técnicamente el juego funciona desde tres personas, pero con menos de cinco es fácil deducir quién te tocó. El punto dulce está entre seis y treinta participantes.',
                    'Por encima de cuarenta personas conviene dividir en grupos por área o por familia: la logística de un solo sorteo gigante suele hacer que alguien se quede sin regalo.',
                ],
            },
            {
                h2: 'El presupuesto',
                p: [
                    'Acordar el presupuesto antes del sorteo, y no después, es la regla que más conflictos evita. Lo ideal es fijar un mínimo y un máximo.',
                    'Si el grupo es muy diverso económicamente, un presupuesto bajo iguala a todos. También puede acordarse un tema en lugar de un monto: "algo hecho a mano", "algo de segunda mano", "algo que se coma".',
                ],
            },
            {
                h2: 'Las exclusiones',
                p: [
                    'Una exclusión es una regla del tipo "A no puede regalarle a B". Las más habituales son:',
                ],
                ul: [
                    'Parejas que no quieren tocarse entre sí, porque ya se regalan aparte.',
                    'Hermanos o familiares muy directos, para que el sorteo mezcle de verdad.',
                    'Repeticiones del año anterior.',
                    'Personas que trabajan juntas a diario, en sorteos de oficina grandes.',
                ],
                p2: [
                    'Cuidado con excederse: cuantas más exclusiones, menos combinaciones posibles. Si pones tantas que no queda ninguna asignación válida, el sorteo se vuelve imposible y hay que relajar alguna.',
                ],
            },
            {
                h2: 'Fechas: el calendario que funciona',
                ol: [
                    'Cuatro semanas antes: se cierra la lista de participantes.',
                    'Tres semanas antes: se hace el sorteo y se acuerda el presupuesto.',
                    'Una semana antes: recordatorio al grupo.',
                    'El día: intercambio, idealmente con todos presentes.',
                ],
            },
            {
                h2: 'Variantes conocidas',
                ul: [
                    'Con pistas: cada participante escribe tres pistas sobre sí mismo y el regalo se entrega leyéndolas en voz alta antes de revelar quién es.',
                    'Con lista de deseos: cada uno anota dos o tres cosas que le gustarían. Es la variante que más aumenta la satisfacción con el regalo.',
                    'Con robo (tipo White Elephant): los regalos van sin destinatario y por turnos cada persona puede abrir uno nuevo o robar el de otro. Es un juego distinto y conviene no mezclarlo con el amigo invisible clásico.',
                    'Temático: todos los regalos deben cumplir una condición, como ser hechos a mano, de segunda mano o comestibles.',
                ],
            },
            {
                h2: 'Qué hacer si alguien se baja',
                p: [
                    'Si la persona se baja antes del sorteo, se la quita de la lista y no pasa nada. Si se baja después, lo más limpio es repetir el sorteo completo avisando al grupo, porque quitar a una sola persona rompe la cadena de asignaciones.',
                    'Por eso conviene cerrar la lista unos días antes de sortear, en lugar de sortear apenas se apunta el primero.',
                ],
            },
        ],
        faqs: [
            {
                q: '¿Se puede hacer el amigo invisible a distancia?',
                a: 'Sí. El sorteo se hace online y el intercambio puede resolverse con envíos a domicilio o regalos digitales. La única regla extra es adelantar la fecha límite para dar margen a los envíos.',
            },
            {
                q: '¿Se puede saber quién te regaló?',
                a: 'Depende del grupo. La versión clásica revela a todos al final del intercambio; algunos grupos prefieren que el emisor quede en secreto para siempre. Conviene decidirlo antes, no en el momento.',
            },
            {
                q: '¿Qué pasa si a alguien no le llega el regalo?',
                a: 'La persona que organiza suele tener un regalo de reserva. Es poco elegante señalar públicamente a quien falló: lo habitual es resolverlo en privado después del evento.',
            },
        ],
        cta: CTA,
    },
    {
        key: 'privacy',
        type: 'legal',
        slug: 'privacidad',
        priority: 0.3,
        changeFrequency: 'yearly',
        title: 'Política de Privacidad',
        h1: 'Política de Privacidad',
        description: 'Qué datos recogemos, para qué los usamos, con quién los compartimos y cómo puedes eliminarlos.',
        intro:
            'Esta política explica qué datos tratamos cuando usas el sorteo de Amigo Invisible y qué puedes hacer al respecto. Está escrita para que se entienda, no para cubrirnos.',
        sections: [
            {
                h2: 'Quién es el responsable',
                p: [
                    'El responsable del tratamiento es Brian Bentancourt, autor y operador de este sitio. Puedes contactarnos en brianbentancourt9@gmail.com para cualquier asunto relacionado con tus datos.',
                ],
            },
            {
                h2: 'Qué datos recogemos',
                ul: [
                    'Datos de tu cuenta: email, nombre y foto de perfil que nos entrega Google o Facebook cuando inicias sesión.',
                    'Datos de los participantes que tú cargas: nombre y, opcionalmente, email, teléfono y lista de deseos.',
                    'Datos del sorteo: las asignaciones generadas y el estado de envío de cada notificación.',
                    'Datos técnicos: dirección IP, tipo de navegador y páginas visitadas, a través de nuestra herramienta de analítica.',
                ],
            },
            {
                h2: 'Para qué los usamos',
                ul: [
                    'Ejecutar el sorteo y enviar las notificaciones por email, WhatsApp o SMS.',
                    'Mantener activo el enlace secreto de cada participante.',
                    'Procesar el pago si contratas un plan de pago.',
                    'Entender cómo se usa el sitio, de forma agregada, para mejorarlo.',
                ],
                p: [
                    'No vendemos datos personales, no los usamos para crear perfiles publicitarios y no enviamos comunicaciones comerciales a los participantes que tú cargaste.',
                ],
            },
            {
                h2: 'Responsabilidad sobre los datos de terceros',
                p: [
                    'Cuando cargas los datos de otras personas, eres tú quien debe asegurarse de que están de acuerdo con que uses su email o teléfono para este sorteo. Nosotros los tratamos únicamente para las finalidades descritas arriba.',
                ],
            },
            {
                h2: 'Con quién los compartimos',
                ul: [
                    'Google Firebase: autenticación y base de datos.',
                    'SendGrid: envío de emails.',
                    'Twilio: envío de WhatsApp y SMS.',
                    'MercadoPago y PayPal: procesamiento de pagos. No almacenamos datos de tarjetas.',
                    'Google Analytics y Google AdSense: analítica y publicidad, cuando están activos.',
                    'Vercel: alojamiento del sitio.',
                ],
            },
            {
                h2: 'Publicidad y cookies',
                p: [
                    'Usamos cookies propias para recordar tu idioma y mantener la sesión iniciada. Si la publicidad está activa, Google AdSense puede usar cookies para mostrar anuncios; puedes gestionar esas preferencias desde la configuración de anuncios de Google.',
                ],
            },
            {
                h2: 'Cuánto tiempo los conservamos',
                p: [
                    'Los datos de un sorteo se conservan mientras la cuenta exista, para que los enlaces sigan funcionando. Puedes pedirnos que eliminemos un sorteo o tu cuenta completa en cualquier momento.',
                ],
            },
            {
                h2: 'Tus derechos',
                p: [
                    'Puedes solicitar acceso, rectificación, eliminación o portabilidad de tus datos, y oponerte a su tratamiento, escribiendo a brianbentancourt9@gmail.com. Respondemos dentro de los 30 días.',
                ],
            },
            {
                h2: 'Menores de edad',
                p: [
                    'El servicio no está dirigido a menores de 14 años. Si un adulto organiza un sorteo que incluye menores, es responsable de contar con el consentimiento de sus tutores.',
                ],
            },
            {
                h2: 'Cambios en esta política',
                p: [
                    'Si cambiamos algo relevante, actualizaremos la fecha de esta página. El uso continuado del servicio implica la aceptación de la versión vigente.',
                ],
            },
        ],
    },
    {
        key: 'terms',
        type: 'legal',
        slug: 'terminos',
        priority: 0.3,
        changeFrequency: 'yearly',
        title: 'Términos y Condiciones',
        h1: 'Términos y Condiciones',
        description: 'Condiciones de uso del servicio de sorteo de Amigo Invisible: cuentas, planes de pago, límites y responsabilidades.',
        intro: 'Al usar este sitio aceptas estas condiciones. Están redactadas en lenguaje claro a propósito.',
        sections: [
            {
                h2: 'El servicio',
                p: [
                    'Ofrecemos una herramienta web para organizar sorteos de amigo invisible: cargar participantes, aplicar reglas de exclusión, generar asignaciones al azar y notificar a cada persona mediante un enlace privado.',
                ],
            },
            {
                h2: 'Cuentas',
                p: [
                    'Puedes preparar tu lista sin cuenta. Para ejecutar el sorteo necesitas iniciar sesión con Google o Facebook. Eres responsable de la actividad que ocurra en tu cuenta.',
                ],
            },
            {
                h2: 'Uso aceptable',
                ul: [
                    'No uses el servicio para enviar mensajes no solicitados a personas que no participan de tu sorteo.',
                    'No cargues datos de terceros sin su conocimiento.',
                    'No intentes acceder a sorteos ajenos ni automatizar peticiones contra el sitio.',
                ],
                p: [
                    'Podemos suspender cuentas que incumplan estas condiciones, sin reembolso si el incumplimiento es grave.',
                ],
            },
            {
                h2: 'Planes y pagos',
                p: [
                    'El plan gratuito permite sorteos de hasta 15 participantes. Los planes de pago se cobran por única vez mediante MercadoPago (en UYU) o PayPal (en USD), a elección del usuario, y desbloquean las funciones descritas en la página de precios.',
                    'Si el servicio no funcionó como esperabas, puedes solicitar el reembolso dentro de los 14 días posteriores al pago escribiendo a nuestro email de contacto.',
                ],
            },
            {
                h2: 'Disponibilidad y límites',
                p: [
                    'El servicio se ofrece "tal cual". Hacemos lo razonable para que funcione siempre, pero no garantizamos disponibilidad ininterrumpida ni la entrega de cada notificación: el email, el WhatsApp y el SMS dependen de proveedores externos y de datos de contacto correctos.',
                    'Por eso el panel muestra el estado de cada envío y permite reintentar o compartir el enlace manualmente.',
                ],
            },
            {
                h2: 'Responsabilidad',
                p: [
                    'No somos responsables de daños indirectos derivados del uso del servicio, como un regalo no entregado o una asignación revelada por compartir un enlace secreto. Nuestra responsabilidad máxima se limita al importe que hayas pagado.',
                ],
            },
            {
                h2: 'Propiedad intelectual',
                p: [
                    'El código, el diseño y los textos del sitio pertenecen a su autor. Los datos que cargas siguen siendo tuyos.',
                ],
            },
            {
                h2: 'Contacto',
                p: ['Para cualquier consulta sobre estas condiciones: brianbentancourt9@gmail.com'],
            },
        ],
    },
];

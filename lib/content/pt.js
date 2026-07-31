const CTA = {
    title: 'Você que vai organizar o sorteio este ano?',
    desc: 'Monte a lista, marque as exclusões e deixe cada participante receber o próprio link secreto. Grátis e sem cadastro para começar.',
    label: 'Criar meu sorteio grátis',
};

export const pagesPt = [
    {
        key: 'pricing',
        type: 'pricing',
        slug: 'precos',
        priority: 0.9,
        changeFrequency: 'monthly',
        title: 'Preços - Amigo Oculto online',
        h1: 'Preços',
        description:
            'Organize seu Amigo Oculto grátis com até 15 participantes. Planos Premium e Empresas com participantes ilimitados, sem publicidade e com lembretes.',
        keywords: ['amigo oculto preço', 'amigo oculto premium', 'amigo oculto empresas'],
        intro:
            'A ferramenta é gratuita para a maioria dos sorteios. Os planos pagos existem para grupos grandes e para quem organiza a troca de presentes de uma empresa.',
        showPricing: true,
        faqs: [
            {
                q: 'O pagamento é uma assinatura?',
                a: 'Não. É um pagamento único por temporada: você paga uma vez e usa todos os recursos durante esse período, sem renovação automática nem cobrança surpresa.',
            },
            {
                q: 'Quais formas de pagamento vocês aceitam?',
                a: 'Os pagamentos são processados pelo MercadoPago, que aceita cartões de crédito e débito (inclusive internacionais), transferências e saldo em conta conforme o país.',
            },
            {
                q: 'Posso pagar do Brasil?',
                a: 'Sim. O valor é cobrado em pesos uruguaios porque nossa conta é uruguaia, mas o MercadoPago aceita cartões emitidos em outros países e o seu banco faz a conversão automaticamente.',
            },
            {
                q: 'E se eu já sorteei e depois quiser o Premium?',
                a: 'Você pode migrar quando quiser. Os recursos novos valem para o sorteio atual e para os próximos; os links já enviados continuam funcionando normalmente.',
            },
            {
                q: 'Tem reembolso?',
                a: 'Se o serviço não funcionou como você esperava, escreva para a gente em até 14 dias e devolvemos o valor. Preferimos isso a ficar com o dinheiro de quem não foi bem atendido.',
            },
        ],
        cta: CTA,
    },
    {
        key: 'faq',
        type: 'faq',
        slug: 'perguntas-frequentes',
        priority: 0.8,
        changeFrequency: 'monthly',
        title: 'Perguntas frequentes sobre o Amigo Oculto',
        h1: 'Perguntas frequentes',
        description:
            'Como funciona o sorteio de Amigo Oculto online: exclusões, notificações, privacidade, limites do plano grátis e o que fazer se alguém perder o link.',
        keywords: ['como funciona amigo oculto', 'dúvidas amigo oculto', 'sorteio amigo oculto online'],
        intro: 'Estas são as dúvidas que mais chegam no nosso e-mail. Se a sua não estiver aqui, escreva que a gente adiciona.',
        faqs: [
            {
                q: 'Como funciona o sorteio?',
                a: 'Você adiciona os nomes dos participantes com e-mail ou telefone, marca as exclusões se precisar e clica em "Realizar sorteio". O sistema gera uma combinação válida ao acaso e envia para cada pessoa um link secreto onde ela — e só ela — vê quem tirou.',
            },
            {
                q: 'O organizador pode participar sem trapacear?',
                a: 'Sim. Os resultados nunca aparecem completos na tela. Como organizador você vê se as notificações foram enviadas, mas não os pares dos outros. Você recebe seu próprio link secreto como todo mundo.',
            },
            {
                q: 'Quantas pessoas podem participar?',
                a: 'O plano grátis permite até 15 participantes por sorteio. Com o Premium não há limite: já vimos sorteios de empresa com mais de 100 pessoas.',
            },
            {
                q: 'O que são as regras de exclusão?',
                a: 'São restrições do tipo "esta pessoa não pode tirar aquela". Servem principalmente para que casais não tirem um ao outro, para separar irmãos ou para não repetir o sorteio do ano anterior. Você pode criar quantas quiser, desde que sobre pelo menos uma combinação possível.',
            },
            {
                q: 'E se as exclusões deixarem o sorteio impossível?',
                a: 'O algoritmo tenta centenas de vezes achar uma combinação válida. Se não existir nenhuma (por exemplo, três pessoas que não podem se tirar), ele avisa com um erro para você flexibilizar alguma regra.',
            },
            {
                q: 'Como os participantes ficam sabendo?',
                a: 'Automaticamente por e-mail e, se você informou o telefone com o código do país, por WhatsApp. Na tabela de resultados também há um botão para compartilhar o link de cada pessoa manualmente.',
            },
            {
                q: 'E se a mensagem não chegou para alguém?',
                a: 'Na lista aparece um X vermelho ao lado da pessoa e um botão para tentar de novo. Se continuar falhando (e-mail digitado errado, telefone sem código do país), você copia o link secreto e envia você mesmo.',
            },
            {
                q: 'Posso refazer o sorteio se errei?',
                a: 'Sim. Clique em "Novo sorteio" e uma combinação nova é gerada mantendo a lista de participantes. Só lembre que os links anteriores deixam de valer, então avise o grupo antes.',
            },
            {
                q: 'Os links expiram?',
                a: 'Os links continuam ativos enquanto o sorteio existir. São endereços longos e aleatórios, impossíveis de adivinhar, mas quem receber o link de outra pessoa veria o par dela: por isso pedimos para não repassar.',
            },
            {
                q: 'Vocês guardam os dados dos meus amigos?',
                a: 'Guardamos nomes, e-mails e telefones para enviar as notificações e manter o link secreto funcionando. Não vendemos, não fazemos marketing com eles e apagamos se você pedir.',
            },
            {
                q: 'Serve para o amigo oculto do trabalho?',
                a: 'Sim, é um dos usos mais comuns. Para equipes grandes vale o plano Premium ou Empresas: participantes ilimitados, lembretes antes do evento e painel com o status de envio de cada pessoa.',
            },
            {
                q: 'Funciona no celular?',
                a: 'Sim, sem instalar nada. Tanto o painel do organizador quanto a página de revelação funcionam no navegador de qualquer celular.',
            },
        ],
        cta: CTA,
    },
    {
        key: 'generator',
        type: 'landing',
        slug: 'amigo-oculto',
        priority: 0.9,
        changeFrequency: 'monthly',
        title: 'Amigo Oculto Online - Sorteio automático e grátis',
        h1: 'Sorteio de Amigo Oculto online',
        description:
            'Faça o sorteio de Amigo Oculto online e grátis. Adicione participantes, defina quem não pode tirar quem e avise todo mundo por WhatsApp ou e-mail em segundos.',
        keywords: ['amigo oculto', 'sorteio amigo oculto', 'amigo oculto online', 'amigo secreto online'],
        intro:
            'Amigo Oculto, Amigo Secreto, Amigo Invisível ou troca de presentes: o nome muda conforme o país, mas o problema é sempre o mesmo. Alguém precisa sortear, e essa pessoa acaba sabendo mais do que deveria.',
        sections: [
            {
                h2: 'Sortear no papel tem três problemas',
                p: [
                    'O primeiro é logístico: todo mundo precisa estar no mesmo lugar e na mesma hora, o que com famílias grandes ou equipes de trabalho quase nunca acontece.',
                    'O segundo é que quem distribui os papeizinhos costuma ficar de fora do sorteio ou acaba vendo algum par sem querer.',
                    'O terceiro são as repetições: sem registro dos anos anteriores, é comum a mesma pessoa tirar o mesmo amigo dois anos seguidos.',
                ],
            },
            {
                h2: 'Como o sorteio online resolve',
                ul: [
                    'Cada participante recebe um link privado: ninguém vê a lista completa, nem quem organiza.',
                    'As exclusões são configuradas uma vez e o algoritmo respeita sempre.',
                    'Não precisa reunir todo mundo: o aviso vai por e-mail e WhatsApp.',
                    'A lista de desejos de cada pessoa viaja junto com o link, então o presente acerta mais.',
                ],
            },
            {
                h2: 'Quantas pessoas preciso',
                p: [
                    'Funciona a partir de três pessoas, mas a graça começa com cinco ou seis: quanto mais participantes, menos previsível é o resultado.',
                    'Em grupos com menos de quatro pessoas e exclusões de casal, o sorteio pode ficar matematicamente impossível. Quando isso acontece, a ferramenta avisa em vez de entregar uma combinação inválida.',
                ],
            },
            {
                h2: 'Quando fazer',
                p: [
                    'A recomendação prática é sortear de duas a três semanas antes da troca. Dá tempo de comprar sem correria e evita que as pessoas esqueçam quem tiraram.',
                    'Se for grupo de trabalho, combine o valor no mesmo momento do sorteio: essa é a principal fonte de constrangimento quando alguém gasta muito mais que o resto.',
                ],
            },
        ],
        faqs: [
            {
                q: 'Amigo Oculto e Amigo Secreto são a mesma coisa?',
                a: 'Sim. É o mesmo jogo com nomes diferentes: Amigo Oculto e Amigo Secreto no Brasil, Amigo Invisível na Espanha e Secret Santa em inglês. A ferramenta funciona igual para todos.',
            },
            {
                q: 'Dá para sortear se estivermos em cidades diferentes?',
                a: 'Sim, é justamente para isso. Ninguém precisa estar presente: cada pessoa recebe o link por e-mail ou WhatsApp e abre quando quiser.',
            },
            {
                q: 'É grátis?',
                a: 'Sim, até 15 participantes, com notificações incluídas e sem limite de sorteios.',
            },
        ],
        cta: CTA,
    },
    {
        key: 'work',
        type: 'landing',
        slug: 'amigo-oculto-empresa',
        priority: 0.8,
        changeFrequency: 'monthly',
        title: 'Amigo Oculto para empresas - Organize a troca do escritório',
        h1: 'Amigo Oculto para o escritório',
        description:
            'Organize o amigo oculto da sua empresa sem planilhas nem correntes de e-mail. Participantes ilimitados, exclusões por equipe, lembretes e controle de envios.',
        keywords: ['amigo oculto empresa', 'amigo oculto escritório', 'troca de presentes trabalho', 'amigo oculto rh'],
        intro:
            'A troca de fim de ano no trabalho costuma cair sempre na mesma pessoa do RH, que acaba administrando uma planilha, uma corrente de e-mails e quinze mensagens perguntando "quem eu tirei mesmo?".',
        sections: [
            {
                h2: 'O que costuma dar errado num sorteio de escritório',
                ul: [
                    'A planilha circula por e-mail e alguém vê os pares dos outros.',
                    'Entram pessoas depois do sorteio e é preciso refazer tudo.',
                    'Ninguém lembra do valor combinado e os presentes ficam desiguais.',
                    'Quem organiza não consegue participar sem saber quem tirou.',
                    'As pessoas esquecem e alguém precisa correr atrás na semana do evento.',
                ],
            },
            {
                h2: 'Como montar em 10 minutos',
                ol: [
                    'Junte os nomes e os e-mails corporativos da equipe.',
                    'Adicione no painel: dá para colar a lista aos poucos, ela salva sozinha.',
                    'Marque as exclusões que fizerem sentido (por exemplo, duas pessoas do mesmo time pequeno).',
                    'Defina a data da troca e o valor sugerido.',
                    'Rode o sorteio: cada pessoa recebe o link privado por e-mail.',
                    'Confira o painel de envios e reenvie o link para quem não recebeu.',
                ],
            },
            {
                h2: 'Valor do presente: o ponto que mais evita atrito',
                p: [
                    'Definir uma faixa clara (mínimo e máximo) evita a situação constrangedora de receber um presente muito mais caro do que o que você deu.',
                    'Em equipes com salários diferentes, um valor baixo iguala todo mundo. O sentido da troca é o gesto, não a competição.',
                ],
            },
            {
                h2: 'O que o plano Empresas acrescenta',
                ul: [
                    'Participantes ilimitados, para equipes de qualquer tamanho.',
                    'Logo e cores da empresa na página que os participantes veem.',
                    'Vários sorteios em paralelo, útil quando cada unidade faz o seu.',
                    'Lembretes automáticos antes da data da troca.',
                    'Painel com o status de envio pessoa por pessoa.',
                    'Sem publicidade na experiência que a sua equipe vê.',
                ],
            },
        ],
        faqs: [
            {
                q: 'Serve para equipes remotas ou híbridas?',
                a: 'Sim. Como tudo acontece por e-mail e links individuais, ninguém precisa estar no escritório. Equipes distribuídas costumam usar com presentes digitais ou entrega em casa.',
            },
            {
                q: 'Posso adicionar gente depois do sorteio?',
                a: 'Seria preciso refazer o sorteio para incluir a pessoa, o que invalida os links anteriores. O ideal é fechar as inscrições alguns dias antes e só então sortear.',
            },
            {
                q: 'Os dados dos funcionários estão seguros?',
                a: 'Usamos nome, e-mail e telefone apenas para enviar as notificações daquele sorteio. Nada é compartilhado com terceiros nem usado para publicidade, e apagamos a pedido.',
            },
        ],
        cta: {
            title: 'Organize a troca da sua equipe',
            desc: 'Comece grátis e passe para o plano Empresas se precisar de participantes ilimitados, lembretes e a marca da sua empresa.',
            label: 'Criar o sorteio do escritório',
        },
    },
    {
        key: 'gift-ideas',
        type: 'article',
        slug: 'ideias-de-presentes-baratos',
        priority: 0.7,
        changeFrequency: 'yearly',
        title: 'Ideias de presentes baratos para o Amigo Oculto',
        h1: 'Ideias de presentes baratos para o Amigo Oculto',
        description:
            'Mais de 40 ideias de presente para amigo oculto com orçamento apertado, separadas por tipo de pessoa: escritório, família, adolescentes e presentes feitos à mão.',
        keywords: ['presentes amigo oculto baratos', 'ideias amigo oculto', 'o que dar de presente amigo oculto'],
        intro:
            'O problema do amigo oculto quase nunca é o valor: é não saber nada sobre a pessoa que você tirou. Estas ideias estão organizadas por situação, que é como a gente compra de verdade.',
        sections: [
            {
                h2: 'Se você mal conhece a pessoa',
                p: ['A regra é simples: escolha algo consumível ou de uso diário. Ninguém precisa fingir que gostou e não ocupa espaço na casa.'],
                ul: [
                    'Café especial ou uma seleção de chás',
                    'Uma boa barra de chocolate ou doces regionais',
                    'Uma plantinha de interior, tipo suculenta ou jiboia',
                    'Uma caneca sóbria (evite as de frase engraçada se não houver intimidade)',
                    'Velas aromáticas ou um difusor pequeno',
                    'Um caderno de boa qualidade e uma caneta decente',
                ],
            },
            {
                h2: 'Para a troca do escritório',
                ul: [
                    'Suporte para celular ou para notebook',
                    'Fones simples ou organizador de cabos',
                    'Uma garrafa térmica reutilizável',
                    'Um joguinho de mesa ou um quebra-cabeça',
                    'Um vale para a cafeteria perto do escritório',
                    'Um calendário de mesa bonito',
                ],
            },
            {
                h2: 'Para a família',
                ul: [
                    'Um porta-retrato com uma foto do grupo',
                    'Um jogo de tabuleiro curto, daqueles de meia hora',
                    'Luvas, cachecol ou meias térmicas se for inverno',
                    'Um livro de receitas ou um utensílio que esteja faltando',
                    'Um álbum ou pendrive com fotos e vídeos da família',
                ],
            },
            {
                h2: 'Para adolescentes',
                ul: [
                    'Capinhas ou acessórios para o celular',
                    'Um power bank pequeno',
                    'Adesivos, pôsteres ou produtos de algo que a pessoa acompanha',
                    'Uma assinatura de um mês de música ou streaming',
                    'Material de arte ou papelaria, se desenha',
                ],
            },
            {
                h2: 'Presentes feitos à mão que funcionam',
                p: ['Um presente caseiro funciona quando dá para ver que houve tempo, não improviso. Os mais bem recebidos são:'],
                ul: [
                    'Biscoitos ou geleia num pote decorado',
                    'Uma playlist com um bilhete explicando por que escolheu cada música',
                    'Um vale por algo concreto: um jantar feito por você, ajuda numa mudança, cuidar das plantas',
                    'Uma foto impressa e emoldurada de um momento juntos',
                ],
            },
            {
                h2: 'O que evitar',
                ul: [
                    'Roupa com numeração, a não ser que você tenha certeza',
                    'Perfume: o gosto é pessoal demais',
                    'Presentes com piada interna que a pessoa talvez não compartilhe',
                    'Qualquer coisa que obrigue a retribuir com algo mais caro',
                    'Enfeites grandes: ocupam espaço e são difíceis de descartar sem culpa',
                ],
            },
            {
                h2: 'O truque que resolve tudo isso',
                p: [
                    'Se cada participante escrever duas ou três coisas que gostaria de ganhar na hora de se inscrever, o problema acaba. No nosso sorteio essa lista de desejos vai junto com o link secreto: quem tirou você vê direto o que seria útil.',
                ],
            },
        ],
        faqs: [
            {
                q: 'Quanto se costuma gastar num amigo oculto?',
                a: 'Depende do grupo, mas o importante é que a faixa seja combinada antes do sorteio e igual para todos. Um valor baixo e explícito funciona melhor que um alto e vago.',
            },
            {
                q: 'Pode dar vale-presente?',
                a: 'Funciona quando você não conhece a pessoa, embora seja percebido como menos pessoal. Se escolher essa opção, acompanhe com um bilhete escrito à mão: muda completamente a recepção.',
            },
        ],
        cta: CTA,
    },
    {
        key: 'rules',
        type: 'article',
        slug: 'regras-do-amigo-oculto',
        priority: 0.7,
        changeFrequency: 'yearly',
        title: 'Regras do Amigo Oculto: como organizar direito',
        h1: 'As regras do Amigo Oculto',
        description:
            'Como se joga o amigo oculto: número de participantes, valor, datas, regras de exclusão e variações como lista de desejos, dicas e amigo oculto com roubo.',
        keywords: ['regras amigo oculto', 'como jogar amigo oculto', 'como organizar amigo oculto'],
        intro:
            'O amigo oculto tem pouquíssimas regras, mas combiná-las antes evita quase todos os problemas clássicos: presentes desiguais, gente que esquece e sorteios que precisam ser refeitos.',
        sections: [
            {
                h2: 'As regras básicas',
                ol: [
                    'Cada participante presenteia uma pessoa e recebe de uma pessoa.',
                    'Ninguém pode tirar a si mesmo.',
                    'O par fica em segredo até o dia da troca.',
                    'Todo mundo gasta dentro da mesma faixa de valor.',
                    'Todo mundo entrega o presente na data combinada, presente ou não.',
                ],
            },
            {
                h2: 'Quantos participantes são necessários',
                p: [
                    'Tecnicamente funciona a partir de três pessoas, mas com menos de cinco fica fácil deduzir quem tirou você. O ponto ideal fica entre seis e trinta participantes.',
                    'Acima de quarenta vale dividir em grupos por área ou por família: a logística de um único sorteio gigante costuma deixar alguém sem presente.',
                ],
            },
            {
                h2: 'O valor',
                p: [
                    'Combinar o valor antes do sorteio, e não depois, é a regra que mais evita atrito. O ideal é definir um mínimo e um máximo.',
                    'Se o grupo for economicamente diverso, um valor baixo iguala todo mundo. Também dá para combinar um tema em vez de um valor: "feito à mão", "de segunda mão", "algo que se coma".',
                ],
            },
            {
                h2: 'As exclusões',
                p: ['Uma exclusão é uma regra do tipo "A não pode tirar B". As mais comuns são:'],
                ul: [
                    'Casais que não querem se tirar, porque já trocam presente à parte.',
                    'Irmãos ou parentes diretos, para o sorteio misturar de verdade.',
                    'Repetições do ano anterior.',
                    'Pessoas que trabalham juntas todos os dias, em sorteios grandes de escritório.',
                ],
                p2: [
                    'Cuidado para não exagerar: quanto mais exclusões, menos combinações possíveis. Se você colocar tantas que não sobre nenhuma combinação válida, o sorteio fica impossível e alguma regra precisa ser flexibilizada.',
                ],
            },
            {
                h2: 'Datas: o calendário que funciona',
                ol: [
                    'Quatro semanas antes: fecha a lista de participantes.',
                    'Três semanas antes: faz o sorteio e combina o valor.',
                    'Uma semana antes: lembrete para o grupo.',
                    'No dia: troca de presentes, de preferência com todo mundo junto.',
                ],
            },
            {
                h2: 'Variações conhecidas',
                ul: [
                    'Com dicas: cada participante escreve três dicas sobre si e elas são lidas em voz alta antes de revelar quem é.',
                    'Com lista de desejos: cada um anota duas ou três coisas que gostaria. É a variação que mais aumenta a satisfação com o presente.',
                    'Com roubo (tipo Amigo Oculto Maluco): os presentes vão sem destinatário e, na sua vez, cada pessoa pode abrir um novo ou roubar o de outro. É um jogo diferente e não convém misturar com o clássico.',
                    'Temático: todos os presentes precisam cumprir uma condição, como ser feito à mão, de segunda mão ou comestível.',
                ],
            },
            {
                h2: 'O que fazer se alguém desistir',
                p: [
                    'Se a pessoa desistir antes do sorteio, é só tirar da lista. Se desistir depois, o mais limpo é refazer o sorteio inteiro avisando o grupo, porque remover uma pessoa quebra a corrente de pares.',
                    'Por isso vale fechar a lista alguns dias antes de sortear, em vez de sortear assim que o primeiro se inscreve.',
                ],
            },
        ],
        faqs: [
            {
                q: 'Dá para fazer amigo oculto à distância?',
                a: 'Sim. O sorteio é online e a troca pode ser resolvida com entrega em casa ou presentes digitais. A única regra extra é antecipar o prazo para dar margem aos envios.',
            },
            {
                q: 'Deve-se revelar quem deu o presente?',
                a: 'Depende do grupo. A versão clássica revela todo mundo no fim da troca; alguns grupos preferem que quem deu fique em segredo para sempre. Combine antes, não na hora.',
            },
            {
                q: 'E se alguém não levar presente?',
                a: 'Quem organiza costuma ter um presente reserva. Apontar publicamente quem falhou nunca acaba bem: resolva em particular depois do evento.',
            },
        ],
        cta: CTA,
    },
    {
        key: 'privacy',
        type: 'legal',
        slug: 'privacidade',
        priority: 0.3,
        changeFrequency: 'yearly',
        title: 'Política de Privacidade',
        h1: 'Política de Privacidade',
        description: 'Quais dados coletamos, para que usamos, com quem compartilhamos e como você pode apagá-los.',
        intro:
            'Esta política explica quais dados tratamos quando você usa o sorteio de Amigo Oculto e o que você pode fazer a respeito. Está escrita para ser entendida, não para nos proteger.',
        sections: [
            {
                h2: 'Quem é o responsável',
                p: [
                    'O responsável pelo tratamento é Brian Bentancourt, autor e operador deste site. Fale com a gente em brianbentancourt9@gmail.com sobre qualquer assunto relacionado aos seus dados.',
                ],
            },
            {
                h2: 'Quais dados coletamos',
                ul: [
                    'Dados da sua conta: e-mail, nome e foto de perfil que o Google ou o Facebook nos entrega no login.',
                    'Dados dos participantes que você cadastra: nome e, opcionalmente, e-mail, telefone e lista de desejos.',
                    'Dados do sorteio: os pares gerados e o status de envio de cada notificação.',
                    'Dados técnicos: endereço IP, tipo de navegador e páginas visitadas, pela nossa ferramenta de analytics.',
                ],
            },
            {
                h2: 'Para que usamos',
                ul: [
                    'Rodar o sorteio e enviar as notificações por e-mail, WhatsApp ou SMS.',
                    'Manter ativo o link secreto de cada participante.',
                    'Processar o pagamento se você contratar um plano pago.',
                    'Entender, de forma agregada, como o site é usado para poder melhorá-lo.',
                ],
                p: [
                    'Não vendemos dados pessoais, não criamos perfis publicitários e não enviamos comunicações comerciais aos participantes que você cadastrou.',
                ],
            },
            {
                h2: 'Responsabilidade sobre dados de terceiros',
                p: [
                    'Ao cadastrar dados de outras pessoas, é você quem deve garantir que elas concordam com o uso do e-mail ou telefone para este sorteio. Nós tratamos esses dados apenas para as finalidades acima.',
                ],
            },
            {
                h2: 'Com quem compartilhamos',
                ul: [
                    'Google Firebase: autenticação e banco de dados.',
                    'SendGrid: envio de e-mails.',
                    'Twilio: envio de WhatsApp e SMS.',
                    'MercadoPago: processamento de pagamentos. Não armazenamos dados de cartão.',
                    'Google Analytics e Google AdSense: analytics e publicidade, quando ativos.',
                    'Vercel: hospedagem do site.',
                ],
            },
            {
                h2: 'Publicidade e cookies',
                p: [
                    'Usamos cookies próprios para lembrar seu idioma e manter a sessão. Se a publicidade estiver ativa, o Google AdSense pode usar cookies para exibir anúncios; você gerencia essas preferências nas configurações de anúncios do Google.',
                ],
            },
            {
                h2: 'Por quanto tempo guardamos',
                p: [
                    'Os dados de um sorteio ficam guardados enquanto a conta existir, para que os links continuem funcionando. Você pode pedir a exclusão de um sorteio ou da conta inteira quando quiser.',
                ],
            },
            {
                h2: 'Seus direitos',
                p: [
                    'Você pode solicitar acesso, correção, exclusão ou portabilidade dos seus dados, e se opor ao tratamento, escrevendo para brianbentancourt9@gmail.com. Respondemos em até 30 dias.',
                ],
            },
            {
                h2: 'Menores de idade',
                p: [
                    'O serviço não é direcionado a menores de 14 anos. Se um adulto organiza um sorteio que inclui menores, é dele a responsabilidade de ter o consentimento dos responsáveis.',
                ],
            },
            {
                h2: 'Mudanças nesta política',
                p: [
                    'Se mudarmos algo relevante, atualizaremos a data desta página. O uso continuado do serviço implica aceitação da versão vigente.',
                ],
            },
        ],
    },
    {
        key: 'terms',
        type: 'legal',
        slug: 'termos',
        priority: 0.3,
        changeFrequency: 'yearly',
        title: 'Termos e Condições',
        h1: 'Termos e Condições',
        description: 'Condições de uso do serviço de sorteio de Amigo Oculto: contas, planos pagos, limites e responsabilidades.',
        intro: 'Ao usar este site você aceita estas condições. Elas foram escritas em linguagem simples de propósito.',
        sections: [
            {
                h2: 'O serviço',
                p: [
                    'Oferecemos uma ferramenta web para organizar sorteios de amigo oculto: cadastrar participantes, aplicar regras de exclusão, gerar combinações ao acaso e avisar cada pessoa por um link privado.',
                ],
            },
            {
                h2: 'Contas',
                p: [
                    'Você pode montar sua lista sem conta. Para rodar o sorteio é preciso entrar com Google ou Facebook. Você é responsável pela atividade na sua conta.',
                ],
            },
            {
                h2: 'Uso aceitável',
                ul: [
                    'Não use o serviço para enviar mensagens não solicitadas a quem não participa do seu sorteio.',
                    'Não cadastre dados de terceiros sem o conhecimento deles.',
                    'Não tente acessar sorteios alheios nem automatizar requisições contra o site.',
                ],
                p: ['Podemos suspender contas que descumpram estas condições, sem reembolso quando o descumprimento for grave.'],
            },
            {
                h2: 'Planos e pagamentos',
                p: [
                    'O plano grátis permite sorteios de até 15 participantes. Os planos pagos são cobrados uma única vez pelo MercadoPago e liberam os recursos descritos na página de preços.',
                    'Se o serviço não funcionou como esperado, você pode pedir reembolso em até 14 dias após o pagamento escrevendo para o nosso e-mail de contato.',
                ],
            },
            {
                h2: 'Disponibilidade e limites',
                p: [
                    'O serviço é oferecido "como está". Fazemos o razoável para que funcione sempre, mas não garantimos disponibilidade ininterrupta nem a entrega de cada notificação: e-mail, WhatsApp e SMS dependem de fornecedores externos e de dados de contato corretos.',
                    'Por isso o painel mostra o status de cada envio e permite tentar de novo ou compartilhar o link manualmente.',
                ],
            },
            {
                h2: 'Responsabilidade',
                p: [
                    'Não somos responsáveis por danos indiretos decorrentes do uso do serviço, como um presente não entregue ou um par revelado por repassar um link secreto. Nossa responsabilidade máxima se limita ao valor que você pagou.',
                ],
            },
            {
                h2: 'Propriedade intelectual',
                p: ['O código, o design e os textos do site pertencem ao seu autor. Os dados que você cadastra continuam sendo seus.'],
            },
            {
                h2: 'Contato',
                p: ['Para qualquer dúvida sobre estas condições: brianbentancourt9@gmail.com'],
            },
        ],
    },
];

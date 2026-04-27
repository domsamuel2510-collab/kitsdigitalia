/* ============================================================
   KitsDigitalia — Main JavaScript v3
   Auth · i18n · Animations
   ============================================================ */

/* ============================================================
   Product Catalog — single source of truth
   ============================================================ */
const KD_PRODUCTS = {
  'chatgpt-pro': {
    id: 'chatgpt-pro',
    category: 'ai', emoji: '🤖', badge: 'bestseller', price: 15, billing: 'monthly', weeklySales: 483,
    translations: {
      pt: { name: 'ChatGPT Pro', shortDesc: 'Acesso premium ao ChatGPT para escrita, produtividade, pesquisa e uso avançado no dia a dia.', detailTitle: 'ChatGPT Pro', detailSubtitle: 'Use o ChatGPT com recursos premium para trabalho, estudos, criação de conteúdo e tarefas avançadas.', detailWhatIsTitle: 'O que é o ChatGPT Pro?', detailDesc1: 'O ChatGPT Pro oferece acesso premium a uma das ferramentas de IA mais usadas do mundo para produtividade, criação, organização e apoio em tarefas profissionais.', detailDesc2: 'É uma solução prática para quem quer respostas mais completas, uso recorrente e uma experiência mais avançada no dia a dia.', benefitsTitle: 'O que você recebe', benefits: ['Acesso premium à ferramenta', 'Uso ideal para estudos, trabalho e criação', 'Mais praticidade em tarefas diárias', 'Entrega rápida após confirmação'], howTitle: 'Como funciona', howSteps: ['Escolha o plano e finalize o pedido', 'Receba as instruções de acesso', 'Comece a usar após a liberação'], faqTitle: 'Perguntas frequentes', faqs: [{ q: 'Em quanto tempo recebo o acesso?', a: 'Normalmente após a confirmação do pagamento, com envio rápido dentro do horário de atendimento.' }, { q: 'Se eu tiver problema com o acesso?', a: 'Entre em contato com o suporte e verificamos o caso rapidamente.' }] },
      en: { name: 'ChatGPT Pro', shortDesc: 'Premium ChatGPT access for writing, productivity, research, and advanced daily use.', detailTitle: 'ChatGPT Pro', detailSubtitle: 'Use ChatGPT with premium access for work, study, content creation, and advanced tasks.', detailWhatIsTitle: 'What is ChatGPT Pro?', detailDesc1: 'ChatGPT Pro gives premium access to one of the most widely used AI tools for productivity, creation, organization, and professional support.', detailDesc2: 'It is a practical solution for users who want a more advanced experience for daily tasks.', benefitsTitle: 'What you get', benefits: ['Premium access to the tool', 'Useful for work, study, and creation', 'More practicality for daily tasks', 'Fast delivery after confirmation'], howTitle: 'How it works', howSteps: ['Choose the plan and complete the order', 'Receive the access instructions', 'Start using it after activation'], faqTitle: 'Frequently asked questions', faqs: [{ q: 'How long does delivery take?', a: 'Usually after payment confirmation, with fast delivery during service hours.' }, { q: 'What if I have an access issue?', a: 'Contact support and we will review it quickly.' }] },
      it: { name: 'ChatGPT Pro', shortDesc: 'Accesso premium a ChatGPT per scrittura, produttività, ricerca e uso avanzato quotidiano.', detailTitle: 'ChatGPT Pro', detailSubtitle: 'Usa ChatGPT con accesso premium per lavoro, studio, creazione di contenuti e attività avanzate.', detailWhatIsTitle: "Cos'è ChatGPT Pro?", detailDesc1: "ChatGPT Pro offre accesso premium a uno degli strumenti di IA più usati per produttività, creazione, organizzazione e supporto professionale.", detailDesc2: "È una soluzione pratica per chi desidera un'esperienza più avanzata nelle attività quotidiane.", benefitsTitle: 'Cosa ricevi', benefits: ['Accesso premium allo strumento', 'Ideale per lavoro, studio e creazione', 'Più praticità nelle attività quotidiane', 'Consegna rapida dopo la conferma'], howTitle: 'Come funziona', howSteps: ["Scegli il piano e completa l'ordine", 'Ricevi le istruzioni di accesso', "Inizia a usarlo dopo l'attivazione"], faqTitle: 'Domande frequenti', faqs: [{ q: "Quanto tempo serve per ricevere l'accesso?", a: "Di solito dopo la conferma del pagamento, con consegna rapida durante l'orario di assistenza." }, { q: "Cosa succede se ho un problema con l'accesso?", a: 'Contatta il supporto e verificheremo rapidamente.' }] }
    }
  },
  'claude-pro': {
    id: 'claude-pro',
    category: 'ai', emoji: '🧠', badge: 'popular', price: 15, billing: 'monthly', weeklySales: 233,
    translations: {
      pt: { name: 'Claude Pro', shortDesc: 'Ferramenta premium de IA para leitura, análise, organização de ideias e produtividade.', detailTitle: 'Claude Pro', detailSubtitle: 'Ideal para quem precisa de apoio com textos longos, análise, escrita e rotina profissional.', detailWhatIsTitle: 'O que é o Claude Pro?', detailDesc1: 'Claude Pro é uma ferramenta premium de IA voltada para produtividade, leitura, escrita e apoio em fluxos de trabalho.', detailDesc2: 'É uma opção útil para quem lida com textos, planejamento, organização e tarefas digitais no dia a dia.', benefitsTitle: 'O que você recebe', benefits: ['Acesso premium à ferramenta', 'Bom para leitura, escrita e organização', 'Experiência pensada para produtividade', 'Entrega rápida após confirmação'], howTitle: 'Como funciona', howSteps: ['Escolha o produto e envie seu pedido', 'Receba as orientações de acesso', 'Use normalmente após a liberação'], faqTitle: 'Perguntas frequentes', faqs: [{ q: 'O acesso é mensal?', a: 'Sim, este produto é vendido em formato mensal.' }, { q: 'Recebo suporte se precisar?', a: 'Sim, o suporte pode ser acionado pelo canal informado no site.' }] },
      en: { name: 'Claude Pro', shortDesc: 'Premium AI tool for reading, analysis, idea organization, and productivity.', detailTitle: 'Claude Pro', detailSubtitle: 'Ideal for users who need support with long texts, analysis, writing, and professional routine.', detailWhatIsTitle: 'What is Claude Pro?', detailDesc1: 'Claude Pro is a premium AI tool designed for productivity, reading, writing, and workflow support.', detailDesc2: 'It is useful for users dealing with text, planning, organization, and daily digital tasks.', benefitsTitle: 'What you get', benefits: ['Premium access to the tool', 'Helpful for reading, writing, and organization', 'Built for productivity', 'Fast delivery after confirmation'], howTitle: 'How it works', howSteps: ['Choose the product and place your order', 'Receive the access instructions', 'Use it normally after activation'], faqTitle: 'Frequently asked questions', faqs: [{ q: 'Is this monthly access?', a: 'Yes, this product is sold as a monthly access.' }, { q: 'Do I get support if needed?', a: 'Yes, support is available through the contact channel shown on the site.' }] },
      it: { name: 'Claude Pro', shortDesc: 'Strumento IA premium per lettura, analisi, organizzazione delle idee e produttività.', detailTitle: 'Claude Pro', detailSubtitle: 'Ideale per chi ha bisogno di supporto con testi lunghi, analisi, scrittura e routine professionale.', detailWhatIsTitle: "Cos'è Claude Pro?", detailDesc1: 'Claude Pro è uno strumento IA premium pensato per produttività, lettura, scrittura e supporto ai flussi di lavoro.', detailDesc2: 'È utile per chi gestisce testi, pianificazione, organizzazione e attività digitali quotidiane.', benefitsTitle: 'Cosa ricevi', benefits: ['Accesso premium allo strumento', 'Utile per lettura, scrittura e organizzazione', 'Pensato per la produttività', 'Consegna rapida dopo la conferma'], howTitle: 'Come funziona', howSteps: ["Scegli il prodotto e invia l'ordine", 'Ricevi le istruzioni di accesso', 'Usalo normalmente dopo l\'attivazione'], faqTitle: 'Domande frequenti', faqs: [{ q: 'È un accesso mensile?', a: 'Sì, questo prodotto viene venduto come accesso mensile.' }, { q: 'Ricevo supporto se necessario?', a: 'Sì, il supporto è disponibile tramite il canale indicato sul sito.' }] }
    }
  },
  'canva-pro': {
    id: 'canva-pro',
    category: 'design', emoji: '🎨', badge: 'bestvalue', price: 5, billing: 'monthly', weeklySales: 148,
    translations: {
      pt: { name: 'Canva Pro', shortDesc: 'Acesso premium ao Canva para design, redes sociais, apresentações e materiais visuais.', detailTitle: 'Canva Pro', detailSubtitle: 'Crie posts, banners, apresentações e materiais visuais com recursos premium.', detailWhatIsTitle: 'O que é o Canva Pro?', detailDesc1: 'Canva Pro é a versão premium da plataforma de design usada para criar conteúdos visuais com mais recursos e praticidade.', detailDesc2: 'É indicado para quem trabalha com social media, marketing, vendas, criação de conteúdo e apresentação visual.', benefitsTitle: 'O que você recebe', benefits: ['Recursos premium do Canva', 'Mais liberdade para criar materiais visuais', 'Uso prático para redes sociais e apresentações', 'Entrega rápida após confirmação'], howTitle: 'Como funciona', howSteps: ['Escolha o produto e finalize o pedido', 'Receba as instruções de ativação', 'Comece a usar os recursos premium'], faqTitle: 'Perguntas frequentes', faqs: [{ q: 'Serve para trabalho e estudos?', a: 'Sim, é útil para criação visual em várias finalidades.' }, { q: 'A entrega é rápida?', a: 'Sim, normalmente após a confirmação do pagamento.' }] },
      en: { name: 'Canva Pro', shortDesc: 'Premium Canva access for design, social media, presentations, and visual materials.', detailTitle: 'Canva Pro', detailSubtitle: 'Create posts, banners, presentations, and visual assets with premium resources.', detailWhatIsTitle: 'What is Canva Pro?', detailDesc1: 'Canva Pro is the premium version of the design platform used to create visual content with more features and convenience.', detailDesc2: 'It is ideal for social media, marketing, sales, content creation, and visual presentation work.', benefitsTitle: 'What you get', benefits: ['Premium Canva features', 'More freedom for visual creation', 'Useful for social media and presentations', 'Fast delivery after confirmation'], howTitle: 'How it works', howSteps: ['Choose the product and complete the order', 'Receive the activation instructions', 'Start using premium features'], faqTitle: 'Frequently asked questions', faqs: [{ q: 'Can I use it for work and study?', a: 'Yes, it is useful for visual creation in many contexts.' }, { q: 'Is delivery fast?', a: 'Yes, usually after payment confirmation.' }] },
      it: { name: 'Canva Pro', shortDesc: 'Accesso premium a Canva per design, social media, presentazioni e materiali visivi.', detailTitle: 'Canva Pro', detailSubtitle: 'Crea post, banner, presentazioni e materiali visivi con risorse premium.', detailWhatIsTitle: "Cos'è Canva Pro?", detailDesc1: 'Canva Pro è la versione premium della piattaforma di design usata per creare contenuti visivi con più funzioni e praticità.', detailDesc2: 'È ideale per social media, marketing, vendite, creazione di contenuti e presentazioni visive.', benefitsTitle: 'Cosa ricevi', benefits: ['Funzionalità premium di Canva', 'Più libertà nella creazione visiva', 'Utile per social media e presentazioni', 'Consegna rapida dopo la conferma'], howTitle: 'Come funziona', howSteps: ["Scegli il prodotto e completa l'ordine", 'Ricevi le istruzioni di attivazione', 'Inizia a usare le funzioni premium'], faqTitle: 'Domande frequenti', faqs: [{ q: 'Posso usarlo per lavoro e studio?', a: 'Sì, è utile per la creazione visiva in molti contesti.' }, { q: 'La consegna è rapida?', a: 'Sì, di solito dopo la conferma del pagamento.' }] }
    }
  },
  'gemini-veo-3': {
    id: 'gemini-veo-3',
    category: 'ai', emoji: '✨', badge: 'new', price: 10, billing: 'monthly', weeklySales: 58,
    translations: {
      pt: { name: 'Gemini Veo 3', shortDesc: 'Ferramenta premium com foco em recursos avançados de IA e uso moderno no dia a dia.', detailTitle: 'Gemini Veo 3', detailSubtitle: 'Opção premium para quem busca recursos modernos de IA para produtividade e criação.', detailWhatIsTitle: 'O que é o Gemini Veo 3?', detailDesc1: 'Gemini Veo 3 é uma opção premium para quem quer explorar recursos avançados de IA em diferentes tipos de tarefas.', detailDesc2: 'Pode ser útil para produtividade, criação, apoio em fluxos digitais e uso recorrente.', benefitsTitle: 'O que você recebe', benefits: ['Acesso mensal ao produto', 'Recursos modernos de IA', 'Uso prático para tarefas digitais', 'Entrega rápida após confirmação'], howTitle: 'Como funciona', howSteps: ['Escolha o produto e envie o pedido', 'Receba as orientações', 'Use normalmente após a liberação'], faqTitle: 'Perguntas frequentes', faqs: [{ q: 'O valor é mensal?', a: 'Sim, o valor deste produto é mensal.' }, { q: 'Posso pedir suporte?', a: 'Sim, pelo canal principal do site.' }] },
      en: { name: 'Gemini Veo 3', shortDesc: 'Premium tool focused on advanced AI resources and modern daily use.', detailTitle: 'Gemini Veo 3', detailSubtitle: 'A premium option for users seeking modern AI resources for productivity and creation.', detailWhatIsTitle: 'What is Gemini Veo 3?', detailDesc1: 'Gemini Veo 3 is a premium option for users who want advanced AI resources across different task types.', detailDesc2: 'It can be useful for productivity, creation, digital workflows, and recurring use.', benefitsTitle: 'What you get', benefits: ['Monthly product access', 'Modern AI resources', 'Practical use for digital tasks', 'Fast delivery after confirmation'], howTitle: 'How it works', howSteps: ['Choose the product and place the order', 'Receive the instructions', 'Use it normally after activation'], faqTitle: 'Frequently asked questions', faqs: [{ q: 'Is the price monthly?', a: 'Yes, the price for this product is monthly.' }, { q: 'Can I request support?', a: 'Yes, through the main contact channel on the site.' }] },
      it: { name: 'Gemini Veo 3', shortDesc: "Strumento premium focalizzato su risorse IA avanzate e uso moderno quotidiano.", detailTitle: 'Gemini Veo 3', detailSubtitle: "Un'opzione premium per chi cerca risorse IA moderne per produttività e creazione.", detailWhatIsTitle: "Cos'è Gemini Veo 3?", detailDesc1: "Gemini Veo 3 è un'opzione premium per chi desidera usare risorse IA avanzate in diversi tipi di attività.", detailDesc2: 'Può essere utile per produttività, creazione, flussi digitali e uso ricorrente.', benefitsTitle: 'Cosa ricevi', benefits: ['Accesso mensile al prodotto', 'Risorse IA moderne', 'Uso pratico per attività digitali', 'Consegna rapida dopo la conferma'], howTitle: 'Come funziona', howSteps: ["Scegli il prodotto e invia l'ordine", 'Ricevi le istruzioni', "Usalo normalmente dopo l'attivazione"], faqTitle: 'Domande frequenti', faqs: [{ q: 'Il prezzo è mensile?', a: 'Sì, il prezzo di questo prodotto è mensile.' }, { q: 'Posso richiedere supporto?', a: 'Sì, tramite il canale principale del sito.' }] }
    }
  },
  'capcut-pro': {
    id: 'capcut-pro',
    category: 'design', emoji: '✂️', badge: 'popular', price: 7, billing: 'monthly', weeklySales: 112,
    translations: {
      pt: { name: 'CapCut Pro', shortDesc: 'Acesso premium ao CapCut para edição de vídeo, conteúdo curto e produção visual.', detailTitle: 'CapCut Pro', detailSubtitle: 'Ideal para edição de vídeos, reels, anúncios e conteúdo para redes sociais.', detailWhatIsTitle: 'O que é o CapCut Pro?', detailDesc1: 'CapCut Pro é uma solução premium para edição de vídeo e criação de conteúdo visual com mais recursos.', detailDesc2: 'É indicado para criadores, social media, afiliados, anunciantes e quem precisa editar com agilidade.', benefitsTitle: 'O que você recebe', benefits: ['Recursos premium de edição', 'Uso prático para vídeos curtos e criativos', 'Mais flexibilidade na produção visual', 'Entrega rápida após confirmação'], howTitle: 'Como funciona', howSteps: ['Escolha o produto e finalize o pedido', 'Receba as instruções de acesso', 'Comece a usar normalmente'], faqTitle: 'Perguntas frequentes', faqs: [{ q: 'É útil para redes sociais?', a: 'Sim, especialmente para vídeos curtos e conteúdo digital.' }, { q: 'Quando recebo o acesso?', a: 'Normalmente após a confirmação do pagamento.' }] },
      en: { name: 'CapCut Pro', shortDesc: 'Premium CapCut access for video editing, short-form content, and visual production.', detailTitle: 'CapCut Pro', detailSubtitle: 'Ideal for editing videos, reels, ads, and social media content.', detailWhatIsTitle: 'What is CapCut Pro?', detailDesc1: 'CapCut Pro is a premium solution for video editing and visual content creation with more features.', detailDesc2: 'It is useful for creators, social media managers, affiliates, advertisers, and fast editing workflows.', benefitsTitle: 'What you get', benefits: ['Premium editing resources', 'Useful for short videos and creative content', 'More flexibility in visual production', 'Fast delivery after confirmation'], howTitle: 'How it works', howSteps: ['Choose the product and complete the order', 'Receive the access instructions', 'Start using it normally'], faqTitle: 'Frequently asked questions', faqs: [{ q: 'Is it useful for social media?', a: 'Yes, especially for short videos and digital content.' }, { q: 'When do I receive access?', a: 'Usually after payment confirmation.' }] },
      it: { name: 'CapCut Pro', shortDesc: 'Accesso premium a CapCut per editing video, contenuti brevi e produzione visiva.', detailTitle: 'CapCut Pro', detailSubtitle: 'Ideale per modificare video, reels, annunci e contenuti per social media.', detailWhatIsTitle: "Cos'è CapCut Pro?", detailDesc1: 'CapCut Pro è una soluzione premium per editing video e creazione di contenuti visivi con più funzioni.', detailDesc2: 'È utile per creator, social media manager, affiliati, inserzionisti e flussi di editing rapidi.', benefitsTitle: 'Cosa ricevi', benefits: ['Risorse premium di editing', 'Utile per video brevi e contenuti creativi', 'Più flessibilità nella produzione visiva', 'Consegna rapida dopo la conferma'], howTitle: 'Come funziona', howSteps: ["Scegli il prodotto e completa l'ordine", 'Ricevi le istruzioni di accesso', 'Inizia a usarlo normalmente'], faqTitle: 'Domande frequenti', faqs: [{ q: 'È utile per i social media?', a: 'Sì, soprattutto per video brevi e contenuti digitali.' }, { q: "Quando ricevo l'accesso?", a: 'Di solito dopo la conferma del pagamento.' }] }
    }
  },
  'manus-4000-credits': {
    id: 'manus-4000-credits',
    category: 'productivity', emoji: '📘', badge: 'new', price: 15, billing: 'monthly', weeklySales: 17,
    translations: {
      pt: { name: 'Manus 4.000 Credits', shortDesc: 'Acesso mensal com 4.000 créditos e processo de ativação orientado após a compra.', detailTitle: 'Manus 4.000 Credits', detailSubtitle: 'Produto com fluxo específico de ativação e validação após o pagamento.', detailWhatIsTitle: 'O que é o Manus 4.000 Credits?', detailDesc1: 'Este produto oferece acesso mensal com 4.000 créditos, com ativação orientada após a confirmação do pagamento.', detailDesc2: 'O processo envolve envio de instruções, confirmação do pedido e etapa de validação para conclusão da entrega.', benefitsTitle: 'O que você recebe', benefits: ['4.000 créditos mensais', 'Orientação para ativação do acesso', 'Suporte durante o processo', 'Entrega após confirmação e validação'], howTitle: 'Como funciona', howSteps: ['Após a compra, você recebe as instruções para o processo de ativação', 'Envie os dados ou código solicitado para confirmação do pedido', 'Se necessário, permaneça disponível durante a validação', 'Após a conclusão, o acesso é finalizado e liberado'], faqTitle: 'Perguntas frequentes', faqs: [{ q: 'Preciso fazer alguma etapa depois da compra?', a: 'Sim. Após o pagamento, você deve seguir as instruções enviadas para confirmar e concluir a ativação.' }, { q: 'O processamento é imediato?', a: 'Pode variar conforme o horário de atendimento e a etapa de validação necessária para finalizar o acesso.' }] },
      en: { name: 'Manus 4,000 Credits', shortDesc: 'Monthly access with 4,000 credits and a guided activation process after purchase.', detailTitle: 'Manus 4,000 Credits', detailSubtitle: 'Product with a specific activation and validation flow after payment.', detailWhatIsTitle: 'What is Manus 4,000 Credits?', detailDesc1: 'This product provides monthly access with 4,000 credits, with guided activation after payment confirmation.', detailDesc2: 'The process includes receiving instructions, confirming the order, and completing a validation step when required.', benefitsTitle: 'What you get', benefits: ['4,000 monthly credits', 'Guided access activation', 'Support during the process', 'Delivery after confirmation and validation'], howTitle: 'How it works', howSteps: ['After purchase, you receive the instructions for activation', 'Send the requested data or code to confirm the order', 'If needed, stay available during the validation step', 'After completion, access is finalized and released'], faqTitle: 'Frequently asked questions', faqs: [{ q: 'Do I need to do anything after purchase?', a: 'Yes. After payment, you must follow the instructions sent to complete the activation.' }, { q: 'Is processing instant?', a: 'It may vary depending on support hours and the validation step required to finalize access.' }] },
      it: { name: 'Manus 4.000 Credits', shortDesc: "Accesso mensile con 4.000 crediti e processo guidato di attivazione dopo l'acquisto.", detailTitle: 'Manus 4.000 Credits', detailSubtitle: 'Prodotto con flusso specifico di attivazione e validazione dopo il pagamento.', detailWhatIsTitle: "Cos'è Manus 4.000 Credits?", detailDesc1: 'Questo prodotto offre accesso mensile con 4.000 crediti, con attivazione guidata dopo la conferma del pagamento.', detailDesc2: "Il processo include istruzioni, conferma dell'ordine e una fase di validazione quando necessaria.", benefitsTitle: 'Cosa ricevi', benefits: ['4.000 crediti mensili', "Attivazione guidata dell'accesso", 'Supporto durante il processo', 'Consegna dopo conferma e validazione'], howTitle: 'Come funziona', howSteps: ["Dopo l'acquisto ricevi le istruzioni per l'attivazione", "Invia i dati o il codice richiesto per confermare l'ordine", 'Se necessario, resta disponibile durante la validazione', "Al termine, l'accesso viene finalizzato e attivato"], faqTitle: 'Domande frequenti', faqs: [{ q: "Devo fare qualcosa dopo l'acquisto?", a: "Sì. Dopo il pagamento devi seguire le istruzioni inviate per completare l'attivazione." }, { q: "L'elaborazione è immediata?", a: "Può variare in base all'orario di assistenza e alla fase di validazione necessaria." }] }
    }
  },
  'spotify-premium': {
    id: 'spotify-premium',
    category: 'streaming', emoji: '🎵', badge: 'popular', price: 10, billing: 'monthly', weeklySales: 162,
    translations: {
      pt: { name: 'Spotify Premium', shortDesc: 'Acesso mensal ao Spotify Premium. Para ativação, será necessário o e-mail e a senha da conta do usuário.', detailTitle: 'Spotify Premium', detailSubtitle: 'Produto com ativação vinculada à conta do próprio cliente.', detailWhatIsTitle: 'O que é o Spotify Premium?', detailDesc1: 'Spotify Premium oferece uma experiência sem anúncios, com mais liberdade para ouvir músicas e conteúdos no dia a dia.', detailDesc2: 'Para este produto, será necessário informar o e-mail e a senha da conta Spotify do usuário para viabilizar a ativação.', benefitsTitle: 'O que você recebe', benefits: ['Acesso mensal ao Spotify Premium', 'Uso na própria conta do usuário', 'Ativação orientada após confirmação', 'Suporte em caso de necessidade'], howTitle: 'Como funciona', howSteps: ['Finalize o pedido normalmente', 'Envie o e-mail e a senha da sua conta Spotify', 'A ativação será realizada no seu perfil', 'Após a conclusão, você pode usar normalmente'], faqTitle: 'Perguntas frequentes', faqs: [{ q: 'Preciso enviar dados da minha conta?', a: 'Sim. Para este produto, é necessário informar o e-mail e a senha da conta Spotify do usuário.' }, { q: 'A ativação é feita na minha conta?', a: 'Sim, a ativação é vinculada à conta informada durante o processo.' }] },
      en: { name: 'Spotify Premium', shortDesc: "Monthly Spotify Premium access. Activation requires the user's Spotify account email and password.", detailTitle: 'Spotify Premium', detailSubtitle: "Product activated directly on the customer's own account.", detailWhatIsTitle: 'What is Spotify Premium?', detailDesc1: 'Spotify Premium provides an ad-free experience with more freedom to enjoy music and audio content daily.', detailDesc2: 'For this product, the user must provide the email and password of their Spotify account to complete activation.', benefitsTitle: 'What you get', benefits: ['Monthly Spotify Premium access', "Used on the customer's own account", 'Guided activation after confirmation', 'Support if needed'], howTitle: 'How it works', howSteps: ['Complete the order normally', 'Send the email and password of your Spotify account', 'Activation will be completed on your profile', 'After completion, you can use it normally'], faqTitle: 'Frequently asked questions', faqs: [{ q: 'Do I need to send my account details?', a: 'Yes. For this product, the user must provide the email and password of their Spotify account.' }, { q: 'Is activation done on my own account?', a: 'Yes, activation is linked to the account provided during the process.' }] },
      it: { name: 'Spotify Premium', shortDesc: "Accesso mensile a Spotify Premium. Per l'attivazione sono necessari email e password dell'account Spotify dell'utente.", detailTitle: 'Spotify Premium', detailSubtitle: "Prodotto attivato direttamente sull'account del cliente.", detailWhatIsTitle: "Cos'è Spotify Premium?", detailDesc1: "Spotify Premium offre un'esperienza senza pubblicità con maggiore libertà per ascoltare musica e contenuti audio ogni giorno.", detailDesc2: "Per questo prodotto, l'utente deve fornire email e password del proprio account Spotify per completare l'attivazione.", benefitsTitle: 'Cosa ricevi', benefits: ['Accesso mensile a Spotify Premium', 'Uso sul proprio account', 'Attivazione guidata dopo la conferma', 'Supporto se necessario'], howTitle: 'Come funziona', howSteps: ["Completa normalmente l'ordine", 'Invia email e password del tuo account Spotify', "L'attivazione sarà eseguita sul tuo profilo", 'Dopo il completamento, potrai usarlo normalmente'], faqTitle: 'Domande frequenti', faqs: [{ q: "Devo inviare i dati del mio account?", a: "Sì. Per questo prodotto è necessario fornire email e password dell'account Spotify dell'utente." }, { q: "L'attivazione avviene sul mio account?", a: "Sì, l'attivazione è collegata all'account fornito durante il processo." }] }
    }
  },

  /* ===== STREAMING ===== */
  'netflix': {
    id: 'netflix', category: 'streaming', emoji: '🎬', badge: 'bestseller', price: 6, billing: 'monthly', weeklySales: 187, image: '/assets/products/netflix.png',
    translations: {
      pt: { name: 'Netflix', shortDesc: 'Acesso mensal ao Netflix com filmes, séries originais e documentários em qualidade premium.', detailTitle: 'Netflix', detailSubtitle: 'O maior serviço de streaming do mundo a um preço acessível.', detailWhatIsTitle: 'O que é o Netflix?', detailDesc1: 'Netflix é o maior serviço de streaming do mundo com milhares de filmes, séries, documentários e conteúdos originais.', detailDesc2: 'Com acesso via KitsDigitalia você tem tudo isso por muito menos.', benefitsTitle: 'O que você recebe', benefits: ['Catálogo completo do Netflix', 'Qualidade premium disponível', 'Conteúdos originais exclusivos', 'Entrega rápida após confirmação'], howTitle: 'Como funciona', howSteps: ['Finalize o pedido', 'Receba as credenciais por email', 'Acesse o Netflix e comece a assistir'], faqTitle: 'Perguntas frequentes', faqs: [{ q: 'Funciona no meu dispositivo?', a: 'Sim, funciona em qualquer dispositivo compatível com Netflix.' }, { q: 'Preciso criar uma conta?', a: 'Não. Fornecemos as credenciais prontas para uso.' }] },
      en: { name: 'Netflix', shortDesc: 'Monthly Netflix access with films, original series and documentaries in premium quality.', detailTitle: 'Netflix', detailSubtitle: "The world's largest streaming service at an affordable price.", detailWhatIsTitle: 'What is Netflix?', detailDesc1: "Netflix is the world's largest streaming service with thousands of films, series, documentaries and original content.", detailDesc2: 'With access via KitsDigitalia you get all of this for much less.', benefitsTitle: 'What you get', benefits: ['Full Netflix catalog access', 'Premium quality available', 'Exclusive original content', 'Fast delivery after confirmation'], howTitle: 'How it works', howSteps: ['Complete the order', 'Receive credentials by email', 'Access Netflix and start watching'], faqTitle: 'Frequently asked questions', faqs: [{ q: 'Does it work on my device?', a: 'Yes, it works on any device compatible with Netflix.' }, { q: 'Do I need to create an account?', a: 'No. We provide ready-to-use credentials.' }] },
      it: { name: 'Netflix', shortDesc: 'Accesso mensile a Netflix con film, serie originali e documentari in qualità premium.', detailTitle: 'Netflix', detailSubtitle: 'Il più grande servizio di streaming al mondo a un prezzo accessibile.', detailWhatIsTitle: "Cos'è Netflix?", detailDesc1: 'Netflix è il più grande servizio di streaming al mondo con migliaia di film, serie, documentari e contenuti originali.', detailDesc2: 'Con accesso tramite KitsDigitalia hai tutto questo per molto meno.', benefitsTitle: 'Cosa ricevi', benefits: ['Accesso completo al catalogo Netflix', 'Qualità premium disponibile', 'Contenuti originali esclusivi', 'Consegna rapida dopo la conferma'], howTitle: 'Come funziona', howSteps: ["Completa l'ordine", 'Ricevi le credenziali via email', 'Accedi a Netflix e inizia a guardare'], faqTitle: 'Domande frequenti', faqs: [{ q: 'Funziona sul mio dispositivo?', a: 'Sì, funziona su qualsiasi dispositivo compatibile con Netflix.' }, { q: 'Devo creare un account?', a: "No. Forniamo le credenziali pronte per l'uso." }] }
    }
  },
  'youtube-premium': {
    id: 'youtube-premium', category: 'streaming', emoji: '▶️', badge: null, price: 6, billing: 'monthly', weeklySales: 94, image: '/assets/products/youtube.png',
    translations: {
      pt: { name: 'YouTube Premium', shortDesc: 'YouTube sem anúncios, downloads offline e YouTube Music incluído.', detailTitle: 'YouTube Premium', detailSubtitle: 'Assista e ouça sem interrupções, com música incluída.', detailWhatIsTitle: 'O que é o YouTube Premium?', detailDesc1: 'YouTube Premium remove todos os anúncios e inclui YouTube Music, downloads para offline e reprodução em segundo plano.', detailDesc2: 'Uma experiência de streaming de vídeo e música sem interrupções.', benefitsTitle: 'O que você recebe', benefits: ['YouTube sem anúncios', 'YouTube Music incluído', 'Downloads para assistir offline', 'Reprodução em segundo plano'], howTitle: 'Como funciona', howSteps: ['Finalize o pedido', 'Receba as credenciais por email', 'Ative e use sem anúncios'], faqTitle: 'Perguntas frequentes', faqs: [{ q: 'Inclui YouTube Music?', a: 'Sim, o YouTube Music está incluído.' }, { q: 'Funciona no celular?', a: 'Sim, funciona no app para Android e iOS.' }] },
      en: { name: 'YouTube Premium', shortDesc: 'Ad-free YouTube, offline downloads, and YouTube Music included.', detailTitle: 'YouTube Premium', detailSubtitle: 'Watch and listen without interruptions, with music included.', detailWhatIsTitle: 'What is YouTube Premium?', detailDesc1: 'YouTube Premium removes all ads and includes YouTube Music, offline downloads, and background playback.', detailDesc2: 'An uninterrupted video streaming and music experience.', benefitsTitle: 'What you get', benefits: ['Ad-free YouTube', 'YouTube Music included', 'Offline downloads', 'Background playback'], howTitle: 'How it works', howSteps: ['Complete the order', 'Receive credentials by email', 'Activate and use ad-free'], faqTitle: 'Frequently asked questions', faqs: [{ q: 'Is YouTube Music included?', a: 'Yes, YouTube Music is included.' }, { q: 'Does it work on mobile?', a: 'Yes, it works on the YouTube app for Android and iOS.' }] },
      it: { name: 'YouTube Premium', shortDesc: 'YouTube senza pubblicità, download offline e YouTube Music incluso.', detailTitle: 'YouTube Premium', detailSubtitle: 'Guarda e ascolta senza interruzioni, con musica inclusa.', detailWhatIsTitle: "Cos'è YouTube Premium?", detailDesc1: "YouTube Premium rimuove tutta la pubblicità e include YouTube Music, download offline e riproduzione in background.", detailDesc2: "Un'esperienza di streaming video e musicale senza interruzioni.", benefitsTitle: 'Cosa ricevi', benefits: ['YouTube senza pubblicità', 'YouTube Music incluso', 'Download offline', 'Riproduzione in background'], howTitle: 'Come funziona', howSteps: ["Completa l'ordine", 'Ricevi le credenziali via email', 'Attiva e usa senza pubblicità'], faqTitle: 'Domande frequenti', faqs: [{ q: 'YouTube Music è incluso?', a: 'Sì, YouTube Music è incluso.' }, { q: 'Funziona su mobile?', a: "Sì, funziona sull'app per Android e iOS." }] }
    }
  },
  'iptv': {
    id: 'iptv', category: 'streaming', emoji: '📺', badge: null, price: 8, billing: 'monthly', weeklySales: 52, image: '/assets/products/iptv.png',
    translations: {
      pt: { name: 'IPTV', shortDesc: 'Centenas de canais ao vivo: esportes, filmes, notícias e entretenimento.', detailTitle: 'IPTV', detailSubtitle: 'Canais ao vivo de todo o mundo no seu dispositivo.', detailWhatIsTitle: 'O que é IPTV?', detailDesc1: 'IPTV oferece acesso a centenas de canais de TV ao vivo via internet, incluindo esportes, filmes, notícias e entretenimento.', detailDesc2: 'Funciona em Smart TV, celular, tablet, computador, Fire Stick e Android Box.', benefitsTitle: 'O que você recebe', benefits: ['Centenas de canais ao vivo', 'Canais de esportes incluídos', 'Compatível com múltiplos dispositivos', 'Entrega rápida após confirmação'], howTitle: 'Como funciona', howSteps: ['Finalize o pedido', 'Receba o link e as credenciais por email', 'Configure no seu dispositivo e assista'], faqTitle: 'Perguntas frequentes', faqs: [{ q: 'Em quais dispositivos funciona?', a: 'Smart TV, celular, tablet, computador, Fire Stick, Android Box e outros.' }, { q: 'Inclui canais de esportes?', a: 'Sim, inclui canais de esportes nacionais e internacionais.' }] },
      en: { name: 'IPTV', shortDesc: 'Hundreds of live channels: sports, films, news and entertainment.', detailTitle: 'IPTV', detailSubtitle: 'Live channels from around the world on your device.', detailWhatIsTitle: 'What is IPTV?', detailDesc1: 'IPTV gives you access to hundreds of live TV channels via the internet, including sports, films, news and entertainment.', detailDesc2: 'Works on Smart TV, mobile, tablet, computer, Fire Stick and Android Box.', benefitsTitle: 'What you get', benefits: ['Hundreds of live channels', 'Sports channels included', 'Compatible with multiple devices', 'Fast delivery after confirmation'], howTitle: 'How it works', howSteps: ['Complete the order', 'Receive the link and credentials by email', 'Set up on your device and watch'], faqTitle: 'Frequently asked questions', faqs: [{ q: 'What devices does it work on?', a: 'Smart TV, mobile, tablet, computer, Fire Stick, Android Box and others.' }, { q: 'Does it include sports channels?', a: 'Yes, it includes national and international sports channels.' }] },
      it: { name: 'IPTV', shortDesc: 'Centinaia di canali in diretta: sport, film, notizie e intrattenimento.', detailTitle: 'IPTV', detailSubtitle: 'Canali in diretta da tutto il mondo sul tuo dispositivo.', detailWhatIsTitle: "Cos'è l'IPTV?", detailDesc1: "L'IPTV offre accesso a centinaia di canali TV in diretta via internet, tra cui sport, film, notizie e intrattenimento.", detailDesc2: 'Funziona su Smart TV, cellulare, tablet, computer, Fire Stick e Android Box.', benefitsTitle: 'Cosa ricevi', benefits: ['Centinaia di canali in diretta', 'Canali sportivi inclusi', 'Compatibile con più dispositivi', 'Consegna rapida dopo la conferma'], howTitle: 'Come funziona', howSteps: ["Completa l'ordine", 'Ricevi il link e le credenziali via email', 'Configuralo sul tuo dispositivo e guarda'], faqTitle: 'Domande frequenti', faqs: [{ q: 'Su quali dispositivi funziona?', a: 'Smart TV, cellulare, tablet, computer, Fire Stick, Android Box e altri.' }, { q: 'Include canali sportivi?', a: 'Sì, include canali sportivi nazionali e internazionali.' }] }
    }
  },
  'disney-plus': {
    id: 'disney-plus', category: 'streaming', emoji: '🏰', badge: 'soldout', price: 6, billing: 'monthly', soldOut: true, image: '/assets/products/disney.png',
    translations: {
      pt: { name: 'Disney+ Star', shortDesc: 'Disney, Pixar, Marvel, Star Wars e Star — o universo completo do entretenimento.', detailTitle: 'Disney+ Star', detailSubtitle: 'Todo o universo Disney, Marvel e Star Wars numa só plataforma.', detailWhatIsTitle: 'O que é o Disney+ Star?', detailDesc1: 'Disney+ Star reúne Disney, Pixar, Marvel, Star Wars, National Geographic e o catálogo adulto da Star.', detailDesc2: 'Atualmente indisponível. Entre em contato para ser avisado quando voltar ao estoque.', benefitsTitle: 'O que você receberia', benefits: ['Disney, Pixar, Marvel e Star Wars', 'Catálogo Star para adultos', 'Conteúdos originais exclusivos', 'Disponível em múltiplos dispositivos'], howTitle: 'Como funciona', howSteps: ['Finalize o pedido quando disponível', 'Receba as credenciais por email', 'Acesse e comece a assistir'], faqTitle: 'Perguntas frequentes', faqs: [{ q: 'Quando voltará ao estoque?', a: 'Entre em contato via WhatsApp para ser avisado assim que disponível.' }, { q: 'Posso entrar na lista de espera?', a: 'Sim! Fale com a gente pelo WhatsApp e avisamos quando disponível.' }] },
      en: { name: 'Disney+ Star', shortDesc: 'Disney, Pixar, Marvel, Star Wars and Star — the complete entertainment universe.', detailTitle: 'Disney+ Star', detailSubtitle: 'The entire Disney, Marvel and Star Wars universe on one platform.', detailWhatIsTitle: 'What is Disney+ Star?', detailDesc1: 'Disney+ Star brings together Disney, Pixar, Marvel, Star Wars, National Geographic and the adult Star catalog.', detailDesc2: 'Currently unavailable. Contact us to be notified when back in stock.', benefitsTitle: 'What you would get', benefits: ['Disney, Pixar, Marvel and Star Wars', 'Star adult catalog', 'Exclusive original content', 'Available on multiple devices'], howTitle: 'How it works', howSteps: ['Complete the order when available', 'Receive credentials by email', 'Access and start watching'], faqTitle: 'Frequently asked questions', faqs: [{ q: 'When will it be back in stock?', a: 'Contact us via WhatsApp to be notified as soon as available.' }, { q: 'Can I join the waiting list?', a: 'Yes! Message us on WhatsApp and we will notify you when available.' }] },
      it: { name: 'Disney+ Star', shortDesc: "Disney, Pixar, Marvel, Star Wars e Star — l'universo completo dell'intrattenimento.", detailTitle: 'Disney+ Star', detailSubtitle: "L'intero universo Disney, Marvel e Star Wars su un'unica piattaforma.", detailWhatIsTitle: "Cos'è Disney+ Star?", detailDesc1: 'Disney+ Star riunisce Disney, Pixar, Marvel, Star Wars, National Geographic e il catalogo adulto di Star.', detailDesc2: 'Attualmente non disponibile. Contattaci per essere avvisato quando torna disponibile.', benefitsTitle: 'Cosa riceveresti', benefits: ['Disney, Pixar, Marvel e Star Wars', 'Catalogo Star per adulti', 'Contenuti originali esclusivi', 'Disponibile su più dispositivi'], howTitle: 'Come funziona', howSteps: ["Completa l'ordine quando disponibile", 'Ricevi le credenziali via email', 'Accedi e inizia a guardare'], faqTitle: 'Domande frequenti', faqs: [{ q: 'Quando tornerà disponibile?', a: 'Contattaci via WhatsApp per essere avvisato appena disponibile.' }, { q: "Posso iscrivermi alla lista d'attesa?", a: 'Sì! Scrivici su WhatsApp e ti avviseremo quando disponibile.' }] }
    }
  },
  'prime-video': {
    id: 'prime-video', category: 'streaming', emoji: '📦', badge: null, price: 5, billing: 'monthly', weeklySales: 71, image: '/assets/products/prime.png',
    translations: {
      pt: { name: 'Prime Video', shortDesc: 'Filmes, séries originais Amazon e conteúdo exclusivo Prime em um só lugar.', detailTitle: 'Prime Video', detailSubtitle: 'O streaming da Amazon com filmes e séries originais de qualidade.', detailWhatIsTitle: 'O que é o Prime Video?', detailDesc1: 'Prime Video é o serviço de streaming da Amazon com um enorme catálogo de filmes, séries e Amazon Originals.', detailDesc2: 'Disponível em todos os principais dispositivos com ótima qualidade de imagem.', benefitsTitle: 'O que você recebe', benefits: ['Filmes e Amazon Originals', 'Catálogo amplo de filmes e séries', 'Qualidade premium', 'Entrega rápida após confirmação'], howTitle: 'Como funciona', howSteps: ['Finalize o pedido', 'Receba as credenciais por email', 'Acesse o Prime Video e comece a assistir'], faqTitle: 'Perguntas frequentes', faqs: [{ q: 'Inclui Amazon Originals?', a: 'Sim, o acesso inclui todo o catálogo incluindo Amazon Originals.' }, { q: 'Funciona no celular?', a: 'Sim, funciona no app Prime Video para Android e iOS.' }] },
      en: { name: 'Prime Video', shortDesc: 'Films, Amazon original series and exclusive Prime content in one place.', detailTitle: 'Prime Video', detailSubtitle: "Amazon's streaming service with quality films and original series.", detailWhatIsTitle: 'What is Prime Video?', detailDesc1: 'Prime Video is the Amazon streaming service with a huge catalog of films, series and Amazon Originals.', detailDesc2: 'Available on all major devices with great picture quality.', benefitsTitle: 'What you get', benefits: ['Films and Amazon Originals', 'Wide catalog of films and series', 'Premium quality', 'Fast delivery after confirmation'], howTitle: 'How it works', howSteps: ['Complete the order', 'Receive credentials by email', 'Access Prime Video and start watching'], faqTitle: 'Frequently asked questions', faqs: [{ q: 'Does it include Amazon Originals?', a: 'Yes, access includes the full catalog including Amazon Originals.' }, { q: 'Does it work on mobile?', a: 'Yes, it works on the Prime Video app for Android and iOS.' }] },
      it: { name: 'Prime Video', shortDesc: 'Film, serie originali Amazon e contenuti esclusivi Prime in un unico posto.', detailTitle: 'Prime Video', detailSubtitle: 'Il servizio streaming di Amazon con film e serie originali di qualità.', detailWhatIsTitle: "Cos'è Prime Video?", detailDesc1: "Prime Video è il servizio streaming di Amazon con un enorme catalogo di film, serie e Amazon Originals.", detailDesc2: 'Disponibile su tutti i principali dispositivi con ottima qualità video.', benefitsTitle: 'Cosa ricevi', benefits: ['Film e Amazon Originals', 'Ampio catalogo di film e serie', 'Qualità premium', 'Consegna rapida dopo la conferma'], howTitle: 'Come funziona', howSteps: ["Completa l'ordine", 'Ricevi le credenziali via email', 'Accedi a Prime Video e inizia a guardare'], faqTitle: 'Domande frequenti', faqs: [{ q: 'Include Amazon Originals?', a: "Sì, l'accesso include l'intero catalogo inclusi Amazon Originals." }, { q: 'Funziona su mobile?', a: "Sì, funziona sull'app Prime Video per Android e iOS." }] }
    }
  },
  'premiere-sports': {
    id: 'premiere-sports', category: 'streaming', emoji: '⚽', badge: 'soldout', price: 6, billing: 'monthly', soldOut: true, image: '/assets/products/premiere.png',
    translations: {
      pt: { name: 'Premiere Sports', shortDesc: 'Transmissões ao vivo do Campeonato Brasileiro e copas nacionais.', detailTitle: 'Premiere Sports', detailSubtitle: 'O futebol brasileiro na palma da sua mão.', detailWhatIsTitle: 'O que é o Premiere Sports?', detailDesc1: 'Premiere Sports é o canal de streaming dedicado ao futebol brasileiro com transmissões ao vivo do Campeonato Brasileiro.', detailDesc2: 'Atualmente indisponível. Entre em contato para ser avisado quando voltar ao estoque.', benefitsTitle: 'O que você receberia', benefits: ['Campeonato Brasileiro ao vivo', 'Cobertura completa de partidas', 'Jogos em qualidade premium', 'Disponível em múltiplos dispositivos'], howTitle: 'Como funciona', howSteps: ['Finalize o pedido quando disponível', 'Receba as credenciais por email', 'Acesse e assista ao vivo'], faqTitle: 'Perguntas frequentes', faqs: [{ q: 'Quando voltará ao estoque?', a: 'Entre em contato via WhatsApp para ser avisado assim que disponível.' }, { q: 'Funciona no celular?', a: 'Sim, quando disponível, funciona em app e browser.' }] },
      en: { name: 'Premiere Sports', shortDesc: 'Live broadcasts of the Brazilian Championship and national cups.', detailTitle: 'Premiere Sports', detailSubtitle: 'Brazilian football in the palm of your hand.', detailWhatIsTitle: 'What is Premiere Sports?', detailDesc1: 'Premiere Sports is the streaming channel dedicated to Brazilian football with live broadcasts of the Brazilian Championship.', detailDesc2: 'Currently unavailable. Contact us to be notified when back in stock.', benefitsTitle: 'What you would get', benefits: ['Live Brazilian Championship', 'Full match coverage', 'Premium quality games', 'Available on multiple devices'], howTitle: 'How it works', howSteps: ['Complete the order when available', 'Receive credentials by email', 'Access and watch live'], faqTitle: 'Frequently asked questions', faqs: [{ q: 'When will it be back in stock?', a: 'Contact us via WhatsApp to be notified as soon as available.' }, { q: 'Does it work on mobile?', a: 'Yes, when available, it works on app and browser.' }] },
      it: { name: 'Premiere Sports', shortDesc: 'Trasmissioni in diretta del Campionato Brasiliano e delle coppe nazionali.', detailTitle: 'Premiere Sports', detailSubtitle: 'Il calcio brasiliano nel palmo della tua mano.', detailWhatIsTitle: "Cos'è Premiere Sports?", detailDesc1: 'Premiere Sports è il canale streaming dedicato al calcio brasiliano con trasmissioni in diretta del Campionato Brasiliano.', detailDesc2: 'Attualmente non disponibile. Contattaci per essere avvisato quando torna disponibile.', benefitsTitle: 'Cosa riceveresti', benefits: ['Campionato Brasiliano in diretta', 'Copertura completa delle partite', 'Partite in qualità premium', 'Disponibile su più dispositivi'], howTitle: 'Come funziona', howSteps: ["Completa l'ordine quando disponibile", 'Ricevi le credenziali via email', 'Accedi e guarda in diretta'], faqTitle: 'Domande frequenti', faqs: [{ q: 'Quando tornerà disponibile?', a: 'Contattaci via WhatsApp per essere avvisato appena disponibile.' }, { q: 'Funziona su mobile?', a: 'Sì, quando disponibile, funziona su app e browser.' }] }
    }
  },
  'paramount-plus': {
    id: 'paramount-plus', category: 'streaming', emoji: '⭐', badge: null, price: 6, billing: 'monthly', weeklySales: 29, image: '/assets/products/paramount.png',
    translations: {
      pt: { name: 'Paramount+', shortDesc: 'Filmes Paramount, CBS, Nickelodeon, MTV e séries exclusivas numa plataforma.', detailTitle: 'Paramount+', detailSubtitle: 'Décadas de entretenimento de qualidade num só lugar.', detailWhatIsTitle: 'O que é o Paramount+?', detailDesc1: 'Paramount+ é o serviço de streaming da Paramount com filmes blockbuster, séries originais e conteúdos CBS, Nickelodeon e MTV.', detailDesc2: 'Uma plataforma rica com décadas de entretenimento de alta qualidade.', benefitsTitle: 'O que você recebe', benefits: ['Filmes Paramount blockbuster', 'Séries originais exclusivas', 'Conteúdo CBS, Nickelodeon e MTV', 'Entrega rápida após confirmação'], howTitle: 'Como funciona', howSteps: ['Finalize o pedido', 'Receba as credenciais por email', 'Acesse o Paramount+ e comece a assistir'], faqTitle: 'Perguntas frequentes', faqs: [{ q: 'Inclui Nickelodeon e MTV?', a: 'Sim, o Paramount+ inclui conteúdos de Nickelodeon, MTV e CBS.' }, { q: 'Funciona no celular?', a: 'Sim, funciona no app e em qualquer browser.' }] },
      en: { name: 'Paramount+', shortDesc: 'Paramount films, CBS, Nickelodeon, MTV and exclusive series on one platform.', detailTitle: 'Paramount+', detailSubtitle: 'Decades of quality entertainment in one place.', detailWhatIsTitle: 'What is Paramount+?', detailDesc1: 'Paramount+ is the Paramount streaming service with blockbuster films, original series and CBS, Nickelodeon, MTV content.', detailDesc2: 'A rich platform with decades of high-quality entertainment.', benefitsTitle: 'What you get', benefits: ['Paramount blockbuster films', 'Exclusive original series', 'CBS, Nickelodeon and MTV content', 'Fast delivery after confirmation'], howTitle: 'How it works', howSteps: ['Complete the order', 'Receive credentials by email', 'Access Paramount+ and start watching'], faqTitle: 'Frequently asked questions', faqs: [{ q: 'Does it include Nickelodeon and MTV?', a: 'Yes, Paramount+ includes content from Nickelodeon, MTV and CBS.' }, { q: 'Does it work on mobile?', a: 'Yes, it works on the app and in any browser.' }] },
      it: { name: 'Paramount+', shortDesc: "Film Paramount, CBS, Nickelodeon, MTV e serie esclusive su un'unica piattaforma.", detailTitle: 'Paramount+', detailSubtitle: 'Decenni di intrattenimento di qualità in un unico posto.', detailWhatIsTitle: "Cos'è Paramount+?", detailDesc1: 'Paramount+ è il servizio streaming di Paramount con film blockbuster, serie originali e contenuti CBS, Nickelodeon e MTV.', detailDesc2: 'Una piattaforma ricca con decenni di intrattenimento di alta qualità.', benefitsTitle: 'Cosa ricevi', benefits: ['Film Paramount blockbuster', 'Serie originali esclusive', 'Contenuti CBS, Nickelodeon e MTV', 'Consegna rapida dopo la conferma'], howTitle: 'Come funziona', howSteps: ["Completa l'ordine", 'Ricevi le credenziali via email', 'Accedi a Paramount+ e inizia a guardare'], faqTitle: 'Domande frequenti', faqs: [{ q: 'Include Nickelodeon e MTV?', a: 'Sì, Paramount+ include contenuti di Nickelodeon, MTV e CBS.' }, { q: 'Funziona su mobile?', a: "Sì, funziona sull'app e in qualsiasi browser." }] }
    }
  },
  'apple-tv': {
    id: 'apple-tv', category: 'streaming', emoji: '🍎', badge: null, price: 6, billing: 'monthly', weeklySales: 22, image: '/assets/products/appletv.png',
    translations: {
      pt: { name: 'Apple TV+', shortDesc: 'Séries e filmes Apple Originals premiados em qualidade cinematográfica.', detailTitle: 'Apple TV+', detailSubtitle: 'Produções originais Apple com qualidade cinematográfica.', detailWhatIsTitle: 'O que é o Apple TV+?', detailDesc1: 'Apple TV+ é o serviço de streaming da Apple com produções originais exclusivas, muitas delas premiadas internacionalmente.', detailDesc2: 'Conteúdo de altíssima qualidade com foco em filmes e séries originais Apple.', benefitsTitle: 'O que você recebe', benefits: ['Apple Originals exclusivos', 'Qualidade cinematográfica', 'Conteúdo premiado internacionalmente', 'Entrega rápida após confirmação'], howTitle: 'Como funciona', howSteps: ['Finalize o pedido', 'Receba as credenciais por email', 'Acesse o Apple TV+ e comece a assistir'], faqTitle: 'Perguntas frequentes', faqs: [{ q: 'Funciona no Android?', a: 'Sim, Apple TV+ tem app para Android e funciona em qualquer browser.' }, { q: 'O conteúdo é legendado?', a: 'Sim, a maioria dos conteúdos tem legendas em português e outros idiomas.' }] },
      en: { name: 'Apple TV+', shortDesc: 'Award-winning Apple Original series and films in cinematic quality.', detailTitle: 'Apple TV+', detailSubtitle: 'Apple original productions in cinematic quality.', detailWhatIsTitle: 'What is Apple TV+?', detailDesc1: 'Apple TV+ is the Apple streaming service with exclusive original productions, many internationally acclaimed.', detailDesc2: 'Very high quality content focused on Apple original films and series.', benefitsTitle: 'What you get', benefits: ['Exclusive Apple Originals', 'Cinematic quality', 'Internationally acclaimed content', 'Fast delivery after confirmation'], howTitle: 'How it works', howSteps: ['Complete the order', 'Receive credentials by email', 'Access Apple TV+ and start watching'], faqTitle: 'Frequently asked questions', faqs: [{ q: 'Does it work on Android?', a: 'Yes, Apple TV+ has an Android app and works in any browser.' }, { q: 'Is content subtitled?', a: 'Yes, most content has subtitles in multiple languages.' }] },
      it: { name: 'Apple TV+', shortDesc: 'Serie e film Apple Originals premiati in qualità cinematografica.', detailTitle: 'Apple TV+', detailSubtitle: 'Produzioni originali Apple di qualità cinematografica.', detailWhatIsTitle: "Cos'è Apple TV+?", detailDesc1: "Apple TV+ è il servizio streaming di Apple con produzioni originali esclusive, molte premiate internazionalmente.", detailDesc2: 'Contenuti di altissima qualità con focus su film e serie originali Apple.', benefitsTitle: 'Cosa ricevi', benefits: ['Apple Originals esclusivi', 'Qualità cinematografica', 'Contenuti premiati internazionalmente', 'Consegna rapida dopo la conferma'], howTitle: 'Come funziona', howSteps: ["Completa l'ordine", 'Ricevi le credenziali via email', 'Accedi ad Apple TV+ e inizia a guardare'], faqTitle: 'Domande frequenti', faqs: [{ q: 'Funziona su Android?', a: "Sì, Apple TV+ ha un'app per Android e funziona in qualsiasi browser." }, { q: 'Il contenuto ha i sottotitoli?', a: 'Sì, la maggior parte dei contenuti ha sottotitoli in più lingue.' }] }
    }
  },
  'nba-league-pass': {
    id: 'nba-league-pass', category: 'streaming', emoji: '🏀', badge: 'soldout', price: 6, billing: 'monthly', soldOut: true, image: '/assets/products/nba.png',
    translations: {
      pt: { name: 'NBA League Pass', shortDesc: 'Todos os jogos da NBA ao vivo e sob demanda. O streaming oficial do basquete.', detailTitle: 'NBA League Pass', detailSubtitle: 'O melhor basquete do mundo na palma da sua mão.', detailWhatIsTitle: 'O que é o NBA League Pass?', detailDesc1: 'NBA League Pass é o serviço oficial de streaming da NBA com acesso a todos os jogos ao vivo e sob demanda.', detailDesc2: 'Atualmente indisponível. Entre em contato para ser avisado quando voltar ao estoque.', benefitsTitle: 'O que você receberia', benefits: ['Todos os jogos NBA ao vivo', 'Jogos sob demanda', 'Cobertura completa da temporada', 'Disponível em múltiplos dispositivos'], howTitle: 'Como funciona', howSteps: ['Finalize o pedido quando disponível', 'Receba as credenciais por email', 'Acesse e assista à NBA ao vivo'], faqTitle: 'Perguntas frequentes', faqs: [{ q: 'Quando voltará ao estoque?', a: 'Entre em contato via WhatsApp para ser avisado assim que disponível.' }, { q: 'Funciona no celular?', a: 'Sim, quando disponível, funciona em app e browser.' }] },
      en: { name: 'NBA League Pass', shortDesc: 'All NBA games live and on demand. The official basketball streaming service.', detailTitle: 'NBA League Pass', detailSubtitle: 'The best basketball in the world in the palm of your hand.', detailWhatIsTitle: 'What is NBA League Pass?', detailDesc1: 'NBA League Pass is the official NBA streaming service with access to all games live and on demand.', detailDesc2: 'Currently unavailable. Contact us to be notified when back in stock.', benefitsTitle: 'What you would get', benefits: ['All NBA games live', 'On-demand games', 'Full season coverage', 'Available on multiple devices'], howTitle: 'How it works', howSteps: ['Complete the order when available', 'Receive credentials by email', 'Access and watch the NBA live'], faqTitle: 'Frequently asked questions', faqs: [{ q: 'When will it be back in stock?', a: 'Contact us via WhatsApp to be notified as soon as available.' }, { q: 'Does it work on mobile?', a: 'Yes, when available, it works on app and browser.' }] },
      it: { name: 'NBA League Pass', shortDesc: 'Tutte le partite NBA in diretta e on demand. Lo streaming ufficiale del basket.', detailTitle: 'NBA League Pass', detailSubtitle: 'Il miglior basket del mondo nel palmo della tua mano.', detailWhatIsTitle: "Cos'è NBA League Pass?", detailDesc1: 'NBA League Pass è il servizio ufficiale di streaming NBA con accesso a tutte le partite in diretta e on demand.', detailDesc2: 'Attualmente non disponibile. Contattaci per essere avvisato quando torna disponibile.', benefitsTitle: 'Cosa riceveresti', benefits: ['Tutte le partite NBA in diretta', 'Partite on demand', 'Copertura completa della stagione', 'Disponibile su più dispositivi'], howTitle: 'Come funziona', howSteps: ["Completa l'ordine quando disponibile", 'Ricevi le credenziali via email', 'Accedi e guarda la NBA in diretta'], faqTitle: 'Domande frequenti', faqs: [{ q: 'Quando tornerà disponibile?', a: 'Contattaci via WhatsApp per essere avvisato appena disponibile.' }, { q: 'Funziona su mobile?', a: 'Sì, quando disponibile, funziona su app e browser.' }] }
    }
  },

  /* ===== COMBOS ===== */
  'combo-mais-vendido': {
    id: 'combo-mais-vendido', category: 'streaming', emoji: '🔥', badge: 'bestseller', price: 19, billing: 'monthly', isCombo: true, weeklySales: 78,
    translations: {
      pt: { name: 'Combo Mais Vendido', shortDesc: 'Disney+ + Prime Video + HBO Max + Netflix. Tudo que você precisa de streaming por um único preço.', detailTitle: 'Combo Mais Vendido', detailSubtitle: 'Os 4 maiores streamings juntos com desconto especial.', detailWhatIsTitle: 'O que é o Combo Mais Vendido?', detailDesc1: 'O Combo Mais Vendido reúne Disney+, Prime Video, HBO Max e Netflix em um único pacote a um preço muito mais em conta do que contratar separado.', detailDesc2: 'A opção mais popular entre nossos clientes — um combo completo para toda a família.', benefitsTitle: 'O que você recebe', benefits: ['Disney+ com universo Disney/Marvel/Star Wars', 'Prime Video com Amazon Originals', 'HBO Max com séries e filmes premiados', 'Netflix com o maior catálogo de streaming'], howTitle: 'Como funciona', howSteps: ['Finalize o pedido do combo', 'Receba as credenciais de todos os serviços por email', 'Acesse cada plataforma e comece a assistir'], faqTitle: 'Perguntas frequentes', faqs: [{ q: 'Recebo acesso a todos os 4 serviços?', a: 'Sim! Você recebe as credenciais separadas para Disney+, Prime Video, HBO Max e Netflix.' }, { q: 'Quanto economizo em relação a contratar separado?', a: 'Contratar separado custaria muito mais. O combo oferece um preço especial para o pacote completo.' }] },
      en: { name: 'Best Seller Combo', shortDesc: 'Disney+ + Prime Video + HBO Max + Netflix. Everything you need for streaming at one single price.', detailTitle: 'Best Seller Combo', detailSubtitle: 'The 4 biggest streaming services together at a special discount.', detailWhatIsTitle: 'What is the Best Seller Combo?', detailDesc1: 'The Best Seller Combo bundles Disney+, Prime Video, HBO Max and Netflix in a single package at a much lower price than subscribing separately.', detailDesc2: 'The most popular option among our customers — a complete bundle for the whole family.', benefitsTitle: 'What you get', benefits: ['Disney+ with Disney/Marvel/Star Wars universe', 'Prime Video with Amazon Originals', 'HBO Max with award-winning series and films', 'Netflix with the largest streaming catalog'], howTitle: 'How it works', howSteps: ['Complete the combo order', 'Receive credentials for all services by email', 'Access each platform and start watching'], faqTitle: 'Frequently asked questions', faqs: [{ q: 'Do I get access to all 4 services?', a: 'Yes! You receive separate credentials for Disney+, Prime Video, HBO Max and Netflix.' }, { q: 'How much do I save vs subscribing separately?', a: 'Subscribing separately would cost much more. The combo offers a special price for the full bundle.' }] },
      it: { name: 'Combo Più Venduto', shortDesc: 'Disney+ + Prime Video + HBO Max + Netflix. Tutto il necessario per lo streaming a un unico prezzo.', detailTitle: 'Combo Più Venduto', detailSubtitle: 'I 4 più grandi servizi streaming insieme con sconto speciale.', detailWhatIsTitle: "Cos'è il Combo Più Venduto?", detailDesc1: "Il Combo Più Venduto riunisce Disney+, Prime Video, HBO Max e Netflix in un unico pacchetto a un prezzo molto più basso rispetto a sottoscriverli separatamente.", detailDesc2: "L'opzione più popolare tra i nostri clienti — un combo completo per tutta la famiglia.", benefitsTitle: 'Cosa ricevi', benefits: ['Disney+ con universo Disney/Marvel/Star Wars', 'Prime Video con Amazon Originals', 'HBO Max con serie e film premiati', 'Netflix con il più grande catalogo streaming'], howTitle: 'Come funziona', howSteps: ["Completa l'ordine del combo", 'Ricevi le credenziali per tutti i servizi via email', 'Accedi a ogni piattaforma e inizia a guardare'], faqTitle: 'Domande frequenti', faqs: [{ q: 'Ricevo accesso a tutti e 4 i servizi?', a: 'Sì! Ricevi credenziali separate per Disney+, Prime Video, HBO Max e Netflix.' }, { q: 'Quanto risparmio rispetto a sottoscriverli separatamente?', a: 'Sottoscriverli separatamente costerebbe molto di più. Il combo offre un prezzo speciale per il pacchetto completo.' }] }
    }
  },
  'combo-filmes': {
    id: 'combo-filmes', category: 'streaming', emoji: '🎥', badge: 'promo', price: 15, billing: 'monthly', isCombo: true, weeklySales: 34,
    translations: {
      pt: { name: 'Combo Filmes', shortDesc: 'Netflix + Prime Video + HBO Max. O melhor combo para séries e filmes premiados.', detailTitle: 'Combo Filmes', detailSubtitle: 'As melhores plataformas de filmes e séries num único pacote.', detailWhatIsTitle: 'O que é o Combo Filmes?', detailDesc1: 'O Combo Filmes reúne Netflix, Prime Video e HBO Max — as três melhores plataformas para quem ama filmes e séries de qualidade.', detailDesc2: 'Com esse combo você tem acesso ao melhor do cinema e das séries mundiais por um preço imbatível.', benefitsTitle: 'O que você recebe', benefits: ['Netflix com o maior catálogo global', 'Prime Video com Amazon Originals', 'HBO Max com as melhores séries do mundo', 'Economia em relação a contratar separado'], howTitle: 'Como funciona', howSteps: ['Finalize o pedido do combo', 'Receba as credenciais dos 3 serviços por email', 'Acesse cada plataforma e comece a assistir'], faqTitle: 'Perguntas frequentes', faqs: [{ q: 'Recebo acesso aos 3 serviços?', a: 'Sim! Você recebe credenciais separadas para Netflix, Prime Video e HBO Max.' }, { q: 'Vale mais a pena que contratar separado?', a: 'Com certeza! O combo oferece um preço especial para o pacote completo.' }] },
      en: { name: 'Films Combo', shortDesc: 'Netflix + Prime Video + HBO Max. The best combo for award-winning series and films.', detailTitle: 'Films Combo', detailSubtitle: 'The best film and series platforms in a single bundle.', detailWhatIsTitle: 'What is the Films Combo?', detailDesc1: 'The Films Combo brings together Netflix, Prime Video and HBO Max — the three best platforms for film and series enthusiasts.', detailDesc2: 'With this combo you have access to the best global cinema and series at an unbeatable price.', benefitsTitle: 'What you get', benefits: ['Netflix with the largest global catalog', 'Prime Video with Amazon Originals', 'HBO Max with the best series in the world', 'Savings vs subscribing separately'], howTitle: 'How it works', howSteps: ['Complete the combo order', 'Receive credentials for all 3 services by email', 'Access each platform and start watching'], faqTitle: 'Frequently asked questions', faqs: [{ q: 'Do I get access to all 3 services?', a: 'Yes! You receive separate credentials for Netflix, Prime Video and HBO Max.' }, { q: 'Is it better value than subscribing separately?', a: 'Definitely! The combo offers a special price for the full bundle.' }] },
      it: { name: 'Combo Film', shortDesc: 'Netflix + Prime Video + HBO Max. Il miglior combo per serie e film premiati.', detailTitle: 'Combo Film', detailSubtitle: 'Le migliori piattaforme di film e serie in un unico pacchetto.', detailWhatIsTitle: "Cos'è il Combo Film?", detailDesc1: 'Il Combo Film riunisce Netflix, Prime Video e HBO Max — le tre migliori piattaforme per chi ama film e serie di qualità.', detailDesc2: "Con questo combo hai accesso al meglio del cinema e delle serie mondiali a un prezzo imbattibile.", benefitsTitle: 'Cosa ricevi', benefits: ['Netflix con il più grande catalogo globale', 'Prime Video con Amazon Originals', 'HBO Max con le migliori serie al mondo', 'Risparmio rispetto a sottoscriverli separatamente'], howTitle: 'Come funziona', howSteps: ["Completa l'ordine del combo", 'Ricevi le credenziali per tutti e 3 i servizi via email', 'Accedi a ogni piattaforma e inizia a guardare'], faqTitle: 'Domande frequenti', faqs: [{ q: 'Ricevo accesso a tutti e 3 i servizi?', a: 'Sì! Ricevi credenziali separate per Netflix, Prime Video e HBO Max.' }, { q: 'Conviene rispetto a sottoscriverli separatamente?', a: 'Assolutamente! Il combo offre un prezzo speciale per il pacchetto completo.' }] }
    }
  },

  /* ===== SOCIAL MEDIA — INSTAGRAM ===== */
  'ig-followers-1k': {
    id: 'ig-followers-1k', category: 'social', emoji: '👥', badge: null, price: 10, oneTime: true, weeklySales: 47,
    translations: {
      pt: { name: '1K Seguidores Instagram', shortDesc: '1.000 seguidores reais para o seu perfil Instagram. Entrega rápida e segura.', detailTitle: '1.000 Seguidores Instagram', detailSubtitle: 'Aumente sua presença no Instagram com 1.000 seguidores.', detailWhatIsTitle: 'O que é esse serviço?', detailDesc1: 'Entregamos 1.000 seguidores para o seu perfil Instagram de forma rápida e discreta, sem necessidade de senha.', detailDesc2: 'Ideal para quem quer começar a crescer no Instagram ou dar um boost no perfil.', benefitsTitle: 'O que você recebe', benefits: ['1.000 seguidores para seu Instagram', 'Entrega rápida após confirmação', 'Sem necessidade de senha', 'Suporte incluído'], howTitle: 'Como funciona', howSteps: ['Finalize o pedido', 'Informe seu @username do Instagram', 'Receba os seguidores no prazo combinado'], faqTitle: 'Perguntas frequentes', faqs: [{ q: 'Preciso fornecer minha senha?', a: 'Não. Apenas o @ do seu perfil é necessário.' }, { q: 'Em quanto tempo entregam?', a: 'Normalmente dentro de 24 a 72 horas após a confirmação do pagamento.' }] },
      en: { name: '1K Instagram Followers', shortDesc: '1,000 real followers for your Instagram profile. Fast and secure delivery.', detailTitle: '1,000 Instagram Followers', detailSubtitle: 'Increase your Instagram presence with 1,000 followers.', detailWhatIsTitle: 'What is this service?', detailDesc1: 'We deliver 1,000 followers to your Instagram profile quickly and discreetly, no password required.', detailDesc2: 'Ideal for users who want to start growing on Instagram or give their profile a boost.', benefitsTitle: 'What you get', benefits: ['1,000 followers for your Instagram', 'Fast delivery after confirmation', 'No password required', 'Support included'], howTitle: 'How it works', howSteps: ['Complete the order', 'Provide your Instagram @username', 'Receive your followers within the agreed timeframe'], faqTitle: 'Frequently asked questions', faqs: [{ q: 'Do I need to provide my password?', a: 'No. Only your profile @ is required.' }, { q: 'How long does delivery take?', a: 'Usually within 24 to 72 hours after payment confirmation.' }] },
      it: { name: '1K Follower Instagram', shortDesc: '1.000 follower reali per il tuo profilo Instagram. Consegna rapida e sicura.', detailTitle: '1.000 Follower Instagram', detailSubtitle: 'Aumenta la tua presenza su Instagram con 1.000 follower.', detailWhatIsTitle: "Cos'è questo servizio?", detailDesc1: 'Consegniamo 1.000 follower al tuo profilo Instagram in modo rapido e discreto, senza necessità di password.', detailDesc2: 'Ideale per chi vuole iniziare a crescere su Instagram o dare una spinta al proprio profilo.', benefitsTitle: 'Cosa ricevi', benefits: ['1.000 follower per il tuo Instagram', 'Consegna rapida dopo la conferma', 'Nessuna password richiesta', 'Supporto incluso'], howTitle: 'Come funziona', howSteps: ["Completa l'ordine", 'Fornisci il tuo @username Instagram', 'Ricevi i follower entro i tempi concordati'], faqTitle: 'Domande frequenti', faqs: [{ q: 'Devo fornire la mia password?', a: 'No. È necessario solo il @ del tuo profilo.' }, { q: 'Quanto tempo richiede la consegna?', a: 'Di solito entro 24-72 ore dalla conferma del pagamento.' }] }
    }
  },
  'ig-followers-3k': {
    id: 'ig-followers-3k', category: 'social', emoji: '👥', badge: null, price: 20, oneTime: true, weeklySales: 38,
    translations: {
      pt: { name: '3K Seguidores Instagram', shortDesc: '3.000 seguidores reais para o seu perfil Instagram. Melhor custo-benefício.', detailTitle: '3.000 Seguidores Instagram', detailSubtitle: 'Dê um salto maior no crescimento do seu Instagram.', detailWhatIsTitle: 'O que é esse serviço?', detailDesc1: 'Entregamos 3.000 seguidores para o seu perfil Instagram de forma rápida e discreta.', detailDesc2: 'Ideal para quem quer um crescimento mais expressivo em poucos dias.', benefitsTitle: 'O que você recebe', benefits: ['3.000 seguidores para seu Instagram', 'Entrega rápida após confirmação', 'Sem necessidade de senha', 'Suporte incluído'], howTitle: 'Como funciona', howSteps: ['Finalize o pedido', 'Informe seu @username do Instagram', 'Receba os seguidores no prazo combinado'], faqTitle: 'Perguntas frequentes', faqs: [{ q: 'Preciso fornecer minha senha?', a: 'Não. Apenas o @ do seu perfil é necessário.' }, { q: 'Em quanto tempo entregam?', a: 'Normalmente dentro de 24 a 72 horas após a confirmação.' }] },
      en: { name: '3K Instagram Followers', shortDesc: '3,000 real followers for your Instagram profile. Best value for growth.', detailTitle: '3,000 Instagram Followers', detailSubtitle: 'Make a bigger leap in your Instagram growth.', detailWhatIsTitle: 'What is this service?', detailDesc1: 'We deliver 3,000 followers to your Instagram profile quickly and discreetly.', detailDesc2: 'Ideal for users who want more significant growth in a few days.', benefitsTitle: 'What you get', benefits: ['3,000 followers for your Instagram', 'Fast delivery after confirmation', 'No password required', 'Support included'], howTitle: 'How it works', howSteps: ['Complete the order', 'Provide your Instagram @username', 'Receive your followers within the agreed timeframe'], faqTitle: 'Frequently asked questions', faqs: [{ q: 'Do I need to provide my password?', a: 'No. Only your profile @ is required.' }, { q: 'How long does delivery take?', a: 'Usually within 24 to 72 hours after confirmation.' }] },
      it: { name: '3K Follower Instagram', shortDesc: '3.000 follower reali per il tuo profilo Instagram. Miglior rapporto qualità-prezzo.', detailTitle: '3.000 Follower Instagram', detailSubtitle: 'Fai un salto più grande nella crescita del tuo Instagram.', detailWhatIsTitle: "Cos'è questo servizio?", detailDesc1: 'Consegniamo 3.000 follower al tuo profilo Instagram in modo rapido e discreto.', detailDesc2: 'Ideale per chi vuole una crescita più significativa in pochi giorni.', benefitsTitle: 'Cosa ricevi', benefits: ['3.000 follower per il tuo Instagram', 'Consegna rapida dopo la conferma', 'Nessuna password richiesta', 'Supporto incluso'], howTitle: 'Come funziona', howSteps: ["Completa l'ordine", 'Fornisci il tuo @username Instagram', 'Ricevi i follower entro i tempi concordati'], faqTitle: 'Domande frequenti', faqs: [{ q: 'Devo fornire la mia password?', a: 'No. È necessario solo il @ del tuo profilo.' }, { q: 'Quanto tempo richiede la consegna?', a: 'Di solito entro 24-72 ore dalla conferma.' }] }
    }
  },
  'ig-followers-5k': {
    id: 'ig-followers-5k', category: 'social', emoji: '👥', badge: 'bestvalue', price: 40, oneTime: true, weeklySales: 26,
    translations: {
      pt: { name: '5K Seguidores Instagram', shortDesc: '5.000 seguidores reais para crescimento expressivo no Instagram.', detailTitle: '5.000 Seguidores Instagram', detailSubtitle: 'O pacote mais completo para crescer no Instagram rapidamente.', detailWhatIsTitle: 'O que é esse serviço?', detailDesc1: 'Entregamos 5.000 seguidores — nosso pacote de maior volume para crescimento acelerado no Instagram.', detailDesc2: 'Ideal para criadores, marcas e influenciadores que querem crescimento rápido e expressivo.', benefitsTitle: 'O que você recebe', benefits: ['5.000 seguidores para seu Instagram', 'Entrega rápida após confirmação', 'Sem necessidade de senha', 'Melhor custo por seguidor'], howTitle: 'Como funciona', howSteps: ['Finalize o pedido', 'Informe seu @username do Instagram', 'Receba os seguidores no prazo combinado'], faqTitle: 'Perguntas frequentes', faqs: [{ q: 'Preciso fornecer minha senha?', a: 'Não. Apenas o @ do seu perfil é necessário.' }, { q: 'Em quanto tempo entregam?', a: 'Normalmente dentro de 48 a 96 horas após a confirmação.' }] },
      en: { name: '5K Instagram Followers', shortDesc: '5,000 real followers for significant growth on Instagram.', detailTitle: '5,000 Instagram Followers', detailSubtitle: 'Our most complete package for rapid Instagram growth.', detailWhatIsTitle: 'What is this service?', detailDesc1: 'We deliver 5,000 followers to your Instagram — our highest volume package for accelerated growth.', detailDesc2: 'Ideal for creators, brands and influencers who want fast and significant growth.', benefitsTitle: 'What you get', benefits: ['5,000 followers for your Instagram', 'Fast delivery after confirmation', 'No password required', 'Best cost per follower'], howTitle: 'How it works', howSteps: ['Complete the order', 'Provide your Instagram @username', 'Receive your followers within the agreed timeframe'], faqTitle: 'Frequently asked questions', faqs: [{ q: 'Do I need to provide my password?', a: 'No. Only your profile @ is required.' }, { q: 'How long does delivery take?', a: 'Usually within 48 to 96 hours after confirmation.' }] },
      it: { name: '5K Follower Instagram', shortDesc: '5.000 follower reali per una crescita significativa su Instagram.', detailTitle: '5.000 Follower Instagram', detailSubtitle: 'Il nostro pacchetto più completo per una crescita rapida su Instagram.', detailWhatIsTitle: "Cos'è questo servizio?", detailDesc1: 'Consegniamo 5.000 follower al tuo Instagram — il nostro pacchetto di maggior volume per crescita accelerata.', detailDesc2: 'Ideale per creator, brand e influencer che vogliono una crescita rapida e significativa.', benefitsTitle: 'Cosa ricevi', benefits: ['5.000 follower per il tuo Instagram', 'Consegna rapida dopo la conferma', 'Nessuna password richiesta', 'Miglior costo per follower'], howTitle: 'Come funziona', howSteps: ["Completa l'ordine", 'Fornisci il tuo @username Instagram', 'Ricevi i follower entro i tempi concordati'], faqTitle: 'Domande frequenti', faqs: [{ q: 'Devo fornire la mia password?', a: 'No. È necessario solo il @ del tuo profilo.' }, { q: 'Quanto tempo richiede la consegna?', a: 'Di solito entro 48-96 ore dalla conferma.' }] }
    }
  },
  'ig-likes-1k': {
    id: 'ig-likes-1k', category: 'social', emoji: '❤️', badge: null, price: 5, oneTime: true, weeklySales: 41,
    translations: {
      pt: { name: '1K Likes Instagram', shortDesc: '1.000 curtidas reais para fotos ou Reels do seu Instagram.', detailTitle: '1.000 Likes Instagram', detailSubtitle: 'Aumente o engajamento das suas publicações.', detailWhatIsTitle: 'O que é esse serviço?', detailDesc1: 'Entregamos 1.000 curtidas reais para uma publicação do seu Instagram — foto, vídeo ou Reel.', detailDesc2: 'Aumenta o engajamento da publicação e melhora seu alcance orgânico.', benefitsTitle: 'O que você recebe', benefits: ['1.000 curtidas para sua publicação', 'Entrega rápida após confirmação', 'Sem necessidade de senha', 'Melhora o alcance orgânico'], howTitle: 'Como funciona', howSteps: ['Finalize o pedido', 'Informe o link da publicação', 'Receba as curtidas no prazo combinado'], faqTitle: 'Perguntas frequentes', faqs: [{ q: 'Funciona para Reels também?', a: 'Sim, funciona para fotos, vídeos e Reels.' }, { q: 'Preciso de senha?', a: 'Não. Apenas o link público da publicação.' }] },
      en: { name: '1K Instagram Likes', shortDesc: '1,000 real likes for photos or Reels on your Instagram.', detailTitle: '1,000 Instagram Likes', detailSubtitle: 'Increase the engagement of your posts.', detailWhatIsTitle: 'What is this service?', detailDesc1: 'We deliver 1,000 real likes to an Instagram post — photo, video or Reel.', detailDesc2: 'Boosts post engagement and improves your organic reach.', benefitsTitle: 'What you get', benefits: ['1,000 likes for your post', 'Fast delivery after confirmation', 'No password required', 'Improves organic reach'], howTitle: 'How it works', howSteps: ['Complete the order', 'Provide the post link', 'Receive your likes within the agreed timeframe'], faqTitle: 'Frequently asked questions', faqs: [{ q: 'Does it work for Reels too?', a: 'Yes, it works for photos, videos and Reels.' }, { q: 'Do I need a password?', a: 'No. Just the public link of the post.' }] },
      it: { name: '1K Like Instagram', shortDesc: '1.000 like reali per foto o Reel del tuo Instagram.', detailTitle: '1.000 Like Instagram', detailSubtitle: 'Aumenta il coinvolgimento delle tue pubblicazioni.', detailWhatIsTitle: "Cos'è questo servizio?", detailDesc1: 'Consegniamo 1.000 like reali a una pubblicazione Instagram — foto, video o Reel.', detailDesc2: 'Aumenta il coinvolgimento della pubblicazione e migliora la tua portata organica.', benefitsTitle: 'Cosa ricevi', benefits: ['1.000 like per la tua pubblicazione', 'Consegna rapida dopo la conferma', 'Nessuna password richiesta', 'Migliora la portata organica'], howTitle: 'Come funziona', howSteps: ["Completa l'ordine", 'Fornisci il link della pubblicazione', 'Ricevi i like entro i tempi concordati'], faqTitle: 'Domande frequenti', faqs: [{ q: 'Funziona anche per i Reel?', a: 'Sì, funziona per foto, video e Reel.' }, { q: 'Serve la password?', a: 'No. Basta il link pubblico della pubblicazione.' }] }
    }
  },
  'ig-likes-3k': {
    id: 'ig-likes-3k', category: 'social', emoji: '❤️', badge: null, price: 10, oneTime: true, weeklySales: 19,
    translations: {
      pt: { name: '3K Likes Instagram', shortDesc: '3.000 curtidas reais para publicações do seu Instagram.', detailTitle: '3.000 Likes Instagram', detailSubtitle: 'Impulsione o engajamento com 3.000 curtidas.', detailWhatIsTitle: 'O que é esse serviço?', detailDesc1: 'Entregamos 3.000 curtidas reais para uma publicação do seu Instagram.', detailDesc2: 'Maior engajamento e maior alcance orgânico para seu conteúdo.', benefitsTitle: 'O que você recebe', benefits: ['3.000 curtidas para sua publicação', 'Entrega rápida após confirmação', 'Sem necessidade de senha', 'Melhora o alcance orgânico'], howTitle: 'Como funciona', howSteps: ['Finalize o pedido', 'Informe o link da publicação', 'Receba as curtidas no prazo combinado'], faqTitle: 'Perguntas frequentes', faqs: [{ q: 'Funciona para Reels?', a: 'Sim, funciona para fotos, vídeos e Reels.' }, { q: 'Preciso de senha?', a: 'Não. Apenas o link da publicação.' }] },
      en: { name: '3K Instagram Likes', shortDesc: '3,000 real likes for your Instagram posts.', detailTitle: '3,000 Instagram Likes', detailSubtitle: 'Boost engagement with 3,000 likes.', detailWhatIsTitle: 'What is this service?', detailDesc1: 'We deliver 3,000 real likes to an Instagram post.', detailDesc2: 'More engagement, more organic reach for your content.', benefitsTitle: 'What you get', benefits: ['3,000 likes for your post', 'Fast delivery after confirmation', 'No password required', 'Improves organic reach'], howTitle: 'How it works', howSteps: ['Complete the order', 'Provide the post link', 'Receive your likes within the agreed timeframe'], faqTitle: 'Frequently asked questions', faqs: [{ q: 'Does it work for Reels?', a: 'Yes, it works for photos, videos and Reels.' }, { q: 'Do I need a password?', a: 'No. Just the post link.' }] },
      it: { name: '3K Like Instagram', shortDesc: '3.000 like reali per le tue pubblicazioni Instagram.', detailTitle: '3.000 Like Instagram', detailSubtitle: 'Potenzia il coinvolgimento con 3.000 like.', detailWhatIsTitle: "Cos'è questo servizio?", detailDesc1: 'Consegniamo 3.000 like reali a una pubblicazione Instagram.', detailDesc2: 'Più coinvolgimento e più portata organica per i tuoi contenuti.', benefitsTitle: 'Cosa ricevi', benefits: ['3.000 like per la tua pubblicazione', 'Consegna rapida dopo la conferma', 'Nessuna password richiesta', 'Migliora la portata organica'], howTitle: 'Come funziona', howSteps: ["Completa l'ordine", 'Fornisci il link della pubblicazione', 'Ricevi i like entro i tempi concordati'], faqTitle: 'Domande frequenti', faqs: [{ q: 'Funziona per i Reel?', a: 'Sì, funziona per foto, video e Reel.' }, { q: 'Serve la password?', a: 'No. Basta il link della pubblicazione.' }] }
    }
  },
  'ig-likes-5k': {
    id: 'ig-likes-5k', category: 'social', emoji: '❤️', badge: 'bestvalue', price: 25, oneTime: true, weeklySales: 13,
    translations: {
      pt: { name: '5K Likes Instagram', shortDesc: '5.000 curtidas reais — melhor custo-benefício para publicações do Instagram.', detailTitle: '5.000 Likes Instagram', detailSubtitle: 'O maior pacote de curtidas com o melhor custo-benefício.', detailWhatIsTitle: 'O que é esse serviço?', detailDesc1: 'Entregamos 5.000 curtidas reais — nosso pacote de maior volume para máximo impacto nas suas publicações.', detailDesc2: 'Ideal para publicações que você quer destacar com alto engajamento.', benefitsTitle: 'O que você recebe', benefits: ['5.000 curtidas para sua publicação', 'Entrega rápida após confirmação', 'Sem necessidade de senha', 'Melhor custo por curtida'], howTitle: 'Como funciona', howSteps: ['Finalize o pedido', 'Informe o link da publicação', 'Receba as curtidas no prazo combinado'], faqTitle: 'Perguntas frequentes', faqs: [{ q: 'Funciona para Reels?', a: 'Sim, funciona para fotos, vídeos e Reels.' }, { q: 'Preciso de senha?', a: 'Não. Apenas o link da publicação.' }] },
      en: { name: '5K Instagram Likes', shortDesc: '5,000 real likes — best value for your Instagram posts.', detailTitle: '5,000 Instagram Likes', detailSubtitle: 'Our highest volume likes package for maximum impact.', detailWhatIsTitle: 'What is this service?', detailDesc1: 'We deliver 5,000 real likes — our highest volume package for maximum impact on your posts.', detailDesc2: 'Ideal for posts you want to highlight with high engagement.', benefitsTitle: 'What you get', benefits: ['5,000 likes for your post', 'Fast delivery after confirmation', 'No password required', 'Best cost per like'], howTitle: 'How it works', howSteps: ['Complete the order', 'Provide the post link', 'Receive your likes within the agreed timeframe'], faqTitle: 'Frequently asked questions', faqs: [{ q: 'Does it work for Reels?', a: 'Yes, it works for photos, videos and Reels.' }, { q: 'Do I need a password?', a: 'No. Just the post link.' }] },
      it: { name: '5K Like Instagram', shortDesc: '5.000 like reali — miglior rapporto qualità-prezzo per le pubblicazioni Instagram.', detailTitle: '5.000 Like Instagram', detailSubtitle: 'Il nostro pacchetto di like di maggior volume per il massimo impatto.', detailWhatIsTitle: "Cos'è questo servizio?", detailDesc1: 'Consegniamo 5.000 like reali — il nostro pacchetto di maggior volume per il massimo impatto sulle tue pubblicazioni.', detailDesc2: 'Ideale per pubblicazioni che vuoi mettere in evidenza con alto coinvolgimento.', benefitsTitle: 'Cosa ricevi', benefits: ['5.000 like per la tua pubblicazione', 'Consegna rapida dopo la conferma', 'Nessuna password richiesta', 'Miglior costo per like'], howTitle: 'Come funziona', howSteps: ["Completa l'ordine", 'Fornisci il link della pubblicazione', 'Ricevi i like entro i tempi concordati'], faqTitle: 'Domande frequenti', faqs: [{ q: 'Funziona per i Reel?', a: 'Sì, funziona per foto, video e Reel.' }, { q: 'Serve la password?', a: 'No. Basta il link della pubblicazione.' }] }
    }
  },
  'ig-views-1k': {
    id: 'ig-views-1k', category: 'social', emoji: '👁️', badge: null, price: 10, oneTime: true, weeklySales: 31,
    translations: {
      pt: { name: '1K Views Instagram', shortDesc: '1.000 visualizações reais para Reels, Stories ou vídeos do Instagram.', detailTitle: '1.000 Views Instagram', detailSubtitle: 'Aumente as visualizações dos seus vídeos no Instagram.', detailWhatIsTitle: 'O que é esse serviço?', detailDesc1: 'Entregamos 1.000 visualizações reais para um Reel, Story ou vídeo do seu Instagram.', detailDesc2: 'Mais visualizações aumentam a visibilidade do seu conteúdo e favorecem o algoritmo.', benefitsTitle: 'O que você recebe', benefits: ['1.000 views para seu conteúdo', 'Funciona para Reels, Stories e vídeos', 'Sem necessidade de senha', 'Entrega rápida após confirmação'], howTitle: 'Como funciona', howSteps: ['Finalize o pedido', 'Informe o link do vídeo/Reel', 'Receba as views no prazo combinado'], faqTitle: 'Perguntas frequentes', faqs: [{ q: 'Funciona para Stories?', a: 'Sim, funciona para Reels, Stories e vídeos normais.' }, { q: 'Preciso de senha?', a: 'Não. Apenas o link do conteúdo.' }] },
      en: { name: '1K Instagram Views', shortDesc: '1,000 real views for Reels, Stories or videos on Instagram.', detailTitle: '1,000 Instagram Views', detailSubtitle: 'Increase the views on your Instagram videos.', detailWhatIsTitle: 'What is this service?', detailDesc1: 'We deliver 1,000 real views to a Reel, Story or video on your Instagram.', detailDesc2: 'More views increase your content visibility and favor the algorithm.', benefitsTitle: 'What you get', benefits: ['1,000 views for your content', 'Works for Reels, Stories and videos', 'No password required', 'Fast delivery after confirmation'], howTitle: 'How it works', howSteps: ['Complete the order', 'Provide the video/Reel link', 'Receive your views within the agreed timeframe'], faqTitle: 'Frequently asked questions', faqs: [{ q: 'Does it work for Stories?', a: 'Yes, it works for Reels, Stories and regular videos.' }, { q: 'Do I need a password?', a: 'No. Just the content link.' }] },
      it: { name: '1K Visualizzazioni Instagram', shortDesc: '1.000 visualizzazioni reali per Reel, Storie o video su Instagram.', detailTitle: '1.000 Visualizzazioni Instagram', detailSubtitle: 'Aumenta le visualizzazioni dei tuoi video su Instagram.', detailWhatIsTitle: "Cos'è questo servizio?", detailDesc1: "Consegniamo 1.000 visualizzazioni reali a un Reel, Storia o video del tuo Instagram.", detailDesc2: "Più visualizzazioni aumentano la visibilità del tuo contenuto e favoriscono l'algoritmo.", benefitsTitle: 'Cosa ricevi', benefits: ['1.000 visualizzazioni per il tuo contenuto', 'Funziona per Reel, Storie e video', 'Nessuna password richiesta', 'Consegna rapida dopo la conferma'], howTitle: 'Come funziona', howSteps: ["Completa l'ordine", 'Fornisci il link del video/Reel', 'Ricevi le visualizzazioni entro i tempi concordati'], faqTitle: 'Domande frequenti', faqs: [{ q: 'Funziona anche per le Storie?', a: 'Sì, funziona per Reel, Storie e video normali.' }, { q: 'Serve la password?', a: 'No. Basta il link del contenuto.' }] }
    }
  }
};

/* ============================================================
   Catalog Helpers
   ============================================================ */
function kdGetLang() {
  return localStorage.getItem('kd_lang') || 'pt';
}
function kdFormatPrice(value) {
  return value + '€';
}
function kdBillingLabel(lang) {
  lang = lang || kdGetLang();
  return { pt: '/ mês', en: '/ month', it: '/ mese' }[lang] || '/ month';
}
function kdCategoryLabel(category, lang) {
  lang = lang || kdGetLang();
  const labels = {
    ai:           { pt: 'IA', en: 'AI Tools', it: 'Strumenti AI' },
    design:       { pt: 'Design', en: 'Design', it: 'Design' },
    streaming:    { pt: 'Streaming', en: 'Streaming', it: 'Streaming' },
    productivity: { pt: 'Produtividade', en: 'Productivity', it: 'Produttività' },
    social:       { pt: 'Social Media', en: 'Social Media', it: 'Social Media' }
  };
  return labels[category]?.[lang] || category;
}

/* ============================================================
   Render: Products Page
   ============================================================ */
function renderProductsPage() {
  const aiEl           = document.getElementById('aiProducts');
  const streamingEl    = document.getElementById('streamingProducts');
  const designEl       = document.getElementById('designProducts');
  const productivityEl = document.getElementById('productivityProducts');
  const socialEl       = document.getElementById('socialProducts');
  if (!aiEl && !streamingEl && !designEl && !productivityEl && !socialEl) return;

  const lang = kdGetLang();
  const groups = { ai: aiEl, streaming: streamingEl, design: designEl, productivity: productivityEl, social: socialEl };
  Object.values(groups).forEach(el => { if (el) el.innerHTML = ''; });

  const badgeMap = {
    hot:        { pt: 'Hot',           en: 'Hot',          it: 'Hot' },
    new:        { pt: 'Novo',          en: 'New',          it: 'Nuovo' },
    popular:    { pt: 'Popular',       en: 'Popular',      it: 'Popolare' },
    bestvalue:  { pt: 'Melhor Custo',  en: 'Best Value',   it: 'Miglior Valore' },
    bestseller: { pt: 'Mais Vendido',  en: 'Best Seller',  it: 'Più Venduto' },
    soldout:    { pt: 'Esgotado',      en: 'Sold Out',     it: 'Esaurito' },
    promo:      { pt: 'Promo',         en: 'Promo',        it: 'Promo' }
  };

  const t_ui      = i18n[lang] || i18n.pt;
  const btnDetails = t_ui['dynamic-details-btn'] || 'Detalhes';
  const btnBuy     = t_ui['dynamic-buy-btn']     || 'Comprar';
  const btnSoldOut = t_ui['dynamic-soldout-btn'] || 'Esgotado';

  function buildCard(product) {
    const t         = product.translations[lang] || product.translations.pt;
    const isSoldOut = !!product.soldOut;
    const isCombo   = !!product.isCombo;

    const badgeLabel = isSoldOut
      ? (badgeMap.soldout[lang] || 'Esgotado')
      : (product.badge ? (badgeMap[product.badge]?.[lang] || '') : '');
    const badgeClass = 'product-card__badge' + (isSoldOut ? ' product-card__badge--soldout' : isCombo ? ' product-card__badge--combo' : '');
    const badgeHtml  = badgeLabel ? `<div class="${badgeClass}">${badgeLabel}</div>` : '';

    const cardClass = 'product-card'
      + (isSoldOut ? ' product-card--soldout' : '')
      + (isCombo   ? ' product-card--combo'   : '');

    const headerContent = product.image
      ? `<img class="product-card__img" src="${product.image}" alt="${t.name}"
             onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
         <div class="product-card__emoji" style="display:none">${product.emoji}</div>`
      : `<div class="product-card__emoji">${product.emoji}</div>`;

    const buyHtml = isSoldOut
      ? `<button class="btn btn-outline btn-sm" disabled style="opacity:.45;cursor:not-allowed;">${btnSoldOut}</button>`
      : `<a href="checkout.html?product=${product.id}" class="btn btn-primary btn-sm">${btnBuy}</a>`;

    const billingSpan = product.oneTime ? '' : `<span>${kdBillingLabel(lang)}</span>`;

    const card = document.createElement('div');
    card.className    = cardClass;
    card.dataset.category = product.category;
    card.innerHTML = `
      <div class="product-card__header">
        ${headerContent}
        <div class="product-card__meta">
          <h3>${t.name}</h3>
          <span>${kdCategoryLabel(product.category, lang)}</span>
        </div>
        ${badgeHtml}
      </div>
      <div class="product-card__body">
        <p>${t.shortDesc}</p>
        ${product.weeklySales ? `<div class="product-card__sales">🔥 ${product.weeklySales} ${t_ui['weekly-sales-label'] || 'vendas esta semana'}</div>` : ''}
        <div class="product-card__price">
          <strong>${kdFormatPrice(product.price)}</strong>${billingSpan}
        </div>
        <div class="product-card__actions">
          <a href="product-detail.html?id=${product.id}" class="btn btn-outline btn-sm">${btnDetails}</a>
          ${buyHtml}
        </div>
      </div>`;
    return card;
  }

  // Render combos first (they appear at top of streaming)
  Object.values(KD_PRODUCTS).filter(p => p.isCombo).forEach(product => {
    const target = groups[product.category];
    if (target) target.appendChild(buildCard(product));
  });

  // Render all non-combo products
  Object.values(KD_PRODUCTS).filter(p => !p.isCombo).forEach(product => {
    const target = groups[product.category];
    if (target) target.appendChild(buildCard(product));
  });

  // Re-apply active filter after re-render
  const activeFilter = document.querySelector('.filter-btn.active');
  if (activeFilter) {
    const cat = activeFilter.dataset.filter;
    document.querySelectorAll('.product-card[data-category]').forEach(card => {
      card.parentElement.style.display =
        (cat === 'all' || card.dataset.category === cat) ? '' : 'none';
    });
  }
}

/* ============================================================
   Render: Product Detail Page
   ============================================================ */
function renderProductDetailPage() {
  if (!document.getElementById('detailTitle')) return;

  const params  = new URLSearchParams(window.location.search);
  const id      = params.get('id') || 'chatgpt-pro';
  const product = KD_PRODUCTS[id];
  if (!product) return;

  const lang = kdGetLang();
  const t    = product.translations[lang] || product.translations.pt;

  const setText = (elId, value) => {
    const el = document.getElementById(elId);
    if (el) el.textContent = value;
  };

  document.title = t.name + ' — KitsDigitalia';
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', t.shortDesc);

  setText('detailBreadcrumbName', t.name);
  setText('detailTitle',          t.detailTitle);
  setText('detailSubtitle',       t.detailSubtitle);
  setText('detailWhatIsTitle',    t.detailWhatIsTitle);
  setText('detailDesc1',          t.detailDesc1);
  setText('detailDesc2',          t.detailDesc2);
  setText('detailBenefitsTitle',  t.benefitsTitle);
  setText('detailHowTitle',       t.howTitle);
  setText('detailFaqTitle',       t.faqTitle);

  const catBadgeEl = document.getElementById('detailCategoryBadge');
  if (catBadgeEl) catBadgeEl.textContent = product.emoji + ' ' + kdCategoryLabel(product.category, lang);

  const benefitsList = document.getElementById('detailBenefitsList');
  if (benefitsList) benefitsList.innerHTML = t.benefits.map(b => `<li>${b}</li>`).join('');

  const howSteps = document.getElementById('detailHowSteps');
  if (howSteps) howSteps.innerHTML = t.howSteps.map((step, i) => `
    <div class="step"><div class="step__num">${i + 1}</div><div class="step__text"><p>${step}</p></div></div>`).join('');

  const faqList = document.getElementById('detailFaqList');
  if (faqList) faqList.innerHTML = t.faqs.map(faq => `
    <div class="faq-item">
      <button class="faq-question"><span>${faq.q}</span><span class="faq-icon">+</span></button>
      <div class="faq-answer">${faq.a}</div>
    </div>`).join('');

  // Sidebar card
  setText('detailMainPrice',  kdFormatPrice(product.price));
  setText('detailPricePeriod', kdBillingLabel(lang));
  const buyBtn = document.getElementById('detailBuyBtn');
  if (buyBtn) {
    buyBtn.href = 'checkout.html?product=' + product.id;
    buyBtn.textContent = lang === 'it' ? '🚀 Acquista via WhatsApp ora' : lang === 'en' ? '🚀 Buy via WhatsApp now' : '🚀 Comprar via WhatsApp agora';
  }

  const hintEl = document.getElementById('detailActivationHint');
  if (hintEl) {
    hintEl.textContent = i18n[lang]?.['detail-activation-hint'] || '⚡ Ativação rápida após pagamento';
  }

  const askBtn = document.getElementById('detailAskBtn');
  if (askBtn) {
    const msg = lang === 'it'
      ? `Ciao, voglio fare una domanda su ${t.name}.`
      : lang === 'en'
      ? `Hello, I have a question about ${t.name}.`
      : `Olá, quero tirar uma dúvida sobre ${t.name}.`;
    askBtn.href = 'https://wa.me/393716804204?text=' + encodeURIComponent(msg);
    askBtn.textContent = lang === 'it' ? '💬 Fai una domanda' : lang === 'en' ? '💬 Ask a Question' : '💬 Perguntar';
  }

  // Re-bind FAQ accordion on newly rendered items
  document.querySelectorAll('#detailFaqList .faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('#detailFaqList .faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ============================================================
   Render: Checkout Select
   ============================================================ */
function renderCheckoutProducts() {
  const productSelect = document.getElementById('product');
  if (!productSelect) return;

  const lang = kdGetLang();
  productSelect.innerHTML = '';

  ['ai', 'streaming', 'design', 'productivity', 'social'].forEach(category => {
    const products = Object.values(KD_PRODUCTS).filter(p => p.category === category && !p.soldOut);
    if (!products.length) return;
    const group = document.createElement('optgroup');
    group.label = kdCategoryLabel(category, lang);
    products.forEach(product => {
      const t = product.translations[lang] || product.translations.pt;
      const option = document.createElement('option');
      const billing = product.oneTime ? '' : kdBillingLabel(lang);
      option.value = product.id;
      option.textContent = t.name + ' — ' + kdFormatPrice(product.price) + billing;
      group.appendChild(option);
    });
    productSelect.appendChild(group);
  });

  const params = new URLSearchParams(window.location.search);
  const requested = params.get('product');
  if (requested && KD_PRODUCTS[requested] && !KD_PRODUCTS[requested].soldOut) {
    productSelect.value = requested;
  }
}

/* ============================================================
   Checkout: Dynamic Order Summary
   ============================================================ */
function updateOrderSummary() {
  const productEl = document.getElementById('product');
  if (!productEl) return;

  const lang      = kdGetLang();
  const productId = productEl.value;
  const product   = KD_PRODUCTS[productId];
  if (!product) return;

  const t          = product.translations[lang] || product.translations.pt;
  const basePrice  = product.price;
  const method     = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'pix';
  const isBinance  = method === 'binance';
  const discount   = isBinance ? Math.round(basePrice * 0.07 * 100) / 100 : 0;
  const finalPrice = Math.round((basePrice - discount) * 100) / 100;

  const nameEl     = document.getElementById('orderItemName');
  const priceEl    = document.getElementById('orderItemPrice');
  const subtotalEl = document.getElementById('orderSubtotal');
  const discountEl = document.getElementById('orderDiscount');
  const totalEl    = document.getElementById('orderTotal');
  const discRowEl  = document.getElementById('orderDiscountRow');

  if (nameEl)     nameEl.textContent    = product.emoji + ' ' + t.name;
  if (priceEl)    priceEl.textContent   = kdFormatPrice(basePrice);
  if (subtotalEl) subtotalEl.textContent = kdFormatPrice(basePrice);
  if (discRowEl)  discRowEl.style.display = isBinance ? 'flex' : 'none';
  if (discountEl) discountEl.textContent  = isBinance ? '-' + kdFormatPrice(discount) : '';
  if (totalEl)    totalEl.textContent    = kdFormatPrice(finalPrice);
}

/* ============================================================
   i18n — Translation Data
   ============================================================ */
const i18n = {
  pt: {
    /* Navbar */
    'nav-login':              'Já é membro? Entrar →',
    /* Hero */
    'hero-headline':          'Isso não é para todo mundo.',
    'hero-headline-accent':   'Só para quem entende como pagar menos e ter mais.',
    'hero-sub':               'Quem entra, não volta para o preço cheio. Você está vendo preços que não aparecem para todo mundo.',
    'hero-cta':               'Entrar agora',
    'hero-cta2':              'Ver o Que Está Dentro',
    'hero-trust-1':           '🔒 Seguro e privado',
    'hero-trust-2':           'Suporte via WhatsApp',
    'hero-trust-3':           'Sem spam. Nunca.',
    'scarcity-live':          '⚡ Acesso disponível — finalize pelo WhatsApp',
    /* Stats */
    'stat-tools':             'Ferramentas Premium',
    'stat-savings':           'Suporte WhatsApp',
    'stat-members':           'Multi-idioma',
    'stat-rating':            'Acesso Seguro',
    /* Preview */
    'preview-title':          'O Que Está Esperando',
    'preview-title-accent':   'Por Você',
    'preview-sub':            'Membros acessam estas ferramentas a preços que não são divulgados publicamente. Aqui está só uma amostra — o resto está por trás da porta.',
    'preview-more':           'Ver mais →',
    'preview-unlock-sub':     'Você está vendo uma fração do que está dentro. Membros têm acesso completo a todas as ferramentas e preços exclusivos.',
    'preview-unlock-btn':     '🔓 Desbloquear Acesso Completo',
    /* Capacity */
    'capacity-label':         '⚡ Atendimento via WhatsApp',
    'capacity-pct':           'Disponível',
    'capacity-spots':         'Resposta rápida em dias úteis',
    'capacity-zero':          '',
    'capacity-total':         '',
    /* Steps */
    'steps-title':            'Mais Simples do Que',
    'steps-title-accent':     'Você Imagina',
    'steps-sub':              'Três passos. Cinco minutos. Depois você está dentro.',
    'step1-title':            'Crie Sua Conta',
    'step1-body':             'Clique em Desbloquear Acesso, insira seu email e uma senha. Sem cartão de crédito para começar.',
    'step2-title':            'Escolha Suas Ferramentas',
    'step2-body':             'Navegue pelo catálogo exclusivo e escolha o que precisa. Compre uma ou várias — você decide.',
    'step3-title':            'Acesso Instantâneo',
    'step3-body':             'Pague e receba suas credenciais por email em minutos. Use imediatamente.',
    'steps-cta':              'Começar Agora →',
    /* Testimonials */
    'testimonials-title':     'O Que os',
    'testimonials-title-accent': 'Membros Dizem',
    'testimonials-sub':       'O que nossos clientes dizem sobre a experiência.',
    /* Final CTA */
    'final-scarcity':         '✅ Acesso disponível agora',
    'final-title':            'Pare de Pagar',
    'final-title-accent':     'Preço Cheio.',
    'final-title-2':          'Junte-se aos Que Não Pagam.',
    'final-sub':              'Crie sua conta gratuita em 60 segundos e veja tudo que está esperando por você.',
    'final-btn':              '🔓 Desbloquear Acesso Agora',
    'final-trust-1':          '🔒 Login seguro',
    'final-trust-2':          'Sem spam',
    'final-trust-3':          'Cancele quando quiser',
    'footer-login':           'Login de Membro',
    /* Login page */
    'login-title':            'Acesso Privado',
    'login-sub':              'Entrada liberada apenas para membros',
    'login-google':           'Continuar com Google',
    'login-or':               'ou entre com email',
    'login-email-label':      'Endereço de Email',
    'login-pw-label':         'Senha',
    'login-forgot':           'Esqueceu a senha?',
    'login-remember':         'Mantenha-me conectado',
    'login-btn':              'Solicitar acesso →',
    'login-trust-1':          '🔒 Acesso seguro',
    'login-trust-2':          'Sem spam. Nunca.',
    'login-trust-3':          'Cancele quando quiser',
    'login-no-account':       'Ainda não é membro?',
    'login-see-inside':       'Veja o que está dentro →',
    'login-back':             '← Voltar para o início',
    'login-footer':           'KitsDigitalia',
    /* ---- Shared inner pages ---- */
    'nav-home':              'Home',
    'nav-products':          'Produtos',
    'nav-about':             'Sobre',
    'nav-contact':           'Contato',
    'nav-signout':           'Sair',
    'footer-brand-desc':     'Acesso privado a ferramentas digitais premium com suporte direto via WhatsApp.',
    'footer-col-products':   'Produtos',
    'footer-col-ai':         'Ferramentas IA',
    'footer-col-streaming':  'Streaming',
    'footer-col-design':     'Ferramentas de Design',
    'footer-col-company':    'Empresa',
    'footer-col-about':      'Sobre Nós',
    'footer-col-contact':    'Contato',
    'footer-col-support':    'Suporte',
    'footer-col-help':       'Central de Ajuda',
    'footer-col-whatsapp':   'WhatsApp',
    'footer-copyright':      '© 2025 KitsDigitalia. Todos os direitos reservados.',
    'footer-made':           'Feito com ❤️ para te dar mais acesso.',
    /* ---- Products page ---- */
    'prods-badge':           '🛒 Ferramentas Digitais Premium',
    'prods-h1':              'Todos os',
    'prods-h1-accent':       'Produtos',
    'prods-sub':             'Acesso privado a ferramentas premium, streaming e serviços digitais selecionados.',
    'filter-all':            'Todas as Ferramentas',
    'filter-ai':             '🤖 Ferramentas IA',
    'filter-streaming':      '🎬 Streaming',
    'filter-design':         '🎨 Design',
    'filter-productivity':   '📋 Produtividade',
    'cat-ai':                'Ferramentas IA',
    'cat-streaming':         'Streaming',
    'cat-design':            'Ferramentas de Design',
    'cat-productivity':      'Produtividade',
    'prods-cta-h2':          'Não sabe qual acesso escolher?',
    'prods-cta-p':           'Fale conosco e indicamos a melhor opção disponível para o seu objetivo.',
    'prods-cta-btn':         'Falar no WhatsApp →',
    /* ---- Product detail page ---- */
    'detail-guarantee':      '🛡️ Acesso garantido ou substituição imediata',
    'detail-check-1':        'Ativação após confirmação do pagamento',
    'detail-check-2':        'Acesso mensal',
    'detail-check-3':        'Funciona normalmente no seu dispositivo',
    'detail-check-4':        'Suporte via WhatsApp',
    /* ---- About page ---- */
    'about-badge':           '⚡ Acesso Restrito',
    'about-h1':              'Nem todo mundo',
    'about-h1-accent':       'deveria estar aqui',
    'about-h1-2':            '',
    'about-sub':             'KitsDigitalia não é uma loja comum. É um acesso controlado a ferramentas digitais premium, liberado apenas para quem sabe onde procurar.',
    'about-why-h2':          'Por que isso existe',
    'about-p1':              'A maioria das pessoas paga caro demais por ferramentas que usa todos os dias — ou simplesmente não consegue acesso a elas da forma mais inteligente.',
    'about-p2':              'Nós operamos de forma diferente. Trabalhamos com curadoria e acesso controlado, liberando ferramentas premium de forma simples, direta e funcional.',
    'about-p3':              'Isso não é para todos. E é exatamente esse o ponto.',
    'about-explore-btn':     'Ver Produtos →',
    'about-stat-support':    'Suporte Direto',
    'about-stat-access':     'Acesso Controlado',
    'about-stat-premium':    'Ferramentas Premium',
    'about-stat-lang':       'Atendimento multilíngue',
    'about-kd-tagline':      'Acesso privado a ferramentas premium',
    'about-values-h2':       'Como operamos',
    'about-values-accent':   'na prática',
    'about-values-sub':      'Sem promessas vazias. Apenas acesso funcional.',
    'about-val1-h4':         'Acesso Controlado',
    'about-val1-p':          'Nem todos os produtos ficam disponíveis o tempo todo. Trabalhamos com disponibilidade limitada.',
    'about-val2-h4':         'Processo Manual',
    'about-val2-p':          'Cada pedido é tratado manualmente para garantir entrega correta e funcionamento.',
    'about-val3-h4':         'Curadoria',
    'about-val3-p':          'Não listamos tudo. Apenas o que realmente tem demanda e funciona.',
    'about-val4-h4':         'Suporte Direto',
    'about-val4-p':          'Sem tickets, sem burocracia. Atendimento direto via WhatsApp.',
    'about-how-h2':          'Como funciona',
    'about-how-accent':      'o acesso',
    'about-how-sub':         'Simples, direto e sem complicação.',
    'about-op1-h4':          'Você escolhe',
    'about-op1-p':           'Navegue pelos produtos disponíveis e selecione o que precisa.',
    'about-op2-h4':          'Você solicita',
    'about-op2-p':           'Envie seu pedido com seus dados. O processo leva menos de 2 minutos.',
    'about-op3-h4':          'Nós ativamos',
    'about-op3-p':           'Após confirmação, liberamos o acesso e enviamos as instruções.',
    'about-op4-h4':          'Suporte incluído',
    'about-op4-p':           'Qualquer dúvida, atendimento direto via WhatsApp. Sem filas, sem espera.',
    'about-faq-h2':          'Perguntas',
    'about-faq-accent':      'Frequentes',
    'about-faq1-q':          'O que é exatamente o KitsDigitalia?',
    'about-faq1-a':          'Um acesso controlado a ferramentas digitais premium. Operamos de forma indireta e manual, com atendimento direto via WhatsApp.',
    'about-faq2-q':          'Por que não é aberto a qualquer um?',
    'about-faq2-a':          'Por escolha. Limitar o número de clientes nos permite manter qualidade, suporte próximo e entrega rápida.',
    'about-faq3-q':          'E se o meu acesso parar de funcionar?',
    'about-faq3-a':          'Substituímos sem custo adicional. É a nossa garantia.',
    'about-faq4-q':          'Como finalizo um pedido?',
    'about-faq4-a':          'Escolha o produto, finalize pelo checkout e aguarde contato via WhatsApp com os dados de acesso.',
    'about-cta-h2':          'Você encontrou o caminho.',
    'about-cta-p':           'Poucos chegam até aqui. Se chegou, aproveite enquanto há disponibilidade.',
    'about-cta-btn1':        'Ver Produtos →',
    'about-cta-btn2':        'Fale Conosco',
    /* ---- Contact page ---- */
    'contact-badge':         '💬 Estamos Aqui para Ajudar',
    'contact-h1':            '💬 Fale conosco',
    'contact-h1-accent':     'e ative seu acesso',
    'contact-sub':           'Tire dúvidas, confirme disponibilidade e finalize seu pedido pelo WhatsApp.',
    'contact-reach-h2':      'Fale Diretamente com a Gente',
    'contact-wa-h4':         'WhatsApp',
    'contact-wa-p':          'Resposta mais rápida — geralmente online em horário comercial. Mande mensagem a qualquer hora.',
    'contact-wa-link':       'Chamar no WhatsApp →',
    'contact-email-h4':      'Email',
    'contact-email-p':       'Prefere email? Escreva para nós e retornamos em até 24 horas em dias úteis.',
    'contact-ig-h4':         'Instagram',
    'contact-ig-p':          'Nos siga para atualizações, dicas e promoções dos nossos produtos.',
    'contact-rt-h4':         '⏱️ Tempos de Resposta',
    'contact-rt-wa':         'Menos de 2 horas',
    'contact-rt-email':      'Menos de 24 horas',
    'contact-rt-urgent':     'Prioridade máxima',
    'contact-form-h3':       'Envie uma Mensagem',
    'contact-name-label':    'Seu Nome *',
    'contact-name-ph':       'Seu nome completo',
    'contact-email-label':   'Endereço de Email *',
    'contact-phone-label':   'WhatsApp / Telefone (opcional)',
    'contact-subject-label': 'Assunto',
    'contact-opt-support':   'Preciso de suporte com um pedido',
    'contact-opt-question':  'Tenho uma dúvida sobre um produto',
    'contact-opt-purchase':  'Quero fazer uma compra',
    'contact-opt-refund':    'Tenho um problema / pedido de reembolso',
    'contact-opt-other':     'Outro',
    'contact-msg-label':     'Mensagem *',
    'contact-msg-ph':        'Nos conte o que você precisa. Mais detalhes = mais rápida a nossa resposta.',
    'contact-submit-btn':    'Enviar Mensagem →',
    'contact-privacy':       'Respeitamos sua privacidade. Suas informações serão usadas apenas para responder sua mensagem.',
    'contact-success-h3':    'Mensagem Enviada!',
    'contact-success-p':     'Obrigado por entrar em contato. Retornaremos em breve — geralmente em poucas horas.',
    'contact-success-btn':   'Voltar para o Início',
    'contact-faq-h2':        'Respostas',
    'contact-faq-accent':    'Rápidas',
    'contact-faq-sub':       'A maioria das dúvidas tem resposta aqui. Confira antes de enviar mensagem!',
    'contact-faq1-q':        'Quanto tempo leva para receber meu acesso?',
    'contact-faq1-a':        'Após confirmação do pagamento, a maioria dos pedidos é entregue em 30 minutos a 2 horas. Enviaremos tudo por email.',
    'contact-faq2-q':        'Meu acesso parou de funcionar. O que fazer?',
    'contact-faq2-a':        'Entre em contato imediatamente via WhatsApp ou email e substituiremos seu acesso na hora. Coberto pela nossa garantia sem custo extra.',
    'contact-faq3-q':        'Posso ter acesso a várias ferramentas ao mesmo tempo?',
    'contact-faq3-a':        'Com certeza! Você pode pedir quantas ferramentas quiser. Muitos clientes usam ChatGPT Pro, Canva Pro e Spotify juntos.',
    'contact-faq4-q':        'Quais formas de pagamento vocês aceitam?',
    'contact-faq4-a':        'Aceitamos cartão de crédito/débito, PIX, PayPal, criptomoeda e transferência bancária. Confirmaremos as opções ao fazer seu pedido.',
    'contact-faq5-q':        'Vocês oferecem reembolso?',
    'contact-faq5-a':        'Garantimos o acesso pelo período completo que você comprou. Se não conseguirmos entregar o que prometemos, encontraremos uma solução justa.',
    'contact-cta-h2':        'Pronto para Seus Produtos?',
    'contact-cta-p':         'Não espere — comece a economizar hoje e desbloqueie as ferramentas digitais que você precisa.',
    'contact-cta-btn':       'Ver Todos os Produtos →',
    /* ---- Checkout page ---- */
    'checkout-h1':           'Complete Seu',
    'checkout-h1-accent':    'Pedido',
    'checkout-sub':          'Você está a poucos passos de ter seu acesso.',
    'checkout-personal-h3':  '👤 Suas Informações',
    'checkout-name-label':   'Nome Completo *',
    'checkout-email-label':  'Endereço de Email *',
    'checkout-email-note':   '(seu acesso será enviado aqui)',
    'checkout-wa-label':     'WhatsApp (opcional)',
    'checkout-wa-note':      '— para suporte mais rápido',
    'checkout-product-h3':   '🛒 Selecione seu Produto',
    'checkout-product-label':'Produto',
    'checkout-dur-1':        '1 Mês',
    'checkout-notes-label':  'Observações (opcional)',
    'checkout-payment-h3':   '💳 Pagamento',
    'checkout-secure-h4':    'Pagamento Seguro',
    'checkout-secure-p':     'Após clicar em "Finalizar Pedido", entraremos em contato via email ou WhatsApp com as instruções de pagamento. Aceitamos:',
    'checkout-agree':        'Entendo que este é um serviço de acesso compartilhado. Concordo com os termos e entendo que o acesso será entregue por email após confirmação do pagamento.',
    'checkout-submit':       '🚀 Finalizar pedido via WhatsApp',
    'checkout-submit-note':  'Você será redirecionado para finalizar rapidamente no WhatsApp.',
    'checkout-privacy':      '🛡️ Suas informações estão seguras. Nunca compartilhamos seus dados com terceiros.',
    'checkout-summary-h3':   'Resumo do Pedido',
    'checkout-subtotal':     'Subtotal',
    'checkout-discount':     'Desconto',
    'checkout-total':        'Total',
    'checkout-next-h4':      'O que acontece depois?',
    'checkout-next-1':       'Você envia seu pedido',
    'checkout-next-2':       'Enviamos as instruções de pagamento para seu email',
    'checkout-next-3':       'Pagamento confirmado → Acesso entregue',
    'checkout-next-4':       'Comece a usar sua ferramenta imediatamente',
    'checkout-help-p':       'Precisa de ajuda? Fale com a gente:',
    'checkout-contact-btn':  '💬 Suporte',
    'checkout-success-h2':   'Pedido Recebido!',
    'checkout-success-p':    'Obrigado pela sua compra. Processaremos seu pedido e enviaremos seus dados de acesso por email em até 30 minutos.',
    'checkout-success-btn1': 'Ver Mais Produtos',
    'checkout-success-btn2': 'Falar com o Suporte',
    'badge-guaranteed':      '🛡️ Garantido',
    'badge-fast-delivery':   '⚡ Entrega Rápida',
    'badge-support247':      '💬 Suporte 24/7',
    /* ---- Placeholders ---- */
    'checkout-name-ph':      'João Silva',
    'checkout-email-ph':     'joao@exemplo.com',
    'checkout-wa-ph':        '+55 11 99999-9999',
    'checkout-notes-ph':     'Pedidos especiais ou dúvidas...',
    'contact-email-ph':      'seu@email.com',
    'contact-phone-ph':      '+55 11 99999-9999',
    /* ---- Labels da mensagem WhatsApp ---- */
    'wa-checkout-greeting':  'Olá, acabei de fazer uma compra.',
    'wa-produto':            'Produto',
    'wa-valor':              'Valor',
    'wa-pedido':             'Pedido',
    'wa-revendedor':         'Revendedor',
    'wa-direto':             'direto',
    'wa-nome':               'Nome',
    'wa-email':              'Email',
    'wa-whatsapp':           'WhatsApp',
    'wa-obs':                'Observações',
    'wa-aguardo':            'Aguardo instruções para pagamento.',
    'wa-contact-greeting':   'Olá, entrei em contato pelo site.',
    'wa-assunto':            'Assunto',
    'wa-mensagem':           'Mensagem',
    'checkout-validation':   'Por favor preencha nome, email e WhatsApp.',
    /* ---- Seção Revendedor ---- */
    'reseller-badge':        '🤝 Programa de Revendedores',
    'reseller-h2':           'Seja nosso',
    'reseller-h2-accent':    'Revendedor',
    'reseller-sub':          'Ganhe comissões indicando novos clientes. Simples, rápido e sem investimento inicial.',
    'reseller-name-label':   'Nome completo',
    'reseller-cpf-label':    'CPF',
    'reseller-phone-label':  'Telefone',
    'reseller-name-ph':      'João Silva',
    'reseller-cpf-ph':       '000.000.000-00',
    'reseller-phone-ph':     '+55 11 99999-9999',
    'reseller-btn':          'Quero ser revendedor →',
    'reseller-privacy':      'Suas informações são usadas apenas para cadastro no programa de revendedores.',
    'reseller-validation':   'Por favor preencha nome, CPF e telefone.',
    'wa-reseller-greeting':  'Olá, quero me tornar revendedor do KitsDigitalia.',
    'wa-reseller-cpf':       'CPF',
    'wa-reseller-phone':     'Telefone',
    /* ---- Dynamic render labels ---- */
    'dynamic-details-btn':   'Detalhes',
    'dynamic-buy-btn':       'Comprar',
    'dynamic-soldout-btn':   'Esgotado',
    /* ---- Products page — social + combos ---- */
    'filter-social':         '📱 Social',
    'cat-social':            'Social Media',
    'combos-section-title':  '🔥 Combos em Destaque',
    /* ---- Checkout — métodos de pagamento ---- */
    'checkout-payment-method-label': 'Método de Pagamento',
    'checkout-pix':          'PIX',
    'checkout-pix-note':     'Brasil · Aprovação imediata',
    'checkout-iban':         'IBAN',
    'checkout-iban-note':    'Europa · Transferência bancária',
    'checkout-binance':      'Binance',
    'checkout-binance-discount': '7% OFF',
    'checkout-binance-note': 'Crypto · UID: 1229674211',
    'checkout-wa-label':     'WhatsApp *',
    'checkout-soldout-error':'Este produto está esgotado. Por favor escolha outro.',
    'checkout-exclusive-notice':'🔒 Pedido processado manualmente para manter acesso exclusivo',
    /* ---- WA messages por método ---- */
    'wa-pedido-pix':         'Pedido PIX:',
    'wa-pedido-iban':        'Pedido IBAN:',
    'wa-pedido-binance':     'Pedido Binance:',
    'wa-preco-desconto':     'Preço com desconto',
    'wa-binance-uid':        'UID Binance',
    'prods-urgency':         '🔥 Acessos limitados hoje — alguns produtos esgotam rápido',
    'weekly-sales-label':    'vendas esta semana',
    'detail-activation-hint':'⚡ Ativação rápida após pagamento',
    'wa-float':              'Fale conosco',
    /* ---- PIX Automático ---- */
    'checkout-cpf-label':        'CPF *',
    'checkout-cpf-ph':           '000.000.000-00',
    'checkout-generating-pix':   '⏳ Gerando PIX...',
    'checkout-pix-payment':      'Pagamento PIX',
    'checkout-copy-pix':         'Copiar',
    'checkout-copied':           'Copiado!',
    'checkout-check-payment':    '🔄 Verificar pagamento',
    'checkout-awaiting-payment': 'Aguardando pagamento',
    'checkout-payment-confirmed':'✅ Pagamento confirmado!',
    'checkout-send-whatsapp':    'Enviar pedido no WhatsApp',
    'checkout-order-number':     'Número do pedido',
    'checkout-pix-instructions': 'Abra o app do seu banco, vá em PIX e use o código abaixo para pagar.',
    'checkout-polling-timeout':  'Tempo limite atingido. Clique em "Verificar pagamento" para checar manualmente.',
    /* ---- Meus Pedidos ---- */
    'nav-my-orders':             '📦 Meus Pedidos',
    'my-orders-title':           'Meus Pedidos',
    'my-orders-sub':             'Consulte o status dos seus pedidos.',
    'my-orders-email-label':     'Seu Email *',
    'my-orders-wa-label':        'Seu WhatsApp *',
    'my-orders-search-btn':      '🔍 Buscar Pedidos',
    'my-orders-not-found':       'Nenhum pedido encontrado.',
    'my-orders-order-num':       'Pedido',
    'my-orders-product':         'Produto',
    'my-orders-amount':          'Valor',
    'my-orders-payment-method':  'Pagamento',
    'my-orders-payment-status':  'Status do Pagamento',
    'my-orders-fulfillment':     'Status do Pedido',
    'my-orders-date':            'Data',
    'my-orders-wa-btn':          '💬 WhatsApp',
    'my-orders-refresh':         '🔄 Atualizar',
    /* ---- Status de fulfillment ---- */
    'status-aguardando_pagamento': 'Aguardando pagamento',
    'status-pago_ok':              'Pago ✓',
    'status-em_andamento':         'Em andamento',
    'status-entregue':             'Entregue',
    'status-concluido':            'Concluído',
    /* ---- Status de pagamento ---- */
    'pstatus-pending':             'Aguardando',
    'pstatus-pending_manual':      'Aguardando confirmação',
    'pstatus-paid':                'Pago',
    'pstatus-failed':              'Falhou',
    'pstatus-expired':             'Expirado',
    /* ---- WA pós-pagamento PIX ---- */
    'wa-pix-paid-greeting':        'Olá, paguei meu pedido via PIX.',
    'wa-pagamento':                'Pagamento',
    'wa-status':                   'Status',
    'wa-pago':                     'Pago',
  },

  en: {
    'nav-login':              'Already a member? Sign in →',
    'hero-headline':          'This is not for everyone.',
    'hero-headline-accent':   'Only for those who know how to pay less and get more.',
    'hero-sub':               "Once you enter, you don't go back to full price. You are seeing prices most people never will.",
    'hero-cta':               'Enter now',
    'hero-cta2':              "See What's Inside",
    'hero-trust-1':           '🔒 Secure & private',
    'hero-trust-2':           'Support via WhatsApp',
    'hero-trust-3':           'No spam. Ever.',
    'scarcity-live':          '⚡ Access available — complete via WhatsApp',
    'stat-tools':             'Premium Tools',
    'stat-savings':           'WhatsApp Support',
    'stat-members':           'Multi-language',
    'stat-rating':            'Secure Access',
    'preview-title':          "What's Waiting",
    'preview-title-accent':   'For You',
    'preview-sub':            "Members get access to these tools at prices that aren't advertised publicly. Here's a glimpse — the rest is behind the door.",
    'preview-more':           'See more →',
    'preview-unlock-sub':     "You're seeing a fraction of what's inside. Members get full access to all tools and exclusive prices.",
    'preview-unlock-btn':     '🔓 Unlock Full Access',
    'capacity-label':         '⚡ Support via WhatsApp',
    'capacity-pct':           'Available',
    'capacity-spots':         'Fast response on business days',
    'capacity-zero':          '',
    'capacity-total':         '',
    'steps-title':            'Simpler Than',
    'steps-title-accent':     'You Think',
    'steps-sub':              "Three steps. Five minutes. Then you're in.",
    'step1-title':            'Create Your Account',
    'step1-body':             'Click Unlock Access, enter your email and a password. No credit card required to start.',
    'step2-title':            'Choose Your Tools',
    'step2-body':             'Browse the exclusive catalog and pick what you need. Buy one or a bundle — your choice.',
    'step3-title':            'Get Instant Access',
    'step3-body':             'Pay and receive your credentials by email within minutes. Use it immediately.',
    'steps-cta':              'Get Started →',
    'testimonials-title':     'What',
    'testimonials-title-accent': 'Members Say',
    'testimonials-sub':       "What our customers say about their experience.",
    'final-scarcity':         '✅ Access available now',
    'final-title':            'Stop Paying',
    'final-title-accent':     'Full Price.',
    'final-title-2':          "Join the Members Who Aren't.",
    'final-sub':              "Create your free account in 60 seconds and see everything that's been waiting for you.",
    'final-btn':              '🔓 Unlock Access Now',
    'final-trust-1':          '🔒 Secure login',
    'final-trust-2':          'No spam',
    'final-trust-3':          'Cancel anytime',
    'footer-login':           'Member Login',
    'login-title':            'Private Access',
    'login-sub':              'Entry limited to approved members',
    'login-google':           'Continue with Google',
    'login-or':               'or sign in with email',
    'login-email-label':      'Email Address',
    'login-pw-label':         'Password',
    'login-forgot':           'Forgot password?',
    'login-remember':         'Keep me signed in',
    'login-btn':              'Request access →',
    'login-trust-1':          '🔒 Secure access',
    'login-trust-2':          'No spam. Ever.',
    'login-trust-3':          'Cancel anytime',
    'login-no-account':       'Not a member yet?',
    'login-see-inside':       "See what's inside →",
    'login-back':             '← Back to home',
    'login-footer':           'KitsDigitalia',
    /* ---- Shared inner pages ---- */
    'nav-home':              'Home',
    'nav-products':          'Products',
    'nav-about':             'About',
    'nav-contact':           'Contact',
    'nav-signout':           'Sign Out',
    'footer-brand-desc':     'Private access to premium digital tools with direct WhatsApp support.',
    'footer-col-products':   'Products',
    'footer-col-ai':         'AI Tools',
    'footer-col-streaming':  'Streaming',
    'footer-col-design':     'Design Tools',
    'footer-col-company':    'Company',
    'footer-col-about':      'About Us',
    'footer-col-contact':    'Contact',
    'footer-col-support':    'Support',
    'footer-col-help':       'Help Center',
    'footer-col-whatsapp':   'WhatsApp',
    'footer-copyright':      '© 2025 KitsDigitalia. All rights reserved.',
    'footer-made':           'Made with ❤️ to help you access more.',
    /* ---- Products page ---- */
    'prods-badge':           '🛒 Premium Digital Tools',
    'prods-h1':              'All',
    'prods-h1-accent':       'Products',
    'prods-sub':             'Private access to premium tools, streaming, and selected digital services.',
    'filter-all':            'All Tools',
    'filter-ai':             '🤖 AI Tools',
    'filter-streaming':      '🎬 Streaming',
    'filter-design':         '🎨 Design',
    'filter-productivity':   '📋 Productivity',
    'cat-ai':                'AI Tools',
    'cat-streaming':         'Streaming',
    'cat-design':            'Design Tools',
    'cat-productivity':      'Productivity',
    'prods-cta-h2':          'Not sure which access to choose?',
    'prods-cta-p':           'Talk to us and we will point you to the best available option for your goal.',
    'prods-cta-btn':         'Talk on WhatsApp →',
    /* ---- Product detail page ---- */
    'detail-guarantee':      '🛡️ Guaranteed access or full replacement',
    'detail-check-1':        'Activation after payment confirmation',
    'detail-check-2':        'Monthly access',
    'detail-check-3':        'Works on your device normally',
    'detail-check-4':        'Support via WhatsApp',
    /* ---- About page ---- */
    'about-badge':           '⚡ Restricted Access',
    'about-h1':              'Not everyone',
    'about-h1-accent':       'should be here',
    'about-h1-2':            '',
    'about-sub':             "KitsDigitalia is not a regular store. It's controlled access to premium digital tools, available only to those who know where to look.",
    'about-why-h2':          'Why this exists',
    'about-p1':              'Most people pay too much for tools they use every day — or simply never get access in the smartest way.',
    'about-p2':              'We operate differently. Through curation and controlled access, we make premium tools available in a simple, direct, and functional way.',
    'about-p3':              "This isn't for everyone. That's the point.",
    'about-explore-btn':     'See Products →',
    'about-stat-support':    'Direct Support',
    'about-stat-access':     'Controlled Access',
    'about-stat-premium':    'Premium Tools',
    'about-stat-lang':       'Multilingual support',
    'about-kd-tagline':      'Private access to premium tools',
    'about-values-h2':       'How we operate',
    'about-values-accent':   'in practice',
    'about-values-sub':      'No empty promises. Just working access.',
    'about-val1-h4':         'Controlled Access',
    'about-val1-p':          'Not all products are available all the time. Availability is limited.',
    'about-val2-h4':         'Manual Process',
    'about-val2-p':          'Every order is handled manually to ensure proper delivery.',
    'about-val3-h4':         'Curation',
    'about-val3-p':          "We don't list everything. Only what actually works and is in demand.",
    'about-val4-h4':         'Direct Support',
    'about-val4-p':          'No tickets, no bureaucracy. Direct WhatsApp support.',
    'about-how-h2':          'How access',
    'about-how-accent':      'works',
    'about-how-sub':         'Simple, direct, no friction.',
    'about-op1-h4':          'You choose',
    'about-op1-p':           'Browse available products and select what you need.',
    'about-op2-h4':          'You request',
    'about-op2-p':           'Send your order with your details. Takes less than 2 minutes.',
    'about-op3-h4':          'We activate',
    'about-op3-p':           'After confirmation, we deliver access and instructions.',
    'about-op4-h4':          'Support included',
    'about-op4-p':           'Any questions, direct WhatsApp support. No queues, no waiting.',
    'about-faq-h2':          'Common',
    'about-faq-accent':      'Questions',
    'about-faq1-q':          'What exactly is KitsDigitalia?',
    'about-faq1-a':          'Controlled access to premium digital tools. We operate indirectly and manually, with direct WhatsApp support.',
    'about-faq2-q':          "Why isn't it open to everyone?",
    'about-faq2-a':          'By choice. Limiting the number of clients lets us maintain quality, close support, and fast delivery.',
    'about-faq3-q':          'What if my access stops working?',
    'about-faq3-a':          'We replace it at no extra cost. That is our guarantee.',
    'about-faq4-q':          'How do I complete an order?',
    'about-faq4-a':          'Choose a product, complete checkout, and wait for WhatsApp contact with your access details.',
    'about-cta-h2':          'You found the way in.',
    'about-cta-p':           'Few make it here. If you did, take advantage while availability lasts.',
    'about-cta-btn1':        'See Products →',
    'about-cta-btn2':        'Contact Us',
    /* ---- Contact page ---- */
    'contact-badge':         "💬 We're Here to Help",
    'contact-h1':            '💬 Talk to us',
    'contact-h1-accent':     'and activate your access',
    'contact-sub':           'Ask questions, confirm availability, and complete your order on WhatsApp.',
    'contact-reach-h2':      'Reach Us Directly',
    'contact-wa-h4':         'WhatsApp',
    'contact-wa-p':          "Fastest response — we're usually online during business hours. Send us a message anytime.",
    'contact-wa-link':       'Chat on WhatsApp →',
    'contact-email-h4':      'Email',
    'contact-email-p':       "Prefer email? Write to us and we'll get back to you within 24 hours on business days.",
    'contact-ig-h4':         'Instagram',
    'contact-ig-p':          'Follow us for updates, tips, and promotions on our products.',
    'contact-rt-h4':         '⏱️ Response Times',
    'contact-rt-wa':         'Under 2 hours',
    'contact-rt-email':      'Under 24 hours',
    'contact-rt-urgent':     'Priority response',
    'contact-form-h3':       'Send Us a Message',
    'contact-name-label':    'Your Name *',
    'contact-name-ph':       'Your full name',
    'contact-email-label':   'Email Address *',
    'contact-phone-label':   'WhatsApp / Phone (optional)',
    'contact-subject-label': 'Subject',
    'contact-opt-support':   'I need support with an order',
    'contact-opt-question':  'I have a question about a product',
    'contact-opt-purchase':  'I want to make a purchase',
    'contact-opt-refund':    'I have an issue / refund request',
    'contact-opt-other':     'Other',
    'contact-msg-label':     'Message *',
    'contact-msg-ph':        'Tell us what you need. The more details, the faster we can help you.',
    'contact-submit-btn':    'Send Message →',
    'contact-privacy':       'We respect your privacy. Your information will only be used to respond to your message.',
    'contact-success-h3':    'Message Sent!',
    'contact-success-p':     "Thanks for reaching out. We'll get back to you shortly — usually within a few hours.",
    'contact-success-btn':   'Back to Home',
    'contact-faq-h2':        'Quick',
    'contact-faq-accent':    'Answers',
    'contact-faq-sub':       'Most questions are answered here. Save time and check before sending a message!',
    'contact-faq1-q':        'How long does it take to receive my access?',
    'contact-faq1-a':        "After payment is confirmed, most orders are fulfilled within 30 minutes to 2 hours. We'll send everything straight to your email.",
    'contact-faq2-q':        'My access stopped working. What do I do?',
    'contact-faq2-a':        "Contact us immediately via WhatsApp or email and we'll replace your access right away. This is covered by our guarantee at no extra cost.",
    'contact-faq3-q':        'Can I get access to multiple tools at once?',
    'contact-faq3-a':        "Absolutely! You can order as many tools as you like. Many customers use ChatGPT Pro, Canva Pro, and Spotify together.",
    'contact-faq4-q':        'What payment methods do you accept?',
    'contact-faq4-a':        "We accept credit/debit cards, PIX (for Brazilian customers), PayPal, cryptocurrency, and bank transfer.",
    'contact-faq5-q':        'Do you offer refunds?',
    'contact-faq5-a':        "We guarantee access for the full period you purchased. If we can't deliver what we promised, we'll make it right.",
    'contact-cta-h2':        'Ready to Get Your Tools?',
    'contact-cta-p':         "Don't wait — start saving today and unlock the digital tools that will change how you work.",
    'contact-cta-btn':       'Browse All Products →',
    /* ---- Checkout page ---- */
    'checkout-h1':           'Complete Your',
    'checkout-h1-accent':    'Order',
    'checkout-sub':          "You're just a few steps away from getting your access.",
    'checkout-personal-h3':  '👤 Your Information',
    'checkout-name-label':   'Full Name *',
    'checkout-email-label':  'Email Address *',
    'checkout-email-note':   '(your access will be sent here)',
    'checkout-wa-label':     'WhatsApp (optional)',
    'checkout-wa-note':      '— for faster support',
    'checkout-product-h3':   '🛒 Select Your Product',
    'checkout-product-label':'Product',
    'checkout-dur-1':        '1 Month',
    'checkout-notes-label':  'Notes (optional)',
    'checkout-payment-h3':   '💳 Payment',
    'checkout-secure-h4':    'Secure Payment',
    'checkout-secure-p':     'After clicking "Complete Order" below, we will contact you via email or WhatsApp with payment instructions. We accept:',
    'checkout-agree':        'I understand this is a shared access service. I agree to the terms and understand that access will be delivered by email after payment is confirmed.',
    'checkout-submit':       '🚀 Complete order via WhatsApp',
    'checkout-submit-note':  'You will be redirected to quickly complete your order on WhatsApp.',
    'checkout-privacy':      '🛡️ Your information is safe. We never share your data with third parties.',
    'checkout-summary-h3':   'Order Summary',
    'checkout-subtotal':     'Subtotal',
    'checkout-discount':     'Discount',
    'checkout-total':        'Total',
    'checkout-next-h4':      'What happens next?',
    'checkout-next-1':       'You submit your order',
    'checkout-next-2':       'We send payment instructions to your email',
    'checkout-next-3':       'Payment confirmed → Access delivered',
    'checkout-next-4':       'Start using your tool immediately',
    'checkout-help-p':       'Need help? Reach out:',
    'checkout-contact-btn':  '💬 Contact Support',
    'checkout-success-h2':   'Order Received!',
    'checkout-success-p':    "Thank you for your purchase. We're processing your order and will send your access details to your email within 30 minutes.",
    'checkout-success-btn1': 'Browse More Products',
    'checkout-success-btn2': 'Contact Support',
    'badge-guaranteed':      '🛡️ Guaranteed',
    'badge-fast-delivery':   '⚡ Fast Delivery',
    'badge-support247':      '💬 24/7 Support',
    /* ---- Placeholders ---- */
    'checkout-name-ph':      'John Smith',
    'checkout-email-ph':     'john@example.com',
    'checkout-wa-ph':        '+1 234 567 8900',
    'checkout-notes-ph':     'Any special requests or questions...',
    'contact-email-ph':      'your@email.com',
    'contact-phone-ph':      '+1 234 567 8900',
    /* ---- WhatsApp message labels ---- */
    'wa-checkout-greeting':  'Hello, I just placed an order.',
    'wa-produto':            'Product',
    'wa-valor':              'Price',
    'wa-pedido':             'Order',
    'wa-revendedor':         'Referral',
    'wa-direto':             'direct',
    'wa-nome':               'Name',
    'wa-email':              'Email',
    'wa-whatsapp':           'WhatsApp',
    'wa-obs':                'Notes',
    'wa-aguardo':            'Awaiting payment instructions.',
    'wa-contact-greeting':   'Hello, I reached out through the website.',
    'wa-assunto':            'Subject',
    'wa-mensagem':           'Message',
    'checkout-validation':   'Please fill in your name, email and WhatsApp.',
    /* ---- Reseller Section ---- */
    'reseller-badge':        '🤝 Reseller Program',
    'reseller-h2':           'Become our',
    'reseller-h2-accent':    'Reseller',
    'reseller-sub':          'Earn commissions by referring new customers. Simple, fast, and no upfront investment.',
    'reseller-name-label':   'Full Name',
    'reseller-cpf-label':    'Tax ID / CPF',
    'reseller-phone-label':  'Phone',
    'reseller-name-ph':      'John Smith',
    'reseller-cpf-ph':       '000.000.000-00',
    'reseller-phone-ph':     '+1 234 567 8900',
    'reseller-btn':          'I want to be a reseller →',
    'reseller-privacy':      'Your information is used solely for registration in the reseller program.',
    'reseller-validation':   'Please fill in your name, Tax ID, and phone.',
    'wa-reseller-greeting':  'Hello, I want to become a KitsDigitalia reseller.',
    'wa-reseller-cpf':       'Tax ID',
    'wa-reseller-phone':     'Phone',
    /* ---- Dynamic render labels ---- */
    'dynamic-details-btn':   'Details',
    'dynamic-buy-btn':       'Buy',
    'dynamic-soldout-btn':   'Sold Out',
    /* ---- Products page — social + combos ---- */
    'filter-social':         '📱 Social',
    'cat-social':            'Social Media',
    'combos-section-title':  '🔥 Featured Combos',
    /* ---- Checkout — payment methods ---- */
    'checkout-payment-method-label': 'Payment Method',
    'checkout-pix':          'PIX',
    'checkout-pix-note':     'Brazil · Instant approval',
    'checkout-iban':         'IBAN',
    'checkout-iban-note':    'Europe · Bank transfer',
    'checkout-binance':      'Binance',
    'checkout-binance-discount': '7% OFF',
    'checkout-binance-note': 'Crypto · UID: 1229674211',
    'checkout-wa-label':     'WhatsApp *',
    'checkout-soldout-error':'This product is sold out. Please choose another.',
    'checkout-exclusive-notice':'🔒 Orders are manually processed to maintain exclusive access',
    /* ---- WA messages per method ---- */
    'wa-pedido-pix':         'PIX Order:',
    'wa-pedido-iban':        'IBAN Order:',
    'wa-pedido-binance':     'Binance Order:',
    'wa-preco-desconto':     'Discounted price',
    'wa-binance-uid':        'Binance UID',
    'prods-urgency':         '🔥 Limited access today — some products sell out fast',
    'weekly-sales-label':    'sales this week',
    'detail-activation-hint':'⚡ Fast activation after payment',
    'wa-float':              'Contact us',
    /* ---- PIX Automatic ---- */
    'checkout-cpf-label':        'CPF *',
    'checkout-cpf-ph':           '000.000.000-00',
    'checkout-generating-pix':   '⏳ Generating PIX...',
    'checkout-pix-payment':      'PIX Payment',
    'checkout-copy-pix':         'Copy',
    'checkout-copied':           'Copied!',
    'checkout-check-payment':    '🔄 Check payment',
    'checkout-awaiting-payment': 'Awaiting payment',
    'checkout-payment-confirmed':'✅ Payment confirmed!',
    'checkout-send-whatsapp':    'Send order on WhatsApp',
    'checkout-order-number':     'Order number',
    'checkout-pix-instructions': 'Open your bank app, go to PIX and use the code below to pay.',
    'checkout-polling-timeout':  'Time limit reached. Click "Check payment" to verify manually.',
    /* ---- My Orders ---- */
    'nav-my-orders':             '📦 My Orders',
    'my-orders-title':           'My Orders',
    'my-orders-sub':             'Check the status of your orders.',
    'my-orders-email-label':     'Your Email *',
    'my-orders-wa-label':        'Your WhatsApp *',
    'my-orders-search-btn':      '🔍 Search Orders',
    'my-orders-not-found':       'No orders found.',
    'my-orders-order-num':       'Order',
    'my-orders-product':         'Product',
    'my-orders-amount':          'Amount',
    'my-orders-payment-method':  'Payment',
    'my-orders-payment-status':  'Payment Status',
    'my-orders-fulfillment':     'Order Status',
    'my-orders-date':            'Date',
    'my-orders-wa-btn':          '💬 WhatsApp',
    'my-orders-refresh':         '🔄 Refresh',
    /* ---- Fulfillment statuses ---- */
    'status-aguardando_pagamento': 'Awaiting payment',
    'status-pago_ok':              'Paid ✓',
    'status-em_andamento':         'In progress',
    'status-entregue':             'Delivered',
    'status-concluido':            'Completed',
    /* ---- Payment statuses ---- */
    'pstatus-pending':             'Awaiting',
    'pstatus-pending_manual':      'Awaiting confirmation',
    'pstatus-paid':                'Paid',
    'pstatus-failed':              'Failed',
    'pstatus-expired':             'Expired',
    /* ---- WA post PIX payment ---- */
    'wa-pix-paid-greeting':        'Hello, I paid my order via PIX.',
    'wa-pagamento':                'Payment',
    'wa-status':                   'Status',
    'wa-pago':                     'Paid',
  },

  it: {
    'nav-login':              'Già membro? Accedi →',
    'hero-headline':          'Questo non è per tutti.',
    'hero-headline-accent':   'Solo per chi sa come pagare meno e ottenere di più.',
    'hero-sub':               'Chi entra non torna più ai prezzi pieni. Stai vedendo prezzi che la maggior parte non vedrà mai.',
    'hero-cta':               'Entra ora',
    'hero-cta2':              "Guarda Cosa C'è Dentro",
    'hero-trust-1':           '🔒 Sicuro e privato',
    'hero-trust-2':           'Supporto via WhatsApp',
    'hero-trust-3':           'Niente spam. Mai.',
    'scarcity-live':          '⚡ Accesso disponibile — finalizza via WhatsApp',
    'stat-tools':             'Strumenti Premium',
    'stat-savings':           'Supporto WhatsApp',
    'stat-members':           'Multi-lingua',
    'stat-rating':            'Accesso Sicuro',
    'preview-title':          'Cosa Ti',
    'preview-title-accent':   'Aspetta',
    'preview-sub':            'I membri accedono a questi strumenti a prezzi non pubblicizzati. Ecco solo un assaggio — il resto è dietro la porta.',
    'preview-more':           'Vedi altro →',
    'preview-unlock-sub':     "Stai vedendo solo una parte di ciò che c'è dentro. I membri hanno accesso completo a tutti gli strumenti.",
    'preview-unlock-btn':     "🔓 Sblocca l'Accesso Completo",
    'capacity-label':         '⚡ Supporto via WhatsApp',
    'capacity-pct':           'Disponibile',
    'capacity-spots':         'Risposta rapida nei giorni lavorativi',
    'capacity-zero':          '',
    'capacity-total':         '',
    'steps-title':            'Più Semplice di',
    'steps-title-accent':     'Quanto Pensi',
    'steps-sub':              'Tre passi. Cinque minuti. Poi sei dentro.',
    'step1-title':            'Crea il Tuo Account',
    'step1-body':             "Clicca Sblocca Accesso, inserisci la tua email e una password. Nessuna carta di credito per iniziare.",
    'step2-title':            'Scegli i Tuoi Strumenti',
    'step2-body':             "Sfoglia il catalogo esclusivo e scegli quello che ti serve. Acquista uno o di più — decidi tu.",
    'step3-title':            'Accesso Immediato',
    'step3-body':             "Paga e ricevi le credenziali via email in pochi minuti. Usale subito.",
    'steps-cta':              'Inizia Ora →',
    'testimonials-title':     'Cosa Dicono',
    'testimonials-title-accent': 'i Membri',
    'testimonials-sub':       "Cosa dicono i nostri clienti sulla loro esperienza.",
    'final-scarcity':         '✅ Accesso disponibile ora',
    'final-title':            'Smetti di Pagare',
    'final-title-accent':     'Prezzo Pieno.',
    'final-title-2':          "Unisciti a Chi Non lo Fa.",
    'final-sub':              "Crea il tuo account gratuito in 60 secondi e scopri tutto ciò che ti aspetta.",
    'final-btn':              "🔓 Sblocca l'Accesso Ora",
    'final-trust-1':          '🔒 Login sicuro',
    'final-trust-2':          'Niente spam',
    'final-trust-3':          'Annulla quando vuoi',
    'footer-login':           'Login Membri',
    'login-title':            'Accesso Privato',
    'login-sub':              'Solo per membri autorizzati',
    'login-google':           'Continua con Google',
    'login-or':               'o accedi con email',
    'login-email-label':      'Indirizzo Email',
    'login-pw-label':         'Password',
    'login-forgot':           'Password dimenticata?',
    'login-remember':         'Mantienimi connesso',
    'login-btn':              'Richiedi accesso →',
    'login-trust-1':          '🔒 Accesso sicuro',
    'login-trust-2':          'Niente spam. Mai.',
    'login-trust-3':          'Annulla quando vuoi',
    'login-no-account':       'Non sei ancora membro?',
    'login-see-inside':       "Guarda cosa c'è dentro →",
    'login-back':             '← Torna alla home',
    'login-footer':           'KitsDigitalia',
    /* ---- Shared inner pages ---- */
    'nav-home':              'Home',
    'nav-products':          'Prodotti',
    'nav-about':             'Chi Siamo',
    'nav-contact':           'Contatti',
    'nav-signout':           'Esci',
    'footer-brand-desc':     'Accesso privato a strumenti digitali premium con supporto diretto via WhatsApp.',
    'footer-col-products':   'Prodotti',
    'footer-col-ai':         'Strumenti AI',
    'footer-col-streaming':  'Streaming',
    'footer-col-design':     'Strumenti di Design',
    'footer-col-company':    'Azienda',
    'footer-col-about':      'Chi Siamo',
    'footer-col-contact':    'Contatti',
    'footer-col-support':    'Supporto',
    'footer-col-help':       'Centro Assistenza',
    'footer-col-whatsapp':   'WhatsApp',
    'footer-copyright':      '© 2025 KitsDigitalia. Tutti i diritti riservati.',
    'footer-made':           'Fatto con ❤️ per darti più accesso.',
    /* ---- Products page ---- */
    'prods-badge':           '🛒 Strumenti Digitali Premium',
    'prods-h1':              'Tutti i',
    'prods-h1-accent':       'Prodotti',
    'prods-sub':             'Accesso privato a strumenti premium, streaming e servizi digitali selezionati.',
    'filter-all':            'Tutti gli Strumenti',
    'filter-ai':             '🤖 Strumenti AI',
    'filter-streaming':      '🎬 Streaming',
    'filter-design':         '🎨 Design',
    'filter-productivity':   '📋 Produttività',
    'cat-ai':                'Strumenti AI',
    'cat-streaming':         'Streaming',
    'cat-design':            'Strumenti di Design',
    'cat-productivity':      'Produttività',
    'prods-cta-h2':          'Non sai quale accesso scegliere?',
    'prods-cta-p':           "Scrivici e ti indicheremo l'opzione disponibile più adatta al tuo obiettivo.",
    'prods-cta-btn':         'Scrivi su WhatsApp →',
    /* ---- Product detail page ---- */
    'detail-guarantee':      '🛡️ Accesso garantito o sostituzione immediata',
    'detail-check-1':        'Attivazione dopo conferma del pagamento',
    'detail-check-2':        'Accesso mensile',
    'detail-check-3':        'Funziona normalmente sul tuo dispositivo',
    'detail-check-4':        'Supporto via WhatsApp',
    /* ---- About page ---- */
    'about-badge':           '⚡ Accesso Limitato',
    'about-h1':              'Non tutti',
    'about-h1-accent':       'dovrebbero essere qui',
    'about-h1-2':            '',
    'about-sub':             'KitsDigitalia non è un negozio comune. È un accesso controllato a strumenti digitali premium, disponibile solo per chi sa dove cercare.',
    'about-why-h2':          'Perché esiste',
    'about-p1':              'La maggior parte delle persone paga troppo per strumenti che usa ogni giorno — o semplicemente non ottiene accesso nel modo più intelligente.',
    'about-p2':              'Noi operiamo in modo diverso. Attraverso selezione e accesso controllato, rendiamo disponibili strumenti premium in modo semplice, diretto e funzionale.',
    'about-p3':              "Non è per tutti. Ed è proprio questo il punto.",
    'about-explore-btn':     'Vedi i Prodotti →',
    'about-stat-support':    'Supporto Diretto',
    'about-stat-access':     'Accesso Controllato',
    'about-stat-premium':    'Strumenti Premium',
    'about-stat-lang':       'Supporto multilingue',
    'about-kd-tagline':      'Accesso privato a strumenti premium',
    'about-values-h2':       'Come operiamo',
    'about-values-accent':   'davvero',
    'about-values-sub':      'Nessuna promessa vuota. Solo accesso reale.',
    'about-val1-h4':         'Accesso Controllato',
    'about-val1-p':          'Non tutti i prodotti sono sempre disponibili. La disponibilità è limitata.',
    'about-val2-h4':         'Processo Manuale',
    'about-val2-p':          'Ogni ordine viene gestito manualmente per garantire la consegna.',
    'about-val3-h4':         'Selezione',
    'about-val3-p':          'Non elenchiamo tutto. Solo ciò che funziona davvero.',
    'about-val4-h4':         'Supporto Diretto',
    'about-val4-p':          'Nessun ticket. Supporto diretto via WhatsApp.',
    'about-how-h2':          "Come funziona",
    'about-how-accent':      "l'accesso",
    'about-how-sub':         'Semplice, diretto, senza complicazioni.',
    'about-op1-h4':          'Scegli',
    'about-op1-p':           'Sfoglia i prodotti disponibili e scegli quello che ti serve.',
    'about-op2-h4':          'Richiedi',
    'about-op2-p':           "Invia l'ordine con i tuoi dati. Richiede meno di 2 minuti.",
    'about-op3-h4':          'Attiviamo',
    'about-op3-p':           'Dopo la conferma, forniamo accesso e istruzioni.',
    'about-op4-h4':          'Supporto incluso',
    'about-op4-p':           'Per qualsiasi domanda, supporto diretto via WhatsApp. Nessuna fila, nessuna attesa.',
    'about-faq-h2':          'Domande',
    'about-faq-accent':      'Frequenti',
    'about-faq1-q':          'Cos\'è esattamente KitsDigitalia?',
    'about-faq1-a':          'Accesso controllato a strumenti digitali premium. Operiamo in modo indiretto e manuale, con supporto diretto via WhatsApp.',
    'about-faq2-q':          'Perché non è aperto a tutti?',
    'about-faq2-a':          'Per scelta. Limitare il numero di clienti ci permette di mantenere qualità, supporto vicino e consegna rapida.',
    'about-faq3-q':          "Il mio accesso ha smesso di funzionare. Cosa faccio?",
    'about-faq3-a':          "Lo sostituiamo senza costi aggiuntivi. È la nostra garanzia.",
    'about-faq4-q':          'Come completo un ordine?',
    'about-faq4-a':          "Scegli il prodotto, completa il checkout e attendi il contatto via WhatsApp con i tuoi dati di accesso.",
    'about-cta-h2':          'Hai trovato la strada.',
    'about-cta-p':           'In pochi arrivano fin qui. Se ci sei arrivato, approfitta finché c\'è disponibilità.',
    'about-cta-btn1':        'Vedi i Prodotti →',
    'about-cta-btn2':        'Contattaci',
    /* ---- Contact page ---- */
    'contact-badge':         '💬 Siamo Qui per Aiutarti',
    'contact-h1':            '💬 Contattaci',
    'contact-h1-accent':     'e attiva il tuo accesso',
    'contact-sub':           'Fai domande, conferma la disponibilità e completa il tuo ordine su WhatsApp.',
    'contact-reach-h2':      'Contattaci Direttamente',
    'contact-wa-h4':         'WhatsApp',
    'contact-wa-p':          "Risposta più veloce — solitamente online durante l'orario lavorativo. Mandaci un messaggio in qualsiasi momento.",
    'contact-wa-link':       'Chatta su WhatsApp →',
    'contact-email-h4':      'Email',
    'contact-email-p':       "Preferisci l'email? Scrivici e ti risponderemo entro 24 ore nei giorni lavorativi.",
    'contact-ig-h4':         'Instagram',
    'contact-ig-p':          'Seguici per aggiornamenti, consigli e promozioni sui nostri prodotti.',
    'contact-rt-h4':         '⏱️ Tempi di Risposta',
    'contact-rt-wa':         'Meno di 2 ore',
    'contact-rt-email':      'Meno di 24 ore',
    'contact-rt-urgent':     'Risposta prioritaria',
    'contact-form-h3':       'Inviaci un Messaggio',
    'contact-name-label':    'Il Tuo Nome *',
    'contact-name-ph':       'Il tuo nome completo',
    'contact-email-label':   'Indirizzo Email *',
    'contact-phone-label':   'WhatsApp / Telefono (opzionale)',
    'contact-subject-label': 'Oggetto',
    'contact-opt-support':   'Ho bisogno di supporto per un ordine',
    'contact-opt-question':  'Ho una domanda su un prodotto',
    'contact-opt-purchase':  'Voglio fare un acquisto',
    'contact-opt-refund':    'Ho un problema / richiesta di rimborso',
    'contact-opt-other':     'Altro',
    'contact-msg-label':     'Messaggio *',
    'contact-msg-ph':        'Dicci di cosa hai bisogno. Più dettagli fornisci, più velocemente possiamo aiutarti.',
    'contact-submit-btn':    'Invia Messaggio →',
    'contact-privacy':       'Rispettiamo la tua privacy. Le tue informazioni saranno usate solo per rispondere al tuo messaggio.',
    'contact-success-h3':    'Messaggio Inviato!',
    'contact-success-p':     'Grazie per averci contattato. Ti risponderemo presto — di solito entro poche ore.',
    'contact-success-btn':   'Torna alla Home',
    'contact-faq-h2':        'Risposte',
    'contact-faq-accent':    'Rapide',
    'contact-faq-sub':       'La maggior parte delle domande ha risposta qui. Controlla prima di inviare un messaggio!',
    'contact-faq1-q':        'Quanto tempo ci vuole per ricevere il mio accesso?',
    'contact-faq1-a':        "Dopo la conferma del pagamento, la maggior parte degli ordini viene evasa entro 30 minuti-2 ore. Ti invieremo tutto via email.",
    'contact-faq2-q':        "Il mio accesso ha smesso di funzionare. Cosa faccio?",
    'contact-faq2-a':        "Contattaci immediatamente via WhatsApp o email e sostituiremo il tuo accesso subito. Coperto dalla nostra garanzia senza costi aggiuntivi.",
    'contact-faq3-q':        'Posso accedere a più strumenti contemporaneamente?',
    'contact-faq3-a':        "Assolutamente! Puoi ordinare tutti gli strumenti che vuoi. Molti clienti usano ChatGPT Pro, Canva Pro e Spotify insieme.",
    'contact-faq4-q':        'Quali metodi di pagamento accettate?',
    'contact-faq4-a':        "Accettiamo carte di credito/debito, PIX (per clienti brasiliani), PayPal, criptovalute e bonifico bancario.",
    'contact-faq5-q':        'Offrite rimborsi?',
    'contact-faq5-a':        "Garantiamo l'accesso per l'intero periodo acquistato. Se non riusciamo a consegnare ciò che abbiamo promesso, troveremo una soluzione equa.",
    'contact-cta-h2':        'Pronto per i Tuoi Prodotti?',
    'contact-cta-p':         "Non aspettare — inizia a risparmiare oggi e sblocca gli strumenti digitali di cui hai bisogno.",
    'contact-cta-btn':       'Sfoglia Tutti i Prodotti →',
    /* ---- Checkout page ---- */
    'checkout-h1':           'Completa il Tuo',
    'checkout-h1-accent':    'Ordine',
    'checkout-sub':          "Sei a pochi passi dall'ottenere il tuo accesso.",
    'checkout-personal-h3':  '👤 Le Tue Informazioni',
    'checkout-name-label':   'Nome Completo *',
    'checkout-email-label':  'Indirizzo Email *',
    'checkout-email-note':   "(il tuo accesso verrà inviato qui)",
    'checkout-wa-label':     'WhatsApp (opzionale)',
    'checkout-wa-note':      '— per un supporto più rapido',
    'checkout-product-h3':   '🛒 Seleziona il Tuo Prodotto',
    'checkout-product-label':'Prodotto',
    'checkout-dur-1':        '1 Mese',
    'checkout-notes-label':  'Note (opzionale)',
    'checkout-payment-h3':   '💳 Pagamento',
    'checkout-secure-h4':    'Pagamento Sicuro',
    'checkout-secure-p':     'Dopo aver cliccato "Completa Ordine", ti contatteremo via email o WhatsApp con le istruzioni di pagamento. Accettiamo:',
    'checkout-agree':        "Capisco che questo è un servizio di accesso condiviso. Accetto i termini e capisco che l'accesso verrà consegnato via email dopo la conferma del pagamento.",
    'checkout-submit':       '🚀 Completa ordine via WhatsApp',
    'checkout-submit-note':  'Verrai reindirizzato su WhatsApp per completare rapidamente il tuo ordine.',
    'checkout-privacy':      '🛡️ Le tue informazioni sono al sicuro. Non condividiamo mai i tuoi dati con terze parti.',
    'checkout-summary-h3':   "Riepilogo dell'Ordine",
    'checkout-subtotal':     'Subtotale',
    'checkout-discount':     'Sconto',
    'checkout-total':        'Totale',
    'checkout-next-h4':      'Cosa succede dopo?',
    'checkout-next-1':       'Invii il tuo ordine',
    'checkout-next-2':       'Ti inviamo le istruzioni di pagamento via email',
    'checkout-next-3':       'Pagamento confermato → Accesso consegnato',
    'checkout-next-4':       'Inizia subito a usare il tuo strumento',
    'checkout-help-p':       'Hai bisogno di aiuto? Contattaci:',
    'checkout-contact-btn':  '💬 Supporto',
    'checkout-success-h2':   'Ordine Ricevuto!',
    'checkout-success-p':    "Grazie per il tuo acquisto. Stiamo elaborando il tuo ordine e ti invieremo i dati di accesso via email entro 30 minuti.",
    'checkout-success-btn1': 'Sfoglia Altri Prodotti',
    'checkout-success-btn2': 'Contatta il Supporto',
    'badge-guaranteed':      '🛡️ Garantito',
    'badge-fast-delivery':   '⚡ Consegna Rapida',
    'badge-support247':      '💬 Supporto 24/7',
    /* ---- Placeholders ---- */
    'checkout-name-ph':      'Mario Rossi',
    'checkout-email-ph':     'mario@esempio.com',
    'checkout-wa-ph':        '+39 333 000 0000',
    'checkout-notes-ph':     'Richieste speciali o domande...',
    'contact-email-ph':      'tua@email.it',
    'contact-phone-ph':      '+39 333 000 0000',
    /* ---- Labels della messaggio WhatsApp ---- */
    'wa-checkout-greeting':  'Ciao, ho appena fatto un acquisto.',
    'wa-produto':            'Prodotto',
    'wa-valor':              'Prezzo',
    'wa-pedido':             'Ordine',
    'wa-revendedor':         'Referral',
    'wa-direto':             'diretto',
    'wa-nome':               'Nome',
    'wa-email':              'Email',
    'wa-whatsapp':           'WhatsApp',
    'wa-obs':                'Note',
    'wa-aguardo':            'In attesa delle istruzioni di pagamento.',
    'wa-contact-greeting':   'Ciao, vi ho contattato tramite il sito.',
    'wa-assunto':            'Oggetto',
    'wa-mensagem':           'Messaggio',
    'checkout-validation':   'Si prega di compilare nome, email e WhatsApp.',
    /* ---- Sezione Rivenditore ---- */
    'reseller-badge':        '🤝 Programma Rivenditori',
    'reseller-h2':           'Diventa il nostro',
    'reseller-h2-accent':    'Rivenditore',
    'reseller-sub':          'Guadagna commissioni segnalando nuovi clienti. Semplice, veloce e senza investimento iniziale.',
    'reseller-name-label':   'Nome completo',
    'reseller-cpf-label':    'Codice Fiscale',
    'reseller-phone-label':  'Telefono',
    'reseller-name-ph':      'Mario Rossi',
    'reseller-cpf-ph':       'RSSMRA80A01H501U',
    'reseller-phone-ph':     '+39 333 000 0000',
    'reseller-btn':          'Voglio diventare rivenditore →',
    'reseller-privacy':      'Le tue informazioni vengono utilizzate solo per la registrazione al programma rivenditori.',
    'reseller-validation':   'Si prega di compilare nome, codice fiscale e telefono.',
    'wa-reseller-greeting':  'Ciao, voglio diventare rivenditore di KitsDigitalia.',
    'wa-reseller-cpf':       'Codice Fiscale',
    'wa-reseller-phone':     'Telefono',
    /* ---- Dynamic render labels ---- */
    'dynamic-details-btn':   'Dettagli',
    'dynamic-buy-btn':       'Acquista',
    'dynamic-soldout-btn':   'Esaurito',
    /* ---- Products page — social + combos ---- */
    'filter-social':         '📱 Social',
    'cat-social':            'Social Media',
    'combos-section-title':  '🔥 Combo in Evidenza',
    /* ---- Checkout — metodi di pagamento ---- */
    'checkout-payment-method-label': 'Metodo di Pagamento',
    'checkout-pix':          'PIX',
    'checkout-pix-note':     'Brasile · Approvazione immediata',
    'checkout-iban':         'IBAN',
    'checkout-iban-note':    'Europa · Bonifico bancario',
    'checkout-binance':      'Binance',
    'checkout-binance-discount': '7% OFF',
    'checkout-binance-note': 'Crypto · UID: 1229674211',
    'checkout-wa-label':     'WhatsApp *',
    'checkout-soldout-error':"Questo prodotto è esaurito. Scegli un altro prodotto.",
    'checkout-exclusive-notice':"🔒 Gli ordini vengono elaborati manualmente per mantenere l'accesso esclusivo",
    /* ---- Messaggi WA per metodo ---- */
    'wa-pedido-pix':         'Ordine PIX:',
    'wa-pedido-iban':        'Ordine IBAN:',
    'wa-pedido-binance':     'Ordine Binance:',
    'wa-preco-desconto':     'Prezzo scontato',
    'wa-binance-uid':        'UID Binance',
    'prods-urgency':         '🔥 Accessi limitati oggi — alcuni prodotti esauriscono rapidamente',
    'weekly-sales-label':    'vendite questa settimana',
    'detail-activation-hint':'⚡ Attivazione rapida dopo il pagamento',
    'wa-float':              'Contattaci',
    /* ---- PIX Automatico ---- */
    'checkout-cpf-label':        'CPF *',
    'checkout-cpf-ph':           '000.000.000-00',
    'checkout-generating-pix':   '⏳ Generazione PIX...',
    'checkout-pix-payment':      'Pagamento PIX',
    'checkout-copy-pix':         'Copia',
    'checkout-copied':           'Copiato!',
    'checkout-check-payment':    '🔄 Verifica pagamento',
    'checkout-awaiting-payment': 'In attesa del pagamento',
    'checkout-payment-confirmed':'✅ Pagamento confermato!',
    'checkout-send-whatsapp':    'Invia ordine su WhatsApp',
    'checkout-order-number':     "Numero dell'ordine",
    'checkout-pix-instructions': "Apri l'app della tua banca, vai su PIX e usa il codice qui sotto per pagare.",
    'checkout-polling-timeout':  'Tempo scaduto. Clicca "Verifica pagamento" per controllare manualmente.',
    /* ---- I Miei Ordini ---- */
    'nav-my-orders':             '📦 I Miei Ordini',
    'my-orders-title':           'I Miei Ordini',
    'my-orders-sub':             'Controlla lo stato dei tuoi ordini.',
    'my-orders-email-label':     'La tua Email *',
    'my-orders-wa-label':        'Il tuo WhatsApp *',
    'my-orders-search-btn':      '🔍 Cerca Ordini',
    'my-orders-not-found':       'Nessun ordine trovato.',
    'my-orders-order-num':       'Ordine',
    'my-orders-product':         'Prodotto',
    'my-orders-amount':          'Importo',
    'my-orders-payment-method':  'Pagamento',
    'my-orders-payment-status':  'Stato del Pagamento',
    'my-orders-fulfillment':     "Stato dell'Ordine",
    'my-orders-date':            'Data',
    'my-orders-wa-btn':          '💬 WhatsApp',
    'my-orders-refresh':         '🔄 Aggiorna',
    /* ---- Stato di fulfillment ---- */
    'status-aguardando_pagamento': 'In attesa del pagamento',
    'status-pago_ok':              'Pagato ✓',
    'status-em_andamento':         'In elaborazione',
    'status-entregue':             'Consegnato',
    'status-concluido':            'Completato',
    /* ---- Stato del pagamento ---- */
    'pstatus-pending':             'In attesa',
    'pstatus-pending_manual':      'In attesa di conferma',
    'pstatus-paid':                'Pagato',
    'pstatus-failed':              'Fallito',
    'pstatus-expired':             'Scaduto',
    /* ---- WA dopo pagamento PIX ---- */
    'wa-pix-paid-greeting':        "Ciao, ho pagato il mio ordine via PIX.",
    'wa-pagamento':                'Pagamento',
    'wa-status':                   'Stato',
    'wa-pago':                     'Pagato',
  }
};

/* ============================================================
   i18n — Apply Translations
   ============================================================ */
function setLang(lang, persist = true) {
  if (!i18n[lang]) return;
  if (persist) localStorage.setItem('kd_lang', lang);

  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key  = el.dataset.i18n;
    const text = i18n[lang][key];
    if (text !== undefined) el.textContent = text;
  });

  // Update placeholder attributes too
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key  = el.dataset.i18nPlaceholder;
    const text = i18n[lang][key];
    if (text !== undefined) el.placeholder = text;
  });

  // Highlight active lang button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Re-render dynamic pages when language changes
  if (document.getElementById('aiProducts'))  renderProductsPage();
  if (document.getElementById('detailTitle')) renderProductDetailPage();
  if (document.getElementById('product'))     { renderCheckoutProducts(); updateOrderSummary(); }
}

/* ============================================================
   Auth Utilities — global scope for onclick use
   ============================================================ */
function kdLogout() {
  localStorage.removeItem('kd_isLoggedIn');
  localStorage.removeItem('kd_userEmail');
  // Apaga a sessão do Supabase Auth para que login.html não faça auto-redirect
  // após logout. O SDK armazena a sessão como sb-{projectRef}-auth-token.
  try {
    Object.keys(localStorage)
      .filter(function (k) { return k.startsWith('sb-') && k.includes('-auth-token'); })
      .forEach(function (k) { localStorage.removeItem(k); });
  } catch (e) { /* falha silenciosamente */ }
  const base = window.location.pathname.includes('/pages/') ? '../' : '';
  window.location.href = base + 'index.html';
}

function kdShowUserEmail() {
  const email = localStorage.getItem('kd_userEmail');
  if (!email) return;
  document.querySelectorAll('[data-user-email]').forEach(el => {
    el.textContent = email;
  });
}

function kdCaptureRef() {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref');
  if (ref) {
    const normalized = ref.toLowerCase().trim().replace(/\s+/g, '');
    if (normalized) localStorage.setItem('kd_ref', normalized);
  }
}

/* ============================================================
   DOM Ready
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ---- Floating WhatsApp Button ---- */
  const waFloat = document.createElement('a');
  waFloat.href = 'https://wa.me/393716804204';
  waFloat.target = '_blank';
  waFloat.rel = 'noopener noreferrer';
  waFloat.className = 'wa-float';
  waFloat.innerHTML = '<span class="wa-float__icon">💬</span><span class="wa-float__label" data-i18n="wa-float">Fale conosco</span>';
  document.body.appendChild(waFloat);

  /* ---- Capture referral code ---- */
  kdCaptureRef();

  /* ---- Language init ---- */
  const savedLang = localStorage.getItem('kd_lang') || 'pt';
  setLang(savedLang, false);

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });

  /* ---- Show user email ---- */
  kdShowUserEmail();

  /* ---- Mobile Navigation ---- */
  const hamburger  = document.querySelector('.hamburger');
  const mobileNav  = document.querySelector('.mobile-nav');
  const mobileClose = document.querySelector('.mobile-nav__close');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => mobileNav.classList.add('open'));
    mobileClose?.addEventListener('click', () => mobileNav.classList.remove('open'));
    mobileNav.addEventListener('click', e => {
      if (e.target === mobileNav) mobileNav.classList.remove('open');
    });
  }

  /* ---- Active Nav Link ---- */
  const currentPath = window.location.pathname.split('/').pop();
  document.querySelectorAll('.navbar__links a, .mobile-nav__links a').forEach(link => {
    const href = link.getAttribute('href').split('/').pop().split('?')[0];
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---- FAQ Accordion ---- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ---- Product Filter Bar ---- */
  const filterBtns = document.querySelectorAll('.filter-btn');

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        document.querySelectorAll('.product-card[data-category]').forEach(card => {
          card.parentElement.style.display =
            (cat === 'all' || card.dataset.category === cat) ? '' : 'none';
        });
      });
    });
  }

  /* ---- Smooth scroll ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const el = document.getElementById(a.getAttribute('href').slice(1));
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ---- Checkout: product & payment change listeners ---- */
  const productSelectEl = document.getElementById('product');
  if (productSelectEl) {
    productSelectEl.addEventListener('change', updateOrderSummary);
  }
  document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
    radio.addEventListener('change', () => {
      updateOrderSummary();
      kdToggleCpfField();
    });
  });
  if (productSelectEl) {
    updateOrderSummary();
    kdToggleCpfField();
  }

  /* ---- CPF: exibir somente quando PIX selecionado ---- */
  function kdToggleCpfField() {
    const method   = document.querySelector('input[name="paymentMethod"]:checked')?.value;
    const cpfGroup = document.getElementById('cpfGroup');
    const cpfInput = document.getElementById('cpf');
    if (!cpfGroup || !cpfInput) return;
    const show = (method === 'pix');
    cpfGroup.style.display = show ? '' : 'none';
    cpfInput.required      = show;
  }

  /* ============================================================
     Funções auxiliares do fluxo PIX
     ============================================================ */

  /* Exibe o box PIX com os dados retornados pela API */
  function kdShowPixBox(data) {
    const box = document.getElementById('pixPaymentBox');
    if (!box) return;

    // Order ID
    const orderIdEl = document.getElementById('pixOrderId');
    if (orderIdEl) orderIdEl.textContent = data.orderId || '—';

    // QR Code via URL ou base64
    const qrcodeWrap = document.getElementById('pixQrcodeWrap');
    const qrcodeImg  = document.getElementById('pixQrcodeImg');
    if (qrcodeWrap && qrcodeImg) {
      if (data.qrCodeBase64) {
        qrcodeImg.src = 'data:image/png;base64,' + data.qrCodeBase64;
        qrcodeWrap.style.display = '';
      } else if (data.qrcodeUrl) {
        qrcodeImg.src = data.qrcodeUrl;
        qrcodeWrap.style.display = '';
      }
    }

    // Código copia-e-cola
    const copyWrap  = document.getElementById('pixCopyWrap');
    const copyInput = document.getElementById('pixCopyInput');
    const copyBtn   = document.getElementById('pixCopyBtn');
    if (copyWrap && copyInput && data.copyPaste) {
      copyInput.value       = data.copyPaste;
      copyWrap.style.display = '';
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(data.copyPaste).then(() => {
            const lang = localStorage.getItem('kd_lang') || 'pt';
            const t    = i18n[lang] || i18n.pt;
            const orig = copyBtn.textContent;
            copyBtn.textContent = t['checkout-copied'] || 'Copiado!';
            setTimeout(() => { copyBtn.textContent = orig; }, 2000);
          });
        });
      }
    }

    box.style.display = '';
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* Atualiza o badge de status do PIX box */
  function kdUpdatePixBadge(paymentStatus, lang) {
    const badge = document.getElementById('pixStatusBadge');
    if (!badge) return;
    const t = i18n[lang] || i18n.pt;

    const statusLabels = {
      pending:        t['checkout-awaiting-payment'] || 'Aguardando pagamento',
      pending_manual: t['pstatus-pending_manual']    || 'Aguardando confirmação',
      paid:           t['checkout-payment-confirmed']|| '✅ Pagamento confirmado!',
      failed:         t['pstatus-failed']            || 'Falhou',
      expired:        t['pstatus-expired']           || 'Expirado',
    };

    const colors = {
      pending:        'rgba(255,109,0,.2)',
      pending_manual: 'rgba(255,109,0,.2)',
      paid:           'rgba(74,222,128,.15)',
      failed:         'rgba(239,68,68,.15)',
      expired:        'rgba(239,68,68,.15)',
    };
    const textColors = {
      pending:        'var(--orange)',
      pending_manual: 'var(--orange)',
      paid:           '#4ade80',
      failed:         '#f87171',
      expired:        '#f87171',
    };

    badge.textContent        = statusLabels[paymentStatus] || paymentStatus;
    badge.style.background   = colors[paymentStatus]   || colors.pending;
    badge.style.color        = textColors[paymentStatus] || textColors.pending;
  }

  /* Constrói a mensagem WhatsApp pós-pagamento PIX confirmado */
  function kdBuildWaMessagePostPix({ orderId, productName, amount, customerName, customerEmail, customerWhatsapp, notes, lang }) {
    const t = i18n[lang] || i18n.pt;
    return [
      t['wa-pix-paid-greeting'] || 'Olá, paguei meu pedido via PIX.',
      '',
      (t['wa-pedido']   || 'Pedido')   + ': ' + orderId,
      (t['wa-produto']  || 'Produto')  + ': ' + productName,
      (t['wa-valor']    || 'Valor')    + ': ' + kdFormatPrice(amount),
      (t['wa-nome']     || 'Nome')     + ': ' + customerName,
      (t['wa-email']    || 'Email')    + ': ' + customerEmail,
      (t['wa-whatsapp'] || 'WhatsApp') + ': ' + customerWhatsapp,
      (t['wa-pagamento']|| 'Pagamento')+ ': PIX',
      (t['wa-status']   || 'Status')   + ': ' + (t['wa-pago'] || 'Pago'),
      (t['wa-obs']      || 'Observações') + ': ' + (notes || '—'),
    ].join('\n');
  }

  /* Mostra o botão WhatsApp após pagamento confirmado e redireciona em 3s */
  function kdShowWaButtonPostPix(info) {
    const waBtn = document.getElementById('pixWaBtn');
    if (!waBtn) return;
    const msg   = kdBuildWaMessagePostPix(info);
    const waUrl = 'https://wa.me/393716804204?text=' + encodeURIComponent(msg);
    waBtn.href  = waUrl;
    waBtn.style.display = '';
    waBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Atualiza badge de status para confirmado
    const lang = localStorage.getItem('kd_lang') || 'pt';
    kdUpdatePixBadge('paid', lang);

    // Redirecionamento automático após 3 segundos
    setTimeout(() => { window.location.href = waUrl; }, 3000);
  }

  /* Verifica status do pedido via API */
  async function kdCheckPixStatus(orderId) {
    const resp = await fetch('/api/check-order-status?orderId=' + encodeURIComponent(orderId));
    if (!resp.ok) throw new Error('Erro ao verificar status');
    return resp.json();
  }

  /* Polling: verifica a cada 15s por até 5 minutos */
  function kdStartPixPolling(orderId, customerInfo) {
    const INTERVAL_MS = 15000;
    const MAX_MS      = 5 * 60 * 1000;
    const startTime   = Date.now();
    let   pollTimer   = null;
    const lang        = localStorage.getItem('kd_lang') || 'pt';

    async function poll() {
      try {
        const data = await kdCheckPixStatus(orderId);
        kdUpdatePixBadge(data.paymentStatus, lang);

        if (data.paymentStatus === 'paid') {
          clearTimeout(pollTimer);
          kdShowWaButtonPostPix({ ...customerInfo, orderId, amount: data.amount, lang });
          return;
        }

        if (['failed', 'expired'].includes(data.paymentStatus)) {
          clearTimeout(pollTimer);
          return;
        }
      } catch (e) {
        // Silencioso — próxima iteração tenta de novo
      }

      if (Date.now() - startTime < MAX_MS) {
        pollTimer = setTimeout(poll, INTERVAL_MS);
      } else {
        // Timeout: mostrar mensagem e ocultar indicador de espera
        const timeoutMsg = document.getElementById('pixTimeoutMsg');
        if (timeoutMsg) timeoutMsg.style.display = '';
      }
    }

    // Primeira verificação após 5s
    pollTimer = setTimeout(poll, 5000);

    // Botão manual "Verificar pagamento"
    const checkBtn = document.getElementById('pixCheckBtn');
    if (checkBtn) {
      checkBtn.addEventListener('click', async () => {
        checkBtn.disabled = true;
        checkBtn.textContent = '⏳';
        clearTimeout(pollTimer);
        try {
          const data = await kdCheckPixStatus(orderId);
          kdUpdatePixBadge(data.paymentStatus, lang);
          if (data.paymentStatus === 'paid') {
            kdShowWaButtonPostPix({ ...customerInfo, orderId, amount: data.amount, lang });
          } else {
            // Retoma polling
            pollTimer = setTimeout(poll, INTERVAL_MS);
          }
        } catch (e) {
          pollTimer = setTimeout(poll, INTERVAL_MS);
        } finally {
          const t2 = i18n[lang] || i18n.pt;
          checkBtn.disabled    = false;
          checkBtn.textContent = t2['checkout-check-payment'] || '🔄 Verificar pagamento';
        }
      });
    }
  }

  /* ---- Checkout Form ---- */
  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', async e => {
      e.preventDefault();

      const lang = localStorage.getItem('kd_lang') || 'pt';
      const t    = i18n[lang] || i18n.pt;

      /* Captura dos campos */
      const name      = document.getElementById('name')?.value.trim();
      const email     = document.getElementById('email')?.value.trim();
      const whatsapp  = document.getElementById('whatsapp')?.value.trim();
      const cpf       = document.getElementById('cpf')?.value.trim();
      const productEl = document.getElementById('product');
      const notes     = document.getElementById('notes')?.value.trim();
      const method    = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'pix';

      /* Validação básica */
      if (!name || !email || !whatsapp) {
        alert(t['checkout-validation'] || 'Por favor preencha nome, email e WhatsApp.');
        return;
      }

      /* Resolve produto */
      const productId   = productEl?.value || '';
      const productRaw  = productEl?.options[productEl.selectedIndex]?.text || '';
      const product     = KD_PRODUCTS[productId];

      /* Bloqueia produto esgotado */
      if (product && product.soldOut) {
        alert(t['checkout-soldout-error'] || 'Este produto está esgotado. Por favor escolha outro.');
        return;
      }

      const productLang = product ? (product.translations[lang] || product.translations.pt) : null;
      const productName = productLang ? productLang.name : productRaw;
      const basePrice   = product ? product.price : 0;

      const btn = checkoutForm.querySelector('button[type=submit]');

      /* ========================
         FLUXO PIX AUTOMÁTICO
         ======================== */
      if (method === 'pix') {
        const cpfDigits = (cpf || '').replace(/\D/g, '');
        if (!cpf || cpfDigits.length !== 11) {
          alert('CPF inválido. Informe os 11 dígitos para pagamento via PIX.');
          document.getElementById('cpf')?.focus();
          return;
        }

        if (btn) { btn.disabled = true; btn.textContent = t['checkout-generating-pix'] || '⏳ Gerando PIX...'; }

        try {
          const resp = await fetch('/api/create-pix-order', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ name, email, whatsapp, cpf, productId, productName, notes }),
          });
          let data;
          try { data = await resp.json(); } catch (_) { data = {}; }

          if (!resp.ok || !data.success) {
            const msg = data.details || data.error || `Erro HTTP ${resp.status} ao gerar PIX.`;
            console.error('[PIX] server error:', msg, data);
            alert(msg);
            if (btn) { btn.disabled = false; btn.textContent = t['checkout-submit'] || '🚀 Finalizar pedido via WhatsApp'; }
            return;
          }

          /* Exibe box PIX */
          kdShowPixBox(data);
          kdUpdatePixBadge('pending', lang);

          /* Inicia polling de status */
          kdStartPixPolling(data.orderId, {
            customerName:      name,
            customerEmail:     email,
            customerWhatsapp:  whatsapp,
            productName,
            notes,
          });

        } catch (err) {
          console.error('[PIX] fetch error:', err);
          alert(err.message || 'Erro de conexão ao gerar PIX. Verifique sua conexão.');
        } finally {
          if (btn) { btn.disabled = false; btn.textContent = t['checkout-submit'] || '🚀 Finalizar pedido via WhatsApp'; }
        }
        return;
      }

      /* ========================
         FLUXO IBAN / BINANCE
         ======================== */
      if (btn) { btn.disabled = true; btn.textContent = '⏳ Salvando pedido...'; }

      const ref     = localStorage.getItem('kd_ref') || (t['wa-direto'] || 'direto');
      const billing = (product && !product.oneTime) ? kdBillingLabel(lang) : '';

      try {
        const resp = await fetch('/api/create-manual-order', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ name, email, whatsapp, productId, productName, paymentMethod: method, notes }),
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.error || 'Erro ao registrar pedido.');

        const orderId   = data.orderId;
        const finalPrice = data.amount;
        const isBinance  = method === 'binance';

        /* Monta mensagem WhatsApp */
        let msg;
        if (isBinance) {
          msg = [
            t['wa-pedido-binance'] || 'Pedido Binance:',
            '',
            (t['wa-produto']       || 'Produto')              + ': ' + productName,
            (t['wa-preco-desconto']|| 'Preço com desconto')   + ': ' + kdFormatPrice(finalPrice) + ' (7% off)',
            (t['wa-binance-uid']   || 'UID Binance')          + ': ' + (data.binanceUid || '1229674211'),
            '',
            (t['wa-nome']          || 'Nome')                 + ': ' + name,
            (t['wa-email']         || 'Email')                + ': ' + email,
            (t['wa-whatsapp']      || 'WhatsApp')             + ': ' + whatsapp,
            '',
            (t['wa-pedido']        || 'Pedido')               + ': ' + orderId,
            (t['wa-revendedor']    || 'Revendedor')           + ': ' + ref,
            '',
            (t['wa-obs']           || 'Observações')          + ': ' + (notes || '—')
          ].join('\n');
        } else {
          msg = [
            t['wa-pedido-iban'] || 'Pedido IBAN:',
            '',
            (t['wa-produto']    || 'Produto')     + ': ' + productName,
            (t['wa-valor']      || 'Valor')       + ': ' + kdFormatPrice(finalPrice) + billing,
            '',
            (t['wa-nome']       || 'Nome')        + ': ' + name,
            (t['wa-email']      || 'Email')       + ': ' + email,
            (t['wa-whatsapp']   || 'WhatsApp')    + ': ' + whatsapp,
            '',
            (t['wa-pedido']     || 'Pedido')      + ': ' + orderId,
            (t['wa-revendedor'] || 'Revendedor')  + ': ' + ref,
            '',
            (t['wa-obs']        || 'Observações') + ': ' + (notes || '—'),
            '',
            t['wa-aguardo'] || 'Aguardo instruções para pagamento.'
          ].join('\n');
        }

        const waUrl = 'https://wa.me/393716804204?text=' + encodeURIComponent(msg);
        setTimeout(() => { window.location.href = waUrl; }, 650);

      } catch (err) {
        console.error('[IBAN/Binance]', err);
        alert('Erro ao registrar pedido. Verifique sua conexão e tente novamente.');
        if (btn) { btn.disabled = false; btn.textContent = t['checkout-submit'] || '🚀 Finalizar pedido via WhatsApp'; }
      }
    });
  }

  /* ---- Contact Form → WhatsApp Redirect ---- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();

      const lang = localStorage.getItem('kd_lang') || 'pt';
      const t    = i18n[lang] || i18n.pt;

      /* Captura dos campos */
      const nome     = document.getElementById('contactName')?.value.trim();
      const email    = document.getElementById('contactEmail')?.value.trim();
      const telefone = document.getElementById('contactPhone')?.value.trim();
      const subjectEl = document.getElementById('subject');
      const assunto  = subjectEl?.options[subjectEl.selectedIndex]?.text || '';
      const mensagem = document.getElementById('message')?.value.trim();

      /* Monta a mensagem para o WhatsApp */
      const msg = [
        t['wa-contact-greeting'] || 'Olá, entrei em contato pelo site.',
        '',
        (t['wa-nome']      || 'Nome')      + ': ' + (nome     || '—'),
        (t['wa-email']     || 'Email')     + ': ' + (email    || '—'),
        (t['wa-whatsapp']  || 'WhatsApp')  + ': ' + (telefone || '—'),
        '',
        (t['wa-assunto']   || 'Assunto')   + ': ' + assunto,
        '',
        (t['wa-mensagem']  || 'Mensagem')  + ':',
        mensagem || '—'
      ].join('\n');

      /* Feedback visual no botão */
      const btn = contactForm.querySelector('button[type=submit]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = '⏳ Redirecionando...';
      }

      /* Redireciona para WhatsApp após pequeno delay */
      const waUrl = 'https://wa.me/393716804204?text=' + encodeURIComponent(msg);
      setTimeout(() => { window.location.href = waUrl; }, 650);
    });
  }

  /* ---- Reseller Form → WhatsApp Redirect ---- */
  const resellerForm = document.getElementById('resellerForm');
  if (resellerForm) {
    resellerForm.addEventListener('submit', e => {
      e.preventDefault();

      const lang = localStorage.getItem('kd_lang') || 'pt';
      const t    = i18n[lang] || i18n.pt;

      const nome     = document.getElementById('resellerName')?.value.trim();
      const cpf      = document.getElementById('resellerCpf')?.value.trim();
      const telefone = document.getElementById('resellerPhone')?.value.trim();

      if (!nome || !cpf || !telefone) {
        alert(t['reseller-validation'] || 'Por favor preencha nome, CPF e telefone.');
        return;
      }

      const msg = [
        t['wa-reseller-greeting'] || 'Olá, quero me tornar revendedor do KitsDigitalia.',
        '',
        (t['wa-nome']          || 'Nome')     + ': ' + nome,
        (t['wa-reseller-cpf']  || 'CPF')      + ': ' + cpf,
        (t['wa-reseller-phone']|| 'Telefone') + ': ' + telefone
      ].join('\n');

      const btn = resellerForm.querySelector('button[type=submit]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = '⏳ Redirecionando...';
      }

      const waUrl = 'https://wa.me/393716804204?text=' + encodeURIComponent(msg);
      setTimeout(() => { window.location.href = waUrl; }, 650);
    });
  }

  /* ---- Scroll Reveal (.reveal class) ---- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ---- Legacy card animation (inner pages without .reveal) ---- */
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.category-card, .product-card, .benefit-card, .testimonial-card').forEach(el => {
    if (!el.closest('.landing-hero') && !el.classList.contains('reveal')) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity .5s ease, transform .5s ease';
      cardObserver.observe(el);
    }
  });

});

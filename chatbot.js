// chatbot.js - ProspenTech Assistant with AI capabilities and button quick replies
// Renamed from NEXA Suggestion Assistant to ProspenTech Assistant

import auth from './auth.js';
import firebaseService from './firebase-service.js';

const languages = {
    english: {
        code: 'en',
        name: 'English',
        welcome: "👋 Hello! I'm NEXA. What language would you like to use?",
        whatName: "What is your name?",
        whatEmail: "Can I get your email please?",
        selectMenu: "Thank you {name}! What would you like to do?",
        whatSuggestion: "What do you think we should improve? Please type your suggestion here:",
        thankYou: "Thank you {name}! Your suggestion has been submitted. Our team will review it and may contact you at {email}.",
        anotherSuggestion: "Would you like to submit another suggestion?",
        invalidLanguage: "I'm sorry, I didn't understand that. Please select your preferred language:",
        goodbye: "Goodbye! Feel free to come back if you need assistance.",
        aiWelcome: "{name}, what would you like to know today? You can ask about:",
        invalidMenu: "Please select either 'Suggestion' or 'Chat to NEXA'",
        aiResponse: "Here's what I found:",
        noData: "I couldn't find any information matching your question.",
        helpText: "You can ask me questions about:",
        suggestion: "Suggestion",
        chat: "Chat to NEXA",
        yes: "Yes",
        no: "No",
        another: "Another Suggestion",
        done: "Done",
        askAnother: "Ask Another Question",
        
        // Application-specific labels
        app_title: "PROSPEN HUB",
        app_subtitle: "IT & Design Unified Project Tracker 2026",
        logged_in_as: "Logged in as:",
        clock_in: "CLOCK IN",
        clock_out: "CLOCK OUT",
        profile: "PROFILE",
        logout: "LOGOUT",
        tech_news: "Tech News",
        statistics: "Statistics",
        settings: "Settings",
        suggestions: "Suggestions",
        
        // Module names
        projects: "Projects",
        tasks: "Tasks",
        updates: "Updates",
        duties: "Team Duties",
        kpis: "KPIs",
        clients: "Client Projects",
        meetings: "Meeting Minutes",
        banners: "Email Banners",
        versions: "Version Board",
        admin: "User Management",
        
        // Feature descriptions
        project_desc: "Track all IT and design projects",
        task_desc: "Manage individual tasks and assignments",
        update_desc: "Post and view team updates",
        duty_desc: "Define team roles and responsibilities",
        kpi_desc: "Track key performance indicators",
        client_desc: "Manage client project requirements",
        meeting_desc: "Document IT meeting minutes",
        banner_desc: "Track email banner assignments",
        version_desc: "Plan feature releases",
        stats_desc: "View attendance and system analytics",
        tech_news_desc: "Stay updated with tech trends",
        
        // Responses
        greeting: "Hi {name}! How can I help you today?",
        whatCanIAsk: "You can ask me about:",
        projectQuery: "Here are the current projects",
        taskQuery: "Here are the tasks",
        userQuery: "Here are the system users",
        dutyQuery: "Here are the team duties",
        kpiQuery: "Here are the KPIs",
        clientQuery: "Here are the client projects",
        meetingQuery: "Here are the meeting minutes",
        bannerQuery: "Here are the email banners",
        versionQuery: "Here are the planned versions",
        statsQuery: "Here are the system statistics"
    },
    afrikaans: {
        code: 'af',
        name: 'Afrikaans',
        welcome: "👋 Hallo! Ek is NEXA. Watter taal wil jy gebruik?",
        whatName: "Wat is jou naam?",
        whatEmail: "Kan ek asseblief jou e-posadres kry?",
        selectMenu: "Dankie {name}! Wat wil jy doen?",
        whatSuggestion: "Wat dink jy moet ons verbeter? Tik asseblief jou voorstel hier:",
        thankYou: "Dankie {name}! Jou voorstel is ingedien. Ons span sal dit hersien en kan jou by {email} kontak.",
        anotherSuggestion: "Wil jy nog 'n voorstel indien?",
        invalidLanguage: "Ek is jammer, ek het dit nie verstaan nie. Kies asseblief jou voorkeurtaal:",
        goodbye: "Totsiens! Kom gerus terug as jy hulp nodig het.",
        aiWelcome: "{name}, wat wil jy vandag weet? Jy kan vra oor:",
        invalidMenu: "Kies asseblief 'Voorstel' of 'Gesels met NEXA'",
        aiResponse: "Hier is wat ek gevind het:",
        noData: "Ek kon geen inligting kry wat by jou vraag pas nie.",
        helpText: "Jy kan my vrae vra oor:",
        suggestion: "Voorstel",
        chat: "Gesels met NEXA",
        yes: "Ja",
        no: "Nee",
        another: "Nog 'n Voorstel",
        done: "Klaar",
        askAnother: "Vra Nog 'n Vraag",
        
        // Application-specific labels
        app_title: "PROSPEN HUB",
        app_subtitle: "IT & Ontwerp Verenigde Projek Spoorder 2026",
        logged_in_as: "Aangemeld as:",
        clock_in: "KLOK IN",
        clock_out: "KLOK UIT",
        profile: "PROFIEL",
        logout: "TEKEN UIT",
        tech_news: "Tegnologie Nuus",
        statistics: "Statistieke",
        settings: "Instellings",
        suggestions: "Voorstelle",
        
        // Module names
        projects: "Projekte",
        tasks: "Take",
        updates: "Opdaterings",
        duties: "Span Pligte",
        kpis: "KPI's",
        clients: "Kliënt Projekte",
        meetings: "Vergadering Notules",
        banners: "E-pos Baniere",
        versions: "Weergawe Bord",
        admin: "Gebruiker Bestuur",
        
        // Feature descriptions
        project_desc: "Volg alle IT en ontwerp projekte",
        task_desc: "Bestuur individuele take en opdragte",
        update_desc: "Plaas en bekyk span opdaterings",
        duty_desc: "Definieer span rolle en verantwoordelikhede",
        kpi_desc: "Volg sleutel prestasie aanwysers",
        client_desc: "Bestuur kliënt projek vereistes",
        meeting_desc: "Dokumenteer IT vergadering notules",
        banner_desc: "Volg e-pos banier toewysings",
        version_desc: "Beplannings kenmerk vrystellings",
        stats_desc: "Bekyk bywoning en stelsel analise",
        tech_news_desc: "Bly op hoogte van tegnologie neigings",
        
        // Responses
        greeting: "Hallo {name}! Hoe kan ek jou vandag help?",
        whatCanIAsk: "Jy kan my vra oor:",
        projectQuery: "Hier is die huidige projekte",
        taskQuery: "Hier is die take",
        userQuery: "Hier is die stelsel gebruikers",
        dutyQuery: "Hier is die span pligte",
        kpiQuery: "Hier is die KPI's",
        clientQuery: "Hier is die kliënt projekte",
        meetingQuery: "Hier is die vergadering notules",
        bannerQuery: "Hier is die e-pos baniere",
        versionQuery: "Hier is die beplande weergawes",
        statsQuery: "Hier is die stelsel statistieke"
    },
    isindebele: {
        code: 'nr',
        name: 'isiNdebele',
        welcome: "👋 Lotjhani! NginguNEXA. Ufuna ukusebenzisa luphi ulimi?",
        whatName: "Ungubani igama lakho?",
        whatEmail: "Ngingathola i-imeyili yakho?",
        selectMenu: "Ngiyabonga {name}! Ufuna ukwenzani?",
        whatSuggestion: "Ucabanga ukuthi yini okufanele siyithuthukise? Sicela uthayiphe isiphakamiso sakho lapha:",
        thankYou: "Ngiyabonga {name}! Isiphakamiso sakho sithunyelwe. Ithimba lethu lizosibuyekeza futhi lingakuthinta ku-{email}.",
        anotherSuggestion: "Ingabe ufisa ukuthumela esinye isiphakamiso?",
        invalidLanguage: "Ngiyaxolisa, angikuzwisisi. Sicela ukhethe ulimi olikhethileyo:",
        goodbye: "Hamba kahle! Uyavuma ukubuya uma udinga usizo.",
        aiWelcome: "{name}, ufuna ukwazani namuhla? Ungabuza nge:",
        invalidMenu: "Sicela ukhethe 'Isiphakamiso' noma 'Xoxa noNEXA'",
        aiResponse: "Nansi into engiyitholile:",
        noData: "Angikwazanga ukuthola ulwazi olufana nombuzo wakho.",
        helpText: "Ungangibuza imibuzo efana nale:",
        suggestion: "Isiphakamiso",
        chat: "Xoxa noNEXA",
        yes: "Yebo",
        no: "Cha",
        another: "Esinye Isiphakamiso",
        done: "Sewenzile",
        askAnother: "Buza Omunye Umbuzo",
        
        // Application-specific labels
        app_title: "I-PROSPEN HUB",
        app_subtitle: "I-IT & Design Yokulandelela Iphrojekthi Emanyanisiweyo 2026",
        logged_in_as: "Ungene njengo:",
        clock_in: "NGENA ISIKHATHI",
        clock_out: "PHUMA ISIKHATHI",
        profile: "IPHROFILI",
        logout: "PHUMA",
        tech_news: "Izindaba Zobuchwepheshe",
        statistics: "Izibalo",
        settings: "Izilungiselelo",
        suggestions: "Iziphakamiso",
        
        // Module names
        projects: "Amaphrojekthi",
        tasks: "Imisebenzi",
        updates: "Izibuyekezo",
        duties: "Imisebenzi yeQembu",
        kpis: "Ama-KPI",
        clients: "Amaphrojekthi wamakhasimende",
        meetings: "Amaminithi emihlangano",
        banners: "Amabhena e-imeyili",
        versions: "Ibhodhi lenguqulo",
        admin: "Ukuphathwa kwabasebenzisi",
        
        // Feature descriptions
        project_desc: "Landelela wonke amaphrojekthi we-IT nokwakha",
        task_desc: "Phatha imisebenzi ngayinye nezabelo",
        update_desc: "Thumela futhi ubuke izibuyekezo zeqembu",
        duty_desc: "Chaza izindima nezimthwalo zeqembu",
        kpi_desc: "Landelela izinkomba zokusebenza ezibalulekile",
        client_desc: "Phatha izidingo zamaphrojekthi wamakhasimende",
        meeting_desc: "Bhala phansi amaminithi emihlangano ye-IT",
        banner_desc: "Landelela izabelo zamabhena e-imeyili",
        version_desc: "Hlela ukukhishwa kwezici",
        stats_desc: "Buka ukuhamba kanye nokuhlaziywa kwesistimu",
        tech_news_desc: "Hlala ubuke izitayela zobuchwepheshe",
        
        // Responses
        greeting: "Sawubona {name}! Ngingakusiza kanjani namuhla?",
        whatCanIAsk: "Ungangibuza nge:",
        projectQuery: "Nanka amaphrojekthi amanje",
        taskQuery: "Nanka imisebenzi",
        userQuery: "Naba abasebenzisi besistimu",
        dutyQuery: "Nanka imisebenzi yeqembu",
        kpiQuery: "Nanka ama-KPI",
        clientQuery: "Nanka amaphrojekthi wamakhasimende",
        meetingQuery: "Nanka amaminithi emihlangano",
        bannerQuery: "Nanka amabhena e-imeyili",
        versionQuery: "Nanka izinguqulo ezihleliwe",
        statsQuery: "Nanka izibalo zesistimu"
    },
    isixhosa: {
        code: 'xh',
        name: 'isiXhosa',
        welcome: "👋 Molo! NdinguNEXA. Ufuna ukusebenzisa luphi ulwimi?",
        whatName: "Ngubani igama lakho?",
        whatEmail: "Ndingayifumana i-imeyili yakho?",
        selectMenu: "Enkosi {name}! Ufuna ukwenza ntoni?",
        whatSuggestion: "Ucinga ukuba yintoni ekufuneka siyiphucule? Nceda ufake isiphakamiso sakho apha:",
        thankYou: "Enkosi {name}! Isiphakamiso sakho sithunyelwe. Iqela lethu liza kusihlola kwaye linokuqhagamshelana nawe kwi-{email}.",
        anotherSuggestion: "Ngaba ufuna ukuthumela esinye isiphakamiso?",
        invalidLanguage: "Ndixolisa, andikuqondi. Nceda ukhethe ulwimi olukhethileyo:",
        goodbye: "Hamba kakuhle! Wamkelekile ukubuya xa ufuna uncedo.",
        aiWelcome: "{name}, ufuna ukwazi ntoni namhlanje? Ungabuza nge:",
        invalidMenu: "Nceda ukhethe 'Isiphakamiso' okanye 'Thetha noNEXA'",
        aiResponse: "Nantsi into endiyifumeneyo:",
        noData: "Andikwazanga ukufumana ulwazi oluhambelana nombuzo wakho.",
        helpText: "Ungandibuza imibuzo efana nale:",
        suggestion: "Isiphakamiso",
        chat: "Thetha noNEXA",
        yes: "Ewe",
        no: "Hayi",
        another: "Esinye Isiphakamiso",
        done: "Yenzekile",
        askAnother: "Buza Omnye Umbuzo",
        
        // Application-specific labels
        app_title: "I-PROSPEN HUB",
        app_subtitle: "I-IT & Design Yokulandelela Iphrojekthi Emanyanisiweyo 2026",
        logged_in_as: "Ungene njengo:",
        clock_in: "NGENA IXESHA",
        clock_out: "PHUMA IXESHA",
        profile: "IPROFILE",
        logout: "PHUMA",
        tech_news: "Iindaba Zobuchwepheshe",
        statistics: "Iinkcukacha-manani",
        settings: "Useto",
        suggestions: "Iingcebiso",
        
        // Module names
        projects: "Iiprojekthi",
        tasks: "Imisebenzi",
        updates: "Uhlaziyo",
        duties: "Imisebenzi yeQela",
        kpis: "I-KPI",
        clients: "Iiprojekthi zabaThenji",
        meetings: "Iimitshuzo zentlanganiso",
        banners: "Iibhena ze-imeyili",
        versions: "Ibhodi yoguqulo",
        admin: "Ulwaphulo lwabasebenzisi",
        
        // Feature descriptions
        project_desc: "Landelela zonke iiprojekthi ze-IT noyilo",
        task_desc: "Lawula imisebenzi kunye nezabelo",
        update_desc: "Thumela kwaye ujonge uhlaziyo lweqela",
        duty_desc: "Chaza iindima kunye noxanduva lweqela",
        kpi_desc: "Landelela izikhombisi zokusebenza eziphambili",
        client_desc: "Lawula iimfuno zeprojekthi yomthengi",
        meeting_desc: "Bhala iimitshuzo zentlanganiso ye-IT",
        banner_desc: "Landelela izabelo zebhena ye-imeyili",
        version_desc: "Cwangcisa ukukhutshwa kweempawu",
        stats_desc: "Jonga ukuya kunye nohlalutyo lwenkqubo",
        tech_news_desc: "Hlala uhlaziyekile ngeendlela zobuchwepheshe",
        
        // Responses
        greeting: "Molo {name}! Ndingakunceda njani namhlanje?",
        whatCanIAsk: "Ungandibuza nge:",
        projectQuery: "Nantsi iiprojekthi zangoku",
        taskQuery: "Nantsi imisebenzi",
        userQuery: "Naba abasebenzisi benkqubo",
        dutyQuery: "Nantsi imisebenzi yeqela",
        kpiQuery: "Nantsi i-KPI",
        clientQuery: "Nantsi iiprojekthi zabaThenji",
        meetingQuery: "Nantsi iimitshuzo zentlanganiso",
        bannerQuery: "Nantsi iibhena ze-imeyili",
        versionQuery: "Nantsi iinguqulelo ezicwangcisiweyo",
        statsQuery: "Nantsi izibalo zenkqubo"
    },
    isizulu: {
        code: 'zu',
        name: 'isiZulu',
        welcome: "👋 Sawubona! NginguNEXA. Ufuna ukusebenzisa luphi ulimi?",
        whatName: "Ubani igama lakho?",
        whatEmail: "Ngingathola i-imeyili yakho?",
        selectMenu: "Ngiyabonga {name}! Ufuna ukwenzani?",
        whatSuggestion: "Ucabanga ukuthi yini okufanele siyithuthukise? Sicela uthayiphe isiphakamiso sakho lapha:",
        thankYou: "Ngiyabonga {name}! Isiphakamiso sakho sithunyelwe. Ithimba lethu lizosibuyekeza futhi lingakuthinta ku-{email}.",
        anotherSuggestion: "Ingabe ufisa ukuthumela esinye isiphakamiso?",
        invalidLanguage: "Ngiyaxolisa, angikuzwisisi. Sicela ukhethe ulimi olikhethile:",
        goodbye: "Hamba kahle! Uyamukelwa ukubuya uma udinga usizo.",
        aiWelcome: "{name}, ufuna ukwazani namuhla? Ungabuza nge:",
        invalidMenu: "Sicela ukhethe 'Isiphakamiso' noma 'Xoxa noNEXA'",
        aiResponse: "Nansi into engiyitholile:",
        noData: "Angikwazanga ukuthola ulwazi olufana nombuzo wakho.",
        helpText: "Ungangibuza imibuzo efana nale:",
        suggestion: "Isiphakamiso",
        chat: "Xoxa noNEXA",
        yes: "Yebo",
        no: "Cha",
        another: "Esinye Isiphakamiso",
        done: "Sesenzekile",
        askAnother: "Buza Omunye Umbuzo",
        
        // Application-specific labels
        app_title: "I-PROSPEN HUB",
        app_subtitle: "I-IT & Design Landelayo Yokulandelela Iphrojekthi 2026",
        logged_in_as: "Ungene ngokuthi:",
        clock_in: "NGENA ISIKHATHI",
        clock_out: "PHUMA ISIKHATHI",
        profile: "IPHROFILI",
        logout: "PHUMA",
        tech_news: "Izindaba Zobuchwepheshe",
        statistics: "Izibalo",
        settings: "Izilungiselelo",
        suggestions: "Iziphakamiso",
        
        // Module names
        projects: "Amaphrojekthi",
        tasks: "Imisebenzi",
        updates: "Izibuyekezo",
        duties: "Imisebenzi yeThimba",
        kpis: "Ama-KPI",
        clients: "Amaphrojekthi wamakhasimende",
        meetings: "Amaminithi emihlangano",
        banners: "Amabhena e-imeyili",
        versions: "Ibhodhi yenguqulo",
        admin: "Ukuphathwa kwabasebenzisi",
        
        // Feature descriptions
        project_desc: "Landelela wonke amaphrojekthi we-IT nokwakha",
        task_desc: "Phatha imisebenzi ngayinye nezabelo",
        update_desc: "Thumela futhi ubuke izibuyekezo zethimba",
        duty_desc: "Chaza izindima nezibopho zethimba",
        kpi_desc: "Landelela izinkomba zokusebenza ezibalulekile",
        client_desc: "Phatha izidingo zamaphrojekthi wamakhasimende",
        meeting_desc: "Bhala phansi amaminithi emihlangano ye-IT",
        banner_desc: "Landelela izabelo zamabhena e-imeyili",
        version_desc: "Hlela ukukhishwa kwezici",
        stats_desc: "Buka ukuya kanye nokuhlaziywa kwesistimu",
        tech_news_desc: "Hlala ubuke izitayela zobuchwepheshe",
        
        // Responses
        greeting: "Sawubona {name}! Ngingakusiza kanjani namuhla?",
        whatCanIAsk: "Ungangibuza nge:",
        projectQuery: "Nanka amaphrojekthi amanje",
        taskQuery: "Nanka imisebenzi",
        userQuery: "Naba abasebenzisi besistimu",
        dutyQuery: "Nanka imisebenzi yethimba",
        kpiQuery: "Nanka ama-KPI",
        clientQuery: "Nanka amaphrojekthi wamakhasimende",
        meetingQuery: "Nanka amaminithi emihlangano",
        bannerQuery: "Nanka amabhena e-imeyili",
        versionQuery: "Nanka izinguqulo ezihleliwe",
        statsQuery: "Nanka izibalo zesistimu"
    },
    sepedi: {
        code: 'nso',
        name: 'Sepedi',
        welcome: "👋 Dumela! Ke NEXA. O batla go šomiša polelo efe?",
        whatName: "Ke mang leina la gago?",
        whatEmail: "Nka hwetša imeile ya gago?",
        selectMenu: "Ke a leboga {name}! O batla go dira eng?",
        whatSuggestion: "O nagana gore ke eng seo re swanetšego go se kaonafatša? Hle ngwale tšhišinyo ya gago mo:",
        thankYou: "Ke a leboga {name}! Tšhišinyo ya gago e rometšwe. Sehlopha sa rena se tla e hlahloba gomme se ka ikgokaganya le wena go {email}.",
        anotherSuggestion: "Na o batla go romela tšhišinyo ye nngwe?",
        invalidLanguage: "Ke kopa tšhwarelo, ga ke a kwešiša. Hle kgetha polelo yeo o e ratago:",
        goodbye: "Šala gabotse! O amogela go boa ge o hloka thušo.",
        aiWelcome: "{name}, o batla go tseba eng lehono? O ka botšiša ka:",
        invalidMenu: "Hle kgetha 'Tšhišinyo' goba 'Bolela le NEXA'",
        aiResponse: "Se ke se se hweditšego:",
        noData: "Ga ke a hwetša tshedimošo ye e nyalelanago le potšišo ya gago.",
        helpText: "O ka mpotšiša dipotšišo tše di swanago le:",
        suggestion: "Tšhišinyo",
        chat: "Bolela le NEXA",
        yes: "Ee",
        no: "Aowa",
        another: "Tšhišinyo Ye Nngwe",
        done: "Go Feleditše",
        askAnother: "Botšiša Potšišo Ye Nngwe",
        
        // Application-specific labels
        app_title: "PROSPEN HUB",
        app_subtitle: "IT & Design Morero wa Phedišišo wo o Kopantšwego 2026",
        logged_in_as: "O tsene bjalo ka:",
        clock_in: "TSENA NAKO",
        clock_out: "ETŠWA NAKONG",
        profile: "POROFELE",
        logout: "TSENYA",
        tech_news: "Ditaba tša Theknolotši",
        statistics: "Dipalopalo",
        settings: "Dithulaganyo",
        suggestions: "Ditšhišinyo",
        
        // Module names
        projects: "Merero",
        tasks: "Mešomo",
        updates: "Dintlafatšo",
        duties: "Mešomo ya Sehlopha",
        kpis: "Di-KPI",
        clients: "Merero ya Bareki",
        meetings: "Ditshupetšo tša Kopano",
        banners: "Dibannara tša Imeile",
        versions: "Boto ya Diphetolelo",
        admin: "Taolo ya Bašomiši",
        
        // Feature descriptions
        project_desc: "Latela merero yohle ya IT le boqapi",
        task_desc: "Laola mešomo le dikabelo ka boyena",
        update_desc: "Romela le go lebelela dintlafatšo tša sehlopha",
        duty_desc: "Hlaloša dikarolo le maikarabelo a sehlopha",
        kpi_desc: "Latela matšhwao a bohlokwa a tšhomo",
        client_desc: "Laola dinyakwa tša morero wa moreki",
        meeting_desc: "Ngwala ditshupetšo tša kopano ya IT",
        banner_desc: "Latela dikabelo tša dibannara tša imeile",
        version_desc: "Rera go lokollwa ga dikarolo",
        stats_desc: "Lebelela go ba gona le tshekatsheko ya sisteme",
        tech_news_desc: "Dula o hlokometše mekgwa ya theknolotši",
        
        // Responses
        greeting: "Dumela {name}! Nka go thuša bjang lehono?",
        whatCanIAsk: "O ka mpotšiša ka:",
        projectQuery: "Se ke merero ya bjale",
        taskQuery: "Se ke mešomo",
        userQuery: "Ba ke bašomiši ba sisteme",
        dutyQuery: "Se ke mešomo ya sehlopha",
        kpiQuery: "Se ke di-KPI",
        clientQuery: "Se ke merero ya bareki",
        meetingQuery: "Se ke ditshupetšo tša kopano",
        bannerQuery: "Se ke dibannara tša imeile",
        versionQuery: "Se ke diphetolelo tše di rulagantšwego",
        statsQuery: "Se ke dipalopalo tša sisteme"
    },
    sesotho: {
        code: 'st',
        name: 'Sesotho',
        welcome: "👋 Dumela! Ke NEXA. O batla ho sebelisa puo efe?",
        whatName: "Ke mang lebitso la hau?",
        whatEmail: "Na nka fumana email ya hau?",
        selectMenu: "Kea leboha {name}! O batla ho etsang?",
        whatSuggestion: "U nahana hore ke eng eo re lokelang ho e ntlafatsa? Ka kopo ngola tlhahiso ea hau mona:",
        thankYou: "Kea leboha {name}! Tlhahiso ea hau e rometsoe. Sehlopha sa rona se tla e hlahloba 'me se ka ikopanya le uena ho {email}.",
        anotherSuggestion: "Na u batla ho romela tlhahiso e 'ngoe?",
        invalidLanguage: "Ke kopa ts'oarelo, ha ke a utlwisisa. Ka kopo khetha puo eo u e ratang:",
        goodbye: "Sala hantle! U amohela ho khutla ha u hloka thuso.",
        aiWelcome: "{name}, u batla ho tseba eng kajeno? O ka mpotsa ka:",
        invalidMenu: "Ka kopo khetha 'Tlhahiso' kapa 'Bua le NEXA'",
        aiResponse: "Sena ke seo ke se fumaneng:",
        noData: "Ha ke a fumana tlhahisoleseling e tsamaellanang le potso ea hau.",
        helpText: "O ka mpotsa lipotso tse kang:",
        suggestion: "Tlhahiso",
        chat: "Bua le NEXA",
        yes: "E",
        no: "Che",
        another: "Tlhahiso e 'Ngoe",
        done: "Qetile",
        askAnother: "Botsa Potso e 'Ngoe",
        
        // Application-specific labels
        app_title: "PROSPEN HUB",
        app_subtitle: "IT & Design Morero o Kopanetsoeng wa Phedišišo 2026",
        logged_in_as: "U kene joalo ka:",
        clock_in: "KENA NAKO",
        clock_out: "TSWA NAKONG",
        profile: "PORAEFELE",
        logout: "TSENYA",
        tech_news: "Ditaba tsa Theknoloji",
        statistics: "Dipalopalo",
        settings: "Dihlophiso",
        suggestions: "Ditlhahiso",
        
        // Module names
        projects: "Merero",
        tasks: "Mesebetsi",
        updates: "Lintlafatso",
        duties: "Mesebetsi ya Sehlopha",
        kpis: "Li-KPI",
        clients: "Merero ya Bareki",
        meetings: "Lintlha tsa Kopano",
        banners: "Libannara tsa Imeile",
        versions: "Boto ya Diphetolelo",
        admin: "Taolo ya Basebelisi",
        
        // Feature descriptions
        project_desc: "Lata merero eohle ea IT le boqapi",
        task_desc: "Laola mesebetsi le likabelo ka bonngoe",
        update_desc: "Romela le ho sheba lintlafatso tsa sehlopha",
        duty_desc: "Hlalosa likarolo le boikarabello ba sehlopha",
        kpi_desc: "Lata matšoao a bohlokoa a ts'ebetso",
        client_desc: "Laola litlhoko tsa morero oa moreki",
        meeting_desc: "Ngola lintlha tsa kopano ea IT",
        banner_desc: "Lata likabelo tsa libannara tsa imeile",
        version_desc: "Rera ho lokolloa ha likarolo",
        stats_desc: "Sheba boteng le tlhahlobo ea sistimi",
        tech_news_desc: "Lula u hlokometse mekhoa ea theknoloji",
        
        // Responses
        greeting: "Dumela {name}! Nka u thusa joang kajeno?",
        whatCanIAsk: "O ka mpotsa ka:",
        projectQuery: "Tsena ke merero ea hajoale",
        taskQuery: "Tsena ke mesebetsi",
        userQuery: "Bana ke basebelisi ba sistimi",
        dutyQuery: "Tsena ke mesebetsi ea sehlopha",
        kpiQuery: "Tsena ke li-KPI",
        clientQuery: "Tsena ke merero ea bareki",
        meetingQuery: "Tsena ke lintlha tsa kopano",
        bannerQuery: "Tsena ke libannara tsa imeile",
        versionQuery: "Tsena ke liphetolelo tse reriloeng",
        statsQuery: "Tsena ke lipalopalo tsa sistimi"
    },
    setswana: {
        code: 'tn',
        name: 'Setswana',
        welcome: "👋 Dumela! Ke NEXA. O batla go dirisa puo efe?",
        whatName: "Ke mang leina la gago?",
        whatEmail: "A nka bona imeile ya gago?",
        selectMenu: "Ke a leboga {name}! O batla go dira eng?",
        whatSuggestion: "O akanya gore ke eng se re tshwanetseng go se tokafatsa? Tshitsinya tshitshinyo ya gago fa:",
        thankYou: "Ke a leboga {name}! Tshitshinyo ya gago e romilwe. Setlhopha sa rona se tla e tlhatlhoba mme se ka ikgolaganya le wena go {email}.",
        anotherSuggestion: "A o batla go romela tshitshinyo e nngwe?",
        invalidLanguage: "Ke kopa tsweetswee, ga ke a go tlhaloganya. Ka tsweetswee kgetha puo e o e ratang:",
        goodbye: "Sala sentle! O amogela go boa fa o tlhoka thuso.",
        aiWelcome: "{name}, o batla go itse eng gompieno? O ka nkopotse ka:",
        invalidMenu: "Ka tsweetswee kgetha 'Tshitshinyo' kgotsa 'Bua le NEXA'",
        aiResponse: "Se ke se se fitlhetsweng:",
        noData: "Ga ke a bona tshedimosetso e e tshwanang le potso ya gago.",
        helpText: "O ka nkopotse dipotso tse di jaaka:",
        suggestion: "Tshitshinyo",
        chat: "Bua le NEXA",
        yes: "Ee",
        no: "Nnyaa",
        another: "Tshitshinyo e Nngwe",
        done: "Go Weditse",
        askAnother: "Botsa Potso e Nngwe",
        
        // Application-specific labels
        app_title: "PROSPEN HUB",
        app_subtitle: "IT & Design Morero o Kopanetsweng wa Phedišišo 2026",
        logged_in_as: "O tsene jalo ka:",
        clock_in: "TSENA NAKO",
        clock_out: "TSWA NAKONG",
        profile: "PORAEFELE",
        logout: "TSENYA",
        tech_news: "Ditaba tsa Theknolotši",
        statistics: "Dipalopalo",
        settings: "Dithulaganyo",
        suggestions: "Ditshitshinyo",
        
        // Module names
        projects: "Merero",
        tasks: "Ditiro",
        updates: "Dintlafatso",
        duties: "Ditiro tsa Setlhopha",
        kpis: "Di-KPI",
        clients: "Merero ya Bareki",
        meetings: "Ditshupetso tsa Kopano",
        banners: "Dibannara tsa Imeile",
        versions: "Boto ya Diphetolelo",
        admin: "Taolo ya Badirisi",
        
        // Feature descriptions
        project_desc: "Lata merero yotlhe ya IT le boqapi",
        task_desc: "Laola ditiro le dikabelo ka bonosi",
        update_desc: "Romela le go leba dintlafatso tsa setlhopha",
        duty_desc: "Tlhalosa dikarolo le maikarabelo a setlhopha",
        kpi_desc: "Lata matshwao a botlhokwa a tiro",
        client_desc: "Laola ditlhokego tsa morero wa moreki",
        meeting_desc: "Kwala ditshupetso tsa kopano ya IT",
        banner_desc: "Lata dikabelo tsa dibannara tsa imeile",
        version_desc: "Rera go gololwa ga dikarolo",
        stats_desc: "Lebelela boteng le tshekatsheko ya sisteme",
        tech_news_desc: "Dula o lebeletse mekgwa ya thekenoloji",
        
        // Responses
        greeting: "Dumela {name}! Nka go thusa jang gompieno?",
        whatCanIAsk: "O ka nkopotse ka:",
        projectQuery: "Tse ke merero ya ga jaana",
        taskQuery: "Tse ke ditiro",
        userQuery: "Ba ke badirisi ba sisteme",
        dutyQuery: "Tse ke ditiro tsa setlhopha",
        kpiQuery: "Tse ke di-KPI",
        clientQuery: "Tse ke merero ya bareki",
        meetingQuery: "Tse ke ditshupetso tsa kopano",
        bannerQuery: "Tse ke dibannara tsa imeile",
        versionQuery: "Tse ke diphetolelo tse di rulagantsweng",
        statsQuery: "Tse ke dipalopalo tsa sisteme"
    },
    siswati: {
        code: 'ss',
        name: 'siSwati',
        welcome: "👋 Sawubona! NginguNEXA. Ufuna kusetjentisa luphi lolwimi?",
        whatName: "Ngubani libito lakho?",
        whatEmail: "Ngingayitfola i-imeyili yakho?",
        selectMenu: "Ngiyabonga {name}! Ufuna kwentani?",
        whatSuggestion: "Ucabanga kutsi yini lokufanele siyitfutfukise? Sicela utayiphe siphakamiso sakho lapha:",
        thankYou: "Ngiyabonga {name}! Siphakamiso sakho sentyelwe. Licembu letfu litakuhlola futsi lingakuthinta ku-{email}.",
        anotherSuggestion: "Ingabe ufuna kwentela lesinye siphakamiso?",
        invalidLanguage: "Ngiyacolisa, angikuveti. Sicela ukhetse lulwimi lolukhetsilekile:",
        goodbye: "Hamba kahle! Wamukelekile kubuyela uma udinga lusito.",
        aiWelcome: "{name}, ufuna kwatini namuhla? Ungabuta nga:",
        invalidMenu: "Sicela ukhetse 'Siphakamiso' noma 'Khuluma naNEXA'",
        aiResponse: "Nasi lokungikutfolele:",
        noData: "Angikwazanga kutfola lwati lolufana nombuto wakho.",
        helpText: "Ungangibuta imibuto lefana nale:",
        suggestion: "Siphakamiso",
        chat: "Khuluma naNEXA",
        yes: "Yebo",
        no: "Cha",
        another: "Lesinye Siphakamiso",
        done: "Sekwentiwe",
        askAnother: "Buza Lomunye Umbuto",
        
        // Application-specific labels
        app_title: "I-PROSPEN HUB",
        app_subtitle: "I-IT & Design Yokulandzelela Iphrojekthi Emanyanisiweyo 2026",
        logged_in_as: "Ungene njengo:",
        clock_in: "NGENA ISIKHATHI",
        clock_out: "PHUMA ISIKHATHI",
        profile: "IPHROFILI",
        logout: "PHUMA",
        tech_news: "Tindzaba Tebuchwepheshe",
        statistics: "Tibalobalo",
        settings: "Tilungiselelo",
        suggestions: "Tiphakamiso",
        
        // Module names
        projects: "Emaphrojekthi",
        tasks: "Imisebenti",
        updates: "Tibuyekezo",
        duties: "Imisebenti yeLicembu",
        kpis: "Tindzawo tekusebenta",
        clients: "Emaphrojekthi eMakhasimende",
        meetings: "Emaminithi emhlangano",
        banners: "Emabhena e-imeyili",
        versions: "Ibhodhi yenguqulo",
        admin: "Kuphathwa kwabasebentisi",
        
        // Feature descriptions
        project_desc: "Landzelela wonkhe emaphrojekthi e-IT nekuklama",
        task_desc: "Phatha imisebenti nekwabelwa ngakunye",
        update_desc: "Thumela futsi ubuke tibuyekezo telicembu",
        duty_desc: "Chaza tindzima netibopho telicembu",
        kpi_desc: "Landzelela tinkhomba tekusebenta letibalulekile",
        client_desc: "Phatha tidzingo temaphrojekthi emakhasimende",
        meeting_desc: "Bhala phansi emaminithi emhlangano we-IT",
        banner_desc: "Landzelela kwabelwa kwemabhena e-imeyili",
        version_desc: "Hlela kukhishwa kwetici",
        stats_desc: "Buka kuba khona nehlatiya lesistimu",
        tech_news_desc: "Hlala ubuke imikhuba yebuchwepheshe",
        
        // Responses
        greeting: "Sawubona {name}! Ngingakusita kanjani namuhla?",
        whatCanIAsk: "Ungangibuta nga:",
        projectQuery: "Nasi emaphrojekthi yamanje",
        taskQuery: "Nasi imisebenti",
        userQuery: "Naba basebentisi besistimu",
        dutyQuery: "Nasi imisebenti yelicembu",
        kpiQuery: "Nasi tindzawo tekusebenta",
        clientQuery: "Nasi emaphrojekthi emakhasimende",
        meetingQuery: "Nasi emaminithi emhlangano",
        bannerQuery: "Nasi emabhena e-imeyili",
        versionQuery: "Nasi tinguqulo letihleliwe",
        statsQuery: "Nasi tibalobalo tesistimu"
    },
    tshivenda: {
        code: 've',
        name: 'Tshivenda',
        welcome: "👋 Ndaa! Ndi NEXA. Ni funa u shumisa luambo luni?",
        whatName: "Ndi wani dzina lavho?",
        whatEmail: "Ndi nga wana email yavho?",
        selectMenu: "Ndi a livhuwa {name}! Ni funa u ita mini?",
        whatSuggestion: "Ni humbula uri ndi mini zwine ra tea u zwi khwinisa? Rangwa u nga nda themendelo yavho afha:",
        thankYou: "Ndi a livhuwa {name}! Themendelo yavho yo rumedzwa. Tshigwada tshashu tshi do i linga nahone tshi nga ni kwama nga {email}.",
        anotherSuggestion: "Naa vha funa u rumela themendelo iṅwe?",
        invalidLanguage: "Ndi kombela khathulo, a thi pfesese. Nangeṋani luambo lwa vhutungu:",
        goodbye: "Swikelelani! Ni dzhenelela u vhuya arali vha tshi toda thuso.",
        aiWelcome: "{name}, ni toda u divha mini namusi? Ni nga vhudzisa nga:",
        invalidMenu: "Ndi khou humbela ni nange 'Themendelo' kana 'Amba na NEXA'",
        aiResponse: "Hezwi ndi zwine nda zwi wana:",
        noData: "A tho kona u wana mafhungo a tshi lingana na mbudziso yavho.",
        helpText: "Ni nga mbudzisa mbudziso dzi ngaho:",
        suggestion: "Themendelo",
        chat: "Amba na NEXA",
        yes: "Ee",
        no: "A-a",
        another: "Iṅwe Themendelo",
        done: "Ho Fhedzwa",
        askAnother: "Vhudzisa Iṅwe Mbudziso",
        
        // Application-specific labels
        app_title: "PROSPEN HUB",
        app_subtitle: "IT & Design Bveledziso ya Phurojekthi yo Vhanganywa 2026",
        logged_in_as: "No dzhena sa:",
        clock_in: "DZHENA TSHIFHINGA",
        clock_out: "FHA HLA TSHA",
        profile: "MBUMBO",
        logout: "FHA HLA",
        tech_news: "Mafhungo a Thekhinolodzhi",
        statistics: "Mbalombalo",
        settings: "Zwi thomiwa",
        suggestions: "Ma themendelo",
        
        // Module names
        projects: "Phurojekthi",
        tasks: "Mishumo",
        updates: "Khwiniso",
        duties: "Mishumo ya Tshigwada",
        kpis: "Dzi-KPI",
        clients: "Phurojekthi dza Vharengi",
        meetings: "Minutshe ya musudaphanda",
        banners: "Mabannara e-imeyili",
        versions: "Bodo ya vheiseni",
        admin: "Ndangulo ya vhashumisi",
        
        // Feature descriptions
        project_desc: "Tevhela phurojekthi dzothe dza IT na mbonalo",
        task_desc: "Langula mishumo na u abela",
        update_desc: "Ruma na u sedza khwiniso dza tshigwada",
        duty_desc: "Talutshedza zwithu na vhudifhinduleli ha tshigwada",
        kpi_desc: "Tevhela zwiambaro zwa ndeme zwa tshumelo",
        client_desc: "Langula zwine zwa todwa kha phurojekthi ya mutengi",
        meeting_desc: "Nwala minutshe ya musudaphanda wa IT",
        banner_desc: "Tevhela u abelwa ha mabannara e-imeyili",
        version_desc: "Rula u bviswa ha zwiimo",
        stats_desc: "Sedza vhudzulo na u saukanya ha sisiteme",
        tech_news_desc: "Dzula no sedza ndila dza thekhinolodzhi",
        
        // Responses
        greeting: "Ndaa {name}! Ndi nga ni thusa hani namusi?",
        whatCanIAsk: "Ni nga vhudzisa nga:",
        projectQuery: "Hezwi ndi phurojekthi dza zwino",
        taskQuery: "Hezwi ndi mishumo",
        userQuery: "Hezwi ndi vhashumisi vha sisiteme",
        dutyQuery: "Hezwi ndi mishumo ya tshigwada",
        kpiQuery: "Hezwi ndi dzi-KPI",
        clientQuery: "Hezwi ndi phurojekthi dza vharengi",
        meetingQuery: "Hezwi ndi minutshe ya musudaphanda",
        bannerQuery: "Hezwi ndi mabannara e-imeyili",
        versionQuery: "Hezwi ndi vheiseni dzine dza rungwa",
        statsQuery: "Hezwi ndi mbalombalo dza sisiteme"
    },
    xitsonga: {
        code: 'ts',
        name: 'Xitsonga',
        welcome: "👋 Avuxeni! Ndzi NEXA. Hi ririmi rihi leri u lavaka ku tirhisa?",
        whatName: "Vito ra wena i mani?",
        whatEmail: "Xana ndzi nga kuma email ya wena?",
        selectMenu: "Ndza khensa {name}! U lava ku endla yini?",
        whatSuggestion: "U ehleketa leswaku hi fanele hi antswisa yini? Hi kombela u thayipa xitsundzuxo xa wena laha:",
        thankYou: "Ndza khensa {name}! Xitsundzuxo xa wena xi rhumeriwile. Xipano xa hina xi ta xi hlola naswona xi nga ku tihlanganisa hi {email}.",
        anotherSuggestion: "Xana u lava ku rhumela xin'wana xitsundzuxo?",
        invalidLanguage: "A ndzi twisisanga. Hi kombela u hlawula ririmi leri u ri tsakelaka:",
        goodbye: "Sala kahle! U amukeriwile ku vuya loko u lava pfuno.",
        aiWelcome: "{name}, u lava ku tiva yini namuntlha? U nga ndzi vutisa hi:",
        invalidMenu: "Hi kombela u hlawula 'Xitsundzuxo' kumbe 'Vulavula na NEXA'",
        aiResponse: "Leswi ndzi swi kumeke:",
        noData: "A ndzi kumanga mahungu lama fambelanaka na xivutiso xa wena.",
        helpText: "U nga ndzi vutisa swivutiso swo tanihi:",
        suggestion: "Xitsundzuxo",
        chat: "Vulavula na NEXA",
        yes: "Ina",
        no: "Doo",
        another: "Xin'wana Xitsundzuxo",
        done: "Hetelekile",
        askAnother: "Vutisa Xivutiso Xin'wana",
        
        // Application-specific labels
        app_title: "PROSPEN HUB",
        app_subtitle: "IT & Design Nxaxamelo wa Phurojeke lowu Hlanganisiweke 2026",
        logged_in_as: "U nghenile tani hi:",
        clock_in: "NGENA NKARHA",
        clock_out: "HUMA NKARHENI",
        profile: "XITIVO",
        logout: "HUMA",
        tech_news: "Mahungu ya Thekinoloji",
        statistics: "Nhlayhelo",
        settings: "Masungulo",
        suggestions: "Switsundzuxo",
        
        // Module names
        projects: "Tipurojeke",
        tasks: "Mitirho",
        updates: "Vuhundzuluxi",
        duties: "Mitirho ya Xipano",
        kpis: "Ti-KPI",
        clients: "Tipurojeke ta Vaxavi",
        meetings: "Timinete ta nkomiso",
        banners: "Mabhanara ya imeyili",
        versions: "Bodo ya vuhundzuluxi",
        admin: "Vulawuri bya Vatirhisi",
        
        // Feature descriptions
        project_desc: "Landzelela tipurojeke hinkwato ta IT na ku endla",
        task_desc: "Lawula mitirho na ku averiwa hi ku kongoma",
        update_desc: "Rhumerisa no vona vuhundzuluxi bya xipano",
        duty_desc: "Hlamusela swivangelo na vutihlamuleri bya xipano",
        kpi_desc: "Landzelela swikombiso swa ntirho leswi nkoka",
        client_desc: "Lawula leswi lavekaka eka purojeke ya muxavi",
        meeting_desc: "Tsala timinete ta nkomiso wa IT",
        banner_desc: "Landzelela ku averiwa ka mabhanara ya imeyili",
        version_desc: "Pulana ku humesiwa ka swiphemu",
        stats_desc: "Vona vukona na nxopaxopo wa sisteme",
        tech_news_desc: "Tshama u langutile maendlelo ya thekinoloji",
        
        // Responses
        greeting: "Avuxeni {name}! Ndzi ku pfuna njhani namuntlha?",
        whatCanIAsk: "U nga ndzi vutisa hi:",
        projectQuery: "Lawa i tipurojeke sweswi",
        taskQuery: "Lawa i mitirho",
        userQuery: "Lawa i vatirhisi va sisteme",
        dutyQuery: "Lawa i mitirho ya xipano",
        kpiQuery: "Lawa i ti-KPI",
        clientQuery: "Lawa i tipurojeke ta vaxavi",
        meetingQuery: "Lawa i timinete ta nkomiso",
        bannerQuery: "Lawa i mabhanara ya imeyili",
        versionQuery: "Lawa i vuhundzuluxi lebyi pulaniweke",
        statsQuery: "Lawa i nhlayhelo wa sisteme"
    }
};

class NexaChatbot {
    constructor() {
        this.conversationState = 'selectLanguage';
        this.userData = {
            name: '',
            email: '',
            suggestion: '',
            language: 'english'
        };
        this.languageMap = {
            'afrikaans': 'afrikaans', 'af': 'afrikaans',
            'english': 'english', 'en': 'english',
            'isindebele': 'isindebele', 'nr': 'isindebele',
            'isixhosa': 'isixhosa', 'xh': 'isixhosa',
            'isizulu': 'isizulu', 'zu': 'isizulu',
            'sepedi': 'sepedi', 'nso': 'sepedi',
            'sesotho': 'sesotho', 'st': 'sesotho',
            'setswana': 'setswana', 'tn': 'setswana',
            'siswati': 'siswati', 'ss': 'siswati',
            'tshivenda': 'tshivenda', 've': 'tshivenda',
            'xitsonga': 'xitsonga', 'ts': 'xitsonga'
        };
        this.aiMode = false;
    }

    init() {
        this.clearChat();
        this.addBotMessage(languages.english.welcome);
        this.addLanguageButtons();
    }

    clearChat() {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
        }
    }

    addBotMessage(text) {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (!messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chatbot-message bot';
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addBotMessageWithButtons(text, buttons) {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (!messagesContainer) return;
        
        const container = document.createElement('div');
        container.className = 'chatbot-message bot with-buttons';
        
        const textDiv = document.createElement('div');
        textDiv.textContent = text;
        container.appendChild(textDiv);
        
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'quick-reply-buttons';
        buttonsDiv.style.display = 'flex';
        buttonsDiv.style.flexWrap = 'wrap';
        buttonsDiv.style.gap = '10px';
        buttonsDiv.style.marginTop = '10px';
        
        buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.className = 'quick-reply-btn';
            btn.textContent = button.text;
            btn.style.padding = '8px 16px';
            btn.style.borderRadius = '20px';
            btn.style.border = 'none';
            btn.style.background = 'var(--accent)';
            btn.style.color = 'var(--bg)';
            btn.style.cursor = 'pointer';
            btn.style.fontWeight = '600';
            btn.style.transition = 'all 0.3s';
            btn.onmouseover = () => {
                btn.style.background = '#0ea5e9';
                btn.style.transform = 'scale(1.05)';
            };
            btn.onmouseout = () => {
                btn.style.background = 'var(--accent)';
                btn.style.transform = 'scale(1)';
            };
            btn.onclick = () => {
                this.addUserMessage(button.text);
                button.action();
            };
            buttonsDiv.appendChild(btn);
        });
        
        container.appendChild(buttonsDiv);
        messagesContainer.appendChild(container);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addUserMessage(text) {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (!messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chatbot-message user';
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addLanguageButtons() {
        const buttons = [
            { text: 'English', action: () => this.handleLanguageSelection('english') },
            { text: 'Afrikaans', action: () => this.handleLanguageSelection('afrikaans') },
            { text: 'isiZulu', action: () => this.handleLanguageSelection('isizulu') },
            { text: 'isiXhosa', action: () => this.handleLanguageSelection('isixhosa') },
            { text: 'Sepedi', action: () => this.handleLanguageSelection('sepedi') },
            { text: 'Sesotho', action: () => this.handleLanguageSelection('sesotho') },
            { text: 'Setswana', action: () => this.handleLanguageSelection('setswana') },
            { text: 'isiNdebele', action: () => this.handleLanguageSelection('isindebele') },
            { text: 'siSwati', action: () => this.handleLanguageSelection('siswati') },
            { text: 'Tshivenda', action: () => this.handleLanguageSelection('tshivenda') },
            { text: 'Xitsonga', action: () => this.handleLanguageSelection('xitsonga') }
        ];
        this.addBotMessageWithButtons('', buttons);
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (!messagesContainer) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chatbot-message bot typing';
        typingDiv.innerHTML = 'NEXA is thinking<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        return typingDiv;
    }

    removeTypingIndicator(typingElement) {
        if (typingElement && typingElement.parentNode) {
            typingElement.parentNode.removeChild(typingElement);
        }
    }

    getRandomThinkingTime() {
        // In AI mode, think between 2-4 seconds
        if (this.aiMode) {
            return Math.floor(Math.random() * 2000) + 2000; // 2-4 seconds
        }
        // In normal mode, think between 1-2 seconds
        return Math.floor(Math.random() * 1000) + 1000; // 1-2 seconds
    }

    handleLanguageSelection(input) {
        const typingIndicator = this.showTypingIndicator();
        
        setTimeout(() => {
            this.removeTypingIndicator(typingIndicator);
            
            const selectedLang = this.languageMap[input.toLowerCase()];
            if (selectedLang) {
                this.userData.language = selectedLang;
                this.conversationState = 'getName';
                this.addBotMessage(languages[this.userData.language].whatName);
            } else {
                this.addBotMessage(languages.english.invalidLanguage);
                this.addLanguageButtons();
            }
        }, this.getRandomThinkingTime());
    }

    handleName(input) {
        const typingIndicator = this.showTypingIndicator();
        
        setTimeout(() => {
            this.removeTypingIndicator(typingIndicator);
            this.userData.name = input;
            this.conversationState = 'getEmail';
            this.addBotMessage(languages[this.userData.language].whatEmail);
        }, this.getRandomThinkingTime());
    }

    handleEmail(input) {
        const typingIndicator = this.showTypingIndicator();
        
        setTimeout(() => {
            this.removeTypingIndicator(typingIndicator);
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(input)) {
                this.userData.email = input;
                this.conversationState = 'selectMenu';
                const message = languages[this.userData.language].selectMenu.replace('{name}', this.userData.name);
                
                const buttons = [
                    { 
                        text: languages[this.userData.language].suggestion, 
                        action: () => {
                            this.conversationState = 'getSuggestion';
                            this.addBotMessage(languages[this.userData.language].whatSuggestion);
                        }
                    },
                    { 
                        text: languages[this.userData.language].chat, 
                        action: () => {
                            // Switch to English for AI chat
                            this.userData.language = 'english';
                            this.aiMode = true;
                            this.conversationState = 'aiChat';
                            const welcomeMsg = languages.english.greeting.replace('{name}', this.userData.name) + '\n\n' +
                                               languages.english.whatCanIAsk + '\n\n' +
                                               '• ' + languages.english.projects + ' - ' + languages.english.project_desc + '\n' +
                                               '• ' + languages.english.tasks + ' - ' + languages.english.task_desc + '\n' +
                                               '• ' + languages.english.updates + ' - ' + languages.english.update_desc + '\n' +
                                               '• ' + languages.english.duties + ' - ' + languages.english.duty_desc + '\n' +
                                               '• ' + languages.english.kpis + ' - ' + languages.english.kpi_desc + '\n' +
                                               '• ' + languages.english.clients + ' - ' + languages.english.client_desc + '\n' +
                                               '• ' + languages.english.meetings + ' - ' + languages.english.meeting_desc + '\n' +
                                               '• ' + languages.english.banners + ' - ' + languages.english.banner_desc + '\n' +
                                               '• ' + languages.english.versions + ' - ' + languages.english.version_desc + '\n' +
                                               '• ' + languages.english.statistics + ' - ' + languages.english.stats_desc + '\n' +
                                               '• ' + languages.english.tech_news + ' - ' + languages.english.tech_news_desc;
                            this.addBotMessage(welcomeMsg);
                            this.addQuickQuestionButtons();
                        }
                    }
                ];
                this.addBotMessageWithButtons(message, buttons);
            } else {
                this.addBotMessage("Please enter a valid email address:");
            }
        }, this.getRandomThinkingTime());
    }

    addQuickQuestionButtons() {
        const buttons = [
            { text: '📋 ' + languages.english.projects, action: () => this.handleAIQuery('list projects') },
            { text: '📋 ' + languages.english.tasks, action: () => this.handleAIQuery('list tasks') },
            { text: '⏳ ' + languages.english.duties, action: () => this.handleAIQuery('list duties') },
            { text: '🎯 ' + languages.english.kpis, action: () => this.handleAIQuery('list kpis') },
            { text: '👥 ' + languages.english.users, action: () => this.handleAIQuery('list users') },
            { text: '💼 ' + languages.english.clients, action: () => this.handleAIQuery('list clients') },
            { text: '📅 ' + languages.english.meetings, action: () => this.handleAIQuery('list meetings') },
            { text: '📊 ' + languages.english.statistics, action: () => this.handleAIQuery('statistics') },
            { text: '❓ ' + languages.english.helpText, action: () => this.showHelp() }
        ];
        this.addBotMessageWithButtons(languages.english.whatCanIAsk, buttons);
    }

    async handleAIQuery(query) {
        const typingIndicator = this.showTypingIndicator();
        
        setTimeout(async () => {
            this.removeTypingIndicator(typingIndicator);
            
            let response = '';
            const currentUser = auth.getCurrentUser();
            const lang = this.userData.language || 'english';
            
            try {
                // Get data from Firebase
                const tasks = await firebaseService.getTasks();
                const projects = await firebaseService.getProjects();
                const updates = await firebaseService.getUpdates();
                const users = await firebaseService.getAllUsers();
                const duties = await firebaseService.getDuties();
                const kpis = await firebaseService.getKPIs();
                const meetings = await firebaseService.getMeetings();
                const versions = await firebaseService.getVersions();
                
                // Process query
                const lowerQuery = query.toLowerCase();
                
                if (lowerQuery.includes('list projects') || lowerQuery.includes('all projects') || lowerQuery.includes(languages.english.projects.toLowerCase())) {
                    const projectsList = Object.values(projects);
                    
                    if (projectsList.length === 0) {
                        response = languages[lang].projectQuery + ":\n\n" + languages[lang].noData;
                    } else {
                        response = "📁 **" + languages[lang].projectQuery + ":**\n\n";
                        response += `**Total:** ${projectsList.length}\n`;
                        
                        const inProgress = projectsList.filter(p => p.status === 'In Progress').length;
                        const completed = projectsList.filter(p => p.status === 'Completed').length;
                        const onHold = projectsList.filter(p => p.status === 'On Hold').length;
                        
                        response += `• **In Progress:** ${inProgress}\n`;
                        response += `• **Completed:** ${completed}\n`;
                        response += `• **On Hold:** ${onHold}\n\n`;
                        
                        response += "**Active Projects:**\n";
                        const activeProjects = projectsList.filter(p => p.status === 'In Progress');
                        
                        if (activeProjects.length > 0) {
                            activeProjects.slice(0, 10).forEach(project => {
                                response += `• **${project.name}** (Lead: ${project.lead})\n`;
                            });
                        } else {
                            response += "• No active projects at the moment.\n";
                        }
                    }
                }
                else if (lowerQuery.includes('list tasks') || lowerQuery.includes('all tasks') || lowerQuery.includes(languages.english.tasks.toLowerCase())) {
                    if (tasks.length === 0) {
                        response = languages[lang].taskQuery + ":\n\n" + languages[lang].noData;
                    } else {
                        response = "📋 **" + languages[lang].taskQuery + ":**\n\n";
                        response += `**Total:** ${tasks.length}\n`;
                        
                        const pending = tasks.filter(t => t.status !== 'Completed').length;
                        const completed = tasks.filter(t => t.status === 'Completed').length;
                        
                        response += `• **Pending:** ${pending}\n`;
                        response += `• **Completed:** ${completed}\n\n`;
                        
                        response += "**Recent Tasks:**\n";
                        tasks.slice(0, 10).forEach(task => {
                            response += `• **${task.title}** (${task.priority || 'Medium'}) - Assigned to: ${task.assignedTo || 'Unassigned'}\n`;
                        });
                    }
                }
                else if (lowerQuery.includes('list duties') || lowerQuery.includes('team duties') || lowerQuery.includes(languages.english.duties.toLowerCase())) {
                    if (duties.length === 0) {
                        response = languages[lang].dutyQuery + ":\n\n" + languages[lang].noData;
                    } else {
                        response = "👥 **" + languages[lang].dutyQuery + ":**\n\n";
                        response += `**Total Duties:** ${duties.length}\n\n`;
                        
                        duties.slice(0, 10).forEach(duty => {
                            response += `• **${duty.name || duty.role}** - Assigned to: ${duty.userName || duty.userId}\n`;
                            if (duty.tasks && duty.tasks.length > 0) {
                                response += `  • Tasks: ${duty.tasks.length}\n`;
                            }
                        });
                    }
                }
                else if (lowerQuery.includes('list kpis') || lowerQuery.includes('kpi') || lowerQuery.includes(languages.english.kpis.toLowerCase())) {
                    if (kpis.length === 0) {
                        response = languages[lang].kpiQuery + ":\n\n" + languages[lang].noData;
                    } else {
                        response = "🎯 **" + languages[lang].kpiQuery + ":**\n\n";
                        response += `**Total KPIs:** ${kpis.length}\n\n`;
                        
                        kpis.slice(0, 10).forEach(kpi => {
                            response += `• **${kpi.name}** - ${kpi.targetValue || 'No target'}\n`;
                            response += `  • Assigned to: ${kpi.userName || kpi.userId}\n`;
                        });
                    }
                }
                else if (lowerQuery.includes('list clients') || lowerQuery.includes('client projects') || lowerQuery.includes(languages.english.clients.toLowerCase())) {
                    // We need to get clients from the clientProjects node
                    const { db, ref, get } = await import('./firebase-config.js');
                    const snapshot = await get(ref(db, 'clientProjects'));
                    const clients = snapshot.exists() ? Object.values(snapshot.val()) : [];
                    
                    if (clients.length === 0) {
                        response = languages[lang].clientQuery + ":\n\n" + languages[lang].noData;
                    } else {
                        response = "💼 **" + languages[lang].clientQuery + ":**\n\n";
                        response += `**Total Clients:** ${clients.length}\n\n`;
                        
                        clients.slice(0, 10).forEach(client => {
                            response += `• **${client.businessName || client.fullName}**\n`;
                            response += `  • Contact: ${client.fullName} (${client.email})\n`;
                            response += `  • Status: ${client.projectStatus || 'Pending'}\n`;
                        });
                    }
                }
                else if (lowerQuery.includes('list meetings') || lowerQuery.includes('meeting minutes') || lowerQuery.includes(languages.english.meetings.toLowerCase())) {
                    if (meetings.length === 0) {
                        response = languages[lang].meetingQuery + ":\n\n" + languages[lang].noData;
                    } else {
                        response = "📅 **" + languages[lang].meetingQuery + ":**\n\n";
                        response += `**Total Meetings:** ${meetings.length}\n\n`;
                        
                        meetings.slice(0, 10).forEach(meeting => {
                            const date = meeting.meetingDate ? new Date(meeting.meetingDate).toLocaleDateString() : 'No date';
                            response += `• **${meeting.title}** (${date})\n`;
                            response += `  • Chairperson: ${meeting.chairperson}\n`;
                        });
                    }
                }
                else if (lowerQuery.includes('list versions') || lowerQuery.includes('version board') || lowerQuery.includes(languages.english.versions.toLowerCase())) {
                    if (versions.length === 0) {
                        response = languages[lang].versionQuery + ":\n\n" + languages[lang].noData;
                    } else {
                        response = "🚀 **" + languages[lang].versionQuery + ":**\n\n";
                        response += `**Total Versions:** ${versions.length}\n\n`;
                        
                        versions.slice(0, 10).forEach(version => {
                            response += `• **${version.version}** - ${version.title}\n`;
                            response += `  • Status: ${version.status} (${version.progress}%)\n`;
                        });
                    }
                }
                else if (lowerQuery.includes('list users') || lowerQuery.includes('system users') || lowerQuery.includes('team members')) {
                    if (users.length === 0) {
                        response = languages[lang].userQuery + ":\n\n" + languages[lang].noData;
                    } else {
                        response = "👤 **" + languages[lang].userQuery + ":**\n\n";
                        
                        users.forEach(user => {
                            const online = user.online ? '🟢 Online' : '⚪ Offline';
                            response += `• **${user.fullName || user.username}** (${user.role || 'Team Member'}) - ${online}\n`;
                        });
                    }
                }
                else if (lowerQuery.includes('statistic') || lowerQuery.includes('overview') || lowerQuery.includes(languages.english.statistics.toLowerCase())) {
                    const projectsList = Object.values(projects);
                    
                    response = "📊 **" + languages[lang].statsQuery + ":**\n\n";
                    
                    response += "**Projects:**\n";
                    response += `• **Total:** ${projectsList.length}\n`;
                    response += `• **In Progress:** ${projectsList.filter(p => p.status === 'In Progress').length}\n`;
                    response += `• **Completed:** ${projectsList.filter(p => p.status === 'Completed').length}\n\n`;
                    
                    response += "**Tasks:**\n";
                    response += `• **Total:** ${tasks.length}\n`;
                    response += `• **Pending:** ${tasks.filter(t => t.status !== 'Completed').length}\n`;
                    response += `• **Completed:** ${tasks.filter(t => t.status === 'Completed').length}\n\n`;
                    
                    response += "**Updates:**\n";
                    response += `• **Total:** ${updates.length}\n\n`;
                    
                    response += "**Duties:**\n";
                    response += `• **Total:** ${duties.length}\n`;
                    response += `• **Active:** ${duties.filter(d => d.status === 'Active').length}\n\n`;
                    
                    response += "**KPIs:**\n";
                    response += `• **Total:** ${kpis.length}\n`;
                    response += `• **Active:** ${kpis.filter(k => k.status === 'Active').length}\n\n`;
                    
                    response += "**Users:**\n";
                    response += `• **Total:** ${users.length}\n`;
                    response += `• **Online:** ${users.filter(u => u.online).length}\n`;
                }
                else if (lowerQuery.includes('help') || lowerQuery.includes('what can i ask')) {
                    this.showHelp();
                    return;
                }
                else if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
                    response = languages[lang].greeting.replace('{name}', this.userData.name) + '\n\n' +
                               languages[lang].whatCanIAsk + '\n\n' +
                               '• ' + languages.english.projects + '\n' +
                               '• ' + languages.english.tasks + '\n' +
                               '• ' + languages.english.updates + '\n' +
                               '• ' + languages.english.duties + '\n' +
                               '• ' + languages.english.kpis + '\n' +
                               '• ' + languages.english.clients + '\n' +
                               '• ' + languages.english.meetings + '\n' +
                               '• ' + languages.english.versions + '\n' +
                               '• ' + languages.english.statistics + '\n' +
                               '• ' + languages.english.tech_news;
                }
                else {
                    response = languages.english.helpText + '\n\n' + 
                               "• **Projects** - Show all projects\n" +
                               "• **Tasks** - Show all tasks\n" +
                               "• **Duties** - Show team duties\n" +
                               "• **KPIs** - Show KPIs\n" +
                               "• **Clients** - Show client projects\n" +
                               "• **Meetings** - Show meeting minutes\n" +
                               "• **Versions** - Show version board\n" +
                               "• **Users** - Show system users\n" +
                               "• **Statistics** - System overview\n" +
                               "• **Updates** - Show recent updates";
                }
                
                this.addBotMessage(response);
                
                // Ask if they want another question
                setTimeout(() => {
                    const buttons = [
                        { text: languages.english.askAnother, action: () => {
                            this.addBotMessage(languages.english.greeting.replace('{name}', this.userData.name));
                            this.addQuickQuestionButtons();
                        }},
                        { text: languages.english.done, action: () => {
                            this.addBotMessage(languages.english.goodbye);
                            setTimeout(() => this.closeChatbot(), 2000);
                        }}
                    ];
                    this.addBotMessageWithButtons('Would you like to ask another question?', buttons);
                }, 1000);
                
            } catch (error) {
                console.error('Error processing AI query:', error);
                this.addBotMessage("I'm sorry, I encountered an error while fetching information. Please try again.");
            }
        }, this.getRandomThinkingTime());
    }

    showHelp() {
        const helpText = languages.english.helpText + '\n\n' +
            "• **Projects** - Show all projects\n" +
            "• **Tasks** - Show all tasks\n" +
            "• **Duties** - Show team duties\n" +
            "• **KPIs** - Show KPIs\n" +
            "• **Clients** - Show client projects\n" +
            "• **Meetings** - Show meeting minutes\n" +
            "• **Versions** - Show version board\n" +
            "• **Users** - Show system users\n" +
            "• **Statistics** - System overview\n" +
            "• **Updates** - Show recent updates\n" +
            "• **Tech News** - Latest technology news\n" +
            "• **My Tasks** - Tasks assigned to you\n" +
            "• **Active Projects** - Current projects\n" +
            "• **Help** - Show this help menu";
        
        this.addBotMessage(helpText);
        
        setTimeout(() => {
            const buttons = [
                { text: languages.english.askAnother, action: () => {
                    this.addBotMessage(languages.english.aiWelcome.replace('{name}', this.userData.name));
                    this.addQuickQuestionButtons();
                }},
                { text: languages.english.done, action: () => {
                    this.addBotMessage(languages.english.goodbye);
                    setTimeout(() => this.closeChatbot(), 2000);
                }}
            ];
            this.addBotMessageWithButtons('What would you like to do?', buttons);
        }, 1000);
    }

    handleSuggestion(input) {
        const typingIndicator = this.showTypingIndicator();
        
        setTimeout(() => {
            this.removeTypingIndicator(typingIndicator);
            
            this.userData.suggestion = input;
            this.saveSuggestion();
            
            const thankYouMsg = languages[this.userData.language].thankYou
                .replace('{name}', this.userData.name)
                .replace('{email}', this.userData.email);
            this.addBotMessage(thankYouMsg);
            
            setTimeout(() => {
                const buttons = [
                    { text: languages[this.userData.language].another, action: () => {
                        this.userData = { name: this.userData.name, email: this.userData.email, language: this.userData.language };
                        this.conversationState = 'getSuggestion';
                        this.addBotMessage(languages[this.userData.language].whatSuggestion);
                    }},
                    { text: languages[this.userData.language].done, action: () => {
                        this.addBotMessage(languages[this.userData.language].goodbye);
                        setTimeout(() => this.closeChatbot(), 2000);
                    }}
                ];
                this.addBotMessageWithButtons(languages[this.userData.language].anotherSuggestion, buttons);
            }, 1000);
        }, this.getRandomThinkingTime());
    }

    closeChatbot() {
        const chatbotWindow = document.getElementById('chatbotWindow');
        if (chatbotWindow) {
            chatbotWindow.style.display = 'none';
        }
        this.reset();
    }

    reset() {
        this.clearChat();
        this.conversationState = 'selectLanguage';
        this.userData = { name: '', email: '', suggestion: '', language: 'english' };
        this.aiMode = false;
    }

    async saveSuggestion() {
        const suggestion = {
            id: 'suggestion_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            name: this.userData.name,
            email: this.userData.email,
            suggestion: this.userData.suggestion,
            timestamp: new Date().toISOString(),
            read: false,
            status: 'new',
            language: this.userData.language,
            type: 'suggestion'
        };
        
        try {
            await firebaseService.saveEnquiry(suggestion);
            if (window.updateSuggestionIndicator) {
                window.updateSuggestionIndicator();
            }
            
            const delay = Math.floor(Math.random() * 15000) + 15000;
            setTimeout(() => {
                if (typeof showCustomModal === 'function') {
                    showCustomModal('New Suggestion', `New suggestion received from ${this.userData.name}`, 'info');
                }
            }, delay);
        } catch (error) {
            console.error('Error saving suggestion:', error);
        }
    }

    formatDate(dateStr) {
        if (!dateStr) return 'No date';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
        } catch (e) {
            return 'Invalid date';
        }
    }

    processMessage(inputText) {
        this.addUserMessage(inputText);
        inputText = inputText.toLowerCase().trim();

        switch(this.conversationState) {
            case 'selectLanguage':
                this.handleLanguageSelection(inputText);
                break;
            case 'getName':
                this.handleName(inputText);
                break;
            case 'getEmail':
                this.handleEmail(inputText);
                break;
            case 'getSuggestion':
                this.handleSuggestion(inputText);
                break;
            case 'aiChat':
                this.handleAIQuery(inputText);
                break;
            case 'selectMenu':
                // Handle menu selection via buttons only
                break;
        }
    }
}

let nexaChatbot = new NexaChatbot();

function initChatbot() {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    
    if (!chatbotToggle) {
        setTimeout(initChatbot, 500);
        return;
    }
    
    chatbotToggle.onclick = function() {
        if (!chatbotWindow) return;
        
        if (chatbotWindow.style.display === 'flex') {
            nexaChatbot.closeChatbot();
        } else {
            chatbotWindow.style.display = 'flex';
            nexaChatbot.init();
            const chatbotInput = document.getElementById('chatbotInput');
            if (chatbotInput) {
                setTimeout(() => chatbotInput.focus(), 100);
            }
        }
    };
    
    if (chatbotClose) {
        chatbotClose.onclick = function() {
            nexaChatbot.closeChatbot();
        };
    }
}

function handleChatInput(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatbotInput');
    if (!input) return;
    
    const message = input.value.trim();
    
    if (message) {
        nexaChatbot.processMessage(message);
        input.value = '';
        input.focus();
    }
}

async function updateSuggestionIndicator() {
    try {
        const suggestions = await firebaseService.getEnquiries();
        const unreadSuggestions = suggestions.filter(s => !s.read && s.type === 'suggestion').length;
        const indicator = document.getElementById('enquiryIndicator');
        
        if (indicator) {
            if (unreadSuggestions > 0) {
                indicator.style.display = 'flex';
                indicator.textContent = unreadSuggestions > 9 ? '9+' : unreadSuggestions;
                indicator.title = `${unreadSuggestions} new suggestion${unreadSuggestions > 1 ? 's' : ''}`;
            } else {
                indicator.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Error updating suggestion indicator:', error);
    }
}

window.initChatbot = initChatbot;
window.handleChatInput = handleChatInput;
window.sendChatMessage = sendChatMessage;
window.updateSuggestionIndicator = updateSuggestionIndicator;
window.nexaChatbot = nexaChatbot;
window.closeChatbot = function() {
    nexaChatbot.closeChatbot();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(initChatbot, 500));
} else {
    setTimeout(initChatbot, 500);
}
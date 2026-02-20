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
        aiWelcome: "{name}, what would you like to know today?",
        invalidMenu: "Please select either 'Suggestion' or 'Chat to NEXA'",
        aiResponse: "Here's what I found:",
        noData: "I couldn't find any information matching your question.",
        helpText: "You can ask me questions like:",
        suggestion: "Suggestion",
        chat: "Chat to NEXA",
        yes: "Yes",
        no: "No",
        another: "Another Suggestion",
        done: "Done",
        askAnother: "Ask Another Question"
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
        aiWelcome: "{name}, wat wil jy vandag weet?",
        invalidMenu: "Kies asseblief 'Voorstel' of 'Gesels met NEXA'",
        aiResponse: "Hier is wat ek gevind het:",
        noData: "Ek kon geen inligting kry wat by jou vraag pas nie.",
        helpText: "Jy kan my vrae vra soos:",
        suggestion: "Voorstel",
        chat: "Gesels met NEXA",
        yes: "Ja",
        no: "Nee",
        another: "Nog 'n Voorstel",
        done: "Klaar",
        askAnother: "Vra Nog 'n Vraag"
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
        aiWelcome: "{name}, ufuna ukwazani namuhla?",
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
        askAnother: "Buza Omunye Umbuzo"
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
        aiWelcome: "{name}, ufuna ukwazi ntoni namhlanje?",
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
        askAnother: "Buza Omnye Umbuzo"
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
        aiWelcome: "{name}, ufuna ukwazani namuhla?",
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
        askAnother: "Buza Omunye Umbuzo"
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
        aiWelcome: "{name}, o batla go tseba eng lehono?",
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
        askAnother: "Botšiša Potšišo Ye Nngwe"
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
        aiWelcome: "{name}, u batla ho tseba eng kajeno?",
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
        askAnother: "Botsa Potso e 'Ngoe"
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
        aiWelcome: "{name}, o batla go itse eng gompieno?",
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
        askAnother: "Botsa Potso e Nngwe"
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
        aiWelcome: "{name}, ufuna kwatini namuhla?",
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
        askAnother: "Buza Lomunye Umbuto"
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
        aiWelcome: "{name}, ni toda u divha mini namusi?",
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
        askAnother: "Vhudzisa Iṅwe Mbudziso"
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
        aiWelcome: "{name}, u lava ku tiva yini namuntlha?",
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
        askAnother: "Vutisa Xivutiso Xin'wana"
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
                            const welcomeMsg = languages.english.aiWelcome.replace('{name}', this.userData.name);
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
            { text: '📋 List Projects', action: () => this.handleAIQuery('list projects') },
            { text: '📋 List Tasks', action: () => this.handleAIQuery('list tasks') },
            { text: '📊 Pending Tasks', action: () => this.handleAIQuery('pending tasks') },
            { text: '✅ Completed Tasks', action: () => this.handleAIQuery('completed tasks') },
            { text: '👤 My Tasks', action: () => this.handleAIQuery('my tasks') },
            { text: '📈 Statistics', action: () => this.handleAIQuery('statistics') },
            { text: '❓ Help', action: () => this.showHelp() }
        ];
        this.addBotMessageWithButtons('Quick questions:', buttons);
    }

    async handleAIQuery(query) {
        const typingIndicator = this.showTypingIndicator();
        
        setTimeout(async () => {
            this.removeTypingIndicator(typingIndicator);
            
            let response = '';
            const currentUser = auth.getCurrentUser();
            
            try {
                // Get data from Firebase
                const tasks = await firebaseService.getTasks();
                const projects = await firebaseService.getProjects();
                const updates = await firebaseService.getUpdates();
                
                // Process query
                const lowerQuery = query.toLowerCase();
                
                if (lowerQuery.includes('list projects') || lowerQuery.includes('all projects')) {
                    const projectsList = Object.values(projects);
                    
                    if (projectsList.length === 0) {
                        response = "📁 **Projects Overview:**\n\nNo projects found.";
                    } else {
                        response = "📁 **Projects Overview:**\n\n";
                        response += `**Total Projects:** ${projectsList.length}\n`;
                        
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
                                const dueDate = new Date(project.due);
                                const now = new Date();
                                const daysLeft = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
                                const dueText = daysLeft > 0 ? `Due in ${daysLeft} days` : (daysLeft === 0 ? 'Due today' : 'Overdue');
                                response += `• **${project.name}** (Lead: ${project.lead}) - ${dueText}\n`;
                            });
                        } else {
                            response += "• No active projects at the moment.\n";
                        }
                    }
                }
                else if (lowerQuery.includes('list tasks') || lowerQuery.includes('all tasks')) {
                    if (tasks.length === 0) {
                        response = "📋 **Tasks Overview:**\n\nNo tasks found.";
                    } else {
                        response = "📋 **Tasks Overview:**\n\n";
                        response += `**Total Tasks:** ${tasks.length}\n`;
                        
                        const pending = tasks.filter(t => t.status !== 'Completed').length;
                        const completed = tasks.filter(t => t.status === 'Completed').length;
                        const overdue = tasks.filter(t => t.status === 'Overdue').length;
                        
                        response += `• **Pending:** ${pending}\n`;
                        response += `• **Completed:** ${completed}\n`;
                        response += `• **Overdue:** ${overdue}\n\n`;
                        
                        response += "**Recent Tasks:**\n";
                        tasks.slice(0, 10).forEach(task => {
                            const priorityEmoji = task.priority === 'High' || task.priority === 'Critical' ? '⚠️' : '•';
                            const statusEmoji = task.status === 'Completed' ? '✅' : 
                                               (task.status === 'In Progress' ? '🔄' : 
                                               (task.status === 'Overdue' ? '❌' : '⏳'));
                            
                            response += `${statusEmoji} **${task.title}** (${task.priority || 'Medium'})\n`;
                            response += `  • Assigned to: ${task.assignedTo || 'Unassigned'}\n`;
                            response += `  • Status: ${task.status}\n`;
                            response += `  • Due: ${this.formatDate(task.dueDate)}\n`;
                        });
                    }
                }
                else if (lowerQuery.includes('pending task') || lowerQuery.includes('incomplete task')) {
                    const pendingTasks = tasks.filter(t => t.status !== 'Completed');
                    
                    if (pendingTasks.length === 0) {
                        response = "✅ **Pending Tasks:**\n\nNo pending tasks! All tasks are completed.";
                    } else {
                        response = `📋 **Pending Tasks:**\n\n`;
                        response += `There are **${pendingTasks.length}** pending tasks.\n`;
                        
                        const highPriority = pendingTasks.filter(t => t.priority === 'High' || t.priority === 'Critical');
                        if (highPriority.length > 0) {
                            response += `⚠️ **${highPriority.length}** of them are high priority or critical.\n\n`;
                        }
                        
                        response += "**Recent pending tasks:**\n";
                        pendingTasks.slice(0, 8).forEach(task => {
                            const priorityEmoji = task.priority === 'High' || task.priority === 'Critical' ? '⚠️ ' : '• ';
                            const dueDate = new Date(task.dueDate);
                            const now = new Date();
                            const daysLeft = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
                            const dueText = daysLeft > 0 ? `${daysLeft} days left` : (daysLeft === 0 ? 'Due today' : 'Overdue');
                            
                            response += `${priorityEmoji}**${task.title}**\n`;
                            response += `  • **Assigned to:** ${task.assignedTo || 'Unassigned'}\n`;
                            response += `  • **Priority:** ${task.priority || 'Medium'}\n`;
                            response += `  • **Due:** ${this.formatDate(task.dueDate)} (${dueText})\n`;
                        });
                    }
                }
                else if (lowerQuery.includes('completed task')) {
                    const completedTasks = tasks.filter(t => t.status === 'Completed');
                    
                    if (completedTasks.length === 0) {
                        response = "✅ **Completed Tasks:**\n\nNo completed tasks found.";
                    } else {
                        response = `✅ **Completed Tasks:**\n\n`;
                        response += `There are **${completedTasks.length}** completed tasks.\n\n`;
                        
                        response += "**Recently completed:**\n";
                        completedTasks.slice(0, 8).forEach(task => {
                            response += `• **${task.title}**\n`;
                            response += `  • **Assigned to:** ${task.assignedTo || 'Unassigned'}\n`;
                            response += `  • **Completed on:** ${this.formatDate(task.completionDate || task.lastUpdated)}\n`;
                        });
                    }
                }
                else if (lowerQuery.includes('my task') || lowerQuery.includes('assigned to me')) {
                    if (currentUser) {
                        const myTasks = tasks.filter(t => t.assignedTo === currentUser.username);
                        
                        if (myTasks.length === 0) {
                            response = `👤 **Your Tasks (${currentUser.username}):**\n\nNo tasks assigned to you.`;
                        } else {
                            response = `👤 **Your Tasks (${currentUser.username}):**\n\n`;
                            response += `**Total:** ${myTasks.length}\n`;
                            
                            const pending = myTasks.filter(t => t.status !== 'Completed').length;
                            const completed = myTasks.filter(t => t.status === 'Completed').length;
                            
                            response += `• **Pending:** ${pending}\n`;
                            response += `• **Completed:** ${completed}\n\n`;
                            
                            if (pending > 0) {
                                response += "**Your pending tasks:**\n";
                                myTasks.filter(t => t.status !== 'Completed').slice(0, 8).forEach(task => {
                                    const priorityEmoji = task.priority === 'High' || task.priority === 'Critical' ? '⚠️ ' : '• ';
                                    const dueDate = new Date(task.dueDate);
                                    const now = new Date();
                                    const daysLeft = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
                                    const dueText = daysLeft > 0 ? `${daysLeft} days left` : (daysLeft === 0 ? 'Due today' : 'Overdue');
                                    
                                    response += `${priorityEmoji}**${task.title}**\n`;
                                    response += `  • **Priority:** ${task.priority || 'Medium'}\n`;
                                    response += `  • **Status:** ${task.status}\n`;
                                    response += `  • **Due:** ${this.formatDate(task.dueDate)} (${dueText})\n`;
                                });
                            }
                        }
                    } else {
                        response = "Please log in to see your tasks.";
                    }
                }
                else if (lowerQuery.includes('statistic') || lowerQuery.includes('overview')) {
                    const tasksList = tasks;
                    const projectsList = Object.values(projects);
                    const updatesList = updates;
                    
                    response = "📊 **System Statistics:**\n\n";
                    
                    response += "**Tasks:**\n";
                    response += `• **Total:** ${tasksList.length}\n`;
                    response += `• **Pending:** ${tasksList.filter(t => t.status !== 'Completed').length}\n`;
                    response += `• **In Progress:** ${tasksList.filter(t => t.status === 'In Progress').length}\n`;
                    response += `• **Completed:** ${tasksList.filter(t => t.status === 'Completed').length}\n`;
                    response += `• **Overdue:** ${tasksList.filter(t => t.status === 'Overdue').length}\n\n`;
                    
                    response += "**Projects:**\n";
                    response += `• **Total:** ${projectsList.length}\n`;
                    response += `• **In Progress:** ${projectsList.filter(p => p.status === 'In Progress').length}\n`;
                    response += `• **Completed:** ${projectsList.filter(p => p.status === 'Completed').length}\n`;
                    response += `• **On Hold:** ${projectsList.filter(p => p.status === 'On Hold').length}\n\n`;
                    
                    response += `**Updates:** ${updatesList.length} total updates\n`;
                }
                else if (lowerQuery.includes('help') || lowerQuery.includes('what can i ask')) {
                    this.showHelp();
                    return;
                }
                else {
                    response = languages.english.helpText + '\n\n' + 
                               "• **List Projects** - Show all projects\n" +
                               "• **List Tasks** - Show all tasks\n" +
                               "• **How many tasks are pending?** - Show pending tasks\n" +
                               "• **Show my tasks** - Tasks assigned to you\n" +
                               "• **Which projects are in progress?** - Active projects\n" +
                               "• **How many updates are there?** - Updates count\n" +
                               "• **What's the status of projects?** - Project overview\n" +
                               "• **Show me statistics** - System overview";
                }
                
                this.addBotMessage(response);
                
                // Ask if they want another question
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
            "• **List Projects** - Show all projects\n" +
            "• **List Tasks** - Show all tasks\n" +
            "• **Pending Tasks** - Show tasks that aren't completed\n" +
            "• **Completed Tasks** - Show completed tasks\n" +
            "• **My Tasks** - Tasks assigned to you\n" +
            "• **In Progress Projects** - Active projects\n" +
            "• **Statistics** - System overview\n" +
            "• **How many tasks are pending?** - Quick count\n" +
            "• **Show active projects** - Current projects\n" +
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
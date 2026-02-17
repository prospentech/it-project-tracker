// NEXA Chatbot with all South African official languages including Xitsonga
const languages = {
    english: {
        code: 'en',
        name: 'English',
        welcome: "👋 Hello! I'm NEXA. What language would you like to use?",
        whatName: "What is your name?",
        whatEmail: "Can I get your email please?",
        whatEnquiry: "Please type your enquiry here:",
        thankYou: "Thank you {name}! Your enquiry has been submitted. Our team will contact you at {email} soon.",
        anotherEnquiry: "Would you like to submit another enquiry? (yes/no)",
        invalidLanguage: "I'm sorry, I didn't understand that. Please type the name of your preferred language:",
        goodbye: "Goodbye! Feel free to come back if you have more enquiries."
    },
    afrikaans: {
        code: 'af',
        name: 'Afrikaans',
        welcome: "👋 Hallo! Ek is NEXA. Watter taal wil jy gebruik?",
        whatName: "Wat is jou naam?",
        whatEmail: "Kan ek asseblief jou e-posadres kry?",
        whatEnquiry: "Tik asseblief jou navraag hier:",
        thankYou: "Dankie {name}! Jou navraag is ingedien. Ons span sal binnekort by {email} kontak maak.",
        anotherEnquiry: "Wil jy nog 'n navraag indien? (ja/nee)",
        invalidLanguage: "Ek is jammer, ek het dit nie verstaan nie. Tik asseblief die naam van jou voorkeurtaal:",
        goodbye: "Totsiens! Kom gerus terug as jy nog navrae het."
    },
    isindebele: {
        code: 'nr',
        name: 'isiNdebele',
        welcome: "👋 Lotjhani! NginguNEXA. Ufuna ukusebenzisa luphi ulimi?",
        whatName: "Ungubani igama lakho?",
        whatEmail: "Ngingathola i-imeyili yakho?",
        whatEnquiry: "Sicela uthayiphe umbuzo wakho lapha:",
        thankYou: "Ngiyabonga {name}! Umbuzo wakho uthunyelwe. Iqembu lethu lizoxhumana nawe ku-{email} maduzane.",
        anotherEnquiry: "Ingabe ufuna ukuthumela omunye umbuzo? (yebo/cha)",
        invalidLanguage: "Ngiyaxolisa, angikuzwisisi. Sicela uthayiphe igama lolimi olukhethileyo:",
        goodbye: "Hamba kahle! Uyavuma ukubuya uma uneminye imibuzo."
    },
    isixhosa: {
        code: 'xh',
        name: 'isiXhosa',
        welcome: "👋 Molo! NdinguNEXA. Ufuna ukusebenzisa luphi ulwimi?",
        whatName: "Ngubani igama lakho?",
        whatEmail: "Ndingayifumana i-imeyili yakho?",
        whatEnquiry: "Nceda ufake umbuzo wakho apha:",
        thankYou: "Enkosi {name}! Umbuzo wakho uthunyelwe. Iqela lethu liza kudibana nawe kwi-{email} kungekudala.",
        anotherEnquiry: "Ingaba ufuna ukuthumela omnye umbuzo? (ewe/hayi)",
        invalidLanguage: "Ndixolisa, andikuqondi. Nceda ufake igama lolwimi olukhethileyo:",
        goodbye: "Hamba kakuhle! Uyamkela ukubuya ukuba uneminye imibuzo."
    },
    isizulu: {
        code: 'zu',
        name: 'isiZulu',
        welcome: "👋 Sawubona! NginguNEXA. Ufuna ukusebenzisa luphi ulimi?",
        whatName: "Ubani igama lakho?",
        whatEmail: "Ngingathola i-imeyili yakho?",
        whatEnquiry: "Sicela uthayiphe umbuzo wakho lapha:",
        thankYou: "Ngiyabonga {name}! Umbuzo wakho uthunyelwe. Iqembu lethu lizoxhumana nawe ku-{email} maduzane.",
        anotherEnquiry: "Ingabe ufuna ukuthumela omunye umbuzo? (yebo/cha)",
        invalidLanguage: "Ngiyaxolisa, angikuzwisisi. Sicela uthayiphe igama lolimi olikhethile:",
        goodbye: "Hamba kahle! Uyamukela ukubuya uma uneminye imibuzo."
    },
    sepedi: {
        code: 'nso',
        name: 'Sepedi',
        welcome: "👋 Dumela! Ke NEXA. O batla go šomiša polelo efe?",
        whatName: "Ke mang leina la gago?",
        whatEmail: "Nka hwetša imeile ya gago?",
        whatEnquiry: "Hle ngwale potšišo ya gago mo:",
        thankYou: "Ke a leboga {name}! Potšišo ya gago e rometšwe. Sehlopha sa rena se tla ikgokaganya le wena go {email} ka pela.",
        anotherEnquiry: "Na o batla go romela potšišo ye nngwe? (ee/aowa)",
        invalidLanguage: "Ke kopa tšhwarelo, ga ke a kwešiša. Hle o ngwale leina la polelo yeo o e ratago:",
        goodbye: "Šala gabotse! O amogela go boa ge o na le dipotšišo tše dingwe."
    },
    sesotho: {
        code: 'st',
        name: 'Sesotho',
        welcome: "👋 Dumela! Ke NEXA. O batla ho sebelisa puo efe?",
        whatName: "Ke mang lebitso la hau?",
        whatEmail: "Na nka fumana email ya hau?",
        whatEnquiry: "Ka kopo ngola potso ya hau mona:",
        thankYou: "Kea leboha {name}! Potso ya hau e rometsoe. Sehlopha sa rona se tla ikopanya le uena ho {email} haufinyane.",
        anotherEnquiry: "Na o batla ho romela potso e ngoe? (e/che)",
        invalidLanguage: "Ke kopa ts'oarelo, ha ke a utlwisisa. Ka kopo ngola lebitso la puo eo o e ratang:",
        goodbye: "Sala hantle! O amohela ho boela ha o na le lipotso tse ling."
    },
    setswana: {
        code: 'tn',
        name: 'Setswana',
        welcome: "👋 Dumela! Ke NEXA. O batla go dirisa puo efe?",
        whatName: "Ke mang leina la gago?",
        whatEmail: "A nka bona imeile ya gago?",
        whatEnquiry: "Tshitsinya potso ya gago fa:",
        thankYou: "Ke a leboga {name}! Potso ya gago e romilwe. Setlhopha sa rona se tla ikgolaganya le wena go {email} ka bonako.",
        anotherEnquiry: "A o batla go romela potso e nngwe? (ee/nnyaa)",
        invalidLanguage: "Ke kopa tsweetswee, ga ke a go tlhaloganya. Tshitsinya leina la puo e o e ratang:",
        goodbye: "Sala sentle! O amogela go boa fa o na le dipotso tse dingwe."
    },
    siswati: {
        code: 'ss',
        name: 'siSwati',
        welcome: "👋 Sawubona! NginguNEXA. Ufuna kusetjentisa luphi lolwimi?",
        whatName: "Ngubani libito lakho?",
        whatEmail: "Ngingayitfola i-imeyili yakho?",
        whatEnquiry: "Sicela utayiphe umbuto wakho lapha:",
        thankYou: "Ngiyabonga {name}! Umbuto wakho wentyelwe. Lihlombe letfu litakukhulumisisa kwi-{email} ngesikhatsi lesidze.",
        anotherEnquiry: "Ingabe ufuna kwentela lomunye umbuto? (yebo/cha)",
        invalidLanguage: "Ngiyacolisa, angikuveti. Sicela utayiphe libito lelwimi lolukhetsilekile:",
        goodbye: "Hamba kahle! Uyamukela kubuyela uma uneminye imibuto."
    },
    tshivenda: {
        code: 've',
        name: 'Tshivenda',
        welcome: "👋 Ndaa! Ndi NEXA. U funa u shumisa luambo luni?",
        whatName: "Ndi wani dzina lavho?",
        whatEmail: "Ndi nga wana email yavho?",
        whatEnquiry: "Rangwa u nga nda mbudziso yavho afha:",
        thankYou: "Ndi a livhuwa {name}! Mbudziso yavho yo rumedzwa. Tshigwada tshashu tshi do vha tshi khou khou ita nga {email} nga maswathini.",
        anotherEnquiry: "Naa vha funa u rumela mbudziso yoṱhe? (ee/a-a)",
        invalidLanguage: "Ndi kombela khathulo, a thi pfesese. Rangwa u nga nda dzina la luambo lwa vhutungu ho vha vha:",
        goodbye: "Swikelelani! Vha tanganedza u vhuya arali vha na mbudziso dzoṱhe."
    },
    xitsonga: {
        code: 'ts',
        name: 'Xitsonga',
        welcome: "👋 Avuxeni! Ndzi NEXA. Hi ririmi rihi leri u lavaka ku tirhisa?\n\nHi kombela u thayipa vito ra ririmi leri u ri tsakelaka:",
        whatName: "Vito ra wena i mani?",
        whatEmail: "Xana ndzi nga kuma email ya wena?",
        whatEnquiry: "Hi kombela u thayipa xivutiso xa wena laha:",
        thankYou: "Ndza khensa {name}! Xivutiso xa wena xi rhumeriwile. Xipano xa hina xi ta ku tihlanganisa hi {email} hi ku hatlisa.",
        anotherEnquiry: "Xana u lava ku rhumela xin'wana xivutiso? (ina/doo)",
        invalidLanguage: "A ndzi twisisanga. Hi kombela u thayipa vito ra ririmi leri u ri tsakelaka:",
        goodbye: "Sala kahle! U nga tlhela u vuya loko u ri na swivutiso swin'wana."
    }
};

class NexaChatbot {
    constructor() {
        this.conversationState = 'selectLanguage';
        this.userData = {
            name: '',
            email: '',
            enquiry: '',
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
    }

    init() {
        this.clearChat();
        this.addBotMessage(languages.english.welcome);
    }

    clearChat() {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
        }
        localStorage.removeItem('nexaChatHistory');
    }

    addBotMessage(text) {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (!messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chatbot-message bot';
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        this.saveToHistory({ type: 'bot', text: text, timestamp: new Date().toISOString() });
    }

    addUserMessage(text) {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (!messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chatbot-message user';
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        this.saveToHistory({ type: 'user', text: text, timestamp: new Date().toISOString() });
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (!messagesContainer) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chatbot-message bot typing';
        typingDiv.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        return typingDiv;
    }

    removeTypingIndicator(typingElement) {
        if (typingElement && typingElement.parentNode) {
            typingElement.parentNode.removeChild(typingElement);
        }
    }

    saveToHistory(message) {
        let history = JSON.parse(localStorage.getItem('nexaChatHistory')) || [];
        history.push(message);
        localStorage.setItem('nexaChatHistory', JSON.stringify(history.slice(-100)));
    }

    getRandomThinkingTime() {
        // Returns random time between 3000 and 5000 milliseconds (3-5 seconds)
        return Math.floor(Math.random() * 2000) + 3000;
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
            case 'getEnquiry':
                this.handleEnquiry(inputText);
                break;
            case 'askNewEnquiry':
                this.handleNewEnquiry(inputText);
                break;
        }
    }

    handleLanguageSelection(input) {
        const typingIndicator = this.showTypingIndicator();
        const thinkingTime = this.getRandomThinkingTime();
        
        setTimeout(() => {
            this.removeTypingIndicator(typingIndicator);
            
            const selectedLang = this.languageMap[input];
            if (selectedLang) {
                this.userData.language = selectedLang;
                this.conversationState = 'getName';
                this.addBotMessage(languages[this.userData.language].whatName);
            } else {
                this.addBotMessage(languages.english.invalidLanguage);
            }
        }, thinkingTime);
    }

    handleName(input) {
        const typingIndicator = this.showTypingIndicator();
        const thinkingTime = this.getRandomThinkingTime();
        
        setTimeout(() => {
            this.removeTypingIndicator(typingIndicator);
            
            this.userData.name = input;
            this.conversationState = 'getEmail';
            this.addBotMessage(languages[this.userData.language].whatEmail);
        }, thinkingTime);
    }

    handleEmail(input) {
        const typingIndicator = this.showTypingIndicator();
        const thinkingTime = this.getRandomThinkingTime();
        
        setTimeout(() => {
            this.removeTypingIndicator(typingIndicator);
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(input)) {
                this.userData.email = input;
                this.conversationState = 'getEnquiry';
                this.addBotMessage(languages[this.userData.language].whatEnquiry);
            } else {
                this.addBotMessage("Please enter a valid email address:");
            }
        }, thinkingTime);
    }

    handleEnquiry(input) {
        const typingIndicator = this.showTypingIndicator();
        const thinkingTime = this.getRandomThinkingTime();
        
        setTimeout(() => {
            this.removeTypingIndicator(typingIndicator);
            
            this.userData.enquiry = input;
            this.saveEnquiry();
            
            const thankYouMsg = languages[this.userData.language].thankYou
                .replace('{name}', this.userData.name)
                .replace('{email}', this.userData.email);
            this.addBotMessage(thankYouMsg);
            
            setTimeout(() => {
                this.addBotMessage(languages[this.userData.language].anotherEnquiry);
                this.conversationState = 'askNewEnquiry';
            }, 1000);
        }, thinkingTime);
    }

    handleNewEnquiry(input) {
        const typingIndicator = this.showTypingIndicator();
        const thinkingTime = this.getRandomThinkingTime();
        
        setTimeout(() => {
            this.removeTypingIndicator(typingIndicator);
            
            input = input.toLowerCase().trim();
            
            if (input === 'yes' || input === 'yebo' || input === 'ee' || input === 'ja' || input === 'ewe' || input === 'y' || input === 'ina') {
                this.userData = { name: '', email: '', enquiry: '', language: this.userData.language };
                this.conversationState = 'getName';
                this.addBotMessage(languages[this.userData.language].whatName);
            } else if (input === 'no' || input === 'cha' || input === 'aowa' || input === 'che' || input === 'nnyaa' || input === 'nee' || input === 'hayi' || input === 'n' || input === 'doo') {
                this.addBotMessage(languages[this.userData.language].goodbye);
                setTimeout(() => {
                    this.closeChatbot();
                }, 2000);
            } else {
                this.addBotMessage("Please type 'yes' or 'no':");
            }
        }, thinkingTime);
    }

    closeChatbot() {
        const chatbotWindow = document.getElementById('chatbotWindow');
        if (chatbotWindow) {
            chatbotWindow.style.display = 'none';
        }
        this.clearChat();
        this.conversationState = 'selectLanguage';
        this.userData = { name: '', email: '', enquiry: '', language: 'english' };
    }

    saveEnquiry() {
        const enquiry = {
            id: 'enquiry_' + Date.now(),
            name: this.userData.name,
            email: this.userData.email,
            enquiry: this.userData.enquiry,
            timestamp: new Date().toISOString(),
            read: false,
            status: 'new',
            language: this.userData.language
        };
        
        let allEnquiries = JSON.parse(localStorage.getItem('prospenEnquiries')) || [];
        allEnquiries.unshift(enquiry);
        localStorage.setItem('prospenEnquiries', JSON.stringify(allEnquiries));
        
        if (window.updateEnquiryIndicator) {
            updateEnquiryIndicator();
        }
        
        if (typeof showCustomModal === 'function') {
            showCustomModal('New Enquiry', `New enquiry received from ${this.userData.name}`, 'info');
        }
    }
}

let nexaChatbot = new NexaChatbot();

function initChatbot() {
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotClose = document.getElementById('chatbotClose');
    
    if (!chatbotToggle) {
        console.error('Chatbot toggle button not found');
        return;
    }
    
    // Set up toggle button
    chatbotToggle.onclick = function() {
        if (!chatbotWindow) return;
        
        if (chatbotWindow.style.display === 'flex') {
            nexaChatbot.closeChatbot();
        } else {
            chatbotWindow.style.display = 'flex';
            nexaChatbot.init();
            const chatbotInput = document.getElementById('chatbotInput');
            if (chatbotInput) {
                chatbotInput.focus();
            }
        }
    };
    
    // Set up close button - FIXED
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

function updateEnquiryIndicator() {
    const enquiries = JSON.parse(localStorage.getItem('prospenEnquiries')) || [];
    const unreadEnquiries = enquiries.filter(e => !e.read).length;
    const indicator = document.getElementById('enquiryIndicator');
    
    if (indicator) {
        if (unreadEnquiries > 0) {
            indicator.style.display = 'flex';
            indicator.textContent = unreadEnquiries > 9 ? '9+' : unreadEnquiries;
        } else {
            indicator.style.display = 'none';
        }
    }
}

window.initChatbot = initChatbot;
window.handleChatInput = handleChatInput;
window.sendChatMessage = sendChatMessage;
window.updateEnquiryIndicator = updateEnquiryIndicator;
window.nexaChatbot = nexaChatbot;

// Make closeChatbot available globally for the X button
window.closeChatbot = function() {
    nexaChatbot.closeChatbot();
};

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initChatbot, 1000);
});
// NEXA Chatbot with all South African official languages including Xitsonga
// Changed from Enquiries to Suggestions

const languages = {
    english: {
        code: 'en',
        name: 'English',
        welcome: "👋 Hello! I'm NEXA. What language would you like to use?",
        whatName: "What is your name?",
        whatEmail: "Can I get your email please?",
        whatSuggestion: "What do you think we should improve? Please type your suggestion here:",
        thankYou: "Thank you {name}! Your suggestion has been submitted. Our team will review it and may contact you at {email}.",
        anotherSuggestion: "Would you like to submit another suggestion? (yes/no)",
        invalidLanguage: "I'm sorry, I didn't understand that. Please type the name of your preferred language:",
        goodbye: "Goodbye! Feel free to come back if you have more suggestions."
    },
    afrikaans: {
        code: 'af',
        name: 'Afrikaans',
        welcome: "👋 Hallo! Ek is NEXA. Watter taal wil jy gebruik?",
        whatName: "Wat is jou naam?",
        whatEmail: "Kan ek asseblief jou e-posadres kry?",
        whatSuggestion: "Wat dink jy moet ons verbeter? Tik asseblief jou voorstel hier:",
        thankYou: "Dankie {name}! Jou voorstel is ingedien. Ons span sal dit hersien en kan jou by {email} kontak.",
        anotherSuggestion: "Wil jy nog 'n voorstel indien? (ja/nee)",
        invalidLanguage: "Ek is jammer, ek het dit nie verstaan nie. Tik asseblief die naam van jou voorkeurtaal:",
        goodbye: "Totsiens! Kom gerus terug as jy meer voorstelle het."
    },
    isindebele: {
        code: 'nr',
        name: 'isiNdebele',
        welcome: "👋 Lotjhani! NginguNEXA. Ufuna ukusebenzisa luphi ulimi?",
        whatName: "Ungubani igama lakho?",
        whatEmail: "Ngingathola i-imeyili yakho?",
        whatSuggestion: "Ucabanga ukuthi yini okufanele siyithuthukise? Sicela uthayiphe isiphakamiso sakho lapha:",
        thankYou: "Ngiyabonga {name}! Isiphakamiso sakho sithunyelwe. Ithimba lethu lizosibuyekeza futhi lingakuthinta ku-{email}.",
        anotherSuggestion: "Ingabe ufisa ukuthumela esinye isiphakamiso? (yebo/cha)",
        invalidLanguage: "Ngiyaxolisa, angikuzwisisi. Sicela uthayiphe igama lolimi olukhethileyo:",
        goodbye: "Hamba kahle! Uyavuma ukubuya uma unezinye iziphakamiso."
    },
    isixhosa: {
        code: 'xh',
        name: 'isiXhosa',
        welcome: "👋 Molo! NdinguNEXA. Ufuna ukusebenzisa luphi ulwimi?",
        whatName: "Ngubani igama lakho?",
        whatEmail: "Ndingayifumana i-imeyili yakho?",
        whatSuggestion: "Ucinga ukuba yintoni ekufuneka siyiphucule? Nceda ufake isiphakamiso sakho apha:",
        thankYou: "Enkosi {name}! Isiphakamiso sakho sithunyelwe. Iqela lethu liza kusihlola kwaye linokuqhagamshelana nawe kwi-{email}.",
        anotherSuggestion: "Ngaba ufuna ukuthumela esinye isiphakamiso? (ewe/hayi)",
        invalidLanguage: "Ndixolisa, andikuqondi. Nceda ufake igama lolwimi olukhethileyo:",
        goodbye: "Hamba kakuhle! Uyamkela ukubuya ukuba unezinye iziphakamiso."
    },
    isizulu: {
        code: 'zu',
        name: 'isiZulu',
        welcome: "👋 Sawubona! NginguNEXA. Ufuna ukusebenzisa luphi ulimi?",
        whatName: "Ubani igama lakho?",
        whatEmail: "Ngingathola i-imeyili yakho?",
        whatSuggestion: "Ucabanga ukuthi yini okufanele siyithuthukise? Sicela uthayiphe isiphakamiso sakho lapha:",
        thankYou: "Ngiyabonga {name}! Isiphakamiso sakho sithunyelwe. Ithimba lethu lizosibuyekeza futhi lingakuthinta ku-{email}.",
        anotherSuggestion: "Ingabe ufisa ukuthumela esinye isiphakamiso? (yebo/cha)",
        invalidLanguage: "Ngiyaxolisa, angikuzwisisi. Sicela uthayiphe igama lolimi olikhethile:",
        goodbye: "Hamba kahle! Uyamukela ukubuya uma unezinye iziphakamiso."
    },
    sepedi: {
        code: 'nso',
        name: 'Sepedi',
        welcome: "👋 Dumela! Ke NEXA. O batla go šomiša polelo efe?",
        whatName: "Ke mang leina la gago?",
        whatEmail: "Nka hwetša imeile ya gago?",
        whatSuggestion: "O nagana gore ke eng seo re swanetšego go se kaonafatša? Hle ngwale tšhišinyo ya gago mo:",
        thankYou: "Ke a leboga {name}! Tšhišinyo ya gago e rometšwe. Sehlopha sa rena se tla e hlahloba gomme se ka ikgokaganya le wena go {email}.",
        anotherSuggestion: "Na o batla go romela tšhišinyo ye nngwe? (ee/aowa)",
        invalidLanguage: "Ke kopa tšhwarelo, ga ke a kwešiša. Hle o ngwale leina la polelo yeo o e ratago:",
        goodbye: "Šala gabotse! O amogela go boa ge o na le ditšhišinyo tše dingwe."
    },
    sesotho: {
        code: 'st',
        name: 'Sesotho',
        welcome: "👋 Dumela! Ke NEXA. O batla ho sebelisa puo efe?",
        whatName: "Ke mang lebitso la hau?",
        whatEmail: "Na nka fumana email ya hau?",
        whatSuggestion: "U nahana hore ke eng eo re lokelang ho e ntlafatsa? Ka kopo ngola tlhahiso ea hau mona:",
        thankYou: "Kea leboha {name}! Tlhahiso ea hau e rometsoe. Sehlopha sa rona se tla e hlahloba 'me se ka ikopanya le uena ho {email}.",
        anotherSuggestion: "Na u batla ho romela tlhahiso e 'ngoe? (e/che)",
        invalidLanguage: "Ke kopa ts'oarelo, ha ke a utlwisisa. Ka kopo ngola lebitso la puo eo u e ratang:",
        goodbye: "Sala hantle! U amohela ho boela ha u na le litlhahiso tse ling."
    },
    setswana: {
        code: 'tn',
        name: 'Setswana',
        welcome: "👋 Dumela! Ke NEXA. O batla go dirisa puo efe?",
        whatName: "Ke mang leina la gago?",
        whatEmail: "A nka bona imeile ya gago?",
        whatSuggestion: "O akanya gore ke eng se re tshwanetseng go se tokafatsa? Tshitsinya tshitshinyo ya gago fa:",
        thankYou: "Ke a leboga {name}! Tshitshinyo ya gago e romilwe. Setlhopha sa rona se tla e tlhatlhoba mme se ka ikgolaganya le wena go {email}.",
        anotherSuggestion: "A o batla go romela tshitshinyo e nngwe? (ee/nnyaa)",
        invalidLanguage: "Ke kopa tsweetswee, ga ke a go tlhaloganya. Tshitsinya leina la puo e o e ratang:",
        goodbye: "Sala sentle! O amogela go boa fa o na le ditshitshinyo tse dingwe."
    },
    siswati: {
        code: 'ss',
        name: 'siSwati',
        welcome: "👋 Sawubona! NginguNEXA. Ufuna kusetjentisa luphi lolwimi?",
        whatName: "Ngubani libito lakho?",
        whatEmail: "Ngingayitfola i-imeyili yakho?",
        whatSuggestion: "Ucabanga kutsi yini lokufanele siyitfutfukise? Sicela utayiphe siphakamiso sakho lapha:",
        thankYou: "Ngiyabonga {name}! Siphakamiso sakho sentyelwe. Licembu letfu litakuhlola futsi lingakuthinta ku-{email}.",
        anotherSuggestion: "Ingabe ufuna kwentela lesinye siphakamiso? (yebo/cha)",
        invalidLanguage: "Ngiyacolisa, angikuveti. Sicela utayiphe libito lelwimi lolukhetsilekile:",
        goodbye: "Hamba kahle! Uyamukela kubuyela uma unetinye tiphakamiso."
    },
    tshivenda: {
        code: 've',
        name: 'Tshivenda',
        welcome: "👋 Ndaa! Ndi NEXA. U funa u shumisa luambo luni?",
        whatName: "Ndi wani dzina lavho?",
        whatEmail: "Ndi nga wana email yavho?",
        whatSuggestion: "Ni humbula uri ndi mini zwine ra tea u zwi khwinisa? Rangwa u nga nda themendelo yavho afha:",
        thankYou: "Ndi a livhuwa {name}! Themendelo yavho yo rumedzwa. Tshigwada tshashu tshi do i linga nahone tshi nga ni kwama nga {email}.",
        anotherSuggestion: "Naa vha funa u rumela themendelo iṅwe? (ee/a-a)",
        invalidLanguage: "Ndi kombela khathulo, a thi pfesese. Rangwa u nga nda dzina la luambo lwa vhutungu ho vha vha:",
        goodbye: "Swikelelani! Vha tanganedza u vhuya arali vha na themendelo dzoṱhe."
    },
    xitsonga: {
        code: 'ts',
        name: 'Xitsonga',
        welcome: "👋 Avuxeni! Ndzi NEXA. Hi ririmi rihi leri u lavaka ku tirhisa?",
        whatName: "Vito ra wena i mani?",
        whatEmail: "Xana ndzi nga kuma email ya wena?",
        whatSuggestion: "U ehleketa leswaku hi fanele hi antswisa yini? Hi kombela u thayipa xitsundzuxo xa wena laha:",
        thankYou: "Ndza khensa {name}! Xitsundzuxo xa wena xi rhumeriwile. Xipano xa hina xi ta xi hlola naswona xi nga ku tihlanganisa hi {email}.",
        anotherSuggestion: "Xana u lava ku rhumela xin'wana xitsundzuxo? (ina/doo)",
        invalidLanguage: "A ndzi twisisanga. Hi kombela u thayipa vito ra ririmi leri u ri tsakelaka:",
        goodbye: "Sala kahle! U nga tlhela u vuya loko u ri na switsundzuxo swin'wana."
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

    addUserMessage(text) {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (!messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chatbot-message user';
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (!messagesContainer) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chatbot-message bot typing';
        typingDiv.innerHTML = 'NEXA is typing<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
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
            case 'getSuggestion':
                this.handleSuggestion(inputText);
                break;
            case 'askNewSuggestion':
                this.handleNewSuggestion(inputText);
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
                this.conversationState = 'getSuggestion';
                // Greet with name and ask for suggestion
                const greeting = languages[this.userData.language].whatSuggestion;
                this.addBotMessage(`Hi ${this.userData.name}. ${greeting}`);
            } else {
                this.addBotMessage("Please enter a valid email address:");
            }
        }, thinkingTime);
    }

    handleSuggestion(input) {
        const typingIndicator = this.showTypingIndicator();
        const thinkingTime = this.getRandomThinkingTime();
        
        setTimeout(() => {
            this.removeTypingIndicator(typingIndicator);
            
            this.userData.suggestion = input;
            this.saveSuggestion();
            
            const thankYouMsg = languages[this.userData.language].thankYou
                .replace('{name}', this.userData.name)
                .replace('{email}', this.userData.email);
            this.addBotMessage(thankYouMsg);
            
            setTimeout(() => {
                this.addBotMessage(languages[this.userData.language].anotherSuggestion);
                this.conversationState = 'askNewSuggestion';
            }, 1000);
        }, thinkingTime);
    }

    handleNewSuggestion(input) {
        const typingIndicator = this.showTypingIndicator();
        const thinkingTime = this.getRandomThinkingTime();
        
        setTimeout(() => {
            this.removeTypingIndicator(typingIndicator);
            
            input = input.toLowerCase().trim();
            
            // Yes in different languages
            if (input === 'yes' || input === 'yebo' || input === 'ee' || input === 'ja' || input === 'ewe' || input === 'y' || input === 'ina' || input === 'e') {
                this.userData = { name: '', email: '', suggestion: '', language: this.userData.language };
                this.conversationState = 'getName';
                this.addBotMessage(languages[this.userData.language].whatName);
            } 
            // No in different languages
            else if (input === 'no' || input === 'cha' || input === 'aowa' || input === 'che' || input === 'nnyaa' || input === 'nee' || input === 'hayi' || input === 'n' || input === 'doo' || input === 'a-a') {
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
        this.userData = { name: '', email: '', suggestion: '', language: 'english' };
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
        
        // Save to Firebase
        try {
            const { default: firebaseService } = await import('./firebase-service.js');
            await firebaseService.saveEnquiry(suggestion);
            
            // Update indicator
            if (window.updateSuggestionIndicator) {
                window.updateSuggestionIndicator();
            }
            
            // Show notification after 15-30 seconds
            const delay = Math.floor(Math.random() * 15000) + 15000; // 15-30 seconds
            setTimeout(() => {
                if (typeof showCustomModal === 'function') {
                    showCustomModal('New Suggestion', `New suggestion received from ${this.userData.name}`, 'info');
                }
            }, delay);
        } catch (error) {
            console.error('Error saving suggestion:', error);
        }
    }
}

let nexaChatbot = new NexaChatbot();

function initChatbot() {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    
    if (!chatbotToggle) {
        // Try again in a moment if element not found
        setTimeout(initChatbot, 500);
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
                setTimeout(() => chatbotInput.focus(), 100);
            }
        }
    };
    
    // Set up close button
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

// Update suggestion indicator (replaces enquiry indicator)
async function updateSuggestionIndicator() {
    try {
        const { default: firebaseService } = await import('./firebase-service.js');
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

// Make functions available globally
window.initChatbot = initChatbot;
window.handleChatInput = handleChatInput;
window.sendChatMessage = sendChatMessage;
window.updateSuggestionIndicator = updateSuggestionIndicator;
window.nexaChatbot = nexaChatbot;
window.closeChatbot = function() {
    nexaChatbot.closeChatbot();
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(initChatbot, 500));
} else {
    setTimeout(initChatbot, 500);
}
// Theme management
let themeSettings = {};

function applyTheme() {
    const currentUser = auth.getCurrentUser();
    const username = currentUser ? currentUser.username : 'default';
    
    // Load theme settings from localStorage or use defaults
    themeSettings = JSON.parse(localStorage.getItem('prospenTheme_' + username)) || {
        darkMode: true,
        cardColor: '#1e293b',
        accentColor: '#38bdf8',
        fontFamily: "'Inter', sans-serif"
    };
    
    // Apply dark/light mode
    if (themeSettings.darkMode) {
        document.body.classList.remove('light-mode');
        document.documentElement.style.setProperty('--bg', '#020617');
        document.documentElement.style.setProperty('--text-p', '#94a3b8');
        document.documentElement.style.setProperty('--text-h', '#f1f5f9');
    } else {
        document.body.classList.add('light-mode');
        document.documentElement.style.setProperty('--bg', '#f1f5f9');
        document.documentElement.style.setProperty('--text-p', '#475569');
        document.documentElement.style.setProperty('--text-h', '#0f172a');
    }
    
    // Apply colors
    document.documentElement.style.setProperty('--card', themeSettings.cardColor);
    document.documentElement.style.setProperty('--accent', themeSettings.accentColor);
    
    // Calculate glow color (add 40 for opacity)
    const accentColor = themeSettings.accentColor;
    let glowColor = accentColor + '40';
    document.documentElement.style.setProperty('--accent-glow', glowColor);
    
    // Apply font family
    document.body.style.fontFamily = themeSettings.fontFamily;
    
    // Update toggle states if elements exist
    const darkModeToggle = document.getElementById('darkModeToggle');
    const fontFamilySelect = document.getElementById('fontFamily');
    
    if (darkModeToggle) darkModeToggle.checked = themeSettings.darkMode;
    if (fontFamilySelect) fontFamilySelect.value = themeSettings.fontFamily;
    
    updateColorOptions();
}

function toggleDarkMode() {
    const currentUser = auth.getCurrentUser();
    const username = currentUser ? currentUser.username : 'default';
    
    themeSettings.darkMode = !themeSettings.darkMode;
    localStorage.setItem('prospenTheme_' + username, JSON.stringify(themeSettings));
    applyTheme();
    
    // Show confirmation
    if (typeof showCustomModal === 'function') {
        showCustomModal('Theme Updated', 'Dark mode ' + (themeSettings.darkMode ? 'enabled' : 'disabled'), 'success');
    }
}

function setCardColor(color) {
    const currentUser = auth.getCurrentUser();
    const username = currentUser ? currentUser.username : 'default';
    
    themeSettings.cardColor = color;
    localStorage.setItem('prospenTheme_' + username, JSON.stringify(themeSettings));
    applyTheme();
    
    // Show confirmation
    if (typeof showCustomModal === 'function') {
        showCustomModal('Theme Updated', 'Card color changed', 'success');
    }
}

function setAccentColor(color) {
    const currentUser = auth.getCurrentUser();
    const username = currentUser ? currentUser.username : 'default';
    
    themeSettings.accentColor = color;
    localStorage.setItem('prospenTheme_' + username, JSON.stringify(themeSettings));
    applyTheme();
    
    // Show confirmation
    if (typeof showCustomModal === 'function') {
        showCustomModal('Theme Updated', 'Accent color changed', 'success');
    }
}

function setFontFamily(font) {
    const currentUser = auth.getCurrentUser();
    const username = currentUser ? currentUser.username : 'default';
    
    themeSettings.fontFamily = font;
    localStorage.setItem('prospenTheme_' + username, JSON.stringify(themeSettings));
    applyTheme();
    
    // Show confirmation
    if (typeof showCustomModal === 'function') {
        showCustomModal('Theme Updated', 'Font family updated', 'success');
    }
}

function resetSettings() {
    const currentUser = auth.getCurrentUser();
    const username = currentUser ? currentUser.username : 'default';
    
    themeSettings = {
        darkMode: true,
        cardColor: '#1e293b',
        accentColor: '#38bdf8',
        fontFamily: "'Inter', sans-serif"
    };
    localStorage.setItem('prospenTheme_' + username, JSON.stringify(themeSettings));
    applyTheme();
    
    // Show confirmation
    if (typeof showCustomModal === 'function') {
        showCustomModal('Theme Reset', 'All settings restored to default', 'success');
    }
}

function updateColorOptions() {
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('active');
        const bgColor = option.style.background || option.style.backgroundColor;
        if (bgColor && (bgColor === themeSettings.cardColor || bgColor === themeSettings.accentColor)) {
            option.classList.add('active');
        }
    });
}

// Make functions available globally
window.applyTheme = applyTheme;
window.toggleDarkMode = toggleDarkMode;
window.setCardColor = setCardColor;
window.setAccentColor = setAccentColor;
window.setFontFamily = setFontFamily;
window.resetSettings = resetSettings;
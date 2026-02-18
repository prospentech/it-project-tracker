// theme.js
let themeSettings = {};
let previewSettings = {};

function applyTheme(settings = null) {
    const currentUser = auth.getCurrentUser();
    const username = currentUser ? currentUser.username : 'default';
    
    // Use preview settings if available, otherwise load saved
    if (settings) {
        previewSettings = settings;
    } else {
        themeSettings = JSON.parse(localStorage.getItem('prospenTheme_' + username)) || {
            darkMode: true,
            cardColor: '#1e293b',
            accentColor: '#38bdf8',
            fontFamily: "'Inter', sans-serif",
            bgColor: '#020617'
        };
        previewSettings = { ...themeSettings };
    }
    
    // Apply background color if set, otherwise use darkMode
    if (previewSettings.bgColor) {
        setBackgroundColor(previewSettings.bgColor);
    } else {
        // Fallback to darkMode toggle
        if (previewSettings.darkMode) {
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
    }
    
    // Apply colors
    document.documentElement.style.setProperty('--card', previewSettings.cardColor);
    document.documentElement.style.setProperty('--accent', previewSettings.accentColor);
    
    // Calculate glow color
    const accentColor = previewSettings.accentColor;
    let glowColor = accentColor + '40';
    document.documentElement.style.setProperty('--accent-glow', glowColor);
    
    // Apply font family
    document.body.style.fontFamily = previewSettings.fontFamily;
    
    // Update toggle states
    const darkModeToggle = document.getElementById('darkModeToggle');
    const fontFamilySelect = document.getElementById('fontFamily');
    
    if (darkModeToggle) darkModeToggle.checked = previewSettings.darkMode;
    if (fontFamilySelect) fontFamilySelect.value = previewSettings.fontFamily;
    
    updateColorOptions();
}

function toggleDarkMode() {
    previewSettings.darkMode = !previewSettings.darkMode;
    // Clear bgColor when toggling dark/light mode
    delete previewSettings.bgColor;
    applyTheme(previewSettings);
}

function setCardColor(color) {
    previewSettings.cardColor = color;
    applyTheme(previewSettings);
}

function setAccentColor(color) {
    previewSettings.accentColor = color;
    applyTheme(previewSettings);
}

function setBackgroundColor(color) {
    previewSettings.bgColor = color;
    document.documentElement.style.setProperty('--bg', color);
    
    // Adjust text colors based on background brightness
    const isDark = isColorDark(color);
    if (isDark) {
        document.documentElement.style.setProperty('--text-p', '#94a3b8');
        document.documentElement.style.setProperty('--text-h', '#f1f5f9');
        previewSettings.darkMode = true;
    } else {
        document.documentElement.style.setProperty('--text-p', '#475569');
        document.documentElement.style.setProperty('--text-h', '#0f172a');
        previewSettings.darkMode = false;
    }
    
    // Update dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.checked = isDark;
    }
}

// Helper function to determine if a color is dark
function isColorDark(hexcolor) {
    // Remove # if present
    const color = hexcolor.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    
    // Calculate brightness (YIQ formula)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    return brightness < 128;
}

function setFontFamily(font) {
    previewSettings.fontFamily = font;
    applyTheme(previewSettings);
}

function saveThemeSettings() {
    const currentUser = auth.getCurrentUser();
    const username = currentUser ? currentUser.username : 'default';
    
    localStorage.setItem('prospenTheme_' + username, JSON.stringify(previewSettings));
    themeSettings = { ...previewSettings };
    
    // Show confirmation
    if (typeof showCustomModal === 'function') {
        showCustomModal('Theme Updated', 'Accent colour changed', 'success');
    }
}

function resetSettings() {
    const currentUser = auth.getCurrentUser();
    const username = currentUser ? currentUser.username : 'default';
    
    previewSettings = {
        darkMode: true,
        cardColor: '#1e293b',
        accentColor: '#38bdf8',
        fontFamily: "'Inter', sans-serif",
        bgColor: '#020617'
    };
    applyTheme(previewSettings);
    
    if (typeof showCustomModal === 'function') {
        showCustomModal('Theme Reset', 'All settings restored to default', 'success');
    }
}

function updateColorOptions() {
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('active');
        const bgColor = option.style.background || option.style.backgroundColor;
        if (bgColor) {
            // Extract hex color from style string
            const hexMatch = bgColor.match(/#[A-Fa-f0-9]{6}/);
            if (hexMatch) {
                const hexColor = hexMatch[0];
                if (hexColor === previewSettings.cardColor || 
                    hexColor === previewSettings.accentColor ||
                    hexColor === previewSettings.bgColor) {
                    option.classList.add('active');
                }
            }
        }
    });
}

// Make functions available globally
window.applyTheme = applyTheme;
window.toggleDarkMode = toggleDarkMode;
window.setCardColor = setCardColor;
window.setAccentColor = setAccentColor;
window.setBackgroundColor = setBackgroundColor;
window.setFontFamily = setFontFamily;
window.resetSettings = resetSettings;
window.saveThemeSettings = saveThemeSettings;
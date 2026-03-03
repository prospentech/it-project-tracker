// theme.js - Complete updated version with global theme application
let themeSettings = {};
let previewSettings = {};

// Dropdown text color settings
let dropdownSettings = {
    auto: true,
    customColor: '#ffffff'
};

// Dropdown background settings - NOW USES CARD COLOR BY DEFAULT
let dropdownBgSettings = {
    auto: true, // When true, uses card color
    customColor: '#1e293b' // Fallback
};

// Apply theme to current page
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
        setBackgroundColor(previewSettings.bgColor, false);
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
    
    // Load dropdown settings after theme is applied
    loadDropdownSettings();
    loadDropdownBgSettings();
    
    // Force update all dropdowns immediately
    updateAllDropdowns();
}

// Apply theme to all iframes and ensure it persists
function applyThemeToAllPages() {
    // Apply to current document
    applyTheme();
    
    // Set up a mutation observer to watch for dynamically added elements
    const observer = new MutationObserver(function(mutations) {
        // When new elements are added, reapply dropdown styles
        updateAllDropdowns();
    });
    
    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
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
    updateAllDropdowns();
}

function setAccentColor(color) {
    previewSettings.accentColor = color;
    applyTheme(previewSettings);
    updateAllDropdowns();
}

function setBackgroundColor(color, updatePreviews = true) {
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
    
    if (updatePreviews) {
        updateAllDropdowns();
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

// Toggle between auto and custom dropdown text color
function toggleDropdownAuto() {
    const autoToggle = document.getElementById('dropdownAutoToggle');
    const customSection = document.getElementById('dropdownCustomColorSection');
    
    dropdownSettings.auto = autoToggle.checked;
    
    if (dropdownSettings.auto) {
        customSection.style.display = 'none';
        // Remove custom dropdown styles
        removeCustomDropdownStyles();
    } else {
        customSection.style.display = 'block';
        // Apply current custom color
        applyDropdownTextColor(dropdownSettings.customColor);
    }
    
    // Save settings
    saveDropdownSettings();
    updateAllDropdowns();
}

// Set dropdown text color from color grid
function setDropdownTextColor(color) {
    dropdownSettings.customColor = color;
    dropdownSettings.auto = false;
    
    // Update toggle and UI
    const autoToggle = document.getElementById('dropdownAutoToggle');
    const customSection = document.getElementById('dropdownCustomColorSection');
    
    if (autoToggle) autoToggle.checked = false;
    if (customSection) customSection.style.display = 'block';
    
    // Update color picker
    const colorPicker = document.getElementById('customDropdownColorPicker');
    const colorInput = document.getElementById('customDropdownColor');
    if (colorPicker) colorPicker.value = color;
    if (colorInput) colorInput.value = color;
    
    // Apply the color
    applyDropdownTextColor(color);
    saveDropdownSettings();
    updateAllDropdowns();
}

// Apply custom dropdown text color from input field
function applyCustomDropdownColor() {
    const colorInput = document.getElementById('customDropdownColor');
    const colorPicker = document.getElementById('customDropdownColorPicker');
    let color = colorInput.value;
    
    // Validate hex color
    if (!/^#[0-9A-F]{6}$/i.test(color)) {
        color = '#ffffff';
        colorInput.value = color;
    }
    
    if (colorPicker) colorPicker.value = color;
    setDropdownTextColor(color);
}

// Apply dropdown text color to all selects - IMPROVED VERSION
function applyDropdownTextColor(color) {
    // Remove any existing custom dropdown styles
    removeCustomDropdownStyles();
    
    // Create and add new style with !important flags
    const style = document.createElement('style');
    style.id = 'custom-dropdown-styles';
    style.textContent = `
        select, 
        select option,
        .filter-select,
        .filter-select option,
        #fontFamily,
        #fontFamily option,
        .form-group select,
        .form-group select option,
        .language-selector select,
        .language-selector select option,
        .tasks-table select,
        .tasks-table select option,
        .projects-table select,
        .projects-table select option,
        .client-table select,
        .client-table select option,
        .chatbot-select,
        .chatbot-select option,
        .modal select,
        .modal select option {
            color: ${color} !important;
        }
        
        select option:hover,
        .filter-select option:hover,
        #fontFamily option:hover,
        .form-group select option:hover,
        .language-selector select option:hover,
        .tasks-table select option:hover,
        .projects-table select option:hover,
        .client-table select option:hover,
        .modal select option:hover {
            background-color: var(--accent) !important;
            color: var(--bg) !important;
        }
        
        select option:checked,
        .filter-select option:checked,
        #fontFamily option:checked,
        .form-group select option:checked,
        .language-selector select option:checked,
        .tasks-table select option:checked,
        .projects-table select option:checked,
        .client-table select option:checked,
        .modal select option:checked {
            background-color: var(--accent) !important;
            color: var(--bg) !important;
        }
    `;
    document.head.appendChild(style);
    
    // Update preview variable
    document.documentElement.style.setProperty('--dropdown-text-preview', color);
}

// Remove custom dropdown text styles
function removeCustomDropdownStyles() {
    const existingStyle = document.getElementById('custom-dropdown-styles');
    if (existingStyle) {
        existingStyle.remove();
    }
}

// Save dropdown text settings to localStorage
function saveDropdownSettings() {
    const currentUser = auth.getCurrentUser();
    const username = currentUser ? currentUser.username : 'default';
    
    localStorage.setItem('prospenDropdown_' + username, JSON.stringify(dropdownSettings));
}

// Load dropdown text settings
function loadDropdownSettings() {
    const currentUser = auth.getCurrentUser();
    const username = currentUser ? currentUser.username : 'default';
    
    const saved = localStorage.getItem('prospenDropdown_' + username);
    if (saved) {
        dropdownSettings = JSON.parse(saved);
        
        // Apply settings
        const autoToggle = document.getElementById('dropdownAutoToggle');
        const customSection = document.getElementById('dropdownCustomColorSection');
        const colorInput = document.getElementById('customDropdownColor');
        const colorPicker = document.getElementById('customDropdownColorPicker');
        
        if (autoToggle) autoToggle.checked = dropdownSettings.auto;
        
        if (dropdownSettings.auto) {
            if (customSection) customSection.style.display = 'none';
            removeCustomDropdownStyles();
        } else {
            if (customSection) customSection.style.display = 'block';
            if (colorInput) colorInput.value = dropdownSettings.customColor;
            if (colorPicker) colorPicker.value = dropdownSettings.customColor;
            applyDropdownTextColor(dropdownSettings.customColor);
        }
    }
}

// Toggle between auto (card color) and custom dropdown background
function toggleDropdownBgAuto() {
    const autoToggle = document.getElementById('dropdownBgAutoToggle');
    const customSection = document.getElementById('dropdownBgCustomColorSection');
    
    dropdownBgSettings.auto = autoToggle.checked;
    
    if (dropdownBgSettings.auto) {
        customSection.style.display = 'none';
        // Remove custom dropdown background styles
        removeCustomDropdownBgStyles();
        // Apply card color as background
        applyDropdownBgWithCardColor();
    } else {
        customSection.style.display = 'block';
        // Apply current custom color
        applyDropdownBgColor(dropdownBgSettings.customColor);
    }
    
    // Save settings
    saveDropdownBgSettings();
    updateAllDropdowns();
}

// Apply dropdown background using card color
function applyDropdownBgWithCardColor() {
    // Remove any existing custom dropdown background styles
    removeCustomDropdownBgStyles();
    
    // Get current card color
    const cardColor = getComputedStyle(document.documentElement).getPropertyValue('--card').trim();
    
    // Create and add new style for background using card color
    const style = document.createElement('style');
    style.id = 'custom-dropdown-bg-styles';
    style.textContent = `
        select option,
        .filter-select option,
        #fontFamily option,
        .form-group select option,
        .language-selector select option,
        .tasks-table select option,
        .projects-table select option,
        .client-table select option,
        .chatbot-select option,
        .modal select option {
            background-color: ${cardColor} !important;
        }
        
        /* Style for the dropdown when expanded */
        select:focus option,
        select:active option,
        select:hover option {
            background-color: ${cardColor} !important;
        }
        
        /* For Firefox */
        select option:checked,
        select option:selected {
            background-color: var(--accent) !important;
            color: var(--bg) !important;
        }
        
        /* For Chrome/Safari */
        select::-webkit-listbox {
            background-color: ${cardColor} !important;
        }
        
        select option:checked,
        select option:selected {
            background: var(--accent) linear-gradient(0deg, var(--accent) 0%, var(--accent) 100%) !important;
        }
    `;
    document.head.appendChild(style);
}

// Set dropdown background color from color grid - FIXED
function setDropdownBgColor(color) {
    dropdownBgSettings.customColor = color;
    dropdownBgSettings.auto = false;
    
    // Update toggle and UI
    const autoToggle = document.getElementById('dropdownBgAutoToggle');
    const customSection = document.getElementById('dropdownBgCustomColorSection');
    
    if (autoToggle) autoToggle.checked = false;
    if (customSection) customSection.style.display = 'block';
    
    // Update color picker
    const colorPicker = document.getElementById('customDropdownBgColorPicker');
    const colorInput = document.getElementById('customDropdownBgColor');
    if (colorPicker) colorPicker.value = color;
    if (colorInput) colorInput.value = color;
    
    // Apply the color
    applyDropdownBgColor(color);
    saveDropdownBgSettings();
    updateAllDropdowns();
    
    // Prevent default navigation
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    return false;
}

// Apply custom dropdown background color from input field
function applyCustomDropdownBgColor() {
    const colorInput = document.getElementById('customDropdownBgColor');
    const colorPicker = document.getElementById('customDropdownBgColorPicker');
    let color = colorInput.value;
    
    // Validate hex color
    if (!/^#[0-9A-F]{6}$/i.test(color)) {
        color = '#1e293b';
        colorInput.value = color;
    }
    
    if (colorPicker) colorPicker.value = color;
    setDropdownBgColor(color);
}

// Apply dropdown background color to all select dropdowns - IMPROVED VERSION
function applyDropdownBgColor(color) {
    // Remove any existing custom dropdown background styles
    removeCustomDropdownBgStyles();
    
    // Create and add new style for background with !important
    const style = document.createElement('style');
    style.id = 'custom-dropdown-bg-styles';
    style.textContent = `
        select option,
        .filter-select option,
        #fontFamily option,
        .form-group select option,
        .language-selector select option,
        .tasks-table select option,
        .projects-table select option,
        .client-table select option,
        .chatbot-select option,
        .modal select option {
            background-color: ${color} !important;
        }
        
        /* Style for the dropdown when expanded */
        select:focus option,
        select:active option,
        select:hover option {
            background-color: ${color} !important;
        }
        
        /* For Firefox */
        select option:checked,
        select option:selected {
            background-color: var(--accent) !important;
            color: var(--bg) !important;
        }
        
        /* For Chrome/Safari */
        select::-webkit-listbox {
            background-color: ${color} !important;
        }
        
        select option:checked,
        select option:selected {
            background: var(--accent) linear-gradient(0deg, var(--accent) 0%, var(--accent) 100%) !important;
        }
        
        /* Custom dropdown arrow color for better visibility */
        select {
            background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(color)}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>") !important;
            background-repeat: no-repeat !important;
            background-position: right 10px center !important;
            background-size: 16px !important;
            padding-right: 30px !important;
        }
    `;
    document.head.appendChild(style);
    
    // Update preview variable
    document.documentElement.style.setProperty('--dropdown-bg-preview', color);
}

// Remove custom dropdown background styles
function removeCustomDropdownBgStyles() {
    const existingStyle = document.getElementById('custom-dropdown-bg-styles');
    if (existingStyle) {
        existingStyle.remove();
    }
}

// Save dropdown background settings to localStorage
function saveDropdownBgSettings() {
    const currentUser = auth.getCurrentUser();
    const username = currentUser ? currentUser.username : 'default';
    
    localStorage.setItem('prospenDropdownBg_' + username, JSON.stringify(dropdownBgSettings));
}

// Load dropdown background settings
function loadDropdownBgSettings() {
    const currentUser = auth.getCurrentUser();
    const username = currentUser ? currentUser.username : 'default';
    
    const saved = localStorage.getItem('prospenDropdownBg_' + username);
    if (saved) {
        dropdownBgSettings = JSON.parse(saved);
        
        // Apply settings
        const autoToggle = document.getElementById('dropdownBgAutoToggle');
        const customSection = document.getElementById('dropdownBgCustomColorSection');
        const colorInput = document.getElementById('customDropdownBgColor');
        const colorPicker = document.getElementById('customDropdownBgColorPicker');
        
        if (autoToggle) autoToggle.checked = dropdownBgSettings.auto;
        
        if (dropdownBgSettings.auto) {
            if (customSection) customSection.style.display = 'none';
            removeCustomDropdownBgStyles();
            // Apply card color as background
            applyDropdownBgWithCardColor();
        } else {
            if (customSection) customSection.style.display = 'block';
            if (colorInput) colorInput.value = dropdownBgSettings.customColor;
            if (colorPicker) colorPicker.value = dropdownBgSettings.customColor;
            applyDropdownBgColor(dropdownBgSettings.customColor);
        }
    } else {
        // Default to using card color
        dropdownBgSettings.auto = true;
        applyDropdownBgWithCardColor();
    }
}

// NEW FUNCTION: Update all dropdowns with current settings
function updateAllDropdowns() {
    // Re-apply dropdown text color if not auto
    if (!dropdownSettings.auto) {
        applyDropdownTextColor(dropdownSettings.customColor);
    }
    
    // Re-apply dropdown background (auto uses card color, custom uses custom)
    if (dropdownBgSettings.auto) {
        applyDropdownBgWithCardColor();
    } else {
        applyDropdownBgColor(dropdownBgSettings.customColor);
    }
}

function saveThemeSettings() {
    const currentUser = auth.getCurrentUser();
    const username = currentUser ? currentUser.username : 'default';
    
    // Save all theme settings
    localStorage.setItem('prospenTheme_' + username, JSON.stringify(previewSettings));
    themeSettings = { ...previewSettings };
    
    // Save dropdown settings
    saveDropdownSettings();
    saveDropdownBgSettings();
    
    // Apply theme immediately to current page
    applyTheme(previewSettings);
    
    // Show confirmation
    if (typeof showCustomModal === 'function') {
        showCustomModal('Theme Updated', 'Settings saved and applied to all pages!', 'success');
    }
    
    // Update all dropdowns with saved settings
    updateAllDropdowns();
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
    
    dropdownSettings = {
        auto: true,
        customColor: '#ffffff'
    };
    
    dropdownBgSettings = {
        auto: true,
        customColor: '#1e293b'
    };
    
    applyTheme(previewSettings);
    
    // Reset dropdown text settings
    const autoToggle = document.getElementById('dropdownAutoToggle');
    const customSection = document.getElementById('dropdownCustomColorSection');
    if (autoToggle) autoToggle.checked = true;
    if (customSection) customSection.style.display = 'none';
    removeCustomDropdownStyles();
    
    // Reset dropdown background settings
    const bgAutoToggle = document.getElementById('dropdownBgAutoToggle');
    const bgCustomSection = document.getElementById('dropdownBgCustomColorSection');
    if (bgAutoToggle) bgAutoToggle.checked = true;
    if (bgCustomSection) bgCustomSection.style.display = 'none';
    removeCustomDropdownBgStyles();
    // Apply card color as background
    applyDropdownBgWithCardColor();
    
    saveDropdownSettings();
    saveDropdownBgSettings();
    
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

// Initialize theme on page load
function initTheme() {
    // Apply saved theme
    applyTheme();
    
    // Reapply theme when page becomes visible (in case of navigation)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            applyTheme();
        }
    });
    
    // Watch for navigation (SPA-like behavior)
    window.addEventListener('popstate', function() {
        setTimeout(applyTheme, 100);
    });
    
    // Also reapply when any AJAX content loads
    const originalFetch = window.fetch;
    window.fetch = function() {
        return originalFetch.apply(this, arguments).then(response => {
            setTimeout(applyTheme, 200);
            return response;
        });
    };
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
window.toggleDropdownAuto = toggleDropdownAuto;
window.setDropdownTextColor = setDropdownTextColor;
window.applyCustomDropdownColor = applyCustomDropdownColor;
window.loadDropdownSettings = loadDropdownSettings;
window.removeCustomDropdownStyles = removeCustomDropdownStyles;
window.saveDropdownSettings = saveDropdownSettings;
window.toggleDropdownBgAuto = toggleDropdownBgAuto;
window.setDropdownBgColor = setDropdownBgColor;
window.applyCustomDropdownBgColor = applyCustomDropdownBgColor;
window.loadDropdownBgSettings = loadDropdownBgSettings;
window.removeCustomDropdownBgStyles = removeCustomDropdownBgStyles;
window.saveDropdownBgSettings = saveDropdownBgSettings;
window.updateAllDropdowns = updateAllDropdowns;
window.applyDropdownBgWithCardColor = applyDropdownBgWithCardColor;
window.initTheme = initTheme;
window.applyThemeToAllPages = applyThemeToAllPages;

// Auto-initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
} else {
    initTheme();
}
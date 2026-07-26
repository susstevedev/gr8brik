let debug = window.debug;

fetch('settings.json')
    .then(response => {
        if (!response.ok) throw new Error(response.status);
        return response.json();
    })
    .then(data => {
        window.defaults = data;
        window.settings = structuredClone(data);
        readSettings();
    })
    .catch(error => console.error(error));

function setDefaultSettings() {
    window.settings = structuredClone(window.defaults);
    localStorage.removeItem("settings");

    if (debug) {
        console.log('Settings reset!');
    }
}

function readSettings() {
    const saved = localStorage.getItem("settings");

    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            window.settings = validateSettings(parsed, window.defaults);
        } catch (e) {
            console.warn("failed to load settings " + e);
            setDefaultSettings();
        }
    }
}

function saveSettings() {
    let date = new Date();
    window.settings.lastUpdated = date.toUTCString();
    let jsonData = JSON.stringify(window.settings);

    localStorage.setItem("settings", jsonData);
    scene.userData = window.settings;

    if (debug) {
        console.log('Settings saved.');
    }
}

function clearSettings() {
    try {
        localStorage.removeItem("settings");
        setDefaultSettings();

        if (debug) {
            console.log('Cleared settings.');
        }
    } catch (e) {
        console.warn("failed to clear settings " + e);
    }
}

function validateSettings(savedSettings, defaultSettings) {
    if (!savedSettings || typeof savedSettings !== 'object') {
        return structuredClone(defaultSettings);
    }

    let repaired = structuredClone(savedSettings); 

    Object.keys(defaultSettings).forEach(key => {
        let defaultValue = defaultSettings[key];
        let savedValue = repaired[key];

        if (savedValue === undefined || savedValue === null) {
            repaired[key] = structuredClone(defaultValue);
            return;
        }

        let defaultType = typeof defaultValue;
        let savedType = typeof savedValue;
        let isDefault = Array.isArray(defaultValue);
        let isSaved = Array.isArray(savedValue);

        if (isDefault !== isSaved || (defaultType !== savedType && !isDefault)) {
            repaired[key] = structuredClone(defaultValue);
            return;
        }

        if (key === 'camera' && isSaved) {
            let isValid = savedValue.every(cam =>
                cam && typeof cam === 'object' && 'id' in cam && 'type' in cam && 'pos' in cam
            );

            if (!isValid) {
                repaired.camera = structuredClone(defaultValue);
            }
        }
    });

    return repaired;
}
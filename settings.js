let debug = window.debug;
let settings;
let defaults;

await fetch('settings.json')
    .then(response => {
        if (!response.ok) throw new Error(response.status);
        return response.json();
    })
    .then(data => {
        defaults = data;
        settings = structuredClone(data);
        readSettings();
    })
    .catch(error => console.error(error));

function setDefaultSettings() {
    settings = structuredClone(defaults);
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
            settings = validateSettings(parsed, defaults);
        } catch (e) {
            console.warn("failed to load settings " + e);
            setDefaultSettings();
        }
    }
}

function saveSettings() {
    let date = new Date();
    settings.lastUpdated = date.toUTCString();
    let jsonData = JSON.stringify(settings);

    localStorage.setItem("settings", jsonData);
    scene.userData = settings;

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

function validateSettings(settings_saved, settings_default) {
    if (!settings_saved || typeof settings_saved !== 'object') {
        return structuredClone(settings_default);
    }

    let repaired = structuredClone(settings_saved); 

    Object.keys(settings_default).forEach(key => {
        let default_key = settings_default[key];
        let saved_key = repaired[key];

        if (saved_key === undefined || saved_key === null) {
            repaired[key] = structuredClone(default_key);
            return;
        }

        let defaultType = typeof default_key;
        let savedType = typeof saved_key;
        let isDefault = Array.isArray(default_key);
        let isSaved = Array.isArray(saved_key);

        if (isDefault !== isSaved || (defaultType !== savedType && !isDefault)) {
            repaired[key] = structuredClone(default_key);
            return;
        }

        if (key === 'camera' && isSaved) {
            let isValid = saved_key.every(cam =>
                cam && typeof cam === 'object' && 'id' in cam && 'type' in cam && 'pos' in cam
            );

            if (!isValid) {
                repaired.camera = structuredClone(default_key);
            }
        }
    });

    return repaired;
}

function mergeConfig(settings, defaults) {
    settings ??= {};

    for (const [key, value] of Object.entries(defaults)) {
        if (!(key in settings)) {
            settings[key] = value;
        }
    }
}

export { settings, defaults, readSettings, saveSettings, setDefaultSettings, clearSettings, validateSettings, mergeConfig };
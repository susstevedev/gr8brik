//document.addEventListener('DOMContentLoaded', function () {
    let debug = window.debug;

    // getcookie but bad and small
    function getCookie(name) {
        let c=document.cookie;let p=c.split(name + "=");let cv=null;if(p.length==2){cv=p.pop().split(";").shift();}
        return cv;
    }

    let defaults = {
        lastUpdated: new Date().toUTCString(),
        customParts: true,
        displayLines: false,
        highRes: true,
        noSnap: false,
        ui_trans: true,
        use_hdri: true,
        export_full_scene: false,
        hdri_background: false,
        flatcamera: false,
        activeCameraId: 0,
        camera: [
            {
                id: 0,
                type: "perspective",
                fov: 45,
                pos: {
                    x: 250,
                    y: 250,
                    z: 250,
                },
                name: "Perspective camera"
            },
            {
                id: 1,
                type: "perspective",
                fov: 45,
                pos: {
                    x: -250,
                    y: 250,
                    z: 250,
                },
                name: "Perspective camera 2"
            },
            {
                id: 2,
                type: "orthographic",
                pos: {
                    x: 250,
                    y: 250,
                    z: 250,
                },
                name: "Orthographic camera"
            },
            {
                id: 3,
                type: "orthographic",
                pos: {
                    x: -250,
                    y: 250,
                    z: 250,
                },
                name: "Orthographic camera 2"
            }
        ],
        hdris: {
            selected: 0,
            0: {
                url: "hdris/autumn_field_puresky_1k.hdr",
                name: "Autumn Field (Pure Sky) (default)"
            },
            1: {
                url: "hdris/kloofendal_48d_partly_cloudy_puresky_1k.hdr",
                name: "Kloofendal 48d Partly Cloudy (Pure Sky)"
            },
            2: {
                url: "hdris/studio_small_03_1k.hdr",
                name: "Studio Small 03"
            },
            3: {
                url: "hdris/venice_sunset_1k.hdr",
                name: "Venice Sunset"
            },
            4: {
                url: "",
                name: "custom object"
            },
        },
    }

    window.defaults = defaults;
    window.settings = defaults;

    function setDefaultSettings() {
        JSON.parse(JSON.stringify(defaults));
        localStorage.removeItem("settings");

        if(debug) {
            console.log('Settings reset!');
        }
    }

    function readSettings() {
        const saved = localStorage.getItem("settings");

        if (saved) {
            try {
                window.settings = JSON.parse(saved);
            } catch (e) {
                console.warn("failed to load settings " + e);
                setDefaultSettings();
            }
        }
    }
    readSettings();

    function saveSettings() {
        let date = new Date();
        window.settings.lastUpdated = date.toUTCString();
        let jsonData = JSON.stringify(window.settings);

        localStorage.setItem("settings", jsonData);

        if(scene && scene.userData) {
            scene.userData = window.settings;
        }

        if(debug) {
            console.log('Settings saved.');
            console.log('scene: ' + JSON.stringify(scene.userData));
            console.log('global: ' + JSON.stringify(window.settings));
        }
    }

    function clearSettings() {
        try {
                localStorage.removeItem("settings");
                setDefaultSettings();

                if(debug) {
                    console.log('Cleared settings.');
                }
        } catch (e) {
                console.warn("failed to clear settings " + e);
        }
    }

    function validateSettings(savedSettings, defaultSettings) {
        if (!savedSettings || typeof savedSettings !== 'object') {
            return JSON.parse(JSON.stringify(defaultSettings));
        }

        let repaired = { ...savedSettings };

        Object.keys(defaultSettings).forEach(key => {
            let defaultValue = defaultSettings[key];
            let savedValue = repaired[key];

            if (savedValue === undefined) {
                repaired[key] = JSON.parse(JSON.stringify(defaultValue));
                return;
            }

            let defaultType = typeof defaultValue;
            let savedType = typeof savedValue;
            let isDefault = Array.isArray(defaultValue);
            let isSaved = Array.isArray(savedValue);

            if (isDefault !== isSaved || (defaultType !== savedType && !isDefault)) {
                repaired[key] = JSON.parse(JSON.stringify(defaultValue));
                return;
            }

            if (key === 'camera' && isSaved) {
                let isValid = savedValue.every(cam => 
                    cam && typeof cam === 'object' && 'id' in cam && 'type' in cam && 'pos' in cam
                );

                if (!isValid) {
                    repaired.camera = JSON.parse(JSON.stringify(defaultValue));
                }
            }
        });

        return repaired;
    }

    window.settings = validateSettings(window.settings, window.defaults);
    debug = null;
//});
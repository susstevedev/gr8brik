//document.addEventListener('DOMContentLoaded', function () {
    let debug = true;

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
        window.settings = defaults;

        if(debug) {
            console.log('Settings reset!');
        }
    }

    function readSettings() {
        const saved = getCookie("setting");

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
        date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
        document.cookie = "setting=" + jsonData + "; expires=" + date.toUTCString();

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
        const saved = getCookie("setting");

        if (saved) {
            try {
                let parsed = JSON.parse(saved);
                const date = new Date();
                date.setTime(date.getTime() - (365 * 24 * 60 * 60 * 1000));
                document.cookie = "setting=" + JSON.stringify(parsed) + "; expires=" + date.toUTCString();

                if(debug) {
                    console.log('Cleared settings.');
                }
            } catch (e) {
                console.warn("failed to clear settings " + e);
            }
        }
    }
//});
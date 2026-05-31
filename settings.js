//document.addEventListener('DOMContentLoaded', function () {
    let debug = true;

    // getcookie but bad and small
    function getCookie(name) {
        let c=document.cookie;let p=c.split(name + "=");let cv=null;if(p.length==2){cv=p.pop().split(";").shift();}
        return cv;
    }

    window.settings = {
        customParts: false,
        displayLines: false,
        highRes: true,
        noSnap: false,
        ui_trans: true,
        use_hdri: true,
    }

    function setDefaultSettings() {
        let defaults = {
            customParts: false,
            displayLines: false,
            highRes: true,
            noSnap: false,
            ui_trans: true,
            use_hdri: true,
        }

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
        const jsonData = JSON.stringify(window.settings);
        const date = new Date();
        date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
        document.cookie = "setting=" + jsonData + "; expires=" + date.toUTCString();

        if(scene && scene.userData) {
            scene.userData = window.settings;
        }

        if(debug) {
            console.log('Settings saved.');
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
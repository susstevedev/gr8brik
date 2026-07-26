document.addEventListener('DOMContentLoaded', function(event) {
    function is_browser_unc() {
        var ua = navigator.userAgent;
        var browser = "";
        var version = 0;

        if (ua.indexOf("Chrome") > -1 && ua.indexOf("OPR") === -1) {
            if (ua.indexOf("Edg/") > -1) {
                browser = "Edge";
                version = parseInt(ua.match(/Edg\/(\d+)/)[1], 10);
            } else {
                browser = "Chrome";
                version = parseInt(ua.match(/Chrome\/(\d+)/)[1], 10);
            }
        } else if (ua.indexOf("Firefox") > -1) {
            browser = "Firefox";
            version = parseInt(ua.match(/Firefox\/(\d+)/)[1], 10);
        } else if (ua.indexOf("Safari") > -1) {
            browser = "Safari";
            var match = ua.match(/Version\/(\d+)\.(\d+)/);
            if (match) {
                version = parseFloat(match[1] + "." + match[2]);
            }
        }

        var MIN_CHROME = 89;
        var MIN_EDGE = 89;
        var MIN_FIREFOX = 100;
        var MIN_SAFARI = 15.4;
        var too_old = false;
        window.browserstring = null;
        console.log(browser + version);

        if (browser === "Chrome" && version < MIN_CHROME) {
            too_old = true;
            window.browserstring = "Chrome " + MIN_CHROME;
        } else if (browser === "Edge" && version < MIN_EDGE) {
            too_old = true;
            window.browserstring = browser + MIN_EDGE;
        } else if (browser === "Firefox" && version < MIN_FIREFOX) {
            too_old = true;
            window.browserstring = "Firefox " + MIN_FIREFOX;
        } else if (browser === "Safari" && version < MIN_SAFARI) {
            too_old = true;
            window.browserstring = "Safari " + MIN_SAFARI;
        } else if (!browser && (ua.indexOf("MSIE") > -1 || ua.indexOf("Trident/") > -1)) {
            too_old = true;
            window.browserstring = "Edge " + MIN_EDGE;
        }

        return too_old;
    }

    function update_link(type) {
        if(type == 1) {
            document.getElementById('wgl-disabled-link').innerText = "Update my browser";
            document.getElementById('wgl-disabled-link').setAttribute('href', 'http://browsehappy.com');
        }else if(type == 2) {
            document.getElementById('wgl-disabled-link').innerText = "Get WebGL2";
            document.getElementById('wgl-disabled-link').setAttribute('href', 'http://get.webgl.org/webgl2');
        }
    }

    var too_old = is_browser_unc();
    var canvas = document.createElement('canvas');
    var gl = canvas.getContext('webgl2');

    if (!gl) {
        if (typeof WebGL2RenderingContext !== 'undefined') {
            var err = "WebGL2 is supported, but disabled. This likely means your graphics card does not support it.";
            console.warn(err);
            update_link(2);
        } else {
            var err = 'WebGL2 is not supported by this browser.';
            console.warn(err);
            update_link(1);
        }

        document.getElementById('wgl-disabled-txt').innerText = err;
    } else if(too_old === true) {
        var err = "Your browser is too old. Please update it. Minumium is " + window.browserstring;
        var aelm = document.createElement('a');

        document.getElementById('wgl-disabled-txt').innerText = err;
        update_link(1);
    }

    if(!gl || too_old === true) {
        if (document.getElementById("wgl-disabled")) {
            document.getElementById('wgl-disabled').style.display = "block";
        }

        if (document.getElementById("preloaded-logo")) {
            document.getElementById("preloaded-logo").style.display = "none";
        }

        window.stop();
    }
});
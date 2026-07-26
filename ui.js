document.addEventListener('DOMContentLoaded', function () {
    let debug = window.debug;
    let settings = window.settings;

    document.querySelectorAll('button[data-settingsid]').forEach(element => {
        element.addEventListener('click', function (event) {
            let value = element.getAttribute('data-settingsid');

            if (debug) {
                console.log(value);
            }

            document.querySelectorAll('div[data-settingsid]').forEach(elementchild => {
                let elementchildattr = elementchild.getAttribute('data-settingsid');

                if (debug) {
                    console.log(elementchildattr);
                }

                if (elementchildattr != value) {
                    elementchild.style.display = 'none';
                } else {
                    elementchild.style.display = 'block';
                }
            });
        });
    });

    function update_hdris() {
        // hdri code
        const arr = window.settings.hdris;
        const select = document.querySelector('[data-testid=selected-hdri]');
        const index = arr.selected;

        Object.entries(arr).forEach(([key, value]) => {
            let option = new Option(value.name, key);

            if (Number(key) === index) {
                option.selected = true;
            }

            if (key === 'selected') {
                return;
            }

            select.add(option);
        });
    }
    update_hdris();

    document.querySelector('[data-testid=selected-hdri]').addEventListener("change", function () {
        window.settings.hdri_background = true;
        window.settings.hdris.selected = this.value;
        applyHdri(true, true);
    });

    function init_cam_ui() {
        const selector = document.getElementById("camera-selector");
        const cameras = scene.userData.camera;

        if (!selector || !Array.isArray(cameras)) {
            return;
        }

        selector.innerHTML = "";

        cameras.forEach(cam => {
            const option = document.createElement("option");
            option.value = cam.id;
            option.textContent = cam.name || `Camera ${cam.id}`;
            selector.appendChild(option);
        });

        selector.value = scene.userData.activeCameraId ?? 0;

        selector.addEventListener("change", (event) => {
            scene.userData.activeCameraId = Number(event.target.value);
            update_camera();
            save_settings();
        });
    }
    init_cam_ui();

    function ui_event_listens() {
        // login
        if (!window.loggedin) {
            document.getElementById("username-field").addEventListener('click', function () {
                document.getElementById("login-popup").style.display = 'block';
            });
        }

        document.querySelector("#login-popup .btn-alt").addEventListener("click", function () {
            document.getElementById("login-popup").style.display = "none";
        });

        // save to cloud menu open and close
        document.getElementById("save-popup-open").addEventListener("click", function () {
            document.getElementById("save-popup").style.display = "block";
        });

        document.querySelector("#save-popup .btn-alt").addEventListener("click", function () {
            document.getElementById("save-popup").style.display = "none";
        });

        // import popup open and close
        document.getElementById("import-popup-open").addEventListener("click", function () {
            document.getElementById("import-popup").style.display = "block";
        });

        document.querySelector("#import-popup .btn-alt").addEventListener("click", function () {
            document.getElementById("import-popup").style.display = "none";
        });

        // export popup open and close
        document.getElementById("export-popup-open").addEventListener("click", function () {
            document.getElementById("export-popup").style.display = "block";
        });

        document.querySelector("#export-popup .btn-alt").addEventListener("click", function () {
            document.getElementById("export-popup").style.display = "none";
        });

        // settings popup open and close
        document.getElementById("settings-popup-open").addEventListener("click", function () {
            document.getElementById("settings-popup").style.display = "block";
        });

        document.querySelector("#settings-popup .btn-alt").addEventListener("click", function () {
            document.getElementById("settings-popup").style.display = "none";
        });

        /* Welcome popup */
        if(window.settings.hideWelcome != true) {
            document.querySelector("#welcome-popup .btn-alt").addEventListener("click", function () {
                document.getElementById("welcome-popup").style.display = "none";
            });

            document.querySelector("#welcome-popup .close.btn").addEventListener("click", function () {
                document.getElementById("welcome-popup").style.display = "none";
            });
        }

        /* Other */
        document.getElementById("clear_settings").addEventListener("click", function () {
            clearSettings(); // new
        });

        document.getElementById("read_settings").addEventListener("click", function () {
            readSettings(); // new
        });

        // file menu
        document.querySelector("#menu-file").addEventListener("click", function () {
            let elm = document.getElementById("dropdown-file");

            if (elm.style.display === "block") {
                elm.style.display = "none";
            } else {
                elm.style.display = "block";
            }
        });

        document.querySelector("#menu-edit").addEventListener("click", function () {
            let elm = document.getElementById("dropdown-edit");

            if (elm.style.display === "block") {
                elm.style.display = "none";
            } else {
                elm.style.display = "block";
            }
        });

        // help menu
        document.querySelector("#menu-help").addEventListener("click", function () {
            let elm = document.getElementById("help-popup");

            if (elm.style.display === "block") {
                elm.style.display = "none";
            } else {
                elm.style.display = "block";
            }
        });

        document.querySelector("#help-popup .btn-alt").addEventListener("click", function () {
            document.querySelector("#help-popup").style.display = "none";
        });

        document.querySelector("#help-popup .close").addEventListener("click", function () {
            document.querySelector("#help-popup").style.display = "none";
        });
        
        let partList = document.getElementById('blk');
        let colList = document.getElementById('select-color');

        document.getElementById("toggleMenu").addEventListener("click", function () {
            var left = document.getElementById("left-container");
            if (left.style.left === "0px" || left.style.left === "") {
                left.style.left = "-999px";
            } else {
                left.style.left = "0px";
            }
        });

        document.querySelectorAll('[data-tabbtnid].tab-button').forEach(button => {
            button.addEventListener('click', function () {
                let is1 = this.getAttribute('data-tabbtnid') === 'tab1';
                let search = document.getElementById("search-parts");

                document.getElementById('select-block').style.display = is1 ? 'flex' :
                    'none';

                document.getElementById('block-list').style.display = is1 ? 'none' :
                    'block';

                search.readOnly = is1 ? false : true;
            });
        });
    }
    ui_event_listens();

    debug = null;
});
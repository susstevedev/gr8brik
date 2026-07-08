document.addEventListener('DOMContentLoaded', function () {
    let debug = window.debug;

    document.querySelectorAll('button[data-settingsid]').forEach(element => {
        element.addEventListener('click', function(event) {
            let value = element.getAttribute('data-settingsid');

            if(debug) {
                console.log(value);
            }

            document.querySelectorAll('div[data-settingsid]').forEach(elementchild => {
                let elementchildattr = elementchild.getAttribute('data-settingsid');

                if(debug) {
                    console.log(elementchildattr);
                }

                if(elementchildattr != value) {
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

    debug = null;
});
document.addEventListener('DOMContentLoaded', function () {

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
            if (Number(key) === index) {
                option.selected = true;
            }

            if (key === 'selected') {
                return;
            }

            let option = new Option(value.name, key);

            select.add(option);
        });
    }
    update_hdris();

    document.querySelector('[data-testid=selected-hdri]').addEventListener("change", function () {
        window.settings.hdri_background = true;
        window.settings.hdris.selected = this.value;
        applyHdri(true, true);
    });

});
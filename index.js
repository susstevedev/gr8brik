/* The mess that runs the entire modeler */

// Used for debugging sometimes
//'use strict';

window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    e.returnValue = '';
});

window.version = '2026.07.17';

// new imports
import * as THREE_NS from 'three';

import { WebGPURenderer } from 'three/webgpu'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { LDrawLoader } from 'three/addons/loaders/LDrawLoader.js';
import { LDrawConditionalLineMaterial } from 'three/addons/materials/LDrawConditionalLineMaterial.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import Stats from 'three/addons/libs/stats.module.js';

let THREE = { ...THREE_NS };
THREE.OrbitControls = OrbitControls;
THREE.TransformControls = TransformControls;
THREE.LDrawLoader = LDrawLoader;
THREE.GLTFExporter = GLTFExporter;
THREE.HDRLoader = HDRLoader; 
THREE.RGBELoader = HDRLoader;

const stats = new Stats();

let canvas = document.createElement('canvas');
let gl = canvas.getContext('webgl2');

if (!gl) {
    if (typeof WebGL2RenderingContext !== 'undefined') {
        let err = "WebGL2 is supported, but disabled. This likely means your graphics card does not support it.";
        console.warn(err);
    } else {
        let err = 'WebGL2 is not supported by this browser.';
        console.warn(err);
    }

    document.getElementById('wgl-disabled').style.display = "block";
    document.getElementById('wgl-disabled-txt').innerText = err;
} else {
    console.log('WEBGL STATUS: ENABLED');
}

window.debug = true; // debug mode

let container = null, camera = null, scene = null, renderer = null, controls = null, transformControls = null, grid_helper = null, directional_lighting = null, ambient_lighting = null, ldraw_loader = null, loading_manager = null, mouse = null, raycaster = null, mesh_color = null, partName = null, partIcon = null, part = null, partMatrixWorld = null, partTexture = null, partOpacity = null, activeObject = null, partRotation = null, partPosition = null, selectedObject = null, multiSelectedObject = null, selectionGroup = null, customPosition = null, selectedMap = null, selectedExport = null;
let partColor = '#C91A09', start_url = 'https://gr8brik.rf.gd', DEFAULT_TITLE = 'Modeler - Gr8brik', show_import_animation = true;

function mergeConfig(settings, defaults) {
    settings ??= {};

    console.log("before config merge " + settings);

    for (const [key, value] of Object.entries(defaults)) {
        if (!(key in settings)) {
            settings[key] = value;
        }
    }

    console.log("after config merge " + settings);
}

let color_palette = [
                "#C91A09", // Bright Red
                "#F8CC00", // Bright Yellow
                "#0020A0", // Bright Blue
                "#005700", // Dark Green
                "#FE8A18", // Bright Orange
                "#D941BB", // Bright Violet
                "#000000", // Black
                "#FFFFFF", // White
                "#747371", // Dark Stone Grey (Dark Bluish Grey)
                "#A3A2A4", // Medium Stone Grey (Light Bluish Grey)
                "#958A73", // Dark Tan (Brick Yellow)
                "#6C5C4D", // Brown
                "#812A00", // Dark Brown
                "#5883C1", // Medium Blue
                "#4B974B", // Sand Green
                "#A52A2A", // Dark Red
                "#B36D2C", // Dark Orange
                "#FCB7BC", // Bright Pink
                "#60C0E0", // Bright Light Blue
                "#FBE696", // Earth Yellow (Light Yellow)
                "#84B68D", // Bright Green
                "#92B28B", // Lime Green
                "#002A5A", // Dark Blue
                "#DDDD22", // Vibrant Yellow
];

/*jscolor.presets.default = {
    format: 'hexa',
    palette: color_palette,
    onChange: updateColorPicker(),
    value: '#C91A09FF'
};

function updateColorPicker() {
    let color = document.getElementById('color-picker').getAttribute("data-current-color");

    console.log(`Changed selected color to ${color}`);
    if (color && selectedObject) {
        changeBlockColor(color);
    }
}*/

/*$(document).ready(function () {
    $("#color-picker").spectrum({
        color: partColor,
        preferredFormat: "hex",
        showInput: true,
        showPalette: true,
        maxSelectionSize: 4,
        palette: [
            [
                "#C91A09", // Bright Red
                "#F8CC00", // Bright Yellow
                "#0020A0", // Bright Blue
                "#005700", // Dark Green
                "#FE8A18", // Bright Orange
                "#D941BB", // Bright Violet
            ],
            [
                "#000000", // Black
                "#FFFFFF", // White
                "#747371", // Dark Stone Grey (Dark Bluish Grey)
                "#A3A2A4", // Medium Stone Grey (Light Bluish Grey)
                "#958A73", // Dark Tan (Brick Yellow)
                "#6C5C4D", // Brown
            ],
            [
                "#812A00", // Dark Brown
                "#5883C1", // Medium Blue
                "#4B974B", // Sand Green
                "#A52A2A", // Dark Red
                "#B36D2C", // Dark Orange
                "#FCB7BC", // Bright Pink
            ],
            [
                "#60C0E0", // Bright Light Blue
                "#FBE696", // Earth Yellow (Light Yellow)
                "#84B68D", // Bright Green
                "#92B28B", // Lime Green
                "#002A5A", // Dark Blue
                "#DDDD22", // Vibrant Yellow
            ],
        ],
        change: function (color) {
            console.log(`Changed selected color to ${color.toName() || color.toHexString()}`);
            partColor = color.toHexString();
            if (color && selectedObject) {
                changeBlockColor(color.toHexString());
            }
        },
    });
}); */

// fix links not working
/*document.addEventListener('click', function (event) {
    if (event.target.tagName === 'A') {
        event.preventDefault();
        const url = event.target.getAttribute("href");
        if (event.target.hasAttribute("download")) return;
        if (url && /^https?:\/\//.test(url)) {
            window.location.href = url;
        }
    }
});*/

// user login function
window.loggedin = false;
function login() {
    fetch(start_url + "/ajax/user.php?ajax=true", {
        headers: {
            'X-version': window.version,
            'X-app': 'gr8brik',
        },
        })
        .then(res => res.json())
        .then(response => {
            if (response.success) {
                const field = document.getElementById("username-field");
                field.innerHTML = null;

                const name = document.createElement('span');
                name.innerText = response.user;
                name.style.paddingRight = "10px";

                field.appendChild(name);
                field.setAttribute("href", "/acc/creations");

                tooltip('Logged in as ' + response.user);
                window.sessionData = response;

                if (response.alert != null && response.alert != undefined && response.alert != 0) {
                    const notification = document.createElement('span');
                    notification.innerText = response.alert;
                    notification.style.backgroundColor = "#ff0000";
                    notification.style.color = "#fff";
                    notification.style.borderRadius = '15px';
                    notification.style.paddingLeft = "5px";
                    notification.style.paddingRight = "5px";

                    field.appendChild(notification);
                }
                window.loggedin = true;
            } else {
                tooltip(response.error);
                console.error("An error occured while authenticating: " + response.error);
                document.getElementById("username-field").innerHTML = "Login";
                window.loggedin = false;
            }
            ui_login_v2(response);
        })
        .catch(async (err) => {
            window.loggedin = false;
            try {
                let res = await err.response.json();
                tooltip(res.error);
                console.error("An error occured while authenticating: " + res.error);
                ui_login_v2(res);
            } catch {
                tooltip("An error occured while authenticating: " + err);
                console.error("An error occured while authenticating: " + err);
                ui_login_v2(null);
            }
        });
}
login();

function getWarnStatus() {
    fetch(start_url + "/ajax/user.php?get_warn_status=true")
        .then(res => res.json())
        .then(response => {
            if (response.status == "yes" && response.success == true) {
                tooltipAlert(response.text, response.reason, response.additional, response.button);

                // rerun login function to update user information (logging user out if they get banned)
                login();
            } else if(response.success == false) {
                tooltip(response.error);
                console.error("An error occured while authenticating " + response.error);
            }
        })
        .catch(async (err) => {
            try {
                const res = await err.response.json();
                tooltip(res.error);
                console.error("An error occured while authenticating " + res.error);
            } catch {
                tooltip('An error occured while authenticating');
                console.error("An error occured while authenticating " + err);
            }
        });
}
getWarnStatus();

/* UI auth */
function ui_login(username, pfp) {
    document.querySelector('#settings-account-auth-username').textContent = username;
    document.querySelector('#settings-account-auth-pfp').src = pfp;
}

function ui_login_v2(response) {
    document.querySelector('#settings-account-auth').style.display = 'block';

    if(response && !response.error && response.success) {
        document.querySelector('#settings-account-loggedout').style.display = 'none';

        if(response.user) {
            document.querySelector('#settings-account-auth-username').textContent = username;
            document.querySelector('#settings-account-auth-username').style.display = 'block';
        }

        if(response.pfp) {
            document.querySelector('#settings-account-auth-pfp').src = pfp;
            document.querySelector('#settings-account-auth-pfp').style.display = 'block';
        }
    } else {
        document.querySelector('#settings-account-auth-pfp').style.display = 'none';
        document.querySelector('#settings-account-auth-username').style.display = 'none';
        let loggedoutelm = document.querySelector('#settings-account-loggedout');
        loggedoutelm.style.display = 'block';
        loggedoutelm.querySelector('.message').textContent = 'Logged out';
        loggedoutelm.querySelector('.text').textContent = 'Log in to an account to save creations to our servers';
    }
}

let displayed_parts = [];
let current_type = '';
let cached_parts = {};

// load parts from url
function loadParts(type) {
    console.log(`loading ${type} category`);
    current_type = type;

    if (cached_parts[type]) {
        console.log(`${type} parts loaded from cache`);
        displayed_parts = cached_parts[type];
        displayParts(displayed_parts, true);
        return;
    }

	if(type !== "customparts.php") {
		fetch(`https://susstevedev.github.io/gr8brik/parts/${type}.json`)
			.then(res => res.json())
			.then(data => {
				console.log(`${type} parts loaded`);
				displayed_parts = data;
				cached_parts[type] = data;
				displayParts(displayed_parts, true);
			})
			.catch(err => {
				console.error('error loading parts ', err);
				tooltip('Failed to load parts');
			});
	} else {
        if(scene.userData.customParts === false) {
            console.warn("Custom parts disabled");
            return;
        }

		fetch(`customparts.php`)
			.then(res => res.json())
			.then(data => {
				console.log(`Custom parts loaded`);
				tooltip('Custom parts loaded');
				displayed_parts = data;
				cached_parts[type] = data;
				
				const container = document.getElementById("select-block");
				container.innerHTML = '';
				//displayed_parts = displayed_parts.sort((a, b) => a.name.length - b.name.length);

				displayed_parts.forEach(part => {
					console.log(part);
					const span = document.createElement("span");
					span.id = part.reference;
					span.title = part.name;
					span.setAttribute("value", part.part);
					span.setAttribute("texture", part.texture);
					span.innerHTML = `
								<img src="${part.texture}" loading="lazy" width="45px" />
								<br />
								<small class="part-list-number">${part.reference}</small>
								&nbsp;
								<!-- <small class="hover-only">${part.name}</small> -->
							`;
					container.appendChild(span);
				});
			})
			.catch(err => {
				console.error('error loading parts ', err);
				tooltip('Failed to load parts');
			});
	}
}

// display parts function
/*function displayParts() {
    const container = document.getElementById("select-block");
    container.innerHTML = '';
    displayed_parts = displayed_parts.sort((a, b) => a.name.length - b.name.length);

    displayed_parts.forEach(part => {
        if(LOADED_AMOUNT >= MAX_LOAD_AMOUNT) {
            return;
        }

        const span = document.createElement("span");
        span.id = part.file;
        span.title = part.name + " (uid " + part.id + ")";
        span.setAttribute("value", part.file);
        span.innerHTML = `
					<img src="https://library.ldraw.org/media/ldraw/official/parts/${part.file.split(".")[0]}.png" loading="lazy" width="45px" />
					<br />
					<small class="part-list-number">${part.file.split(".")[0]}</small>
				`;
        container.appendChild(span);
        LOADED_AMOUNT += 1;
    });
}*/

function displayParts(displayed_parts, new_category) {
    let select_block_contain = document.getElementById("select-block");

    let MAX_LOAD_AMOUNT = 50;
    let currentIndex = 0;
    let observer = null;
    let sentinel = null;
    let isRendering = false;

    displayed_parts = displayed_parts.sort((a, b) => a.name.length - b.name.length);

    function prepareParts() {
        let oldSentinel = document.getElementById('scroll-sentinel');
        if(oldSentinel) {
            oldSentinel.remove();
        };

        sentinel = document.createElement('div');
        sentinel.id = 'scroll-sentinel';
        sentinel.style.height = '1px';
        select_block_contain.appendChild(sentinel);

        /*observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && currentIndex < displayed_parts.length) {
                    renderParts();
                }
            });
        }, { rootMargin: '100px' });*/

        observer = new IntersectionObserver((entries) => {
            if (entries.some(entry => entry.isIntersecting)) {
                if (currentIndex < displayed_parts.length) {
                    requestAnimationFrame(renderParts);
                }
            }
        }, { rootMargin: '100px' });

        observer.observe(sentinel);
    }

    function renderParts() {
        if (isRendering) {
            return;
        }

        isRendering = true;

        let currentCount = select_block_contain.children.length - 1;
        let loadLimit = Math.min(currentIndex + MAX_LOAD_AMOUNT, displayed_parts.length);
        
        if (loadLimit > displayed_parts.length) {
            loadLimit = displayed_parts.length;
        }

        let startIndex = currentIndex;
        
        if (startIndex >= displayed_parts.length) {
            return;
        }

        for (let i = startIndex; i < loadLimit; i++) {
            let part = displayed_parts[i];
            
            let span = document.createElement("span");
            span.id = part.file;
            span.title = part.name + " (uid " + part.id + ")";
            span.setAttribute("value", part.file);
            span.innerHTML = `
                <img src="https://library.ldraw.org/media/ldraw/official/parts/${part.file.split(".")[0]}.png" loading="lazy" width="45px" />
                <br />
                <small class="part-list-number">${part.file.split(".")[0]}</small>
            `;
            
            select_block_contain.insertBefore(span, sentinel);
        }

        currentIndex = loadLimit;

        if (currentIndex >= displayed_parts.length) {
            observer.disconnect();
        }

        isRendering = false;
    }

    if (new_category) {
        if (observer) { 
            observer.disconnect();
        }

        MAX_LOAD_AMOUNT = 50;
        currentIndex = 0;

        let existingSpans = select_block_contain.querySelectorAll('span');
        existingSpans.forEach(span => span.remove());

        prepareParts();
        renderParts();
    } else {
        renderParts();
    }
}

loadParts('brick');

// NEWER search function
// Overall it's better and cleaner
// Will have bugs please report them if you can
function searchParts() {
    let searchbox = document.getElementById("search-parts");

        const value = searchbox.value.toLowerCase().replace(/\s+/g, " ").trim();
        //const items = Array.from(document.querySelectorAll("#select-block span"));
        const items = displayed_parts;

        /*const exact_match = [];
        const simi_match = [];*/

        const matchedItems = [];

        /*items.forEach(item => {
            const title_txt = (item.title || "").toLowerCase().replace(/\s+/g, " ").trim();
            const part_num_elm = item.querySelector("small.part-list-number");
            const small_txt = part_num_elm ? part_num_elm.textContent.toLowerCase().trim() : "";

            const exact = title_txt === value || small_txt === value;
            const simi = title_txt.includes(value) || small_txt.includes(value);

            if (exact) {
                exact_match.push(item);
            } else if (simi) {
                simi_match.push(item);
            } else {
                item.style.display = "none";
            }
        });*/

        const queryTokens = value
            .toLowerCase()
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        items.forEach(item => {
            const title_txt = (item.name || "").toLowerCase();
            const num = (item.file || "").toLowerCase();

            /*const match =
                title_txt.includes(value) ||
                num.includes(value);*/

             const match = queryTokens.every(token =>
                title_txt.includes(token) || num.includes(token)
            );

            //item.style.display = match ? "flex" : "none";

            if(match) {
                matchedItems.push(item);
            }
        });

        const container = document.getElementById("select-block");
        console.log(matchedItems);
        displayParts(matchedItems, true);

        /*exact_match.concat(simi_match).forEach(item => {
            item.style.display = "flex";
            container.appendChild(item);
        });*/
}

document.getElementById("search-parts").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        searchParts();
    }
});

document.getElementById("search-submit").addEventListener("click", function (event) {
    searchParts();
});

// add a new part
document.getElementById("select-block").addEventListener("click", function (e) {
    const span = e.target.closest("span");

    if (!span) {
        return;
    }

    const selectedPart = span.getAttribute("value");

    if (!selectedPart) {
        return;
    }

    const original_img = span.querySelector('img').getAttribute("src");
    span.querySelector('img').setAttribute("src", "img/load.gif");

    part = 'parts/' + span.getAttribute("value");
    partName = span.getAttribute("value");

    if(span.getAttribute("texture")) {
        const selectedTexture = span.getAttribute("texture");

        addBlockV2(part, partColor, null, span, original_img, part, selectedTexture, null, null, null);
    } else {
        addBlockV2(part, partColor, null, span, original_img, part, null, null, null, null);
    }
});

// list for items that are already in the scene
document.querySelector("#block-list").addEventListener("click", function (e) {
    if (e.target.matches(".scene-block-item")) {
        const id = e.target.getAttribute("data-id");
        const obj = scene.getObjectByProperty('uuid', id);
        if (obj) {
            transformControls.detach(selectedObject);
            selectedObject = null;
            transformControls.attach(obj);
            selectedObject = obj;
            tooltip('Part selected');
        }
    }
});

// save creation
document.getElementById("download-json").addEventListener("click", function () {
    const sceneJSON = generateSceneJSON();
    if (sceneJSON) {
        autosave();

        if (selectedObject) {
            transformControls.detach(selectedObject);
            selectedObject = null;
        }

        if(!window.loggedin) {
            this.disabled = true;
            this.classList.add('btn-disabled');
            tooltip('Login to save creation to server');
            return;
        }

        let params = new URLSearchParams(window.location.search);
        let build_id = params.get("build_id") || null;

        const name = document.querySelector("#save-popup input[name='name']").value.trim();
        const desc = document.querySelector("#save-popup textarea[name='desc']").value.trim();
        const visible = document.querySelector('input[name="visible"]:checked');
        const screenshot = capture();

        this.innerHTML = `<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>`;

        fetch(start_url + "/ajax/build.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                save_build: true,
                build_id: build_id,
                creation: sceneJSON,
                name,
                desc,
                screenshot,
                visibility: visible.value,
            })
        })
            .then(res => res.json())
            .then(response => {
                tooltip(response.success);
                this.innerText = "Save Creation as a copy";
            })
            .catch(async err => {
                try {
                    const res = await err.response.json();
                    tooltip(res.error);
                    this.innerText = "Save Creation";
                } catch {
                    tooltip("An unknown error occurred.");
                    this.innerText = "Save Creation";
                    this.disabled = true;
                    this.classList.add('btn-disabled');
                }
            });
    } else {
        tooltip('Problem while generating scene');
    }
});

let params = new URLSearchParams(window.location.search);
let build_id = params.get("build_id");

if(build_id !== undefined && build_id !== null) {
    loadJSONFromCloud(build_id);
}

// import modal
document.getElementById("import-finish").addEventListener("click", function () {
    const format = document.getElementById("import-format").value;
    if (format === "cloud") {
        tooltip('Gr8brik models from your account cannot be imported yet.');
        return;
    }
    if (format === "cloud2") {
        let model_id = document.getElementById('import-url').value.split('/').pop();
        loadJSONFromCloud(model_id);
    }
    if (format === "three") {
        document.getElementById("cre-import-three").click();
    }
    if (format === "json") {
        document.getElementById("cre-import").click();
    }
    if (format === "gr8z") {
        document.getElementById("cre-import-gr8z").click();
    }
    /*if (format === "lxf") {
        document.getElementById("cre-export-ldd").click();
    }*/
    if (format === "ldr") {
        document.getElementById("cre-import-ldr").click();
    }
});

// export model
document.getElementById("export-finish").addEventListener("click", function () {
    const format = document.getElementById("export-format").value;
    selectedExport = document.getElementById("export-format").value;

    if (format === "three") {
        document.getElementById("cre-export-three").click();
    }

    if (format === "selectedobj") {
        document.getElementById("selected-object-export-three").click();
    }

    if (format === "json") {
        document.getElementById("cre-export").click();
    }

    if (format === "gr8") {
        document.getElementById("cre-export-gr8").click();
    }

    if (format === "gr8z") {
        document.getElementById("cre-export-gr8z").click();
    }

    if (format === "lxf") {
        document.getElementById("cre-export-ldd").click();
    }

    if (format === "dae") {
        if(!window.loggedin) {
            alert('Not authenticated');
            return;
        }

        const collada = new THREE.ColladaExporter();
        const collada_data = collada.parse(filter_objects_peices());
        const blob = new Blob([collada_data.data], { type: 'model/vnd.collada+xml' });
        const url = URL.createObjectURL(blob);
        const date = getDate();

        const a = document.createElement('a');
        a.href = url;
        a.download = `collada-${date}.dae`;
        a.click();

        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 10000);
    }

    if (format === "glb") {
        if(!window.loggedin) {
            alert('Not authenticated');
            return;
        }

        const exporter = new THREE.GLTFExporter();
        const date = getDate();
		
		let scene_ = scene;
		if(scene.userData.export_full_scene === false) {
			scene_ = filter_objects_peices();
		}
        console.log(scene_.children.length + " objects to export");

        exporter.parse(
            scene_,
            function (result) {
                if (result instanceof ArrayBuffer) {
                    //const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
                    const blob = new Blob([result], { type: 'model/gltf-binary' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `creation-${date}.glb`;
                    a.click();

                    setTimeout(() =>
                        URL.revokeObjectURL(url),
                        10000);
                } else {
                console.error('Invalid object, expecting gltf');
            }
            },
            function (error) {
                console.error(error);
            },
            {
                binary: true,
                onlyVisible: true,
                embedImages: true,
                forceIndices: true,
                forcePowerOfTwoTextures: true,
            }
        );
    }

    if (format === "obj") {
        if(!window.loggedin) {
            alert('Not authenticated');
            return;
        }

        const exporter = new THREE.OBJExporter();
        const date = getDate();
        const result = exporter.parse(filter_objects_peices());

        const blob = new Blob([result], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `obj-mtl-${date}.obj`;
        a.click();

        setTimeout(() => URL.revokeObjectURL(url), 10000);
    }

    if (format === "mpd") {
        exportSceneToMPD("creation");
    }
});

document.getElementById("part-type-filter").addEventListener("change", function () {
    loadParts(this.value);
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
    /*
    let elm = document.getElementById("settings-popup");
    elm.style.display = (elm.style.display === "none") ? "block" : "none";
    */
});

document.querySelector("#settings-popup .btn-alt").addEventListener("click", function () {
    document.getElementById("settings-popup").style.display = "none";
});


/* Welcome popup */
document.querySelector("#welcome-popup .btn-alt").addEventListener("click", function () {
    document.getElementById("welcome-popup").style.display = "none";
    scene.userData.hideWelcome = true;
});

document.querySelector("#welcome-popup .close.btn").addEventListener("click", function () {
    document.getElementById("welcome-popup").style.display = "none";
    scene.userData.hideWelcome = true;
});

/* Other */

document.getElementById("clear_autosave").addEventListener("click", function () {
    clear_autosave();
});

document.getElementById("read_autosave").addEventListener("click", function () {
    read_autosave();
});

document.getElementById("clear_settings").addEventListener("click", function () {
    //clear_settings();
    clearSettings(); // new
});

document.getElementById("read_settings").addEventListener("click", function () {
    //read_settings();
    readSettings(); // new
});

//wheel navigation
document.querySelectorAll('.nav-arrow').forEach(btn => {
  btn.addEventListener('click', (event) => {
    let direction = event.currentTarget.id;
    let azimuth = controls.getAzimuthalAngle();
    let polar = controls.getPolarAngle();
    let step = 0.15;

    if (direction === 'nav-left') {
        setcamangle(azimuth - step, polar);
    } else if (direction === 'nav-right') {
        setcamangle(azimuth + step, polar);
    } else if (direction === 'nav-up') {
        setcamangle(azimuth, polar - step);
    } else if (direction === 'nav-down') {
        setcamangle(azimuth, polar + step);
    } else if (direction === 'nav-cam-reset') {
        controls.reset();
    } else {
        console.warn('invalid angle');
    }

  });
});

function setcamangle(anglehor, anglever) {
    let target = controls.target;

    let dx = camera.position.x - target.x;
    let dy = camera.position.y - target.y;
    let dz = camera.position.z - target.z;

    let radius = Math.sqrt(dx * dx + dy * dy + dz * dz);
    let clampedpolar = Math.max(0.01, Math.min(Math.PI - 0.01, anglever));

    let nx = target.x + radius * Math.sin(clampedpolar) * Math.sin(anglehor);
    let ny = target.y + radius * Math.cos(clampedpolar);
    let nz = target.z + radius * Math.sin(clampedpolar) * Math.cos(anglehor);
    
    camera.position.set(nx, ny, nz);
    controls.update();
}

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


// Transparency
document.getElementById("trans-block").addEventListener("click", function () {
	if(this.checked) {
		selectedObject.material.transparent = true;
		selectedObject.material.opacity = 0.5;
		selectedObject.material.needsUpdate = true;
		updateSceneData();
	} else if(!this.checked) {
		selectedObject.material.opacity = 1;
		selectedObject.material.transparent = false;
		selectedObject.material.needsUpdate = true;
		updateSceneData();
	}
});

const studSize = 1000;
let partList = document.getElementById('blk');
let colList = document.getElementById('select-color');

document.getElementById("duplicate-part").addEventListener("click", function () {
    if (selectedObject) {
        duplicatePart();
    }
});

document.getElementById("selected-map").addEventListener("input", function () {
    console.log(`Selected material number is ${this.value}`);
    selectedMap = this.value;
});

document.getElementById("delete-block").addEventListener("click", function () {
    deleteBlock(selectedObject);
});

document.getElementById("takeScreenshot").addEventListener("click", function () {
    let url = capture();
    let date = new Date();
    let a = document.createElement("a");

    a.href = url;
    a.download = `creation-screenshot-${date}.webp`;
    a.click();
});

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

document.getElementById("cre-export").addEventListener("click", () => {
    const jsonData = generateSceneJSON();
    const jsonBlob = new Blob([jsonData], { type: "application/json" });
    const elm = this;

    const url = URL.createObjectURL(jsonBlob);
    const date = getDate();
    const a = document.createElement("a");
    a.href = url;
    a.download = `json-creation-${date}.json`;
    a.click();

    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 10000);
});

document.getElementById("cre-export-gr8").addEventListener("click", () => {
    const fileData = generateSceneJSON();
    const dataBlob = new Blob([fileData], { type: "application/json" });
    const elm = this;

    const url = URL.createObjectURL(dataBlob);
    const date = getDate();
    const a = document.createElement("a");
    a.href = url;
    a.download = `gr8brik-creation-${date}.gr8`;
    a.click();

    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 10000);
});

document.getElementById("cre-export-gr8z").addEventListener("click", () => {
    let fileData = generateSceneJSON();
    let setting = JSON.stringify(window.settings, null, 2);
    let zip = new JSZip();

    zip.file("creation.gr8", fileData , { 
        compression: "DEFLATE", 
        compressionOptions: { level: 9 } 
    });

    zip.file("setting.json", setting , { 
        compression: "DEFLATE", 
        compressionOptions: { level: 9 } 
    });

    zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 9 }, comment: "Zipped Gr8Brik.rf.gd creation"}).then(function (blob) {
        let url = URL.createObjectURL(blob);
        let date = new Date();
        let a = document.createElement("a");
        a.href = url;
        a.download = `gr8brik-compressed-creation-${date}.gr8z`;
        a.click();

        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 10000);
    });
});

document.getElementById("cre-export-ldd").addEventListener("click", () => {
    console.log('clicked');
    const legoData = generateSceneLXFML();
    const zip = new JSZip();
    zip.file("IMAGE100.LXFML", legoData);
    const elm = this;

    zip.generateAsync({ type: "blob" }).then(function (blob) {
        const url = URL.createObjectURL(blob);
        const date = getDate();

        const a = document.createElement("a");
        a.href = url;
        a.download = `ldd-creation-${date}.lxf`;
        a.click();

        URL.revokeObjectURL(url);
    });
});

/*document.getElementById("cre-export-three").addEventListener("click", () => {
    if (!scene) {
        tooltip("Scene is empty");
        return;
    }

    const date = getDate();
    const json = scene.toJSON();
    const jsonString = JSON.stringify(json);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `threejs-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
});*/

document.getElementById("cre-export-three").addEventListener("click", () => {
    if (!scene) {
        tooltip("Scene is empty");
        return;
    }

    let fileData = JSON.stringify(scene.toJSON());
    let zip = new JSZip();
    let date = new Date();

    zip.file(`scene.json`, fileData , { 
        compression: "DEFLATE", 
        compressionOptions: { level: 9 } 
    });

    zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 9 }}).then(function (blob) {
        let url = URL.createObjectURL(blob);
        let date = new Date();
        let a = document.createElement("a");
        a.href = url;
        a.download = `threejs-${date}.zip`;
        a.click();

        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 10000);
    });
});

document.getElementById("selected-object-export-three").addEventListener("click", () => {
    if (!scene) {
        tooltip("Scene is empty");
        return;
    }

    if (!selectedObject || !selectedObject.geometry) {
        tooltip("Please select an object")
    }

    const name = selectedObject.userData.ldraw.replace("parts/", "");
    const date = getDate();
    const json = selectedObject.geometry.toJSON();

    const jsonString = JSON.stringify(json);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}-${date}.json`;

    a.click();
    URL.revokeObjectURL(url);
});

/* function exportSceneToMPD(name) {
    const lines = [];

    const ldraw_color_map = {
    "C91A09": 4, // Bright Red
    "F8CC00": 14, // Bright Yellow
    "0020A0": 12, // Bright Blue
    "005700": 28, // Dark Green
    "FE8A18": 10, // Bright Orange
    "D941BB": 124, // Bright Violet / Dark Purple

    "000000": 0, // Black
    "FFFFFF": 15, // White
    "747371": 294, // Dark Stone Grey / Dark Bluish Grey
    "A3A2A4": 295, // Medium Stone Grey / Light Bluish Grey
    "958A73": 5, // Brick Yellow / Tan
    "6C5C4D": 8, // Dark Stone Grey / Dark Brown

    "812A00": 308, // Reddish Brown
    "5883C1": 23, // Medium Blue
    "4B974B": 37, // Sand Green
    "A52A2A": 59, // Dark Red
    "B36D2C": 38, // Dark Orange
    "FCB7BC": 223, // Bright Pink

    "60C0E0": 212, // Bright Light Blue
    "FBE696": 226, // Light Yellow
    "84B68D": 36, // Bright Green
    "92B28B": 335, // Bright Yellowish Green / Lime
    "002A5A": 26, // Dark Blue
    "DDDD22": 334, // Vibrant Yellow
    };

    lines.push(`0 FILE ${name}.ldr`);
    lines.push(`0 ${name}`);
    lines.push(`0 Name: ${name}.ldr`);
    lines.push(`0 Author: Exported from Three.js`);
    lines.push(`0 !LDRAW_ORG Model`);
    lines.push(`0 !LICENSE Redistributable under CCAL version 2.0`);
    lines.push(`0`);

    scene.updateMatrixWorld(true);

    scene.traverse(child => {
    if (!child.isMesh || !child.userData.ldraw || !child.userData.isBlock) {
        return;
    }

    const obj = child.clone();
    obj.applyMatrix4(new THREE.Matrix4().makeScale(1, 1, -1));
    obj.updateMatrixWorld(true);

    let color_code = 16;
    if(obj.material && !Array.isArray(obj.material)) {
        const hex = obj.material.color.getHexString() || "ffffff";
        color_code = ldraw_color_map[hex.toUpperCase()];
    }

    const file = obj.userData.ldraw.replace("parts/", "");
    const color = color_code;

    const pos = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    obj.matrixWorld.decompose(pos, quat, scale);

    /* const matrix = new THREE.Matrix3().setFromMatrix4(obj.matrixWorld);

    const e = matrix.elements;

    const rot = e;
    const x = pos.x;
    const y = pos.y;
    const z = pos.z; */

//const scaleFactor = 1000 / 0.4;

//const matrix = new THREE.Matrix3().setFromMatrix4(obj.matrixWorld);
//const rot = matrix.elements.map(n => n.toFixed(5));
//const e = matrix.elements;

//const e = obj.matrixWorld.elements; */

/*const rot = [
    e[0], e[4], e[8],  e[12] * scaleFactor,
    e[1], e[5], e[9],  e[13] * scaleFactor,
    e[2], e[6], e[10], e[14] * scaleFactor,
].map(n => n.toFixed(5)); */

/* const x = (pos.x * scaleFactor).toFixed(2);
const y = (pos.y * scaleFactor).toFixed(2);
const z = (pos.z * scaleFactor).toFixed(2); */

//const line = `1 ${color} ${x} ${y} ${z} ${rot.join(' ')} ${file}`;
//const line = `1 ${color} ${rot.join(' ')} ${file}`;

// const rot = [
// e[0], e[4], e[8],  e[12],
//  e[1], e[5], e[9],  e[13],
//   e[2], e[6], e[10], e[14],
// ].map(n => n.toFixed(5));

// const line = `1 ${color} ${rot[3]} ${rot[7]} ${rot[11]} ${rot[0]} ${rot[1]} ${rot[2]} ${rot[4]} ${rot[5]} ${rot[6]} ${rot[8]} ${rot[9]} ${rot[10]} ${file}`;

//const x = (e[12] * scaleFactor).toFixed(2);
//const y = (e[13] * scaleFactor).toFixed(2);
//const z = (-e[14] * scaleFactor).toFixed(2);

// const a = e[0].toFixed(5), b = e[4].toFixed(5), c = e[8].toFixed(5);
//  const d = e[1].toFixed(5), e2 = e[5].toFixed(5), f = e[9].toFixed(5);
// const g = e[2].toFixed(5), h = e[6].toFixed(5), i = e[10].toFixed(5);

// const line = `1 ${color} ${x} ${y} ${z} ${a} ${b} ${c} ${d} ${e2} ${f} ${g} ${h} ${i} ${file}`;
//lines.push(line);
/* }); */

/* let result =  lines.join('\n');
const date = getDate();

const blob = new Blob([result], { type: 'text/plain' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `creation-${date}.mpd`;
a.click();

setTimeout(() => URL.revokeObjectURL(url), 10000);
} */

function exportSceneToMPD(name) {
    const lines = [];
    const ldraw_color_map = new Map(ldrawColors.map(c => [c.hex.toUpperCase(), c.code]));

    lines.push(`0 FILE ${name}.ldr`);
    lines.push(`0 ${name}`);
    lines.push(`0 Name: ${name}.ldr`);
    lines.push(`0 Author: Exported from Three.js`);
    lines.push(`0 !LDRAW_ORG Model`);
    lines.push(`0 !LICENSE Redistributable under CCAL version 2.0`);
    lines.push(`0`);

    scene.updateMatrixWorld(true);
    scene.rotation.x += Math.PI;
    scene.traverse(child => {
        if (!child.isMesh || !child.userData.ldraw) {
            return;
        }

        let hex = "#FFFFFF";
        if(child.material && !Array.isArray(child.material)) {
            hex = "#" + child.material.color.getHexString().toUpperCase();
        } else {
           hex = "#FFFFFF"; //fallback too lazy to iterate over multi materials
        }

        let color_code = ldraw_color_map.get(hex.toUpperCase()) || 16;
        let partName = child.userData.ldraw.replace("parts/", "");

        let pos = new THREE.Vector3();
        child.getWorldPosition(pos);
        let x = (pos.x).toFixed(2);
        let y = (pos.y).toFixed(2);
        let z = (pos.z).toFixed(2);

        // –– ROTATION ––
        let e = child.matrixWorld.elements;
        let a = e[0].toFixed(5),
            b = e[4].toFixed(5),
            c = e[8].toFixed(5),
            d = e[1].toFixed(5),
            ee = e[5].toFixed(5),
            f = e[9].toFixed(5),
            g = e[2].toFixed(5),
            h = e[6].toFixed(5),
            i = e[10].toFixed(5);

        let line = [
            `1`, color_code,
            x, y, z,
            a, b, c,
            d, ee, f,
            g, h, i,
            partName
        ].join(" ");
        lines.push(line);
    });
    scene.rotation.x -= Math.PI;

    let result = lines.join('\n');
    let date = getDate();

    let blob = new Blob([result], { type: 'text/plain' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = `creation-${date}.mpd`;
    a.click();

    setTimeout(() => URL.revokeObjectURL(url), 10000);
}

document.getElementById("cre-import").addEventListener("change", function (event) {
    let file = event.target.files[0];
    if (!file) {
        console.error("No file selected");
        tooltip("No file selected.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const jsonData = JSON.parse(e.target.result);
            loadSceneFromJSON(jsonData);
        } catch (err) {
            tooltip("Invalid JSON file.");
            console.error(err);
        }
        event.target.value = "";
    };
    reader.readAsText(file);
});

function loadJSONFromCloud(model) {
    fetch(start_url + `/ajax/build?buildId=${model}&fetch=true`)
        .then(res => res.json())
            .then(data => {
                if (data === null) {
                    alert('Empty response');
                }
                
                if(data.error) {
                    tooltip(data.error + ' ' + data.message);
                }

                let modelData = data.model;
                tooltip('Importing model "' + data.name + '"');

                if(modelData) {
                    fetch(start_url + `${data.model}`)
                        .then(res => res.json())
                            .then(data => {
                                if (data === null) {
                                    alert('Empty model');
                                }

                                if(data) {
                                    loadSceneFromJSON(data);
                                }
                            });
                }
            });
};

document.getElementById("cre-import-gr8z").addEventListener("change", function (event) {
    let file = event.target.files[0];
    if (!file) {
        console.error("No file selected");
        tooltip("No file selected.");
        return;
    }

        try {
            let zip = new JSZip();
            zip.loadAsync(file).then(function(zip) {
                let creation = zip.file("creation.gr8").async("string");
                creation.then(function(data) {
                    setTimeout(() => {
                        console.log(data);
                        let jsonData = JSON.parse(data);
                        loadSceneFromJSON(jsonData);
                    }, 250);
                });
            });
        } catch (err) {
            tooltip("Invalid JSON file.");
            console.error(err);
        }
        event.target.value = "";
});

document.getElementById("cre-import-ldr").addEventListener("change", async function (event) {
    let file = event.target.files[0];
    if (!file) {
        console.error("No file selected");
        tooltip("No file selected.");
        return;
    }

    async function asyncTraverse(object, callback) {
        await callback(object);
        for (let child of object.children) {
            await asyncTraverse(child, callback);
        }
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const content = e.target.result;

            /* ldraw_loader.parse(content, function (creation) {
                const converted = ldrawToJSON(creation);
                console.log("converted: " + JSON.stringify(converted, null, 2));
                loadSceneFromJSON(converted);
            }); */

            /* ldraw_loader.parse(e.target.result, async function (creation) {
                creation.traverse(function (child) {
                if (child?.userData?.fileName || child?.parent?.userData?.fileName || child?.parent?.parent?.userData?.fileName) {
                    let filename = child?.userData?.fileName || child?.parent?.userData?.fileName || child?.parent?.parent?.userData?.fileName;
 
                    part = 'parts/' + filename;
                    partName = filename;
                    console.log(part);
 
                    partColor = '#' + child?.material?.color?.getHexString();
 
                    partPosition = child.position.clone();
                    partRotation = child.rotation.clone();
 
                    addBlock();
                    child.visible = false;
                }
                if(child.isLineSegments) {
                    child.visible = false;
                }
                });
 
                scene.add(creation);
                scene.rotation.x += Math.PI;
            }); */

            ldraw_loader.parse(e.target.result, async function (creation) {
                creation.rotation.x += Math.PI;
                creation.updateMatrixWorld(true);

                await asyncTraverse(creation, async (child) => {
                    if (child?.userData?.fileName || child?.parent?.userData?.fileName || child?.parent?.parent?.userData?.fileName) {
                        let filename = child?.userData?.fileName;

                        part = 'parts/' + filename;
                        partName = filename;
                        let childColor;
                        let partMatrix;

                        child.traverse((subChild) => {
                            if (subChild.isMesh) {
                                partMatrix = subChild.matrixWorld.clone();

                                if (subChild.material) {
                                    if(Array.isArray(subChild.material)) {
                                        childColor = subChild.material[1].color;
                                    } else {
                                        childColor = subChild.material.color;
                                    }
                                    
                                    childColor = '#' + childColor.getHexString();
                                } else {
                                    console.log('no material');
                                    childColor = "#fafafa";
                                }
                            }
                        });

                        if(!partMatrix) {
                            return new Error('Part missing matrixWorld');
                        }

                        addBlockV2(part, childColor, partMatrix, null, null, part, null, 1.0, null, null);
						child.visible = false;
                    }

                    if (child.isLineSegments) {
                        child.visible = false;
                    }
                });
                scene.add(creation);
            });

        } catch (err) {
            tooltip("Invalid LDraw file.");
            console.error(err);
        }

        event.target.value = "";
    };

    reader.readAsText(file);
});

async function loadSceneFromJSON(data) {
    if (!data || !data.blocks || !Array.isArray(data.blocks)) {
        console.error("Invalid JSON data.");
        tooltip("Invalid JSON.");
        return;
    }

    if(show_import_animation === true) {
        document.getElementById('ui-loading-file').style.display = "block";
        document.getElementsByClassName('scene')[0].style.opacity = "0.1";
    }

    let modelName = data?.metadata?.name || "unnamed";
    for (const block of data.blocks) {
        partName = block.ldraw;
        partPosition = block.position;
        partRotation = block.rotation;
        partMatrixWorld = null;
		partTexture = block.texturedata;
        partOpacity = block.opacity ?? '1.0';
        //partColor = '#ffffff';
        let partMaterials = block.materials;

        if (block.matrixw && Array.isArray(block.matrixw.elements)) {
            partMatrixWorld = new THREE.Matrix4().fromArray(block.matrixw.elements);
        } else if (partPosition && partRotation) {
            const position = new THREE.Vector3(partPosition.x, partPosition.y, partPosition.z);
            const scale = new THREE.Vector3(1, 1, 1);

            const rotationEuler = new THREE.Euler(partRotation.x, partRotation.y, partRotation.z, 'XYZ');
            const quaternion = new THREE.Quaternion().setFromEuler(rotationEuler);

            partMatrixWorld = new THREE.Matrix4().compose(position, quaternion, scale);
        } else {
            throw new Error('Object is missing elements: matrixw.elements (can also use traditional block.position and block.rotation');
        }

        /*for (const mat of block.materials) {
            if(mat.name.includes("Main_Colour") || mat.name == null || block.materials.length < 2) {
                if(mat.color) {
                    partColor = '#' + mat.color
                }
            }
        }*/

        part = 'parts/' + block.ldraw;

        try {
            await new Promise((resolve, reject) => {
                addBlockV2(part, partMaterials, partMatrixWorld, null, null, part, partTexture, partOpacity, resolve, reject);
            });
        } catch (err) {
            console.warn(`Failed to add block: ${block.ldraw}`, err);
            tooltip(`Failed to load ${block.ldraw}`);
        }
    }
    document.title = modelName + ' - ' + DEFAULT_TITLE;

    if(show_import_animation === true) {
        console.log("Creation imported.");
        tooltip("Creation imported.");
        document.getElementById('ui-loading-file').style.display = "none";
        document.getElementsByClassName('scene')[0].style.opacity = "1.0";
    }
    updateSceneData();
}

function ldrawToJSON(group) {
    const blocks = [];

    const ldraw_code_to_hex = {
        // row 1
        4: "C91A09",   // Bright Red
        14: "F8CC00",   // Bright Yellow
        12: "0020A0",   // Bright Blue
        28: "005700",   // Dark Green
        10: "FE8A18",   // Bright Orange
        124: "D941BB",   // Bright Violet

        // row 2
        0: "000000",   // Black
        15: "FFFFFF",   // White
        294: "747371",   // Dark Stone Grey
        295: "A3A2A4",   // Medium Stone Grey
        5: "958A73",   // Dark Tan
        8: "6C5C4D",   // Brown

        // row 3
        308: "812A00",   // Dark Brown
        23: "5883C1",   // Medium Blue
        37: "4B974B",   // Sand Green
        59: "A52A2A",   // Dark Red
        38: "B36D2C",   // Dark Orange
        223: "FCB7BC",   // Bright Pink

        // row 4
        212: "60C0E0",   // Bright Light Blue
        226: "FBE696",   // Earth Yellow
        36: "84B68D",   // Bright Green
        335: "92B28B",   // Lime Green
        26: "002A5A",   // Dark Blue
        334: "DDDD22"    // Vibrant Yellow
    };

    group.traverse(function (child) {
        if (child?.isGroup && child?.parent && child?.parent?.userData && child?.parent?.userData?.fileName) {
            console.log(child?.userData);
            console.log(child?.parent?.userData?.fileName)

            const ldraw_data = child?.parent?.userData;

            //fetch(`https://raw.githubusercontent.com/susstevedev/gr8brik-ldraw-fork/refs/heads/main/ldraw-parts/actual/${ldraw_data.fileName}`)
            fetch(`https://cdn.githubraw.com/susstevedev/gr8brik-ldraw-fork/refs/heads/main/ldraw-parts/actual/${ldraw_data.fileName}`)
                .then(res => res)
                .then(data => {
                    if (data === null) {
                        ldraw_data.fileName = 'p/empty.dat';
                    }
                });

            const fileName = ldraw_data.fileName || "3001.dat";
            let colorHex;

            if (child?.parent?.userData?.colorCode) {
                let colorCode = child.parent.userData.colorCode;
                if (!(colorCode in ldraw_code_to_hex)) {
                    console.warn("Unknown color code color:", colorCode);
                }
                colorHex = ldraw_code_to_hex[colorCode] ?? "ffffff";
            } else {
                colorHex = "ffffff";
            }

            const worldPos = new THREE.Vector3();
            child.parent.getWorldPosition(worldPos);

            const worldQuat = new THREE.Quaternion();
            child.parent.getWorldQuaternion(worldQuat);

            const euler = new THREE.Euler().setFromQuaternion(worldQuat);
            child.parent.scale.set(1, 1, 1);

            blocks.push({
                color: colorHex,
                position: { x: worldPos.x, y: worldPos.y, z: worldPos.z },
                rotation: { x: euler.x, y: euler.y, z: euler.z },
                ldraw: fileName
            });
        }
    });

    console.log({ blocks });
    return { blocks };
}

/*document.getElementById("import-btn-three").addEventListener("click", function () {
    document.getElementById("cre-import-three").click();
});*/

document.getElementById("cre-import-three").addEventListener("change", function (event) {
    let file = event.target.files[0];
    if (!file) {
        console.error("No file selected");
        tooltip("No file selected");
        return;
    }

    let reader = new FileReader();

    reader.onload = async function (e) {
        try {
            let zip = await JSZip.loadAsync(e.target.result);
            let jsonFile = zip.file("scene.json");

            if (!jsonFile) {
                throw new Error("scene.json not found inside the zip file");
            }

            let jsonString = await jsonFile.async("string");
            let data = JSON.parse(jsonString);
            let loader = new THREE.ObjectLoader();

            let object;

            if (selectedObject) {
                transformControls.detach(selectedObject);
                selectedObject = null;
            }

            /*if (!Array.isArray(data)) {
                if (data?.metadata && data?.metadata?.type === "Object") {
                    object = loader.parse(data);
                } else {
                    return new Error('Invalid file');
                }
            } else {
                data.forEach(function (item) {
                    object = loader.parse(item);
                });
            }*/

            if (!Array.isArray(data)) {
                if (data?.metadata?.type === "App" && data.scene) {
                    object = loader.parse(data.scene);
                    scene.add(object);
                } else if (data?.metadata?.type === "Scene") {
                    object = loader.parse(data);
                    scene.add(object);
                } else if (data?.metadata?.type === "Object") {
                    object = loader.parse(data);
                    scene.add(object);
                } else if (data?.metadata) {
                    object = loader.parse(data);
                    scene.add(object);
                } else {
                    throw new Error(`Unsupported JSON metadata type: ${data?.metadata?.type || 'Unknown'}`);
                }
            } else {
                data.forEach(function (item) {
                    if (item?.metadata) {
                        object = loader.parse(item);
                        scene.add(object);
                    }
                });
            }
        } catch (err) {
            tooltip(`error: ${err}`);
            console.error(err);
        }
        event.target.value = "";
        updateSceneData();
    };
    reader.readAsArrayBuffer(file);
});

// moved to start of document
//var container, camera, scene, renderer, controls, transformControls, grid_helper, directional_lighting, ambient_lighting, ldraw_loader, loading_manager, mouse, raycaster, partRotation, partPosition, selectedObject, customPosition, selectedMap, selectedExport, named_parts = null;

let blocks = [];
let blockGroups = [];

init();
//animate();
initRenderer();

function getCookie(name) {
    var cookies = document.cookie;
    var parts = cookies.split(name + "=");
    var cookieValue = null;
    if (parts.length == 2) {
        cookieValue = parts.pop().split(";").shift();
    }
    return cookieValue;
}

function toggleGlobalSnap() {
    if (scene.userData.noSnap === true) {
        scene.userData.noSnap = false;
    } else {
        scene.userData.noSnap = true;
    }
    scene.updateMatrixWorld(true);
    saveSettings();
}

document.getElementById("hide-welcome").addEventListener("change", function () {
    if (scene.userData.hideWelcome === true) {
        scene.userData.hideWelcome = false;
    } else {
        scene.userData.hideWelcome = true;
    }
    scene.updateMatrixWorld(true);
    saveSettings();
});

if(scene.userData.hideWelcome === true) {
    document.getElementById("welcome-popup").remove();
    document.getElementById("hide-welcome").setAttribute('checked', 'true');
}

document.getElementById("flatcamera-enable").addEventListener("change", function () {
    if (scene.userData.flatcamera === true) {
        scene.userData.flatcamera = false;
        update_camera();
    } else {
        scene.userData.flatcamera = true;
        update_camera();
    }
    scene.updateMatrixWorld(true);
    saveSettings();
});

document.getElementById("snapping-enable").addEventListener("change", function () {
    const snapping = this.checked;
    scene.userData.noSnap = snapping;
    toggleGlobalSnap();
});

// toggle smooth normals
document.getElementById("smooth-normals-enable").addEventListener("change", function () {
    ldraw_loader.smoothNormals = this.checked;

    scene.traverse((child) => {
        if (child.isMesh && child.userData.isBlock && child.geometry) {
            if (Array.isArray(child.material)) {
                child.material.forEach(mat => {
                    mat.flatShading = !ldraw_loader.smoothNormals;
                    mat.needsUpdate = true;
                });
            } else {
                child.material.flatShading = !ldraw_loader.smoothNormals;
                child.material.needsUpdate = true;
            }
        }
    });
    scene.updateMatrixWorld(true);
    saveSettings();
});

document.getElementById("display-lines-enable").addEventListener("change", function () {
    const displayLines = this.checked;
    scene.userData.displayLines = displayLines;

    scene.traverse((obj) => {
        if (obj.isLineSegments && obj.userData && obj.userData.ldr_line === true) {
            obj.visible = displayLines;
        }
    });

    scene.updateMatrixWorld(true);
    saveSettings();
});

document.getElementById("pbr-enable").addEventListener("change", function () {
    const highRes = this.checked;
    scene.userData.highRes = highRes;

    scene.traverse(function (obj) {
        if (obj?.userData && obj?.userData?.isBlock === true) {
            if (highRes) {
                obj.material = new THREE.MeshPhysicalMaterial({
                    color: new THREE.Color(obj?.material?.color),
                    reflectivity: 0.5,
                    roughness: 0.4,
                    metalness: 0.1,
                    envMapIntensity: 0.5,
                });
            } else {
                obj.material = new THREE.MeshLambertMaterial({
                    color: new THREE.Color(obj?.material?.color)
                });
            }
        }
    });

    scene.updateMatrixWorld(true);
    saveSettings();
});

/*document.getElementById("trans-enable").addEventListener("change", function () {
    const ui_trans = this.checked;
    scene.userData.ui_trans = ui_trans;

    if(scene.userData.ui_trans) {
        //document.getElementsByClassName('ui-popup-contain').classList.add('trans');

        // Source - https://stackoverflow.com/a/24219779
        // Posted by James Hill, modified by community. See post 'Timeline' for change history
        // Retrieved 2025-12-18, License - CC BY-SA 3.0

        let elements = document.querySelectorAll('.ui-canbe-trans');

        //for(let i = 0; i < element.length; i++) {
            //element[i].classList.add('trans');
        //}

        elements.forEach(element => {
            element.classList.add('trans');
        });
    } else {
        //let element = document.getElementsByClassName('ui-canbe-trans');
        let elements = document.querySelectorAll('.ui-canbe-trans');

        //for(let i = 0; i < element.length; i++) {
            //element[i].classList.remove('trans');
        //}

        elements.forEach(element => {
            element.classList.add('trans');
        });
    }

    scene.updateMatrixWorld(true);
    saveSettings();
});*/

document.getElementById("trans-enable").addEventListener("change", function () {
    const ui_trans = this.checked;
    scene.userData.ui_trans = ui_trans;

    applyTransparent(scene.userData.ui_trans);
});

/*document.getElementById("hdr-enable").addEventListener("change", function () {
    const use_hdri = this.checked;
    scene.userData.use_hdri = use_hdri;

    if (!use_hdri) {
        scene.userData.hdri_background = false;
        document.getElementById("hdr-background-enable").checked = false;
    }

    applyHdri(use_hdri, scene.userData.hdri_background);
});

document.getElementById("hdr-background-enable").addEventListener("change", function () {
    const hdri_background = this.checked;
    scene.userData.hdri_background = hdri_background;

    if(!scene.userData.use_hdri) {
        scene.userData.hdri_background = false;
        tooltip('Please enable "HDRI lighting" to change the background');
        return;
    }
    applyHdri(scene.userData.use_hdri, scene.userData.hdri_background);
});*/

document.getElementById("hdr-enable").addEventListener("change", function () {
    const use_hdri = this.checked;
    scene.userData.use_hdri = use_hdri;

    document.getElementById("hdr-background-enable").disabled = !use_hdri;
    if (!use_hdri) {
        scene.userData.hdri_background = false;
        document.getElementById("hdr-background-enable").checked = false;
    }

    applyHdri(use_hdri, scene.userData.hdri_background);
});

document.getElementById("hdr-background-enable").addEventListener("change", function () {
    const hdri_background = this.checked;

    if (!scene.userData.use_hdri) {
        this.checked = false; 
        scene.userData.hdri_background = false;
        tooltip('Please enable "HDRI lighting" to change the background');
        return;
    }

    scene.userData.hdri_background = hdri_background;
    applyHdri(scene.userData.use_hdri, scene.userData.hdri_background);
});

document.getElementById("export-fullscene-enable").addEventListener("change", function () {
    const export_full_scene = this.checked;
	scene.userData.export_full_scene = export_full_scene;

    scene.updateMatrixWorld(true);
    saveSettings();
});

document.getElementById("darkmode-enable").addEventListener("change", function () {
    const enabled = this.checked;
	scene.userData.darkmode = enabled;

    if(enabled == true) {
        document.cookie = "mode=dark; max-age=315360000; path=/";
    } else {
        document.cookie = "mode=light; max-age=315360000; path=/";
    }

    scene.updateMatrixWorld(true);
    saveSettings();
});

function applyTransparent(ui_trans) {
    if(ui_trans) {
        // Source - https://stackoverflow.com/a/24219779
        // Posted by James Hill, modified by community. See post 'Timeline' for change history
        // Retrieved 2025-12-18, License - CC BY-SA 3.0

        let elements = document.querySelectorAll('.ui-canbe-trans');

        elements.forEach(element => {
            element.classList.add('trans');
        });
    } else {
        let elements = document.querySelectorAll('.ui-canbe-trans');

        elements.forEach(element => {
            element.classList.remove('trans');
        });
    }

    scene.updateMatrixWorld(true);
    saveSettings();
}

/*function applyHdri(use_hdri, background) {
    if(use_hdri) {
        let rgbe_loader = new THREE.HDRLoader(); // using hdrloader now because that's replaced for some reason
        let hdris = scene.userData.hdris;
        let selected = hdris.selected;
        let hdr_url;

        let selectedHdr = hdris[selected];
        hdr_url = selectedHdr ? selectedHdr.url : null;

        if (!hdr_url) {
            hdr_url = hdris[0].url; // default
        }

        rgbe_loader.load(hdr_url, function (texture) {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.environment = texture;

            if(background) {
                scene.background = texture;
                document.body.classList.add('hdri-active');

                if (isDark()) {
                    document.body.classList.add("dark");
                    document.getElementById("darkmode-enable").setAttribute('checked', 'true');
                } else {
                    if (document.body.classList.contains("dark")) {
                        document.body.classList.remove("dark");
                        document.getElementById("darkmode-enable").setAttribute('checked', 'false');
                    }
                }
            } else {
                renderer.setClearAlpha(0);
                document.body.classList.remove('hdri-active');
                scene.background = null;
                scene.environment = null;
            }
        });

        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
    } else {
        renderer.setClearAlpha(0);
        document.body.classList.remove('hdri-active');
        scene.background = null;
        scene.environment = null;
    }

    if (isDark()) {
        document.body.classList.add("dark");
        document.getElementById("darkmode-enable").setAttribute('checked', 'true');
    } else {
        if (document.body.classList.contains("dark")) {
            document.body.classList.remove("dark");
            document.getElementById("darkmode-enable").setAttribute('checked', 'false');
        }
    }

    scene.updateMatrixWorld(true);
    saveSettings();
}*/

function applyHdri(use_hdri, background) {
    if (use_hdri) {
        let rgbe_loader = new THREE.HDRLoader(); 
        let hdris = scene.userData.hdris;
        let selected = hdris.selected;
        let hdr_url;

        let selectedHdr = hdris[selected];
        hdr_url = selectedHdr ? selectedHdr.url : null;

        if (!hdr_url) {
            hdr_url = hdris[0].url; 
        }

        rgbe_loader.load(hdr_url, function (texture) {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.environment = texture;

            if (background) {
                scene.background = texture;
                document.body.classList.add('hdri-active');

                if (isDark()) {
                    document.body.classList.add("dark");
                    document.getElementById("darkmode-enable").setAttribute('checked', 'true');
                } else {
                    if (document.body.classList.contains("dark")) {
                        document.body.classList.remove("dark");
                        document.getElementById("darkmode-enable").setAttribute('checked', 'false');
                    }
                }
            } else {
                renderer.setClearAlpha(0);
                document.body.classList.remove('hdri-active');
                scene.background = null; 
            }
        });

        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
    } else {
        renderer.setClearAlpha(0);
        document.body.classList.remove('hdri-active');
        scene.background = null;
        scene.environment = null;
    }

    if (isDark()) {
        document.body.classList.add("dark");
        document.getElementById("darkmode-enable").setAttribute('checked', 'true');
    } else {
        if (document.body.classList.contains("dark")) {
            document.body.classList.remove("dark");
            document.getElementById("darkmode-enable").setAttribute('checked', 'false');
        }
    }

    scene.updateMatrixWorld(true);
    saveSettings();
}

function isDark() {
    if (getCookie('mode')) {
        if (getCookie('mode') === 'dark') {
            return true;
        } else {
            return false;
        }
    } else {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return true;
        } else {
            return false;
        }
    }
}

function snapToGrid(value, gridSize) {
    return Math.round(value / gridSize) * gridSize;
}

function getDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
}

function init() {
    mergeConfig(window.settings, window.defaults);

    if (isDark()) {
        document.body.classList.add("dark");
        document.getElementById("darkmode-enable").setAttribute('checked', 'true');
    } else {
        if (document.body.classList.contains("dark")) {
            document.body.classList.remove("dark");
            document.getElementById("darkmode-enable").setAttribute('checked', 'false');
        }
    }

    // Scene container
    if(!window.scene) {
        container = document.createElement('div');
        container.classList.add("scene");
        document.body.appendChild(container);
    }

    // Scene
    if(!window.scene) {
        scene = new THREE.Scene();
        window.scene = scene;
        scene.userData = window.settings;
    }
    
    // WebGl renderer
    //renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer = new WebGPURenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // transparent ui
    if(scene.userData.ui_trans) {
        applyTransparent(scene.userData.ui_trans);
        document.getElementById("trans-enable").setAttribute('checked', 'true');
    } else {
        document.getElementById("trans-enable").setAttribute('checked', 'false');
    }

    //hdri
    if(scene.userData.use_hdri) {
        applyHdri(scene.userData.use_hdri, scene.userData.hdri_background);
        document.getElementById("hdr-enable").setAttribute('checked', 'true');
    } else {
        document.getElementById("hdr-enable").setAttribute('checked', 'false');
    }

    // set pixel ratio
    // @the_an0nym pointed out how if your screen resolution isn't 100% (and in some cases just always), the scene looks buggy
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    window.update_camera = function() {
        let activeId = scene.userData.activeCameraId ?? 0;
        let cameraScene = scene.userData.camera;
        let camConfig = cameraScene.find(c => c.id === activeId);

        if (camConfig) {
            if (scene.background && !scene._savedHdriMap) {
                scene._savedHdriMap = scene.background; 
            }

            if (camConfig.type === "orthographic") {
                if(scene.userData.flatcamera != true) {
                    scene.userData.flatcamera = true;
                }

                camera = new THREE.OrthographicCamera(
                    window.innerWidth / -2, window.innerWidth / 2,
                    window.innerHeight / 2, window.innerHeight / -2,
                    0.1, 10000
                );
                camera.zoom = 2;
                document.getElementById("flatcamera-enable").checked = true;

                scene.background = new THREE.Color(0x1a1a1a);
                if (scene._savedHdriMap) {
                    scene.environment = scene._savedHdriMap;
                }
            } else {
                if (camConfig.type === "perspective") {
                    scene.userData.flatcamera = false;
                }

                if (scene._savedHdriMap) {
                    scene.background = scene._savedHdriMap;
                    scene.environment = scene._savedHdriMap;
                }

                let fov = camConfig.fov || window.defaults?.camera?.fov || 45;
                camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 10000);
                document.getElementById("flatcamera-enable").checked = false;
            }

            //camera.position.set(250, 250, 250);
            camera.position.set(camConfig.pos.x, camConfig.pos.y, camConfig.pos.z);
            camera.name = camConfig.name || "Default Camera";
            
            document.getElementById("current-camera").innerText = camera.name;
            camera.updateProjectionMatrix();

            if (typeof controls !== "undefined" && controls) {
                camera.lookAt(controls.target);
                controls.object = camera;
                controls.update();
            } else {
                camera.lookAt(0, 0, 0);
            }
        }
    }
    update_camera();

    // Lighting
    ambient_lighting = new THREE.AmbientLight(0xdddddd, 1);
    scene.add(ambient_lighting);

    directional_lighting = new THREE.DirectionalLight(0xffffff, 2);
    directional_lighting.position.set(250, 250, 250);
    scene.add(directional_lighting);

    transformControls = new THREE.TransformControls(camera, renderer.domElement);
    transformControls.size = 0.75;
    transformControls.setSpace('local'); 
    scene.add(transformControls.getHelper());

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.8;

    function makegrid() {
        let stud_size = 20; // 1 stud = 20 three/ldr units
        let grid_size = stud_size * 16; // studs wide
        let divisions = 16; // 1 division per stud
        let planeGeometry = new THREE.PlaneGeometry(grid_size, grid_size);

        let textureLoader = new THREE.TextureLoader();
        let texture = textureLoader.load('img/misc/1x1.webp'); // Replace with your image URL
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(divisions, divisions);

        let planeMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true });
        let imagePlane = new THREE.Mesh(planeGeometry, planeMaterial);
        imagePlane.rotation.x = -Math.PI / 2; 
        scene.add(imagePlane);

        if (isDark()) {
            grid_helper = new THREE.GridHelper(grid_size, divisions, 0xfafafa, 0xfafafa);
            scene.add(grid_helper);
        } else {
            grid_helper = new THREE.GridHelper(grid_size, divisions, 0x242424, 0x242424);
            scene.add(grid_helper);
        }

        grid_helper.transparent = true;
        grid_helper.material.opacity = grid_helper.material.opacity / 2;
        grid_helper.position.y = 0.1;
        planeMaterial.needsUpdate = true;
        grid_helper.needsUpdate = true;
    }
    makegrid();

    loading_manager = new THREE.LoadingManager();

    loading_manager.setURLModifier((url) => {
        return url;
    });

    loading_manager.onError = (url) => {
        console.warn("missing part " + url);
        loading_manager.itemEnd(url);
    };

    // loader config
    // please read ldrawloader docs before changing these values
    //const ldraw_path = "https://cdn.githubraw.com/susstevedev/gr8brik-ldraw-fork/refs/heads/main/ldraw-parts/";
    const ldraw_path = "https://githubraw.com/susstevedev/gr8brik-ldraw-fork/refs/heads/main/ldraw-parts/"; // FOR TESTING ONLY
    ldraw_loader = new THREE.LDrawLoader();
    ldraw_loader.preloadMaterials(ldraw_path + 'colors/ldconfig.ldr');
    ldraw_loader.setConditionalLineMaterial(LDrawConditionalLineMaterial);
    ldraw_loader.setPath(ldraw_path + 'actual/');
    ldraw_loader.setPartsLibraryPath(ldraw_path + 'actual/');
    ldraw_loader.separateObjects = true;

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    window.addEventListener('keydown', function (event) {
        let activeElement = document.activeElement;

        if (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA") {
            return;
        }

        switch (event.code) {
            case 'KeyT':
                moveBlock('t')
                break
            case 'KeyR':
                moveBlock('r')
                break
            case 'KeyS':
                moveBlock('s')
                break
            case 'Escape':
                deselect(selectedObject);
                break
            case 'Delete':
                deleteBlock(selectedObject);
                break
            case 'ArrowUp':
                selectedObject.rotation.x -= THREE.MathUtils.degToRad(45);
                updateSceneData();
                break;
            case 'ArrowDown':
                selectedObject.rotation.x += THREE.MathUtils.degToRad(45);
                updateSceneData();
                break;
            case 'ArrowLeft':
                selectedObject.rotation.y -= THREE.MathUtils.degToRad(45);
                updateSceneData();
                break;
            case 'ArrowRight':
                selectedObject.rotation.y += THREE.MathUtils.degToRad(45);
                updateSceneData();
                break;
        }
    })

    document.getElementById('move-block-t').addEventListener('click', function () {
        if (selectedObject) {
            moveBlock('t');
        }
    });

    document.getElementById('move-block-r').addEventListener('click', function () {
        if (selectedObject) {
            moveBlock('r');
        }
    });

    window.addEventListener('resize', onWindowResize, true);

    transformControls.addEventListener('mouseDown', function () {
        controls.enabled = false;
    });

    transformControls.addEventListener('mouseUp', function () {
        controls.enabled = true;
        statehistory.saveState();
    });

    transformControls.addEventListener('dragging-changed', function (event) {
        controls.enabled = !event.value;
    });

    let original_pos = new THREE.Vector3();
    let original_rot = new THREE.Euler();

    /*transformControls.addEventListener('mouseDown', () => {
        if (selectedObject) {
            original_pos.copy(selectedObject.position);
            original_rot.copy(selectedObject.rotation);
        }
    });

    transformControls.addEventListener('objectChange', function () {
        const obj = transformControls.object;

        if (obj && !(obj.userData.noSnap || scene.userData.noSnap)) {
            const delta_pos = new THREE.Vector3().subVectors(obj.position, original_pos);

            const snapped_pos = new THREE.Vector3(
                snapToGrid(delta_pos.x, 10),
                snapToGrid(delta_pos.y, 4),
                snapToGrid(delta_pos.z, 10)
            );

            const final_pos = original_pos.clone().add(snapped_pos);
            obj.position.copy(final_pos);

            const delta_rot = new THREE.Euler(
                obj.rotation.x - original_rot.x,
                obj.rotation.y - original_rot.y,
                obj.rotation.z - original_rot.z
            );

            const snapped_rot = new THREE.Euler(
                Math.round(delta_rot.x / THREE.MathUtils.degToRad(45)) * THREE.MathUtils.degToRad(45),
                Math.round(delta_rot.y / THREE.MathUtils.degToRad(45)) * THREE.MathUtils.degToRad(45),
                Math.round(delta_rot.z / THREE.MathUtils.degToRad(45)) * THREE.MathUtils.degToRad(45)
            );

            const final_rot = new THREE.Euler(original_rot.x + snapped_rot.x, original_rot.y + snapped_rot.y, original_rot.z + snapped_rot.z);
            obj.rotation.copy(final_rot);
            obj.updateMatrixWorld(true);
            scene.updateMatrixWorld(true);

            partPosition = obj?.pos || null;
            partRotation = obj?.rot || null;;
        }
        updateSceneData();
    });*/

    transformControls.addEventListener('mouseDown', () => {
        let obj = transformControls.object;
        if (!obj) {
            return;
        }

        if (!obj.userData.originalTransform) {
            obj.userData.originalTransform = {
                pos: new THREE.Vector3(),
                rot: new THREE.Euler()
            };
        }

        obj.userData.originalTransform.pos.copy(obj.position);
        obj.userData.originalTransform.rot.copy(obj.rotation);
    });

    /*transformControls.addEventListener('objectChange', function () {
        let obj = transformControls.object;
        if (!obj) {
            return;
        }

        if (!scene.userData.noSnap && obj.userData.originalTransform) {
            let origPos = obj.userData.originalTransform.pos;
            let origRot = obj.userData.originalTransform.rot;

            let current_world_pos = new THREE.Vector3();
            obj.getWorldPosition(current_world_pos);

            let start_world_pos = origPos.clone();
            if (obj.parent) {
                obj.parent.localToWorld(start_world_pos);
            }
            
            let worldDeltaPos = new THREE.Vector3().subVectors(current_world_pos, start_world_pos);

            let snappedWorldDelta = new THREE.Vector3(
                snapToGrid(worldDeltaPos.x, 10),
                snapToGrid(worldDeltaPos.y, 4),
                snapToGrid(worldDeltaPos.z, 10)
            );

            let localDeltaPos = snappedWorldDelta.clone();
            if (obj.parent) {
                let inverseParentMatrix = new THREE.Matrix4().copy(obj.parent.matrixWorld).invert();
                localDeltaPos.applyMatrix4(inverseParentMatrix);
                
                let parentWorldPos = new THREE.Vector3();
                obj.parent.getWorldPosition(parentWorldPos);
                localDeltaPos.add(parentWorldPos).applyMatrix4(inverseParentMatrix);
            }

            obj.position.copy(origPos).add(localDeltaPos);

            let delta_rot = new THREE.Euler( obj.rotation.x - origRot.x, obj.rotation.y - origRot.y, obj.rotation.z - origRot.z );

            let snap_angle = THREE.MathUtils.degToRad(45);
            let snapped_rot = new THREE.Euler(
                Math.round(delta_rot.x / snap_angle) * snap_angle,
                Math.round(delta_rot.y / snap_angle) * snap_angle,
                Math.round(delta_rot.z / snap_angle) * snap_angle
            );
            
            obj.rotation.set(
                origRot.x + snapped_rot.x,
                origRot.y + snapped_rot.y,
                origRot.z + snapped_rot.z
            );

            obj.updateMatrixWorld(true);

            if (obj.parent) {
                obj.parent.updateMatrixWorld(true);
            }

            obj.pos = obj.position.clone();
            obj.rot = obj.rotation.clone();
        }  
        updateSceneData();
    });*/

    transformControls.addEventListener('objectChange', function () {
        const obj = transformControls.object;
        if (!obj) {
            return;
        }

        if (!scene.userData.noSnap && obj.userData.originalTransform) {
            const origPos = obj.userData.originalTransform.pos;
            const origRot = obj.userData.originalTransform.rot;

            const delta_pos = new THREE.Vector3().subVectors(obj.position, origPos);
            const snapped_pos = new THREE.Vector3(
                snapToGrid(delta_pos.x, 10),
                snapToGrid(delta_pos.y, 4),
                snapToGrid(delta_pos.z, 10)
            );
            obj.position.copy(origPos).add(snapped_pos);

            const delta_rot = new THREE.Euler(
                obj.rotation.x - origRot.x,
                obj.rotation.y - origRot.y,
                obj.rotation.z - origRot.z
            );

            const snapAngle = THREE.MathUtils.degToRad(45);
            const snapped_rot = new THREE.Euler(
                Math.round(delta_rot.x / snapAngle) * snapAngle,
                Math.round(delta_rot.y / snapAngle) * snapAngle,
                Math.round(delta_rot.z / snapAngle) * snapAngle
            );
            
            obj.rotation.set(
                origRot.x + snapped_rot.x,
                origRot.y + snapped_rot.y,
                origRot.z + snapped_rot.z
            );

            obj.pos = obj.position.clone();
            obj.rot = obj.rotation.clone();
        }
        
        updateSceneData();
    });

    if (document.querySelector('.stats-contain')) {
        stats.dom.classList.add('stats');
        stats.dom.style.left = '';
        stats.dom.style.top = '';
        document.querySelector('.stats-contain').appendChild(stats.dom);
    }

    document.title = DEFAULT_TITLE;

    let versionstrings = document.querySelectorAll('.version-string');
    console.log(versionstrings);
    versionstrings.forEach(elm => {
        elm.textContent = window.version;
    });
}

class statehistoryManager {
  constructor(scene) {
    this.scene = scene;
    this.undoStack = [];
    this.redoStack = [];
    this.saveState();
    this.maxHistory = 30;
  }

  saveState() {
    const snapshot = generateSceneJSON();
  
    this.undoStack.push(snapshot);
    this.redoStack = [];

    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift(); 
    }

    console.log('Save state');
  }

  undo() {
    if (this.undoStack.length <= 1) {
        return; 
    }
    
    const currentState = this.undoStack.pop();
    this.redoStack.push(currentState);
    
    const previousState = this.undoStack[this.undoStack.length - 1];
    this.loadState(previousState);
  }

  redo() {
    if (this.redoStack.length <= 0) {
        return;
    }
    
    const nextState = this.redoStack.pop();
    this.undoStack.push(nextState);
    this.loadState(nextState);
  }

  loadState(jsonState) {
    console.log(jsonState);
    
    if (blockGroups && blockGroups.length > 0) {
        blockGroups.forEach(function (g) {
            scene.remove(g);
            if (g.geometry) {
                g.geometry.dispose();
            }
            if (g.material) {
                if (Array.isArray(obj.material)) {
                    g.material.forEach(m => m.dispose());
                } else {
                    g.material.dispose();
                }
            }
            g.updateMatrixWorld(true);
        });
        scene.updateMatrixWorld(true);
    }

    if (selectedObject) {
        selectedObject = null;
        transformControls.detach();
    }

    show_import_animation = false;
    loadSceneFromJSON(JSON.parse(jsonState));
    show_import_animation = true;

    this.scene.updateMatrixWorld();
  }
}

window.statehistory = new statehistoryManager(scene);

window.changeBlockColor = function(color) {
    const ldrawHexMap = new Map(ldrawColors.map(c => [c.hex.toUpperCase(), c.type]));

    if (!selectedObject) {
        tooltip("No part selected");
        return;
    }

    /*selectedObject.traverse((child) => {
        if (child.isMesh && child.material) {
            if (Array.isArray(child.material)) {
                let mat;
                if (selectedMap != null) {
                    if (child.material[selectedMap]) {
                        mat = child.material[selectedMap];
                    } else {
                        selectedMap = null;
                        tooltip('Invalid multi color map selected');
                        return;
                    }
                } else {					
                    if(child.userData.main_mat_name != undefined) {
                        mat = child.material[child.userData.main_mat_index];
                        selectedMap = child.userData.main_mat_index;
                    } else {
                        mat = child.material[0];
                        selectedMap = 0;
                    }
                }

                if (mat && mat.color && !mat.map) {
                    console.log(child.material[child.userData.main_mat_index]);
                    child.material[selectedMap].color = new THREE.Color(color || "#ffffff");
                    console.log(selectedMap);
                    child.material[selectedMap].needsUpdate = true;
                }
				
				document.querySelector('#selected-map').value = selectedMap;

                selectedMap = null;
            } else if (child.material.color) {
                child.material.color.set(color);
                child.material.needsUpdate = true;
            }
        }
    });*/

    selectedObject.traverse((child) => {
        if (child.isMesh && child.material) {
            
            //array material
            if (Array.isArray(child.material)) {
                let targetIdx;
                if (selectedMap != null) {
                    if (child.material[selectedMap]) {
                        targetIdx = selectedMap;
                    } else {
                        selectedMap = null;
                        tooltip('Invalid multi color map selected');
                        return;
                    }
                } else {					
                    if (child.userData.main_mat_name !== undefined) {
                        targetIdx = child.userData.main_mat_index;
                    } else {
                        targetIdx = 0;
                    }
                }

                const currentMat = child.material[targetIdx];
                if (currentMat && currentMat.color && !currentMat.map) {
                    child.material[targetIdx] = createCustomMaterial(color, ldrawHexMap);
                }
				
                document.querySelector('#selected-map').value = targetIdx;
                selectedMap = null;

            //single material
            } else if (child.material.color) {
                child.material = createCustomMaterial(color, ldrawHexMap);
            }
        }
    });

    updateSceneData();
    updateBLItems();
    updatecolorelement();
    statehistory.saveState();

    let namemap = new Map(ldrawColors.map(c => [c.hex.toUpperCase(), c.name]));
    let colorname = namemap.get(color.toUpperCase()) || color;

    console.log(`Part color changed to ${colorname}`);
    tooltip(`Part color changed to ${colorname}`);
}

function deleteBlock(part) {
    if (part) {
        if (part.isMesh || part.isGroup) {
            if (part.parent) {
                transformControls.detach(selectedObject);
                selectedObject = null;
                part.parent.remove(part);
            }

            if (part.geometry) {
                part.geometry.dispose();
                if(scene.userData.debug === true) {
                    console.log('disposed geometry');
                }
            }

            if (part.material && !Array.isArray(part.material)) {
                part.material.dispose();
                if(scene.userData.debug === true) {
                    console.log('disposed material');
                }
            }

            part.updateMatrixWorld(true);
            tooltip('Deleted part');
        } else {
            tooltip('Part is not a valid mesh')
        }

        updateBLItems();

        if (selectedObject === part) {
            deselect(part);
        }
    } else {
        tooltip('No part found');
    }
    scene.updateMatrixWorld(true);
    updateSceneData();
    statehistory.saveState();
}

/* Screenshot function */
function capture() {
    let thumb = new THREE.Scene();
    thumb.background = null;

    let count = 0;
	
    if (selectedObject) {
        transformControls.detach(selectedObject);
        transformControls.visible = false;
        selectedObject = null;
    }

    scene.traverse(function (object) {
        if (object?.isMesh && object?.userData.isBlock && !object?.isTransformControls) {
            let cloned = clone_mesh_clean(object);
            if (cloned) {
                thumb.add(cloned);
                if (object.userData.isBlock) {
                    cloned.rotation.setFromQuaternion(cloned.quaternion);
                }
                console.log(cloned);
                count++;
            }
        }
    });

    if (count === 0) {
        console.warn("Scene is empty");
        return null;
    }

    let light2 = new THREE.DirectionalLight(0xffffff, 2);
    light2.position.set(250, 250, 250);
    thumb.add(light2);

    let ambient2 = new THREE.AmbientLight(0xdddddd);
    thumb.add(ambient2);

    let capture_height = 500;
    let capture_width = Math.round(capture_height * (16 / 9));

    let camera2 = camera.clone();
    camera2.aspect = capture_width / capture_height;
    camera2.updateProjectionMatrix();

    let tempRenderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: true });
    tempRenderer.setClearColor(0x000000, 0); 
    tempRenderer.setPixelRatio(1);
    tempRenderer.setSize(capture_width, capture_height);
    
    tempRenderer.render(thumb, camera2);
    let thumbnail = tempRenderer.domElement.toDataURL("image/webp", 0.75);

    tempRenderer.dispose();
    thumb.clear();

    return thumbnail;
}

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let counter = 0;

    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
        counter += 1;
    }

    return result;
}

// Last cleaned up 6/2/2025 by susstevedev
function addBlock(throwSuccess, throwError) {
    if (!ldraw_loader) {
        console.error('LdrawLoader is missing or not loaded yet.');
        tooltip('Something really, really, wrong has occured. Weird...');
        return;
    }

    if (!part) {
        console.error('No part is selected!');
        tooltip('Please select a part.');
        return;
    }

    if (!partColor) {
        console.warn('Part color is not set. Setting color as white.');
        partColor = "#ffffff";
    }

    transformControls.detach(selectedObject);
    console.log("Loading part:", part);

    ldraw_loader.load(part, function (loadedGroup) {
        if (!loadedGroup) {
            console.error("Loaded group does not exist.");
            tooltip('Please select a block with valid mesh data');
            return;
        }

        let blockGroup = new THREE.Group();
        blockGroup.name = `ldraw_${makeid(10)}`;
        blockGroup.ldraw = part;

        let display_lines = scene.userData.displayLines;

        loadedGroup.traverse((child) => {
            if (child.isLineSegments && child.parent.isGroup) {
                child.visible = false;
                return;
            }

            if (child.isMesh && !child.material.map && !child.isLineSegments && !Array.isArray(child.material)) {
                const pos = new THREE.Vector3();
                const pos2 = child.getWorldPosition(pos);
                console.log(pos2);

                if (scene?.userData?.highRes === true) {
                    child.material = new THREE.MeshPhysicalMaterial({
                        color: new THREE.Color(partColor || "#ffffff"),
                        reflectivity: 0.5,
                        shininess: 75,
                        roughness: 0.4,
                        metalness: 0.1,
                        envMapIntensity: 0.5,
                    });
                } else {
                    child.material = new THREE.MeshPhongMaterial({
                        color: new THREE.Color(partColor || "#ffffff")
                    });
                }

                child.userData.isBlock = true;
                child.userData.isTexture = false;
                child.userData.ldraw = child.parent.userData.fileName || partName;
                child.userData.ldr_line = false;

                transformControls.attach(child);
                selectedObject = child;
            }

            if (child.material && child.material.map && child.isMesh && !child.isLineSegments) {
                child.userData.isBlock = true;
                child.userData.isTexture = true;
                child.userData.ldraw = child.parent.userData.fileName || partName;
                child.userData.ldr_line = false;
            }

            child.userData.parentName = partName;
            child.userData.id = makeid(15);
            child.userData.original_mat = child.material;

            if (child.material && child.isMesh && !child.isLineSegments) {
                const edges = new THREE.EdgesGeometry(child.geometry);
                const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));
                line.userData.ldr_line = true;
                child.add(line);

                if (display_lines != true) {
                    line.visible = false;
                }
            }
        });

        blockGroup.add(loadedGroup);

        if (partPosition && partRotation) {
            blockGroup.position.set(partPosition.x, partPosition.y, partPosition.z);
            blockGroup.rotation.set(partRotation.x, partRotation.y, partRotation.z);
        } else {
            blockGroup.position.y = objectSize(blockGroup).y;
            blockGroup.rotation.x = Math.PI;
        }

        blockGroup.userData.partName = partName;
        scene.add(blockGroup);

        blocks.push(blockGroup);
        blockGroups.push(blockGroup);
        blockGroup.sceneCount = blocks.length;

        tooltip(`Added part ${part.replace("parts/", "")}`);

        /* const texturename = `${part.split("/").pop().split(".")[0]}.png`;
        const texturepath = `https://raw.githubusercontent.com/susstevedev/gr8brik-ldraw-fork/refs/heads/main/ldraw-parts/actual/parts/textures/${texturename}`;
        const texturepath = 'https://d1xez26aurxsp6.cloudfront.net/users/qXBby2/avatars/680a924dab4ba.png';
        const textureLoader = new THREE.TextureLoader();

        textureLoader.load(texturepath, (texturemap) => {
            texturemap.colorSpace = THREE.SRGBColorSpace;
            blockGroup.traverse(child => {
                if (child.isMesh && child.material) {
                    child.material.map = texturemap;
                    child.material.needsUpdate = true;
                }
            });
        }, undefined, (err) => {
            console.warn("Texture load failed or doesn't exist:", err);
        }); */

        updateBLItems();
        updateSceneData();
        throwSuccess();
    }, undefined, function (error) {
        console.error('error loading piece:', error);
        throwError(error);
    });
}

/*

addBlock version 2
Adds part to scene (should be pretty clear)

Default config:
Ldraw part id, Object hex color, Object matrix world, HTML Object span, Ldraw icon image url, Ldraw part id, Texture url, Opacity (0.0 - 1.0), Success promise, Error promise

How would I handle so many variables to pass inside this?
You would set up something like this, for something you don't need, make it null

Example:
part, partColor, partMatrixW, span, original_img, part, null, null, null, null

*/

function addBlockV2(part, partColor, partMatrixW, partSpan, originalPSImg, fileName, texture, partOpacity, throwSuccess, throwError) {
    if (!ldraw_loader) {
        console.error('LdrawLoader is missing or not loaded yet');
        return;
    }

    if (!part) {
        console.error('No part is selected');
        return;
    }

    if (!partColor) {
        console.warn('Part color is not set setting color as white');
        partColor = "#ffffff";
    }

    transformControls.detach(selectedObject);

    if(!fileName || fileName === undefined || fileName === null) {
        fileName = part;
    }
	console.log(fileName);

    ldraw_loader.load(fileName, function (loadedGroup) {
        if (!loadedGroup) {
            console.error("Loaded group does not exist");
            return;
        }

        let blockGroup = new THREE.Group();
        blockGroup.name = `ldgroup_${blockGroup.uuid}`;
        blockGroup.ldraw = part;

        let display_lines = scene.userData.displayLines;
        let colormap = new Map(ldrawColors.map(c => [c.hex.toUpperCase(), c.type]));

        loadedGroup.traverse((child) => {
            if (child.isLineSegments && child.parent.isGroup) {
                child.visible = false;
                return;
            }

            let childOpacity = 1;
            console.log(partOpacity);
            if(partOpacity != null && partOpacity != undefined && partOpacity <= 1.0 && partOpacity <= 1) {
                childOpacity = partOpacity;
            }

            if(child.material) {
                console.log(child.material?.userData);
            }

            if (child.isMesh && !child.material.map && !child.isLineSegments && !Array.isArray(child.material)) {
                const pos = new THREE.Vector3();
                const pos2 = child.getWorldPosition(pos);
                console.log(pos2);

                const geometry = child.geometry;

                if (!geometry.attributes.uv) {
                    partUVGen(geometry);
                }

                if(!Array.isArray(partColor)) {
                    let custommaterial = createCustomMaterial(partColor, colormap);
                    if(custommaterial && scene?.userData?.highRes === true) {
                        child.material = custommaterial;
                    } else {
                        child.material = new THREE.MeshPhysicalMaterial({
                            color: new THREE.Color(partColor || "#ffffff")
                        });
                    }
                } else if(Array.isArray(partColor)) {
                    if(partColor.length < 2) {
                        let color = "#" + partColor[0]?.color || "#ffffff";
                        let custommaterial = createCustomMaterial(color, colormap);
                        if(custommaterial && scene?.userData?.highRes === true) {
                            child.material = custommaterial;
                        } else {
                            child.material = new THREE.MeshPhysicalMaterial({
                                color: new THREE.Color(color)
                            });
                        }
                    }
                }

                child.userData.isBlock = true;
                child.userData.isTexture = false;
                child.userData.ldraw = child.parent.userData.fileName || partName;
                child.userData.ldr_line = false;

                transformControls.attach(child);
                selectedObject = child;
            }

            if (child.material && child.material.map && child.isMesh && !child.isLineSegments) {
                child.userData.isBlock = true;
                child.userData.isTexture = true;
                child.userData.ldraw = child.parent.userData.fileName || partName;
                child.userData.ldr_line = false;
				
				// main color uuid, for minifig textures
				if (Array.isArray(child.material)) {
					child.material.forEach((mat) => {
                        let originalMap = mat.map;
						if(mat.name.includes("Main_Colour")) {
                            var index = child.material.map(function (mmap) { return mmap.uuid; }).indexOf(mat.uuid);

                            child.material[index] = mat.clone();
                            child.material[index].needsUpdate = true;

							mat.name = child.material[index].name + '_' + makeid(5);

							child.userData.main_mat_uuid = mat.uuid;
                            child.userData.main_mat_name = mat.name;
							child.userData.main_mat_index = index;

                            if(partColor) {
                                if(Array.isArray(partColor)) {
                                    let match = partColor.find(m => m.id === index);

                                    if(match?.color) {
                                        child.material[index].color = new THREE.Color("#" + match.color);
                                    } else {
                                        child.material[index].color = new THREE.Color("#ffffff");
                                    }
                                } else {
                                    child.material[index].color = new THREE.Color(partColor || "#ffffff");
                                }
                            }
						} else {
                            var index = child.material.map(function (mmap) { return mmap.uuid; }).indexOf(mat.uuid);
                            child.material[index] = mat.clone();
                            child.material[index].needsUpdate = true;
                            child.material[index].name = child.material[index].name + '_' + makeid(5);
                        }
					});
				}
            }
			
			const textureLoader = new THREE.TextureLoader();

            if(child.material && child.isMesh && !child.material.map && !child.isLineSegments && texture && !Array.isArray(child.material)) {
				textureLoader.load(texture, (texturemap) => {
					texturemap.colorSpace = THREE.SRGBColorSpace;
                    texturemap.wrapS = THREE.RepeatWrapping;
                    texturemap.wrapT = THREE.RepeatWrapping;
                    texturemap.needsUpdate = true;

                    const decalMat = new THREE.MeshStandardMaterial({ 
                        map: texturemap,
                        transparent: true,
                        alphaTest: 0.5,
                        side: THREE.FrontSide 
                    });

                    child.material = decalMat;
					child.material.color = new THREE.Color("#ffffff");
					child.material.needsUpdate = true;
					child.userData.main_mat_index = child.material[1];
								
					function toDataURL(url, callback) {
					  var xhr = new XMLHttpRequest();
					  xhr.onload = function() {
						var reader = new FileReader();
						reader.onloadend = function() {
						  callback(reader.result);
						}
						reader.readAsDataURL(xhr.response);
					  };
					  xhr.open('GET', url);
					  xhr.responseType = 'blob';
					  xhr.send();
					}

					toDataURL(texture, function(dataUrl) {
					  child.userData.textureData = dataUrl;
					});
				}, undefined, (err) => {
					console.warn("Texture load failed or doesn't exist: " + err);
				});
			}

            child.userData.parentName = partName;
            child.userData.id = child.uuid;
            child.userData.original_mat = child.material;

            if (child.material && child.isMesh && !child.isLineSegments) {
                const edges = new THREE.EdgesGeometry(child.geometry);
                const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));
                line.userData.ldr_line = true;
                child.add(line);

                if (display_lines != true) {
                    line.visible = false;
                }
            }
        });

        blockGroup.add(loadedGroup);

        if (partMatrixW instanceof THREE.Matrix4) {
            blockGroup.matrixAutoUpdate = true;
            partMatrixW.decompose(blockGroup.position, blockGroup.quaternion, blockGroup.scale);
            blockGroup.updateMatrix();
            blockGroup.updateMatrixWorld(true);
        } else {
            blockGroup.position.y = objectSize(blockGroup).y;
            blockGroup.rotation.x = Math.PI;
        }

        blockGroup.userData.partName = partName;
        multiSelectedObject = new Set();
        scene.add(blockGroup);

        blocks.push(blockGroup);
        blockGroups.push(blockGroup);
        blockGroup.sceneCount = blocks.length;

        if(show_import_animation === true) {
            tooltip(`Added part ${part.replace("parts/", "")}`);
        }

        updateBLItems();
        updatecolorelement();
        updateSceneData();
        statehistory.saveState();

        if(partSpan && partSpan !== null && partSpan !== undefined) {
            partSpan.querySelector('img').setAttribute("src", originalPSImg);
        }

        if(typeof throwSuccess === "function") {
            throwSuccess();
        }
    }, undefined, function (error) {
        console.error(error);
		tooltip('Could not add this part to this scene');

		if(partSpan && partSpan !== null && partSpan !== undefined) {
			partSpan.querySelector('img').setAttribute("src", originalPSImg);
		}
		
        if(typeof throwError === "function") {
            throwError(error);
        }
    });
}

function createCustomMaterial(partColor, colormap) {
  const normalizedHex = String(partColor).toUpperCase().trim();
  
  const materialType = colormap.get(normalizedHex) || 'solid';

  const params = {
    color: new THREE.Color(normalizedHex),
    reflectivity: 0.5,
    roughness: 0.15,
    metalness: 0.0,
    clearcoat: 0.4,
    envMapIntensity: 0.5,
    clearcoatRoughness: 0.1
  };

  switch (materialType) {
    case 'transparent':
      params.transparent = true;
      params.opacity = 0.6;
      params.roughness = 0.02;
      params.transmission = 0.75;
      params.ior = 1.55;
      break;

    case 'chrome':
      params.roughness = 0.0;
      params.metalness = 1.0;
      params.clearcoat = 0.0;
      break;

    case 'metallic':
      params.roughness = 0.25;
      params.metalness = 0.75;
      params.clearcoatRoughness = 0.05;
      break;

    case 'speckle':
      params.roughness = 0.5;
      params.clearcoat = 0.2;
      break;

    case 'special':
    case 'solid':
    default:
      break;
  }

  return new THREE.MeshPhysicalMaterial(params);
}

function spanImg(original_img, span) {
    if(partSpan && partSpan !== null && partSpan !== undefined) {
        partSpan.querySelector('img').setAttribute("src", originalPSImg);
    }
    console.log(partSpan);
}

function getBLItems() {
    const items = [];
    scene.traverse(obj => {
        if (obj?.isMesh || obj?.userData?.isBlock || obj?.userData?.ldraw) {
            if (obj?.userData?.fileName || obj?.parent?.userData?.fileName) {
                items.push(obj);
            }
        }
    });
    return items;
}

function updateBLItems() {
    const items = getBLItems();
    const blockList = document.getElementById('block-list');
    blockList.innerHTML = "";

    items.forEach(obj => {
        const item = renderBLItem(obj, 0);
        blockList.appendChild(item);
    });
}

function renderBLItem(obj, level = 0) {
    const id = obj.uuid;
    let colormap = new Map(ldrawColors.map(c => [c.hex.toUpperCase(), c.name]));
    let colorhex = '#' + obj.material?.color?.getHexString?.() || '#ffffff';
    let color = colormap.get(String(colorhex).toUpperCase().trim());

    let part;
    if (obj.userData.isBlock && obj.userData.ldraw) {
        part = `${obj?.userData?.ldraw?.split(".")[0] || obj?.parent?.userData?.ldraw?.split(".")[0]}`;
        partIcon = `https://library.ldraw.org/media/ldraw/official/${part}.png`;
    }

    const img = document.createElement('img');
    img.setAttribute('src', partIcon);
    img.setAttribute('loading', 'lazy');
    img.setAttribute('width', '45px');

    const li = document.createElement('li');
    li.classList.add('scene-block-item');
    li.setAttribute('data-id', id);
    li.innerHTML = `${part.replace("parts/", "")} (${color})`;

    if (obj.children && obj.children.length > 0) {
        const ul = document.createElement('ul');

        obj.children.forEach(child => {
            if (child.isMesh || child.isGroup) {
                const childLi = renderBLItem(child, level + 1);
                ul.appendChild(childLi);
            }
        });

        li.appendChild(ul);
    }
    li.appendChild(img);

    return li;
}

function groupParts(objects) {
    const group = new THREE.Group();
    group.name = "ldgroup_" + makeid(8);
    group.userData.isGroup = true;

    scene.add(group);

    if(objects.children.length > 1) {
        objects.forEach(obj => {
            obj.updateMatrixWorld(true);
            group.attach(obj);
        });
    } else {
        object.updateMatrixWorld(true);
        group.attach(object);
    }
    
    return group;
}

function ungroupParts(group) {
    const parent = group.parent;

    while (group.children.length) {
        const child = group.children[0];
        child.updateMatrixWorld(true);
        parent.attach(child);
    }

    parent.remove(group);
}

function objectSize(obj) {
    if (!obj) {
        return new THREE.Vector3(0, 0, 0);
    }

    const b = new THREE.Box3().setFromObject(obj);
    const s = new THREE.Vector3();
    b.getSize(s);

    return s;
}

function partUVGen(geometry) {
    const positions = geometry.attributes.position;
    const uvArray = [];
                
    geometry.computeBoundingBox();
    const min = geometry.boundingBox.min;
    const max = geometry.boundingBox.max;
                
    const scaleX = 1 / (max.x - min.x);
    const scaleY = 1 / (max.y - min.y);

    for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
                    

        const u = (x - min.x) * scaleX;
        const v = (y - min.y) * scaleY;
                    
        uvArray.push(u, v);
    }

    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvArray, 2));
}

function duplicatePart() {
    if (selectedObject) {
        part = `parts/${selectedObject.userData.parentName}`;
        partName = selectedObject.userData.parentName;
        partColor = `#${selectedObject.material.color.getHexString().toLowerCase()}`;

        selectedObject.updateMatrixWorld(true);
        let partMatrixW = selectedObject.matrixWorld.clone();

        addBlockV2(part, partColor, partMatrixW, null, null, part, null, null, null, null);
        statehistory.saveState();
    }
}

document.getElementById("part-library-filter").addEventListener("change", function () {
    let new_ldraw_path = this.value;
    ldraw_loader.setPath(new_ldraw_path);
    ldraw_loader.setPartsLibraryPath(new_ldraw_path);
});

function generateSceneJSON() {
    const scenedata_name = document.querySelector("#save-popup input[name='name']").value.trim();
    const scenedata_desc = document.querySelector("#save-popup textarea[name='desc']").value.trim();

    let sceneData = {
        metadata: {
            generator: 'Gr8brik',
            file_version: '1.2.1.3',
            name: scenedata_name || "Unnamed project",
            description: scenedata_desc || ""
        },
        camera: camera.position,
        blocks: []
    };

    blockGroups.forEach(function (group) {
        if (!group) {
            return;
        }

        const meshes = [];

        group.traverse(function (child) {
            if (child.isMesh && child.userData.isBlock) {
                meshes.push(child);
            }
        });

        meshes.forEach(mesh_child => {
            const pos = new THREE.Vector3();
            const rot = new THREE.Quaternion();
            const scale = new THREE.Vector3();
            const euler = new THREE.Euler();

            mesh_child.updateMatrixWorld(true);
            mesh_child.getWorldPosition(pos);
            mesh_child.getWorldQuaternion(rot);
            mesh_child.getWorldScale(scale);
            euler.setFromQuaternion(rot);

            const materials = [];
			let mesh_opacity;
			let mesh_texture;
			let mesh_texturedata;

            //handles ldrawloader materials better than older function
            if (Array.isArray(mesh_child.material)) {
                let LAYER_INDEX = 0;

                mesh_color = mesh_child.material[1].color.getHexString().toLowerCase();
				
				if(mesh_child.material[1].transparent) {
					mesh_opacity = mesh_child[1].material.opacity;
				}
				
				if(mesh_child.material[1].map) {
					mesh_texture = mesh_child.material[1].map;
					mesh_texturedata = mesh_child.userData.textureData;
				}
                                
                mesh_child.material.forEach(mat => {
                    const materialData = {
                        id: LAYER_INDEX,
                        name: mat.name,
                        obj: mesh_child.userData.id || mesh_child.uuid,
                        color: mat.color.getHexString().toLowerCase(),
                        texture: mat.map || null,
                        texturedata: mesh_child.userData.textureData || null,
                        opacity: mat.opacity || "1.0",
                    }
                    materials.push(materialData);
                    LAYER_INDEX += 1;
                });
            } else {
                mesh_color = mesh_child.material.color.getHexString().toLowerCase();
				
				if(mesh_child.material.transparent) {
					mesh_opacity = mesh_child.material.opacity;
				}
				
				if(mesh_child.material.map) {
					mesh_texture = mesh_child.material.map;
					mesh_texturedata = mesh_child.userData.textureData;
				}

                const materialData = {
                    id: mesh_child.userData.id || mesh_child.uuid,
                    name: mesh_child.material.name,
                    color: mesh_color,
                    texture: mesh_texture || null,
                    texturedata: mesh_texturedata || null,
                    opacity: mesh_opacity || "1.0",
                }
                materials.push(materialData);
            }

            const blockData = {
                color: mesh_color,
                //legacy position and rotation
                //for compatablity for old format
                position: {
                    x: pos.x,
                    y: pos.y,
                    z: pos.z
                },
                rotation: {
                    x: euler.x,
                    y: euler.y,
                    z: euler.z
                },
                scale: {
                    x: scale.x,
                    y: scale.y,
                    z: scale.z
                },
                matrixw: mesh_child.matrixWorld.clone(),
                id: mesh_child.userData.id || mesh_child.uuid,
                ldraw: mesh_child.userData.ldraw.replace("parts/", ""),
                name: mesh_child.userData.name,
                materials,
				texture: mesh_texture || null,
				texturedata: mesh_texturedata || null,
				opacity: mesh_opacity || "1.0",
            };

            sceneData.blocks.push(blockData);
        });
    });

    return JSON.stringify(sceneData);
}

function generateSceneLXFML() {
    let sceneBricks = '';
    let boneRefs = [];
    let refID = 0;
    let totalPosition = new THREE.Vector3();
    let count = 0;

    if (selectedObject) {
        transformControls.detach(selectedObject);
        selectedObject = null;
    }

    const lego_color_map = {
        "C91A09": 21, // Bright Red
        "F8CC00": 24, // Bright Yellow
        "0020A0": 23, // Bright Blue
        "005700": 28, // Dark Green
        "FE8A18": 25, // Bright Orange
        "D941BB": 221, // Bright Violet

        "000000": 26, // Black
        "FFFFFF": 1, // White
        "747371": 199, // Dark Bluish Grey
        "A3A2A4": 208, // Light Bluish Grey
        "958A73": 2, // Brick Yellow
        "6C5C4D": 86, // Dark Brown

        "812A00": 120, // Reddish Brown
        "5883C1": 102, // Medium Blue
        "4B974B": 151, // Sand Green
        "A52A2A": 59, // Dark Red
        "B36D2C": 106, // Dark Orange
        "FCB7BC": 104, // Bright Pink

        "60C0E0": 107, // Bright Light Blue
        "FBE696": 103, // Light Yellow
        "84B68D": 37, // Bright Green
        "92B28B": 34, // Bright Yellowish Green
        "002A5A": 140, // Dark Blue
        "DDDD22": 334, // Vibrant Yellow (sometimes 24 is used)
    };

    blockGroups.forEach(function (group) {
        group.traverse(function (child) {
            if (child.isMesh) {
                totalPosition.add(group.position);
                count++;
            }
        });
    });

    blockGroups.forEach(function (group) {
        let mesh_child = null;
        group.traverse(function (child) {
            if (child.isMesh) {
                mesh_child = child;
            }
        });

        if (mesh_child) {
            let ldraw = group.ldraw.replace("parts/", "").replace(".dat", "");
            const boneID = refID;
            let colorID = 21;

            if (!mesh_child.material.map && !mesh_child.isLineSegments) {
                const hex = mesh_child.material.color.getHexString().toUpperCase();
                colorID = lego_color_map[hex] ?? 26;
            }

            let adjustedMatrix = mesh_child.matrixWorld.clone();

            const globalrot = new THREE.Matrix4().makeRotationX(Math.PI / 1);
            adjustedMatrix.premultiply(globalrot);

            const flipmatrix = new THREE.Matrix4().makeRotationX(Math.PI);
            adjustedMatrix.multiply(flipmatrix);

            const translationMatrix = new THREE.Matrix4().makeTranslation(-20, 0, 0); // 1 LDU
            adjustedMatrix.multiply(translationMatrix);

            sceneBricks += `
                <Brick refID="${refID}" designID="${ldraw}" itemNos="${ldraw}">
                <Part refID="${refID}" designID="${ldraw}" materials="${colorID},0" decoration="0">
                    <Bone refID="${refID}" transformation="${LXFMLMatrix(adjustedMatrix)}"></Bone>
                </Part>
                </Brick>`;

            boneRefs.push(boneID);
            refID++;
        }
    });

    const boneRefString = boneRefs.join(',');

    const sceneData = `
            <?xml version="1.0" encoding="UTF-8" standalone="no" ?>
            <LXFML versionMajor="5" versionMinor="0" name="Imported GR8BRIK Creation">
            <Meta>
                <Application name="LEGO Digital Designer" versionMajor="4" versionMinor="3"/>
                <Brand name="LDD"/>
                <BrickSet version="2670"/>
            </Meta>
            <Model name="Imported GR8BRIK Creation"></Model>
            <Cameras>
                <Camera refID="0" fieldOfView="80" distance="120" transformation="1,0,0,0,1,0,0,0,1,0,0,120"/>
            </Cameras>
            <Bricks cameraRef="0">
                ${sceneBricks}
            </Bricks>
            <RigidSystems>
                <RigidSystem>
                <Rigid refID="0" transformation="1,0,0,0,1,0,0,0,1,0,0,0" boneRefs="${boneRefString}"/>
                </RigidSystem>
            </RigidSystems>
            <GroupSystems>
                <GroupSystem></GroupSystem>
            </GroupSystems>
            <BuildingInstructions></BuildingInstructions>
            </LXFML>
        `;

    return sceneData.replace(/\s+/g, ' ').trim();
}

function LXFMLMatrix(matrix4) {
    const unit = 0.04;
    const converted = matrix4.clone();

    const rotx = new THREE.Matrix4().makeRotationX(Math.PI / 1);

    const rot = new THREE.Matrix4();
    rot.multiply(rotx);
    converted.premultiply(rot);

    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    converted.decompose(position, quaternion, scale);

    position.multiplyScalar(unit);
    position.x -= 0.8;

    converted.compose(position, quaternion, scale);
    const elm = converted.transpose().elements;

    return [
        elm[0], elm[4], elm[8],
        elm[1], elm[5], elm[9],
        elm[2], elm[6], elm[10],
        elm[3], elm[7], elm[11]
    ].map(v => v.toFixed(10)).join(',');
}

function updateSceneData() {
    if (blockGroups && blockGroups.length > 0) {
        blockGroups.forEach(function (g) {
            g.updateMatrixWorld(true);
            let hasTinyMesh = false;

            g.traverse(function (child) {
                child.updateMatrixWorld(true);

                let boundingBox = new THREE.Box3().setFromObject(child);
                let size = new THREE.Vector3();
                boundingBox.getSize(size);

                if(child.isMesh) {
                    if (size.x < child.scale || size.y < child.scale || size.z < child.scale) {
                        hasTinyMesh = true;
                    }
                }
            });

            g.userData.noSnap = hasTinyMesh;
        });
        scene.updateMatrixWorld(true);
    }

    if (selectedObject) {
        selectedObject.updateMatrixWorld(true);

        if (scene.children.length != 0) {
            autosave();
        }
    }
}

function autosave() {
    const jsonData = generateSceneJSON();
    const date = new Date();
    date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
    document.cookie = "localsave=" + JSON.stringify(JSON.parse(jsonData)) + "; expires=" + date.toUTCString();
}

function read_autosave() {
    const saved = getCookie("localsave");

    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            loadSceneFromJSON(parsed);
            camera.position.x = parsed.camera.x;
            camera.position.y = parsed.camera.y;
            camera.position.z = parsed.camera.z;
            console.log(parsed.camera);
        } catch (e) {
            console.warn("failed to load autosave " + e);
        }
    }
}

function clear_autosave() {
    const saved = getCookie("localsave");

    if (saved) {
        try {
            let parsed = JSON.parse(saved);
            parsed.blocks = null;
            parsed.camera = null;
            const date = new Date();
            date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
            document.cookie = "localsave=" + JSON.stringify(parsed) + "; expires=" + date.toUTCString();

            tooltip('Cleared autosave');
        } catch (e) {
            console.warn("failed to load autosave " + e);
        }
    }
}

const geometry_cache = new Map();
// does what it says
function clone_mesh_clean(obj) {
    if (!obj.isMesh || !obj.geometry) {
        return null;
    }

    if (!obj.userData.isBlock || !obj.userData.ldraw) {
        return null;
    }

    let mat;
    if (obj.material) {
        if (Array.isArray(obj.material)) {
            mat_og = obj.material;
			mat = mat_og.map(m => m.clone());
        } else {
            mat = obj.material.clone();
        }
    } else {
        mat = new THREE.MeshLambertMaterial();
    }

    let original_mat = mat;

    if(!original_mat) {
        return new Error('Invalid material for object ' + obj.name);
    }

    let ldraw = obj.userData.ldraw; 
    let geometry;

    if (geometry_cache.has(ldraw)) {
        geometry = geometry_cache.get(ldraw);
    } else {
        geometry = obj.geometry.clone();
        geometry.name = `ldraw_${ldraw}`;
        geometry_cache.set(ldraw, geometry);
    }

    const obj_clone = new THREE.Mesh(geometry, mat);

    obj.updateMatrixWorld(true);
    obj.getWorldPosition(obj_clone.position);
    obj.getWorldQuaternion(obj_clone.quaternion);
    obj.getWorldScale(obj_clone.scale);

    obj_clone.name = obj.name || 'clone ' + makeid(5);

    return obj_clone;
}

function filter_objects_peices() {
    let thumb = new THREE.Scene();

    scene.traverse(function (object) {
        if (object.isMesh && object.userData.isBlock || object.userData.isTexture) {
            let hexColor;

            if(!Array.isArray(object.material)) {
			    hexColor = object.material?.color || new THREE.Color(0xffffff);
            } else {
                hexColor = object.material[0].color;
            }

            let cloned = clone_mesh_clean(object);
            if (cloned) {
                if (cloned.material && cloned.material.color && selectedExport === "dae") {
                    apply_vertex_from_hex(cloned, hexColor);
                    cloned.material.vertexColors = true;
                } else if (cloned.material && Array.isArray(cloned.material)) {
                    cloned.material.forEach(mat => {
                        if (mat?.color) {
                            mat.color = mat.color.getHexString();
                        }
                    });
                } else {
                    cloned.material = new THREE.MeshLambertMaterial({color: hexColor});
                }
                thumb.add(cloned);
                cloned.rotation.setFromQuaternion(cloned.quaternion);
            }
        }
    });
    return thumb;
}

function apply_vertex_from_hex(mesh, hex) {
    const geometry = mesh.geometry;
    const color = new THREE.Color(hex);

    const count = geometry.attributes.position.count;
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        colors[i * 3 + 0] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    if (Array.isArray(mesh.material)) {
        mesh.material.forEach(mat => mat.vertexColors = true);
    } else {
        mesh.material.vertexColors = true;
    }
}

window.addEventListener('pointerdown', function (event) {
    let target = event.target;
    let container = document.querySelector(".scene");
    const rect = container.getBoundingClientRect();

    if (!container.contains(target)) {
        return;
    }

    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const targets = [];

    scene.traverse((obj) => {
        if (obj.visible && obj.userData?.isBlock && !obj?.isTransformControls) {
            targets.push(obj);
        }
    });

    let intersects = raycaster.intersectObjects(targets, false);

    transformControls.addEventListener('dragging-changed', (event) => {
        return;
    });

    if (intersects.length > 0) {
        //selectObject(intersects[0].object);

        if (intersects.length > 0) {
            const obj = intersects[0].object;

            if (event.shiftKey) {
                selectObject(obj, "add");
            } else if (event.ctrlKey) {
                selectObject(obj, "toggle");
            } else {
                selectObject(obj, "replace");
            }
        } else {
            selected.clear();
            updateSelection();
        }

    } else {
        deselect(selectedObject);
    }
});

/*function selectObject(obj) {
    while (obj.parent && !obj.userData.isBlock) {
        obj = obj.parent;
    }

    if (obj === selectedObject) {
        return;
    }

    transformControls.detach(selectedObject);
    selectedObject = null;

    transformControls.attach(obj);
    selectedObject = obj;

    highlight(object);

    partColor = `#${obj?.material?.color?.getHexString()}` || `#${obj?.material[1]?.color?.getHexString()}` || '#ffffff';
    //$("#color-picker").spectrum("set", partColor);
	document.getElementById('color-picker').setAttribute('color', partColor);
	document.getElementById('color-picker').setAttribute('value', partColor);
	document.getElementById('color-picker').style.backgroundColor = partColor;
}*/

function selectObject(obj, mode = "replace") {
    while (obj.parent && !obj.userData.isBlock && !obj.userData.ldraw) {
        obj = obj.parent;
    }

    if (!obj.userData.isBlock && !obj.userData.ldraw) {
        return;
    }

    if (!multiSelectedObject) {
        return;
    }

    if (mode === "replace") {
        multiSelectedObject.clear();
    }

    if (mode === "toggle") {
        if (multiSelectedObject.has(obj)) {
            multiSelectedObject.delete(obj);
        } else {
            multiSelectedObject.add(obj);
        }
    } else {
        multiSelectedObject.add(obj);
    }

    updateSelection();
}

function updateSelection() {
    if (!multiSelectedObject) {
        return;
    }

    scene.traverse(o => {
        if (o.userData?.isBlock) {
            unhighlight(o);
        }
    });

    multiSelectedObject.forEach(o => highlight(o));

    activeObject = multiSelectedObject.size
        ? [...multiSelectedObject][multiSelectedObject.size - 1]
        : null;

    if (activeObject) {
        transformControls.attach(activeObject);
        selectedObject = activeObject;
    } else {
        transformControls.detach();
        selectedObject = null;
    }
}

function clearSelection() {
    if (!multiSelectedObject) {
        return;
    }

    multiSelectedObject.forEach(obj => unhighlight(obj));
    multiSelectedObject.clear();

    selectedObject = null;

    if (selectionGroup) {
        while (selectionGroup.children.length) {
            const obj = selectionGroup.children[0];
            scene.attach(obj);
        }
        scene.remove(selectionGroup);
        selectionGroup = null;
    }

    transformControls.detach();
}

// wip
function highlight(obj) {
    const mat = obj?.material;

    if (mat && mat?.emissive) {
        mat.emissive = mat.emissive || new THREE.Color();

        mat.userData = mat.userData || {};
        mat.userData.isHighlighted = true;

        mat.emissive.set(0x333333);
    }
}

function unhighlight(obj) {
    const mat = obj?.material;

    if (mat && mat?.emissive) {
        mat.userData = mat.userData || {};
        mat.userData.isHighlighted = false;

        mat.emissive.set(0x000000);
    }
}

function deselect(obj) {
    if(multiSelectedObject && multiSelectedObject.has(obj)) {
        multiSelectedObject.forEach(obj => unhighlight(obj));
        multiSelectedObject.clear();
        multiSelectedObject = new Set();
    }

    if(selectObject) {
        transformControls.detach(obj);
        selectedObject = null;
    }
}

function onWindowResize() {
    if(scene.userData.flatcamera) {
        camera.left = window.innerWidth / -2;
        camera.right = window.innerWidth / 2;
        camera.top = window.innerHeight / 2;
        camera.bottom = window.innerHeight / -2;
        camera.zoom = 2;
    } else {
        camera.aspect = window.innerWidth / window.innerHeight;
    }
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function moveBlock(mode) {
    if (mode === "t") {
        transformControls.setMode('translate');
        tooltip('Changed to drag parts');
    }

    if (mode === "r") {
        transformControls.setMode('rotate');
        tooltip('Changed to rotate parts');
    }

    if (mode === "s") {
        transformControls.setMode('scale');
        tooltip('Changed to the secret scale parts');
    }
}

document.getElementById("undo-action").addEventListener("click", function () {
    statehistory.undo();
});

document.getElementById("redo-action").addEventListener("click", function () {
    statehistory.redo();
});

document.getElementById("resetCamera").addEventListener("click", function () {
    controls.reset();
    updateSceneData();
});

function animate() {
    stats.update();

    document.querySelector('.stats-contain').appendChild(stats.domElement);

    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
}

async function initRenderer() {
    await renderer.init();
    animate();
}

function tooltip(text) {
    const tooltip = document.createElement('div');

    tooltip.textContent = text;
    tooltip.setAttribute('id', 'tooltip');
    document.body.appendChild(tooltip);

    if (tooltip) {
        setTimeout(() => {
            tooltip.remove();
        }, 5500);
    }
}

function tooltipAlert(title, text, additionalText, buttonText) {
    const tooltip = document.createElement('div');
    const tooltipTitle = document.createElement('h4');
    const tooltipText = document.createElement('p');
    const tooltipTextAdditional = document.createElement('p');
    const tooltipExit = document.createElement('button');

    tooltipTitle.textContent = title;
    tooltipText.textContent = text;
    tooltipTextAdditional.textContent = additionalText;
    tooltipExit.textContent = buttonText;

    tooltipTitle.setAttribute('class', 'title');
    tooltipExit.setAttribute('class', 'btn');

    tooltip.appendChild(tooltipTitle);
    tooltip.appendChild(tooltipText);
    tooltip.appendChild(tooltipTextAdditional);
    tooltip.appendChild(tooltipExit);

    tooltip.setAttribute('id', 'tooltipAlert');
    tooltip.setAttribute('class', 'trans');
    document.body.appendChild(tooltip);

    if (tooltip && tooltipExit) {
        tooltipExit.addEventListener('click', function() {
            tooltip.remove();
        }, false);
    }
}

window.onload = function () {
    setTimeout(() => {
        if (document.getElementById("preloaded-logo")) {
            document.getElementById("preloaded-logo").style.display = "none";
        }
    }, 500);
}
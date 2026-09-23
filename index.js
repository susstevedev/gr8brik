/* The mess that runs the entire modeler */

// Used for debugging sometimes
//'use strict';

window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    e.returnValue = '';
});

window.version = '2026.09b';
window.CURRENT_APP = 'modeler';
console.info('Gr8brik ' + window.version);

// new imports
import * as THREE_NS from 'three';

import { WebGPURenderer } from 'three/webgpu'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { LDrawLoader } from 'three/addons/loaders/LDrawLoader.js';
import { LDrawConditionalLineMaterial } from 'three/addons/materials/LDrawConditionalLineMaterial.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';
import { DecalGeometry } from 'three/addons/geometries/DecalGeometry.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import Stats from 'three/addons/libs/stats.module.js';

let THREE = { ...THREE_NS };
THREE.OrbitControls = OrbitControls;
THREE.TransformControls = TransformControls;
THREE.LDrawLoader = LDrawLoader;
THREE.GLTFExporter = GLTFExporter;
THREE.HDRLoader = HDRLoader;
THREE.RGBELoader = HDRLoader;
THREE.OBJExporter = OBJExporter;

window.debug = false; // debug mode

// globals
let container = null, stats = null, animationFrameId = null, camera = null, scene = null, renderer = null, controls = null, transformControls = null, grid_helper = null, directional_lighting = null, ambient_lighting = null, ldraw_loader = null, loading_manager = null, mouse = null, raycaster = null, mesh_color = null, partName = null, partMat = null, partIcon = null, part = null, partMatrixWorld = null, partTexture = null, partOpacity = null, activeObject = null, partRotation = null, partPosition = null, selectedObject = null, multiSelectedObject = null, selectionGroup = null, customPosition = null, selectedMap = null, selectedExport = null;
//let partColor = '#C91A09';
let start_url = 'https://gr8brik.rf.gd', gh_base_url = 'https://susstevedev.github.io/gr8brik/', DEFAULT_TITLE = 'Modeler - Gr8brik', show_import_animation = true;
const studSize = 1000, ldraw_path = "https://cdn.jsdelivr.net/gh/susstevedev/gr8brik-ldraw-fork@main/ldraw-parts/", ldraw_icon_path = "https://cdn.jsdelivr.net/gh/susstevedev/gr8brik-ldraw-fork@main/ldraw-icons/";

let blockGroups = [];

// debug only
start_url = 'http://localhost:3000';

function mergeConfig(settings, defaults) {
    settings ??= {};

    for (const [key, value] of Object.entries(defaults)) {
        if (!(key in settings)) {
            settings[key] = value;
        }
    }
}

// user login function
window.loggedin = false;
function login() {
    fetch(start_url + "/ajax/user.php?ajax=true", {
        credentials: 'include',
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
                console.error(res.error);
                ui_login_v2(res);
            } catch {
                console.error("An error occured while authenticating: " + err);
                ui_login_v2(null);
            }
        });
}
login();

function getWarnStatus() {
    fetch(start_url + "/ajax/user.php?get_warn_status=true", {
        credentials: 'include',
    })
        .then(res => res.json())
        .then(response => {
            if (response.status == "yes" && response.success == true) {
                tooltipAlert(response.text, response.reason, response.additional, response.button);

                // rerun login function to update user information (logging user out if they get banned)
                login();
            } else if (response.success == false) {
                console.error("An error occured while authenticating: " + response.error);
            }
        })
        .catch(async (err) => {
            try {
                const res = await err.response.json();
                console.error("An error occured while authenticating: " + res.error);
            } catch {
                console.error("An error occured while authenticating: " + err);
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

    if (response && !response.error && response.success) {
        document.querySelector('#settings-account-loggedout').style.display = 'none';

        if (response.user) {
            document.querySelector('#settings-account-auth-username').textContent = response.user;
            document.querySelector('#settings-account-auth-username').style.display = 'block';
        }

        if (response.pfp) {
            document.querySelector('#settings-account-auth-pfp').src = response.pfp;
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

function loadCategory() {
    let filter_elm = document.getElementById('part-type-filter');

    fetch(`${gh_base_url}part_lists/index.json`)
        .then(res => res.json())
        .then(data => {
            data.categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.file;
                option.textContent = cat.name;

                if (cat.file === 'brick.json') {
                    option.selected = true;
                    loadParts('brick.json');
                }

                filter_elm.appendChild(option);
            });

            const custom_option = document.createElement('option');
            custom_option.value = 'custom';
            custom_option.textContent = 'User custom parts';

            filter_elm.appendChild(custom_option);
        })
        .catch(err => {
            console.error('error loading categories ', err);
            tooltip('Failed to load categories');
        });
}
loadCategory();

// load parts from url
function loadParts(type) {
    console.log(`loading ${type} category`);
    current_type = type;
    let fetch_str;
    let custom = false;

    if (cached_parts[type]) {
        console.log(`${type} parts loaded from cache`);
        displayed_parts = cached_parts[type];
        displayParts(displayed_parts, true);
        return;
    }

    if (type !== "custom") {
        fetch_str = fetch(gh_base_url + "part_lists/" + type)
    } else {
        fetch_str = fetch(start_url + "/ajax/custompartsv2", { method: "POST", credentials: 'include', headers: { "Content-Type": "application/json" }, body: JSON.stringify({all: true}) })
        custom = true;
    }

    fetch_str
        .then(res => res.json())
        .then(data => {
            displayed_parts = data;
            cached_parts[type] = data;
            displayParts(displayed_parts, true, custom);
        })
        .catch(err => {
            console.error(err);
        });
}

// display parts function
function displayParts(displayed_parts, new_category, custom = false) {
    let select_block_contain = document.getElementById("select-block");
    let cutespinny = document.getElementById('cutespinny');
    let MAX_LOAD_AMOUNT = 50;
    let currentIndex = 0;
    let observer = null;
    let sentinel = null;
    let isRendering = false;

    if(displayed_parts.error && displayed_parts.code) {
        console.error('error fetching custom parts ' + displayed_parts.code);
        let error = "Something went wrong.";

        if(displayed_parts.code == "LOGGED_OUT") {
            error = "Please login to view and add custom parts to the scene.";
        }

        if(displayed_parts.code == "INV_LOGIN") {
            error = "Invalid login.";
        }

        if(displayed_parts.code == "USR_NOT_VERIFY") {
            error = "Please verify your account to view and add custom parts to the scene.";
        }

        if(displayed_parts.code == "NO_PARTS") {
            error = "No parts found in query.";
        }

        tooltip(error);
        return;
    }

    if(!custom) {
        displayed_parts = displayed_parts.sort((a, b) => a.name.length - b.name.length);
    }

    function prepareParts() {
        let oldSentinel = document.getElementById('scroll-sentinel');
        if (oldSentinel) {
            oldSentinel.remove();
        };

        sentinel = document.createElement('div');
        sentinel.id = 'scroll-sentinel';
        sentinel.style.height = '1px';
        select_block_contain.appendChild(sentinel);

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

        cutespinny.style.display = 'block';

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

            let icon_path;
            let part_file_name;
            let part_file;

            if(custom) {
                icon_path = part.texture;
                part_file_name = part.reference;
                part_file = part.part;
                span.setAttribute("texture", part.texture);
                span.setAttribute("textureID", part.id);
            } else {
                icon_path = `${ldraw_icon_path + part.file.split(".")[0]}.png`;
                part_file_name = part.file.split(".")[0];
                part_file = part.file;
            }

            span.id = part_file;
            span.title = part.name;
            span.classList.add('ui-tooltip');
            span.setAttribute("value", part_file);
            span.innerHTML = `
                <img src="${icon_path}" loading="lazy" />
                <br />
                <small class="part-list-number">${part_file_name}</small>
                <small class="ui-tooltip-text">${part.name}</small>
            `;

            select_block_contain.insertBefore(span, sentinel);
        }

        currentIndex = loadLimit;

        if (currentIndex >= displayed_parts.length) {
            observer.disconnect();
        }

        cutespinny.style.display = 'none';
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

// NEWER search function
// Overall it's better and cleaner
// Will have bugs please report them if you can
function searchParts() {
    let searchbox = document.getElementById("search-parts");
    let value = searchbox.value.toLowerCase().replace(/\s+/g, " ").trim();
    let items = displayed_parts;
    let matchedItems = [];
    let queryTokens = value.toLowerCase().trim().split(/\s+/).filter(Boolean);

    console.log(items);

    for (let i = 0; i < items.length; i++) {
        let item = items[i];

        let title_txt = (item.name || "").toLowerCase();
        let num = (item.file || "").toLowerCase();
        let match = queryTokens.every(token => title_txt.includes(token) || num.includes(token));

        if (match) {
            matchedItems.push(item);
        }
    }

    console.log(matchedItems);
    displayParts(matchedItems, true);
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

    let ldrawHexMap = new Map(ldrawColors.map(c => [String(c.code), c.hex]));

    let partJson = {
        "id": partName,
        "ldraw": partName,
        "texturedata": span.getAttribute("texture"),
        "textureID": span.getAttribute("textureID"),
        'materials': [
            {
                'id': partName,
                'color': ldrawHexMap.get(partColor),
                'colorcode': partColor,
                "texturedata": span.getAttribute("texture"),
                "textureID": span.getAttribute("textureID"),
                "opacity": 1,
            },
        ],
        'matrixw': {},
    };

    let pmanager = new PartManager();
    pmanager.addPart(partJson, span, original_img, null, null);
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
    if (multiSelectedObject) {
        selector.clearSelection();
    }

    if (selectedObject) {
        transformControls.detach(selectedObject);
        selectedObject = null;
    }

    const sceneJSON = generateSceneJSON();
    if (sceneJSON) {
        autosave();

        if (!window.loggedin) {
            this.disabled = true;
            this.classList.add('btn-disabled');
            tooltip('Login to save creation to server');
            return;
        }

        let params = new URLSearchParams(window.location.search);
        let build_id = params.get("build_id");

        const name = document.querySelector("#save-popup input[name='name']").value.trim();
        const desc = document.querySelector("#save-popup textarea[name='desc']").value.trim();
        const visible = document.querySelector('input[name="visible"]:checked');
        const can_edit = document.querySelector('input[name="can_edit"]').checked;
        const screenshot = capture();

        this.innerHTML = `<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>`;

        fetch(start_url + "/ajax/build.php", {
            method: "POST",
            credentials: 'include',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                save_build_v2: true,
                build_id: build_id,
                creation: sceneJSON,
                name,
                desc,
                screenshot,
                visibility: visible.value,
                can_edit: can_edit,
            })
        })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    //tooltip(response.success);
                    this.innerText = "Save Creation as a copy";
                    params.set("build_id", response.creation.id);
                    window.history.pushState(null, '', window.location.pathname + '?' + params.toString());

                    //save model success
                    document.querySelector("#just-have-saved-popup form").reset();
                    document.querySelector("#save-popup").style.display = "none";
                    document.querySelector("#just-have-saved-popup").style.display = "block";
                    document.querySelector("#just-have-saved-popup #name").innerText = response.creation.name;
                    document.querySelector("#just-have-saved-popup #success-message").innerText = response.success;

                    if(response.creation.visibility !== 'private') {
                        document.querySelector("#just-have-saved-popup #link-share").innerText = start_url + response.creation.url;
                        document.querySelector("#just-have-saved-popup #link-view").href = start_url + response.creation.url;
                    } else {
                        document.querySelector("#just-have-saved-popup #link-share").innerText = "Creation is not public, cannot be shared";
                        document.querySelector("#just-have-saved-popup #link-view").href = window.location.pathname + '?' + params.toString();
                    }

                    document.querySelector("#just-have-saved-popup #link-edit").href = start_url + response.creation.url_edit;
                    document.querySelector("#just-have-saved-popup #link-profile").href = start_url + "/user/" + response.user.id;
                } else if (response.error) {
                    tooltip(response.error);
                    console.error(response.error);
                    this.innerText = "Save Creation";
                }
            })
            .catch(async err => {
                try {
                    const res = await err.response.json();
                    tooltip(res.error);
                    this.innerText = "Save Creation";
                } catch {
                    tooltip("An unknown error occurred.");
                    console.log(err);
                    this.innerText = "Save Creation";
                    this.disabled = true;
                    this.classList.add('btn-disabled');
                }
            });
    } else {
        tooltip('Problem while generating scene');
    }
});

//login
document.getElementById("login-complete").addEventListener("click", function () {
    if (window.loggedin) {
        return;
    }

    const mail = document.querySelector("#login-popup input[name='mail']").value.trim();
    const pwd = document.querySelector("#login-popup input[name='pwd']").value.trim();

    this.innerHTML = `<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>`;

    fetch(start_url + "/ajax/auth.php", {
        credentials: 'include',
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            login: true,
            mail: mail,
            pwd: pwd,
            remember: true
        })
    })
        .then(res => res.json())
        .then(response => {
            this.innerText = "Login";
            if (response.success === true) {
                login();
            } else {
                if (response.error) {
                    console.error(response.error);
                    tooltip(response.error);
                }
            }
        })
        .catch(async err => {
            try {
                const res = await err.response.json();
                tooltip(res.error);
                console.error(res.error);
            } catch {
                tooltip("An unknown error occurred");
            }
            this.innerText = "Login";
        });
});

let params = new URLSearchParams(window.location.search);
let build_id = params.get("build_id");

if (build_id !== undefined && build_id !== null) {
    loadJSONFromCloud(build_id, true);
}

// import modal
document.getElementById("import-finish").addEventListener("click", function () {
    const format = document.getElementById("import-format").value;
    const checkbox = document.querySelector('#import-popup-form [name="open"]');
    let open_creation = false;

    if (checkbox.checked) {
        open_creation = true;
    }

    if (format === "cloud2") {
        let model_id = document.getElementById('import-url').value.split('/').pop();
        loadJSONFromCloud(model_id, open_creation);
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

    if (format === "ldr") {
        document.getElementById("cre-import-ldr").click();
    }
});

// export model
document.getElementById("export-finish").addEventListener("click", function () {
    if (!window.loggedin) {
        alert('Not authenticated');
        return;
    }

    if (multiSelectedObject) {
        selector.clearSelection();
    }

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

    if (format === "glb") {
        const exporter = new THREE.GLTFExporter();
        const date = new Date();

        let scene_ = scene;
        if (scene.userData.export_full_scene === false) {
            scene_ = filter_objects_peices();
        }

        exporter.parse(
            scene_,
            function (result) {
                if (result instanceof ArrayBuffer) {
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
        const exporter = new OBJExporter();
        const date = new Date();
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

document.getElementById("clear-scene").addEventListener("click", function () {
    if (confirm("Are you sure you want to proceed? Doing so will clear your current scene.")) {
        wipe_scene();
    };
});

// Transparency
document.getElementById("trans-block").addEventListener("click", function () {
    if (this.checked) {
        selectedObject.material.transparent = true;
        selectedObject.material.opacity = 0.5;
        selectedObject.material.needsUpdate = true;
        updateSceneData();
    } else if (!this.checked) {
        selectedObject.material.opacity = 1;
        selectedObject.material.transparent = false;
        selectedObject.material.needsUpdate = true;
        updateSceneData();
    }
});

document.getElementById("clear_autosave").addEventListener("click", function () {
    clear_autosave();
});

document.querySelectorAll(".read_autosave").forEach(elm => {
    elm.addEventListener("click", function () {
        read_autosave();
    });
});

document.getElementById("duplicate-part").addEventListener("click", function () {
    if (multiSelectedObject) {
        let obj = duplicatePart();
        scene.add(obj);
        statehistory.saveState();
    }
});

document.getElementById("make-group").addEventListener("click", function () {
    if (multiSelectedObject) {
        groupParts(multiSelectedObject);
    }
});

document.getElementById("selected-map").addEventListener("input", function () {
    console.log(`Selected material number is ${this.value}`);
    selectedMap = this.value;
});

document.getElementById("delete-block").addEventListener("click", function () {
    deleteBlock(getPartByUUID());
});

document.getElementById("takeScreenshot").addEventListener("click", function () {
    let url = capture();
    let date = new Date();
    let a = document.createElement("a");

    a.href = url;
    a.download = `creation-screenshot-${date}.webp`;
    a.click();
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

document.getElementById("cre-export").addEventListener("click", () => {
    const jsonData = generateSceneJSON();
    const jsonBlob = new Blob([jsonData], { type: "application/json" });
    const elm = this;

    const url = URL.createObjectURL(jsonBlob);
    const date = new Date();
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
    const date = new Date();
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

    zip.file("creation.gr8", fileData, {
        compression: "DEFLATE",
        compressionOptions: { level: 9 }
    });

    zip.file("setting.json", setting, {
        compression: "DEFLATE",
        compressionOptions: { level: 9 }
    });

    zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 9 }, comment: "Zipped Gr8Brik.rf.gd creation" }).then(function (blob) {
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
    const legoData = generateSceneLXFML();
    const zip = new JSZip();
    zip.file("IMAGE100.LXFML", legoData);
    const elm = this;

    zip.generateAsync({ type: "blob" }).then(function (blob) {
        const url = URL.createObjectURL(blob);
        const date = new Date();

        const a = document.createElement("a");
        a.href = url;
        a.download = `ldd-creation-${date}.lxf`;
        a.click();

        URL.revokeObjectURL(url);
    });
});

document.getElementById("cre-export-three").addEventListener("click", () => {
    if (!scene) {
        tooltip("Scene is empty");
        return;
    }

    let fileData = JSON.stringify(scene.toJSON());
    let zip = new JSZip();
    let date = new Date();

    zip.file(`scene.json`, fileData, {
        compression: "DEFLATE",
        compressionOptions: { level: 9 }
    });

    zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 9 } }).then(function (blob) {
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
    const date = new Date();
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

function exportSceneToMPD(name) {
    const lines = [];

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

        let color_code = 16;
        if (child.material && !Array.isArray(child.material)) {
            if (child.material?.userData?.colorcode) {
                color_code = child.material.userData.colorcode;
            }
        }

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
    let date = new Date();

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

function loadJSONFromCloud(model, open = true) {
    fetch(start_url + `/ajax/build?buildId=${model}&fetch=true`, {
        credentials: 'include',
    })
        .then(res => res.text())
        .then(data => {
            try {
                data = JSON.parse(data);
            } catch (error) {
                tooltip('Could not parse as JSON');
                console.error(error);
                return;
            }

            if (data === null) {
                tooltip('Empty response');
                return;
            }

            if (data.error) {
                tooltip(data.error + ' ' + data.message);
                return;
            }

            if(data.can_edit != 1) {
                tooltip('You are not allowed to edit this creation. Please contact the creator via direct messages.');
                return;
            }

            if(data.is_removed != 0) {
                tooltip('Creation has been removed by an admin.');
                return;
            }

            let modelData = data.model;
            let modelLegacy = data.legacy;
            tooltip('Importing creation "' + data.name + '"');

            if (modelData) {
                fetch(start_url + `${data.model}`, {
                    credentials: 'include',
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data === null) {
                            tooltip('Empty creation');
                            return;
                        }

                        if (data) {
                            if(open === true) {
                                wipe_scene();
                                params.set("build_id", model);
                                window.history.pushState(null, '', window.location.pathname + '?' + params.toString());
                                if(data.camera) {
                                    if(data.camera.x && data.camera.y && data.camera.z) {
                                        camera.position.x = data.camera.x || 250;
                                        camera.position.y = data.camera.y || 250;
                                        camera.position.z = data.camera.z || 250;
                                    }
                                }
                            }

                            if(modelLegacy) {
                                loadLegacyJSON(data);
                            } else {
                                loadSceneFromJSON(data);
                            }
                        }
                    });                
            } else {
                tooltip('No creation URL was found in model JSON');
                return;
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
        zip.loadAsync(file).then(function (zip) {
            let creation = zip.file("creation.gr8").async("string");
            creation.then(function (data) {
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

document.getElementById("cre-import-ldr").addEventListener("change", function (event) {
    let file = event.target.files[0];
    if (!file) {
        console.error("No file selected");
        return;
    }

    let filename = file.name || "Unnamed project";
    const reader = new FileReader();

    reader.onload = function (e) {
        try {
            if (show_import_animation === true) {
                document.getElementById('ui-loading-file').style.display = "block";
                document.getElementsByClassName('scene')[0].style.opacity = "0.1";
            }

            ldraw_loader.parse(e.target.result, async function (creation) {
                scene.add(creation);

                const parts = [];
                creation.traverse((child) => {
                    if (!child.userData?.fileName) {
                        return;
                    }

                    let parent = child.parent;
                    let is_nested = false;

                    while (parent && parent !== creation) {
                        if (parent.userData?.fileName) {
                            is_nested = true;
                            break;
                        }
                        parent = parent.parent;
                    }

                    if (!is_nested) {
                        parts.push(child);
                    }
                });

                for (const part of parts) {
                    const mesh = part.getObjectByProperty("isMesh", true);

                    const mat = mesh
                        ? (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material)
                        : null;

                    const partJson = {
                        ldraw: part.userData.fileName,
                        texturedata: null,
                        opacity: "1.0",
                        materials: [{
                            id: 0,
                            colorcode: mat?.userData?.code ?? 16,
                            texturedata: null
                        }],
                        matrixw: null
                    };

                    let pmanager = new PartManager();
                    pmanager.addPartMaterials(part, partJson, partJson.materials, null, true);
                }

                document.title = filename + ' - ' + DEFAULT_TITLE;
                console.log(creation.userData);

                if (show_import_animation === true) {
                    console.log("Creation imported.");
                    tooltip("Creation imported.");
                    document.getElementById('ui-loading-file').style.display = "none";
                    document.getElementsByClassName('scene')[0].style.opacity = "1.0";
                }
            });
        } catch (err) {
            console.error("parsing error: " + err);
            
            if (show_import_animation === true) {
                tooltip("An error happened while importing");
                document.getElementById('ui-loading-file').style.display = "none";
                document.getElementsByClassName('scene')[0].style.opacity = "1.0";
            }
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

    if (show_import_animation === true) {
        document.getElementById('ui-loading-file').style.display = "block";
        document.getElementsByClassName('scene')[0].style.opacity = "0.1";
    }

    //legacy gr8brik colors
    const legacyColorPalette = {
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

    let modelName = data?.metadata?.name || "Unnamed project";
    for (const block of data.blocks) {
        partName = block.ldraw;
        partPosition = block.position;
        partRotation = block.rotation;
        partMatrixWorld = null;
        partTexture = block.texturedata;
        partOpacity = block.opacity ?? '1.0';
        let partMaterials;
        let objname = block?.id || block?.ldraw;

        if (block.matrixw && Array.isArray(block.matrixw.elements)) {
            block.matrixw = new THREE.Matrix4().fromArray(block.matrixw.elements);
        } else if (partPosition && partRotation) {
            const position = new THREE.Vector3(partPosition.x, partPosition.y, partPosition.z);
            const scale = new THREE.Vector3(1, 1, 1);

            const rotationEuler = new THREE.Euler(partRotation.x, partRotation.y, partRotation.z, 'XYZ');
            const quaternion = new THREE.Quaternion().setFromEuler(rotationEuler);

            block.matrixw = new THREE.Matrix4().compose(position, quaternion, scale);
        } else {
            throw new Error('Object ' + objname + ' is missing elements: matrixw.elements (can also use traditional block.position and block.rotation');
        }

        if (block.materials && Array.isArray(block.materials)) {
            partMaterials = block.materials;
        } else if (block.color) {
            let colorhex = String(block.color).toUpperCase().trim();
            let colorcode = 0;

            if (colorhex in legacyColorPalette) {
                colorcode = legacyColorPalette[colorhex];
            }

            block.materials = [
                {
                    'id': objname,
                    'color': "#" + block.color,
                    'colorcode': String(colorcode),
                    'texturedata': null
                }
            ];
        } else {
            throw new Error('Object ' + objname + ' is missing elements: materials');
        }

        part = 'parts/' + block.ldraw;

        try {
            await new Promise((resolve, reject) => {
                let pmanager = new PartManager();
                pmanager.addPart(block, null, null, resolve, reject);
            });
        } catch (err) {
            console.warn(`Failed to add block: ${block.ldraw}`, err);
            tooltip(`Failed to load ${block.ldraw}`);
        }
    }
    document.title = modelName + ' - ' + DEFAULT_TITLE;

    if (show_import_animation === true) {
        console.log("Creation imported.");
        tooltip("Creation imported.");
        document.getElementById('ui-loading-file').style.display = "none";
        document.getElementsByClassName('scene')[0].style.opacity = "1.0";
    }
    updateSceneData();
}

async function loadLegacyJSON(data) {
    if (!data) {
        console.error("Invalid legacy JSON data.");
        tooltip("Invalid JSON.");
        return;
    }

    if (show_import_animation === true) {
        document.getElementById('ui-loading-file').style.display = "block";
        document.getElementsByClassName('scene')[0].style.opacity = "0.1";
    }

    //legacy LEGACY colors (like, really old)
    const legacyLegacyColorPalette = {
        "#FF0000": 4, // Red
        "#F0E100": 14, // Yellow
        "#0011CF": 1, // Blue
        "#FF9800": 25, // Orange
        "#000000": 0, // Black
        "#FFFFFF": 15, // White
        "#652A0C": 6, // Reddish Brown
        "#00DE00": 10, // Bright Green
    };

    //legacy part types
    const legacyPartPalette = {
        "2X2": "3003",
        "4X2": "3001",
        "1X1": "3005",
        "2X1": "3004",
        "3X1": "3622",
        "3X2": "3002",
        "4X1": "3010",
    };

    let modelName = "Unnamed legacy project";

    for (const block of data) {
        let block2 = {};
        block2.matrixw = new THREE.Matrix4();
        block2.ldraw = null;
        console.log('loading');

        let partDim = block?.dimensions || null;
        let partMatType = block?.intersect?.object?.materials[0]?.type;
        partPosition = block?.intersect?.point;
        partTexture = null;
        partOpacity = '1.0';
        let partMaterials;
        let objname = block?.intersect?.object?.object?.uuid || makeid(8);

        if (Array.isArray(block?.intersect?.object?.object?.matrix) && block.intersect.object.object.matrix.length === 16) {
            const partmatrix = new THREE.Matrix4().fromArray(block.intersect.object.object.matrix);
            const transformMatrix = new THREE.Matrix4().makeScale(1, 1, 1);

            partmatrix.premultiply(transformMatrix);
            block2.matrixw.copy(partmatrix);

            console.log("matrix:", block2.matrixw);
            console.log("is Matrix4:", block2.matrixw instanceof THREE.Matrix4);
        } else {
            throw new Error('Object ' + objname + ' is missing elements: matrix');
        }

        if (block?.color) {
            let colorhex = String(block.color).toUpperCase().trim();
            let colorcode = 0;

            if (colorhex in legacyLegacyColorPalette) {
                colorcode = legacyLegacyColorPalette[colorhex];
            }

            block2.materials = [
                {
                    'id': objname,
                    'colorcode': String(colorcode),
                    'texturedata': null
                }
            ];
        } else {
            throw new Error('Object ' + objname + ' is missing elements: color');
        }

        if(partDim) {
            let dim = partDim?.x + "x" + partDim.z;
            console.log(dim);
            let dim2 = String(dim).toUpperCase().trim();
            console.log(dim2);

            if (dim2 in legacyPartPalette) {
                let ldrawp = legacyPartPalette[dim2]
                block2.ldraw = ldrawp + '.dat';
            } else {
                continue;
            }
        } else {
            continue;
        }

        try {
            await new Promise((resolve, reject) => {
                let pmanager = new PartManager();
                pmanager.addPart(block2, null, null, resolve, reject);
            });
        } catch (err) {
            console.warn(`Failed to add block: ${block2.ldraw}`, err);
            tooltip(`Failed to load ${block2.ldraw}`);
        }
    }
    document.title = modelName + ' - ' + DEFAULT_TITLE;

    if (show_import_animation === true) {
        console.log("Creation imported.");
        tooltip("Creation imported.");
        document.getElementById('ui-loading-file').style.display = "none";
        document.getElementsByClassName('scene')[0].style.opacity = "1.0";
    }
    updateSceneData();
}

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

            if (multiSelectedObject) {
                selector.clearSelection();
            }

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

function getCookie(name) {
    var cookies = document.cookie;
    var parts = cookies.split(name + "=");
    var cookieValue = null;
    if (parts.length == 2) {
        cookieValue = parts.pop().split(";").shift();
    }
    return cookieValue;
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

let grid_lines = null;
let imagePlane = null;
let planeTexture = null;

class GridClass {
    constructor() {
        this.MIN_STUDS = 16;
        this.GRID_STUD_X = this.MIN_STUDS;
        this.GRID_STUD_Z = this.MIN_STUDS;
        this.min_x = -(this.MIN_STUDS / 2);
        this.max_x = this.MIN_STUDS / 2;
        this.min_z = -(this.MIN_STUDS / 2);
        this.max_z = this.MIN_STUDS / 2;
    }

    update(obj) {
        let changed = false;
        let cell_x = Math.floor(obj.position.x / 20);
        let cell_z = Math.floor(obj.position.z / 20);

        if (cell_x < this.min_x) {
            this.min_x = cell_x;
            changed = true;
        } else if (cell_x >= this.max_x) {
            this.max_x = cell_x + 1;
            changed = true;
        }

        if (cell_z < this.min_z) {
            this.min_z = cell_z;
            changed = true;
        } else if (cell_z >= this.max_z) {
            this.max_z = cell_z + 1;
            changed = true;
        }

        if (changed) {
            this.create(this.min_x, this.max_x, this.min_z, this.max_z);
        }
    }

    create(minX = this.min_x, maxX = this.max_x, minZ = this.min_z, maxZ = this.max_z) {
        const color = isDark() ? 0xfafafa : 0x242424;
        const texturepath = isDark() ? 'img/misc/griddark.webp' : 'img/misc/gridlight.webp';
        
        const studs_x = maxX - minX;
        const studs_z = maxZ - minZ;
        const sizeX = studs_x * 20;
        const sizeZ = studs_z * 20;

        if (!imagePlane) {
            const textureLoader = new THREE.TextureLoader();

            planeTexture = textureLoader.load(texturepath);
            planeTexture.wrapS = THREE.RepeatWrapping;
            planeTexture.wrapT = THREE.RepeatWrapping;

            const planeGeometry = new THREE.PlaneGeometry(1, 1);

            const planeMaterial = new THREE.MeshBasicMaterial({
                map: planeTexture,
                transparent: true,
                side: THREE.DoubleSide
            });

            imagePlane = new THREE.Mesh(planeGeometry, planeMaterial);
            imagePlane.rotation.x = -Math.PI / 2;
            scene.add(imagePlane);
        }

        imagePlane.scale.set(sizeX, sizeZ, 1);
        imagePlane.position.x = (minX + maxX) * 20 / 2;
        imagePlane.position.z = (minZ + maxZ) * 20 / 2;
        planeTexture.repeat.set(studs_x, studs_z);

        if (planeTexture.source && planeTexture.source.data && !planeTexture.source.data.src.includes(texturepath)) {
            const textureLoader = new THREE.TextureLoader();

            planeTexture = textureLoader.load(texturepath);
            planeTexture.wrapS = THREE.RepeatWrapping;
            planeTexture.wrapT = THREE.RepeatWrapping;
            imagePlane.material.map = planeTexture;
            imagePlane.material.needsUpdate = true;
        }

        if (grid_lines) {
            scene.remove(grid_lines);
            grid_lines.geometry.dispose();
            grid_lines.material.dispose();
            grid_lines = null;
        }

        if (!scene.userData.grid_lines) {
            return;
        }

        const vertices = [];
        const startX = minX * 20;
        const endX = maxX * 20;
        const startZ = minZ * 20;
        const endZ = maxZ * 20;

        for (let x = startX; x <= endX; x += 20) {
            vertices.push(x, 0, startZ, x, 0, endZ);
        }

        for (let z = startZ; z <= endZ; z += 20) {
            vertices.push(startX, 0, z, endX, 0, z);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

        const material = new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.5
        });

        grid_lines = new THREE.LineSegments(geometry, material);
        grid_lines.position.set(0, -0.1, 0); 
        scene.add(grid_lines);
    }

    remove = function() {
        if(imagePlane) {
            this.removeHelper(imagePlane);
        }

        if(planeTexture) {
            this.removeHelper(planeTexture);
        }

        if(grid_lines) {
            this.removeHelper(grid_lines);
        }

        grid_lines = null, planeTexture = null, imagePlane = null;
    }

    removeHelper = function(elm) {
        scene.remove(elm);

        if (elm.geometry) {
            elm.geometry.dispose();
        }

        if (elm.material) {
            elm.material.dispose();
        }
    }
}

function init() {
    if (window.settings) {
        mergeConfig(window.settings, window.defaults);
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

    // Scene container
    if (!scene) {
        container = document.createElement('div');
        container.classList.add("scene");
        document.body.appendChild(container);
    }

    // Scene
    if (!scene) {
        scene = new THREE.Scene();
        window.scene = scene;

        if (window.settings) {
            mergeConfig(scene.userData, window.settings);
        }
    }

    // WebGl renderer
    if (!renderer) {
        let options = { alpha: true, antialias: true, precision: "mediump" };
        if (!scene.userData.use_webgpu) {
            renderer = new THREE.WebGLRenderer(options);
        } else {
            renderer = new WebGPURenderer(options);
        }

        renderer.outputColorSpace = THREE.SRGBColorSpace;

        // @the_an0nym pointed out how if your screen resolution isn't 100% (and in some cases just always), the scene looks blurry
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);
    }
    renderer.setSize(window.innerWidth, window.innerHeight);

    if(selectionGroup && selectionGroup instanceof THREE.Object3D) {
        scene.add(selectionGroup);
    }

    if(transformControls && transformControls instanceof THREE.Object3D) {
        scene.add(transformControls);
    }

    // transparent ui
    if (scene.userData.ui_trans) {
        applyTransparent(scene.userData.ui_trans);
        document.getElementById("trans-enable").setAttribute('checked', 'true');
    } else {
        document.getElementById("trans-enable").setAttribute('checked', 'false');
    }

    //hdri
    if (scene.userData.use_hdri) {
        applyHdri(scene.userData.use_hdri, scene.userData.hdri_background);
        document.getElementById("hdr-enable").setAttribute('checked', 'true');
    } else {
        document.getElementById("hdr-enable").setAttribute('checked', 'false');
    }

    // webgpu
    if (scene.userData.use_webgpu) {
        document.getElementById("gpu-enable").checked = true;
    } else {
        document.getElementById("gpu-enable").checked = false;
    }

    function update_camera() {
        let activeId = scene.userData.activeCameraId ?? 0;
        let cameraScene = scene.userData.camera;
        let camConfig = cameraScene.find(c => c.id === activeId);

        if (camConfig) {
            if (scene.background && !scene._savedHdriMap) {
                scene._savedHdriMap = scene.background;
            }

            if (camConfig.type === "orthographic") {
                if (scene.userData.flatcamera != true) {
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

            camera.position.set(camConfig.pos.x, camConfig.pos.y, camConfig.pos.z);
            camera.name = camConfig.name || "Default Camera";

            document.querySelector("#current-camera .text").innerText = camera.name;
            document.querySelector("#current-camera .pos").innerText = camConfig.pos.x + ", " + camConfig.pos.y + ", " + camConfig.pos.z;
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
    window.update_camera = update_camera;

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

    if (!controls) {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.8;
    }

    let grid_class = new GridClass();
    grid_class.create();

    // please read ldrawloader docs before changing these values

    ldraw_loader = new THREE.LDrawLoader();
    ldraw_loader.preloadMaterials(ldraw_path + 'colors/ldconfig.ldr');
    ldraw_loader.setConditionalLineMaterial(LDrawConditionalLineMaterial);
    ldraw_loader.setPath(ldraw_path + 'actual/');
    ldraw_loader.setPartsLibraryPath(ldraw_path + 'actual/');
    ldraw_loader.separateObjects = true;

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    let _clipboard = null;

    window.addEventListener('keydown', function (event) {
        let activeElement = document.activeElement;

        if (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA") {
            return;
        }

        if (event.ctrlKey) {
            switch (event.code) {
                case 'KeyC':
                    event.preventDefault();
                    _clipboard = duplicatePart();
                    break
                case 'KeyV':
                    event.preventDefault();
                    if(_clipboard && _clipboard.isMesh && _clipboard?.userData?.ldraw) {
                        scene.add(_clipboard);
                        statehistory.saveState();
                    }
                    break
                case 'KeyS':
                    event.preventDefault();
                    document.getElementById("save-popup").style.display = "block";
                    break
                case 'KeyD':
                    event.preventDefault();
                    let decal = new Decalify(scene, camera);
                    decal.init_ui();
                    break
            }
        } else {
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
                    event.preventDefault();
                    selector.clearSelection(multiSelectedObject);
                    break
                case 'KeyG':
                    groupParts(selectionGroup);
                    break
                case 'Delete':
                    deleteBlock(getPartByUUID());
                    break
                case 'ArrowUp':
                    event.preventDefault();
                    multiSelectedObject.rotation.x -= THREE.MathUtils.degToRad(45);
                    updateSceneData();
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    multiSelectedObject.rotation.x += THREE.MathUtils.degToRad(45);
                    updateSceneData();
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    multiSelectedObject.rotation.y -= THREE.MathUtils.degToRad(45);
                    updateSceneData();
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    multiSelectedObject.rotation.y += THREE.MathUtils.degToRad(45);
                    updateSceneData();
                    break;
            }
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
    let init_control_drag = false;

    controls.addEventListener('change', function() {
        document.querySelector("#current-camera .pos").innerText = Math.round(camera.position.x) + ", " + Math.round(camera.position.y) + ", " + Math.round(camera.position.z);
    });

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

    transformControls.addEventListener('mouseDown', () => {
        let obj = transformControls.object;
        if (!obj) {
            return;
        }

        if (!obj.userData.originalTransform) {
            obj.userData.originalTransform = {
                pos: new THREE.Vector3(),
                quat: new THREE.Quaternion(),
                rot: new THREE.Euler()
            };
        }

        obj.updateMatrixWorld(true);
        obj.userData.originalTransform.pos.copy(obj.position);
        obj.userData.originalTransform.quat.copy(obj.quaternion);
        obj.userData.originalTransform.rot.copy(obj.rotation);

        init_control_drag = true;
    });

    transformControls.addEventListener('objectChange', function () {
        const obj = transformControls.object;
        if (!obj) {
            return;
        }

        if (!scene.userData.noSnap && obj.userData.originalTransform) {
            const orig = obj.userData.originalTransform;

            if (init_control_drag) {
                obj.updateMatrixWorld(true);
                init_control_drag = false;
            }

            const delta_pos = new THREE.Vector3().subVectors(obj.position, orig.pos);
            const snapped_pos = new THREE.Vector3(
                snapToGrid(delta_pos.x, 10),
                snapToGrid(delta_pos.y, 4),
                snapToGrid(delta_pos.z, 10)
            );
            obj.position.copy(orig.pos).add(snapped_pos);

            const snapAngle = THREE.MathUtils.degToRad(45);
            const delta_quat = new THREE.Quaternion().multiplyQuaternions(obj.quaternion, orig.quat.clone().invert());

            const delta_euler = new THREE.Euler().setFromQuaternion(delta_quat, 'XYZ');
            const snapped_euler = new THREE.Euler(
                Math.round(delta_euler.x / snapAngle) * snapAngle,
                Math.round(delta_euler.y / snapAngle) * snapAngle,
                Math.round(delta_euler.z / snapAngle) * snapAngle,
                'XYZ'
            );

            const snapped_delta_quat = new THREE.Quaternion().setFromEuler(snapped_euler);
            obj.quaternion.multiplyQuaternions(snapped_delta_quat, orig.quat);

            obj.pos = obj.position.clone();
            obj.rot = obj.rotation.clone();
        }

        let grid = new GridClass();
        grid.update(obj);
        updateSceneData();
    });

    if (document.querySelector('.stats-contain') && !stats) {
        stats = new Stats();
        stats.dom.classList.add('stats');
        stats.dom.style.left = '';
        stats.dom.style.top = '';
        document.querySelector('.stats-contain').appendChild(stats.dom);
    }

    document.title = DEFAULT_TITLE;

    let versionstrings = document.querySelectorAll('.version-string');
    versionstrings.forEach(elm => {
        elm.textContent = window.version;
    });

    if (document.getElementById("preloaded-logo")) {
        document.getElementById("preloaded-logo").style.display = "none";
    }

    initRenderer();
}
init();

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

if (scene.userData.hideWelcome === true) {
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

document.getElementById("trans-enable").addEventListener("change", function () {
    const ui_trans = this.checked;
    scene.userData.ui_trans = ui_trans;

    applyTransparent(scene.userData.ui_trans);
});

document.getElementById("display-lines-grid").addEventListener("change", function () {
    if (this.checked) {
        scene.userData.grid_lines = true;
    } else {
        scene.userData.grid_lines = false;
    }

    if (grid_lines) {
        scene.remove(grid_lines);
    }

    let grid_class = new GridClass();
    grid_class.create();
    scene.updateMatrixWorld(true);
    saveSettings();
});

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

document.getElementById("gpu-enable").addEventListener("change", function () {
    const gpu = this.checked;
    scene.userData.use_webgpu = gpu;

    document.getElementById("gpu-enable").checked = gpu;
    saveSettings();
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

    if (enabled == true) {
        document.cookie = "mode=dark; max-age=315360000; path=/";
    } else {
        document.cookie = "mode=light; max-age=315360000; path=/";
    }

    scene.updateMatrixWorld(true);
    saveSettings();
});

function applyTransparent(ui_trans) {
    if (ui_trans) {
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
        if (this.redoStack.length === 0) {
            return;
        }

        const nextState = this.redoStack.pop();
        this.undoStack.push(nextState);
        this.loadState(nextState);
    }

    loadState(jsonState) {
        if (blockGroups && blockGroups.length > 0) {
            blockGroups.forEach(function (g) {
                scene.remove(g);
                if (g.geometry) {
                    g.geometry.dispose();
                }
                if (g.material) {
                    if (Array.isArray(g.material)) {
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

        if (multiSelectedObject) {
            selector.clearSelection();
        }

        show_import_animation = false;
        loadSceneFromJSON(JSON.parse(jsonState));
        show_import_animation = true;

        this.scene.updateMatrixWorld();
    }
}

window.statehistory = new statehistoryManager(scene);

window.changeBlockColor = function (color) {
    if (!selectedObject) {
        tooltip("No part selected");
        return;
    }

    let pmanager = new PartManager();

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
                    child.material[targetIdx] = pmanager.createMaterial(color);
                }

                document.querySelector('#selected-map').value = targetIdx;
                selectedMap = null;

                //single material
            } else if (child.material.color) {
                child.material = pmanager.createMaterial(color);
            }
        }
    });

    updateSceneData();
    updateBLItems();
    updatecolorelement();
    statehistory.saveState();

    let namemap = new Map(ldrawColors.map(c => [c.code, c.name]));
    let colorname = namemap.get(color) || color;

    tooltip(`Part color changed to ${colorname}`);
}

function deleteBlock(targetUUID) {
    if (!targetUUID) {
        tooltip('No part UUID provided');
        return;
    }

    if (multiSelectedObject.size > 1) {
        selector.clearSelection();
        return;
    }

    let part = null;

    for (let obj of multiSelectedObject) {
        if (obj.uuid === targetUUID) {
            part = obj;
            break;
        }
    }

    if (!part) {
        part = selectionGroup.children.find(child => child.uuid === targetUUID);
    }

    if (!part) {
        part = scene.getObjectByProperty('uuid', targetUUID);
    }

    if (!part) {
        tooltip('No part found with this UUID');
        return;
    }

    if (part.isMesh || part.isGroup) {
        if (transformControls) {
            transformControls.detach();
        }

        if (multiSelectedObject.has(part)) {
            selector.deselect(part);
        }

        selectionGroup.remove(part);

        let grid_class_e = new GridClass();
        grid_class_e.update(part);

        if (part.parent) {
            part.parent.remove(part);
        }

        delete part.userData.ogparent;

        if (part.geometry) {
            part.geometry.dispose();
        }

        if (part.material) {
            if (Array.isArray(part.material)) {
                part.material.forEach(mat => mat.dispose());
            } else {
                part.material.dispose();
            }
        }

        if (multiSelectedObject.size === 0) {
            selectedObject = null;

            let children = [...selectionGroup.children];
            children.forEach(child => {
                selectionGroup.remove(child);
                delete child.userData.ogparent;
            });
        }

        part.updateMatrixWorld(true);
        tooltip('Deleted part');
    } else {
        tooltip('Part is not a valid mesh');
    }

    updateBLItems();
    scene.updateMatrixWorld(true);
    updateSceneData();
    statehistory.saveState();
}

/* decal functions */

class Decalify {
    constructor(scene, camera) {
        this.camera = camera;
        this.size = new THREE.Vector3(20, 20, 40);
        this.activeTexture = null;
        this.selectedObject = null;

        this.proxyHelper = null;
        this.activeDecalMesh = null;

        this.image_name = null;
        this.image_ref = null;

        this.transformControls = new TransformControls(this.camera, renderer.domElement);
        console.log(this.transformControls);
        scene.add(this.transformControls.getHelper());

        this.setup_transform_events();
        this.setup_hotkeys();
    }

    popup_toggle() {
        const popup = document.getElementById('decal-popup');
        if (popup) {
            popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
        }
    }

    init_ui() {
        this.popup_toggle();
        const image_input = document.querySelector('#upload-part-decal--file');
        const image_save = document.querySelector('#upload-part-decal--submit');

        if (image_input && !image_input.dataset.listenerAttached) {
            image_input.dataset.listenerAttached = "true";
            image_save.addEventListener('click', () => { this.handle_file_upload(image_input) });
        }

        this.selectedObject = [...multiSelectedObject][0] || selectionGroup.children[0] || null;
    }

    handle_file_upload(input) {
        this.cancel_session();

        const file = input.files[0];
        if (!file) {
            tooltip('No file selected');
            return;
        }

        if (!this.selectedObject) {
            tooltip('Select a part first');
            return;
        }

        this.image_ref = document.querySelector('#upload-part-decal--ref').value || makeid(8);
        this.image_name = document.querySelector('#upload-part-decal--name').value || 'Unnamed part';

        const textureLoader = new THREE.TextureLoader();
        const imageURL = URL.createObjectURL(file);

        textureLoader.load(imageURL, (texture) => {
            this.activeTexture = texture;
            this.start_decal_session();
        });
    }

    // Source - https://stackoverflow.com/a/18650249
    // Posted by Arun Killu, modified by community. See post 'Timeline' for change history
    // Retrieved 2026-09-22, License - CC BY-SA 4.0
    async toB64(blobUrl) {
        let res = await fetch(blobUrl);
        let blob = await res.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    start_decal_session() {
        console.log(this.selectedObject);
        console.log(this.activeTexture);

        if (!this.selectedObject || !this.activeTexture) {
            return;
        }

        this.popup_toggle();
        tooltip('You can now ajust the texture on the object');
        window.CURRENT_APP = 'texture';

        const helperGeo = new THREE.BoxGeometry(this.size.x, this.size.y, this.size.z);
        const helperMat = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true,
            transparent: true,
            opacity: 0.4,
            depthTest: false
        });

        this.proxyHelper = new THREE.Mesh(helperGeo, helperMat);
        const boundingBox = new THREE.Box3().setFromObject(this.selectedObject);
        boundingBox.getCenter(this.proxyHelper.position);

        scene.add(this.proxyHelper);
        this.transformControls.attach(this.proxyHelper);
        this.transformControls.setMode('translate');
        this.update_projection();
    }

    setup_transform_events() {
        this.transformControls.addEventListener('change', () => {
            if (this.proxyHelper && this.activeTexture) {
                this.update_projection();
            }
        });

        this.transformControls.addEventListener('mouseDown', function () {
            if(controls) {
                controls.enabled = false;
            }
        });

        this.transformControls.addEventListener('mouseUp', function () {
            if(controls) {
                controls.enabled = true;
            }
        });
    }

    setup_hotkeys() {
        window.addEventListener('keydown', (e) => {
            if (!this.transformControls.object || !e.shiftKey) {
                return;
            }

            switch (e.key.toLowerCase()) {
                case 't': this.transformControls.setMode('translate'); break;
                case 'r': this.transformControls.setMode('rotate'); break;
                case 's': this.transformControls.setMode('scale'); break;
                case 'escape': this.cancel_session(); break;
                case 'enter': this.bake(); break;
            }
        });
    }

    update_projection() {
        if (!this.selectedObject || !this.proxyHelper || !this.activeTexture) {
            return;
        }

        if (this.activeDecalMesh) {
            scene.remove(this.activeDecalMesh);
            this.activeDecalMesh.geometry.dispose();
        }

        const position = this.proxyHelper.position.clone();
        const orientation = this.proxyHelper.rotation.clone();

        const size = new THREE.Vector3(
            this.size.x * this.proxyHelper.scale.x,
            this.size.y * this.proxyHelper.scale.y,
            this.size.z * this.proxyHelper.scale.z
        );

        const targetTarget = this.selectedObject.geometry ? this.selectedObject : this.prep(this.selectedObject);
        if (!targetTarget) {
            return;
        }

        const decalGeometry = new DecalGeometry(targetTarget, position, orientation, size);
        const decalMaterial = new THREE.MeshBasicMaterial({
            map: this.activeTexture,
            transparent: true,
            depthWrite: false,
            polygonOffset: true,
            polygonOffsetFactor: -9
        });

        this.activeDecalMesh = new THREE.Mesh(decalGeometry, decalMaterial);
        this.activeDecalMesh.updateMatrixWorld(true);
        this.proxyHelper.updateMatrixWorld(true);
        scene.add(this.activeDecalMesh);
        scene.updateMatrixWorld(true);
    }

    async bake() {
        if (!this.activeDecalMesh || !this.activeTexture) {
            return;
        }

        if(!window.loggedin) {
            tooltip('Login to save custom parts');
            return;
        }

        const decal = this.activeDecalMesh;
        const texture = this.activeTexture;
        decal.material = decal.material.clone();
        const obj = this.selectedObject;
        const textureImg = texture.image;
        
        this.selectedObject.updateMatrixWorld(true);
        this.proxyHelper.updateMatrixWorld(true);

        const matrixW = this.proxyHelper.matrixWorld.clone();
        const objectInverse = new THREE.Matrix4().copy(this.selectedObject.matrixWorld).invert();
        const localMatrix = new THREE.Matrix4().multiplyMatrices(objectInverse, this.proxyHelper.matrixWorld);

        if (!textureImg) {
            tooltip("Texture image is missing");
            return;
        }

        let canvas = document.createElement('canvas');
        canvas.width = textureImg.width || textureImg.videoWidth || textureImg.naturalWidth;
        canvas.height = textureImg.height || textureImg.videoHeight || textureImg.naturalHeight;

        let ctx = canvas.getContext('2d');
        ctx.drawImage(textureImg, 0, 0);
        let b64_str = canvas.toDataURL('image/png');

        if(!b64_str) {
            tooltip("Texture base64 failed to generate");
            return;
        }

        obj.attach(decal);
        obj.userData.isTexture = true;

        const decalData = {
            reference: this.image_ref,
            name: this.image_name,
            ldraw: obj.userData.ldraw.replace("parts/", ""),
            texture: {
                url: b64_str,
            },
            matrix: {
                world: matrixW.toArray(),
                local: localMatrix.toArray(),
                size: [
                    this.size.x * this.proxyHelper.scale.x,
                    this.size.y * this.proxyHelper.scale.y,
                    this.size.z * this.proxyHelper.scale.z
                ],
            },
        };

        const upload = await this.upload(decalData);
        if (!upload) {
            return;
        }

        if(upload.success === true) {
            obj.userData.textureArray = decalData;
            obj.userData.textureID = upload.id;

            this.cancel_session();
            updateSceneData();
            tooltip('Decal successfully baked onto part');
        } else if(upload.message) {
            tooltip(upload.message);
            console.error(upload.message);
        }

        return;
    }

    upload(decalData) {
        decalData.upload = true;

        return fetch(start_url + "/ajax/custompartsv2", {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(decalData)
        })
        .then(res => res.json())
        .catch(err => {
            tooltip("An unknown error occurred.");
            console.error(err);
            return false;
        });
    }

    cancel_session() {
        this.transformControls.detach();

        if (this.proxyHelper) {
            scene.remove(this.proxyHelper);
            this.proxyHelper.geometry.dispose();
            this.proxyHelper = null;
        }

        if(this.activeDecalMesh) {
            scene.remove(this.activeDecalMesh);
            this.activeDecalMesh.geometry.dispose();
        }

        this.activeDecalMesh = null;
        this.activeTexture = null;
        window.CURRENT_APP = 'modeler';
    }

    prep(group) {
        const geos = [];
        group.updateMatrixWorld(true);

        group.traverse((node) => {
            if (node.isMesh && !node.isLine && node.geometry) {
                const tempgeo = node.geometry.clone();
                tempgeo.applyMatrix4(node.matrixWorld);
                geos.push(tempgeo);
            }
        });

        if (geos.length === 0) {
            return null;
        }

        const targetGeo = BufferGeometryUtils.mergeGeometries(geos);
        const targetMesh = new THREE.Mesh(targetGeo);
        targetMesh.matrixAutoUpdate = false;
        targetMesh.matrixWorld.identity();

        return targetMesh;
    }

    serialize(mesh, decalData) {
        const partid = mesh.userData.ldraw;
        const data = JSON.stringify(decalData);

        if (!partid) {
            console.error('Object has no ldraw part id');
            return;
        }

        localStorage.setItem(partid + "_sticker_" + makeid(5), data);
    }
}

/* Screenshot function */
function capture() {
    let thumb = new THREE.Scene();
    thumb.background = null;

    let count = 0;

    if (selectedObject) {
        selector.deselect(selectedObject);
    }

    if (multiSelectedObject) {
        selector.clearSelection();
    }

    scene.traverse(function (object) {
        if (object?.isMesh && object?.userData.isBlock && !object?.isTransformControls) {
            let cloned = clone_mesh_clean(object);
            if (cloned) {
                thumb.add(cloned);
                if (object.userData.isBlock) {
                    cloned.rotation.setFromQuaternion(cloned.quaternion);
                }
                count++;
            }
        }
    });

    if (count === 0) {
        console.warn("Scene is empty");
        return null;
    }

    let light2 = new THREE.DirectionalLight(0xffffff, 2);
    light2.position.set(camera.position.x || 250, camera.position.y || 250, camera.position.z || 250);
    thumb.add(light2);

    let ambient2 = new THREE.AmbientLight(0xdddddd, 1);
    thumb.add(ambient2);

    let capture_height = 240;
    let capture_width = capture_height * 2;

    let camera2 = camera.clone();
    camera2.aspect = capture_width / capture_height;
    camera2.updateProjectionMatrix();

    let tempRenderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: true });
    tempRenderer.setClearColor(0x000000, 0);
    tempRenderer.setPixelRatio(1);
    tempRenderer.setSize(capture_width, capture_height);

    tempRenderer.render(thumb, camera2);
    let thumbnail = tempRenderer.domElement.toDataURL("image/webp");

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
        console.warn('Part color is not set, setting color as white');
        partColor = "#ffffff";
    }

    if (selectedObject) {
        transformControls.detach(selectedObject);
    }

    if (!fileName || fileName === undefined || fileName === null) {
        fileName = part;
    }

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
            if (partOpacity != null && partOpacity != undefined && partOpacity <= 1.0 && partOpacity <= 1) {
                childOpacity = partOpacity;
            }

            if (child.isMesh && !child.material.map && !child.isLineSegments && !Array.isArray(child.material)) {
                const pos = new THREE.Vector3();
                const pos2 = child.getWorldPosition(pos);
                const geometry = child.geometry;

                if (!geometry.attributes.uv) {
                    partUVGen(geometry);
                }

                if (!Array.isArray(partColor)) {
                    let custommaterial = createCustomMaterial(partColor, colormap);
                    if (custommaterial && scene?.userData?.highRes === true) {
                        child.material = custommaterial;
                    } else {
                        child.material = new THREE.MeshPhysicalMaterial({
                            color: new THREE.Color(partColor || "#ffffff")
                        });
                    }
                } else if (Array.isArray(partColor)) {
                    if (partColor.length < 2) {
                        let color = "#" + partColor[0]?.color || "#ffffff";
                        let custommaterial = createCustomMaterial(color, colormap);
                        if (custommaterial && scene?.userData?.highRes === true) {
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
                        if (mat.name.includes("Main_Colour")) {
                            var index = child.material.map(function (mmap) { return mmap.uuid; }).indexOf(mat.uuid);

                            child.material[index] = mat.clone();
                            child.material[index].needsUpdate = true;

                            mat.name = child.material[index].name + '_' + makeid(5);

                            child.userData.main_mat_uuid = mat.uuid;
                            child.userData.main_mat_name = mat.name;
                            child.userData.main_mat_index = index;

                            if (partColor) {
                                if (Array.isArray(partColor)) {
                                    let match = partColor.find(m => m.id === index);

                                    if (match?.color) {
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

            if (child.material && child.isMesh && !child.material.map && !child.isLineSegments && texture && !Array.isArray(child.material)) {
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
                        xhr.onload = function () {
                            var reader = new FileReader();
                            reader.onloadend = function () {
                                callback(reader.result);
                            }
                            reader.readAsDataURL(xhr.response);
                        };
                        xhr.open('GET', url);
                        xhr.responseType = 'blob';
                        xhr.send();
                    }

                    toDataURL(texture, function (dataUrl) {
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

        blockGroups.push(blockGroup);

        if (show_import_animation === true) {
            tooltip(`Added part ${part.replace("parts/", "")}`);
        }

        updateBLItems();
        updatecolorelement();
        updateSceneData();
        statehistory.saveState();

        if (partSpan && partSpan !== null && partSpan !== undefined) {
            partSpan.querySelector('img').setAttribute("src", originalPSImg);
        }

        if (typeof throwSuccess === "function") {
            throwSuccess();
        }
    }, undefined, function (error) {
        console.error(error);
        tooltip('Could not add this part to this scene');

        if (partSpan && partSpan !== null && partSpan !== undefined) {
            partSpan.querySelector('img').setAttribute("src", originalPSImg);
        }

        if (typeof throwError === "function") {
            throwError(error);
        }
    });
}

/**
 * Class that will eventually host most of the part functions
 */
class PartManager {
    /*
    Helper to add parts to scene (should be pretty clear), but inside of the new PartManager class
    Main function for part data (eg, translation/rotation, materials) is now addPartMaterials()
    Which is called by addPart
    Like addBlockv2, but it takes JSON instead.

    Example:
    part, partColor, partMatrixW, span, original_img, part, null, null, null, null
    let partJson = {
        "ldraw": "3001.dat",
        "texturedata": null,
        "id": 67,
        'materials': [
            {
                "id": 67,
                "name": "Blue",
                'colorcode': 1,
                "texturedata": null,
                'opacity': 1,
            },
        ],
        'matrixw': {},
    };

    */
    addPart(partJson, partSpan, originalPSImg, throwSuccess, throwError) {
        if (!ldraw_loader) {
            return;
        }

        part = partJson.ldraw;
        partMat = partJson.materials;
        partMatrixWorld = partJson.matrixw;

        if (!part) {
            return;
        }

        if (!partMat) {
            return;
        }

        if (selectedObject) {
            transformControls.detach(selectedObject);
        }

        if (multiSelectedObject) {
            selector.clearSelection();
        }

        ldraw_loader.load('parts/' + part, function (loadedGroup) {
            let pmanager = new PartManager();
            pmanager.addPartMaterials(loadedGroup, partJson, partMat, partMatrixWorld, false);

            if (partSpan && partSpan !== null && partSpan !== undefined) {
                partSpan.querySelector('img').setAttribute("src", originalPSImg);
            }

            if (show_import_animation === true) {
                tooltip(`Added part ${serialize_part_name(part)}`);
            }

            if (typeof throwSuccess === "function") {
                throwSuccess();
            }
        }, undefined, function (error) {
            console.error(error);
            tooltip('Could not add this part to this scene');

            if (partSpan && partSpan !== null && partSpan !== undefined) {
                partSpan.querySelector('img').setAttribute("src", originalPSImg);
            }

            if (typeof throwError === "function") {
                throwError(error);
            }
        });
    }

    addPartMaterials(group, partJson, partMat, partMatrixWorld, partIsLdr = false) {
        if (!group) {
            console.error("Loaded group does not exist");
            return;
        }

        let blockGroup = new THREE.Group();
        blockGroup.name = `ldgroup_${blockGroup.uuid}`;
        blockGroup.ldraw = part;

        let display_lines = scene.userData.displayLines;

        group.traverse((child) => {
            if (child.isLineSegments && child.parent.isGroup) {
                child.visible = false;
                return;
            }

            if (child.isMesh && !child.material.map && !child.isLineSegments && !Array.isArray(child.material)) {
                const pos = new THREE.Vector3();
                const geometry = child.geometry;

                if (!geometry.attributes.uv) {
                    partUVGen(geometry);
                }

                if (!Array.isArray(partMat)) {
                    let custommaterial = this.createLegacyMaterial(partMat);
                    if (custommaterial && scene?.userData?.highRes === true) {
                        child.material = custommaterial;
                    } else {
                        child.material = new THREE.MeshPhysicalMaterial({
                            color: new THREE.Color(partMat || "#ffffff")
                        });
                    }
                } else if (Array.isArray(partMat)) {
                    if (partMat.length < 2) {
                        let color = partMat[0]?.colorcode || 0;
                        let custommaterial = this.createMaterial(color);
                        if (custommaterial && scene?.userData?.highRes === true) {
                            child.material = custommaterial;
                            child.material.userData.colorcode = color;
                        } else {
                            child.material = new THREE.MeshPhysicalMaterial({
                                color: new THREE.Color(color)
                            });
                            child.material.userData.colorcode = 0;
                        }
                    }
                }

                child.userData.isBlock = true;
                child.userData.isTexture = false;
                child.userData.ldraw = child.parent.userData.fileName;
                child.userData.ldr_line = false;
            }

            if (child.material && child.material.map && child.isMesh && !child.isLineSegments) {
                child.userData.isBlock = true;
                child.userData.isTexture = true;
                child.userData.ldraw = child.parent.userData.fileName;
                child.userData.ldr_line = false;

                // main color uuid, for minifig textures
                if (Array.isArray(child.material)) {
                    child.material.forEach((mat) => {
                        if (mat.name.includes("Main_Colour")) {
                            var index = child.material.map(function (mmap) { return mmap.uuid; }).indexOf(mat.uuid);

                            child.material[index] = mat.clone();
                            child.material[index].needsUpdate = true;

                            mat.name = child.material[index].name + '_' + makeid(5);

                            child.userData.main_mat_uuid = mat.uuid;
                            child.userData.main_mat_name = mat.name;
                            child.userData.main_mat_index = index;

                            if (partMat) {
                                if (Array.isArray(partMat)) {
                                    let match = partMat.find(m => m.id === index);
                                    let colorMap = new Map(ldrawColors.map(c => [String(c.code), c.hex]));

                                    if (match?.colorcode) {
                                        let colorMatch = colorMap.get(match.colorcode);

                                        if(colorMatch) {
                                            child.material[index].color = new THREE.Color(colorMatch);
                                            child.material[index].userData.colorcode = partMat?.colorcode;
                                        } else {
                                            child.material[index].color = new THREE.Color("#ffffff");
                                            child.material[index].userData.colorcode = '15';
                                        }
                                    } else {
                                        child.material[index].color = new THREE.Color("#ffffff");
                                        child.material[index].userData.colorcode = '15';
                                    }
                                } else {
                                    child.material[index].color = new THREE.Color(partMat || "#ffffff");
                                }
                            }
                        } else {
                            var index = child.material.map(function (mmap) { return mmap.uuid; }).indexOf(mat.uuid);
                            child.material[index] = mat.clone();
                            child.material[index].needsUpdate = true;
                            child.material[index].name = child.material[index].name + '_' + makeid(5);
                            child.material[index].userData.colorcode = mat.userData.code ?? 0;
                        }
                    });
                }
            }

            if (child.material && child.isMesh && !child.material.map && !child.isLineSegments) {
                if (partMat) {
                    if (Array.isArray(partMat)) {
                        partMat.forEach(mat => {
                            if(mat.textureID) {
                                fetch(start_url + '/ajax/custompartsv2?fetch=true&id=' + mat.textureID, {
                                    method: "GET",
                                    credentials: "include",
                                })
                                .then(res => res.json())
                                .then(res => this.loadDecal(res, child))
                                .catch(err => {
                                    tooltip("An unknown error occurred.");
                                    console.error(err);
                                    return false;
                                });
                            }
                        });
                    }
                }
            }

            child.userData.parentName = group.userData.fileName;
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

        blockGroup.attach(group);

        if (partMatrixWorld instanceof THREE.Matrix4) {
            blockGroup.matrixAutoUpdate = true;
            partMatrixWorld.decompose(blockGroup.position, blockGroup.quaternion, blockGroup.scale);
            blockGroup.updateMatrix();
            blockGroup.updateMatrixWorld(true);
        } else {
            if(!partIsLdr) {
                blockGroup.position.y = objectSize(blockGroup).y;
            }

            blockGroup.rotation.x = Math.PI;
        }

        blockGroup.userData.partName = partName;
        scene.add(blockGroup);

        blockGroups.push(blockGroup);
        selector.selectObject(blockGroup);

        let grid = new GridClass();
        grid.update(blockGroup);

        updateBLItems();
        updatecolorelement();
        updateSceneData();
        statehistory.saveState();
    }

    loadDecal(decal, obj) {
        const textureLoader = new THREE.TextureLoader();

        if(!decal.part) {
            return;
        }

        if(!decal.part.texture) {
            return;
        }

        if(!decal.part.texture.url) {
            return;
        }

        if(!decal.part.matrix.local) {
            return;
        }
        
        if(!decal.part.matrix.size) {
            return;
        }

        textureLoader.load(decal.part.texture.url, (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;

            const localMatrix = new THREE.Matrix4().fromArray(decal.part.matrix.local);
            const worldMatrix = new THREE.Matrix4().multiplyMatrices(obj.matrixWorld, localMatrix);
            const position = new THREE.Vector3();
            const quaternion = new THREE.Quaternion();
            const scale = new THREE.Vector3();

            worldMatrix.decompose(position, quaternion, scale);

            const rotation = new THREE.Euler().setFromQuaternion(quaternion);
            const size = new THREE.Vector3().fromArray(decal.part.matrix.size);
            const geometry = new DecalGeometry(obj, position, rotation, size);

            const material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                depthWrite: false,
                polygonOffset: true,
                polygonOffsetFactor: -9
            });

            const decal_mesh = new THREE.Mesh(geometry, material);
            obj.userData.isTexture = true;
            obj.attach(decal_mesh);
        });
    }

    createMaterial(partColor) {
        const colorMap = new Map(ldrawColors.map(c => [String(c.code), c]));
        const colorMatch = colorMap.get(partColor);

        const materialType = colorMatch?.type || 'solid';
        const materialColor = colorMatch?.hex || '#ffffff';

        const params = {
            color: new THREE.Color(materialColor),
            opacity: colorMatch?.alpha / 255,
            transparent: true,
            reflectivity: 0.5,
            roughness: 0.15,
            metalness: 0.0,
            clearcoat: 0.4,
            envMapIntensity: 0.5,
            clearcoatRoughness: 0.1
        };

        switch (materialType) {
            case 'transparent':
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

            case 'matteMetallic':
                params.roughness = 0.45;
                params.metalness = 0.8;
                params.clearcoat = 0;
                break;

            case 'pearlescent':
                params.roughness = 0.3;
                params.clearcoat = 0.8;
                params.clearcoatRoughness = 0.1;
                break;

            case 'rubber':
                params.roughness = 0.9;
                params.metalness = 0;
                params.clearcoat = 0;
                break;

            case 'glitter':
                params.clearcoat = 1;
                params.roughness = 0.15;
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

        let material = new THREE.MeshPhysicalMaterial(params);
        material.userData.colorcode = partColor;
        material.name = partColor;
        return material;
    }

    createLegacyMaterial(colorhex) {
        const legacyColorPalette = {
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

        let params = {
            reflectivity: 0.5,
            roughness: 0.15,
            metalness: 0.0,
            clearcoat: 0.4,
            envMapIntensity: 0.5,
            clearcoatRoughness: 0.1
        };

        let colorcode;
        if (colorhex in legacyColorPalette) {
            params.color = new THREE.Color(`#${colorhex}`);
            colorcode = legacyColorPalette[colorhex];
        } else {
            params.color = new THREE.Color("#FFFFFF");
            colorcode = 15;
        }

        let material = new THREE.MeshPhysicalMaterial(params);
        material.userData.colorcode = colorcode;
        return material;
    }
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

        case 'matteMetallic':
            params.roughness = 0.45;
            params.metalness = 0.8;
            params.clearcoat = 0;
            break;

        case 'pearlescent':
            params.roughness = 0.3;
            params.clearcoat = 0.8;
            params.clearcoatRoughness = 0.1;
            break;

        case 'rubber':
            params.roughness = 0.9;
            params.metalness = 0;
            params.clearcoat = 0;
            break;

        case 'glitter':
            params.clearcoat = 1;
            params.roughness = 0.15;
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

/*function renderBLItem(obj) {
    const id = obj.uuid;

    let colormap = new Map(ldrawColors.map(c => [String(c.code), c.name]));
    let colorid = obj.material?.userData?.colorcode || '4';
    let color = colormap.get(String(colorid).toUpperCase().trim());

    let part;
    if (obj.userData.isBlock && obj.userData.ldraw) {
        part = (obj?.userData?.ldraw || obj?.parent?.userData?.ldraw || "").replace(/^(parts\/)?|(?:_?\.(dat|ldr))$/gi, "");
        partIcon = `${ldraw_icon_path + part}.png`;
    } else if (obj.userData.isGroup) {
        part = "Group of parts";
        partIcon = `${ldraw_icon_path}3001.png`;
    }

    const img = document.createElement('img');
    img.setAttribute('src', partIcon);
    img.setAttribute('loading', 'lazy');
    img.setAttribute('width', '45px');

    const li = document.createElement('li');
    li.classList.add('scene-block-item');
    li.setAttribute('data-id', id);
    li.innerHTML = `${part} (${color})`;

    if (obj.children && obj.children.length > 0) {
        const ul = document.createElement('ul');

        obj.children.forEach(child => {
            if (child.isMesh) {
                const childLi = renderBLItem(child);
                ul.appendChild(childLi);
            }
        });

        li.appendChild(ul);
    }
    li.appendChild(img);

    return li;
}*/

function BLItemValid(obj) {
    if (!obj) {
        return false;
    }

    const isPart = obj.isMesh && obj.userData?.isBlock && obj.userData?.ldraw;

    const isGroup = obj.userData?.isGroup;

    return isPart || isGroup;
}

function getBLItems() {
    const roots = [];

    scene.children.forEach(child => {
        findTopBL(child, roots);
    });

    return roots;
}

function findTopBL(node, roots) {
    if (!node) {
        return;
    }

    if (BLItemValid(node)) {
        roots.push(node);
        return;
    }

    if (node.children) {
        node.children.forEach(child => {
            findTopBL(child, roots);
        });
    }
}

function getBLChildren(node) {
    const children = [];

    if (!node?.children) {
        return children;
    }

    node.children.forEach(child => {
        findTopBL(child, children);
    });

    return children;
}

function updateBLItems() {
    const items = getBLItems();
    const blockList = document.getElementById('block-list');
    let partCount = 0;

    blockList.innerHTML = "";

    items.forEach(obj => {
        const item = renderBLItem(obj);
        blockList.appendChild(item);
    });

    //part count at bottom of page
    scene.traverse((obj) => {
        if (obj.visible && obj.userData?.isBlock) {
            partCount++;
        }
    });

    document.querySelector('#part-count .count').innerHTML = partCount;
}

function renderBLItem(obj) {
    const id = obj.uuid;
    const colormap = new Map(ldrawColors.map(c => [String(c.code), c.name]));
    const main_mat_index = obj?.userData?.main_mat_index || 1;

    //quicky for fixing some issues with multi colored parts :p
    let colorid;
    if(Array.isArray(obj?.material)) {
        colorid = String(obj.material[main_mat_index].userData?.colorcode) || '4';
    } else {
        colorid = String(obj.material?.userData?.colorcode) || '4';
    }

    const color = colormap.get(colorid) || 'Unknown color';
    let part = "Unknown part";
    let partIcon = `${ldraw_icon_path}3001.png`;

    if (obj.userData?.isBlock && obj.userData?.ldraw) {
        part = (
            obj.userData.ldraw ||
            obj.parent?.userData?.ldraw ||
            ""
        ).replace(/^(parts\/)|(?:_?\.(dat|ldr))$/gi, "");

        partIcon = `${ldraw_icon_path}${part}.png`;
    } else if (obj.userData?.isGroup) {
        part = obj.name || "Group of parts";
    }

    const li = document.createElement('li');
    li.classList.add('scene-block-item');
    li.setAttribute('data-id', id);

    const content = document.createElement('div');

    const img = document.createElement('img');
    img.setAttribute('src', partIcon);
    img.setAttribute('loading', 'lazy');
    img.setAttribute('width', '45px');

    const text = document.createElement('span');
    text.textContent = `${part} (${color})`;

    content.appendChild(img);
    content.appendChild(text);
    li.appendChild(content);

    const validChildren = getBLChildren(obj);

    if (validChildren.length > 0) {
        const ul = document.createElement('ul');
        ul.classList.add('nested');

        validChildren.forEach(child => {
            const childLi = renderBLItem(child);
            ul.appendChild(childLi);
        });

        li.appendChild(ul);
    }

    return li;
}

function groupParts(objects) {
    const group = new THREE.Group();
    group.name = "ldgroup_" + makeid(8);
    group.userData.isGroup = true;

    scene.add(group);

    if (objects.children.length > 1) {
        objects.children.forEach(obj => {
            obj.updateMatrixWorld(true);
            group.attach(obj);
        });
    } else {
        object.updateMatrixWorld(true);
        group.attach(object);
    }

    updateSceneData();
    updateBLItems();
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
    updateBLItems();
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

function serialize_part_name(rawName) {
    if (!rawName || typeof rawName !== 'string') {
        return "Unknown part";
    }

    return rawName.replace(/^(parts\/)?|(?:_?\.(dat|ldr))$/gi, "");
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

function getPartByUUID() {
    let obj;

    if (multiSelectedObject.size === 1) {
        obj = [...multiSelectedObject][0].uuid;
    } else if (selectedObject === selectionGroup && selectionGroup.children.length === 1) {
        obj = selectionGroup.children[0].uuid;
    } else {
        return;
    }

    return obj;
}

/*function duplicatePart() {
    if(!multiSelectedObject) {
        return;
    }

    if (multiSelectedObject.size > 1) {
        tooltip('You can only duplicate one part at a time')
        return;
    }

    let clone;

    console.log(selectionGroup);

    clone = selectionGroup.clone();
    clone.material = selectionGroup.material.clone(); 
    scene.add(clone);

    statehistory.saveState();
}*/

function duplicatePart() {
    if (!multiSelectedObject || multiSelectedObject.size === 0) {
        return;
    }

    if (multiSelectedObject.size > 1) {
        tooltip('You can only duplicate one part at a time');
        return;
    }

    let ogmesh = Array.from(multiSelectedObject)[0];
    let clone = ogmesh.clone();

    if (clone.material) {
        clone.material = clone.material.clone();
    }

    return clone;
}

document.getElementById("part-library-filter").addEventListener("change", function () {
    let new_ldraw_path = this.value;
    ldraw_loader.setPath(new_ldraw_path);
    ldraw_loader.setPartsLibraryPath(new_ldraw_path);
});

function generateSceneJSON(legacy = false) {
    const scenedata_name = document.querySelector("#save-popup input[name='name']").value.trim();
    const scenedata_desc = document.querySelector("#save-popup textarea[name='desc']").value.trim();

    let sceneData = {
        metadata: {
            generator: 'Gr8brik',
            file_version: '1.2.1.4',
            name: scenedata_name || "Unnamed project",
            description: scenedata_desc || ""
        },
        camera: {
            'x': Math.round(camera.position.x),
            'y': Math.round(camera.position.y),
            'z': Math.round(camera.position.z)
        },
        blocks: []
    };

    scene.traverse(function (group) {
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
            let mat_opacity;
            let mesh_texture;
            let mesh_texturedata;

            //handles ldrawloader materials better than older function
            if (Array.isArray(mesh_child.material)) {
                let LAYER_INDEX = 0;

                mesh_color = mesh_child.material[1].color.getHexString().toLowerCase();

                if (mesh_child.material[1].transparent) {
                    let opa_num = mesh_child[1]?.material?.opacity || 1.0;
                    mesh_opacity = +opa_num.toFixed(2);
                }

                if (mesh_child.material[1].map) {
                    mesh_texture = mesh_child.material[1].map;
                    mesh_texturedata = mesh_child.userData.textureData;
                }

                mesh_child.material.forEach(mat => {
                    let opa_num = mat.opacity || 1.0;
                    mat_opacity = +opa_num.toFixed(2);

                    const materialData = {
                        id: LAYER_INDEX,
                        name: mat.name,
                        obj: mesh_child.userData.id || mesh_child.uuid,
                        colorcode: mat.userData.colorcode,
                        texturedata: mesh_child.userData.textureData || null, //legacy, will probably be removed
                        textureID: mesh_child.userData.textureID || null,
                        opacity: mat_opacity,
                    }
                    console.log(materialData);
                    materials.push(materialData);
                    LAYER_INDEX += 1;
                });
            } else {
                mesh_color = mesh_child.material.color.getHexString().toLowerCase();

                if (mesh_child.material.transparent) {
                    let opa_num = mesh_child?.material?.opacity || 1.0;
                    mesh_opacity = +opa_num.toFixed(2);
                }

                if (mesh_child.material.map) {
                    mesh_texture = mesh_child.material.map;
                    mesh_texturedata = mesh_child.userData.textureData; //legacy, will probably be removed
                }

                const materialData = {
                    id: mesh_child.userData.id || mesh_child.uuid,
                    name: mesh_child.material.name,
                    obj: mesh_child.userData.id || mesh_child.uuid,
                    colorcode: mesh_child.material.userData.colorcode || 0,
                    texturedata: mesh_texturedata || null,
                    textureID: mesh_child.userData.textureID || null,
                    opacity: mesh_opacity,
                }
                materials.push(materialData);
            }

            const blockData = {
                color: mesh_color,
                matrixw: {
                    elements: clean_matrix(mesh_child.matrixWorld.elements)
                },
                id: mesh_child.userData.id || mesh_child.uuid,
                ldraw: mesh_child.userData.ldraw.replace("parts/", ""),
                materials,
            };

            if (legacy) {
                //legacy position and rotation
                //for compatablity for old format
                blockData.position = {
                    x: Math.round(pos.x),
                    y: Math.round(pos.y),
                    z: Math.round(pos.z)
                }

                blockData.rotation = {
                    x: Math.round(euler.x),
                    y: Math.round(euler.y),
                    z: Math.round(euler.z)
                }

                blockData.texturedata = mesh_texturedata || null;
                blockData.opacity = mesh_opacity || "1.0";
            }

            sceneData.blocks.push(blockData);
        });
    });

    return JSON.stringify(sceneData);
}
window.generateSceneJSON = generateSceneJSON;

//life support please just export as ldraw
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

    if (multiSelectedObject) {
        selector.clearSelection();
    }

    const ldd_colors = [{ "ldraw": "15", "lego": "1" }, { "ldraw": "7", "lego": "2" }, { "ldraw": "18", "lego": "3" }, { "ldraw": "12", "lego": "4" }, { "ldraw": "19", "lego": "5" }, { "ldraw": "17", "lego": "6" }, { "ldraw": "13", "lego": "9" }, { "ldraw": "313", "lego": "11" }, { "ldraw": "450", "lego": "12" }, { "ldraw": "92", "lego": "18" }, { "ldraw": "79", "lego": "20" }, { "ldraw": "4", "lego": "21" }, { "ldraw": "351", "lego": "22" }, { "ldraw": "1", "lego": "23" }, { "ldraw": "14", "lego": "24" }, { "ldraw": "6", "lego": "25" }, { "ldraw": "0", "lego": "26" }, { "ldraw": "8", "lego": "27" }, { "ldraw": "2", "lego": "28" }, { "ldraw": "74", "lego": "29" }, { "ldraw": "68", "lego": "36" }, { "ldraw": "10", "lego": "37" }, { "ldraw": "484", "lego": "38" }, { "ldraw": "20", "lego": "39" }, { "ldraw": "47", "lego": "40" }, { "ldraw": "36", "lego": "41" }, { "ldraw": "43", "lego": "42" }, { "ldraw": "33", "lego": "43" }, { "ldraw": "46", "lego": "44" }, { "ldraw": "9", "lego": "45" }, { "ldraw": "38", "lego": "47" }, { "ldraw": "34", "lego": "48" }, { "ldraw": "42", "lego": "49" }, { "ldraw": "294", "lego": "50" }, { "ldraw": "100", "lego": "100" }, { "ldraw": "73", "lego": "102" }, { "ldraw": "503", "lego": "103" }, { "ldraw": "22", "lego": "104" }, { "ldraw": "462", "lego": "105" }, { "ldraw": "25", "lego": "106" }, { "ldraw": "3", "lego": "107" }, { "ldraw": "110", "lego": "110" }, { "ldraw": "40", "lego": "111" }, { "ldraw": "112", "lego": "112" }, { "ldraw": "37", "lego": "113" }, { "ldraw": "114", "lego": "114" }, { "ldraw": "115", "lego": "115" }, { "ldraw": "11", "lego": "116" }, { "ldraw": "117", "lego": "117" }, { "ldraw": "118", "lego": "118" }, { "ldraw": "27", "lego": "119" }, { "ldraw": "120", "lego": "120" }, { "ldraw": "26", "lego": "124" }, { "ldraw": "125", "lego": "125" }, { "ldraw": "52", "lego": "126" }, { "ldraw": "142", "lego": "127" }, { "ldraw": "129", "lego": "129" }, { "ldraw": "179", "lego": "131" }, { "ldraw": "133", "lego": "132" }, { "ldraw": "379", "lego": "135" }, { "ldraw": "373", "lego": "136" }, { "ldraw": "28", "lego": "138" }, { "ldraw": "134", "lego": "139" }, { "ldraw": "272", "lego": "140" }, { "ldraw": "288", "lego": "141" }, { "ldraw": "41", "lego": "143" }, { "ldraw": "143", "lego": "143" }, { "ldraw": "137", "lego": "145" }, { "ldraw": "178", "lego": "147" }, { "ldraw": "148", "lego": "148" }, { "ldraw": "150", "lego": "150" }, { "ldraw": "378", "lego": "151" }, { "ldraw": "335", "lego": "153" }, { "ldraw": "320", "lego": "154" }, { "ldraw": "54", "lego": "157" }, { "ldraw": "135", "lego": "179" }, { "ldraw": "57", "lego": "182" }, { "ldraw": "183", "lego": "183" }, { "ldraw": "191", "lego": "191" }, { "ldraw": "70", "lego": "192" }, { "ldraw": "71", "lego": "194" }, { "ldraw": "89", "lego": "195" }, { "ldraw": "23", "lego": "196" }, { "ldraw": "69", "lego": "198" }, { "ldraw": "72", "lego": "199" }, { "ldraw": "81", "lego": "200" }, { "ldraw": "151", "lego": "208" }, { "ldraw": "212", "lego": "212" }, { "ldraw": "216", "lego": "216" }, { "ldraw": "6", "lego": "217" }, { "ldraw": "5", "lego": "221" }, { "ldraw": "29", "lego": "222" }, { "ldraw": "77", "lego": "223" }, { "ldraw": "226", "lego": "226" }, { "ldraw": "39", "lego": "229" }, { "ldraw": "45", "lego": "230" }, { "ldraw": "232", "lego": "232" }, { "ldraw": "44", "lego": "236" }, { "ldraw": "85", "lego": "268" }, { "ldraw": "78", "lego": "283" }, { "ldraw": "21", "lego": "294" }, { "ldraw": "297", "lego": "297" }, { "ldraw": "80", "lego": "298" }, { "ldraw": "82", "lego": "299" }, { "ldraw": "117", "lego": "304" }, { "ldraw": "308", "lego": "308" }, { "ldraw": "26", "lego": "309" }, { "ldraw": "334", "lego": "310" }, { "ldraw": "35", "lego": "311" }, { "ldraw": "86", "lego": "312" }, { "ldraw": "87", "lego": "315" }, { "ldraw": "83", "lego": "316" }, { "ldraw": "321", "lego": "321" }, { "ldraw": "323", "lego": "323" }];

    let lddmap = new Map(ldd_colors.map(item => [item.ldraw, item.lego]));

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
            let ldraw_code = 15;

            if (!mesh_child.material.map && !mesh_child.isLineSegments) {
                ldraw_code = mesh_child.material?.userData?.colorcode;
                colorID = lddmap.get(String(ldraw_code));
                console.log(ldraw_code);
                console.log(colorID);
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
            <LXFML versionMajor="5" versionMinor="0" name="Unnamed">
            <Meta>
                <Application name="LEGO Digital Designer" versionMajor="4" versionMinor="3"/>
                <Brand name="LDD"/>
                <BrickSet version="2670"/>
            </Meta>
            <Model name="Unnamed"></Model>
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

                if (child.isMesh) {
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
    let jsonData = generateSceneJSON();
    localStorage.setItem("localsave", jsonData);
}

function read_autosave() {
    let saved = localStorage.getItem("localsave");

    if (confirm("Are you sure you want to proceed? Doing so will clear your current scene.")) {
        if (saved) {
            try {
                wipe_scene();

                const parsed = JSON.parse(saved);
                loadSceneFromJSON(parsed);

                if(parsed.camera) {
                    camera.position.x = parsed.camera.x;
                    camera.position.y = parsed.camera.y;
                    camera.position.z = parsed.camera.z;
                }
            } catch (e) {
                console.warn("failed to load autosave " + e);
            }
        }
    } else {
        return;
    }
}

function clear_autosave() {
    const saved = localStorage.getItem("localsave");

    if (saved) {
        try {
            let parsed = JSON.parse(saved);
            parsed.blocks = null;
            parsed.camera = null;
            localStorage.removeItem("localsave");

            tooltip('Cleared autosave');
        } catch (e) {
            console.warn("failed to load autosave " + e);
        }
    }
}

// clears all scene content and restores defaults
function wipe_scene() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }

    if(multiSelectedObject) {
        selector.clearSelection();
    }

    if(selectedObject) {
        selectedObject = null;
    }

    let grid_class = new GridClass();
    grid_class.remove();

    const meshes = [];
    scene.traverse(function (obj) {
        if (obj.isMesh) {
            meshes.push(obj);
        }
    });

    meshes.forEach(function (obj) {
        if (obj.geometry) {
            obj.geometry.dispose();
        }

        if (obj.material) {
            if (Array.isArray(obj.material)) {
                obj.material.forEach(function (mat) {
                    mat.dispose();
                });
            } else {
                obj.material.dispose();
            }
        }
    });

    if (blockGroups && blockGroups.length > 0) {
        blockGroups.forEach(function (g) {
            g.traverse(function (child) {
                if (child.geometry) {
                    child.geometry.dispose();
                }

                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(function (mat) {
                            mat.dispose();
                        });
                    } else {
                        child.material.dispose();
                    }
                }
            });
        });
    }

    scene.updateMatrixWorld(true);
    window.history.pushState(null, '', window.location.pathname);

    scene.clear();
    init();
    updateBLItems();
}

//cleans matrixes to save file output size
function clean_matrix(elm, precision = 4) {
  return elm.map(val => {
    let round = parseFloat(val.toFixed(precision));
    return round === -0 ? 0 : round;
  });
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
            mat = obj.material.map(oldMaterial => {
                return oldMaterial.clone();
            });
        } else {
            if (obj.geometry && obj.geometry.groups && obj.geometry.groups.length > 0) {
                mat = obj.geometry.groups.map(() => obj.material.clone());
            } else {
                mat = obj.material.clone();
            }
        }
    } else {
        if (obj.geometry && obj.geometry.groups && obj.geometry.groups.length > 0) {
            mat = obj.geometry.groups.map(() => new THREE.MeshPhysicalMaterial({ color: 0xffffff }));
        } else {
            mat = new THREE.MeshPhysicalMaterial({ color: 0xffffff });
        }
    }

    if (!mat) {
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

    if (!geometry) {
        return new Error('Invalid geometry for object ' + obj.name);
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
        if (object.isMesh && (object.userData.isBlock || object.userData.isTexture)) {
            let hexColor;

            if (!Array.isArray(object.material)) {
                hexColor = object.material?.color || new THREE.Color(0xffffff);
            } else {
                hexColor = object.material[0]?.color || new THREE.Color(0xffffff);
            }

            let cloned = clone_mesh_clean(object);
            if (cloned) {
                thumb.add(cloned);
                cloned.rotation.setFromQuaternion(cloned.quaternion);
            }
        }
    });
    return thumb;
}

//complex selection logic
multiSelectedObject = new Set();
selectionGroup = new THREE.Group();
scene.add(selectionGroup);

window.addEventListener('pointerdown', function (event) {
    let target = event.target;
    let container = document.querySelector(".scene");
    const rect = container.getBoundingClientRect();

    if(window.CURRENT_APP === 'texture') {
        selector.clearSelection();
        return;
    }

    if (!container.contains(target)) {
        return;
    }

    if (transformControls.dragging || transformControls.pointerIsOver) {
        return;
    }

    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const targets = [];
    scene.traverse((obj) => {
        if (obj.visible && obj.userData?.isBlock) {
            targets.push(obj);
        }
    });

    let intersects = raycaster.intersectObjects(targets, true);

    if (intersects.length > 0) {
        let hit = intersects[0].object;
        selector.getIntersects(hit);
    } else {
        selector.clearSelection();
    }
});

class SelectorClass {
    getIntersects(hit) {
        let block = null;
        let group = null;

        let current = hit;

        while (current) {
            if (current.userData?.isGroup) {
                group = current;
                break;
            }

            if (current.userData?.isBlock && current.userData?.ldraw) {
                block = current;
            }

            current = current.parent;
        }

        hit = group || block;

        if (hit) {
            if (event.shiftKey) {
                this.selectObject(hit, "add");
            } else if (event.ctrlKey) {
                this.selectObject(hit, "toggle");
            } else {
                this.selectObject(hit, "replace");
            }
        }
    }

    selectObject(obj, mode = "replace") {
        while (obj?.parent && !obj?.userData?.isBlock && !obj?.userData?.ldraw && !obj?.userData?.isGroup) {
            obj = obj.parent;
        }

        if (!obj?.userData?.isBlock && !obj?.userData?.ldraw && !obj?.userData?.isGroup) {
            return;
        }

        if (mode === "replace") {
            this.clearSelection();
        }

        if (mode === "toggle" && multiSelectedObject.has(obj)) {
            this.deselect(obj);
            return;
        }

        multiSelectedObject.add(obj);
        this.updateSelection();
    }

    getParent(child) {
        let uuid = child.userData.ogpraent;

        if (uuid) {
            let parent = scene.getObjectByProperty('uuid', uuid);

            if (parent) {
                return parent;
            }
        }

        return scene;
    }

    updateSelection() {
        if (multiSelectedObject.size === 0) {
            transformControls.detach();
            selectedObject = null;
            return;
        }

        let children = [...selectionGroup.children];
        children.forEach(child => {
            let ogparent = this.getParent(child);
            ogparent.attach(child);
        });

        let box = new THREE.Box3();
        multiSelectedObject.forEach(o => {
            highlight(o);
            box.expandByObject(o);
        });

        let center = new THREE.Vector3();
        box.getCenter(center);

        selectionGroup.position.copy(center);
        selectionGroup.rotation.set(0, 0, 0);
        selectionGroup.scale.set(1, 1, 1);
        selectionGroup.updateMatrixWorld(true);

        multiSelectedObject.forEach(o => {
            if (!o.userData.ogparent && o.parent) {
                o.userData.ogparent = o.parent.uuid;
            }

            selectionGroup.attach(o);

            o.traverse(child => {
                if (child.isMesh && child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(mat => mat.needsUpdate = true);
                    } else {
                        if (
                            child.material.userData &&
                            child.material.userData.colorcode
                        ) {
                            partColor = child.material.userData.colorcode;
                        }

                        child.material.needsUpdate = true;
                    }
                }
            });
        });

        transformControls.attach(selectionGroup);
        selectedObject = selectionGroup;

        updateSceneData();
        updateBLItems();
        window.updatecolorelement();
    }

    deselect(obj) {
        if (!multiSelectedObject.has(obj)) {
            return;
        }

        unhighlight(obj);
        multiSelectedObject.delete(obj);

        const ogparent = this.getParent(obj);
        ogparent.attach(obj);

        obj.traverse(child => {
            if (child.isMesh && child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(mat => mat.needsUpdate = true);
                } else {
                    child.material.needsUpdate = true;
                }
            }
        });

        delete obj.userData.ogparent;

        if (multiSelectedObject.size > 0) {
            this.updateSelection();
        } else {
            transformControls.detach();
            selectedObject = null;
        }

        updateSceneData();
        updateBLItems();
    }

    clearSelection() {
        const items = [...multiSelectedObject];

        for (let i = items.length - 1; i >= 0; i--) {
            this.deselect(items[i]);
        }
    }
}
window.selector = new SelectorClass();

function highlight(obj) {
    obj.traverse(child => {
        const mat = child.material;
        if (mat && mat.emissive) {
            mat.userData = mat.userData || {};
            mat.userData.isHighlighted = true;
            mat.emissive.set(0x333333);
        }
    });
}

function unhighlight(obj) {
    obj.traverse(child => {
        const mat = child.material;
        if (mat && mat.emissive) {
            mat.userData = mat.userData || {};
            mat.userData.isHighlighted = false;
            mat.emissive.set(0x000000);
        }
    });
}

function onWindowResize() {
    if (scene.userData.flatcamera) {
        camera.left = window.innerWidth / -2;
        camera.right = window.innerWidth / 2;
        camera.top = window.innerHeight / 2;
        camera.bottom = window.innerHeight / -2;
        camera.zoom = 2;
    } else {
        camera.aspect = window.innerWidth / window.innerHeight;
    }

    transformControls.size = 0.75;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function moveBlock(mode) {
    if(window.CURRENT_APP === 'texture') {
        return;
    }

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

function animate() {
    stats.update();
    document.querySelector('.stats-contain').appendChild(stats.domElement);
    animationFrameId = requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

async function initRenderer() {
    if (scene.userData.use_webgpu) {
        await renderer.init();
    }
    animate();
}

function tooltip(text) {
    const existing_tooltip = document.getElementById('tooltip');

    if(existing_tooltip) {
        existing_tooltip.remove();
    }

    const tooltip = document.createElement('div');

    if (tooltip) {
        tooltip.innerHTML = text;
        tooltip.setAttribute('id', 'tooltip');

        document.body.appendChild(tooltip);

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
        tooltipExit.addEventListener('click', function () {
            tooltip.remove();
        }, false);
    }
}

/*window.addEventListener('load', () => {
    setTimeout(() => {
        if (document.getElementById("preloaded-logo")) {
            document.getElementById("preloaded-logo").style.display = "none";
        }
    }, 500);
});*/
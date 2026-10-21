/**
The mess that runs the entire modeler 
Credits: susstevedev, the_an0nym
*/

/**
This code follows the MIT License

Copyright (c) 2023-2026 The Gr8brik Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/**
 * This program needs multiple reforms before the exit from beta:
 * - Move most functions to classes
 * - Move said classes to new files
 * 
 * A good example of a "perfect" ThreeJS application is the ThreeJS editor
 * I have always respected it; sadly not enough to build my applications around a similar stucture
 */

window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    e.returnValue = '';
});

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

import metadata from "./modules/metadata.js";
import { tooltip, tooltipAlert } from './modules/tooltip.js';
import { settings, defaults, readSettings, saveSettings, setDefaultSettings, clearSettings, validateSettings, mergeConfig } from "./settings.js";
import { ldrawColors, picker, setColor, getColor, updatecolorelement } from "./color.js";
import { filter_objects_peices, clone_mesh_clean, makeid, capture, isDark, getCookie } from './modules/objectutils.js';
import { ModelExports } from './modules/exportcreation.js';
import { stateHistoryManager } from './modules/statehistory.js';
import { search_display_partui } from './modules/displayparts.js';
import { SceneGraph } from './modules/scenegraph.js';
import { grid_lines, imagePlane, planeTexture, GridClass, snapToGrid } from './modules/grid.js';
import { UserAuth } from './modules/userauth.js';

let THREE_LD = { OrbitControls: OrbitControls, TransformControls: TransformControls, LDrawLoader: LDrawLoader, GLTFExporter: GLTFExporter, OBJExporter: OBJExporter, HDRLoader: HDRLoader, RGBELoader: HDRLoader, OBJExporter, OBJExporter };
let THREE = { ...THREE_NS, ...THREE_LD }

window.metadata = metadata, window.settings = settings, window.defaults = defaults;

// globals
let container = null, stats = null, animationFrameId = null, camera = null, scene = null, renderer = null, controls = null, transformControls = null, directional_lighting = null, ambient_lighting = null, ldraw_loader = null, loading_manager = null, mouse = null, raycaster = null, partMat = null, partMatrixWorld = null, partRotation = null, partPosition = null, selectedObject = null, multiSelectedObject = null, selectionGroup = null, selectedMap = null, selectedExport = null;

let start_url = null, gh_base_url = null, DEFAULT_TITLE = null, show_import_animation = true, ldraw_path = null, ldraw_icon_path = null, blockGroups = [];
window.version = null, window.scenegraph = null, window.currentUser = null, window.debug = false;

//settings.js is supposed to do this but whatever #okay
let appConfig = window.metadata ?? {};

window.version = appConfig.version;
window.debug = appConfig.debug;
start_url = appConfig.urls.start;
gh_base_url = appConfig.urls.gh_base;
ldraw_path = appConfig.ldraw.parts_path;
ldraw_icon_path = appConfig.ldraw.icon_path;
DEFAULT_TITLE = `Modeler - ${appConfig.name}`;

window.CURRENT_APP = 'modeler';
console.info('Gr8brik ' + window.version);

// debug only
start_url = 'http://localhost:3000';

// user login functions
window._UserAuth = new UserAuth(start_url);
await _UserAuth.login();
_UserAuth.getWarnStatus();
window.currentUser = _UserAuth.currentUserObj;

let displayed_parts = [];
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
    let fetch_str;
    let custom = false;
    let dp = new search_display_partui(ldraw_icon_path);

    if (cached_parts[type]) {
        console.log(`${type} parts loaded from cache`);
        displayed_parts = cached_parts[type];
        dp.displayParts(displayed_parts, true);
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
            if(!custom) {
                cached_parts[type] = data;
            }
            dp.displayParts(displayed_parts, true, custom);
        })
        .catch(err => {
            console.error(err);
        });
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

    for (let i = 0; i < items.length; i++) {
        let item = items[i];

        let title_txt = (item.name || "").toLowerCase();
        let num = (item.file || "").toLowerCase();
        let match = queryTokens.every(token => title_txt.includes(token) || num.includes(token));

        if (match) {
            matchedItems.push(item);
        }
    }

    let dp = new search_display_partui(ldraw_icon_path);
    dp.displayParts(matchedItems, true);
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

    let partJson = {
        "id": selectedPart,
        "ldraw": selectedPart,
        'materials': [
            {
                'id': selectedPart,
                'colorcode': getColor(),
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
            selector.selectObject(obj);
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
        if (!_UserAuth.is_logged_in()) {
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
        const screenshot = capture(scene, camera, THREE);

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
                } catch {
                    tooltip("An unknown error occurred.");
                }

                console.log(err);
                this.innerText = "Save Creation";
            });
    } else {
        tooltip('Problem while generating scene');
    }
});

//login
document.getElementById("login-complete").addEventListener("click", function () {
    const _UserAuth = new UserAuth();

    if (_UserAuth.is_logged_in()) {
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
                document.querySelector("#login-popup").style.display = 'none';
                _UserAuth.login();
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
    let cloud = new fromCloud();

    if (checkbox.checked) {
        open_creation = true;
    }

    document.getElementById("import-popup").style.display = 'none';

    switch (format) {
        case "cloud":
            cloud.get_user_creations(open_creation);
            break;
        case "cloud2":
            let model_id = document.getElementById('import-url').value.split('/').pop();
            loadJSONFromCloud(model_id, open_creation);
            break;
        case "three":
            document.getElementById("cre-import-three").click();
            break;
        case "json":
            document.getElementById("cre-import").click();
            break;
        case "oldjson":
            document.getElementById("cre-import-legacy").click();
            break;
        case "gr8z":
            document.getElementById("cre-import-gr8z").click();
            break;
        case "ldr":
            document.getElementById("cre-import-ldr").click();
            break;
        default:
            tooltip('Invalid import option')
            break;
    }
});

// export model
document.getElementById("export-finish").addEventListener("click", function () {
    if (!_UserAuth.is_logged_in()) {
        alert('Not authenticated');
        return;
    }

    if (multiSelectedObject) {
        selector.clearSelection();
    }

    const format = document.getElementById("export-format").value;
    const jszip = new JSZip();
    selectedExport = document.getElementById("export-format").value;
    let exportclass = new ModelExports(scene, start_url, THREE, jszip, camera);

    switch (selectedExport) {
        case "three":
            exportclass.threeJson();
            break;
        case "json":
            exportclass.gr8brikItselfYeahBitch(true);
            break;
        case "gr8":
            exportclass.gr8brikItselfYeahBitch(false);
            break;
        case "gr8z":
            exportclass.zippedGr8();
            break;
        case "lxf":
            exportclass.lxf();
            break;
        case "mpd":
            exportclass.mpd("creation");
            break;
        case "glb":
            exportclass.glb();
            break;
        case "obj":
            exportclass.obj();
            break;
        default:
            tooltip('Invalid import option')
            break;
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
    let url = capture(scene, camera, THREE);
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

document.getElementById("cre-import-legacy").addEventListener("change", function (event) {
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
            loadLegacyJSON(jsonData);
        } catch (err) {
            tooltip("Invalid legacy JSON file.");
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

        let modelLegacy = data.legacy;
        tooltip('Importing creation "' + data.name + '"');

        try {
            fetch(start_url + `/ajax/creationFile`, {
                credentials: "include",
                method: "POST",
                body: JSON.stringify({'iwantthejsonbruh': true, 'creID': model, 'viewer': null}),
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
        } catch(error) {
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
            let creation = zip.file("creation.gr8").async("string") ?? zip.file("creation.json").async("string");

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
    let modal = new importModal();

    reader.onprogress = function (xhr) {
        if (show_import_animation === true && xhr.lengthComputable) {
            modal.show();
            let progress = (xhr.loaded / xhr.total) * 100;
            document.getElementById('ui-loading-file-percentile').textContent = `${progress}%`;
        }
    };

    reader.onload = function (e) {
        try {
            if (show_import_animation === true) {
                let loading_manager_ldr = new THREE.LoadingManager();

                loading_manager_ldr.onProgress = function(url, loaded, total) {
                    let progress = Math.round((loaded / total) * 100);
                    document.getElementById('ui-loading-file-percentile').textContent = `Asset ${loaded} / ${total} - ${progress}%`;
                }

                ldraw_loader.manager = loading_manager_ldr;
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
                    const mat = mesh ? (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) : null;

                    const partJson = {
                        id: part.userData.fileName,
                        ldraw: part.userData.fileName,
                        materials: [{
                            id: 0,
                            opacity: 1.0,
                            colorcode: mat?.userData?.code ?? 16,
                            textureID: null,
                        }],
                        matrixw: {}
                    };

                    let pmanager = new PartManager();
                    pmanager.addPartMaterials(part, partJson, partJson.materials, null, true);
                }

                document.title = filename + ' - ' + appConfig.title;
                modal.hide();
            });
        } catch (err) {
            console.error("parsing error: " + err);
            tooltip("An error happened while importing");
            modal.hide();
        }

        event.target.value = "";
    };

    reader.readAsText(file);
});

class importModal {
    show() {
        document.getElementById('scene').classList.add('hidden');
        document.getElementById('ui-loading-file').classList.add('show');
        document.getElementById('ui-loading-file-percentile').textContent = '0%';
    }

    hide() {
        document.getElementById('ui-loading-file-percentile').textContent = null;
        document.getElementById('scene').classList.remove('hidden');
        document.getElementById('ui-loading-file').classList.remove('show');

        ldraw_loader.manager = loading_manager; //reset manager
    }
}

async function loadSceneFromJSON(data, show_import_animation = true) {
    if (!data || !data.blocks || !Array.isArray(data.blocks)) {
        console.error("Invalid JSON data.");
        tooltip("Invalid JSON.");
        return;
    }

    let modal = new importModal();

    if (show_import_animation === true) {
        modal.show();
        let loading_manager_ldr = new THREE.LoadingManager();

        loading_manager_ldr.onProgress = function(url, loaded, total) {
            let progress = Math.round((loaded / total) * 100);
            document.getElementById('ui-loading-file-percentile').textContent = `Asset ${loaded} / ${total} - ${progress}%`;
        }

        ldraw_loader.manager = loading_manager_ldr;
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
        partPosition = block.position;
        partRotation = block.rotation;
        partMatrixWorld = null;
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
    document.title = modelName + ' - ' + appConfig.title;

    if (show_import_animation === true) {
        console.info("Creation imported.");
        tooltip("Creation imported.");
        modal.hide();
    }
    updateSceneData();
}
window.loadSceneFromJSON = loadSceneFromJSON;

async function loadLegacyJSON(data) {
    if (!data) {
        console.error("Invalid legacy JSON data.");
        tooltip("Invalid JSON.");
        return;
    }

    let modal = new importModal();
    if (show_import_animation === true) {
        modal.show();
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
        partPosition = block?.intersect?.point;
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
    document.title = modelName + ' - ' + appConfig.title;

    if (show_import_animation === true) {
        console.log("Creation imported, and converted.");
        tooltip("Creation imported, and converted.");
        modal.hide();
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


function ui_toggles(settings) {
    // transparent ui
    if (settings.ui_trans) {
        applyTransparent(settings.ui_trans);
        document.getElementById("trans-enable").setAttribute('checked', 'true');
    } else {
        document.getElementById("trans-enable").setAttribute('checked', 'false');
    }

    // hdri
    if (settings.use_hdri) {
        applyHdri(settings.use_hdri, settings.hdri_background);
        document.getElementById("hdr-enable").setAttribute('checked', 'true');
        document.getElementById("hdr-background-enable").checked = settings.hdri_background;
    } else {
        document.getElementById("hdr-enable").setAttribute('checked', 'false');
        document.getElementById("hdr-background-enable").setAttribute('checked', 'false');
    }

    // webgpu
    if (settings.use_webgpu) {
        document.getElementById("gpu-enable").checked = true;
    } else {
        document.getElementById("gpu-enable").checked = false;
    }

    // darkmode
    if (isDark()) {
        document.body.classList.add("dark");
        document.getElementById("darkmode-enable").setAttribute('checked', 'true');
    } else {
        if (document.body.classList.contains("dark")) {
            document.body.classList.remove("dark");
            document.getElementById("darkmode-enable").setAttribute('checked', 'false');
        }
    }

    // lines
    if (settings.displayLines) {
        document.getElementById("display-lines-enable").checked = true;
    } else {
        document.getElementById("display-lines-enable").checked = false;
    }

    if (settings.export_full_scene) {
        document.getElementById("export-fullscene-enable").checked = true;
    } else {
        document.getElementById("export-fullscene-enable").checked = false;
    }

    if (settings.noSnap) {
        document.getElementById("snapping-enable").checked = false;
    } else {
        document.getElementById("snapping-enable").checked = true;
    }
}

function init() {
    if (window.settings) {
        mergeConfig(window.settings, window.defaults);
    }

    // Scene container
    if (!scene) {
        container = document.createElement('div');
        container.id = 'scene';
        container.classList.add("scene");
        document.body.appendChild(container);
    }

    // Scene
    if (!scene) {
        scene = new THREE.Scene();
        window.scene = scene;
        window.scenegraph = new SceneGraph(scene, ldrawColors, ldraw_icon_path);

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

    ui_toggles(scene.userData);

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

    let grid_class = new GridClass(THREE);
    grid_class.create();

    // please read ldrawloader docs before changing these values

    const loading_manager = new THREE.LoadingManager();

    loading_manager.onProgress = (url, loaded, total) => {
        let progress = Math.round((loaded / total) * 100);
        console.log(`Loading ${url.split('/').pop()} from ${url.split('/')[2]}, ${loaded} / ${total} files (${progress}%).`);
    }

    loading_manager.onLoad = function() {
        console.log('finished');
    }

    ldraw_loader = new THREE.LDrawLoader(loading_manager);
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
                        statehistory.saveState(generateSceneJSON());
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
                case 'KeyZ':
                    event.preventDefault();
                    window.statehistory.undo();
                    break
                case 'KeyY':
                    event.preventDefault();
                    window.statehistory.redo();
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
        statehistory.saveState(generateSceneJSON());
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

        let grid = new GridClass(THREE);
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

    document.title = appConfig.title;

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

    let grid_class = new GridClass(THREE);
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

        document.body.classList.add("dark");
        document.getElementById("darkmode-enable").setAttribute('checked', 'true');
    } else {
        document.cookie = "mode=light; max-age=315360000; path=/";

        if (document.body.classList.contains("dark")) {
            document.body.classList.remove("dark");
            document.getElementById("darkmode-enable").setAttribute('checked', 'false');
        }
    }

    scene.updateMatrixWorld(true);
    saveSettings();
});

document.querySelector('[data-testid=selected-hdri]').addEventListener("change", function () {
    window.settings.hdri_background = true;
    window.settings.hdris.selected = this.value;
    applyHdri(true, true);
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
        hdr_url = selectedHdr ? selectedHdr.url : hdris[0].url;

        rgbe_loader.load(hdr_url, function (texture) {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.environment = texture;

            if (background && !scene.userData.flatcamera) {
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

window.statehistory = new stateHistoryManager(scene, camera);

function update_selected_map(obj) {
    const select = document.querySelector('#map-selector');
    select.replaceChildren(); 

    let targetIdx;
    let mats = [];
    let namemap = new Map(ldrawColors.map(c => [String(c.code), c.name]));

    if(!obj) return;

    obj.traverse((child) => {
        if (child.isMesh && child.material && child.userData && child.userData?.ldraw) {

            if (child.userData.main_mat_name !== undefined) {
                targetIdx = child.userData.main_mat_index;
            } else {
                targetIdx = 0;
            }

            if(Array.isArray(child.material)) {
                child.material.forEach(mat => {
                    mats.push(mat);
                });
            } else {
                mats.push(child.material);
            }

            mats.forEach(mat => {
                let colorcode = mat?.userData?.colorcode ?? 15;
                let colorname = `${mats.indexOf(mat)} - ${namemap.get(colorcode) || mat.name}`;
                let option = new Option(colorname, mats.indexOf(mat));

                if (mats.indexOf(mat) === targetIdx) {
                    option.selected = true;
                }

                select.add(option);
            });
        }
    });
}

document.querySelector('#map-selector').addEventListener("change", function () {
    selectedMap = document.querySelector('#map-selector').value;
});

function changeBlockColor(color) {
    if (!selectionGroup) {
        tooltip("No part selected");
        return;
    }

    let pmanager = new PartManager();

    selectionGroup.traverse((child) => {
        if (child.isMesh && child.material && child.userData && child.userData?.ldraw) {
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
                    let material = pmanager.createMaterial(color);

                    child.material[targetIdx] = material;
                    pmanager.loadDecal(child.userData.textureObj, child, false);

                    child.traverse((o) => {
                        if (o.isLineSegments && o.material && !Array.isArray(o.material) && o.material?.color) {
                            o.material.color.set(material.userData.edgecolor); 
                        } else if(o.isLineSegments && o.material && Array.isArray(o.material)) {
                            o.material.forEach(mat => {
                                if(mat?.color) {
                                    mat.color.set(material.userData.edgecolor);
                                }
                            });
                        }
                    });
                }

                document.querySelector('#selected-map').value = targetIdx;
                selectedMap = null;

                //single material
            } else if (child.material.color) {
                let material = pmanager.createMaterial(color);

                child.traverse((o) => {
                    if (o.isLineSegments && o.material) {
                        o.material.color.set(material.userData.edgecolor); 
                    }
                });

                child.material = material;
                pmanager.loadDecal(child.userData.textureObj, child, false);
            }
            update_selected_map(child);
        }
    });

    updateSceneData();
    updatecolorelement();
    statehistory.saveState(generateSceneJSON());

    let namemap = new Map(ldrawColors.map(c => [String(c.code), c.name]));
    let colorname = namemap.get(color) || color;

    tooltip(`Part color changed to ${colorname}`);
}
window.changeBlockColor = changeBlockColor;

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

        let grid_class_e = new GridClass(THREE);
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

    scene.updateMatrixWorld(true);
    updateSceneData();
    statehistory.saveState(generateSceneJSON());
}

class fromCloud {
    SERVER_CODES = {
        'NO_LOGIN': 'Please sign in to continue',
        'QUERY_NO_CREATIONS': 'No creations found',
        'ACC_NO_CREATIONS': 'You don\'t have any creations yet',
        'CREATION_404': 'Creation not found',
        'EDIT_GENERIC': 'Failed to update creation',
    };

    get_user_creations(open_model = true, page = 1) {
        if(!_UserAuth.is_logged_in()) {
            tooltip('Please login to import models from your account');
            return;
        }

        const you = _UserAuth.get_current_user().username ?? 'you';
        const popup = document.getElementById('user-creations-popup');
        const container = document.getElementById('user-creations-wrapper');
        const nextbutton = document.getElementById('user-creations-foward-button');
        const template = document.getElementById('gr8-creation-template');

        fetch(start_url + `/acc/creations?my_creations=true&page=${page}`, {
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

            if(data.success && data.creations) {
                data.creations.forEach(function(r) {
                    const clone = template.content.cloneNode(true);

                    clone.querySelector('.creation-card').setAttribute('data-id', r.model_id);
                    clone.querySelector('.creation-card').setAttribute('data-doopen', open_model);
                    clone.querySelector('.creation-title').innerHTML = r.title;
                    clone.querySelector('.meta-author .user').innerHTML = you ?? 'you';
                    clone.querySelector('.meta-author .date').innerHTML = r.date;
                    clone.querySelector('.creation-thumbnail').setAttribute('src', start_url + r.thumb);

                    clone.querySelector('.views').append(r.views + ' views');
                    clone.querySelector('.favs').append(r.likes + ' favorites');
                    clone.querySelector('.size').append(r.size);
                    clone.querySelector('.comments').append(r.comments + ' comments');

                    container.appendChild(clone);
                });

                let nextpage = page + 1;

                popup.style.display = 'block';
                nextbutton.setAttribute('data-doopen', open_model);
                nextbutton.setAttribute('data-nextpage', nextpage);
            } else if (data.code) {
                tooltip(this.SERVER_CODES[response.code] || 'An error has occured');
                return;
            } else {
                nextbutton.remove();
            }
        });
    };
}

document.getElementById('user-creations-wrapper').addEventListener('click', function(event) {
    let item = event.target.closest('.creation-card');

    if (item) {
        let model_id = item.getAttribute('data-id');
        let do_open = item.getAttribute('data-doopen');

        if (model_id) {
            loadJSONFromCloud(model_id, do_open);

            //cleans up the listed creations
            let elms = document.querySelector("#user-creations-wrapper").querySelectorAll(':not(template)');
            elms.forEach(e => { e.remove(); });

            document.querySelector("#user-creations-popup").style.display = "none";

            return;
        }
    }

    return false;
});

document.getElementById('user-creations-foward-button').addEventListener('click', function(event) {
    let cloud = new fromCloud();
    let btn = document.getElementById('user-creations-foward-button');

    let open_model = btn.getAttribute('data-doopen');
    let page = parseInt(btn.getAttribute('data-nextpage'));

    if(page && open_model) {
        cloud.get_user_creations(open_model, page);
    }

    return;
});

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
            texture.colorSpace = THREE.SRGBColorSpace;
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
            polygonOffsetFactor: -2,
            frustumCulled: false
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

        if(!_UserAuth.is_logged_in()) {
            tooltip('Login to save custom parts');
            return;
        }

        const decal = this.activeDecalMesh;
        const texture = this.activeTexture;
        decal.material = decal.material.clone();
        const obj = this.selectedObject;
        const textureImg = texture.image;

        let obj_color = null;
        if(obj?.material && Array.isArray(obj.material)) {
            let main_mat_index = obj?.userData?.main_mat_index || 1;
            obj_color = obj.material[main_mat_index].userData.colorcode || 4;
        } else if(obj?.material && obj?.material?.userData && obj?.material?.userData?.colorcode) {
            obj_color = obj.material.userData.colorcode || 4;
        } else {
            obj_color = 4;
        }

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
            color: obj_color ?? 15,
            texture: {
                url: b64_str,
                thumbnail: this.capture(obj),
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
            obj.userData.textureID = upload.id;
            obj.userData.textureObj = decalData;

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

    capture(obj) {
        let thumb = new THREE.Scene();
        thumb.background = null;
        let count = 0;

        if (obj?.isMesh && obj?.userData.ldraw && !obj?.isTransformControls) {
            let cloned = obj.clone();
            if (cloned) {
                thumb.add(cloned);

                let box = new THREE.Box3().setFromObject(cloned);
                let center = new THREE.Vector3();
                let size = new THREE.Vector3();

                box.getCenter(center);
                box.getSize(size);

                cloned.position.sub(center);
                cloned.rotation.setFromQuaternion(cloned.quaternion);

                let radius = box.getBoundingSphere(new THREE.Sphere()).radius;
                this.targetCameraDistance = radius * 2.5;

                count++;
            }
        }

        if (count === 0) {
            console.warn("Scene is empty");
            return null;
        }

        let distance = this.targetCameraDistance || 256;
        let capture_height = 256;
        let capture_width = 256;

        let light2 = new THREE.DirectionalLight(0xffffff, 2);
        light2.position.set(distance, distance, distance);
        thumb.add(light2);

        let ambient2 = new THREE.AmbientLight(0xdddddd, 1);
        thumb.add(ambient2);

        let camera2 = new THREE.PerspectiveCamera(45, capture_width / capture_height, 0.1, 10000);
        camera2.position.set(distance * 0.7, distance * 0.7, distance * 0.7); 
        camera2.lookAt(0, 0, 0); 
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
    async addPart(partJson, partSpan, originalPSImg, throwSuccess, throwError) {
        if (!ldraw_loader) {
            return;
        }

        let part = partJson.ldraw;
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

        let text = await this.getpart(part);

        ldraw_loader.parse(text, function (loadedGroup) {
            loadedGroup.userData.fileName = part;

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
        blockGroup.ldraw = partJson.ldraw;

        let display_lines = scene.userData.displayLines;

        group.traverse((child) => {
            if (child.isLineSegments && child.parent.isGroup) {
                child.userData.ldr_line = true;
                child.userData.parentLdraw = child.parent.userData.fileName;

                if (display_lines != true) {
                    child.visible = false;
                }

                return;
            }

            if (child.isMesh && !child.material.map && !child.isLineSegments && !Array.isArray(child.material)) {
                const geometry = child.geometry;

                if (!geometry.attributes.uv) {
                    partUVGen(geometry);
                }

                if (!Array.isArray(partMat)) {
                    let custommaterial = this.createLegacyMaterial(partMat);
                    if (custommaterial) {
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
                        if (custommaterial) {
                            child.material = custommaterial;
                            child.material.userData.colorcode = color;

                            child.traverse((o) => {
                                if (o.isLineSegments && o.material) {
                                    o.material.color.set(custommaterial.userData.edgecolor); 
                                }
                            });
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
                        var index = child.material.map(function (mmap) { return mmap.uuid; }).indexOf(mat.uuid);

                        child.material[index] = mat.clone();
                        child.material[index].needsUpdate = true;

                        mat.name = child.material[index].name + '_' + makeid(5);

                        if (mat.name.includes("Main_Colour")) {
                            child.userData.main_mat_uuid = mat.uuid;
                            child.userData.main_mat_name = mat.name;
                            child.userData.main_mat_index = index;
                        }

                        if (partMat) {
                            if (Array.isArray(partMat)) {
                                let match = partMat.find(m => m.id === index);

                                if (match?.colorcode) {
                                    let new_material = this.createMaterial(String(match.colorcode));

                                    if(new_material) {
                                        this.assignMat(child, new_material, index);
                                    } else {
                                        let new_material = this.createMaterial('15');
                                        this.assignMat(child, new_material, index);
                                    }
                                } else {
                                    if(child.userData.main_mat_index) {
                                        let new_material = this.createMaterial('15');
                                        this.assignMat(child, new_material, child.userData.main_mat_index);
                                    }
                                }
                            }
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

            child.userData.id = child.uuid;
            child.userData.original_mat = child.material;
        });

        let lines = [];
        let line_parts = [];

        group.traverse((o) => {
            if (o.userData && o.material) {
                if (o.userData.ldr_line && o.userData.parentLdraw) {
                    lines.push(o);
                }

                if (o.userData.ldraw) {
                    line_parts.push(o);
                }
            }
        });

        line_parts.forEach(part => {
            lines.forEach(l => {
                if (l.userData.parentLdraw === part.userData.ldraw) {
                    part.add(l);
                }
            });
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

        blockGroup.userData.partName = group.userData.fileName;
        scene.add(blockGroup);

        blockGroups.push(blockGroup);
        selector.selectObject(blockGroup);

        let grid = new GridClass(THREE);
        grid.update(blockGroup);

        updatecolorelement();
        updateSceneData();
        statehistory.saveState(generateSceneJSON());
    }

    assignMat(child, new_material, index) {
        Object.assign(child.material[index], new_material);
        child.material[index].userData.colorcode = partMat?.colorcode;

        child.traverse((o) => {
            if (o.isLineSegments && o.material && !Array.isArray(o.material) && o.material?.color) {
                o.material.color.set(custommaterial.userData.edgecolor); 
            } else if(o.isLineSegments && o.material && Array.isArray(o.material)) {
                o.material.forEach(mat => {
                    if(mat?.color) {
                        mat.color.set(custommaterial.userData.edgecolor);
                    }
                });
            }
        });
    }

    loadDecal(decal, obj, recolor = true) {
        const textureLoader = new THREE.TextureLoader();

        if(!decal?.part) {
            return;
        }

        if(!decal?.part?.texture) {
            return;
        }

        if(!decal?.part?.color) {
            return;
        }

        if(!decal?.part?.texture?.url) {
            return;
        }

        if(!decal?.part?.matrix?.local) {
            return;
        }

        if(!decal?.part?.matrix?.size) {
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
                polygonOffsetFactor: -2,
                frustumCulled: false
            });

            const decal_mesh = new THREE.Mesh(geometry, material);

            if(recolor === true) {
                let obj_color = String(decal.part.color);
                if(obj?.material && Array.isArray(obj.material)) {
                    let main_mat_index = obj?.userData?.main_mat_index || 1;
                    obj.material = this.createMaterial(obj_color);
                    obj.material[main_mat_index].userData.colorcode = obj_color;
                } else if(obj?.material && obj?.material?.userData && obj?.material?.userData?.colorcode) {
                    obj.material = this.createMaterial(obj_color);
                    obj.material.userData.colorcode = obj_color;
                }
            }

            obj.userData.isTexture = true;
            obj.userData.textureObj = decal;
            obj.userData.textureID = decal.id;
            obj.attach(decal_mesh);
        });
    }

    cachepart(name, text) {
        try {
            localStorage.setItem(`part_${name}`, text);
            return;
        } catch (error) {
            console.error(error);
            return;
        }
    }

    async getpart(name) {
        let part = localStorage.getItem(`part_${name}`);

        if (part !== null) {
            return part;
        } else {
            let fileLoader = new THREE.FileLoader();
            try {
                let text = await fileLoader.loadAsync(`${ldraw_path}actual/parts/${name}`);
                this.cachepart(name, text);
                return text;
            } catch (error) {
                console.error("Failed to load part file:", error);
                return null;
            }
        }
    }

    createMaterial(partColor) {
        const colorMap = new Map(ldrawColors.map(c => [String(c.code), c]));
        const colorMatch = colorMap.get(partColor);

        const materialType = colorMatch?.type || 'solid';
        const materialColor = colorMatch?.hex || '#ffffff';
        const materialEdge = colorMatch?.edge || '#000000';

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
        material.userData.edgecolor = materialEdge;
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
    window.scenegraph.updategraph();
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
    window.scenegraph.updategraph();
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

    scene.traverse(function (child) {
        if (child.isMesh && !child.isLineSegments && child.userData && !child.userData.ldr_line && child.userData.isBlock && child.userData.ldraw) {
            const mesh_child = child;
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
            let mesh_color;
            let mesh_opacity;
            let mat_opacity;
            let mesh_texture;
            let mesh_texturedata;

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
                        textureID: mesh_child.userData.textureID || null,
                        textureObj: mesh_child.userData.textureObj?.part || null,
                        opacity: mat_opacity,
                    }
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
                    mesh_texturedata = mesh_child.userData.textureData;
                }

                const materialData = {
                    id: mesh_child.userData.id || mesh_child.uuid,
                    name: mesh_child.material.name,
                    obj: mesh_child.userData.id || mesh_child.uuid,
                    colorcode: mesh_child.material.userData.colorcode || 0,
                    textureID: mesh_child.userData.textureID || null,
                    textureObj: mesh_child.userData.textureObj?.part || null,
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
        }
    });

    return JSON.stringify(sceneData);
}
window.generateSceneJSON = generateSceneJSON;

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

    window.scenegraph.updatescene(scene);
    window.scenegraph.updategraph();
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

    let grid_class = new GridClass(THREE);
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
    window.scenegraph.updategraph();
}
window.wipe_scene = wipe_scene;

//cleans matrixes to save file output size
function clean_matrix(elm, precision = 4) {
  return elm.map(val => {
    let round = parseFloat(val.toFixed(precision));
    return round === -0 ? 0 : round;
  });
}

//complex selection logic
multiSelectedObject = new Set();
selectionGroup = new THREE.Group();
scene.add(selectionGroup);

window.multiSelectedObject = multiSelectedObject;
window.selectionGroup = selectionGroup;

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
                        if (child.material.userData && child.material.userData.colorcode) {
                            setColor(child.material.userData.colorcode);
                        }

                        child.material.needsUpdate = true;
                    }
                }
            });
        });

        transformControls.attach(selectionGroup);
        selectedObject = selectionGroup;

        updateSceneData();
        updatecolorelement();
        update_selected_map(selectionGroup);
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
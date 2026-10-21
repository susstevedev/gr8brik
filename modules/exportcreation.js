import { filter_objects_peices, capture } from "./objectutils.js";

class ModelExports {
    constructor(scene, start_url, three, zip, camera) {
        if(!scene) {
            return;
        }

        if(!three) {
            return;
        }

        this.scene = scene;
        this.THREE = three;
        this.zip = zip;
        this.URL = start_url;
        this.camera = camera;
    }

    gr8brikItselfYeahBitch(json = false) {
        let data = generateSceneJSON();
        let blob = new Blob([data], { type: "application/json" });

        let url = URL.createObjectURL(blob);
        let date = new Date();
        let a = document.createElement("a");

        a.href = url;

        if(json) {
            a.download = `gr8brik-creation-${date}.json`;
        } else {
            a.download = `gr8brik-creation-${date}.gr8`;
        }

        a.click();

        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 10000);
    }

    zippedGr8() {
        let data = generateSceneJSON();
        let screenshot = capture(this.scene, this.camera, this.THREE);
        let zip = this.zip;

        let file_options = {compression: "DEFLATE",compressionOptions: { level: 9 }};
        let zip_options = { type: "blob", compression: "DEFLATE", compressionOptions: { level: 9 }, comment: `Zipped ${this.URL} creation` };

        zip.file("creation.gr8", data, file_options);
        zip.file("thumb.webp", screenshot, file_options);

        zip.generateAsync(zip_options).then(function (blob) {
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
    }

    lxf() {
        let data = this.generateSceneLXFML(this.THREE);
        let zip = this.zip;
        zip.file("IMAGE100.LXFML", data);

        zip.generateAsync({ type: "blob" }).then(function (blob) {
            let url = URL.createObjectURL(blob);
            let date = new Date();
            let a = document.createElement("a");
            a.href = url;
            a.download = `ldd-creation-${date}.lxf`;
            a.click();

            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 10000);
        });
    }

    threeJson() {
        let fileData = JSON.stringify(scene.toJSON());
        let zip = this.zip;

        zip.file(`scene.json`, fileData, {compression: "DEFLATE",compressionOptions: { level: 9 }});

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
    }

    glb() {
        let exporter = new this.THREE.GLTFExporter();
        let date = new Date();
        let scene_ = this.scene;
        let thumb = new this.THREE.Scene();

        if (scene.userData.export_full_scene === false) {
            scene_ = filter_objects_peices(scene_, thumb, this.THREE);
        }

        exporter.parse(
            scene_,
            function (result) {
                let blob = new Blob([result], { type: 'model/gltf-binary' });
                let url = URL.createObjectURL(blob);
                let a = document.createElement('a');

                a.href = url;
                a.download = `creation-${date}.glb`;
                a.click();

                setTimeout(() => URL.revokeObjectURL(url), 10000);
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

    obj() {
        let exporter = new this.THREE.OBJExporter();
        let date = new Date();

        let thumb = new this.THREE.Scene();
        let scene = this.scene;

        let result = exporter.parse(filter_objects_peices(scene, thumb, this.THREE));

        let blob = new Blob([result], { type: 'text/plain' });
        let url = URL.createObjectURL(blob);
        let a = document.createElement('a');

        a.href = url;
        a.download = `obj-mtl-${date}.obj`;
        a.click();

        setTimeout(() => URL.revokeObjectURL(url), 10000);
    }

    mpd(name) {
        const lines = [];
        let userName = 'user';

        if(window.currentUser && window.currentUser?.username) {
            userName = '@' + window.currentUser.username;
        }

        lines.push(`0 FILE ${name}.ldr`);
        lines.push(`0 ${name}`);
        lines.push(`0 Name: ${name}.ldr`);
        lines.push(`0 Author: ${userName} on Gr8Brik`);
        lines.push(`0 !LDRAW_ORG Model`);
        lines.push(`0 !LICENSE Redistributable under CCAL version 2.0`);
        lines.push(`0`);

        this.scene.updateMatrixWorld(true);
        this.scene.rotation.x += Math.PI;
        this.scene.traverse(child => {
            if (!child.isMesh || !child.userData.ldraw) {
                return;
            }

            let color_code = 16;
            if (child.material && !Array.isArray(child.material)) {
                if (child.material?.userData?.colorcode) {
                    color_code = child.material.userData.colorcode;
                }
            } else if(child.material && Array.isArray(child.material)) {
                if(child.userData && child.material.userData && child.userData.main_mat_index) {
                    let id = child.userData.main_mat_index;

                    if (child.material.userData[id]?.userData?.colorcode) {
                        color_code = child.material.userData[id].userData.colorcode;
                    }
                }
            }

            let partName = child.userData.ldraw.replace("parts/", "");

            let pos = new this.THREE.Vector3();
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
        this.scene.rotation.x -= Math.PI;

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

    //life support please just export as ldraw
    generateSceneLXFML(THREE) {
        function LXFMLMatrix(matrix4, THREE) {
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

        let sceneBricks = '';
        let boneRefs = [];
        let refID = 0;
        let totalPosition = new THREE.Vector3();
        let count = 0;

        const ldd_colors = [{ "ldraw": "15", "lego": "1" }, { "ldraw": "7", "lego": "2" }, { "ldraw": "18", "lego": "3" }, { "ldraw": "12", "lego": "4" }, { "ldraw": "19", "lego": "5" }, { "ldraw": "17", "lego": "6" }, { "ldraw": "13", "lego": "9" }, { "ldraw": "313", "lego": "11" }, { "ldraw": "450", "lego": "12" }, { "ldraw": "92", "lego": "18" }, { "ldraw": "79", "lego": "20" }, { "ldraw": "4", "lego": "21" }, { "ldraw": "351", "lego": "22" }, { "ldraw": "1", "lego": "23" }, { "ldraw": "14", "lego": "24" }, { "ldraw": "6", "lego": "25" }, { "ldraw": "0", "lego": "26" }, { "ldraw": "8", "lego": "27" }, { "ldraw": "2", "lego": "28" }, { "ldraw": "74", "lego": "29" }, { "ldraw": "68", "lego": "36" }, { "ldraw": "10", "lego": "37" }, { "ldraw": "484", "lego": "38" }, { "ldraw": "20", "lego": "39" }, { "ldraw": "47", "lego": "40" }, { "ldraw": "36", "lego": "41" }, { "ldraw": "43", "lego": "42" }, { "ldraw": "33", "lego": "43" }, { "ldraw": "46", "lego": "44" }, { "ldraw": "9", "lego": "45" }, { "ldraw": "38", "lego": "47" }, { "ldraw": "34", "lego": "48" }, { "ldraw": "42", "lego": "49" }, { "ldraw": "294", "lego": "50" }, { "ldraw": "100", "lego": "100" }, { "ldraw": "73", "lego": "102" }, { "ldraw": "503", "lego": "103" }, { "ldraw": "22", "lego": "104" }, { "ldraw": "462", "lego": "105" }, { "ldraw": "25", "lego": "106" }, { "ldraw": "3", "lego": "107" }, { "ldraw": "110", "lego": "110" }, { "ldraw": "40", "lego": "111" }, { "ldraw": "112", "lego": "112" }, { "ldraw": "37", "lego": "113" }, { "ldraw": "114", "lego": "114" }, { "ldraw": "115", "lego": "115" }, { "ldraw": "11", "lego": "116" }, { "ldraw": "117", "lego": "117" }, { "ldraw": "118", "lego": "118" }, { "ldraw": "27", "lego": "119" }, { "ldraw": "120", "lego": "120" }, { "ldraw": "26", "lego": "124" }, { "ldraw": "125", "lego": "125" }, { "ldraw": "52", "lego": "126" }, { "ldraw": "142", "lego": "127" }, { "ldraw": "129", "lego": "129" }, { "ldraw": "179", "lego": "131" }, { "ldraw": "133", "lego": "132" }, { "ldraw": "379", "lego": "135" }, { "ldraw": "373", "lego": "136" }, { "ldraw": "28", "lego": "138" }, { "ldraw": "134", "lego": "139" }, { "ldraw": "272", "lego": "140" }, { "ldraw": "288", "lego": "141" }, { "ldraw": "41", "lego": "143" }, { "ldraw": "143", "lego": "143" }, { "ldraw": "137", "lego": "145" }, { "ldraw": "178", "lego": "147" }, { "ldraw": "148", "lego": "148" }, { "ldraw": "150", "lego": "150" }, { "ldraw": "378", "lego": "151" }, { "ldraw": "335", "lego": "153" }, { "ldraw": "320", "lego": "154" }, { "ldraw": "54", "lego": "157" }, { "ldraw": "135", "lego": "179" }, { "ldraw": "57", "lego": "182" }, { "ldraw": "183", "lego": "183" }, { "ldraw": "191", "lego": "191" }, { "ldraw": "70", "lego": "192" }, { "ldraw": "71", "lego": "194" }, { "ldraw": "89", "lego": "195" }, { "ldraw": "23", "lego": "196" }, { "ldraw": "69", "lego": "198" }, { "ldraw": "72", "lego": "199" }, { "ldraw": "81", "lego": "200" }, { "ldraw": "151", "lego": "208" }, { "ldraw": "212", "lego": "212" }, { "ldraw": "216", "lego": "216" }, { "ldraw": "6", "lego": "217" }, { "ldraw": "5", "lego": "221" }, { "ldraw": "29", "lego": "222" }, { "ldraw": "77", "lego": "223" }, { "ldraw": "226", "lego": "226" }, { "ldraw": "39", "lego": "229" }, { "ldraw": "45", "lego": "230" }, { "ldraw": "232", "lego": "232" }, { "ldraw": "44", "lego": "236" }, { "ldraw": "85", "lego": "268" }, { "ldraw": "78", "lego": "283" }, { "ldraw": "21", "lego": "294" }, { "ldraw": "297", "lego": "297" }, { "ldraw": "80", "lego": "298" }, { "ldraw": "82", "lego": "299" }, { "ldraw": "117", "lego": "304" }, { "ldraw": "308", "lego": "308" }, { "ldraw": "26", "lego": "309" }, { "ldraw": "334", "lego": "310" }, { "ldraw": "35", "lego": "311" }, { "ldraw": "86", "lego": "312" }, { "ldraw": "87", "lego": "315" }, { "ldraw": "83", "lego": "316" }, { "ldraw": "321", "lego": "321" }, { "ldraw": "323", "lego": "323" }];

        let lddmap = new Map(ldd_colors.map(item => [item.ldraw, item.lego]));

        scene.traverse(function (child) {
            if (child.isMesh && !child.isLineSegments && child.userData && !child.userData.ldr_line && child.userData.isBlock && child.userData.ldraw) {
                totalPosition.add(child.position);
                count++;
            };
        });

        scene.traverse(function (mesh_child) {
            if (mesh_child.isMesh && !mesh_child.isLineSegments && mesh_child.userData && !mesh_child.userData.ldr_line && mesh_child.userData.isBlock && mesh_child.userData.ldraw) {
                let ldraw = mesh_child.userData.ldraw;
                ldraw = ldraw.replace("parts/", "").replace(".dat", "");

                let boneID = refID;
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
                        <Bone refID="${refID}" transformation="${LXFMLMatrix(adjustedMatrix, THREE)}"></Bone>
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
}

export { ModelExports };
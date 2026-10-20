const geometry_cache = new Map();

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

// does what it says
function clone_mesh_clean(obj, THREE) {
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

function filter_objects_peices(scene, thumb, THREE) {
    scene.traverse(function (object) {
        if (object.isMesh && (object.userData.isBlock || object.userData.isTexture)) {
            let hexColor;

            if (!Array.isArray(object.material)) {
                hexColor = object.material?.color || new THREE.Color(0xffffff);
            } else {
                hexColor = object.material[0]?.color || new THREE.Color(0xffffff);
            }

            let cloned = clone_mesh_clean(object, THREE);
            if (cloned) {
                thumb.add(cloned);
                cloned.rotation.setFromQuaternion(cloned.quaternion);
            }
        }
    });
    return thumb;
}

export { filter_objects_peices, clone_mesh_clean, makeid };
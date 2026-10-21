import { isDark } from './objectutils.js';

let grid_lines = null;
let imagePlane = null;
let planeTexture = null;

class GridClass {
    constructor(THREE) {
        this.MIN_STUDS = 16;
        this.GRID_STUD_X = this.MIN_STUDS;
        this.GRID_STUD_Z = this.MIN_STUDS;
        this.min_x = -(this.MIN_STUDS / 2);
        this.max_x = this.MIN_STUDS / 2;
        this.min_z = -(this.MIN_STUDS / 2);
        this.max_z = this.MIN_STUDS / 2;
        this.THREE = THREE;
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
            const textureLoader = new this.THREE.TextureLoader();

            planeTexture = textureLoader.load(texturepath);
            planeTexture.wrapS = this.THREE.RepeatWrapping;
            planeTexture.wrapT = this.THREE.RepeatWrapping;

            const planeGeometry = new this.THREE.PlaneGeometry(1, 1);

            const planeMaterial = new this.THREE.MeshBasicMaterial({
                map: planeTexture,
                transparent: true,
                side: this.THREE.DoubleSide
            });

            imagePlane = new this.THREE.Mesh(planeGeometry, planeMaterial);
            imagePlane.rotation.x = -Math.PI / 2;
            scene.add(imagePlane);
        }

        imagePlane.scale.set(sizeX, sizeZ, 1);
        imagePlane.position.x = (minX + maxX) * 20 / 2;
        imagePlane.position.z = (minZ + maxZ) * 20 / 2;
        planeTexture.repeat.set(studs_x, studs_z);

        if (planeTexture.source && planeTexture.source.data && !planeTexture.source.data.src.includes(texturepath)) {
            const textureLoader = new this.THREE.TextureLoader();

            planeTexture = textureLoader.load(texturepath);
            planeTexture.wrapS = this.THREE.RepeatWrapping;
            planeTexture.wrapT = this.THREE.RepeatWrapping;
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

        const geometry = new this.THREE.BufferGeometry();
        geometry.setAttribute('position', new this.THREE.Float32BufferAttribute(vertices, 3));

        const material = new this.THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.5
        });

        grid_lines = new this.THREE.LineSegments(geometry, material);
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

function snapToGrid(value, gridSize) {
    return Math.round(value / gridSize) * gridSize;
}

export { grid_lines, imagePlane, planeTexture, GridClass, snapToGrid };
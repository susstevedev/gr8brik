class SceneGraph {
    constructor(scene, colors, ldraw_icon_path) {
        this.ModelScene = scene;
        this.colors = colors;
        this.IconPath = ldraw_icon_path;
    }

    updatescene(scene) {
        this.ModelScene = scene;
    }

    valid(obj) {
        if (!obj) {
            return false;
        }

        const isPart = obj.isMesh && obj.userData?.isBlock && obj.userData?.ldraw;

        const isGroup = obj.userData?.isGroup;

        return isPart || isGroup;
    }

    getitems() {
        const roots = [];
        let scene = this.ModelScene;

        scene.children.forEach(child => {
            this.findtop(child, roots);
        });

        return roots;
    }

    findtop(node, roots) {
        if (!node) {
            return;
        }

        if (this.valid(node)) {
            roots.push(node);
            return;
        }

        if (node.children) {
            node.children.forEach(child => {
                this.findtop(child, roots);
            });
        }
    }

    getchildren(node) {
        const children = [];

        if (!node?.children) {
            return children;
        }

        node.children.forEach(child => {
            this.findtop(child, children);
        });

        return children;
    }

    updategraph() {
        const items = this.getitems();
        const blockList = document.getElementById('block-list');
        let partCount = 0;

        blockList.innerHTML = "";

        items.forEach(obj => {
            const item = this.render(obj);
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

    serialize(n) {
        if (!n || typeof n !== 'string') return;

        return n.replace(/^(parts\/)?|(?:_?\.(dat|ldr))$/gi, "")
    }

    render(obj) {
        const id = obj.uuid;
        const colormap = new Map(this.colors.map(c => [String(c.code), c.name]));
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
        let partIcon = `${this.IconPath}3001.png`;

        if (obj.userData?.isBlock && obj.userData?.ldraw) {
            part = this.serialize(obj.userData.ldraw || obj.parent?.userData?.ldraw || obj.parent?.userData?.fileName);

            partIcon = `${this.IconPath}${part}.png`;
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

        const validChildren = this.getchildren(obj);

        if (validChildren.length > 0) {
            const ul = document.createElement('ul');
            ul.classList.add('nested');

            validChildren.forEach(child => {
                const childLi = this.render(child);
                ul.appendChild(childLi);
            });

            li.appendChild(ul);
        }

        return li;
    }
}

export { SceneGraph };
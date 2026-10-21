class stateHistoryManager {
    constructor(scene, cam = null) {
        this.scene = scene;
        this.undoStack = [];
        this.redoStack = [];
        this.saveState();
        this.maxHistory = 30;
        this.camera = cam;
    }

    saveState(snapshot) {
        this.undoStack.push(snapshot);
        this.redoStack = [];

        if (this.undoStack.length > this.maxHistory) {
            this.undoStack.shift();
        }
    }

    undo() {
        if (this.undoStack.length === 0) {
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

    async loadState(jsonState) {
        if (multiSelectedObject || selectionGroup) {
            selector.clearSelection();
        }

        let par = this.scene;

        async function odelete(obj, par) {
            if (obj.isMesh && obj.userData && obj.userData.isBlock) {
                console.log(`${obj.userData.ldraw ?? obj.name}? ditto!`);

                par.remove(obj);

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
            }
        }

        par.traverse(async function (obj) {
            await odelete(obj, par);
        });

        selectionGroup.traverse(async function (obj) {
            await odelete(obj);
        });

        let state = JSON.parse(jsonState);
        window.loadSceneFromJSON(state, false);

        if(this.camera) {
            if(state.camera) {
                this.camera.position.set(state.camera.x, state.camera.y, state.camera.z);
            }
        }

        par.updateMatrixWorld();
    }
}

export { stateHistoryManager };
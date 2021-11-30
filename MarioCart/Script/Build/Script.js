"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
            }
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let graph;
    let viewport;
    let cart;
    let cmpMeshTerrain;
    let mtxTerrain;
    let meshTerrain;
    let camera = new ƒ.Node("cameraNode");
    let cmpCamera = new ƒ.ComponentCamera();
    let ctrForward = new ƒ.Control("Forward", 15, 0 /* PROPORTIONAL */);
    ctrForward.setDelay(700);
    let ctrTurn = new ƒ.Control("Turn", 100, 0 /* PROPORTIONAL */);
    ctrTurn.setDelay(200);
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        graph = ƒ.Project.resources["Graph|2021-11-18T14:33:55.349Z|10541"];
        viewport = _event.detail;
        cmpMeshTerrain = viewport.getBranch().getChildrenByName("Terrain")[0].getComponent(ƒ.ComponentMesh);
        meshTerrain = cmpMeshTerrain.mesh;
        mtxTerrain = cmpMeshTerrain.mtxWorld;
        cart = graph.getChildrenByName("Cart")[0];
        cmpCamera.mtxPivot.translation = new ƒ.Vector3(0, 6, -15);
        cmpCamera.mtxPivot.rotation = new ƒ.Vector3(25, 0, 0);
        camera.addComponent(cmpCamera);
        camera.addComponent(new ƒ.ComponentTransform());
        graph.addChild(camera);
        let canvas = document.querySelector("canvas");
        viewport.initialize("Viewport", graph, cmpCamera, canvas);
        viewport.calculateTransforms();
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.world.simulate();  // if physics is included and used
        camera.mtxLocal.translation = cart.mtxWorld.translation;
        camera.mtxLocal.rotation = new ƒ.Vector3(0, cart.mtxWorld.rotation.y, 0);
        let speedCartRotation = 1.8;
        let deltaTime = ƒ.Loop.timeFrameReal / 1000;
        let forward = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
        ctrForward.setInput(forward * deltaTime);
        cart.mtxLocal.translateZ(ctrForward.getOutput());
        let turn = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
        ctrTurn.setInput(turn * deltaTime * speedCartRotation);
        cart.mtxLocal.rotateY(ctrTurn.getOutput());
        let terrainInfo = meshTerrain.getTerrainInfo(cart.mtxLocal.translation, mtxTerrain);
        cart.mtxLocal.translation = terrainInfo.position;
        cart.mtxLocal.showTo(ƒ.Vector3.SUM(terrainInfo.position, cart.mtxLocal.getZ()), terrainInfo.normal);
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map
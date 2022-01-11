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
    let cartBody;
    let isGrounded;
    let dampTranslation;
    let dampRotation;
    let cmpMeshTerrain;
    let mtxTerrain;
    let meshTerrain;
    let camera = new ƒ.Node("cameraNode");
    let cmpCamera = new ƒ.ComponentCamera();
    let frictionMap;
    let frictionMultiplier;
    let ctx;
    let ctrForward = new ƒ.Control("Forward", 7000, 0 /* PROPORTIONAL */);
    ctrForward.setDelay(500);
    let ctrTurn = new ƒ.Control("Turn", 220, 0 /* PROPORTIONAL */);
    ctrTurn.setDelay(200);
    document.addEventListener("interactiveViewportStarted", start);
    async function start(_event) {
        graph = ƒ.Project.resources["Graph|2021-11-18T14:33:55.349Z|10541"];
        viewport = _event.detail;
        cmpMeshTerrain = viewport.getBranch().getChildrenByName("Terrain")[0].getComponent(ƒ.ComponentMesh);
        meshTerrain = cmpMeshTerrain.mesh;
        mtxTerrain = cmpMeshTerrain.mtxWorld;
        cart = graph.getChildrenByName("Cart")[0];
        cartBody = cart.getComponent(ƒ.ComponentRigidbody);
        dampTranslation = cartBody.dampTranslation;
        dampRotation = cartBody.dampRotation;
        frictionMap = new Image(1000, 1000);
        frictionMap.src = "../Image/frictionMap.png";
        let canvas = document.createElement('canvas');
        canvas.width = frictionMap.width;
        canvas.height = frictionMap.height;
        ctx = canvas.getContext('2d');
        ctx.drawImage(frictionMap, 0, 0);
        cameraTrackCart();
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        let maxHeight = 0.3;
        let minHeight = 0.2;
        let forceNodes = cart.getChildrenByName("Forces")[0].getChildren();
        let force = ƒ.Vector3.SCALE(ƒ.Physics.world.getGravity(), -cartBody.mass / forceNodes.length);
        isGrounded = false;
        for (let forceNode of forceNodes) {
            let posForce = forceNode.getComponent(ƒ.ComponentMesh).mtxWorld.translation;
            let terrainInfo = meshTerrain.getTerrainInfo(posForce, mtxTerrain);
            let height = posForce.y - terrainInfo.position.y;
            if (height < maxHeight) {
                cartBody.applyForceAtPoint(ƒ.Vector3.SCALE(force, (maxHeight - height) / (maxHeight - minHeight)), posForce);
                isGrounded = true;
            }
        }
        if (isGrounded) {
            cartBody.dampTranslation = dampTranslation;
            cartBody.dampRotation = dampRotation;
            let forward = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
            ctrForward.setInput(forward);
            cartBody.applyForce(ƒ.Vector3.SCALE(cart.mtxLocal.getZ(), ctrForward.getOutput() * frictionMultiplier));
            let turn = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
            ctrTurn.setInput(turn);
            cartBody.applyTorque(ƒ.Vector3.SCALE(cart.mtxLocal.getY(), ctrTurn.getOutput()));
        }
        else {
            cartBody.dampRotation = cartBody.dampTranslation = 0;
        }
        camera.mtxLocal.translation = cart.mtxWorld.translation;
        camera.mtxLocal.rotation = new ƒ.Vector3(0, cart.mtxWorld.rotation.y, 0);
        let terrainInfo = meshTerrain.getTerrainInfo(cart.mtxLocal.translation, mtxTerrain);
        cart.mtxLocal.translation = terrainInfo.position;
        cart.mtxLocal.showTo(ƒ.Vector3.SUM(terrainInfo.position, cart.mtxLocal.getZ()), terrainInfo.normal);
        terrainFriction();
        ƒ.Physics.world.simulate(); // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function terrainFriction() {
        let cartPosition = meshTerrain.getTerrainInfo(cart.mtxWorld.translation, mtxTerrain);
        let posX = Math.floor(cartPosition.position.x);
        let posY = Math.floor(cartPosition.position.z);
        let imageColorData = ctx.getImageData(posX, posY, 1, 1);
        if (imageColorData.data[0] < 128 && imageColorData.data[1] < 128 && imageColorData.data[2] < 128) {
            frictionMultiplier = 0.3;
        }
        else {
            frictionMultiplier = 1;
        }
    }
    function cameraTrackCart() {
        cmpCamera.mtxPivot.translation = new ƒ.Vector3(0, 10, -18);
        cmpCamera.mtxPivot.rotation = new ƒ.Vector3(22, 0, 0);
        camera.addComponent(cmpCamera);
        camera.addComponent(new ƒ.ComponentTransform());
        graph.addChild(camera);
        let canvas = document.querySelector("canvas");
        viewport.initialize("Viewport", graph, cmpCamera, canvas);
        viewport.calculateTransforms();
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map
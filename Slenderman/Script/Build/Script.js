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
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
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
                case "nodeDeserialized" /* NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Slenderman;
(function (Slenderman) {
    var ƒ = FudgeCore;
    let viewport;
    let root;
    let player;
    let playerCmpCam;
    let tree;
    let speedRot = 0.1;
    let rotationX = 0;
    let ctrWalk = new ƒ.Control("ctrWalk", 1.5, 0 /* PROPORTIONAL */);
    let ctrRun = new ƒ.Control("ctrRun", 3, 0 /* PROPORTIONAL */);
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        root = viewport.getBranch();
        player = root.getChildrenByName("Player")[0];
        initPlayerView();
        initTree();
        viewport.getCanvas().addEventListener("pointermove", hndPointerMove);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start();
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        controlWalk();
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function hndPointerMove(_event) {
        player.mtxLocal.rotateY(-_event.movementX * speedRot);
        rotationX += _event.movementY * speedRot;
        rotationX = Math.min(60, Math.max(-60, rotationX));
        playerCmpCam.mtxPivot.rotation = ƒ.Vector3.X(rotationX);
    }
    function controlWalk() {
        let inputForward = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
        ctrWalk.setInput(inputForward);
        player.mtxLocal.translateZ(ctrWalk.getOutput() * ƒ.Loop.timeFrameGame / 1000);
        let inputSideways = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_RIGHT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_LEFT]);
        ctrWalk.setInput(inputSideways);
        player.mtxLocal.translateX(ctrWalk.getOutput() * ƒ.Loop.timeFrameGame / 1000);
        let inputRun = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.SHIFT_LEFT], [ƒ.KEYBOARD_CODE.ALT_LEFT]);
        ctrRun.setInput(inputRun);
        player.mtxLocal.translateZ(ctrRun.getOutput() * ƒ.Loop.timeFrameGame / 1000);
    }
    function initPlayerView() {
        playerCmpCam = root.getChildrenByName("Player")[0].getChildrenByName("Camera")[0].getComponent(ƒ.ComponentCamera);
        viewport.camera = playerCmpCam; //Active viewport camera is player view
    }
    async function initTree() {
        let meshTree = new ƒ.MeshObj("TreeMesh", "Assets/tree/tree.obj");
        let cmpMesh = new ƒ.ComponentMesh(meshTree);
        let treeTex = new ƒ.TextureImage();
        await treeTex.load("Assets/tree/tree_texture.png");
        let matTree = new ƒ.Material("TreeMat", ƒ.ShaderGouraudTextured, new ƒ.CoatTextured(new ƒ.Color(), treeTex));
        let cmpMaterial = new ƒ.ComponentMaterial(matTree);
        tree.addComponent(cmpMesh);
        tree.addComponent(cmpMaterial);
        tree.addComponent(new ƒ.ComponentTransform());
        root.addChild(tree);
    }
})(Slenderman || (Slenderman = {}));
//# sourceMappingURL=Script.js.map
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
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);
    class InitGroundPositionScript extends ƒ.ComponentScript {
        static iSubclass = ƒ.Component.registerSubclass(InitGroundPositionScript);
        constructor() {
            super();
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.addComponent);
        }
        addComponent = () => {
            document.addEventListener("interactiveViewportStarted", this.initPositionToGround);
        };
        initPositionToGround = (_event) => {
            let root = ƒ.Project.resources["Graph|2022-04-12T15:10:16.404Z|44825"];
            let ground = root.getChildrenByName("Environment")[0].getChildrenByName("Ground")[0];
            let cmpMeshGround = ground.getComponent(ƒ.ComponentMesh);
            let meshGround = ground.getComponent(ƒ.ComponentMesh).mesh;
            let yDiff = meshGround.getTerrainInfo(this.node.mtxLocal.translation, cmpMeshGround.mtxWorld).distance;
            this.node.mtxLocal.translateY(-yDiff);
        };
    }
    Script.InitGroundPositionScript = InitGroundPositionScript;
})(Script || (Script = {}));
var Slenderman;
(function (Slenderman) {
    var ƒ = FudgeCore;
    let viewport;
    let root;
    let player;
    let playerCmpCam;
    let playerRigidBody;
    let trees;
    let rocks;
    let speedRot = 0.1;
    let rotationX = 0;
    let ctrWalk = new ƒ.Control("ctrWalk", 1.5, 0 /* PROPORTIONAL */, 250);
    document.addEventListener("interactiveViewportStarted", start);
    async function start(_event) {
        viewport = _event.detail;
        initVariables();
        initPlayerView();
        await addTrees();
        await addRocks();
        let canvas = viewport.getCanvas();
        canvas.addEventListener("pointermove", hndPointerMove);
        canvas.requestPointerLock();
        viewport.getCanvas().addEventListener("pointermove", hndPointerMove);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start();
    }
    function update(_event) {
        ƒ.Physics.simulate();
        controlWalk();
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function initVariables() {
        root = viewport.getBranch();
        player = root.getChildrenByName("Player")[0];
        playerRigidBody = player.getComponent(ƒ.ComponentRigidbody);
        playerRigidBody.effectRotation = new ƒ.Vector3(0, 0, 0);
        trees = root.getChildrenByName("Environment")[0].getChildrenByName("Trees")[0];
        rocks = root.getChildrenByName("Environment")[0].getChildrenByName("Rocks")[0];
    }
    function hndPointerMove(_event) {
        playerRigidBody.rotateBody(ƒ.Vector3.Y(-_event.movementX * speedRot));
        rotationX += _event.movementY * speedRot;
        rotationX = Math.min(60, Math.max(-60, rotationX));
        playerCmpCam.mtxPivot.rotation = ƒ.Vector3.X(rotationX);
    }
    function controlWalk() {
        let inputForward = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
        let inputSideways = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_RIGHT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_LEFT]);
        ctrWalk.setInput(inputForward);
        ctrWalk.setFactor(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT]) ? 5 : 2);
        let vecSideways = new ƒ.Vector3((1.5 * inputSideways * ƒ.Loop.timeFrameGame) / 20, 0, (ctrWalk.getOutput() * ƒ.Loop.timeFrameGame) / 20);
        vecSideways.transform(player.mtxLocal, false);
        playerRigidBody.setVelocity(vecSideways);
    }
    function initPlayerView() {
        playerCmpCam = root.getChildrenByName("Player")[0].getChildrenByName("Camera")[0].getComponent(ƒ.ComponentCamera);
        viewport.camera = playerCmpCam; //Active viewport camera is player view
    }
    async function addTrees() {
        for (let i = 0; i < 25; i++) {
            let treeInstance = await ƒ.Project.createGraphInstance(ƒ.Project.resources["Graph|2022-05-03T11:32:23.947Z|52682"]);
            let position = new ƒ.Vector3(randomInt(-28, 28), 0, randomInt(-28, 28));
            let treeHeight = new ƒ.Vector3(1, randomInt(0.9, 1.3), 1);
            treeInstance.mtxLocal.translateX(position.x);
            treeInstance.mtxLocal.translateZ(position.z);
            treeInstance.mtxLocal.scale(treeHeight);
            // treeInstance.addComponent(new InitGroundPositionScript);
            trees.addChild(treeInstance);
        }
    }
    async function addRocks() {
        for (let i = 0; i < 10; i++) {
            let rockInstance = await ƒ.Project.createGraphInstance(ƒ.Project.resources["Graph|2022-05-03T14:11:09.844Z|88150"]);
            let position = new ƒ.Vector3(randomInt(-28, 28), 0, randomInt(-28, 28));
            let rockScale = new ƒ.Vector3(randomInt(0.4, 1), randomInt(0.4, 1), randomInt(0.4, 1));
            let rockRotation = new ƒ.Vector3(randomInt(0, 5), randomInt(1, 180), randomInt(0, 5));
            rockInstance.mtxLocal.translateX(position.x);
            rockInstance.mtxLocal.translateZ(position.z);
            rockInstance.mtxLocal.scale(rockScale);
            rockInstance.mtxLocal.rotate(rockRotation);
            rocks.addChild(rockInstance);
        }
    }
    function randomInt(_min, _max) {
        let randomNumber = Math.random() * (_max - _min) + _min;
        return randomNumber;
    }
})(Slenderman || (Slenderman = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);
    class MovementOnGroundScript extends ƒ.ComponentScript {
        root;
        ground;
        cmpMeshTerrain;
        meshTerrain;
        rigidBody;
        static iSubclass = ƒ.Component.registerSubclass(MovementOnGroundScript);
        constructor() {
            super();
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.addComponent);
        }
        addComponent = () => {
            this.node.addEventListener("renderPrepare" /* RENDER_PREPARE */, this.setVerticalPos);
        };
        setVerticalPos = () => {
            if (!this.root) {
                this.root = ƒ.Project.resources["Graph|2022-04-12T15:10:16.404Z|44825"];
                this.ground = this.root.getChildrenByName("Environment")[0].getChildrenByName("Ground")[0];
                this.cmpMeshTerrain = this.ground.getComponent(ƒ.ComponentMesh);
                this.meshTerrain = this.cmpMeshTerrain.mesh;
            }
            if (!this.rigidBody)
                this.rigidBody = this.node.getComponent(ƒ.ComponentRigidbody);
            let distance = 0;
            if (this.rigidBody) {
                distance = this.meshTerrain.getTerrainInfo(this.rigidBody.getPosition(), this.cmpMeshTerrain.mtxWorld)?.distance;
            }
            else {
                distance = this.meshTerrain.getTerrainInfo(this.node.mtxLocal.translation, this.cmpMeshTerrain.mtxWorld)?.distance;
            }
            if (distance) {
                if (this.rigidBody) {
                    this.rigidBody.translateBody(new ƒ.Vector3(0, -distance, 0));
                }
                else {
                    this.node.mtxLocal.translateY(-distance);
                }
            }
        };
    }
    Script.MovementOnGroundScript = MovementOnGroundScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);
    class SlendermanMovementScript extends ƒ.ComponentScript {
        static iSubclass = ƒ.Component.registerSubclass(SlendermanMovementScript);
        timeToChange = 0;
        direction = new ƒ.Vector3();
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.addComponent);
        }
        addComponent = () => {
            this.node.addEventListener("renderPrepare" /* RENDER_PREPARE */, this.move);
        };
        move = () => {
            this.node.mtxLocal.translate(ƒ.Vector3.SCALE(this.direction, ƒ.Loop.timeFrameGame / 1000));
            if (this.timeToChange > ƒ.Time.game.get()) {
                return;
            }
            this.timeToChange = ƒ.Time.game.get() + 1000;
            this.direction = ƒ.Random.default.getVector3(new ƒ.Vector3(-1, 0, -1), new ƒ.Vector3(1, 0, 1));
        };
    }
    Script.SlendermanMovementScript = SlendermanMovementScript;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map
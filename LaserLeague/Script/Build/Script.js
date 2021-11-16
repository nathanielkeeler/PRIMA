"use strict";
var LaserLeague;
(function (LaserLeague) {
    var ƒ = FudgeCore;
    class Agent extends ƒ.Node {
        name = "Agent Smith";
        health = 1;
        constructor() {
            super("Agent");
            this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshPolygon("MeshAgent")));
            this.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("mtrAgent", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(0, 1, 0, 1)))));
            this.addComponent(new ƒ.ComponentTransform);
            // this.mtxLocal.scale(new ƒ.Vector3(0.2, 0.4, 0));
            this.getComponent(ƒ.ComponentMesh).mtxPivot.scale(new ƒ.Vector3(0.2, 0.3, 0));
        }
    }
    LaserLeague.Agent = Agent;
})(LaserLeague || (LaserLeague = {}));
var LaserLeague;
(function (LaserLeague) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(LaserLeague); // Register the namespace to FUDGE for serialization
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
    LaserLeague.CustomComponentScript = CustomComponentScript;
})(LaserLeague || (LaserLeague = {}));
var LaserLeague;
(function (LaserLeague) {
    var ƒ = FudgeCore;
    var ƒui = FudgeUserInterface;
    class GameState extends ƒ.Mutable {
        static controller;
        static instance;
        name = "LaserLeague";
        health = 1;
        constructor() {
            super();
            let domHud = document.querySelector("#Hud");
            GameState.instance = this;
            GameState.controller = new ƒui.Controller(this, domHud);
            console.log("Hud-Controller", GameState.controller);
        }
        static get() {
            return GameState.instance || new GameState();
        }
        reduceMutator(_mutator) { }
    }
    LaserLeague.GameState = GameState;
})(LaserLeague || (LaserLeague = {}));
var LaserLeague;
(function (LaserLeague) {
    LaserLeague.ƒ = FudgeCore;
    LaserLeague.ƒui = FudgeUserInterface;
    LaserLeague.ƒ.Debug.info("Welcome to LaserLeague!");
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    //----- Variables -----
    let fps = 144;
    let graph;
    let agent;
    let lasers;
    let ctrForward = new LaserLeague.ƒ.Control("Forward", 1, 0 /* PROPORTIONAL */);
    ctrForward.setDelay(100);
    let ctrRotation = new LaserLeague.ƒ.Control("Rotation", 1, 0 /* PROPORTIONAL */);
    ctrRotation.setDelay(80);
    async function start(_event) {
        viewport = _event.detail;
        graph = viewport.getBranch();
        lasers = graph.getChildrenByName("Lasers")[0];
        agent = new LaserLeague.Agent();
        graph.getChildrenByName("Agents")[0].addChild(agent);
        viewport.getCanvas().addEventListener("mousedown", hndClick);
        graph.addEventListener("agentEvent", hndAgentEvent);
        viewport.camera.mtxPivot.translateZ(-15);
        let graphLaser = FudgeCore.Project.resources["Graph|2021-11-04T13:43:21.788Z|72482"];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 2; j++) {
                let laser = await LaserLeague.ƒ.Project.createGraphInstance(graphLaser);
                laser.addEventListener("graphEvent", hndGraphEvent, true);
                lasers.addChild(laser);
                laser.mtxLocal.translateX(-5 + i * 5);
                laser.mtxLocal.translateY(-2.5 + j * 5);
                if (i % 2 == 0)
                    laser.getComponent(LaserLeague.LaserRotator).speedLaserRotation *= -1;
            }
        }
        LaserLeague.ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        LaserLeague.ƒ.Loop.start(LaserLeague.ƒ.LOOP_MODE.TIME_REAL, fps); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.world.simulate();  // if physics is included and used
        let deltaTime = LaserLeague.ƒ.Loop.timeFrameReal / 1000;
        let speedAgentTranslation = 4; // meters per second
        let speedAgentRotation = 360; // meters per second
        //----- Controlls -----
        let ctrForwardValue = (LaserLeague.ƒ.Keyboard.mapToValue(-1, 0, [LaserLeague.ƒ.KEYBOARD_CODE.S, LaserLeague.ƒ.KEYBOARD_CODE.ARROW_DOWN])
            + LaserLeague.ƒ.Keyboard.mapToValue(1, 0, [LaserLeague.ƒ.KEYBOARD_CODE.W, LaserLeague.ƒ.KEYBOARD_CODE.ARROW_UP]));
        ctrForward.setInput(ctrForwardValue * deltaTime * speedAgentTranslation);
        agent.mtxLocal.translateY(ctrForward.getOutput());
        let ctrRotationValue = (LaserLeague.ƒ.Keyboard.mapToValue(-1, 0, [LaserLeague.ƒ.KEYBOARD_CODE.D, LaserLeague.ƒ.KEYBOARD_CODE.ARROW_RIGHT])
            + LaserLeague.ƒ.Keyboard.mapToValue(1, 0, [LaserLeague.ƒ.KEYBOARD_CODE.A, LaserLeague.ƒ.KEYBOARD_CODE.ARROW_LEFT]));
        ctrRotation.setInput(ctrRotationValue * deltaTime * speedAgentRotation);
        agent.mtxLocal.rotateZ(ctrRotation.getOutput());
        //------------------
        viewport.draw();
        agent.getComponent(LaserLeague.ƒ.ComponentMaterial).clrPrimary.a = 1;
        for (let laser of lasers.getChildren()) {
            if (laser.getComponent(LaserLeague.LaserRotator).checkCollision(agent.mtxWorld.translation, 0.25)) {
                agent.getComponent(LaserLeague.ƒ.ComponentMaterial).clrPrimary.a = 0.5;
                break;
            }
        }
        LaserLeague.ƒ.AudioManager.default.update();
        LaserLeague.GameState.get().health -= 0.01;
    }
    function hndClick(_event) {
        console.log("mousedown event");
        agent.dispatchEvent(new CustomEvent("agentEvent", { bubbles: true }));
    }
    function hndAgentEvent(_event) {
        console.log("Agent event received by", _event.currentTarget);
        _event.currentTarget.broadcastEvent(new CustomEvent("graphEvent"));
    }
    function hndGraphEvent(_event) {
        console.log("Graph event received", _event.currentTarget);
    }
})(LaserLeague || (LaserLeague = {}));
var LaserLeague;
(function (LaserLeague) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(LaserLeague); // Register the namespace to FUDGE for serialization
    class LaserRotator extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(LaserRotator);
        // Properties may be mutated by users in the editor via the automatically created user interface
        speedLaserRotation = 90; // rotation per millisecond in degrees
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
                    ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
            }
        };
        update = (_event) => {
            this.node.mtxLocal.rotateZ(this.speedLaserRotation * ƒ.Loop.timeFrameGame / 1000);
        };
        checkCollision(_pos, _radius) {
            let beams = this.node.getChildrenByName("Laserbeam");
            let mtxMeshPivot = beams[0].getComponent(ƒ.ComponentMesh).mtxPivot;
            for (let beam of beams) {
                let posLocal = ƒ.Vector3.TRANSFORMATION(_pos, beam.mtxWorldInverse, true);
                if (posLocal.y < -_radius || posLocal.y > mtxMeshPivot.scaling.y + _radius || posLocal.x < -mtxMeshPivot.scaling.x / 2 - _radius || posLocal.x > mtxMeshPivot.scaling.x / 2 + _radius)
                    continue;
                return true;
            }
            return false;
        }
    }
    LaserLeague.LaserRotator = LaserRotator;
})(LaserLeague || (LaserLeague = {}));
//# sourceMappingURL=Script.js.map
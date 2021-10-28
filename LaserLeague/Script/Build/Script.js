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
    ƒ.Debug.info("Welcome to LaserLeague!");
    //----- Variables -----
    let fps = 144;
    let viewport;
    let root;
    let agent;
    let agentoriginalpos;
    let laser;
    let laserCopy;
    let ctrVertical = new ƒ.Control("Forward", 1, 0 /* PROPORTIONAL */);
    ctrVertical.setDelay(100);
    let ctrRotation = new ƒ.Control("Rotation", 1, 0 /* PROPORTIONAL */);
    ctrRotation.setDelay(80);
    document.addEventListener("interactiveViewportStarted", start);
    async function start(_event) {
        viewport = _event.detail;
        // Load Graph and its Nodes for access
        root = viewport.getBranch();
        agent = root.getChildrenByName("Agents")[0].getChildrenByName("Agent")[0]; // picks out the first single agent node
        agentoriginalpos = agent.getComponent(ƒ.ComponentTransform); // gets starting position of agent
        laser = root.getChildrenByName("Lasers")[0].getChildrenByName("Laser")[0]; // picks out the first single laser node
        // Camera
        viewport.camera.mtxPivot.translateZ(-15);
        // Add another laser as graph
        let graphLaser = await ƒ.Project.registerAsGraph(laser, false);
        laserCopy = await ƒ.Project.createGraphInstance(graphLaser);
        root.getChildrenByName("Lasers")[0].addChild(laserCopy);
        // laserCopy.addComponent(new ƒ.ComponentTransform);
        laserCopy.mtxLocal.translateX(8);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, fps); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.world.simulate();  // if physics is included and used
        let deltaTime = ƒ.Loop.timeFrameReal / 1000;
        let speedAgentTranslation = 5; // meters per second
        let speedAgentRotation = 400; // meters per second
        //----- Controlls -----
        let ctrVerticalValue = (ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])
            + ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]));
        ctrVertical.setInput(ctrVerticalValue * deltaTime * speedAgentTranslation);
        agent.mtxLocal.translateY(ctrVertical.getOutput());
        let ctrRotationValue = (ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])
            + ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]));
        ctrRotation.setInput(ctrRotationValue * deltaTime * speedAgentRotation);
        agent.mtxLocal.rotateZ(ctrRotation.getOutput());
        //------------------
        // collision check for agents and laserbeams
        for (let components of laser) {
            let beams = components.getChildrenByName("Laserbeams");
            beams.forEach(beam => {
                checkCollision(agent, beam);
            });
        }
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function checkCollision(collider, obstacle) {
        let distance = ƒ.Vector3.TRANSFORMATION(collider.mtxWorld.translation, obstacle.mtxWorldInverse, true);
        let minX = obstacle.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x / 2 + collider.radius;
        let minY = obstacle.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.y + collider.radius;
        if (distance.x <= (minX) && distance.x >= -(minX) && distance.y <= minY && distance.y >= 0) {
            console.log("Collision detected!");
            agent.getComponent(ƒ.ComponentTransform).mutate(agentoriginalpos);
        }
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class LaserRotator extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(LaserRotator);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "LaserRotator added to Node";
        speedLaserRotation = 90;
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
                    this.start();
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
            }
        };
        start() {
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        update = (_event) => {
            let deltaTime = ƒ.Loop.timeFrameReal / 1000;
            this.node.mtxLocal.rotateZ(this.speedLaserRotation * deltaTime);
        };
    }
    Script.LaserRotator = LaserRotator;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map
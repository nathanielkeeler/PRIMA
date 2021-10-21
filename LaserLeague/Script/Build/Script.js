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
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    //----- Variables -----
    let transform;
    let agent;
    let ctrVertical = new ƒ.Control("Forward", 1, 0 /* PROPORTIONAL */);
    ctrVertical.setDelay(100);
    let ctrRotation = new ƒ.Control("Rotation", 1, 0 /* PROPORTIONAL */);
    ctrRotation.setDelay(80);
    function start(_event) {
        viewport = _event.detail;
        let graph = viewport.getBranch();
        let laser = graph.getChildrenByName("Lasers")[0].getChildrenByName("Laser")[0];
        transform = laser.getComponent(ƒ.ComponentTransform).mtxLocal;
        agent = graph.getChildrenByName("Agents")[0].getChildrenByName("Agent")[0];
        //Camera
        viewport.camera.mtxPivot.translateZ(-15);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 120); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.world.simulate();  // if physics is included and used
        let deltaTime = ƒ.Loop.timeFrameReal / 1000;
        let speedLaserRotate = 60; // degrees per second
        let speedAgentTranslation = 5; // meters per second
        let speedAgentRotation = 350; // meters per second
        // Controlls
        let ctrVerticalValue = (ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])
            + ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]));
        ctrVertical.setInput(ctrVerticalValue * deltaTime * speedAgentTranslation);
        agent.mtxLocal.translateY(ctrVertical.getOutput());
        let ctrRotationValue = (ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])
            + ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]));
        ctrRotation.setInput(ctrRotationValue * deltaTime * speedAgentRotation);
        agent.mtxLocal.rotateZ(ctrRotation.getOutput());
        //------------------
        transform.rotateZ(speedLaserRotate * deltaTime);
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map
namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  //----- Variables -----
  let transform: ƒ.Matrix4x4;
  let agent: ƒ.Node;

  let ctrVertical: ƒ.Control = new ƒ.Control("Forward", 1, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrVertical.setDelay(100);
  let ctrRotation: ƒ.Control = new ƒ.Control("Rotation", 1, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrRotation.setDelay(80);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    let graph: ƒ.Node = viewport.getBranch();
    let laser: ƒ.Node = graph.getChildrenByName("Lasers")[0].getChildrenByName("Laser")[0];
    transform = laser.getComponent(ƒ.ComponentTransform).mtxLocal;
    agent = graph.getChildrenByName("Agents")[0].getChildrenByName("Agent")[0];

    //Camera
    viewport.camera.mtxPivot.translateZ(-15);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 120);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.world.simulate();  // if physics is included and used

    let deltaTime: number =ƒ.Loop.timeFrameReal / 1000;
    let speedLaserRotate: number = 60; // degrees per second
    let speedAgentTranslation: number = 5; // meters per second
    let speedAgentRotation: number = 350; // meters per second
    
    // Controlls
    let ctrVerticalValue: number = (
      ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])
      + ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])
    );
    ctrVertical.setInput(ctrVerticalValue * deltaTime * speedAgentTranslation);
    agent.mtxLocal.translateY(ctrVertical.getOutput());

    let ctrRotationValue: number = (
      ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])
      + ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])
    );
    ctrRotation.setInput(ctrRotationValue * deltaTime * speedAgentRotation);
    agent.mtxLocal.rotateZ(ctrRotation.getOutput());
    //------------------

    transform.rotateZ(speedLaserRotate * deltaTime);

    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}
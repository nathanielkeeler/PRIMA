namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  //----- Variables -----
  let agent: ƒ.Node;
  let laser: ƒ.Node;
  let transform: ƒ.Matrix4x4;
  let ctrVertical: ƒ.Control = new ƒ.Control("Forward", 1, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrVertical.setDelay(100);
  let ctrRotation: ƒ.Control = new ƒ.Control("Rotation", 1, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrRotation.setDelay(80);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    let graph: ƒ.Node = viewport.getBranch();
    agent = graph.getChildrenByName("Agents")[0].getChildrenByName("Agent")[0];
    laser = graph.getChildrenByName("Lasers")[0].getChildrenByName("Laser")[0];
    transform = laser.getComponent(ƒ.ComponentTransform).mtxLocal;

    //Camera
    viewport.camera.mtxPivot.translateZ(-15);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 120);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.world.simulate();  // if physics is included and used

    let deltaTime: number =ƒ.Loop.timeFrameReal / 1000;
    let speedLaserRotation: number = 60; // degrees per second
    let speedAgentTranslation: number = 5; // meters per second
    let speedAgentRotation: number = 400; // meters per second
    
    //----- Controlls -----
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

    //transform.rotateZ(speedLaserRotation * deltaTime);

    viewport.draw();

    checkCollision();


    ƒ.AudioManager.default.update();
  }

  function checkCollision(): void {
    // Loop through all laser nodes and their beams
    // Check if posLocal x value are >1 or <-1
    // Alert User
    let beam: ƒ.Node = laser.getChildren()[0];
    let posLocal: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(agent.mtxWorld.translation, beam.mtxWorldInverse, true);
    console.log(posLocal.toString());
  }
}
namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  let transform: ƒ.Matrix4x4;
  let agent: ƒ.Node;

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

    let speedLaserRotate: number = 60; // degrees per second
    let deltaTime: number =ƒ.Loop.timeFrameReal / 1000;

    let speedAgentTranslation: number = 5; // meters per second
    let speedAgentRotation: number = 400; // meters per second

    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.W])){
      agent.mtxLocal.translateY(speedAgentTranslation * deltaTime);
    }
    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_DOWN, ƒ.KEYBOARD_CODE.S])){
      agent.mtxLocal.translateY(-speedAgentTranslation * deltaTime);
    }
    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])){
      agent.mtxLocal.rotateZ(speedAgentRotation * deltaTime);
    }
    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D])){
      agent.mtxLocal.rotateZ(-speedAgentRotation * deltaTime);
    }

    transform.rotateZ(speedLaserRotate * deltaTime);

    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}
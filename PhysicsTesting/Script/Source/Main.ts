namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let body: ƒ.ComponentRigidbody;

  let ctrForward: ƒ.Control = new ƒ.Control("Forward", 6, ƒ.CONTROL_TYPE.PROPORTIONAL);
  let ctrTurn: ƒ.Control = new ƒ.Control("Turn", 1, ƒ.CONTROL_TYPE.PROPORTIONAL);

  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    let graph: ƒ.Graph = <ƒ.Graph>viewport.getBranch();
    body = graph.getChildrenByName("Cube")[0].getComponent(ƒ.ComponentRigidbody);

    viewport.camera.mtxPivot.translateZ(-80);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {

    let forward: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
    ctrForward.setInput(forward);
    body.applyForce(ƒ.Vector3.SCALE(body.node.mtxLocal.getZ(), ctrForward.getOutput()));

    let turn: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
    ctrTurn.setInput(turn);
    body.applyTorque(ƒ.Vector3.SCALE(ƒ.Vector3.Y(), ctrTurn.getOutput()));

    ƒ.Physics.world.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}
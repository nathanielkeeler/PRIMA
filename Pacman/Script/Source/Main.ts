namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let graph: ƒ.Node;
  let pacman: ƒ.Node;
  let pacmanSpeed: number = 2;

  let ctrXY: ƒ.Control = new ƒ.Control("Forward", 1, ƒ.CONTROL_TYPE.PROPORTIONAL);

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    viewport.camera.mtxPivot.translateZ(-10);

    graph = viewport.getBranch();
    pacman = graph.getChildrenByName("Pacman")[0];

    console.log();

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();

    let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;

    let ctrXValue: number = (
      ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])
      + ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])
    );
    ctrXY.setInput(ctrXValue * deltaTime * pacmanSpeed);
    pacman.mtxLocal.translateX(ctrXY.getOutput());

    let ctrYValue: number = (
      ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])
      + ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])
    );
    ctrXY.setInput(ctrYValue * deltaTime * pacmanSpeed);
    pacman.mtxLocal.translateY(ctrXY.getOutput());


    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}
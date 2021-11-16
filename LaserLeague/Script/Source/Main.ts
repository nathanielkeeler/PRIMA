namespace LaserLeague {
  export import ƒ = FudgeCore;
  export import ƒui = FudgeUserInterface;

  ƒ.Debug.info("Welcome to LaserLeague!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);

  //----- Variables -----
  let fps: number = 144;
  let graph: ƒ.Node;
  let agent: any;
  let lasers: ƒ.Node;
  let ctrForward: ƒ.Control = new ƒ.Control("Forward", 1, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrForward.setDelay(100);
  let ctrRotation: ƒ.Control = new ƒ.Control("Rotation", 1, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrRotation.setDelay(80);

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;

    graph = viewport.getBranch();

    lasers = graph.getChildrenByName("Lasers")[0];
    agent = new Agent();
    graph.getChildrenByName("Agents")[0].addChild(agent);

    viewport.getCanvas().addEventListener("mousedown", hndClick);
    graph.addEventListener("agentEvent", hndAgentEvent);
    viewport.camera.mtxPivot.translateZ(-15);

    let graphLaser: ƒ.Graph = <ƒ.Graph>FudgeCore.Project.resources["Graph|2021-11-04T13:43:21.788Z|72482"];

    for (let i: number = 0; i < 3; i++) {
      for (let j: number = 0; j < 2; j++) {
        let laser = await ƒ.Project.createGraphInstance(graphLaser);
        laser.addEventListener("graphEvent", hndGraphEvent, true);
        lasers.addChild(laser);
        laser.mtxLocal.translateX(-5 + i * 5);
        laser.mtxLocal.translateY(-2.5 + j * 5);
        if (i % 2 == 0)
          laser.getComponent(LaserRotator).speedLaserRotation *= -1;
      }
    }

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, fps);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.world.simulate();  // if physics is included and used

    let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;
    let speedAgentTranslation: number = 4; // meters per second
    let speedAgentRotation: number = 360; // meters per second

    //----- Controlls -----
    let ctrForwardValue: number = (
      ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])
      + ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])
    );
    ctrForward.setInput(ctrForwardValue * deltaTime * speedAgentTranslation);
    agent.mtxLocal.translateY(ctrForward.getOutput());

    let ctrRotationValue: number = (
      ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])
      + ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])
    );
    ctrRotation.setInput(ctrRotationValue * deltaTime * speedAgentRotation);
    agent.mtxLocal.rotateZ(ctrRotation.getOutput());
    //------------------

    viewport.draw();

    agent.getComponent(ƒ.ComponentMaterial).clrPrimary.a = 1;
    for (let laser of lasers.getChildren()) {
      if (laser.getComponent(LaserRotator).checkCollision(agent.mtxWorld.translation, 0.25)) {
        agent.getComponent(ƒ.ComponentMaterial).clrPrimary.a = 0.5;
        break;
      }
    }

    ƒ.AudioManager.default.update();

    GameState.get().health -= 0.01;
  }

  function hndClick(_event: MouseEvent): void {
    console.log("mousedown event");
    agent.dispatchEvent(new CustomEvent("agentEvent", { bubbles: true }));
  }
  function hndAgentEvent(_event: Event): void {
    console.log("Agent event received by", _event.currentTarget);
    (<ƒ.Node>_event.currentTarget).broadcastEvent(new CustomEvent("graphEvent"));
  }
  function hndGraphEvent(_event: Event): void {
    console.log("Graph event received", _event.currentTarget);
  }
}
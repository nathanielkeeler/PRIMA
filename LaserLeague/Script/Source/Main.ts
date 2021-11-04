namespace LaserLeague {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Welcome to LaserLeague!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);

  //----- Variables -----
  let fps: number = 144;
  let root: ƒ.Node;

  let agent: ƒ.Node;

  let laser: ƒ.Node;

  let ctrForward: ƒ.Control = new ƒ.Control("Forward", 1, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrForward.setDelay(100);
  let ctrRotation: ƒ.Control = new ƒ.Control("Rotation", 1, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrRotation.setDelay(80);

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;
    
    root = viewport.getBranch();
    
    agent = new Agent();
    root.getChildrenByName("Agents")[0].addChild(agent);
    
    for (let i: number = 0; i < 3; i++) {
      for (let j: number = 0; j < 2; j++) {
        let graphLaser: ƒ.Graph = <ƒ.Graph>FudgeCore.Project.resources["Graph|2021-11-04T13:43:21.788Z|72482"];
        let laserCopy = await ƒ.Project.createGraphInstance(graphLaser);
        root.getChildrenByName("Lasers")[0].addChild(laserCopy);
        laserCopy.mtxLocal.translateX(-5 + i * 5);
        laserCopy.mtxLocal.translateY(-2.5 + j * 5);
        if (j >= 1)
          laserCopy.getComponent(LaserRotator).speedLaserRotation *= -1;
      }
    }

    laser = root.getChildrenByName("Lasers")[0].getChildrenByName("Laser")[0]; // picks out the first single laser node
    
    viewport.camera.mtxPivot.translateZ(-15);
    
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

    // collision check for agents and laserbeams
    let beams: ƒ.Node[] = laser.getChildrenByName("Laserbeam");
    beams.forEach(beam => {
      checkCollision(agent,beam);
    });
  
    viewport.draw();

    ƒ.AudioManager.default.update();
  }

  function checkCollision(collider: ƒ.Node, obstacle: ƒ.Node) {
    let distance: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(collider.mtxWorld.translation, obstacle.mtxWorldInverse, true);
    let minX = obstacle.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x / 2 + collider.radius;
    let minY = obstacle.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.y + collider.radius;
    if (distance.x <= (minX) && distance.x >= -(minX) && distance.y <= minY && distance.y >= 0) {
      console.log("Collision detected!");
    }
  }
}
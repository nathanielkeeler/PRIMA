namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Welcome to LaserLeague!");
  
  //----- Variables -----
  let fps: number = 60;
  let viewport: ƒ.Viewport;
  let transform: ƒ.Matrix4x4;
  let agent: ƒ.Node;
  let laser: ƒ.Node;
  let laserCopy: ƒ.GraphInstance;

  let ctrVertical: ƒ.Control = new ƒ.Control("Forward", 1, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrVertical.setDelay(100);
  let ctrRotation: ƒ.Control = new ƒ.Control("Rotation", 1, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrRotation.setDelay(80);
  
  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;
    
    // Load Graph and its Nodes for access
    let root: ƒ.Node = viewport.getBranch();
    agent = root.getChildrenByName("Agents")[0].getChildrenByName("Agent")[0]; // picks out the first single agent node
    laser = root.getChildrenByName("Lasers")[0].getChildrenByName("Laser")[0]; // picks out the first single laser node
    transform = laser.getComponent(ƒ.ComponentTransform).mtxLocal;
    
    // Camera
    viewport.camera.mtxPivot.translateZ(-15);
    
    // Add another laser as graph
    let graphLaser: ƒ.Graph = await ƒ.Project.registerAsGraph(laser, false);
    laserCopy = await ƒ.Project.createGraphInstance(graphLaser);
    root.getChildrenByName("Lasers")[0].addChild(laserCopy);
    // laserCopy.addComponent(new ƒ.ComponentTransform);
    laserCopy.mtxLocal.translateX(5);
    
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, fps);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.world.simulate();  // if physics is included and used

    let deltaTime: number =ƒ.Loop.timeFrameReal / 1000;
    let speedAgentTranslation: number = 5; // meters per second
    let speedAgentRotation: number = 400; // meters per second
    let speedLaserRotation: number = 60; // degrees per second
    
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

    transform.rotateZ(speedLaserRotation * deltaTime);

    viewport.draw();

    checkCollision();

    ƒ.AudioManager.default.update();
  }

  function checkCollision(): void {
    // Loop through all laser nodes and their beams
    // Check if posLocal x value are >1 or <-1
    // Alert User

    // let posLocal: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(agent.mtxWorld.translation, beams.mtxWorldInverse, true);
    // console.log(posLocal.toString());
  }
}
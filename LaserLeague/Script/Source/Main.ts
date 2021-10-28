namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Welcome to LaserLeague!");

  //----- Variables -----
  let fps: number = 144;
  let viewport: ƒ.Viewport;
  let root: ƒ.Node;

  let agent: ƒ.Node;
  let agentoriginalpos: ƒ.Mutator;

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
    root = viewport.getBranch();
    agent = root.getChildrenByName("Agents")[0].getChildrenByName("Agent")[0]; // picks out the first single agent node
    agentoriginalpos = agent.getComponent(ƒ.ComponentTransform); // gets starting position of agent
    laser = root.getChildrenByName("Lasers")[0].getChildrenByName("Laser")[0]; // picks out the first single laser node

    // Camera
    viewport.camera.mtxPivot.translateZ(-15);

    // Add another laser as graph
    let graphLaser: ƒ.Graph = await ƒ.Project.registerAsGraph(laser, false);
    laserCopy = await ƒ.Project.createGraphInstance(graphLaser);
    root.getChildrenByName("Lasers")[0].addChild(laserCopy);
    // laserCopy.addComponent(new ƒ.ComponentTransform);
    laserCopy.mtxLocal.translateX(8);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, fps);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.world.simulate();  // if physics is included and used

    let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;
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

    // collision check for agents and laserbeams
    for (let components of laser) {
      let beams: ƒ.Node[] = components.getChildrenByName("Laserbeams");
      beams.forEach(beam => {
        checkCollision(agent, beam);
      });
    }

    viewport.draw();


    ƒ.AudioManager.default.update();
  }

  function checkCollision(collider: ƒ.Node, obstacle: ƒ.Node) {
    let distance: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(collider.mtxWorld.translation, obstacle.mtxWorldInverse, true);
    let minX = obstacle.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x / 2 + collider.radius;
    let minY = obstacle.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.y + collider.radius;
    if (distance.x <= (minX) && distance.x >= -(minX) && distance.y <= minY && distance.y >= 0) {
      console.log("Collision detected!");
      agent.getComponent(ƒ.ComponentTransform).mutate(agentoriginalpos);
    }
  }
}
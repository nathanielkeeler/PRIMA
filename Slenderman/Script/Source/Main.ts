namespace Slenderman {
  import ƒ = FudgeCore;

  let viewport: ƒ.Viewport;
  let root: ƒ.Node;
  let player: ƒ.Node;
  let playerCmpCam: ƒ.ComponentCamera;
  let playerRigidBody: ƒ.ComponentRigidbody;
  let trees: ƒ.Node;
  let rocks: ƒ.Node;

  let gameState: GameState;

  let speedRot: number = 0.1;
  let rotationX: number = 0;
  let ctrWalk: ƒ.Control = new ƒ.Control("ctrWalk", 1.5, ƒ.CONTROL_TYPE.PROPORTIONAL, 250);

  document.addEventListener("interactiveViewportStarted", <any>start);



  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;

    initVariables();
    initPlayerView();
    await addTrees();
    await addRocks();

    gameState = new GameState();

    let canvas: HTMLCanvasElement = viewport.getCanvas();
    canvas.addEventListener("pointermove", hndPointerMove);
    canvas.requestPointerLock();
    viewport.getCanvas().addEventListener("pointermove", hndPointerMove);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();
  }



  function update(_event: Event): void {
    ƒ.Physics.simulate();

    controlWalk();
    gameState.battery -= 0.001;

    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function initVariables(): void {
    root = viewport.getBranch();
    player = root.getChildrenByName("Player")[0];
    playerRigidBody = player.getComponent(ƒ.ComponentRigidbody);
    playerRigidBody.effectRotation = new ƒ.Vector3(0, 0, 0);
    trees = root.getChildrenByName("Environment")[0].getChildrenByName("Trees")[0];
    rocks = root.getChildrenByName("Environment")[0].getChildrenByName("Rocks")[0];
  }


  function hndPointerMove(_event: PointerEvent): void {
    playerRigidBody.rotateBody(ƒ.Vector3.Y(-_event.movementX * speedRot));
    rotationX += _event.movementY * speedRot;
    rotationX = Math.min(60, Math.max(-60, rotationX));
    playerCmpCam.mtxPivot.rotation = ƒ.Vector3.X(rotationX);
  }

  function controlWalk(): void {
    let inputForward: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
    let inputSideways: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_RIGHT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_LEFT]);
    ctrWalk.setInput(inputForward);
    ctrWalk.setFactor(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT]) ? 5 : 2);

    let vecSideways = new ƒ.Vector3((1.5 * inputSideways * ƒ.Loop.timeFrameGame) / 20, 0, (ctrWalk.getOutput() * ƒ.Loop.timeFrameGame) / 20);
    vecSideways.transform(player.mtxLocal, false);
    playerRigidBody.setVelocity(vecSideways);
  }

  function initPlayerView(): void {
    playerCmpCam = root.getChildrenByName("Player")[0].getChildrenByName("Camera")[0].getComponent(ƒ.ComponentCamera);
    viewport.camera = playerCmpCam; //Active viewport camera is player view
  }

  async function addTrees(): Promise<void> {
    for (let i = 0; i < 50; i++) {
      let treeInstance = await ƒ.Project.createGraphInstance(
        ƒ.Project.resources["Graph|2022-05-03T11:32:23.947Z|52682"] as ƒ.Graph
      );

      let position: ƒ.Vector3 = new ƒ.Vector3(randomInt(-30, 30), 0, randomInt(-28, 28));
      let treeHeight = new ƒ.Vector3(1, randomInt(0.9, 1.3), 1);

      treeInstance.mtxLocal.translateX(position.x);
      treeInstance.mtxLocal.translateZ(position.z);
      treeInstance.mtxLocal.scale(treeHeight);

      let rigidBody = new ƒ.ComponentRigidbody();
      rigidBody.initialization = ƒ.BODY_INIT.TO_NODE;
      rigidBody.friction = 1;
      rigidBody.typeBody = ƒ.BODY_TYPE.STATIC;
      rigidBody.typeCollider = ƒ.COLLIDER_TYPE.CYLINDER;
      treeInstance.addComponent(rigidBody);

      treeInstance.addComponent(new Script.InitGroundPositionScript);

      trees.addChild(treeInstance);
    }
  }

  async function addRocks(): Promise<void> {
    for (let i = 0; i < 12; i++) {
      let rockInstance = await ƒ.Project.createGraphInstance(
        ƒ.Project.resources["Graph|2022-05-03T14:11:09.844Z|88150"] as ƒ.Graph
      );
      let position: ƒ.Vector3 = new ƒ.Vector3(randomInt(-30, 30), 0, randomInt(-28, 28));
      let rockScale = new ƒ.Vector3(randomInt(0.4, 1), randomInt(0.4, 1), randomInt(0.4, 1));
      let rockRotation = new ƒ.Vector3(randomInt(0, 5), randomInt(1, 180), randomInt(0, 5));

      rockInstance.mtxLocal.translateX(position.x);
      rockInstance.mtxLocal.translateZ(position.z);
      rockInstance.mtxLocal.scale(rockScale);
      rockInstance.mtxLocal.rotate(rockRotation);

      let rigidBody = new ƒ.ComponentRigidbody();
      rigidBody.initialization = ƒ.BODY_INIT.TO_NODE;
      rigidBody.friction = 1;
      rigidBody.typeBody = ƒ.BODY_TYPE.STATIC;
      rigidBody.typeCollider = ƒ.COLLIDER_TYPE.CUBE;
      rockInstance.addComponent(rigidBody);

      rockInstance.addComponent(new Script.InitGroundPositionScript);

      rocks.addChild(rockInstance);
    }
  }

  function randomInt(_min: number, _max: number): number {
    let randomNumber: number = Math.random() * (_max - _min) + _min;
    return randomNumber;
  }
}



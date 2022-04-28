namespace Slenderman {
  import ƒ = FudgeCore;

  let viewport: ƒ.Viewport;
  let root: ƒ.Node;
  let player: ƒ.Node;
  let playerCmpCam: ƒ.ComponentCamera;
  // let tree: ƒ.Node = new ƒ.Node("Tree");

  let speedRot: number = 0.1;
  let rotationX: number = 0;

  let ctrWalk: ƒ.Control = new ƒ.Control("ctrWalk", 1.5, ƒ.CONTROL_TYPE.PROPORTIONAL);
  let ctrRun: ƒ.Control = new ƒ.Control("ctrRun", 3, ƒ.CONTROL_TYPE.PROPORTIONAL);

  document.addEventListener("interactiveViewportStarted", <any>start);



  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;

    root = viewport.getBranch();
    player = root.getChildrenByName("Player")[0];
    initPlayerView();
    // await initTree();

    let canvas: HTMLCanvasElement = viewport.getCanvas();
    canvas.addEventListener("pointermove", hndPointerMove);
    canvas.requestPointerLock();
    viewport.getCanvas().addEventListener("pointermove", hndPointerMove);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();
  }



  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used

    controlWalk();

    viewport.draw();
    ƒ.AudioManager.default.update();
  }


  function hndPointerMove(_event: PointerEvent): void {
    player.mtxLocal.rotateY(-_event.movementX * speedRot);
    rotationX += _event.movementY * speedRot;
    rotationX = Math.min(60, Math.max(-60, rotationX));
    playerCmpCam.mtxPivot.rotation = ƒ.Vector3.X(rotationX);
  }

  function controlWalk(): void {
    let inputForward: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
    ctrWalk.setInput(inputForward);
    player.mtxLocal.translateZ(ctrWalk.getOutput() * ƒ.Loop.timeFrameGame / 1000);

    let inputSideways: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_RIGHT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_LEFT]);
    ctrWalk.setInput(inputSideways);
    player.mtxLocal.translateX(ctrWalk.getOutput() * ƒ.Loop.timeFrameGame / 1000);

    let inputRun: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.SHIFT_LEFT], [ƒ.KEYBOARD_CODE.SHIFT_RIGHT]);
    ctrRun.setInput(inputRun);
    player.mtxLocal.translateZ(ctrRun.getOutput() * ƒ.Loop.timeFrameGame / 1000);
  }

  function initPlayerView() {
    playerCmpCam = root.getChildrenByName("Player")[0].getChildrenByName("Camera")[0].getComponent(ƒ.ComponentCamera);
    viewport.camera = playerCmpCam; //Active viewport camera is player view
  }

  // async function initTree(): Promise<void> {
  //   let meshTree: ƒ.Mesh = new ƒ.MeshObj("TreeMesh", "Assets/tree/ico.obj")
  //   let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(meshTree);

  //   let treeTex: ƒ.TextureImage = new ƒ.TextureImage();
  // 	await treeTex.load("Assets/tree/tree_texture.png");
  //   let matTree: ƒ.Material = new ƒ.Material("TreeMat", ƒ.ShaderGouraudTextured, new ƒ.CoatRemissiveTextured(new ƒ.Color(), treeTex));
  //   let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(matTree);

  //   tree.addComponent(cmpMesh);
  //   tree.addComponent(cmpMaterial);
  //   tree.addComponent(new ƒ.ComponentTransform());

  //   root.addChild(tree);
  // }
}



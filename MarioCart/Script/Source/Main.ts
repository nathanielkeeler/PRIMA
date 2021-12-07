namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let graph: ƒ.Graph;
  let viewport: ƒ.Viewport;

  let cart: ƒ.Node;
  let cartBody: ƒ.ComponentRigidbody;

  let cmpMeshTerrain: ƒ.ComponentMesh;
  let mtxTerrain: ƒ.Matrix4x4;
  let meshTerrain: ƒ.MeshTerrain;

  let camera: ƒ.Node = new ƒ.Node("cameraNode");
  let cmpCamera = new ƒ.ComponentCamera();

  let ctrForward: ƒ.Control = new ƒ.Control("Forward", 1, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrForward.setDelay(200);
  let ctrTurn: ƒ.Control = new ƒ.Control("Turn", 1, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrTurn.setDelay(200);

  document.addEventListener("interactiveViewportStarted", <any>start);

  async function start(_event: CustomEvent): Promise<void> {

    graph = <ƒ.Graph>ƒ.Project.resources["Graph|2021-11-18T14:33:55.349Z|10541"];

    viewport = _event.detail;

    cmpMeshTerrain = viewport.getBranch().getChildrenByName("Terrain")[0].getComponent(ƒ.ComponentMesh);
    meshTerrain = <ƒ.MeshTerrain>cmpMeshTerrain.mesh;
    mtxTerrain = cmpMeshTerrain.mtxWorld;

    cart = graph.getChildrenByName("Cart")[0];
    cartBody = cart.getComponent(ƒ.ComponentRigidbody);


    cameraTrackCart();

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    let forceNodes: ƒ.Node[] = cart.getChildrenByName("Forces")[0].getChildren();
    let force: ƒ.Vector3 = ƒ.Vector3.SCALE(ƒ.Physics.world.getGravity(), -cartBody.mass / forceNodes.length);

    for (let forceNode of forceNodes) {
      let posForce: ƒ.Vector3 = forceNode.getComponent(ƒ.ComponentMesh).mtxWorld.translation;
      let terrainInfo: ƒ.TerrainInfo = meshTerrain.getTerrainInfo(posForce, mtxTerrain);
      let height: number = posForce.y - terrainInfo.position.y;
      // console.log(height);
      cartBody.applyForceAtPoint(force, posForce);
    }

    ƒ.Physics.world.simulate();  // if physics is included and used

    camera.mtxLocal.translation = cart.mtxWorld.translation;
    camera.mtxLocal.rotation = new ƒ.Vector3(0, cart.mtxWorld.rotation.y, 0);

    let forward: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
    ctrForward.setInput(forward);
    cartBody.applyForce(ƒ.Vector3.SCALE(cartBody.node.mtxLocal.getZ(), ctrForward.getOutput()));

    let turn: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
    ctrTurn.setInput(turn);
    cartBody.applyTorque(ƒ.Vector3.SCALE(ƒ.Vector3.Y(), ctrTurn.getOutput()));

    let terrainInfo: ƒ.TerrainInfo = meshTerrain.getTerrainInfo(cart.mtxLocal.translation, mtxTerrain);
    cart.mtxLocal.translation = terrainInfo.position;
    cart.mtxLocal.showTo(ƒ.Vector3.SUM(terrainInfo.position, cart.mtxLocal.getZ()), terrainInfo.normal);

    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function cameraTrackCart() {
    cmpCamera.mtxPivot.translation = new ƒ.Vector3(0, 10, -18);
    cmpCamera.mtxPivot.rotation = new ƒ.Vector3(22, 0, 0);

    camera.addComponent(cmpCamera);
    camera.addComponent(new ƒ.ComponentTransform());
    graph.addChild(camera);

    let canvas: HTMLCanvasElement = document.querySelector("canvas");
    viewport.initialize("Viewport", graph, cmpCamera, canvas);

    viewport.calculateTransforms();
  }
}
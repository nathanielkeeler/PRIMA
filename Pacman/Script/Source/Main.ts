namespace Pacman {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  let graph: ƒ.Node;
  let pacman: ƒ.Node;
  let pacmanSpeed: number = 0.02;
  let ghost: ƒ.Node;
  let ghostSpeed: number = 0.02;
  let directionGhost: ƒ.Vector2;
  let grid: ƒ.Node;
  let direction: ƒ.Vector2 = ƒ.Vector2.ZERO();
  let soundIntro: ƒ.ComponentAudio;
  let soundWaka: ƒ.ComponentAudio;

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <any>start);



  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;
    viewport.camera.mtxPivot.translateZ(-10);

    graph = viewport.getBranch();

    pacman = graph.getChildrenByName("Pacman")[0];
    await initSprites(pacman);

    grid = graph.getChildrenByName("Grid")[0];

    ghost = createGhost();
    graph.addChild(ghost);

    initAudio();

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();
  }



  function update(_event: Event): void {
    // ƒ.Physics.simulate();

    let posPacman: ƒ.Vector3 = pacman.mtxLocal.translation;
    let nearestGridPoint: ƒ.Vector2 = new ƒ.Vector2(Math.round(posPacman.x), Math.round(posPacman.y));
    let nearGridPoint: boolean = posPacman.toVector2().equals(nearestGridPoint, 2 * pacmanSpeed);

    if (nearGridPoint) {
      let directionOld: ƒ.Vector2 = direction.clone;
      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D]))
        direction.set(1, 0);
      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A]))
        direction.set(-1, 0);
      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.W]))
        direction.set(0, 1);
      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_DOWN, ƒ.KEYBOARD_CODE.S]))
        direction.set(0, -1);


      if (blocked(ƒ.Vector2.SUM(nearestGridPoint, direction)))
        if (direction.equals(directionOld)) // did not turn
          direction.set(0, 0); // full stop
        else {
          if (blocked(ƒ.Vector2.SUM(nearestGridPoint, directionOld))) // wrong turn and dead end
            direction.set(0, 0); // full stop
          else
            direction = directionOld; // don't turn but continue ahead
        }

      if (!direction.equals(directionOld) || direction.magnitudeSquared == 0)
        pacman.mtxLocal.translation = nearestGridPoint.toVector3();

      if (direction.magnitudeSquared == 0) {
        soundWaka.play(false);
        spriteNode.setFrameDirection(0);
      }
      else if (!soundWaka.isPlaying) {
        soundWaka.play(true);
        spriteNode.setFrameDirection(3);
      }
    }

    pacman.mtxLocal.translate(ƒ.Vector2.SCALE(direction, pacmanSpeed).toVector3());

    if (direction.magnitudeSquared != 0) {
      spriteNode.mtxLocal.reset();
      spriteNode.mtxLocal.rotation = new ƒ.Vector3(0, direction.x < 0 ? 180 : 0, direction.y * 90);
    }

    updateGhost();

    viewport.draw();
    ƒ.AudioManager.default.update();
  }



  function blocked(_posCheck: ƒ.Vector2): boolean {
    let check: ƒ.Node = grid.getChild(_posCheck.y)?.getChild(_posCheck.x)?.getChild(0);
    return (!check || check.name == "Wall");
  }

  function createGhost(): ƒ.Node {
    let node: ƒ.Node = new ƒ.Node("Ghost");
    let mesh: ƒ.MeshSphere = new ƒ.MeshSphere("meshGhost");
    let material: ƒ.Material = new ƒ.Material("mtrGhost", ƒ.ShaderLit, new ƒ.CoatColored());

    let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(mesh);
    cmpMesh.mtxPivot.scale(new ƒ.Vector3(0.8, 0.8, 0.8));

    let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(material);
    cmpMaterial.clrPrimary = new ƒ.Color(255, 0, 0);

    let cmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform();

    node.addComponent(cmpMesh);
    node.addComponent(cmpMaterial);
    node.addComponent(cmpTransform);

    node.mtxLocal.translate(new ƒ.Vector3(2, 1, 0));

    return node;
  }

  function updateGhost() {
    let targetPos: ƒ.Vector3 = pacman.mtxLocal.translation
    directionGhost = new ƒ.Vector2(-targetPos.x, -targetPos.y);
    ghost.mtxLocal.translate(ƒ.Vector2.SCALE(directionGhost, ghostSpeed).toVector3());
  }

  function initAudio(): void {
    ƒ.AudioManager.default.listenTo(graph);
    soundIntro = graph.getChildrenByName("Sound")[0].getComponents(ƒ.ComponentAudio)[0];
    soundIntro.play(true);
    soundWaka = graph.getChildrenByName("Sound")[0].getComponents(ƒ.ComponentAudio)[1];
  }
}
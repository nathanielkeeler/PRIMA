"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Pacman;
(function (Pacman) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let graph;
    let pacman;
    let pacmanSpeed = 0.025;
    let ghost;
    let grid;
    let direction = ƒ.Vector2.ZERO();
    let soundWaka;
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        viewport.camera.mtxPivot.translateZ(-10);
        graph = viewport.getBranch();
        pacman = graph.getChildrenByName("Pacman")[0];
        Pacman.initSprites(pacman);
        grid = graph.getChildrenByName("Grid")[0];
        ghost = createGhost();
        graph.addChild(ghost);
        ƒ.AudioManager.default.listenTo(graph);
        soundWaka = graph.getChildrenByName("Sound")[0].getComponents(ƒ.ComponentAudio)[1];
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start();
    }
    function update(_event) {
        // ƒ.Physics.simulate();
        let posPacman = pacman.mtxLocal.translation;
        let nearestGridPoint = new ƒ.Vector2(Math.round(posPacman.x), Math.round(posPacman.y));
        let nearGridPoint = posPacman.toVector2().equals(nearestGridPoint, 2 * pacmanSpeed);
        if (nearGridPoint) {
            let directionOld = direction.clone;
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D]))
                direction.set(1, 0);
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A]))
                direction.set(-1, 0);
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.W]))
                direction.set(0, 1);
            Pacman.rotateSpriteUp();
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_DOWN, ƒ.KEYBOARD_CODE.S]))
                direction.set(0, -1);
            Pacman.rotateSpriteDown();
            if (blocked(ƒ.Vector2.SUM(nearestGridPoint, direction)))
                if (direction.equals(directionOld)) // did not turn
                    direction.set(0, 0); // full stop
                else {
                    if (blocked(ƒ.Vector2.SUM(nearestGridPoint, directionOld))) // wrong turn and dead end
                        direction.set(0, 0); // full stop
                    else
                        direction = directionOld; // don't turn but continue ahead
                }
            if (!direction.equals(directionOld) || direction.equals(ƒ.Vector2.ZERO()))
                pacman.mtxLocal.translation = nearestGridPoint.toVector3();
            // if (direction.equals(ƒ.Vector2.ZERO()))
            //   soundWaka.play(false);
            // else if (!soundWaka.isPlaying)
            //   soundWaka.play(true);
        }
        pacman.mtxLocal.translate(ƒ.Vector2.SCALE(direction, pacmanSpeed).toVector3());
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function blocked(_posCheck) {
        let check = grid.getChild(_posCheck.y)?.getChild(_posCheck.x)?.getChild(0);
        return (!check || check.name == "Wall");
    }
    function createGhost() {
        let node = new ƒ.Node("Ghost");
        let mesh = new ƒ.MeshSphere("meshGhost");
        let material = new ƒ.Material("mtrGhost", ƒ.ShaderLit, new ƒ.CoatColored()); //standard color is white
        let cmpMesh = new ƒ.ComponentMesh(mesh);
        cmpMesh.mtxPivot.scale(new ƒ.Vector3(0.8, 0.8, 0.8));
        let cmpMaterial = new ƒ.ComponentMaterial(material);
        cmpMaterial.clrPrimary = new ƒ.Color(255, 0, 0);
        let cmpTransform = new ƒ.ComponentTransform();
        node.addComponent(cmpMesh);
        node.addComponent(cmpMaterial);
        node.addComponent(cmpTransform);
        node.mtxLocal.translate(new ƒ.Vector3(2, 1, 0));
        return node;
    }
    function updateGhost() {
        // KI
        // Gridpoint aussuchen und hin translieren
        // an gridpoint ja nein?
        // ansonsten lauf zum
    }
})(Pacman || (Pacman = {}));
var Pacman;
(function (Pacman) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    let spriteAnimations;
    let spriteNode;
    async function initSprites(_node) {
        await loadSprites();
        spriteNode = new ƒAid.NodeSprite("Sprite");
        spriteNode.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        spriteNode.setAnimation(spriteAnimations["Pacman"]);
        spriteNode.setFrameDirection(1);
        spriteNode.mtxLocal.translateY(0);
        spriteNode.framerate = 15;
        _node.addChild(spriteNode);
        _node.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
    }
    Pacman.initSprites = initSprites;
    async function loadSprites() {
        let imgSpriteSheet = new ƒ.TextureImage();
        await imgSpriteSheet.load("Sprites/sprites.png");
        let spriteSheet = new ƒ.CoatTextured(new ƒ.Color(), imgSpriteSheet);
        generateSprites(spriteSheet);
    }
    Pacman.loadSprites = loadSprites;
    function generateSprites(_spritesheet) {
        spriteAnimations = {};
        let name = "Pacman";
        let sprite = new ƒAid.SpriteSheetAnimation(name, _spritesheet);
        sprite.generateByGrid(ƒ.Rectangle.GET(0, 0, 64, 64), 6, 70, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(64));
        spriteAnimations[name] = sprite;
    }
    Pacman.generateSprites = generateSprites;
    async function rotateSpriteUp() {
        spriteNode.mtxLocal.rotateZ(-90);
    }
    Pacman.rotateSpriteUp = rotateSpriteUp;
    async function rotateSpriteDown() {
        spriteNode.mtxLocal.rotateZ(90);
    }
    Pacman.rotateSpriteDown = rotateSpriteDown;
})(Pacman || (Pacman = {}));
//# sourceMappingURL=Script.js.map
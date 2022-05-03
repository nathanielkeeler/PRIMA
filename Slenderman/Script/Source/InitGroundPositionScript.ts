namespace Script {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  export class InitGroundPositionScript extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(InitGroundPositionScript);
    // Properties may be mutated by users in the editor via the automatically created user interface


    constructor() {
      super();

      // Don't start when running in editor
      if (ƒ.Project.mode == ƒ.MODE.EDITOR)
        return;

      // Listen to this component being added to or removed from a node
      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
      this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.hndEvent);
    }

    // Activate the functions of this component as response to events
    public hndEvent = (_event: Event): void => {
      switch (_event.type) {
        case ƒ.EVENT.COMPONENT_ADD:
          document.addEventListener("interactiveViewportStarted", <EventListener>this.initPositionToGround);
          break;
        case ƒ.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
        case ƒ.EVENT.NODE_DESERIALIZED:
          // if deserialized the node is now fully reconstructed and access to all its components and children is possible
          break;
      }
    }

    private initPositionToGround = (_event: Event): void => {
      const root: ƒ.Graph = ƒ.Project.resources["Graph|2022-04-12T15:10:16.404Z|44825"] as ƒ.Graph;
      const ground: ƒ.Node = root.getChildrenByName("Environment")[0].getChildrenByName("Ground")[0];
      const cmpMeshGround: ƒ.ComponentMesh = ground.getComponent(ƒ.ComponentMesh);
      const meshGround: ƒ.MeshTerrain = <ƒ.MeshTerrain>ground.getComponent(ƒ.ComponentMesh).mesh;
      const yDiff: number = meshGround.getTerrainInfo(this.node.mtxLocal.translation, cmpMeshGround.mtxWorld).distance;
      this.node.mtxLocal.translateY(-yDiff);
    }

    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}
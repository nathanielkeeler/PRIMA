namespace Script {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Script);
  export class InitGroundPositionScript extends ƒ.ComponentScript {
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(InitGroundPositionScript);

    constructor() {
      super();

      if (ƒ.Project.mode == ƒ.MODE.EDITOR)
        return;

      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
      this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.hndEvent);
    }

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
          break;
      }
    }

    private initPositionToGround = (_event: Event): void => {
      let root: ƒ.Graph = ƒ.Project.resources["Graph|2022-04-12T15:10:16.404Z|44825"] as ƒ.Graph;
      let ground: ƒ.Node = root.getChildrenByName("Environment")[0].getChildrenByName("Ground")[0];
      let cmpMeshGround: ƒ.ComponentMesh = ground.getComponent(ƒ.ComponentMesh);
      let meshGround: ƒ.MeshTerrain = <ƒ.MeshTerrain>ground.getComponent(ƒ.ComponentMesh).mesh;
      let yDiff: number = meshGround.getTerrainInfo(this.node.mtxLocal.translation, cmpMeshGround.mtxWorld).distance;
      this.node.mtxLocal.translateY(-yDiff);
    }
  }
}
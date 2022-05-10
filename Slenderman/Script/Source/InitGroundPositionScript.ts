namespace Script {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Script);
  export class InitGroundPositionScript extends ƒ.ComponentScript {
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(InitGroundPositionScript);

    constructor() {
      super();

      if (ƒ.Project.mode == ƒ.MODE.EDITOR)
        return;

      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.addComponent);
    }

    private addComponent = (): void => {
      let graph: ƒ.Graph = ƒ.Project.resources["Graph|2022-04-12T15:10:16.404Z|44825"] as ƒ.Graph;
      if (graph) {
        this.setPosition();
      } else {
        document.addEventListener("interactiveViewportStarted", <EventListener>this.setPosition);
      }
    };

    private setPosition = (): void => {
      let graph: ƒ.Graph = ƒ.Project.resources["Graph|2022-04-12T15:10:16.404Z|44825"] as ƒ.Graph;
      let ground: ƒ.Node = graph.getChildrenByName("Environment")[0].getChildrenByName("Ground")[0];
      let cmpMeshTerrain: ƒ.ComponentMesh = ground.getComponent(ƒ.ComponentMesh);
      let meshTerrain = <ƒ.MeshTerrain>cmpMeshTerrain.mesh;
      let distance = meshTerrain.getTerrainInfo(this.node.mtxLocal.translation, cmpMeshTerrain.mtxWorld)?.distance;

      if (distance) {
        this.node.mtxLocal.translateY(-distance);
      };
    }
  }
}
namespace Script {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Script);
  export class MovementOnGroundScript extends ƒ.ComponentScript {
    private static root: ƒ.Graph;
    private static ground: ƒ.Node;
    private static cmpMeshTerrain: ƒ.ComponentMesh;
    private static meshTerrain: ƒ.MeshTerrain;

    public static readonly iSubclass: number = ƒ.Component.registerSubclass(MovementOnGroundScript);

    constructor() {
      super();

      if (ƒ.Project.mode == ƒ.MODE.EDITOR) return;

      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.addComponent);
    }

    public addComponent = (): void => {
      this.node.addEventListener(ƒ.EVENT.RENDER_PREPARE, this.setPosition);
    };

    public setPosition = (): void => {
      if (!MovementOnGroundScript.root) {
        MovementOnGroundScript.root = ƒ.Project.resources["Graph|2022-04-12T15:10:16.404Z|44825"] as ƒ.Graph;
        MovementOnGroundScript.ground = MovementOnGroundScript.root.getChildrenByName("Environment")[0].getChildrenByName("Ground")[0];
        MovementOnGroundScript.cmpMeshTerrain = MovementOnGroundScript.ground.getComponent(ƒ.ComponentMesh);
        MovementOnGroundScript.meshTerrain = <ƒ.MeshTerrain>MovementOnGroundScript.cmpMeshTerrain.mesh;
      }

      let yDiff: number = MovementOnGroundScript.meshTerrain.getTerrainInfo(this.node.mtxLocal.translation, MovementOnGroundScript.cmpMeshTerrain.mtxWorld)?.distance;
      if (yDiff)
        this.node.mtxLocal.translateY(-yDiff);
    };
  }
}
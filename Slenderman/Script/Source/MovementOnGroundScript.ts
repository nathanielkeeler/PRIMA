namespace Script {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Script);
  export class MovementOnGroundScript extends ƒ.ComponentScript {
    private root: ƒ.Graph;
    private ground: ƒ.Node;
    private cmpMeshTerrain: ƒ.ComponentMesh;
    private meshTerrain: ƒ.MeshTerrain;
    private rigidBody: ƒ.ComponentRigidbody;

    public static readonly iSubclass: number = ƒ.Component.registerSubclass(MovementOnGroundScript);

    constructor() {
      super();

      if (ƒ.Project.mode == ƒ.MODE.EDITOR) return;

      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.addComponent);
    }

    public addComponent = (): void => {
      this.node.addEventListener(ƒ.EVENT.RENDER_PREPARE, this.setVerticalPos);
    };

    private setVerticalPos = (): void => {
      this.root = <ƒ.Graph>ƒ.Project.resources["Graph|2022-04-12T15:10:16.404Z|44825"];
      this.ground = this.root.getChildrenByName("Environment")[0].getChildrenByName("Ground")[0];
      this.cmpMeshTerrain = this.ground.getComponent(ƒ.ComponentMesh);
      this.meshTerrain = <ƒ.MeshTerrain>this.cmpMeshTerrain.mesh;
      this.rigidBody = this.node.getComponent(ƒ.ComponentRigidbody);

      let yDiff = this.meshTerrain.getTerrainInfo(this.rigidBody.getPosition(), this.cmpMeshTerrain.mtxWorld)?.distance;
      if (yDiff) {
        this.node.getComponent(ƒ.ComponentRigidbody).translateBody(new ƒ.Vector3(0, -yDiff, 0));
      }
    };
  }
}
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
      if (!this.root) {
        this.root = ƒ.Project.resources["Graph|2022-04-12T15:10:16.404Z|44825"] as ƒ.Graph;
        this.ground = this.root.getChildrenByName("Environment")[0].getChildrenByName("Ground")[0];
        this.cmpMeshTerrain = this.ground.getComponent(ƒ.ComponentMesh);
        this.meshTerrain = <ƒ.MeshTerrain>this.cmpMeshTerrain.mesh;
      }

      if (!this.rigidBody)
        this.rigidBody = this.node.getComponent(ƒ.ComponentRigidbody);

      let distance: number = 0;

      if (this.rigidBody) {
        distance = this.meshTerrain.getTerrainInfo(this.rigidBody.getPosition(), this.cmpMeshTerrain.mtxWorld)?.distance;
      } else {
        distance = this.meshTerrain.getTerrainInfo(this.node.mtxLocal.translation, this.cmpMeshTerrain.mtxWorld)?.distance;
      }

      if (distance) {
        if (this.rigidBody) {
          this.rigidBody.translateBody(new ƒ.Vector3(0, -distance, 0));
        } else {
          this.node.mtxLocal.translateY(-distance);
        }
      }
    };
  }
}
namespace LaserLeague {
    import ƒ = FudgeCore;

    export class Agent extends ƒ.Node {

        public name: string = "Agent Smith";
        public health: number = 1;

        constructor() {
            super("Agent");

            this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshPolygon("MeshAgent")));
            this.addComponent(new ƒ.ComponentMaterial(
                new ƒ.Material("mtrAgent", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(0, 1, 0, 1))))
            );
            this.addComponent(new ƒ.ComponentTransform);

            // this.mtxLocal.scale(new ƒ.Vector3(0.2, 0.4, 0));
            this.getComponent(ƒ.ComponentMesh).mtxPivot.scale(new ƒ.Vector3(0.2, 0.3, 0));
        }
    }
}
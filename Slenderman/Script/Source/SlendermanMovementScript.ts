namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);
    export class SlendermanMovementScript extends ƒ.ComponentScript {
        public static readonly iSubclass: number = ƒ.Component.registerSubclass(SlendermanMovementScript);
        private timeToChange: number = 0;
        private direction: ƒ.Vector3 = new ƒ.Vector3();


        constructor() {
            super();

            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR) return;

            this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.addComponent);
        }

        public addComponent = (): void => {
            this.node.addEventListener(ƒ.EVENT.RENDER_PREPARE, this.move);
        };

        public move = (): void => {
            this.node.mtxLocal.translate(ƒ.Vector3.SCALE(this.direction, ƒ.Loop.timeFrameGame / 1000));
            if (this.timeToChange > ƒ.Time.game.get()) {
                return;
            }
            this.timeToChange = ƒ.Time.game.get() + 3000;
            this.direction = ƒ.Random.default.getVector3(new ƒ.Vector3(-1, 0, -1), new ƒ.Vector3(1, 0, 1));
        };
    }
}
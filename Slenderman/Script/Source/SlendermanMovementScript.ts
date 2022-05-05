namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);
    export class SlendermanMovementScript extends ƒ.ComponentScript {
        public static readonly iSubclass: number = ƒ.Component.registerSubclass(SlendermanMovementScript);
        private timeToChange: number = 0;
        private direction: ƒ.Vector3 = ƒ.Vector3.ZERO();


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
                    this.node.addEventListener(ƒ.EVENT.RENDER_PREPARE, this.move);
                    break;
                case ƒ.EVENT.COMPONENT_REMOVE:
                    this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
                    this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
                    break;
                case ƒ.EVENT.NODE_DESERIALIZED:
                    break;
            }
        }

        private move = (_event: Event): void => {
            this.node.mtxLocal.translate(ƒ.Vector3.SCALE(this.direction, ƒ.Loop.timeFrameGame / 1000));

            if (this.timeToChange > ƒ.Time.game.get())
                return;

            this.timeToChange = ƒ.Time.game.get() + 3000;
            this.direction = ƒ.Random.default.getVector3(new ƒ.Vector3(-1, 0, -1), new ƒ.Vector3(1, 0, 1));
        }
    }
}
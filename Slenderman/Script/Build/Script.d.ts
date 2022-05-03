declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Slenderman {
    import ƒ = FudgeCore;
    class InitGroundPositionScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        constructor();
        hndEvent: (_event: Event) => void;
        private initPositionToGround;
    }
}
declare namespace Slenderman {
}
declare namespace Script {
    import ƒ = FudgeCore;
    class MovementOnGroundScript extends ƒ.ComponentScript {
        private static root;
        private static ground;
        private static cmpMeshTerrain;
        private static meshTerrain;
        static readonly iSubclass: number;
        constructor();
        addComponent: () => void;
        setPosition: () => void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class SlendermanMovementScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        private timeToChange;
        private direction;
        constructor();
        hndEvent: (_event: Event) => void;
        private move;
    }
}

declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class InitGroundPositionScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        constructor();
        private addComponent;
        private setPosition;
    }
}
declare namespace Slenderman {
}
declare namespace Script {
    import ƒ = FudgeCore;
    class MovementOnGroundScript extends ƒ.ComponentScript {
        private root;
        private ground;
        private cmpMeshTerrain;
        private meshTerrain;
        private rigidBody;
        static readonly iSubclass: number;
        constructor();
        addComponent: () => void;
        private setVerticalPos;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class SlendermanMovementScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        private timeToChange;
        private direction;
        constructor();
        addComponent: () => void;
        move: () => void;
    }
}

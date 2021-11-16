declare namespace LaserLeague {
    import ƒ = FudgeCore;
    class Agent extends ƒ.Node {
        name: string;
        health: number;
        constructor();
    }
}
declare namespace LaserLeague {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace LaserLeague {
    import ƒ = FudgeCore;
    class GameState extends ƒ.Mutable {
        private static controller;
        private static instance;
        name: string;
        health: number;
        private constructor();
        static get(): GameState;
        protected reduceMutator(_mutator: ƒ.Mutator): void;
    }
}
declare namespace LaserLeague {
    export import ƒ = FudgeCore;
    export import ƒui = FudgeUserInterface;
}
declare namespace LaserLeague {
    import ƒ = FudgeCore;
    class LaserRotator extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        speedLaserRotation: number;
        constructor();
        hndEvent: (_event: Event) => void;
        update: (_event: Event) => void;
        checkCollision(_pos: ƒ.Vector3, _radius: number): boolean;
    }
}

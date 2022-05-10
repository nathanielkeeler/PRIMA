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
declare namespace Script {
    import ƒAid = FudgeAid;
    enum JOB {
        FOLLOW = 0,
        STAND = 1,
        TELEPORT = 2
    }
    export class StateMachine extends ƒAid.ComponentStateMachine<JOB> {
        static readonly iSubclass: number;
        private static instructions;
        private cmpBody;
        private time;
        private movement;
        constructor();
        static get(): ƒAid.StateMachineInstructions<JOB>;
        private static transitDefault;
        private static actFollow;
        private static actStand;
        private static actTeleport;
        private hndEvent;
        private update;
    }
    export {};
}

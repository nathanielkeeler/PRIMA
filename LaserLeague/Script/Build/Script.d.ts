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
}
declare namespace Script {
    import ƒ = FudgeCore;
    class LaserRotator extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        speedLaserRotation: number;
        constructor();
        hndEvent: (_event: Event) => void;
        start(): void;
        update: (_event: Event) => void;
    }
}

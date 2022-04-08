declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Pacman {
}
declare namespace Pacman {
    import ƒ = FudgeCore;
    function initSprites(_node: ƒ.Node): Promise<void>;
    function loadSprites(): Promise<void>;
    function generateSprites(_spritesheet: ƒ.CoatTextured): void;
    function rotateSpriteUp(): Promise<void>;
    function rotateSpriteDown(): Promise<void>;
}

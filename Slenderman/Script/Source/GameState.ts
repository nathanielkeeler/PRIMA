namespace Slenderman {
	import ƒ = FudgeCore;
	import ƒui = FudgeUserInterface;

	export class GameState extends ƒ.Mutable {
		private static instance: GameState;
		public battery: number;
		public time: number;
		public stamina: number;
		public steps: number;

		public constructor() {
			super();
			GameState.instance = this;

			let domVui: HTMLDivElement = document.querySelector("div#vui");

			console.log(new ƒui.Controller(this, domVui));
		}

		public static get(): GameState {
			return GameState.instance || new GameState();
		}

		protected reduceMutator(_mutator: ƒ.Mutator): void {/* */ }
	}
}
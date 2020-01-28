import { Player } from "./player";
import { Board } from "./board";

export class Game {
	players : Array<Player>;
	sousterrain : Board;
	surface : Board;

	constructor(sous: Board, sur: Board){
		this.sousterrain = sous;
		this.surface = sur;
		this.players = new Array<Player>();
	}

	getSousterrain(): Board{
		return this.sousterrain;
	}

	getSurface(): Board{
		return this.surface;
	}

	getPlayers(): Array<Player>{
		return this.players;
	}

	addPlayer(p : Player){
		if(!this.players.includes(p))
			this.players.push(p);
	}
}
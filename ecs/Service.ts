import Game from "./Game";

export default class Service {

    protected readonly game: Game;

    constructor(game: Game) {
        this.game = game;
    }
}

import Game from "./Game";


export default abstract class Listener {

    protected game: Game;

    protected abstract listeners;

    protected constructor(game: Game) {
        this.game = game;
    }

    public register(): void {
        this.game.manager.eventHandler.registerListeners(this.listeners);
    }

}

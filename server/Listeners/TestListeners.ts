import Game from "../../ecs/Game";
import Listener from "../../ecs/Listener";

export default class TestListeners implements Listener {

    public register(game: Game): void {

        game.manager.eventHandler.registerListener('EntityMoves', function (eventData: any) {

        });

    }

}

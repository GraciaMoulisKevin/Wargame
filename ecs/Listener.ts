import Game from "./Game";


export default interface Listener {

    register(game: Game): void;

}

import Game from "../Game";

Game.manager.eventHandler.registerListener('EntityMoves', function (eventData: any) {
    console.log(eventData.entity + " has moved.");
});

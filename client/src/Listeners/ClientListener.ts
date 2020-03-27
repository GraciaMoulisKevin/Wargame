import MapTileUtils from "../Utils/MapTileUtils";
import Listener from "../../../ecs/Listener";
import Game from "../../../ecs/Game";


export default class ClientListener extends Listener {

    constructor(game) {
        super(game);
    }

    protected listeners = {
        MouseMove: function (mousePosition: { x: number, y: number }) {
            //console.log(mousePosition);
        },

        MouseClick: (mousePosition: { x: number, y: number }) => {
            const mouseMapTilePosition = MapTileUtils.getHexagonCoordinatesByPixels(mousePosition, 80);
            const entity = this.game.manager.getEntitiesByComponents(['MapTile'], {
                MapTile: mouseMapTilePosition
            })[0];

            console.log(entity);
        }
    }
}

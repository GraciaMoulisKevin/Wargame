import System from "../System";
import Game from "../Game";


export default class LocationSystem extends System {

    public update() {

        const locationEntitiesAndData = Game.getManager().getEntitiesAndDataComposedBy(['Location']);

        for(let data of locationEntitiesAndData) {
            data.state.x += data.state.test_x;
            data.state.y += data.state.test_y;

            if(data.state.x <= 0 || data.state.x >= 800) {
                data.state.test_x *= -1;
            }

            if(data.state.test_x > 0) {
                data.state.test_x *= 0.999;
            }

            if(data.state.y <= 0 || data.state.y >= 800-30) {
                data.state.test_y *= -0.99;
            }

            if(data.state.y < 800-30) {
                data.state.test_y += 0.2;
            }

            if(Game.io) Game.io.emit('test', data.state);
        }

    }
}

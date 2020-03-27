import Game from "../../../ecs/Game";
import Service from "../../../ecs/Service";


export default class MouseService extends Service{

    private mousePosition: {x: number, y: number};

    constructor(game: Game) {
        super(game);
        const instance = this;
        $('.foreground').on('mousemove', function (event) {
            const mousePosition = instance.getCursorCoordinateOnCanvas(event, this);
            game.manager.eventHandler.callEvents(['MouseMove'], mousePosition);
            instance.setMousePosition(mousePosition);
        });

        $('.foreground').on('click', function (event) {
            const mousePosition = instance.getCursorCoordinateOnCanvas(event, this);
            game.manager.eventHandler.callEvents(['MouseClick'], mousePosition);
            instance.setMousePosition(mousePosition);
        });
    }

    private getCursorCoordinateOnCanvas(event, canvas){

        //pointer position onclick
        let cursor_x = event.pageX;
        let cursor_y = event.pageY;

        //offset modifiers
        let x = cursor_x - canvas.offsetLeft;
        let y = cursor_y - canvas.offsetTop;

        return {x: x-(canvas.width/2), y: y-(canvas.height/2)};
    }

    private setMousePosition(mousePosition: {x: number, y: number}): void {
        this.mousePosition = mousePosition;
    }

    public getMousePosition() : {x: number, y: number} {
        return this.mousePosition;
    }



}

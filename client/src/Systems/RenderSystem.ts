import System from "../../../ecs/System";


export default class RenderSystem extends System{

    private foregroundCanvas;
    private foregroundCtx;

    protected onDisable() {
    }

    protected onEnable() {
        this.foregroundCanvas = document.getElementById("foreground-map");
        this.foregroundCtx = this.foregroundCanvas.getContext("2d");
    }

    private getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    protected onUpdate() {
        const entities = this.game.manager.getEntitiesByComponents(['Renderable', 'Position']);

        this.foregroundCtx.clearRect(0,0,this.foregroundCanvas.width,this.foregroundCanvas.height);
        for(const entityId of entities) {
            const positionState = this.game.manager.getComponentDataByEntity(entityId, 'Position');

            this.foregroundCtx.save();
            this.foregroundCtx.beginPath();
            this.foregroundCtx.translate(positionState.x,positionState.y);
            this.foregroundCtx.arc(75, 75, 50, 0, Math.PI * 2, true);  // Cercle extérieur
            this.foregroundCtx.fillStyle = this.getRandomColor();
            this.foregroundCtx.fill();
            this.foregroundCtx.restore();

            positionState.changed = false;

        }
    }

}

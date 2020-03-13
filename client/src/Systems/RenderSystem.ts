import System from "../../../ecs/System";
import TextureManager from "../TextureManager";


export default class RenderSystem extends System{

    private foregroundCanvas;
    private foregroundCtx;
    private undergroundCanvas;
    private undergroundCtx;

    protected onDisable() {
    }

    protected onEnable() {
        this.foregroundCanvas = document.getElementById("foreground-map");
        this.foregroundCtx = this.foregroundCanvas.getContext("2d");
        this.undergroundCanvas = document.getElementById("underground-map");
        this.undergroundCtx = this.undergroundCanvas.getContext("2d");
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
        const entities = this.game.manager.getEntitiesByComponents(['Renderable']);

        this.foregroundCtx.clearRect(0,0,this.foregroundCanvas.width,this.foregroundCanvas.height);
        this.undergroundCtx.clearRect(0,0,this.foregroundCanvas.width,this.foregroundCanvas.height);

        for(const entityId of entities) {
            this.foregroundCtx.save();
            this.undergroundCtx.save();
            if(this.game.manager.hasEntityComponents(entityId, ['MapTile', 'Position'])) {
                this.renderMapTile(entityId);
            } else if(this.game.manager.hasEntityComponents(entityId, ['Position', 'Shape'])) {
                const positionState = this.game.manager.getComponentDataByEntity(entityId, 'Position');
                const shapeState = this.game.manager.getComponentDataByEntity(entityId, 'Shape');

                if (shapeState.type !== 'circle') continue;


                this.foregroundCtx.beginPath();
                this.foregroundCtx.translate(positionState.x, positionState.y);
                this.foregroundCtx.arc(75, 75, shapeState.radius, 0, Math.PI * 2, true);  // Cercle extérieur
                this.foregroundCtx.fillStyle = this.getRandomColor();
                this.foregroundCtx.fill();
            }
            this.foregroundCtx.restore();
            this.undergroundCtx.restore();
        }
    }

    private renderMapTile(entityId: number): void {
        const positionState = this.game.manager.getComponentDataByEntity(entityId, 'Position');
        const mapTileState = this.game.manager.getComponentDataByEntity(entityId, 'MapTile');
        const mapState = this.game.manager.getComponentDataByEntity(mapTileState.mapId, 'Map');

        if(mapTileState.layer === 'underground') return;

        const ctx = mapTileState.layer === 'foreground' ? this.foregroundCtx : this.undergroundCtx;
        ctx.translate(positionState.x, positionState.y);
        ctx.drawImage(TextureManager.textures['MAP_TILE_'+mapTileState.type], -mapState.tile_size / 2, -mapState.tile_size / 2, mapState.tile_size, mapState.tile_size);
    }

}

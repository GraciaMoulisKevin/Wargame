import Game from "./Game";


export default abstract class System {

    private isActive: boolean = false;

    protected readonly game;

    constructor(game: Game) {
        this.game = game;
    }


    protected abstract onEnable();
    protected abstract onUpdate();
    protected abstract onDisable();

    public enable(): void {
        this.onEnable();

        this.isActive = true;
    }

    public update(): void {
        if(!this.isActive) return;

        this.onUpdate();
    }

    public disable(): void {
        this.isActive = false;

        this.onDisable();
    }

    public pause() : void {
        this.isActive = false;
    }

    public resume() : void {
        this.isActive = true;
    }

    public isEnabled() : boolean {
        return this.isActive;
    }

}

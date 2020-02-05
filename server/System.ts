

export default abstract class System {

    private isActive: boolean = false;

    public abstract onEnable();
    public abstract onUpdate();
    public abstract onDisable();

    public start(): void {
        this.onEnable();

        this.isActive = true;
    }

    public stop(): void {
        this.isActive = false;

        this.onDisable();
    }

}

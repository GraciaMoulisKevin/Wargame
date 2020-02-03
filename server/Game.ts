import Manager from "./Manager";

class Game {

    private readonly manager: Manager;
    public io;

    constructor() {

        this.manager = new Manager();

    }

    public getManager() {
        return this.manager;
    }

    public update(): void {
        setTimeout(() => {
            this.manager.update();
            this.update();
        }, 1000/60);
    }

    public start(io): void {
        this.io = io;
        this.update();
    }

}

export default new Game();

import Manager from "./Manager";

class Game {

    public readonly manager: Manager;
    public io;

    constructor() {

        this.manager = new Manager();

    }

    public update(): void {
        setTimeout(() => {
            //this.manager.update();
            this.update();
        }, 1000/60);
    }

    public start(io): void {
        this.io = io;
        this.update();
    }

}

export default new Game();

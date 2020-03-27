import Manager from "./Manager";
import Service from "./Service";

export default class Game {

    public readonly manager: Manager;

    private services = {};

    public io;

    constructor() {

        this.manager = new Manager(this);

    }

    public registerService(serviceName: string, service: Service): void {
        this.services[serviceName] = service;
    }

    public getService(serviceName:string): Service {
        return this.services[serviceName];
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


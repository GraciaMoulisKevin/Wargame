

export default class Component {

    private readonly name: string;
    private state: object;

    constructor(name: string, state: object) {
        this.name = name;
        this.state = state;
    }

    public getName() {
        return this.name;
    }

    public getState() {
        return this.state;
    }

    public setState(state: object) {
        this.state = state;
    }


}

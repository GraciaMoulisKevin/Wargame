let nextId = 0;

export default class Entity {

    public readonly id: number;

    constructor() {

        // Unique ID yo
        this.id = nextId++;

    }


}

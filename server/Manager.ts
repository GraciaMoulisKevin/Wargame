import * as assert from "assert";
import EventHandler from "./EventHandler";

export default class Manager {

    private defaultComponents: object = {};

    private componentsData: object = {};

    private lastId: number = 0;
    private deleteEntities: number[] = [];

    public readonly eventHandler: EventHandler = new EventHandler();

    private getNextId(): number {
        if(this.deleteEntities.length > 0) return this.deleteEntities.pop();

        return this.lastId++;
    }

    public registerComponent(name: string, state: {}) {
        this.defaultComponents[name] = state;
        if(!this.componentsData[name]) this.componentsData[name] = [];
    }

    public createEntity(components: string[]): number {
        const entityId = this.getNextId();

        for(const component of components) {
            this.componentsData[component][entityId] = this.defaultComponents[component];
        }

        return entityId;
    }

    public deleteEntity(entityId: number) {
        this.deleteEntities.push(entityId);
        for(const component of Object.keys(this.componentsData)) {
            delete this.componentsData[component][entityId];
        }
    }

    public hasEntityComponents(entityId: number, components: string[]): boolean {
        for(const component of components) {
            if(!this.componentsData[component][entityId]) return false;
        }

        return true;
    }

    public getEntitiesByComponents(components: string[]) {
        let entities = [];
        for(const index in this.componentsData[components[0]]) {
            if(this.hasEntityComponents(+index, components)) entities.push(index);
        }
    }

}

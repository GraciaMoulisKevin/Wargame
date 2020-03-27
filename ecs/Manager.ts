import * as assert from "assert";
import EventHandler from "./EventHandler";
import System from "./System";
import Game from "./Game";

export default class Manager {

    private defaultComponents: object = {};

    private componentsData: object = {};

    private lastId: number = 0;
    private deleteEntities: number[] = [];

    private systems: object = {};

    private factories: object = {};

    public readonly eventHandler: EventHandler = new EventHandler();

    public readonly game: Game;

    constructor(game: Game) {
        this.game = game;
    }


    private getNextId(): number {
        if(this.deleteEntities.length > 0) return this.deleteEntities.pop();

        return this.lastId++;
    }

    public registerComponent(name: string, state: object): void {
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

    public setComponentDataForEntities(entities: number[], component: string, state: object) {
        entities.forEach(entityId => this.componentsData[component][entityId] = state);
    }

    public deleteEntity(entityId: number): void {
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

    /*
    query : {
        Component: {

        }
    }
     */
    public getEntitiesByComponents(components: string[], query?: object): number[] {
        let entities = [];
        for(const index in this.componentsData[components[0]]) {
            if(this.hasEntityComponents(+index, components)) {
                let select = true;
                if(query) {
                    for(const key of Object.keys(query)) {
                        if(this.hasEntityComponents(+index, [key]))  {
                            const entityComponent = this.getComponentDataByEntity(+index, key);
                            const queryComponent = query[key];
                            for(const compKey of Object.keys(queryComponent)) {
                                if(entityComponent[compKey] !== queryComponent[compKey]) {
                                    select = false;
                                    break;
                                }
                            }
                        }
                        if(!select) break;
                    }
                }
                if(select) entities.push(+index);
            }
        }

        return entities;
    }

    public getComponentDataByEntity(entityId: number, component: string): object {
        return this.componentsData[component][entityId];
    }

    public registerSystem(systemName: string, system: System): void {
        this.systems[systemName] = system;
    }

    public enableSystem(systemName: string) {
        this.systems[systemName].enable();
    }

    public disableSystem(systemName: string) {
        this.systems[systemName].disable();
    }

    public isSystemEnabled(systemName: string) {
        return this.systems[systemName].isEnabled();
    }

    public pauseSystem(systemName: string) {
        this.systems[systemName].pause();
    }

    public resumeSystem(systemName: string) {
        this.systems[systemName].resume();
    }

    public getSystemsNames(): string[] {
        return Object.keys(this.systems);
    }

    public update(): void {
        for(const system of Object.keys(this.systems)) {
            this.systems[system].update();
        }
    }

    public createFactory(entityName: string, components: {}) {
        this.factories[entityName] = components;
    }

}

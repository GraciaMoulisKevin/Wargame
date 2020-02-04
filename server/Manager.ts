export default class Manager {

    private defaultComponents: object;

    private componentsData: object;

    private lastId: number;
    private deleteEntities: [number];

    private getNextId(): number {
        if(this.deleteEntities.length > 0) return this.deleteEntities.pop();

        return this.lastId++;
    }

    public createEntity(components: [string]): number {
        const entityId = this.getNextId();

        for(const component of components) {
            this.componentsData[component][entityId] = this.defaultComponents[component];
        }

        return entityId;
    }

    public deleteEntity(entityId: number) {
        this.deleteEntities.push(entityId);
        for(const component of Object.keys(this.componentsData)) {
            this.componentsData[component][entityId] = undefined;
        }
    }


}

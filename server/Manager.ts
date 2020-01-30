import Entity from "./Entity";
import Component from "./Component";


export default class Manager {

    private componentTypes = [];

    private components = {};

    private entities = [];

    public addComponentType(component: Component) {

        const componentName = component.getName();

        if(!this.componentTypes.some(componentType => componentType.name === componentName)) {
            this.componentTypes.push({name: componentName, component: component})

            if(!this.components[componentName])
                this.components[componentName] = [];

        } else {
            console.log(`Le component ${component.getName()} existe déjà.`);
        }

    }

    public addComponentsToEntity(entityId: number, components: [string]) {
        components.forEach(component => {
            if(this.componentTypes.some(componentType => componentType.name === component)) {

                this.components[component].push({entityId: entityId, state: { ...this.componentTypes.filter(c => c.name === component)[0].component.getState()} });

                console.log(`L'entité id : ${entityId} reçoit le composant ${component}.`);

            } else {
                console.log(`Le composant ${component} n'existe pas. L'entité ${entityId} ne reçoit ce composant.`);
            }
        });
    }

    public removeComponentsToEntity(entityId: number, components: [string]) {
        components.forEach(component => {
            if(this.componentTypes.some(componentType => componentType.name === component)) {

                this.components[component] = this.components[component].filter(c => c.entityId !== entityId);

                console.log(`L'entité id : ${entityId} perd le composant ${component}.`);

            } else {
                console.log(`Le composant ${component} n'existe pas. L'entité ${entityId} ne va pas perdre ce composant.`);
            }
        });
    }

    public createEntity(components?: [string]) {

        let entity = new Entity();

        console.log(`L'entité id : ${entity.id} a été créée.`);

        if(components.length > 0)
            this.addComponentsToEntity(entity.id, components);

        this.entities.push(entity);
    }

    public getEntitiesComposedBy(components: [string]) {
        let entities = [];

        return components.forEach(componentName => {
            // J'étais en train de faire ça
        });
    }

}

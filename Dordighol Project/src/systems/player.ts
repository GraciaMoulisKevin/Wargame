import { Color } from "./color";
import { Entity } from "./entity";
import { Structure } from "./structure";

export class Player {
	username : String;
	color : Color;
	entitys : Array<Entity>;
	structures : Array<Structure>;

	constructor(user : String, c : Color){
		this.username = user;
		this.color = c;
		this.entitys = new Array<Entity>();
		this.structures = new Array<Structure>();
	}

	getUsername():String{
		return this.username;
	}

	getColor():Color{
		return this.color;
	}

	getEntitys():Array<Entity>{
		return this.entitys; 
	}
	
	getStructures():Array<Structure>{
		return this.structures; 
	}
	
}
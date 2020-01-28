import { Color } from "./color";
import { GraphicElement } from "../ClassesEntites/graphicelement";

export class Player {
	username : String;
	color : Color;
	elements : Array<GraphicElement>;

	constructor(user : String, c : Color){
		this.username = user;
		this.color = c;
		this.elements = new Array<GraphicElement>();
	}

	getUsername():String{
		return this.username;
	}

	getColor():Color{
		return this.color;
	}

	getElements():Array<GraphicElement>{
		return this.elements; 
	}
	
}
/**
 * Author : Canta Thomas
 * 
 * Git Repository : https://github.com/GraciaMoulisKevin/Wargame
 * 
 * Copyright : 2020 Ⓒ
 */

const foregroundStyles = { left: "100px", top: "100px", opacity: 1, transform: "scale(1,1)" };
const undergroundStyles = { left: "-250px", top: "50px", opacity: 0.2, transform: "scale(0.7,0.7)" };

class Map{
    
    constructor(game, level, type){
        this.game = game;

        this.mapWidth = game.getWidth();
        this.mapHeight = game.getHeight();

        this.hexagons = [];
        this.gameObject = [];
        this.level = level;

        this.type = type;
        this.actualPosition = (this.type == "foreground")? 1 : 0; 

        this.addAttrs();
        this.addStyles();
    }

    // GET METHOD
    getActualPosition(){return this.actualPosition;}
    getWidth(){return this.mapWidth;}
    getHeight(){return this.mapHeight;}
    getStyles(){ return (this.type == "foreground")? foregroundStyles : undergroundStyles;}
    getHexagons(){return this.hexagons;}

    // SET METHOD
    setWidth(width){return this.mapWidth = width;}
    setHeight(height){return this.mapHeight = height;}
    setType(type){this.type = type;}
    setScale(scale){this.scale = scale;}
    setActualPosition(position){this.actualPosition = position;}
    setHexagonsAs(indexes, type){
        for (let i=0; i < indexes.length; i++){
            this.hexagons[indexes[i]].setType(type);
        }
    }
    restoreHexagonsType(indexes){
        for (let i=0; i < indexes.length; i++){
            this.hexagons[indexes[i]].setType(this.hexagons[indexes[i]].getSaveType());
        }  
    }

    // ADD METHOD
    addAttrs(){d3.select(`#${this.type}-map`).attrs({ "width": this.mapWidth, "height": this.mapHeight});}
    addStyles(){d3.select(`#${this.type}-map`).styles(this.getStyles());}

    // BUILD MAP
    buildMap(){
        this.hexagons = buildLevel(this, this.level, this.type);
    }

    draw(ctx){
        [...this.hexagons, ...this.gameObject].forEach(element => {
            element.draw(ctx);
        });
    }

}
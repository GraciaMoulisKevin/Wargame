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

        this.hexagonsAvailable = [];

        this.addAttrs();
        this.addStyles();
    }

    // GET METHOD
    getActualPosition(){return this.actualPosition;}
    getWidth(){return this.mapWidth;}
    getHeight(){return this.mapHeight;}
    getStyles(){ return (this.type == "foreground")? foregroundStyles : undergroundStyles;}
    getHexagon(index){ return this.hexagons[index]; }
    getHexagons(){return this.hexagons;}
    getMaxHexagonsOnDiagonal(){ return Math.abs(this.hexagons[0].x * 2)+1;}
    getIndex(hexagon){
        let start = 0, middle = Math.floor(this.hexagons.length / 2), end = this.hexagons.length;

        while ( this.hexagons[middle].x != hexagon.x){
            if (this.hexagons[middle].x < hexagon.x){
                start = middle+1;
            } else {
                end = middle-1;
            }
            middle = Math.floor((start + end) / 2);
        }

        while ( this.hexagons[middle].y != hexagon.y ){
            if ( this.hexagons[middle].y < hexagon.y ){
                middle++;
            } else {
                middle--;
            }
        }

        return middle;
    }
    getNeighbors(hexagon){

        let index = this.getIndex(hexagon);
        let max = (hexagon.x < 0)? this.getMaxHexagonsOnDiagonal() + hexagon.x : this.getMaxHexagonsOnDiagonal() - hexagon.x;
        let neighbors;

        if ( hexagon.x < 0 ){
            neighbors = [index-max, index-max+1, index-1, index+1, index+max, index+max+1];
        } else if ( hexagon.x == 0 ){
            neighbors = [index-max, index-max+1, index-1, index+1, index+max-1, index+max];
        } else {
            neighbors = [index-max-1, index-max, index-1, index+1, index+max-1, index+max];
        }

        for (let i=0; i < neighbors.length; i++){
            if ( neighbors[i] < 0 || neighbors[i] >= this.hexagons.length){
                neighbors.splice(i, 1);
                i--;
            }
        }
        return neighbors;
    }
    // SET METHOD
    setWidth(width){return this.mapWidth = width;}
    setHeight(height){return this.mapHeight = height;}
    setType(type){this.type = type;}
    setScale(scale){this.scale = scale;}
    setActualPosition(position){this.actualPosition = position;}
    setHexagonsAs(indexes, type){
        this.hexagonsAvailable = indexes;
        for (let i=0; i < indexes.length; i++){
            if ( indexes[0][i] >= 0 && indexes[0][i] < this.hexagons.length ){
                console.log()
                this.hexagons[indexes[0][i]].setType(type);
            }
        }
    }
    restoreHexagonsType(){
        for (let i=0; i < this.hexagonsAvailable.length; i++){
            this.hexagons[this.hexagonsAvailable[i]].setType(this.hexagons[this.hexagonsAvailable[i]].getSaveType());
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
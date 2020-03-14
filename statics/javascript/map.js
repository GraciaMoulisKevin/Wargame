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
    getHexagonsAvailable(){return this.hexagonsAvailable;}
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
        let max = this.getMaxHexagonsOnDiagonal() - Math.abs(hexagon.x);
        let neighbors = [];
        let data = this.getTopAndBot(hexagon.x);

        if (index == data[1].top){
            if (hexagon.x == 0){
                neighbors = [data[2].top, index-1, data[0].top];
            } else if (hexagon.x < 0){
                neighbors = [data[2].top, index-1, data[0].top-1, data[0].top];
            } else {
                neighbors = [data[0].top-1, data[0].top, index-1, data[2].top];
            }
        } else if (index == data[1].bot){
            if (hexagon.x == 0){
                neighbors = [data[0].bot, index+1, data[2].bot];
            } else if (hexagon.x < 0){
                neighbors = [data[2].bot, index+1, data[0].bot, data[0].bot+1];
            } else {
                neighbors = [data[0].bot, data[0].bot+1, index+1, data[2].bot];
            }
        } else if (hexagon.x < 0){
            neighbors = [index-max, index-max+1, index-1, index+1, index+max, index+max+1];
        } else if (hexagon.x == 0){
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
    /**
     * Return array of three object. Each object contain the top and bottom hexagon index of x-1, x and x+1 position
     * @param x
     * @returns {[]}
     */
    getTopAndBot(x) {
        let centerIndex = Math.floor(this.hexagons.length/2);
        let top = centerIndex + (this.getMaxHexagonsOnDiagonal()-1)/2;
        let bot = centerIndex - (this.getMaxHexagonsOnDiagonal()-1)/2;
        let temp = [];

        if (x == 0){
            temp.push({top: top - this.getMaxHexagonsOnDiagonal(), bot: bot - this.getMaxHexagonsOnDiagonal() + 1});
            temp.push({top: top, bot: bot});
            temp.push({top: top + this.getMaxHexagonsOnDiagonal() - 1, bot: bot + this.getMaxHexagonsOnDiagonal()});
        } else {
            if ( Math.abs(x) == 1 ){
                temp.push({top: top, bot: bot});
            }
            let i = 0;
            while (i <= Math.abs(x) + 1) {
                if (x < 0) {
                    top -= this.getMaxHexagonsOnDiagonal() - i;
                    bot -= this.getMaxHexagonsOnDiagonal() - 1 - i;
                } else {
                    top += this.getMaxHexagonsOnDiagonal() - 1 - i;
                    bot += this.getMaxHexagonsOnDiagonal() - i;
                }

                if (i == (Math.abs(x)) - 2 || i == (Math.abs(x)) - 1 || i == (Math.abs(x))) {
                    temp.push({top: top, bot: bot});
                }
                i++;
            }
        }
        return temp;
    }
    getMovementPointRequire(hexagon){
        let type = hexagon.getSaveType();
        switch(type){
            case "grass":
                return 1;
            case "forest":
                return 2;
            case "sand":
                return 2;
            case "snow":
                return 2;
            case "urban":
                return 1;
            case "volcano":
                return 4;
            case "water":
                return 3;
            case "mountain":
                return 4;
        }
        return 999;
    }

    // SET METHOD
    setWidth(width){return this.mapWidth = width;}
    setHeight(height){return this.mapHeight = height;}
    setType(type){this.type = type;}
    setScale(scale){this.scale = scale;}
    setActualPosition(position){this.actualPosition = position;}
    setHexagonsAs(indexes, type){
        this.hexagonsAvailable = indexes;
        for (let i=1; i < indexes.length; i++){
            if ( indexes[i][0] >= 0 && indexes[i][0] < this.hexagons.length ){
                this.hexagons[indexes[i][0]].setType(type);
            }
        }
    }
    restoreHexagonsType(){
        for (let i=0; i < this.hexagonsAvailable.length; i++){
            this.hexagons[this.hexagonsAvailable[i][0]].setType(this.hexagons[this.hexagonsAvailable[i][0]].getSaveType());
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
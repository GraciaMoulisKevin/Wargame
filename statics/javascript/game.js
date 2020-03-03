/**
 * Author : Canta Thomas
 * 
 * Git Repository : https://github.com/GraciaMoulisKevin/Wargame
 * 
 * Copyright : 2020 Ⓒ
 */

const levels = {
    LEVEL1 : "level1.json",
    LEVEL2 : "level2.json"
}

class Game{
    
    constructor(gameWidth, gameHeight, type, scale){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        this.hexagons = [];
        this.gameObject = [];

        this.levels = [levels.LEVEL1, levels.LEVEL2];
        this.currentLevel = 0;

        this.type = type;
        this.scale = scale;
    }

    setWidth(width){
        d3.select(`#${this.type}-map`).attr("width", width);
    }
    setHeight(height){
        d3.select(`#${this.type}-map`).attr("height", height);
    }
    setScale(scale){
        d3.select(`#${this.type}-map`).style("scale", `(${this.scale}, ${this.scale})`);
    }

    start(){
        this.setWidth(this.gameWidth);
        this.setHeight(this.gameHeight);
        this.setScale(this.scale);
        
        this.hexagons = buildLevel(this, this.levels[this.currentLevel]);
    }

    draw(ctx){
        [...this.hexagons, ...this.gameObject].forEach(element => {
            element.draw(ctx);
        });
    }
}
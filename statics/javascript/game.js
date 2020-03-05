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
    
    constructor(gameWidth, gameHeight, level){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        this.levels = [levels.LEVEL1, levels.LEVEL2];
        this.currentLevel = level;
    }

    getWidth(){
        return this.gameWidth
    }

    getHeight(){
        return this.gameHeight;
    }

    addMap(type){
        return new Map(this, this.levels[this.currentLevel], type);
    }

    switch(foregroundMap, undergroundMap){

        if ( foregroundMap.getActualPosition() == 1 ){
            
            d3.select(`#${foregroundMap.type}-map`).transition().styles(undergroundStyles);
            foregroundMap.setActualPosition(0);
            
            d3.select(`#${undergroundMap.type}-map`).transition().styles(foregroundStyles);
            undergroundMap.setActualPosition(1);

        } else {

            d3.select(`#${undergroundMap.type}-map`).transition().styles(undergroundStyles);
            undergroundMap.setActualPosition(0);
            
            d3.select(`#${foregroundMap.type}-map`).transition().styles(foregroundStyles);
            foregroundMap.setActualPosition(1);
        }
    }
}
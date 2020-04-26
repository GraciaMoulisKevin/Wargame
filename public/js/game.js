/**
 * Author : Canta Thomas
 * 
 * Git Repository : https://github.com/GraciaMoulisKevin/Wargame
 * 
 * Copyright : 2020 Ⓒ
 */

const levels = {
    LEVEL1 : "../public/data/level1.json",
    LEVEL2 : "../public/data/level2.json"
}

class Game{
    
    constructor(gameWidth, gameHeight, level){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        this.levels = [levels.LEVEL1, levels.LEVEL2];
        this.currentLevel = level; // if we asked level 1 we need to get this.levels[0]
    }

    getWidth(){
        return this.gameWidth
    }

    getHeight(){
        return this.gameHeight;
    }

    getLevel(){
        return this.levels[this.currentLevel];
    }

    addMap(type){
        return new Map(this, this.getLevel(), type);
    }

    switch(foregroundMap, undergroundMap){

        
        if ( foregroundMap.getActualPosition() == 1 ){
            
            d3.select(`#${foregroundMap.type}-map`).transition().styles(undergroundStyles);
            foregroundMap.setActualPosition(0);
            
            d3.select(`#${undergroundMap.type}-map`).transition().styles(foregroundStyles);
            undergroundMap.setActualPosition(1);

            foregroundCanvas.parentNode.insertBefore(foregroundCanvas,foregroundCanvas.parentNode.firstChild);
        } else {

            d3.select(`#${undergroundMap.type}-map`).transition().styles(undergroundStyles);
            undergroundMap.setActualPosition(0);
            
            d3.select(`#${foregroundMap.type}-map`).transition().styles(foregroundStyles);
            foregroundMap.setActualPosition(1);
            
            undergroundCanvas.parentNode.insertBefore(undergroundCanvas,undergroundCanvas.parentNode.firstChild);
        }
    }
}
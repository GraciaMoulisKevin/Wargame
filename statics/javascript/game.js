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
    
    constructor(gameWidth, gameHeight){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        this.levels = [levels.LEVEL1, levels.LEVEL2];
        this.currentLevel = 0;
    }

    createForegroundMap(){
        return new Map(this, this.levels[this.currentLevel], "foreground");
    }
    createUndergroundMap(){
        return new Map(this, this.levels[this.currentLevel], "underground");
    }

    // switch(scale){
    //     this.setScale(scale);
    //     this.setOffsetLeft();
    // }
}
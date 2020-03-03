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

        this.hexagons = [];
        this.gameObject = [];

        this.levels = [levels.LEVEL1, levels.LEVEL2];
        this.currentLevel = 0;
    }

    createMaps(){
        Map(this, this.level[this.currentLevel], "underground");
        Map(this, this.level[this.currentLevel], "foreground");
    }
    
    draw(ctx){
        [...this.hexagons, ...this.gameObject].forEach(element => {
            element.draw(ctx);
        });
    }
}
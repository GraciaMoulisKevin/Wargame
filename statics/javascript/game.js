/**
 * Author : Canta Thomas
 * 
 * Git Repository : https://github.com/GraciaMoulisKevin/Wargame
 * 
 * Copyright : 2020 Ⓒ
 */

require('./hexagon');

export default class Game{
    
    constructor(gameWidth, gameHeight){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.gameHexagons = [];
    }

    start(){

        this.gameHexagons = buildLevel(this);

    }

};

module.exports.Game = Game;
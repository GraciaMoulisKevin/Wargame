/**
 * Author : Canta Thomas
 *
 * Git Repository : https://github.com/GraciaMoulisKevin/Wargame
 *
 * Copyright : 2020 Ⓒ
 */

class Unit{
    constructor(type, x, y){
        this.type = type;
        this.coordinateX = x;
        this.coordinateY = y;
    }

    draw(ctx){
        [...this.hexagons, ...this.gameObject].forEach(element => {
            element.draw(ctx);
        });
    }
};
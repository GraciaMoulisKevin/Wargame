/**
 * Author : Canta Thomas
 *
 * Git Repository : https://github.com/GraciaMoulisKevin/Wargame
 *
 * Copyright : 2020 Ⓒ
 */

const UNIT_WIDTH = 50;
const UNIT_HEIGHT = 70;

class Unit{
    constructor(type, x, y){
        this.type = type;
        this.x = x;
        this.y = y;
    }

    getImage(){
        return document.getElementById("asset-" + this.type);
    }

    draw(ctx){
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.drawImage(this.getImage(), -UNIT_WIDTH/2, -UNIT_HEIGHT/2, UNIT_WIDTH*0.6, UNIT_HEIGHT*0.6);
        ctx.restore();
    }
}
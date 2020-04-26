/**
 * Author : Canta Thomas
 * 
 * Git Repository : https://github.com/GraciaMoulisKevin/Wargame
 * 
 * Copyright : 2020 Ⓒ
 */

class Hexagon extends Elements {

    constructor(map, x, y, z, type, size) {
        super(map, x, y, z, type);
        this.size = size;

        this.saveType = type;
        this.center = getCenterCoordinate(this.map, this.x, this.y, this.z);
    }
    
    // GET METHOD
    getSaveType(){
        return this.saveType;
    }

    // SET METHOD
    setType(type){this.type = type;}

    draw(ctx) {
        ctx.save();
        ctx.translate(this.center.x, this.center.y);
        if ( this.type === "available" ){
            ctx.globalAlpha = 0.02;
        }
        ctx.drawImage(super.getImage(), -this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}
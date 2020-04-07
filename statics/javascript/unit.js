/**
 * Author : Canta Thomas
 *
 * Git Repository : https://github.com/GraciaMoulisKevin/Wargame
 *
 * Copyright : 2020 Ⓒ
 */


class Unit extends Elements{
    constructor(map, x, y, z, type, width, height){
        super(map, x, y, z, type);

        this.width = width;
        this.height = height;

        this.center = getCenterCoordinate(this.map, this.x, this.y, this.z);
    }

    draw(ctx){
        ctx.save();
        ctx.translate(this.center.x, this.center.y);
        ctx.drawImage(super.getImage(), -this.width/2, -this.height/2, this.width, this.height);
        ctx.beginPath();
        ctx.rect(-this.width/2, -this.height/2, this.width, this.height);
        ctx.stroke();
        ctx.restore();
    }
}
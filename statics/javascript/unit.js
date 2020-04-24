/**
 * Author : Canta Thomas
 *
 * Git Repository : https://github.com/GraciaMoulisKevin/Wargame
 *
 * Copyright : 2020 Ⓒ
 */

const speed = 1;

class Unit extends Elements{
    constructor(map, x, y, z, type, width, height, player){
        super(map, x, y, z, type);

        this.width = width;
        this.height = height;

        this.center = getCenterCoordinate(this.map, this.x, this.y, this.z);

        this.player = player;
    }

    getCenter(){
        return this.center;
    }

    draw(ctx){
        ctx.save();
        ctx.translate(this.center.x, this.center.y);
        ctx.drawImage(super.getImage(), -this.width/2, -this.height/2, this.width, this.height);
        ctx.restore();
    }

    update(deltaTime, nextHexagon) {
        if ( this.center.y < nextHexagon.center.y ){
            this.center.y += speed;
        } else if ( this.center.y > nextHexagon.center.y ) {
            this.center.y -= speed;
        }

        if ( this.center.x < nextHexagon.center.x ){
            this.center.x += speed;
        } else if ( this.center.x > nextHexagon.center.x ) {
            this.center.x -= speed;
        }

        if ( this.center.x === nextHexagon.center.x && this.center.y === nextHexagon.center.y ){
            this.setCoordinate(nextHexagon.x, nextHexagon.y, nextHexagon.z);
        }
    }
}
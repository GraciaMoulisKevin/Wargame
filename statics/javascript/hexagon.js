/**
 * Author : Canta Thomas
 * 
 * Git Repository : https://github.com/GraciaMoulisKevin/Wargame
 * 
 * Copyright : 2020 Ⓒ
 */

export default class Hexagon {

    constructor(data, x, y) {

        this.center_x = x;
        this.center_y = y;
        this.x = data.x;
        this.y = data.y;
        this.z = data.z;
        this.type = data.type;

        if (this.isCorrectCoordinate(this.x, this.y, this.z)) {
            this.createHexagon();
        } else {
            logMessage({
                "type": "war",
                "message": " Hexagon::Constructor() : Invalid coordinate (" + this.x + ", " + this.y + ", " + this.z + ")"
            });
        }
    }

    isCorrectCoordinate(x, y, z) { return ((x + y + z) == 0); }

    getImage(){ return document.getElementById("asset-" + this.type); }

    draw(ctx) {

        let canvas = document.getElementById('foreground-map');
        let ctx = canvas.getContext("2d");

        ctx.save();

        ctx.translate(this.center_x, this.center_y);

        ctx.rotate(degreeToRadian(-89.27));

        ctx.drawImage(this.getImage(), -HEX_SIZE / 2, -HEX_SIZE / 2, HEX_SIZE, HEX_SIZE);

        ctx.restore();
    }
}
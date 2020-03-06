/**
 * Author : Canta Thomas
 * 
 * Git Repository : https://github.com/GraciaMoulisKevin/Wargame
 * 
 * Copyright : 2020 Ⓒ
 */

class Hexagon {

    constructor(map, x, y, z, type, size) {
        this.map = map;
        
        this.x = x;
        this.y = y;
        this.z = z;

        this.type = type;
        this.size = size;

        this.saveType = type;
        this.center = this.getCenterCoordinateOfHexagons(x, y, z);
    }
    
    // GET METHOD
    getSaveType(){return this.saveType;}
    getImage(){return document.getElementById("asset-" + this.type);}
    
    /**
     * Get axial coordinates representing the center of an hexagon
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    getCenterCoordinateOfHexagons(x, y, z) {

        let x_spacing = (Math.sqrt(3) / 2) * this.size / 2; // size of the inscribed circle
        let z_spacing = (3 / 4) * this.size;

        let x_center = this.map.getWidth() / 2 + (x * x_spacing) + (-y * x_spacing);
        let y_center = this.map.getHeight() / 2 + (z * z_spacing);

        return { "x": x_center, "y": y_center };
    }
    
    // SET METHOD
    setType(type){this.type = type;}

    // FUNCTION
    isCorrectCoordinate(x, y, z) {return ((x + y + z) == 0);}
    
    degreeToRadian(deg) {return Math.PI * deg / 180;}

    draw(ctx) {
        ctx.save();
        ctx.translate(this.center.x, this.center.y);
        ctx.drawImage(this.getImage(), -this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

// ctx.rotate(this.degreeToRadian(-89.27)); 
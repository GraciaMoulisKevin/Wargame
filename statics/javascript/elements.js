/**
 * Author : Canta Thomas
 *
 * Git Repository : https://github.com/GraciaMoulisKevin/Wargame
 *
 * Copyright : 2020 Ⓒ
 */

class Elements{
    constructor(map, x, y, z, type){
        this.map = map;

        this.x = x;
        this.y = y;
        this.z= z;

        this.type = type;
    }

    setCoordinate(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }
    

    getImage(){
        return document.getElementById("asset-" + this.type);
    }
}
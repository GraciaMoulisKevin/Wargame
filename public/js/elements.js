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

    getCoordinate(){
        return { x : this.x, y : this.y, z : this.z };
    }

    getImage(){
        return document.getElementById("asset-" + this.type);
    }

    setMap(map){
        this.map = map;
    }
    
    setCoordinate(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }

}
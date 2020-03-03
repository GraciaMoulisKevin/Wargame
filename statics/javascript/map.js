/**
 * Author : Canta Thomas
 * 
 * Git Repository : https://github.com/GraciaMoulisKevin/Wargame
 * 
 * Copyright : 2020 Ⓒ
 */

class Map{
    
    constructor(game, level, type){
        this.game = game;

        this.hexagons = [];
        this.gameObject = [];

        this.level = level;

        this.type = type;
        this.scale = scale;
    }

    setWidth(width){
        d3.select(`#${this.type}-map`).attr("width", width);
    }

    setHeight(height){
        d3.select(`#${this.type}-map`).attr("height", height);
    }

    setType(type){
        this.type = type;
    }

    setScale(scale){
        this.scale = scale;
        d3.select(`#${this.type}-map`).style("transform", `scale(${this.scale}, ${this.scale})`);
    }

    setOffsetLeft(){
        if ( this.scale == 1 ){
            d3.select(`#${this.type}-map`).style("left", "0");
        } else {
            d3.select(`#${this.type}-map`).style("left", "-250px");
        }
    }
    setOffsetTop(){
        d3.select(`#${this.type}-map`).style("top", "200px");
    }

    setAttrs(){
        this.setWidth(this.gameWidth);
        this.setHeight(this.gameHeight);
    }

    setStyles(){
        this.setScale(this.scale);
        this.setOffsetTop();
        this.setOffsetLeft();
    }

    switch(scale){
        this.setScale(scale);
        this.setOffsetLeft();
    }

}
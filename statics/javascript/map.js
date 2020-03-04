/**
 * Author : Canta Thomas
 * 
 * Git Repository : https://github.com/GraciaMoulisKevin/Wargame
 * 
 * Copyright : 2020 Ⓒ
 */

const scales = {
    "foreground": 1,
    "underground": 0.7
}

class Map{
    
    constructor(game, level, type){
        this.game = game;

        this.hexagons = [];
        this.gameObject = [];

        this.level = level;

        this.type = type;
    }

    getScale(){
        if ( type == "foreground" ){
            return 1;
        } else {
            return 0.7;
        }
    }

    setWidth(width){
        return this.width = width;
    }

    setHeight(height){
        return this.height = height;
    }

    setType(type){
        this.type = type;
    }

    setScale(scale){
        this.scale = scale;
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
        d3.select(`#${this.type}-map`)
        .attrs({
            "width": this.width,
            "height": this.height
        });
    }

    setStyles(){
        d3.select(`#${this.type}-map`)
        .styles({
            "top": this.getOffsetTop(),
            "left": this.getOffsetLeft(),
            "transform": `scale(${this.getScale()}, ${this.getScale()})`
        });
    }
    
    start(){
        this.setAttrs();
        this.setStyles();
        this.hexagons = buildLevel(this, this.level);
    }

    draw(ctx){
        [...this.hexagons, ...this.gameObject].forEach(element => {
            element.draw(ctx);
        });
    }

}
/**
 * Author : Canta Thomas
 * 
 * Git Repository : https://github.com/GraciaMoulisKevin/Wargame
 * 
 * Copyright : 2020 Ⓒ
 */

function menu(){
    let menu = d3.select("#container-menu");

    if ( menu.style("display") == "none" ){
        $("#container-menu").show();
    }else{
        $("#container-menu").hide();
    }
}
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

        this.maxHealthPoints = 20;
        this.healthPoints = 20;
        this.attack = 2;

        /**
         * 0 => normal
         * 1 => fighting
         */
        this.state = 0
    }

    getHealthPoints(){
        return this.healthPoints;
    }

    getMaxHealthPoints(){
        return this.maxHealthPoints;
    }

    getAttack(){
        return this.attack;
    }

    getCenterPositionX(){
        return this.center.x;
    }

    getCenterPositionY(){
        return this.center.y;
    }

    getCenter(){
        return this.center;
    }

    getPlayer(){
        return this.player;
    }

    getState(){
        return this.state;
    }

    setCenter(x, y){
        this.center = {x : x, y: y};
    }

    setHealtPoints( healthPoints ){
        this.healthPoints = healthPoints;
    }

    setState( state ){
        this.state = state;
    }

    resetCenterCoordinate(){
        this.center = getCenterCoordinate(this.map, this.x, this.y, this.z);
    }
    
    fight( unit ){
        let dps = getRandomInt(this.getAttack()+1);
        if ( unit.getHealthPoints() - dps <= 0 ){
            //console.log("Le joueur ", this.getPlayer(), " vient de tuer une unité du joueur ", unit.getPlayer());
            return 1;
        } else {
            //console.log("je lui inflige", dps, "dégats");
            unit.setHealtPoints(unit.getHealthPoints() - dps);
            return 0;
        }
    }

    draw(ctx){
        ctx.save();
        ctx.translate(this.center.x, this.center.y);
        ctx.drawImage(super.getImage(), -this.width/2, -this.height/2, this.width, this.height);

        // constant max health point bar
        ctx.beginPath();

        if ( this.getPlayer()%2 == 0 ){
            ctx.rect(this.width/2+10, -this.height/2+10, 5, this.height-12);
        } else {
            ctx.rect(-this.width/2-10, -this.height/2+10, 5, this.height-12);
        }
        
        ctx.fillStyle = "lightgray";
        ctx.lineWidth = "2";
        ctx.fill();
        ctx.stroke();

        // realtime health point bar
        ctx.beginPath();
        
        if ( this.getPlayer()%2 == 0 ){
            ctx.rect(this.width/2+10, -this.height/2+10, 5, (this.height-12)*((this.getHealthPoints()*5)/100));
        } else {
            ctx.rect(-this.width/2-10, -this.height/2+10, 5, (this.height-12)*((this.getHealthPoints()*5)/100));
        }

        if ( this.getHealthPoints() > (0.25*this.getMaxHealthPoints())){
            ctx.fillStyle = "lightgreen";
        } else {
            ctx.fillStyle = "red";
        }
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }

    update(deltaTime, nextHexagon) {
        if ( this.state == 0 ){
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
        } else {
            console.log("j'arrête de bouger car je suis en combat");
        }
    }
}
/**
 * Author : Canta Thomas
 *
 * Git Repository : https://github.com/GraciaMoulisKevin/Wargame
 *
 * Copyright : 2020 Ⓒ
 */

const foregroundStyles = {
    left: "300px",
    top: "100px",
    opacity: 1,
    transform: "scale(1,1)"
};
const undergroundStyles = {
    left: "-75px",
    top: "50px",
    opacity: 0.2,
    transform: "scale(0.7,0.7)"
};

class Map {

    constructor(game, level, type) {
        this.game = game;

        this.mapWidth = game.getWidth();
        this.mapHeight = game.getHeight();

        this.hexagons = [];
        this.gameObject = [];
        this.movements = [];
        this.level = level;

        this.type = type;
        this.actualPosition = (this.type == "foreground") ? 1 : 0;

        this.indexesOfModifiedHexagon = [];

        this.addAttrs();
        this.addStyles();
    }

    // GET METHOD
    getActualPosition() {
        return this.actualPosition;
    }
    getWidth() {
        return this.mapWidth;
    }
    getHeight() {
        return this.mapHeight;
    }
    getStyles() {
        return (this.type == "foreground") ? foregroundStyles : undergroundStyles;
    }
    getHexagon(index) {
        return this.hexagons[index];
    }
    getHexagons() {
        return this.hexagons;
    }
    getMaxHexagonsOnDiagonal() {
        return Math.abs(this.hexagons[0].x * 2) + 1;
    }
    getIndex(hexagon) {
        let start = 0,
            middle = Math.floor(this.hexagons.length / 2),
            end = this.hexagons.length;

        while (this.hexagons[middle].x != hexagon.x) {
            if (this.hexagons[middle].x < hexagon.x) {
                start = middle + 1;
            } else {
                end = middle - 1;
            }
            middle = Math.floor((start + end) / 2);
        }

        while (this.hexagons[middle].y != hexagon.y) {
            if (this.hexagons[middle].y < hexagon.y) {
                middle++;
            } else {
                middle--;
            }
        }

        return middle;
    }
    getNeighbors(hexagon) {

        let index = this.getIndex(hexagon);
        let max = this.getMaxHexagonsOnDiagonal() - Math.abs(hexagon.x);
        let neighbors = [];
        let data = this.getTopAndBot(hexagon.x);

        if (index == data[1].top) {
            if (hexagon.x == 0) {
                neighbors = [data[2].top, index - 1, data[0].top];
            } else if (hexagon.x < 0) {
                neighbors = [data[2].top, index - 1, data[0].top - 1, data[0].top];
            } else {
                neighbors = [data[0].top - 1, data[0].top, index - 1, data[2].top];
            }
        } else if (index == data[1].bot) {
            if (hexagon.x == 0) {
                neighbors = [data[0].bot, index + 1, data[2].bot];
            } else if (hexagon.x < 0) {
                neighbors = [data[2].bot, index + 1, data[0].bot, data[0].bot + 1];
            } else {
                neighbors = [data[0].bot, data[0].bot + 1, index + 1, data[2].bot];
            }
        } else if (hexagon.x < 0) {
            neighbors = [index - max, index - max + 1, index - 1, index + 1, index + max, index + max + 1];
        } else if (hexagon.x == 0) {
            neighbors = [index - max, index - max + 1, index - 1, index + 1, index + max - 1, index + max];
        } else {
            neighbors = [index - max - 1, index - max, index - 1, index + 1, index + max - 1, index + max];
        }

        for (let i = 0; i < neighbors.length; i++) {
            if (neighbors[i] < 0 || neighbors[i] >= this.hexagons.length) {
                neighbors.splice(i, 1);
                i--;
            }
        }

        return neighbors;
    }
    /**
     * Return array of three object. Each object contain the top and bottom hexagon index of x-1, x and x+1 position
     * @param x
     * @returns {[]}
     */
    getTopAndBot(x) {
        let centerIndex = Math.floor(this.hexagons.length / 2);
        let top = centerIndex + (this.getMaxHexagonsOnDiagonal() - 1) / 2;
        let bot = centerIndex - (this.getMaxHexagonsOnDiagonal() - 1) / 2;
        let temp = [];

        if (x == 0) {
            temp.push({
                top: top - this.getMaxHexagonsOnDiagonal(),
                bot: bot - this.getMaxHexagonsOnDiagonal() + 1
            });
            temp.push({
                top: top,
                bot: bot
            });
            temp.push({
                top: top + this.getMaxHexagonsOnDiagonal() - 1,
                bot: bot + this.getMaxHexagonsOnDiagonal()
            });
        } else {
            if (Math.abs(x) == 1) {
                temp.push({
                    top: top,
                    bot: bot
                });
            }
            let i = 0;
            while (i <= Math.abs(x) + 1) {
                if (x < 0) {
                    top -= this.getMaxHexagonsOnDiagonal() - i;
                    bot -= this.getMaxHexagonsOnDiagonal() - 1 - i;
                } else {
                    top += this.getMaxHexagonsOnDiagonal() - 1 - i;
                    bot += this.getMaxHexagonsOnDiagonal() - i;
                }

                if (i == (Math.abs(x)) - 2 || i == (Math.abs(x)) - 1 || i == (Math.abs(x))) {
                    temp.push({
                        top: top,
                        bot: bot
                    });
                }
                i++;
            }
        }
        return temp;
    }
    getMovementPointRequire(hexagon) {
        let type = hexagon.getSaveType();
        switch (type) {
            // foreground
            case "grass":
                return 1;
            case "forest":
                return 2;
            case "sand":
                return 2;
            case "snow":
                return 2;
            case "urban":
                return 1;
            case "volcano":
                return 4;
            case "water":
                return 3;
            case "mountain":
                return 4;
            // underground
            case "stone":
                return 1;
            case "iron":
                return 1;
            case "gold":
                return 2;
            case "diamond":
                return 4;
        }
        return 999;
    }
    /** TODO : maybe make this faster would be good in the future
     * Get all units on an hexagon
     * @param hexagon
     * @returns {number|{x: number, y: number}}
     */
    getUnitsOnHexagon(hexagon) {
        let units = [];

        for ( let unit of this.gameObject ){
            let hexagonCoordinate = hexagon.getCoordinate();
            let unitCoordinate = unit.getCoordinate();
            if ( hexagonCoordinate.x == unitCoordinate.x &&  hexagonCoordinate.y == unitCoordinate.y  &&  hexagonCoordinate.z == unitCoordinate.z ){
                units.push(unit);
            }
        }

        if ( units.length == 0 ){
            return null;
        } else if ( units.length == 1 ) {
            return units[0];
        } else {
            return units;
        }
    }
    getMovements(){
        return this.movements;
    }


    // SET METHOD
    setType(type) {
        this.type = type;
    }
    setActualPosition(position) {
        this.actualPosition = position;
    }
    setHexagonsAs(indexes, type, timer) {
        this.indexesOfModifiedHexagon = indexes;
        for (let i = 1; i < indexes.length; i++) {
            if (indexes[i] >= 0 && indexes[i] < this.hexagons.length) {
                this.hexagons[indexes[i]].setType(type);
            }
        }
        if (timer != null) {
            setTimeout(this.restoreHexagonsType.bind(this), timer);
        }
    }
    restoreHexagonsType() {
        for (let indexes of this.indexesOfModifiedHexagon) {
            this.hexagons[indexes].setType(this.hexagons[indexes].getSaveType());
        }
    }

    // ADD METHOD
    addAttrs() {
        d3.select(`#${this.type}-map`).attrs({
            "width": this.mapWidth,
            "height": this.mapHeight
        });
    }
    addStyles() {
        d3.select(`#${this.type}-map`).styles(this.getStyles());
    }
    addGameObject(unit) {
        this.gameObject.push(unit);
    }
    addMovement(unit, path){
        // remove first element because it's where the unit is actually located
        path.splice(0,1);
        
        this.movements.push([unit, path]);
    }
    removeGameObject( unit ){
        let i = 0;
        while ( this.gameObject[i] != unit ){
            i++;
        }
        // DEBUG
        //console.log("GameObject trouvé --> ", this.gameObject[i]);
        //console.log("Suppression...");

        this.gameObject.splice(i,1);
    }

    checkIfBattles(){
        let battles = []
        for ( let hexagon of this.hexagons ){
            let units = this.getUnitsOnHexagon(hexagon);
            if  ( units != null && units.length > 1 ){
                battles.push(units);
            }
        }
        return battles; 
    }

    setBattles(battles){
        for( let battle of battles ){
            for ( let unit of battle ){

                // if unit has not been move
                if ( unit.getState() != 1 ){
                    unit.setState(1);
                    unit.resetCenterCoordinate();
                    switch(unit.getPlayer()){
                        case 1:
                            unit.setCenter(unit.getCenterPositionX()-20, unit.getCenterPositionY()-35);
                            break;
                        case 2:
                            unit.setCenter(unit.getCenterPositionX()+20, unit.getCenterPositionY()-35);
                            break;
                        case 3:
                            unit.setCenter(unit.getCenterPositionX()-20, unit.getCenterPositionY()+5);
                            break;
                        case 4:
                            unit.setCenter(unit.getCenterPositionX()+20, unit.getCenterPositionY()+5);
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    }

    battleHandler(battle){
        let i = 0;
        for ( let unit of battle ){
            let target = i;

            while ( target == i && unit.getPlayer() == battle[target].getPlayer()){
                target = getRandomInt(battle.length);
            }

            let isKilled = unit.fight( battle[target] );

            if ( isKilled ){
                this.removeGameObject( battle[target] );
                battle.splice( target, 1 );
                if ( battle.length <= 1 ){
                    break;
                }
            }
            i++;
        }
        if ( battle.length == 1 ){
            battle[0].resetCenterCoordinate();
            battle[0].setState(0);
        }
    }

    // BUILD MAP
    async buildMap() {
        try {
            const data = await d3.json(`../data/${this.level}`);

            let hexagonSize = data.hexagon.size;
            
            for (let hexagon of data[this.type]) {
                this.hexagons.push(new Hexagon(this, hexagon.x, hexagon.y, hexagon.z, hexagon.type, hexagonSize));
            }
            
            for ( let unit of data["unit"]["spawner"][this.type] ){
                this.addGameObject( new Unit( this, unit.x, unit.y, unit.z, unit.type, UNIT.width, UNIT.height, unit.player ) )
            }

        } catch (e) {
            throw new Error("An error occurred while reading data !");
        }
    }

    draw(ctx) {
        [...this.hexagons, ...this.gameObject].forEach(element => {
            element.draw(ctx);
        });
    }

    update(deltaTime){
        let battles = this.checkIfBattles();
        if ( battles.length > 0 ){
            this.setBattles(battles);
            if ( deltaTime >= 1000 ){
                for ( let battle of battles ){
                    this.battleHandler(battle);
                }
            }
        }

        let i = 0;
        for( let object of this.movements ){
            let nextHexagon = this.getHexagon(object[1][0]);
            if ( nextHexagon.x != object[0].x || nextHexagon.y != object[0].y || nextHexagon.z != object[0].z ){
                object[0].update(deltaTime, nextHexagon);
            } else {
                object[1].shift();
            }

            if( object[1].length === 0 ){
                this.movements.splice(i,1);
            }
            i++;
        }
    }
}
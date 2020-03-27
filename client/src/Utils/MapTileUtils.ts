

export default class MapTileUtils {

    public static roundHexagonCoordinates(coordinates: {x: number, y: number, z: number}) : {x: number, y: number, z: number} {
        let x = Math.round(coordinates.x);
        let y = Math.round(coordinates.y);
        let z = Math.round(coordinates.z);

        const x_diff = Math.abs(x - coordinates.x);
        const y_diff = Math.abs(y - coordinates.y);
        const z_diff = Math.abs(z - coordinates.z);

        if ((x_diff >= y_diff) && (x_diff >= z_diff)) {
            x = -y - z;
        } else if (y_diff >= z_diff) {
            y = -x - z;
        } else {
            z = -x - y;
        }
        return { x: x,  y: y,  z: z };
    }

    public static getHexagonCoordinatesByPixels(coordinates: {x: number, y: number}, hexagonSize): {x: number, y: number, z: number} {
        let q = (Math.sqrt(3) / 3 * coordinates.x - 1 / 3 * coordinates.y) / (hexagonSize / 2);
        let r = (2 / 3 * coordinates.y) / (hexagonSize / 2);

        return this.roundHexagonCoordinates({x: q, y: -q - r, z: r});
    }
}

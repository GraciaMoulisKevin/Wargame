

export default class TextureManager {

    public static textures = {};

    public static addTexture(name: string, path: string) {
        const image = new Image();
        image.src = path;

        this.textures[name] = image;

        return image;
    }
}

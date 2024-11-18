export class HexColor {
    private readonly hex: string;

    constructor(hex: string) {
        if (!HexColor.isValidHex(hex)) {
            throw new Error("Invalid HEX color");
        }
        this.hex = HexColor.formatHex(hex);
    }

    static isValidHex(hex: string): boolean {
        const hexRegex = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
        return hexRegex.test(hex);
    }

    static formatHex(hex: string): string {
        if (!hex.startsWith("#")) {
            hex = `#${hex}`;
        }

        if (hex.length === 4) {
            hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
        }

        return hex.toLowerCase();
    }

    private hexToRgb(): { r: number, g: number, b: number } {
        let hex = this.hex.substring(1);
        if (hex.length !== 6) {
            throw new Error("Invalid HEX color");
        }
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return { r, g, b };
    }

    static fromRgb(r: number, g: number, b: number): HexColor {
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        return new HexColor(hex);
    }

    toString(): string {
        return this.hex;
    }
}
export class Color
{
    r!: number;
    g!: number;
    b!: number;

    constructor(r: number, g: number, b: number)
    {
        this.set(r, g, b);
    }

    set(r: number, g: number, b: number)
    {
        this.r = Color.clamp(r);
        this.g = Color.clamp(g);
        this.b = Color.clamp(b);
    }

    hueRotate(angle = 0)
    {
        angle = angle / 180 * Math.PI;
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        this.multiply([
            0.213 + cos * 0.787 - sin * 0.213,
            0.715 - cos * 0.715 - sin * 0.715,
            0.072 - cos * 0.072 + sin * 0.928,
            0.213 - cos * 0.213 + sin * 0.143,
            0.715 + cos * 0.285 + sin * 0.140,
            0.072 - cos * 0.072 - sin * 0.283,
            0.213 - cos * 0.213 - sin * 0.787,
            0.715 - cos * 0.715 + sin * 0.715,
            0.072 + cos * 0.928 + sin * 0.072,
        ]);
    }

    sepia(value = 1)
    {
        this.multiply([
            0.393 + 0.607 * (1 - value),
            0.769 - 0.769 * (1 - value),
            0.189 - 0.189 * (1 - value),
            0.349 - 0.349 * (1 - value),
            0.686 + 0.314 * (1 - value),
            0.168 - 0.168 * (1 - value),
            0.272 - 0.272 * (1 - value),
            0.534 - 0.534 * (1 - value),
            0.131 + 0.869 * (1 - value),
        ]);
    }

    saturate(value = 1)
    {
        this.multiply([
            0.213 + 0.787 * value,
            0.715 - 0.715 * value,
            0.072 - 0.072 * value,
            0.213 - 0.213 * value,
            0.715 + 0.285 * value,
            0.072 - 0.072 * value,
            0.213 - 0.213 * value,
            0.715 - 0.715 * value,
            0.072 + 0.928 * value,
        ]);
    }

    private multiply(matrix: number[])
    {
        const newR = Color.clamp(this.r * matrix[0] + this.g * matrix[1] + this.b * matrix[2]);
        const newG = Color.clamp(this.r * matrix[3] + this.g * matrix[4] + this.b * matrix[5]);
        const newB = Color.clamp(this.r * matrix[6] + this.g * matrix[7] + this.b * matrix[8]);
        this.r = newR;
        this.g = newG;
        this.b = newB;
    }

    brightness(value = 1)
    {
        this.linear(value);
    }

    contrast(value = 1)
    {
        this.linear(value, -(0.5 * value) + 0.5);
    }

    private linear(slope = 1, intercept = 0)
    {
        this.r = Color.clamp(this.r * slope + intercept * 255);
        this.g = Color.clamp(this.g * slope + intercept * 255);
        this.b = Color.clamp(this.b * slope + intercept * 255);
    }

    invert(value = 1)
    {
        this.r = Color.clamp((value + this.r / 255 * (1 - 2 * value)) * 255);
        this.g = Color.clamp((value + this.g / 255 * (1 - 2 * value)) * 255);
        this.b = Color.clamp((value + this.b / 255 * (1 - 2 * value)) * 255);
    }

    hsl()
    {
        const r = this.r / 255;
        const g = this.g / 255;
        const b = this.b / 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h!: number, s, l = (max + min) / 2;

        if (max === min) h = s = 0;
        else
        {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max)
            {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }

        return {
            h: h * 100,
            s: s * 100,
            l: l * 100,
        };
    }

    private static clamp(value: number): number
    {
        if (value > 255) value = 255;
        else if (value < 0) value = 0;
        return value;
    }

    static hexToRgb(hex: string): number[]
    {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) =>
        {
            return r + r + g + g + b + b;
        });

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return [
            parseInt(result![1], 16),
            parseInt(result![2], 16),
            parseInt(result![3], 16),
        ];
    }
}
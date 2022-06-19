export type RGB = [number, number, number];

export const randomRGB = (minIntensity: number, maxIntensity: number) => {
    const rgb = Array.from({ length: 3 }, () =>
        Math.round(Math.random() * maxIntensity)
    );
    if (rgb.every((c) => c < minIntensity)) {
        rgb[Math.floor(Math.random() * 3)] =
            Math.round(Math.random() * (maxIntensity - minIntensity)) + minIntensity;
    }
    return rgb as RGB;
};

export const rgbToRgbaString = (color: number[], alpha = 255) =>
    color.length > 2 ? `rgba(${color.slice(0, 4).join(', ')}, ${alpha})` : null;

export const randomRgbaString = (minIntensity: number, maxIntensity: number, alpha = 255) => rgbToRgbaString(randomRGB(minIntensity, maxIntensity), alpha)
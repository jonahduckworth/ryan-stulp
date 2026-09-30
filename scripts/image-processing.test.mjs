import sharp from "sharp";
import { describe, expect, it } from "vitest";

describe("image processing after native dependency updates", () => {
  it.each(["jpeg", "png", "webp", "avif"])(
    "decodes and resizes a benign %s image",
    async (format) => {
      const input = await sharp({
        create: {
          width: 32,
          height: 24,
          channels: 3,
          background: { r: 40, g: 90, b: 150 },
        },
      }).toFormat(format).toBuffer();

      const output = await sharp(input).resize({ width: 16 }).png().toBuffer();
      const metadata = await sharp(output).metadata();
      expect(metadata.format).toBe("png");
      expect(metadata.width).toBe(16);
      expect(metadata.height).toBe(12);
      const pixel = await sharp(output).removeAlpha().raw().toBuffer();
      expect(pixel[0]).toBeGreaterThan(30);
      expect(pixel[2]).toBeGreaterThan(140);
    },
  );
});

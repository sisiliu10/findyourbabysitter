import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.resolve(import.meta.dirname, '..', 'public');

// Warm coral/pink background color
const BG_COLOR = '#F06B5B';
const TEXT_COLOR = '#FFFFFF';

function createFaviconSVG(size) {
  // Scale everything relative to size
  const padding = Math.round(size * 0.08);
  const cornerRadius = Math.round(size * 0.2);
  const fontSize = Math.round(size * 0.48);
  const letterSpacing = Math.round(size * 0.02);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect x="${padding}" y="${padding}" width="${size - padding * 2}" height="${size - padding * 2}" rx="${cornerRadius}" ry="${cornerRadius}" fill="${BG_COLOR}"/>
  <text x="${size / 2}" y="${size / 2}"
    font-family="Arial Black, Arial, Helvetica, sans-serif"
    font-weight="900"
    font-size="${fontSize}px"
    letter-spacing="${letterSpacing}"
    fill="${TEXT_COLOR}"
    text-anchor="middle"
    dominant-baseline="central">BB</text>
</svg>`;
}

async function generatePNG(size, filename) {
  const svg = createFaviconSVG(size);
  const outputPath = path.join(PUBLIC_DIR, filename);
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(outputPath);
  console.log(`Created ${filename} (${size}x${size})`);
}

// ICO file format builder (multi-size)
function buildICO(pngBuffers) {
  // ICO header: 6 bytes
  // Each directory entry: 16 bytes
  // Then the PNG data for each image
  const numImages = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dirSize = dirEntrySize * numImages;

  let offset = headerSize + dirSize;
  const entries = [];

  for (const { width, buffer } of pngBuffers) {
    entries.push({ width, buffer, offset });
    offset += buffer.length;
  }

  const totalSize = offset;
  const ico = Buffer.alloc(totalSize);

  // ICO header
  ico.writeUInt16LE(0, 0);      // Reserved
  ico.writeUInt16LE(1, 2);      // Type: 1 = ICO
  ico.writeUInt16LE(numImages, 4); // Number of images

  // Directory entries
  let pos = 6;
  for (const { width, buffer, offset: imgOffset } of entries) {
    ico.writeUInt8(width < 256 ? width : 0, pos);     // Width
    ico.writeUInt8(width < 256 ? width : 0, pos + 1);  // Height
    ico.writeUInt8(0, pos + 2);                         // Color palette
    ico.writeUInt8(0, pos + 3);                         // Reserved
    ico.writeUInt16LE(1, pos + 4);                      // Color planes
    ico.writeUInt16LE(32, pos + 6);                     // Bits per pixel
    ico.writeUInt32LE(buffer.length, pos + 8);          // Size of image data
    ico.writeUInt32LE(imgOffset, pos + 12);             // Offset to image data
    pos += 16;
  }

  // Image data
  for (const { buffer, offset: imgOffset } of entries) {
    buffer.copy(ico, imgOffset);
  }

  return ico;
}

async function main() {
  // Generate PNGs
  await generatePNG(48, 'favicon-48x48.png');
  await generatePNG(32, 'favicon-32x32.png');
  await generatePNG(180, 'apple-touch-icon.png');

  // Generate ICO with multiple sizes
  const sizes = [16, 32, 48];
  const pngBuffers = [];

  for (const size of sizes) {
    const svg = createFaviconSVG(size);
    const buffer = await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toBuffer();
    pngBuffers.push({ width: size, buffer });
  }

  const icoBuffer = buildICO(pngBuffers);
  const icoPath = path.join(PUBLIC_DIR, 'favicon.ico');
  fs.writeFileSync(icoPath, icoBuffer);
  console.log('Created favicon.ico (16x16, 32x32, 48x48)');

  console.log('\nAll favicon files generated successfully!');
}

main().catch(console.error);

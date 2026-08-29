const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function processOriginalLogos() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Read images as base64
  const img1Base64 = fs.readFileSync('1.png').toString('base64');
  const img2Base64 = fs.readFileSync('2.png').toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body>
      <canvas id="cWhite"></canvas>
      <canvas id="cNavy"></canvas>
      <script>
        function processImg(dataUrl, bgIsDark) {
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d', { willReadFrequently: true });
              ctx.drawImage(img, 0, 0);
              const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const d = imgData.data;

              // Bounding box finding
              let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;

              for (let i = 0; i < d.length; i += 4) {
                const r = d[i], g = d[i+1], b = d[i+2];
                const x = (i / 4) % canvas.width;
                const y = Math.floor((i / 4) / canvas.width);

                if (bgIsDark) {
                  // Background is navy ~rgb(39, 48, 86)
                  // Logo is white ~rgb(255, 255, 255)
                  const diffFromBg = Math.sqrt(
                    Math.pow(r - 39, 2) + Math.pow(g - 48, 2) + Math.pow(b - 86, 2)
                  );
                  if (diffFromBg < 35) {
                    d[i+3] = 0; // Completely transparent
                  } else {
                    // Normalize alpha based on distance from background
                    const alpha = Math.min(255, Math.max(0, (diffFromBg - 25) * 4));
                    d[i] = 255;
                    d[i+1] = 255;
                    d[i+2] = 255;
                    d[i+3] = alpha;

                    if (alpha > 30) {
                      if (x < minX) minX = x;
                      if (x > maxX) maxX = x;
                      if (y < minY) minY = y;
                      if (y > maxY) maxY = y;
                    }
                  }
                } else {
                  // Background is white ~rgb(255, 255, 255)
                  // Logo is navy ~rgb(39, 48, 86)
                  const diffFromWhite = Math.sqrt(
                    Math.pow(r - 255, 2) + Math.pow(g - 255, 2) + Math.pow(b - 255, 2)
                  );
                  if (diffFromWhite < 30) {
                    d[i+3] = 0; // Completely transparent
                  } else {
                    const alpha = Math.min(255, Math.max(0, (diffFromWhite - 20) * 4));
                    d[i] = 39;
                    d[i+1] = 48;
                    d[i+2] = 86;
                    d[i+3] = alpha;

                    if (alpha > 30) {
                      if (x < minX) minX = x;
                      if (x > maxX) maxX = x;
                      if (y < minY) minY = y;
                      if (y > maxY) maxY = y;
                    }
                  }
                }
              }

              ctx.putImageData(imgData, 0, 0);

              // Crop to bounding box with 10px padding
              const pad = 10;
              minX = Math.max(0, minX - pad);
              minY = Math.max(0, minY - pad);
              maxX = Math.min(canvas.width, maxX + pad);
              maxY = Math.min(canvas.height, maxY + pad);
              const cropW = maxX - minX;
              const cropH = maxY - minY;

              const cropCanvas = document.createElement('canvas');
              cropCanvas.width = cropW;
              cropCanvas.height = cropH;
              const cropCtx = cropCanvas.getContext('2d');
              cropCtx.drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);

              resolve(cropCanvas.toDataURL('image/png'));
            };
            img.src = dataUrl;
          });
        }

        window.processAll = async function(b1, b2) {
          const whitePng = await processImg('data:image/png;base64,' + b1, true);
          const navyPng = await processImg('data:image/png;base64,' + b2, false);
          return { whitePng, navyPng };
        };
      </script>
    </body>
    </html>
  `);

  const result = await page.evaluate(async (b1, b2) => {
    return await window.processAll(b1, b2);
  }, img1Base64, img2Base64);

  const whiteBuf = Buffer.from(result.whitePng.replace(/^data:image\/png;base64,/, ''), 'base64');
  const navyBuf = Buffer.from(result.navyPng.replace(/^data:image\/png;base64,/, ''), 'base64');

  fs.writeFileSync('public/bac-logo-white.png', whiteBuf);
  fs.writeFileSync('public/bac-logo-navy.png', navyBuf);

  console.log('Successfully saved public/bac-logo-white.png and public/bac-logo-navy.png');
  await browser.close();
}

processOriginalLogos().catch(console.error);

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function renderLogos() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 600, deviceScaleFactor: 2 });

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Dancing+Script:wght@700&family=Great+Vibes&family=Playfair+Display:ital,wght@0,900;1,900&family=Cinzel:wght@900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: transparent; display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-start; }
    
    .logo-container {
      display: inline-flex;
      align-items: center;
      padding: 10px 20px;
      gap: 16px;
    }

    .navy { color: #182672; }
    .white { color: #ffffff; }

    .logo-box {
      display: flex;
      align-items: center;
      position: relative;
    }

    .text-column {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 8px;
    }

    .script-text {
      font-family: 'Alex Brush', 'Dancing Script', 'Great Vibes', cursive;
      font-size: 78px;
      line-height: 0.95;
      font-weight: 700;
      white-space: nowrap;
      margin-bottom: -4px;
      transform: translateY(4px);
    }

    .serif-text {
      font-family: 'Playfair Display', serif;
      font-size: 64px;
      font-weight: 900;
      line-height: 0.95;
      letter-spacing: 2px;
      white-space: nowrap;
    }

    svg.graduate-icon {
      width: 140px;
      height: 140px;
      flex-shrink: 0;
    }
  </style>
</head>
<body>
  <!-- Navy Logo for Light Theme -->
  <div id="navy-logo" class="logo-container navy">
    <div class="logo-box">
      <svg class="graduate-icon" viewBox="0 0 200 200" fill="currentColor">
        <!-- Graduation Hat (Mortarboard) -->
        <polygon points="100,18 165,46 100,74 35,46" />
        <!-- Headband under hat -->
        <path d="M58 56 L58 72 C58 84, 142 84, 142 72 L142 56 C128 64, 72 64, 58 56 Z" />
        <!-- Tassel button & hanging string -->
        <circle cx="100" cy="46" r="4.5" />
        <path d="M100 46 Q65 48 46 72" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" fill="none" />
        <polygon points="43,68 38,84 52,78" />

        <!-- Head -->
        <circle cx="100" cy="98" r="26" />

        <!-- Dynamic Graduate Robe / Joyful Wings -->
        <path d="M100 134 C116 134 136 140 148 150 C178 174 200 178 226 146 C210 186 180 220 140 234 C115 244 105 224 102 196 L100 166 L98 196 C95 224 85 244 60 234 C20 220 -10 186 -26 146 C0 178 22 174 52 150 C64 140 84 134 100 134 Z" transform="matrix(0.8 0 0 0.8 20 18)" />
        <path d="M64 140 C50 156 42 180 40 210 C35 182 38 158 50 134 C54 124 60 118 64 112 C66 122 65 131 64 140 Z" transform="matrix(0.8 0 0 0.8 20 18)" />
      </svg>
      <div class="text-column">
        <div class="script-text">Bac- Code</div>
        <div class="serif-text">Academy</div>
      </div>
    </div>
  </div>

  <!-- White Logo for Dark Theme -->
  <div id="white-logo" class="logo-container white">
    <div class="logo-box">
      <svg class="graduate-icon" viewBox="0 0 200 200" fill="currentColor">
        <!-- Graduation Hat (Mortarboard) -->
        <polygon points="100,18 165,46 100,74 35,46" />
        <!-- Headband under hat -->
        <path d="M58 56 L58 72 C58 84, 142 84, 142 72 L142 56 C128 64, 72 64, 58 56 Z" />
        <!-- Tassel button & hanging string -->
        <circle cx="100" cy="46" r="4.5" />
        <path d="M100 46 Q65 48 46 72" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" fill="none" />
        <polygon points="43,68 38,84 52,78" />

        <!-- Head -->
        <circle cx="100" cy="98" r="26" />

        <!-- Dynamic Graduate Robe / Joyful Wings -->
        <path d="M100 134 C116 134 136 140 148 150 C178 174 200 178 226 146 C210 186 180 220 140 234 C115 244 105 224 102 196 L100 166 L98 196 C95 224 85 244 60 234 C20 220 -10 186 -26 146 C0 178 22 174 52 150 C64 140 84 134 100 134 Z" transform="matrix(0.8 0 0 0.8 20 18)" />
        <path d="M64 140 C50 156 42 180 40 210 C35 182 38 158 50 134 C54 124 60 118 64 112 C66 122 65 131 64 140 Z" transform="matrix(0.8 0 0 0.8 20 18)" />
      </svg>
      <div class="text-column">
        <div class="script-text">Bac- Code</div>
        <div class="serif-text">Academy</div>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  // Wait extra 500ms for fonts to render
  await new Promise(r => setTimeout(r, 600));

  const navyElement = await page.$('#navy-logo');
  const whiteElement = await page.$('#white-logo');

  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  await navyElement.screenshot({
    path: path.join(publicDir, 'bac-code-navy.png'),
    omitBackground: true
  });

  await whiteElement.screenshot({
    path: path.join(publicDir, 'bac-code-white.png'),
    omitBackground: true
  });

  console.log('Logos rendered successfully to public/bac-code-navy.png and public/bac-code-white.png');
  await browser.close();
}

renderLogos().catch(console.error);

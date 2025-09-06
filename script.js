const xrayInput = document.getElementById('xrayInput');
const canvas = document.getElementById('xrayCanvas');
const ctx = canvas.getContext('2d');

xrayInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = async () => {
    // Draw original X-ray
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Run fake tumor detection
    const tumorMask = await detectTumor(canvas);

    // Overlay tumor mask
    overlayTumor(tumorMask);
  }
});

// Dummy tumor detection
async function detectTumor(canvas) {
  const width = canvas.width;
  const height = canvas.height;

  // Create a fake tumor mask (red circle in lung)
  const mask = ctx.createImageData(width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;

      // Fake circular tumor in center
      const dx = x - width / 2;
      const dy = y - height / 2;
      if (dx*dx + dy*dy < 50*50) {
        mask.data[i] = 255;     // R
        mask.data[i+1] = 0;     // G
        mask.data[i+2] = 0;     // B
        mask.data[i+3] = 150;   // Alpha
      } else {
        mask.data[i+3] = 0;
      }
    }
  }
  return mask;
}

function overlayTumor(mask) {
  ctx.putImageData(mask, 0, 0);
}





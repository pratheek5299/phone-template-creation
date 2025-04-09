export function createAdvancedClip(ctx) {
  ctx.beginPath();

  // Draw a rectangle
  ctx.rect(50, 50, 200, 300); // (x, y, width, height)

  // Create a circular cutout
  ctx.moveTo(150, 150); // Move to the center of the circle
  ctx.arc(150, 150, 40, 0, 2 * Math.PI, false); // (x, y, radius, startAngle, endAngle)

  ctx.clip(); // Apply clipping
}

/** Helper function to draw a rounded rectangle */
function drawRoundedRect(ctx, x, y, width, height, r) {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

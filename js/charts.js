// ============================================
// BetterLife — Canvas Charts Module
// ============================================
window.BL = window.BL || {};

BL.Charts = {
  // Draw a circular progress ring
  progressRing: function (canvasId, percentage, color) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var size = canvas.width;
    var center = size / 2;
    var radius = (size / 2) - 10;
    var lineWidth = 8;

    ctx.clearRect(0, 0, size, size);

    // Background track
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    // Progress arc
    if (percentage > 0) {
      var startAngle = -Math.PI / 2;
      var endAngle = startAngle + (Math.PI * 2 * (percentage / 100));

      ctx.beginPath();
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.strokeStyle = color || '#22c55e';
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    // Center text
    ctx.fillStyle = '#f1f5f9';
    ctx.font = 'bold 24px "DM Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(Math.round(percentage) + '%', center, center - 6);

    ctx.fillStyle = '#64748b';
    ctx.font = '11px "DM Sans", sans-serif';
    ctx.fillText('daily score', center, center + 16);
  },

  // Draw a weight trend line chart
  weightTrend: function (canvasId, weightLog, goalWeight) {
    var canvas = document.getElementById(canvasId);
    if (!canvas || !weightLog || weightLog.length < 2) return;

    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;
    var padding = { top: 20, right: 15, bottom: 30, left: 45 };

    ctx.clearRect(0, 0, w, h);

    var weights = weightLog.map(function (entry) { return entry.weight; });
    var minW = Math.min.apply(null, weights.concat([goalWeight || Infinity])) - 5;
    var maxW = Math.max.apply(null, weights) + 5;
    var rangeW = maxW - minW || 1;

    var chartW = w - padding.left - padding.right;
    var chartH = h - padding.top - padding.bottom;

    function xPos(i) { return padding.left + (i / (weightLog.length - 1)) * chartW; }
    function yPos(val) { return padding.top + (1 - (val - minW) / rangeW) * chartH; }

    // Grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (var i = 0; i <= 4; i++) {
      var y = padding.top + (i / 4) * chartH;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();

      var label = Math.round(maxW - (i / 4) * rangeW);
      ctx.fillStyle = '#64748b';
      ctx.font = '10px "DM Sans", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(label, padding.left - 8, y + 3);
    }

    // Goal weight line
    if (goalWeight && goalWeight >= minW && goalWeight <= maxW) {
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      var gy = yPos(goalWeight);
      ctx.moveTo(padding.left, gy);
      ctx.lineTo(w - padding.right, gy);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#22c55e';
      ctx.font = '9px "DM Sans", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('Goal', w - padding.right, gy - 5);
    }

    // Weight line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (var j = 0; j < weightLog.length; j++) {
      var x = xPos(j);
      var y2 = yPos(weightLog[j].weight);
      if (j === 0) ctx.moveTo(x, y2);
      else ctx.lineTo(x, y2);
    }
    ctx.stroke();

    // Data points
    for (var k = 0; k < weightLog.length; k++) {
      ctx.beginPath();
      ctx.arc(xPos(k), yPos(weightLog[k].weight), 3, 0, Math.PI * 2);
      ctx.fillStyle = '#3b82f6';
      ctx.fill();
    }

    // Date labels (first and last)
    ctx.fillStyle = '#64748b';
    ctx.font = '9px "DM Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(formatShortDate(weightLog[0].date), padding.left, h - 5);
    ctx.textAlign = 'right';
    ctx.fillText(formatShortDate(weightLog[weightLog.length - 1].date), w - padding.right, h - 5);
  },

  // Simple horizontal progress bar (drawn via canvas)
  progressBar: function (canvasId, value, max, color) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, h / 2);
    ctx.fill();

    // Fill
    var pct = Math.min(value / max, 1);
    if (pct > 0) {
      ctx.fillStyle = color || '#22c55e';
      ctx.beginPath();
      ctx.roundRect(0, 0, w * pct, h, h / 2);
      ctx.fill();
    }
  }
};

function formatShortDate(dateStr) {
  var parts = dateStr.split('-');
  return parts[1] + '/' + parts[2];
}

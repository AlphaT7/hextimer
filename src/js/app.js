let lastTick = null;
let newTimer = true;
let timerRunning = false;
let loop;
let timerTick = 0;
let pauseTS = 0;
let unPauseTS = 0;
let pauseDifference = 0;
let secondsTick = 0;
let minutesTick = 0;

const canvas = document.querySelector("#canvas");
canvas.width = 391;
canvas.height = 391;
const ctx = canvas.getContext("2d");
const log = console.log.bind(console);

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawHexagon(hexagon());
  drawClockTicks(clockTicks());
}

function pad(val) {
  // "pad" the number with an extra zero
  return val > 9 ? val : "0" + val;
}

function padMilli(val) {
  // "pad" the number with a extra zero's
  return val < 1
    ? "000"
    : val >= 1 && val < 10
    ? "00" + val
    : val > 9 && val < 100
    ? "0" + val
    : val;
}

function timeStr(val) {
  secondsTick = parseInt((val / 1000) % 60, 10);
  minutesTick = parseInt(val / 60000, 10).toFixed(0);
  return (
    "<div class='spacer'>" +
    /*Minutes*/
    pad(parseInt(val / 60000, 10).toFixed(0)) +
    "</div><div class='spacer'>" +
    " : " +
    "</div><div class='spacer'>" +
    /*Seconds*/
    pad(parseInt((val / 1000) % 60, 10)) +
    "</div><div class='spacer'>" +
    " : " +
    "</div><div class='spacer'>" +
    /*HundredSeconds*/
    padMilli(val % 1000) +
    "</div>"
  );
}

function tick(timestamp) {
  lastTick = lastTick == null ? timestamp : lastTick;
  const delta = newTimer == true ? 0 : timestamp - pauseDifference - lastTick;
  lastTick = timestamp - pauseDifference;
  timerTick += delta;
  document.querySelector("#timer").innerHTML = timeStr(timerTick.toFixed(0));
  loop = requestAnimationFrame(tick);
  render();
}

document.querySelector("#start_pause").addEventListener("click", function () {
  let timerState = {
    [[true, false]]: startTimer,
    [[false, false]]: resumeTimer,
    [[false, true]]: pauseTimer,
  };

  function startTimer() {
    loop = requestAnimationFrame(tick);
    timerRunning = true;
    newTimer = false;
  }

  function resumeTimer() {
    timerRunning = true;
    unPauseTS = performance.now();
    pauseDifference += unPauseTS - pauseTS;
    loop = requestAnimationFrame(tick);
  }

  function pauseTimer() {
    timerRunning = false;
    pauseTS = performance.now();
    cancelAnimationFrame(loop);
  }
  timerState[[newTimer, timerRunning]]();
});

document.querySelector("#restart").addEventListener("click", function () {
  newTimer = true;
  timerRunning = false;
  lastTick = null;
  cancelAnimationFrame(loop);
  timerTick = 0;
  pauseTS = 0;
  unPauseTS = 0;
  pauseDifference = 0;
  secondsTick = 0;
  minutesTick = 0;
  document.querySelector("#timer").innerHTML = `
			<div class="spacer">00</div>
	    <div class="spacer"> : </div>
  	  <div class="spacer">00</div>
    	<div class="spacer"> : </div>
    	<div class="spacer">000</div>
	`;
  render();
});

function toRadians(angle) {
  return angle * (Math.PI / 180);
}

function hexagon() {
  let path = new Path2D();
  let cx = canvas.width / 2 + 1;
  let cy = canvas.height / 2 + 1;
  let r = 120;

  let hex = {
    p1: {
      x: r * Math.cos(toRadians(0)) + cx,
      y: r * Math.sin(toRadians(0)) + cy,
    },

    p2: {
      x: r * Math.cos(toRadians(60)) + cx,
      y: r * Math.sin(toRadians(60)) + cy,
    },

    p3: {
      x: r * Math.cos(toRadians(120)) + cx,
      y: r * Math.sin(toRadians(120)) + cy,
    },

    p4: {
      x: r * Math.cos(toRadians(180)) + cx,
      y: r * Math.sin(toRadians(180)) + cy,
    },

    p5: {
      x: r * Math.cos(toRadians(240)) + cx,
      y: r * Math.sin(toRadians(240)) + cy,
    },

    p6: {
      x: r * Math.cos(toRadians(300)) + cx,
      y: r * Math.sin(toRadians(300)) + cy,
    },

    c: {
      x: cx,
      y: cy,
    },
  };

  path.moveTo(hex.p1.x, hex.p1.y);
  path.lineTo(hex.p2.x, hex.p2.y);
  path.lineTo(hex.p3.x, hex.p3.y);
  path.lineTo(hex.p4.x, hex.p4.y);
  path.lineTo(hex.p5.x, hex.p5.y);
  path.lineTo(hex.p6.x, hex.p6.y);
  path.lineTo(hex.p1.x, hex.p1.y);
  path.closePath();

  return path;
}

function drawHexagon(hex) {
  for (var i = 0; i <= 3; i++) {
    ctx.strokeStyle = "#fff";
    ctx.strokeWidth = 1;
    ctx.shadowColor = "#fff";
    ctx.shadowBlur = 15;
    ctx.stroke(hex);
  }
  let gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#5A6B90");
  gradient.addColorStop(0.4, "#5A6B90");
  gradient.addColorStop(1, "#2A55B4");
  ctx.fillStyle = gradient;
  ctx.fill(hex);
}

function clockTicks() {
  let cx = canvas.width / 2 + 1;
  let cy = canvas.height / 2 + 1;
  let r1;
  let r2 = 140;
  let j = 0;
  let radionCircle = [];
  for (let i = 0; i < 360; i += 6) {
    r1 = j % 2 != 0 ? 120 : 130; // if i is even then r1 is 170 else r1 is 180
    let p1 = {
      x: r1 * Math.cos(toRadians(i)) + cx,
      y: r1 * Math.sin(toRadians(i)) + cy,
    };
    let p2 = {
      x: r2 * Math.cos(toRadians(i)) + cx,
      y: r2 * Math.sin(toRadians(i)) + cy,
    };

    let pastColor = minutesTick % 2 != 0 ? "#fff" : "#FFA500";
    let futureColor = minutesTick % 2 != 0 ? "#FFA500" : "#fff";

    let color =
      j <= secondsTick + 45 && j >= 45
        ? pastColor
        : j <= secondsTick - 15 && j >= 0
        ? pastColor
        : futureColor;
    radionCircle.push({ p1: p1, p2: p2, color: color });
    j++;
  }
  return radionCircle;
}

function drawClockTicks(radionCircle) {
  radionCircle.forEach((tick) => {
    ctx.beginPath();
    ctx.strokeStyle = tick.color;
    ctx.lineWidth = 2;
    ctx.moveTo(tick.p1.x, tick.p1.y);
    ctx.lineTo(tick.p2.x, tick.p2.y);
    ctx.shadowColor = "#fff";
    ctx.shadowBlur = 15;
    ctx.stroke();
  });
}

drawHexagon(hexagon());
drawClockTicks(clockTicks());

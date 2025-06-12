let clouds = [];
let cloudsMoving = true;

function setup() {
  createCanvas(800, 500);
  background(210, 210, 225); // soft pinkish sky
}

function draw() {
  background(210, 210, 225);

  for (let i = 0; i < clouds.length; i++) {
    let c = clouds[i];

    // Move cloud only if cloudsMoving is true
    if (cloudsMoving) {
      c.x += c.speed;

      // Expand puff spacing
      if (c.driftFactor < 1.5) {
        c.driftFactor += 0.002;
      }
    }

    drawCloud(c.x, c.y, c.size, c.color, c.puffs, c.driftFactor);

    // Loop cloud when off screen
    if (c.x > width + 100) {
      c.x = -100;
    }
  }
}

function generatePuffs(x, y, size) {
  let puffList = [];
  let numPuffs = int(random(2, 5));
  for (let i = 0; i < numPuffs; i++) {
    let angle = random(TWO_PI);
    let offsetDist = random(size * 0.7, size * 1.0);
    let puffSize = size * random(0.7, 2.3);
    puffList.push({
      dx: cos(angle) * offsetDist,
      dy: sin(angle) * offsetDist * 1.5,
      dsize: puffSize
    });
  }
  return puffList;
}

function drawCloud(x, y, size, col, puffs, drift = 1) {
  fill(red(col), green(col), blue(col), 190); // soft transparency
  noStroke();
  circle(x, y, size); // central puff
  for (let p of puffs) {
    circle(x + p.dx * drift, y + p.dy * drift, p.dsize);
  }
}

function touchStarted() {
  if (clouds.length < 10) {
    // Add new clouds until there are 10
    let size = random(35, 60);
    let col = color(random(200, 255), random(200, 255), random(200, 255));
    let newCloud = {
      x: mouseX,
      y: mouseY,
      size: size,
      speed: random(0.2, 1),
      color: col,
      puffs: generatePuffs(mouseX, mouseY, size),
      driftFactor: 0.5
    };
    clouds.push(newCloud);
  } else {
    // Popping logic: click on *any* puff circle
    for (let i = clouds.length - 1; i >= 0; i--) {
      let c = clouds[i];
      let clicked = false;

      // Check central puff
      let d = dist(mouseX, mouseY, c.x, c.y);
      if (d < c.size / 2) {
        clicked = true;
      }

      // Check each puff
      for (let p of c.puffs) {
        let px = c.x + p.dx * c.driftFactor;
        let py = c.y + p.dy * c.driftFactor;
        let pd = dist(mouseX, mouseY, px, py);
        if (pd < p.dsize / 2) {
          clicked = true;
          break;
        }
      }

      if (clicked) {
        clouds.splice(i, 1); // pop the whole cloud
        break; // only pop one per click
      }
    }
  }
}

function keyPressed() {
  cloudsMoving = !cloudsMoving; // toggle pause/play
}

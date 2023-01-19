// tone library: https://tonejs.github.io/docs/14.7.77/index.html

let ready = false;
let osc1;
let osc2;
let lfo;
let wave;
let osc1Button, osc2Button;
let ball = {
  x: 300,
  y: 200,
  xspeed: 3,
  yspeed: -3,
}; // contains parameters for bouncing ball
let sel;
let type;

// SETUP
function setup() {
  createCanvas(800, 550); // create canvas
  // console.log(Tone);
  
  // create dropdown/select menu
  textAlign(CENTER);
  sel = createSelect();
  sel.position(20, 420);
  sel.option("Sine");
  sel.option("Triangle");
  sel.option("Square");
  sel.option("Sawtooth");
  sel.changed(selEvent);
  
  type = "sine",

  osc1 = new Tone.Oscillator({
    type: type,
    frequency: 220,
    volume: -6,
  }).toDestination();

  osc2 = new Tone.Oscillator({
    type: type,
    frequency: 220,
    volume: -6,
  }).toDestination();

  // lfo = new Tone.LFO("0.1hz", 210, 230); // Low Frequency Oscillator (LFO)
  // lfo.connect(osc1.frequency)

  wave = new Tone.Waveform();
  Tone.Master.connect(wave);
  Tone.Master.volume.value = -12; // controls volume output (keep between -9dB and -15 dB when developing to protect hearing)

  osc1Button = createButton("Start Oscillator 1");
  osc1Button.position(width / 50, height / 1.2);
  osc1Button.mousePressed(playOsc1);

  osc12Button = createButton("Stop Oscillator 1");
  osc12Button.position(width / 6, height / 1.2);
  osc12Button.mousePressed(stopOsc1);

  osc2Button = createButton("Start Oscillator 2");
  osc2Button.position(width / 50, height / 1.1);
  osc2Button.mousePressed(playOsc2);

  osc22Button = createButton("Stop Oscillator 2");
  osc22Button.position(width / 6, height / 1.1);
  osc22Button.mousePressed(stopOsc2);
}

// DRAW
function draw() {
  background(0); // background colour

  // bouncing ball
  stroke(255);
  strokeWeight(4);
  noFill();
  ellipse(ball.x, ball.y, 24, 24);
  if (ball.x > width || ball.x < 0) {
    ball.xspeed = ball.xspeed * -1;
  }
  if (ball.y > height || ball.y < 0) {
    ball.yspeed = ball.yspeed * -1;
  }
  ball.x = ball.x + ball.xspeed;
  ball.y = ball.y + ball.yspeed;

  // plot waveforms
  if (ready) {
    osc1.frequency.value = map(mouseX, 0, width, 110, 880);
    let buffer = wave.getValue(0);
    let start = 0; // arbitrary start point - play around with different values between -1 and 1
    for (let i = 1; i < buffer.length; i++) {
      if (buffer[i - 1] < 0 && buffer[i] >= 0) {
        start = i;
        break; // interrupts for loop
      }
    }
    let end = start + buffer.length / 2;
    for (let i = start; i < end; i++) {
      let x1 = map(i - 1, start, end, 0, width);
      let y1 = map(buffer[i], -1, 1, 0, height);
      let x2 = map(i, start, end, 0, width);
      let y2 = map(buffer[i], -1, 1, 0, height);
      line(x1, y1, x2, y2);
    }
  } else {
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    text(
      "Start oscillator 1 and move the mouse from left to right to visualise change in frequency.",
      width / 2,
      height / 2
    );
    text(
      "Use oscillator 2 to play a steady frequency underneath oscillator 1.",
      width / 2,
      height / 1.75
    );
  }
}

// function mousePressed() {
//   if(!ready)
//   // sine.triggerAttackRelease("A3", 1)
//   osc1.start();
//   osc2.start();
//   // lfo.start();
//   ready = true;
// }

function selEvent() {
  let typeChange = sel.value();
  if (typeChange == "Sine") {
    type = "sine";
  } else if (typeChange == "Triangle") {
    type = "triangle";
  } else if (typeChange == "Square") {
    type = "square";
  } else if (typeChange == "Sawtooth") {
    type = "sawtooth";
  }
  console.log(type)
}

function playOsc1() {
  // if(!ready)
  osc1.start();
  ready = true;
}

function stopOsc1() {
  osc1.stop();
  ready = true;
}

function playOsc2() {
  // if(!ready)
  osc2.start();
  ready = true;
}

function stopOsc2() {
  // if(!ready)
  osc2.stop();
  ready = true;
}

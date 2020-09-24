var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var playerContainer;
let score = 0;
var asteroids;
var pointer;
var asteroidTimer;
//   background vars
var stars;
var spaceDust;
var galaxy;

var game = new Phaser.Game(config);

function preload() {
  this.load.image("player", "./assets/SVGs/spaceship.svg");
  this.load.image("asteroid", "./assets/SVGs/asteroid.svg");
  this.load.image("spaceDust", "./assets/PNGs/bgParralaxSpaceDust.png");
  this.load.image("stars", "./assets/PNGs/bgParralaxStars.png");
  this.load.image("galaxy", "./assets/PNGs/bgParralaxGalaxy.png");
}

function create() {
  // Load background
  pointer = this.input;
  stars = this.add.tileSprite(400, 300, 800, 600, "stars");
  galaxy = this.add.tileSprite(400, 300, 800, 600, "galaxy");
  spaceDust = this.add.tileSprite(400, 300, 800, 600, "spaceDust");

  // Load player, score, container and associated physics
  playerContainer = this.add.container(400, 550);
  const player = this.add.sprite(0, 0, "player");
  player.setScale(0.5, 0.5);
  const text = this.add
    .text(0, 40, score, {
      fontSize: "32px",
      color: "white",
      fontStyle: "bold",
    })
    .setOrigin(0.5);

  playerContainer.add(player);
  playerContainer.add(text);
  playerContainer.setScale(0.75);
  this.physics.world.enable(playerContainer);
  playerContainer.body.setGravityY(-200);

  // Load asteroid event timer and group
  asteroids = this.physics.add.group({ gravityY: -150 });
  asteroidTimer = this.time.addEvent({
    delay: Phaser.Math.Between(1000, 2500),
    callback: createAsteroid,
    callbackScope: this,
    loop: true,
  });

  // Collision detector
  this.physics.add.overlap(
    playerContainer,
    asteroids,
    asteroidCatch,
    null,
    this
  );
}

function update() {
  playerContainer.x = pointer.x;
  stars.tilePositionY -= 0.5;
  spaceDust.tilePositionY -= 1;
  galaxy.tilePositionY -= 0.75;
}

function createAsteroid() {
  const asteroidSprite = this.add.sprite(0, 0, "asteroid");
  const asteroidScoreValue = Phaser.Math.Between(1, 10);
  const asteroidNum = this.add
    .text(0, 0, asteroidScoreValue, {
      fontSize: "264px",
      color: "white",
      fontStyle: "bold",
    })
    .setOrigin(0.5, 0.5);
  asteroidNum.setName(asteroidScoreValue);

  const asteroidContainer = this.add.container(
    Phaser.Math.Between(50, 750),
    -100
  );
  asteroidContainer.add(asteroidSprite);
  asteroidContainer.add(asteroidNum);
  asteroidContainer.setScale(0.15);

  const asteroid = asteroids.add(asteroidContainer);

  asteroidTimer.reset({
    delay: Phaser.Math.Between(1000, 2500),
    callback: createAsteroid,
    callbackScope: this,
    loop: true,
  });
}

function asteroidCatch(player, asteroid) {
  if (asteroid.active) {
    score += asteroid.list[1].name;
    player.list[1].setText(score);

    asteroids.remove(asteroid, true, true);
  }
}

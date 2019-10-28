
function myGame() {

var config = {
   width:800,
   height: 600,
   renderer: Phaser.AUTO,
   parent: "tower defense",
   state: {preload: preload, create: create, update : update, render: render},
};


var game = new Phaser.Game(config);

function preload() {

    game.load.image('bullet', 'assets/games/invaders/bullet.png');
    game.load.image('enemyBullet', 'assets/games/invaders/enemy-bullet.png');
    game.load.spritesheet('invader', 'assets/games/invaders/invader32x32x4.png', 32, 32);
    game.load.image('ship', 'assets/games/invaders/player.png');
    game.load.spritesheet('kaboom', 'assets/games/invaders/explode.png', 128, 128);
    game.load.image('starfield', 'assets/games/invaders/deep-space.jpg');
    game.load.image('background', 'assets/games/starstruck/background2.png');
    game.load.image('probeImage', 'assets/games/invaders/shipart.png');
    
    
    game.load.spritesheet('button', 'assets/sprites/gem.png', 100, 5);    
    game.load.spritesheet('button2', 'assets/sprites/blue_ball.png', 193, 71);   
    //spritesheet(key, url, frameWidth, frameHeight, frameMax, margin, spacing) 
    
}

var probe;
var probe2;
var probe3;
var button;
var button2;
var player;
var aliens;
var bullets;
var bulletTime = 0;
var cursors;
var fireButton;
var explosions;
var starfield;
var score = 0;
var scoreString = '';
var scoreText;
var lives;
var probeLives;
var enemyBullet;
var firingTimer = 0;
var probeFiringTimer = 0;
var stateText;
var livingEnemies = [];
var text1;
var counter = 0;
var weapon1;
var weapon2;
var weapon3;
var numEnemies =1;
var level = 1;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  The scrolling starfield background
    starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');

    //  Our bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);
    
    game.stage.backgroundColor = '#4b0049';

    button = game.add.button(game.world.centerX - 350, 460, 'button', listener, this, 2, 1, 0);  
    
    button2 = game.add.button(game.world.centerX - 300, 460, 'button2', listener, this, 2, 1, 0);    
    button2.scale.setTo(5, 5);
    

    // The enemy's bullets
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(30, 'enemyBullet');
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 1);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);


    weapon1 = game.add.weapon(1, 'enemyBullet');
    
    //  The bullet will be automatically killed when it leaves the world bounds
    weapon1.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

    //  Because our bullet is drawn facing up, we need to offset its rotation:
    weapon1.setBulletBodyOffset(32, 32, 20, 34);

    //  The speed at which the bullet is fired
    weapon1.bulletSpeed = 400;

    //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
    weapon1.fireRate = 10;
    
    
    //2nd probe weapon
    weapon2 = game.add.weapon(1, 'enemyBullet');
    
    //  The bullet will be automatically killed when it leaves the world bounds
    weapon2.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;


    //  Because our bullet is drawn facing up, we need to offset its rotation:
    weapon2.setBulletBodyOffset(32, 32, 20, 34);

    //  The speed at which the bullet is fired
    weapon2.bulletSpeed = 400;

    //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
    weapon2.fireRate = 10;    
    
    
    //3rd probe weapon
    weapon3 = game.add.weapon(1, 'enemyBullet');
    
    //  The bullet will be automatically killed when it leaves the world bounds
    weapon3.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;


    //  Because our bullet is drawn facing up, we need to offset its rotation:
    weapon3.setBulletBodyOffset(32, 32, 20, 34);

    //  The speed at which the bullet is fired
    weapon3.bulletSpeed = 400;

    //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
    weapon3.fireRate = 10;    

    //  The hero!
   // player = game.add.sprite(400, 500, 'ship');
    //player.anchor.setTo(0.5, 0.5);
   // game.physics.enable(player, Phaser.Physics.ARCADE);
    
    // the probe
    probe = game.add.sprite(200, 500, 'probeImage');
    probe.anchor.setTo(0.3, 0.3);
    //scale down new ship image
    probe.scale.setTo(.1, .1);
    
    probe.inputEnabled = true;
    //move angle down to 0
    probe.angle = 0;
    
    
    
    
    // the probe2
    probe2 = game.add.sprite(300, 500, 'probeImage');
    probe2.anchor.setTo(0.3, 0.3);
    //scale down new ship image
    probe2.scale.setTo(.1, .1);
    
    probe2.inputEnabled = true;
    //move angle down to 0
    probe2.angle = 0;    
    game.physics.enable(probe2, Phaser.Physics.ARCADE);
    
    // the probe3
    probe3 = game.add.sprite(400, 500, 'probeImage');
    probe3.anchor.setTo(0.3, 0.3);
    //scale down new ship image
    probe3.scale.setTo(.1, .1);
    
    probe3.inputEnabled = true;
    //move angle down to 0
    probe3.angle = 0;    
    
    
    
    //move weapon with probe
    weapon1.trackSprite(probe);        
    weapon2.trackSprite(probe2);   
    weapon3.trackSprite(probe3);       

    //  The baddies!
    aliens = game.add.group();
    aliens.enableBody = true;
    
    aliens.physicsBodyType = Phaser.Physics.ARCADE;

    //createAliens();



    //  The score
    scoreString = 'Score : ';
    scoreText = game.add.text(10, 10, scoreString + score, { font: '34px Arial', fill: '#fff' });

    //  Lives
    lives = game.add.group();
    game.add.text(game.world.width - 100, 10, 'Lives : ', { font: '34px Arial', fill: '#fff' });

    //  Probe Lives
    probeLives = game.add.group();
    game.add.text(game.world.width - 500, 10, 'Probe Lives : ', { font: '34px Arial', fill: '#fff' });

    //  Text
    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

    for (var i = 0; i < 3; i++) 
    {
        var ship = lives.create(game.world.width - 100 + (30 * i), 60, 'ship');
        ship.anchor.setTo(0.5, 0.5);
        ship.angle = 90;
        ship.alpha = 0.4;
    }


    //create probe lives
    for (var i = 0; i < 3; i++) 
    {
        var ship1 = probeLives.create(game.world.width - 500 + (30 * i), 60, 'ship');
        ship1.anchor.setTo(0.5, 0.5);
        ship1.angle = 90;
        ship1.alpha = 0.4;
    }

    //  An explosion pool
    explosions = game.add.group();
    explosions.createMultiple(50, 'kaboom');
    explosions.forEach(setupInvader, this);

    //  And some controls to play the game with
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
    
    text1 = game.add.text(170, 460, 'test', { fill: '#ffffff' });    

}

function createAliens () {
    //numEnemies *= 2;
    for (var y = 0; y < 1; y++)
    {
        for (var x = 0; x < 5; x++)
        {
            var alien = aliens.create(x * 50, y * 50, 'invader');
            alien.anchor.setTo(0.5, 0.5);
            alien.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
            alien.play('fly');
            alien.body.moves = false;
        }
    }

    aliens.x = 100;
    aliens.y = 50;

    //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.


    //  When the tween loops it calls descend
    //tween.onLoop.add(descend, this);
}

function setupInvader (invader) {

    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('kaboom');

}

function descend() {

    aliens.x += 10;

}

function update() {
    probe.events.onInputDown.add(listener, this);    
    //  Scroll the background
    starfield.tilePosition.y += 2;
    
    //speed of the aliens
    aliens.y += .5;
    
    //if aliens move below the screen kill them all
    if (aliens.y == 550)
    {
        for (var i = 0; i < livingEnemies.length; i++)
        {
            livingEnemies[i].kill();
        }
    }
    
    if (livingEnemies.length == 0)
    {
        numEnemies +=1;
        createAliens();
        console.log(numEnemies);        
    }
    
    if (probe.alive)
    {
        //  Reset the player, then check for movement keys

        


        
        if (game.time.now > probeFiringTimer)
        {
            
            
            //only fire if probe is still alive
            if (probeLives => 1)
            {
                probeFires();
                probeFires2();
                probeFires3();
            }
        }        

        //  Run collision
        game.physics.arcade.overlap(bullets, aliens, collisionHandler, null, this);
        //game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);
        //game.physics.arcade.overlap(aliens, player, alienHitsPlayer, null, this);   

        
        game.physics.arcade.overlap(aliens, weapon1.bullets, probeHitsAliens, null, this);
        game.physics.arcade.overlap(aliens, weapon2.bullets, probeHitsAliens2, null, this);       
        game.physics.arcade.overlap(aliens, weapon3.bullets, probeHitsAliens3, null, this);        
        //game.physics.arcade.collide(aliens, weapon);
        game.physics.arcade.overlap(aliens, probe, alienHitsProbe, null, this);  
        
//game.physics.arcade.overlap(this.weapon.bullets, this.aliens, this.probeHitsAliens, null, this);        
    }

}

function render() {

    // for (var i = 0; i < aliens.length; i++)
    // {
    //     game.debug.body(aliens.children[i]);
    // }

}

function collisionHandler (bullet, alien) {

    //  When a bullet hits an alien we kill them both
    bullet.kill();
    alien.kill();

    //  Increase the score
    score += 20;
    scoreText.text = scoreString + score;

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
    explosion.play('kaboom', 30, false, true);

    if (aliens.countLiving() == 0)
    {
        score += 1000;
        scoreText.text = scoreString + score;

        enemyBullets.callAll('kill',this);
        stateText.text = " You Won, \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }

}


function probeHitsAliens (alien, weapon1) {

    //  When a bullet hits an alien we kill them both
    weapon1.kill();
    alien.kill();


    //  Increase the score
    score += 20;
    scoreText.text = scoreString + score;

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
    explosion.play('kaboom', 30, false, true);


/*
    if (aliens.countLiving() == 0)
    {
        score += 1000;
        scoreText.text = scoreString + score;

        //weapon1.callAll('kill',this);
        stateText.text = " You Won, \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }
*/
}

function probeHitsAliens2 (alien, weapon2) {

    //  When a bullet hits an alien we kill them both
    weapon2.kill();
    alien.kill();


    //  Increase the score
    score += 20;
    scoreText.text = scoreString + score;

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
    explosion.play('kaboom', 30, false, true);


}


function probeHitsAliens3 (alien, weapon3) {

    //  When a bullet hits an alien we kill them both
    weapon3.kill();
    alien.kill();


    //  Increase the score
    score += 20;
    scoreText.text = scoreString + score;

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
    explosion.play('kaboom', 30, false, true);


/*
    if (aliens.countLiving() == 0)
    {
        score += 1000;
        scoreText.text = scoreString + score;

        //weapon1.callAll('kill',this);
        stateText.text = " You Won, \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }
*/
}


function enemyHitsPlayer (player,bullet) {
    
    bullet.kill();

    live = lives.getFirstAlive();

    if (live)
    {
        live.kill();
    }

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(player.body.x, player.body.y);
    explosion.play('kaboom', 30, false, true);

    // When the player dies
    if (lives.countLiving() < 1)
    {
        player.kill();
        enemyBullets.callAll('kill');

        stateText.text=" GAME OVER \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }

}

function alienHitsPlayer (player,alien) {
    

    alien.kill();
    live = lives.getFirstAlive();

    if (live)
    {
        live.kill();
    }

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(player.body.x, player.body.y);
    explosion.play('kaboom', 30, false, true);

    // When the player dies
    if (lives.countLiving() < 1)
    {
        player.kill();
        enemyBullets.callAll('kill');

        stateText.text=" GAME OVER \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }
    




    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
    explosion.play('kaboom', 30, false, true);

/*
    if (aliens.countLiving() == 0)
    {
        score += 1000;
        scoreText.text = scoreString + score;

        enemyBullets.callAll('kill',this);
        stateText.text = " You Won, \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }   */ 

}


function alienHitsProbe (probe,alien) {
    


    probeLive = probeLives.getFirstAlive();

    if (probeLive)
    {
        alien.kill();
        probeLive.kill();

        //  And create an explosion :)
        var explosion = explosions.getFirstExists(false);
        explosion.reset(probe.body.x, probe.body.y);
        explosion.play('kaboom', 30, false, true);
    
    
    
    
        
    
    
    
    
        //  And create an explosion :)
        var explosion = explosions.getFirstExists(false);
        explosion.reset(alien.body.x, alien.body.y);
        explosion.play('kaboom', 30, false, true);
        
        
    }
    
    if (probeLives.countLiving() < 1)
    {
        probe.kill();
        weapon1.fireRate = 100000;
        //weapon1.kill();
    }

/*
    if (aliens.countLiving() == 0)
    {
        score += 1000;
        scoreText.text = scoreString + score;

        enemyBullets.callAll('kill',this);
        stateText.text = " You Won, \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }   */ 

}

function enemyFires () {

    //  Grab the first bullet we can from the pool
    enemyBullet = enemyBullets.getFirstExists(false);

    livingEnemies.length=0;

    aliens.forEachAlive(function(alien){

        // put every living enemy in an array
        livingEnemies.push(alien);
    });


    if (enemyBullet && livingEnemies.length > 0)
    {
        
        var random=game.rnd.integerInRange(0,livingEnemies.length-1);

        // randomly select one of them
        var shooter=livingEnemies[random];
        // And fire the bullet from this enemy
        enemyBullet.reset(shooter.body.x, shooter.body.y);

        game.physics.arcade.moveToObject(enemyBullet,player,120);
        firingTimer = game.time.now + 2000;
    }

}

function probeFires () {


    livingEnemies.length=0;

    aliens.forEachAlive(function(alien){

        // put every living enemy in an array
        livingEnemies.push(alien);
    });


    if (livingEnemies.length > 0)
    {
        
        var random=game.rnd.integerInRange(0,livingEnemies.length-1);

        // randomly select one of them
        //var shooter=probe;
        weapon1.fireAtSprite(livingEnemies[random]);
        
        // And fire the bullet from this enemy
        //enemyBullet.reset(shooter.body.x, shooter.body.y);

        //game.physics.arcade.moveToObject(enemyBullet,livingEnemies[random],120);
        //probeFiringTimer = game.time.now + 1000;
    }


}

function probeFires2 () {


    livingEnemies.length=0;

    aliens.forEachAlive(function(alien){

        // put every living enemy in an array
        livingEnemies.push(alien);
    });


    if (livingEnemies.length > 0)
    {
        
        var random=game.rnd.integerInRange(0,livingEnemies.length-1);

        // randomly select one of them
        //var shooter=probe;
        weapon2.fireAtSprite(livingEnemies[random]);
        
        // And fire the bullet from this enemy
        //enemyBullet.reset(shooter.body.x, shooter.body.y);

        //game.physics.arcade.moveToObject(enemyBullet,livingEnemies[random],120);
        //probeFiringTimer = game.time.now + 1000;
    }


}

function probeFires3 () {


    livingEnemies.length=0;

    aliens.forEachAlive(function(alien){

        // put every living enemy in an array
        livingEnemies.push(alien);
    });


    if (livingEnemies.length > 0)
    {
        
        var random=game.rnd.integerInRange(0,livingEnemies.length-1);

        // randomly select one of them
        //var shooter=probe;
        weapon3.fireAtSprite(livingEnemies[random]);
        
        // And fire the bullet from this enemy
        //enemyBullet.reset(shooter.body.x, shooter.body.y);

        //game.physics.arcade.moveToObject(enemyBullet,livingEnemies[random],120);
        //probeFiringTimer = game.time.now + 1000;
    }


}


function listener () {
    
    if (score >= 20){
        score -= 20;
        scoreText.text = scoreString + score;
        weapon1.bulletSpeed += 100;
        counter++;
        text1.text = "You clicked " + counter + " times!";
    }


}

function fireBullet () {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > bulletTime)
    {
        //  Grab the first bullet we can from the pool
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            //  And fire it
            bullet.reset(player.x, player.y + 8);
            bullet.body.velocity.y = -400;
            bulletTime = game.time.now + 200;
        }
    }

}

function resetBullet (bullet) {

    //  Called if the bullet goes out of the screen
    bullet.kill();

}

function restart () {

    //  A new level starts
    
    //resets the life count
    lives.callAll('revive');
    probeLives.callAll('revive');    
    //  And brings the aliens back from the dead :)
    aliens.removeAll();
    //createAliens();

    //revives the player
    //player.revive();
    probe.revive();    
    probe2.revive();
    probe3.revive();
    //hides the text
    stateText.visible = false;

}



    }


function nukeButton() {

    button.pendingDestroy = true;

    text = game.add.text(game.world.centerX, game.world.centerY, '- button nuked -', { font: '64px Arial', fill: '#ffffff' });

    text.anchor.set(0.5);

}

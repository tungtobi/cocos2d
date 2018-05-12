var Boss = cc.Sprite.extend({
    healthy: 400,
    healthyBar: null,
    outlineBar: null,
    speed: 700,
    shield: true,

    ctor: function(fileName) {
        this._super(fileName);

        this.initProperties();
        this.initHealthyBar();

        this.appear();

        // add event listener to enemies
        this.addEventListener();

        this.scheduleUpdate();

        // add to enemies array
        enemyLayer.enemies.push(this);
    },

    initProperties: function () {
        this.attr({
            opacity: 0,
            anchorX: 0.5,
            anChorY: 0.5,
            x: screenSize.width / 2,
            y: screenSize.height - this.getContentSize().height / 2
        });
    },

    initHealthyBar: function () {
        this.healthyBar = new ccui.LoadingBar();
        this.healthyBar.setName("Healthy");
        this.healthyBar.loadTexture(res.EnemyHealthyBar_png);
        this.healthyBar.setPercent(this.healthy / 400 * 100);

        this.outlineBar = new cc.Sprite(res.EnemyHealthyOutline_png);
        this.outlineBar.attr({
            anchorX: 0.5,
            anchoY: 0,
            x: screenSize.width / 2,
            y: screenSize.height - 40
        });

        layer.addChild(this.outlineBar, 8);
        layer.addChild(this.healthyBar,9);

        this.healthyBar.attr({
            x: screenSize.width / 2,
            y: screenSize.height - 30
        });
    },

    appear: function () {
        this.runAction(
            cc.sequence(
                cc.fadeIn(1),
                cc.callFunc(this.runFlyAction, this)
            )
        );
    },

    addEventListener: function () {
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesMoved: this.onTouchesMoved.bind(this)
        });
        cc.eventManager.addListener(listener, this);
    },

    runFlyAction: function() {
        this.runAction(
            cc.sequence(
                cc.callFunc(this.moveByRandom, this),
                cc.delayTime(2.9)
            ).repeatForever()
        );
    },

    moveByRandom: function() {
        var pos = new cc.p(
            Math.random() * (screenSize.width - this.getContentSize().width) + this.getContentSize().width / 2,
            Math.random() * (screenSize.height - this.getContentSize().height) + this.getContentSize().height / 2
        );
        this.runAction(
            cc.sequence(
                cc.spawn(
                    new cc.EaseElasticOut(
                        new cc.moveTo(2.2, pos)
                    ),
                    cc.rotateBy(2.2, 180, 180)
                ),
                //cc.delayTime(2.2),
                cc.callFunc(function() {
                    this.shield = false;
                }, this),
                cc.tintTo(0.5, 0, 0, 180),
                cc.callFunc(this.shotLaser, this),
                cc.tintTo(0.2, 127, 127, 127)
            )
        );
    },

    update: function(dt) {
        if (enemyLayer.removeAllEnemis === true) {
            this.beAttacked();
        }
    },

    onTouchesMoved: function(touches, event) {
        var target = event.getCurrentTarget();
        var size = target.getContentSize();
        var rect = cc.rect(0, 0, size.width, size.height);

        for (var i = 0; i < touches.length; i++) {
            var pos = target.convertToNodeSpace(touches[i].getLocation());

            // check touch location and enemy location
            if (cc.rectContainsPoint(rect, pos) && this.shield === false) {
                this.beAttacked();
            }
        }
    },

    shotLaser: function() {
        var laser = new Enemy(res.Rocket_png);
        var pos = this.getPosition();
        enemyLayer.addChild(laser);
        laser.setPosition(cc.p(pos.x, pos.y - this.getContentSize().height / 2));
        this.shield = true;
    },

    beAttacked: function() {
        this.updateHealthy();
        this.runAction(
            cc.sequence(
                cc.tintBy(0.1, 100, 100, 100),
                cc.tintBy(0.1, 100, 100, 100).reverse(),
                cc.callFunc(function() {
                    if (this.healthy <= 0) {
                        this.removeFromParent();
                    }
                }, this)
            )
        );
    },

    updateHealthy: function() {
        this.healthy -= layer.player.damage;
        this.scale = 0.5 + this.healthy / 400;

        this.healthyBar.setPercent(this.healthy / 400 * 100);

        if (this.healthy < 400 && this.healthy % 50 === 0) {
            var number = Math.floor(Math.random() * 3) + 4;
            enemyLayer.addRandom(number);
        }
    },

    onExit: function () {
        this.healthyBar.removeFromParent();
        this.outlineBar.removeFromParent();

        enemyLayer.shakeScreen(32, 15);
        layer.shakeScreen();

        enemyLayer.schedule(enemyLayer.addEnemy, 6);

        cc.arrayRemoveObject(enemyLayer.enemies, this);
    }
});
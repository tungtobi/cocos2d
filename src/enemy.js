var Enemy = cc.Sprite.extend({
    healthy: null,
    healthyMax: null,
    healthyBar: null,
    speed: null,
    shotTimer: Math.random() + 0.5,
    type: null,
    damage: null,

    ctor: function(fileName){
        this._super(fileName);

        this.type = fileName;

        this.attr({
            y: screenSize.height + this.getContentSize().height / 2,
            anchorX: 0.5,
            anChorY: 0.5
        });

        this.addEventListener();

        this.initEnemyProperties();
        this.initHealthyBar();

        this.runFlyAction();
        this.scheduleUpdate();

        // add to enemies array
        enemyLayer.enemies.push(this);
    },

    addEventListener: function () {
        // add event listener to enemies
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesMoved: this.onTouchesMoved.bind(this)
        });
        cc.eventManager.addListener(listener, this);
    },

    initHealthyBar: function () {
        this.healthyBar = new ccui.LoadingBar();
        this.healthyBar.setName("Healthy");
        this.healthyBar.loadTexture(res.EnemyHealthyBar_png);
        this.updateHealthyBar();

        this.addChild(this.healthyBar,2);

        this.healthyBar.attr({
            x: this.getContentSize().width / 2,
            y: -this.getContentSize().height / 2 - 16,
            scale: 0.25,
            anchorX: 0.5,
            anChorY: 0.5
        });
    },

    initEnemyProperties: function () {
        // setup speed and abitility
        switch (this.type) {
            case res.Enemy1_png:
                this.speed = 500;
                this.healthyMax = 3;
                this.damage = 3;
                break;
            case res.LaserBlue_png:
                this.speed = 1500;
                this.damage = 1;
                this.scale = 1;
                break;
            case res.Rocket_png:
                this.speed = 1500;
                this.damage = 10;
                this.scale = 1;
                break;
            case res.Enemy3_png:
                this.speed = (screenSize.height + this.getContentSize().height) / 8;
                this.healthyMax = 5;
                this.damage = 5;
                break;
            case res.Enemy4_png:
                this.speed = 400;
                this.healthyMax = 3;
                this.damage = 2;
                break;
            case res.Enemy2_png:
                this.speed = 400;
                this.healthyMax = 5;
                this.damage = 3;
                break;
        }

        this.healthy = this.healthyMax;
    },

    runFlyAction: function() {
        var actionTime = (this.y +  this.getContentSize().height / 2) / this.speed;

        var path;
        // run action move
        switch (this.type) {
            case res.Enemy3_png:
                path = cc.sequence(
                    cc.sequence(
                        cc.rotateTo(0.2, -45),
                        cc.moveBy(0.5, this.speed, -this.speed),
                        cc.rotateTo(0.2, 45),
                        cc.moveBy(0.5, -this.speed, -this.speed)
                    ).repeat(4),
                    cc.callFunc(this.removeSelf, this)
                );
                break;

            default:
                path = cc.sequence(
                    cc.moveBy(actionTime, cc.p(0, -this.speed * actionTime)),
                    cc.callFunc(this.removeSelf, this)
                );
                break;
        }

        path.setTag(4);
        this.runAction(path);
    },

    update: function(dt) {
        if (enemyLayer.removeAllEnemis === true) {
            this.healthy = 1;
            this.beAttacked();
        }

        if (this.type === res.Enemy2_png) {
            if (this.shotTimer > 0) {
                this.shotTimer -= dt;
            } else {
                this.shotLaser();
                this.shotTimer = Math.random() + 0.5;
            }
        }
    },

    onTouchesMoved: function(touches, event) {
        var target = event.getCurrentTarget();
        var size = target.getContentSize();
        var rect = cc.rect(0, 0, size.width, size.height);

        for (var i = 0; i < touches.length; i++) {
            var pos = target.convertToNodeSpace(touches[i].getLocation());

            // check touch location and enemy location
            if (cc.rectContainsPoint(rect, pos) && this.speed !== 1500) {
                this.beAttacked();
            }
        }
    },

    beAttacked: function() {
        this.updateHealthy();
        this.runAction(
            cc.sequence(
                cc.tintBy(0.1, 100, 100, 100),
                cc.tintBy(0.1, 100, 100, 100).reverse(),
                cc.callFunc(function() {
                    if (this.healthy <= 0) {
                        this.removeSelf();
                    }
                }, this)
            )
        );
    },

    updateHealthy: function() {
        if (this.healthy > 0) {
            this.healthy -= layer.player.damage;
        }

        this.updateHealthyBar();

        if (this.type === res.Enemy4_png) {
            this.checkAngryEnemy();
        }
    },

    updateHealthyBar: function () {
        this.healthyBar.setPercent(
            this.healthy / this.healthyMax * 100
        );

        this.healthyBar.opacity = 255;
        this.healthyBar.runAction(
            cc.fadeOut(0.3)
        );
    },

    checkAngryEnemy: function() {
        this.setTexture(res.Enemy4Angry_png);
        this.speed = 800;
        this.y -= this.getContentSize().height / 2;
        this.stopActionByTag(4);
        this.runFlyAction();
    },

    shotLaser: function() {
        var laser = new Enemy(res.LaserBlue_png);
        var pos = this.getPosition();
        laser.setPosition(cc.p(pos.x, pos.y - this.getContentSize().height / 2));
        enemyLayer.addChild(laser);
    },

    removeSelf: function() {
        if (this.y < 20) {
            layer.player.healthy -= this.damage;
            layer.player.updateHealthyBar();
        } else {
            layer.updateHitLabel();
            layer.createCoin(this.x, this.y);
            layer.player.updateLevel();
        }

        layer.createExplosion(this.x, this.y);

        this.removeFromParent();
    },

    onExit: function () {
        cc.arrayRemoveObject(enemyLayer.enemies, this);
        this.healthyBar.removeFromParent();
    }
});
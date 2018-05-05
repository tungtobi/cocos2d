var EnemyLayer = cc.Layer.extend({
    enemies: [],
    removeAllEnemis: false, // state when tap Bomb item
    bombScreen: null,

    ctor: function() {
        this._super();

        screenSize = cc.director.getWinSize();

        //this.removeAllEnemis = false;
        this.initBombScreen();

        // add new enemy
        this.addEnemyLoop();


    },

    addEnemyLoop: function () {
        this.schedule(this.addEnemy, 6, 8);
        this.scheduleOnce(function() {
            var boss = new Boss(res.Boss_png);
            this.addChild(boss);
        }, 54);
    },

    initBombScreen: function () {
        this.bombScreen = new cc.DrawNode;
        this.addChild(this.bombScreen, 11);
    },

    addEnemy: function(dt) {
        var type = Math.floor(Math.random() * 4);
        var posX, number;
        switch (type) {
            case 0:
                posX = Math.floor(Math.random() * (screenSize.width - 208) + 104);
                this.addArrow(posX);
                break;
            case 1:
                this.runAction(
                    cc.sequence(
                        cc.callFunc(
                            function() {
                                this.addZigZag(3);
                            }, this
                        ), cc.delayTime(1),
                        cc.callFunc(
                            function() {
                                this.addZigZag(2);
                            }, this
                        )
                    )
                );
                break;
            case 2:
                number = Math.floor(Math.random() * 6) + 6;
                this.addRandom(number);
                break;
            default:
                number = Math.floor(Math.random() * 4) + 2;
                posX = Math.floor(Math.random() * screenSize.width);
                if (posX < 52) {
                    posX = 52;
                } else if (posX > screenSize.width - (number - 1) * 104 - 52) {
                    posX = screenSize.width - (number - 1) * 104 - 52;
                }
                this.addHorizontal(posX, number);
                break;
        }
    },

    addArrow: function(posX) {
        var enemyCenter = new Enemy(res.Enemy2_png);
            enemyCenter.x = posX;
            this.addChild(enemyCenter);

        var enemy1 = new Enemy(res.Enemy4_png);
            enemy1.x = posX + enemyCenter.getContentSize().width;
            this.addChild(enemy1);

        var enemy2 = new Enemy(res.Enemy4_png);
            enemy2.x = posX - enemyCenter.getContentSize().width;
            this.addChild(enemy2);

        var enemy3 = new Enemy(res.Enemy1_png);
            enemy3.x = posX;
            enemy3.y = enemyCenter.y - enemyCenter.getContentSize().height;
            this.addChild(enemy3);
    },

    addHorizontal: function(posX, num) {
        for (var i = 0; i < num; i++) {
            var enemy = new Enemy(res.Enemy1_png);
            enemy.x = posX + enemy.getContentSize().width * i * 1.2;
            this.addChild(enemy);
        }
    },

    addZigZag: function(type) {
        var distance = screenSize.width / 4;
        for (var i = 0; i < type; i++) {
            var enemy = new Enemy(res.Enemy3_png);
            switch (type) {
                case 3:
                    enemy.x = distance * (i + 0.5);
                    break;
                case 2:
                    enemy.x = distance * i + distance;
                    break;
            }
            this.addChild(enemy);
        }
    },

    addRandom: function(num) {
        this.runAction(
            cc.sequence(
                cc.callFunc(
                    function () {
                        var enemy = new Enemy(res.Enemy1_png);
                        enemy.x = Math.floor(
                            Math.random() *
                            (screenSize.width - enemy.getContentSize().width) +
                            enemy.getContentSize().width / 2
                        );
                        this.addChild(enemy);
                    }, this
                ), cc.delayTime(4 / num)
            ).repeat(num)
        );
    },

    countDownBomb: function() {
        this.removeAllEnemis = true;

        this.bombScreen.drawRect(
            cc.p(-100, -100),
            cc.p(screenSize.width + 100, screenSize.height + 100),
            cc.color(255, 0, 0, 50)
        );

        this.shakeScreen(24, 1.5 / 0.02);

        this.runAction(
            cc.sequence(
                cc.delayTime(1.5),
                cc.callFunc(
                    function() {
                        this.removeAllEnemis = false;
                        this.bombScreen.clear();
                    }, this
                )
            )
        );
    },

    shakeScreen: function(size, time) {
        var posX = Math.random() * -size || Math.random() * size;
        var posY = Math.random() * -size || Math.random() * size;
        this.runAction(
            cc.sequence(
                cc.moveBy(0.01, cc.p(posX, posY)),
                cc.moveBy(0.01, cc.p(posX, posY)).reverse(),
                cc.callFunc(function() {
                    posX = Math.random() * -size || Math.random() * size;
                    posY = Math.random() * -size || Math.random() * size;
                }, this)
            ).repeat(time)
        );
    }
});
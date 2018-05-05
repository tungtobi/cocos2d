var MainLayer = cc.Layer.extend({
	timePlayed: null,
    //playerHealthy: g_level * 10 + 100,
    //levelLabel: null,
    //damage: g_level / 10 + 1,
    hitCount: 0,
    hitLabel: null,
    //dataBoard: null,
    //newHealthyBar: null,
    player: null,

	ctor: function() {
        this._super();

        screenSize = cc.director.getWinSize();
        this.player = new Player();
        this.addChild(this.player);

        this.createScoreLabel();

        this.schedule(this.addItem, 3);
    },

    /*
    initDataBoard: function () {
	    this.dataBoard = new cc.Sprite(res.Board_png);
	    this.dataBoard.attr({
            anchorX: 0,
            anchorY: 0,
            x: 16,
            y: 12,
            opacity: 200
        });
	    this.addChild(this.dataBoard, 9);

        this.createLevelLabel();
        this.createHealthyBar();
        this.createScoreLabel();
    },

    createLevelLabel: function () {
        this.levelLabel = new cc.LabelTTF("Level " + g_level, "Arial", 24);
        this.levelLabel.x = + this.dataBoard.getContentSize().width / 4;
        this.levelLabel.y = 90 + 12;

        this.addChild(this.levelLabel, 10);
    },

    createHealthyBar: function () {
        this.newHealthyBar = new ccui.LoadingBar();
        this.newHealthyBar.setName("Healthy");
        this.newHealthyBar.loadTexture(res.HealthyBar_png);
        this.newHealthyBar.setPercent(this.playerHealthy);
        this.newHealthyBar.attr({
            x: 16 + this.dataBoard.getContentSize().width / 2,
            y: 47
        });
        this.addChild(this.newHealthyBar,9);
    },
    */

    createScoreLabel: function () {
        this.hitLabel = new cc.LabelTTF(this.hitCount, "Arial", screenSize.width * 0.5);
        this.hitLabel.attr({
            x: screenSize.width / 2,
            y: screenSize.height / 2,
            opacity: 0
        });
        this.addChild(this.hitLabel, -5);
    },

    update: function(dt) {
    	this.timePlayed += dt;
  	},

    addItem: function(dt) {
        var type = Math.floor(Math.random() * 2);
        var item;
        switch (type) {
            case 0:
                item = new Item(res.ItemBomb_png);
                break;
            default:
                item = new Item(res.ItemPill_png);
                break;
        }
        this.addChild(item, 1);
    },

    updateHealthyBar: function() {
	    this.player.updateHealthyBar();
    },

    updateHitLabel: function() {
	    this.hitCount++;
	    this.hitLabel.opacity = 255;
        this.hitLabel.setString(this.hitCount);
        this.hitLabel.runAction(
            cc.fadeOut(1.5)
        );
    },

    createExplosion: function (x, y) {
        var explosion = new Explosion();
        explosion.x = x;
        explosion.y = y;
        this.addChild(explosion,2);
    },

    createCoin: function (x, y) {
        var coin = new Coin(res.Coin_png);
        coin.x = x;
        coin.y = y;
        this.addChild(coin,2);
    },

    shakeScreen: function() {
        var posX = Math.random() * -32 || Math.random() * 32;
        var posY = Math.random() * -32 || Math.random() * 32;
        this.runAction(
                cc.sequence(
                cc.moveBy(0.01, cc.p(posX, posY)),
                cc.moveBy(0.01, cc.p(posX, posY)).reverse(),
                cc.callFunc(function() {
                    posX = Math.random() * -32 || Math.random() * 32;
                    posY = Math.random() * -32 || Math.random() * 32;
                }, this)
            ).repeat(15)
        );
    }
});

var MainScene = cc.Scene.extend({
    onEnter: function() {
        this._super();

        enemyLayer = new EnemyLayer();
        this.addChild(enemyLayer);

        layer = new MainLayer();
        this.addChild(layer);

        var backgroundLayer = new Background();
        this.addChild(backgroundLayer, -10);
    }
});
var MainLayer = cc.Layer.extend({
	timePlayed: null,
    hitCount: 0,
    hitLabel: null,
    player: null,

	ctor: function() {
        this._super();

        screenSize = cc.director.getWinSize();

        this.initPlayer();
        this.schedule(this.addItem, 3);
    },

    initPlayer: function () {
        this.player = new Player();
        this.addChild(this.player);

        this.createScoreLabel();
    },

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
        this.addChild(item, 10);
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
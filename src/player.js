var Player = cc.Sprite.extend({
    healthyMax: g_level * 10 + 100,
    healthy: null,
    levelLabel: null,
    damage: g_level / 5 + 1,
    dataBoard: null,
    newHealthyBar: null,
    exp: 0,

    ctor: function (fileName) {
        this._super(fileName);
        this.healthy = this.healthyMax;

    },

    onEnter: function () {
        this.initDataBoard();
    },

    initDataBoard: function () {
        this.dataBoard = new cc.Sprite(res.Board_png);
        this.dataBoard.attr({
            anchorX: 0,
            anchorY: 0,
            x: 16,
            y: 12,
            opacity: 200
        });

        layer.addChild(this.dataBoard, 9);

        this.createLevelLabel();
        this.createHealthyBar();
    },

    createLevelLabel: function () {
        this.levelLabel = new cc.LabelTTF("Level " + g_level, "Arial", 24);
        this.levelLabel.x = 78;
        this.levelLabel.y = 82;

        if (layer) {
            layer.addChild(this.levelLabel, 10);
        }
    },

    createHealthyBar: function () {
        this.newHealthyBar = new ccui.LoadingBar();
        this.newHealthyBar.setName("Healthy");
        this.newHealthyBar.loadTexture(res.HealthyBar_png);
        this.newHealthyBar.setPercent(this.healthy / this.healthyMax * 100);
        this.newHealthyBar.attr({
            x: 16 + this.dataBoard.getContentSize().width / 2,
            y: 47
        });

        if (layer) {
            layer.addChild(this.newHealthyBar, 9);
        }
    },

    updateLevel: function () {
        if (this.exp >= (g_level + 1) * 20) {
            g_level = g_level + 1;
            this.exp = 0;
            this.healthyMax = g_level * 10 + 100;
            this.healthy = this.healthyMax;
            this.damage = g_level / 10 + 1;
            this.levelLabel.setString("Level " + g_level);
            this.updateHealthyBar();
        } else {
            this.exp = this.exp + 1;
        }
    },

    updateHealthyBar: function() {
        // check player is alive
        if (this.healthy <= 0) {
            cc.director.runScene(new MenuScene());
        } else if (this.healthy > this.healthyMax) {
            this.healthy = this.healthyMax;
        } else if (this.healthy <= 10) {
            enemyLayer.shakeScreen(32, 15);
        }

        this.newHealthyBar.setPercent(this.healthy / this.healthyMax * 100);
    }
});
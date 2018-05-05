var MenuLayer = cc.Layer.extend({
    title: null,
    playButton: null,

    ctor: function() {
        this._super();

        cc.director.setDisplayStats(false);
        screenSize = cc.director.getWinSize();

        this.initPlayButton();
        var menu = new cc.Menu(this.playButton);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu);


    },

    initPlayButton: function () {
        this.playButton = new cc.MenuItemImage(
            res.PlayButton_png,
            res.PlayButton_png,
            function() {
                cc.director.runScene(new MainScene());
            }, this
        );

        this.playButton.attr({
            x: -this.playButton.getContentSize().width / 2,
            y: screenSize.height / 3
        });

        this.playButton.runAction(
            new cc.EaseElasticOut(
                new cc.moveBy(1.8, cc.p(screenSize.width / 2 + this.playButton.getContentSize().width / 2,0))
            )
        );

        this.playButton.runAction(
            cc.repeatForever(
                cc.sequence(cc.rotateTo(1, 20, 20), cc.rotateTo(1, -20, -20))
            )
        );
    }
});


var MenuScene = cc.Scene.extend({
    onEnter: function() {
        this._super();

        menuLayer = new MenuLayer();
        this.addChild(menuLayer);

        var backgroundLayer = new Background();
        this.addChild(backgroundLayer, -10);
    }
});
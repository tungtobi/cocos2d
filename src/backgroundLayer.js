var Background = cc.Layer.extend({
    ctor: function() {
        this._super();

        screenSize = cc.director.getWinSize();

        var image = new cc.Sprite(res.Background_png);
        image.attr({
            x: screenSize.width / 2,
            y: screenSize.height / 2,
            scaleX: screenSize.width / image.getContentSize().width,
            scaleY: screenSize.height / image.getContentSize().height
        });

        this.addChild(image);
    }
});
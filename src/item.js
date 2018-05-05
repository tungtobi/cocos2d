var Item = cc.Sprite.extend({
    type: null,

    ctor: function(fileName) {
        this._super(fileName);
        this.type = fileName;

        this.generateRandomPosition();

        this.addEventListener();

        // setup effect action
        this.runAnimate();
        this.scheduleOnce(this.removeSelf, 5);
    },

    generateRandomPosition: function () {
        this.attr({
            x: Math.floor(Math.random() * screenSize.width),
            y: Math.floor(Math.random() * screenSize.height)
        });
    },

    addEventListener: function () {
        // add event listener multi-touches to objs
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesBegan: this.onTouchesBegan.bind(this)
        });
        cc.eventManager.addListener(listener, this);
    },

    runAnimate: function () {
        var effect = new cc.spawn(
            cc.scaleBy(1, 1.5, 1.5),
            cc.rotateBy(1, -45)
        );

        this.runAction(
            cc.repeatForever(
                cc.sequence(
                    effect,
                    effect.reverse()
                )
            )
        );
    },

    onTouchesBegan: function(touches, event) {
        var target = event.getCurrentTarget();
        var size = target.getContentSize();
        var rect = cc.rect(0, 0, size.width, size.height);

        for (var i = 0; i < touches.length; i++) {
            var pos = target.convertToNodeSpace(touches[i].getLocation());

            if (cc.rectContainsPoint(rect, pos)) {
                this.checkType();
                this.removeSelf();
            }
        }
    },

    checkType: function () {
        switch (this.type) {
            case res.ItemPill_png:
                layer.player.healthy += 20;
                layer.updateHealthyBar();
                break;
            case res.ItemBomb_png:
                enemyLayer.countDownBomb();
                break;
        }
    },

    removeSelf: function() {
        this.runAction(
            cc.sequence(
                cc.tintBy(0.1, 100, 100, 100),
                cc.tintBy(0.1, 100, 100, 100).reverse(),
                cc.callFunc(function() {
                    this.removeFromParent();
                }, this)
            )
        );
    }
});
var Explosion = cc.Sprite.extend({
    animate: null,

    ctor: function (fileName) {
        this._super(fileName);

        this.runAnimation();
    },

    createAnimation: function () {
        cc.spriteFrameCache.addSpriteFrames(res.Explosion_plist);

        this.scale = 0.8;

        var animFrames = [];
        var str = "";

        for (var i = 1; i <= 15; i++) {
            str = "explosion" + ((i < 10) ? ("0" + i) : i) + ".png";
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(spriteFrame);
        }

        var animation = new cc.Animation(animFrames, 0.03);
        this.animate = new cc.Animate(animation);
    },

    runAnimation: function () {
        this.createAnimation();

        this.runAction(
            cc.sequence(
                this.animate,
                /*
                cc.callFunc(
                    function () {
                        this.removeFromParent();
                    }, this
                )
                */
                cc.removeSelf()
            )
        );
    }
});
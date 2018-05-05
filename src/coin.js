var Coin = cc.Sprite.extend({
    ctor: function (fileName) {
        this._super(fileName);

        this.runAnimate();
    },

    getDistance: function () {
        var deltaX = this.x - 40;
        var deltaY = this.y - 40;
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    },

    runAnimate: function () {
        var speed = 50;
        var distance = this.getDistance();
        var time = distance / speed;

        this.runAction(
            cc.sequence(
                new cc.EaseCircleActionInOut(
                    cc.moveTo(time, cc.p(40 + Math.random() * 300, 40))
                ),
                cc.removeSelf()
            )
        );
    }
});
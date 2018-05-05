var res = {
    Background_png:         "res/background.png",

    CloseNormal_png:        "res/CloseNormal.png",
    CloseSelected_png:      "res/CloseSelected.png",

    Enemy1_png:             "res/spaceShips_009.png",
    Enemy2_png:             "res/spaceShips_001.png",
    Enemy3_png:             "res/spaceShips_002.png",
    Enemy4_png:             "res/spaceShips_003.png",
    Enemy4Angry_png:        "res/spaceShips_006.png",
    LaserBlue_png:          "res/laserRed16.png",
    Rocket_png:             "res/spaceMissiles_001.png",
    Boss_png:               "res/ufoRed.png",

    ItemPill_png:           "res/itemPill.png",
    ItemBomb_png:           "res/itemBomb.png",

    Explosion_png:          "res/explosion.png",
    Explosion_plist:        "res/explosion.plist",
    Coin_png:               "res/dotYellow.png",

    HealthyBar_png:         "res/healthyBar.png",
    EnemyHealthyBar_png:    "res/enemyHealthyBar.png",
    EnemyHealthyOutline_png:"res/enemyHealthyOutline.png",
    Board_png:              "res/dataBoard.png",
    PlayButton_png:         "res/playButton.png"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
var loading_4 = require('../img/loading_4.png'),
    loading_2 = require('../img/loading_2.png'),
    loading_3 = require('../img/loading_3.png'),
    loading_1 = require('../img/loading_1.png'),
    end_1 = require('../img/end_1.png'),
    end_2 = require('../img/end_2.png'),
    icon_20_170_466 = require('../img/20_170_466.png'),
    icon_15_234_266 = require('../img/15_234_266.png'),
    icon_60_215_372 = require('../img/60_215_372.png'),
    icon_70_181_331 = require('../img/70_181_331.png'),
    icon_80_400_450 = require('../img/80_400_450.png'),
    icon_120_174_344 = require('../img/120_174_344.png'),
    icon_150_458_318 = require('../img/150_458_318.png'),
    icon_200_193_302 = require('../img/200_193_302.png'),
    icon_0_800_800 = require('../img/0_800_800.png'),
    icon_200_137_103 = require('../img/200_137_103.png'),
    icon_210_352_382 = require('../img/210_352_382.png'),
    icon_100_371_582 = require('../img/100_371_582.png'),
    icon_180_210_447 = require('../img/180_210_447.png')

var TweenLite = require('../../common/js/greensock/TweenLite.js')

module.exports = {
    loading_1 : {
        img: './img/loading_1.png',
        w: 786,
        h: 786,
        rotation: Math.PI / -10,
    },
    loading_2 : {
        img: './img/loading_2.png',
        w: 431,
        h: 532,
        x: 0,
        y: 0,
        z: 5
    },
    loading_2_1 : {
        img: './img/loading_2.png',
        w: 431,
        h: 532,
        x: 0,
        y: 0,
        z: 300,
        opacity: 0
    },
    loading_3 : {
        img: './img/loading_3.png',
        w: 16,
        h: 256
    },
    loading_4 : {
        img: './img/loading_4.png',
        w: 182,
        h: 768,
        rotation: Math.PI / 4,
        scale: 2,
        x : 0,
        y : 0
    },
    sky: {
        img: './img/0_800_800.png',
        w: 800,
        h: 800,
        x : 0,
        y : 160,
        z : 0,
        alpha: 0.1,
        scale : [3, 3, 1]
    },
    end_1: {
        img: './img/end_1.png',
        w: 700,
        h: 950,
        x : 0,
        y : 0,
        z : 1,
        scale : 2
    },
    end_2: {
        img: './img/end_2.png',
        w: 538,
        h: 374,
        x : 0,
        y : -80,
        z : 10,
        scale: 1,
    },
    icon_15_234_266: {
        img: './img/15_234_266.png',
        w: 234,
        h: 266,
        x : -110,
        y : -80,
        z : 5,
    },
    icon_15_234_266_1: {
        img: './img/15_234_266.png',
        w: 234,
        h: 266,
        x : 110,
        y : -80,
        z : 5,
        scale: [-1, 1, 1]
    },
    icon_20_170_466: {
        img: './img/20_170_466.png',
        w: 170,
        h: 466,
        x : -100,
        y : -120,
        z : 50,
        scale: [0.8, 0.8, 1]
    },
    icon_20_170_466_1: {
        img: './img/20_170_466.png',
        w: 170,
        h: 466,
        x : 100,
        y : -120,
        z : 50,
        scale: [-0.8, 0.8, 1]
    },
    icon_60_215_372: {
        img: './img/60_215_372.png',
        w: 215,
        h: 372,
        x : -200,
        y : -120,
        z : 80,
        scale: [1.3, 1.3, 1]
    },
    icon_60_215_372_1: {
        img: './img/60_215_372.png',
        w: 215,
        h: 372,
        x : 200,
        y : -120,
        z : 80,
        scale: [-1.3, 1.3, 1]
    },
    icon_70_181_331: {
        img: './img/70_181_331.png',
        w: 181,
        h: 331,
        x : -100,
        y : 90,
        z : 70,
        scale: [1.2, 1.2, 1]
    },
    icon_70_181_331_1: {
        img: './img/70_181_331.png',
        w: 181,
        h: 331,
        x : 100,
        y : 90,
        z : 70,
        scale: [-1.2, 1.2, 1]
    },
    icon_80_400_450: {
        img: './img/80_400_450.png',
        w: 400,
        h: 450,
        x : 0,
        y : 100,
        z : 80,
        alpha: 0.7,
        scale: [1.5, 1.5, 1]
    },
    icon_120_174_344: {
        img: './img/120_174_344.png',
        w: 174,
        h: 344,
        x : 110,
        y : 320,
        z : 120,
        scale: [1.5, 1.5, 1]
    },
    icon_120_174_344_1: {
        img: './img/120_174_344.png',
        w: 174,
        h: 344,
        x : -110,
        y : 320,
        z : 120,
        scale: [-1.5, 1.5, 1]
    },
    icon_150_458_318: {
        img: './img/150_458_318.png',
        w: 458,
        h: 318,
        x : -170,
        y : -200,
        z : 150,
        scale: [1.2, 1.2, 1]
    },
    icon_150_458_318_1: {
        img: './img/150_458_318.png',
        w: 458,
        h: 318,
        x : 170,
        y : -200,
        z : 150,
        scale: [-1.2, 1.2, 1]
    },
    icon_200_193_302: {
        img: './img/200_193_302.png',
        w: 193,
        h: 302,
        x : -230,
        y : 200,
        z : 200,
        scale: [2.3, 2.3, 1]
    },
    icon_200_193_302_1: {
        img: './img/200_193_302.png',
        w: 193,
        h: 302,
        x : 230,
        y : 200,
        z : 200,
        scale: [-2.3, 2.3, 1]
    },
    icon_200_137_103: {
        img: './img/200_137_103.png',
        w: 137,
        h: 103,
        x : -50,
        y : -200,
        z : 210,
        scale: [1.2, 1.2, 1]
    },
    icon_200_137_103_1: {
        img: './img/200_137_103.png',
        w: 137,
        h: 103,
        x : 50,
        y : -200,
        z : 210,
        scale: [-1.2, 1.2, 1]
    },
    icon_210_352_382: {
        img: './img/210_352_382.png',
        w: 352,
        h: 382,
        x : 200,
        y : -300,
        z : 220,
        scale: [-1.3, 1.3, 1]
    },
    icon_210_352_382_1: {
        img: './img/210_352_382.png',
        w: 352,
        h: 382,
        x : -200,
        y : -300,
        z : 220,
        scale: [1.3, 1.3, 1]
    },
    icon_100_371_582: {
        img: './img/100_371_582.png',
        w: 371,
        h: 582,
        x : -350,
        y : 300,
        z : 100,
        alpha: 0.3,
        scale: [3,3,1]
    },
    icon_100_371_582_1: {
        img: './img/100_371_582.png',
        w: 371,
        h: 582,
        x : 350,
        y : 300,
        z : 100,
        alpha: 0.3,
        scale: [-3,3,1]
    },
    icon_180_210_447: {
        img: './img/180_210_447.png',
        w: 210,
        h: 447,
        x : -250,
        y : -300,
        z : 300,
        alpha: 0.3,
        scale: [2,2,1]
    },
    icon_180_210_447_1: {
        img: './img/180_210_447.png',
        w: 210,
        h: 447,
        x : 250,
        y : -300,
        z : 300,
        alpha: 0.3,
        scale: [-2,2,1]
    },
}
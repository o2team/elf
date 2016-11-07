require('../css/style.scss')
require('../plugin/bg.mp3')
require('../../common/js/lib/zepto-touch.js')
var Launcher = require('./Launcher.js')
var THREE = require('../../common/js/three/three.js')

var TweenLite = require('../../common/js/greensock/TweenLite.js')

Launcher({
    bgMusic: './plugin/bg.mp3',
    hasMusic:true,
    loadResources: ['./plugin/bg.mp3'],
    callback : start
})

var data = require('./data.js')


function set(obj){

    var map = new THREE.TextureLoader().load( obj.img ),
        materialobj = {
            map: map, 
            color: 0xffffff, 
            fog: false
        },
        defualtScale = 1;

    if(obj.scale){
        defualtScale = defualtScale / obj.scale
    }
    
    if(obj.rotation){
        materialobj.rotation = obj.rotation
    }

    if(obj.opacity !== undefined){
        materialobj.opacity = obj.opacity
    }
    

    var material = new THREE.SpriteMaterial( materialobj );

    var sprite = new THREE.Sprite( material );

    sprite.scale.set( obj.w / defualtScale, obj.h / defualtScale, 1)
    
    sprite.position.set(obj.x || 0, obj.y || 0, obj.z || 0)

    // sprite.rotation.y = Math.PI / 4

    return sprite
}

function getrand(min, max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

function meteor(){
    var arrMeteor = []
    var _meteor = new THREE.Object3D();

    var map = new THREE.TextureLoader().load( '../img/loading_3.png' ),
        materialobj = {
            map: map
        },
        defualtScale = 100;
    var material = new THREE.MeshBasicMaterial( materialobj );

    material.map.needsUpdate = true;

    _meteor.add(new THREE.Mesh(new THREE.PlaneGeometry(16/8, 256/8), material))

    var temp = {}, rand = 0, prefix = [1,1], _x = 0, _y = 0, z = 0

    function random(){
        temp = _meteor.clone(true)
        rand = Math.random()
        if(rand < 1/4){
            prefix = [1,1]
        }else if(rand >= 1/4 && rand < 1/2){
            prefix = [-1,1]
        }else if(rand >= 1/2 && rand < 3/4){
            prefix = [1,-1]
        }else{
            prefix = [-1,-1]
        }
        _x = getrand(100, 150) * prefix[0]
        _y = getrand(100, 200) * prefix[1]
        _z = getrand(100, 200)
        temp.position.set(_x, _y, _z)
        temp.rotation.x = Math.tan(_x / _y)
        if(_x < 0){
            temp.rotation.x = -1 * Math.tan(_x / _y)
        }
        arrMeteor.push(temp)
        _meteor.visible = false
    }
    for(var i = 0; i < 7; i++ )
        random()


    return arrMeteor
}

function icon(obj){
    var _icon = {};

    var texture = new THREE.TextureLoader().load(obj.img),
        iconobj = {
            map: texture,
            side: THREE.DoubleSide,
            transparent: true,
            alphaTest: 0.5
        },
        defualtScale = 2

    if(obj.alpha){
        iconobj.alphaTest = obj.alpha;
    }
    var material = new THREE.MeshBasicMaterial( iconobj );

    _icon = new THREE.Mesh(new THREE.PlaneGeometry(obj.w / defualtScale, obj.h / defualtScale), material)

    _icon.position.set(obj.x || 0, obj.y || 0, obj.z || 0)

    if(obj.scale){
        _icon.scale.set(obj.scale[0], obj.scale[1], obj.scale[2])
    }
    return _icon

}

var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1200 );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
    $('#J_main').append( renderer.domElement );
    camera.position.z = 800;


var __moveing = false, __k = 1, __MAX = 1100, __MIN = 200

function start(){
    //TODO 初始化滑屏幕组件
    
    var l1 = set(data.loading_1),
        l2 = set(data.loading_2),
        l2_1 = set(data.loading_2_1),
        l4 = set(data.loading_4)  

    scene.add( l4 )
    scene.add( l1 )
    scene.add( l2 )
    scene.add( l2_1 )

    TweenLite.to(l1.scale, 0.1, {x: l1.scale.x + 0.5, y: l1.scale.y + 0.5, onComplete: function(){
        this.reverse();
    },onReverseComplete: function(){
        this.play();
    }})

    TweenLite.to(l1.material, 0.05, {rotation: l1.material.rotation + 0.1, onCompleteParams: [l1.material], onComplete: function(){
        this.reverse();
    },onReverseComplete: function(){
        this.play();
    }})
    
    TweenLite.to(l2_1.material, 1, {delay:0.7, opacity:1, onComplete: function(){
        this.restart();
    }})
    TweenLite.to(l2.scale, 2, {x: 0.1, y: 0.1, delay:0, ease: 'easeOut', onComplete: function(){
        this.restart();
    }})
    TweenLite.to(l2_1.scale, 2, {x: 0.1, y: 0.1, delay:0.7, ease: 'easeOut', onComplete: function(){
        this.restart();
    }})

    function render() {
        if(__moveing){
            camera.position.z += __k
            if(camera.position.z > __MAX || camera.position.z < __MIN){
                __moveing = false
            }
        }
        requestAnimationFrame( render );
        renderer.render( scene, camera );
    }
    render();

    setTimeout(function(){
        reset()
        game()
    }, 1000)
}

$(document).on('click', function(){
    __moveing = false
})

$(document).on('swipeUp', function(){
    __moveing = true
    __k = 1
})

$(document).on('swipeDown', function(){
    __moveing = true
    __k = -1
})

function reset(){
    for( var i = scene.children.length - 1; i >= 0; i--) {
        scene.remove(scene.children[i])
    }
}

function game() {
    var end_1 = set(data.end_1),
        end_2 = set(data.end_2),
        icon_20_170_466 = set(data.icon_20_170_466)

    scene.add( end_2 )
    scene.add( end_1 )

    scene.add(icon(data.sky))
    scene.add(icon(data.icon_15_234_266))
    scene.add(icon(data.icon_15_234_266_1))
    scene.add(icon(data.icon_20_170_466))
    scene.add(icon(data.icon_20_170_466_1))
    scene.add(icon(data.icon_60_215_372))
    scene.add(icon(data.icon_60_215_372_1))
    scene.add(icon(data.icon_70_181_331))
    scene.add(icon(data.icon_70_181_331_1))
    scene.add(icon(data.icon_80_400_450))
    scene.add(icon(data.icon_120_174_344))
    scene.add(icon(data.icon_120_174_344_1))
    scene.add(icon(data.icon_150_458_318))
    scene.add(icon(data.icon_150_458_318_1))
    scene.add(icon(data.icon_200_193_302))
    scene.add(icon(data.icon_200_193_302_1))
    scene.add(icon(data.icon_200_137_103))
    scene.add(icon(data.icon_200_137_103_1))
    scene.add(icon(data.icon_210_352_382))
    scene.add(icon(data.icon_210_352_382_1))
    scene.add(icon(data.icon_100_371_582))
    scene.add(icon(data.icon_100_371_582_1))
    scene.add(icon(data.icon_180_210_447))
    scene.add(icon(data.icon_180_210_447_1))
}
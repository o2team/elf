// 引用样式


var PCPrompt = require('../../common/js/motion/pc-prompt/pc-prompt.js'),
    utils = require('../../common/js/utils/index.js'),
    wechat = require('../../common/js/wechat/index.js'),
    loader = require('./loader.js')

var _config = {
    PCQRcode: '',
    
    hasMusic: true,

    bgMusic: 'plugin/bg.mp3',

    loadResources: [],

    isMusicPlay: false,

    loadType: 0,//0为并行， 1为串行

    concurrency: 0,

    share_data: {
        'img': 'http://h5.m.jd.com/active/2G81HfPDtVb2HtcNrvka9ikam56u/pages/14313/img/logo.jpeg',   // 选填，默认为空或者当前页面第一张图片
        'link': window.location.href,
        'desc': '感谢支持',
        'title': 'H5-Boilerplate'
    },

    sel_main: '#J_main',

    sel_popup: '#J_sharePopUp',

    sel_audio: '#J_audio',
    
    callback: $.noop
    
}

var Launcher = function(config){
    var opts = $.extend({}, _config, config), 
        audio, 
        hasMusic = false,
        $J_main = $(opts.sel_main),
        $sharePopup = $(opts.sel_popup),
        $audio = false,
        result = {}
    
    var _loader = loader(opts.loadResources, {
        'loadType' : opts.loadType || 0, //0为并行加载  1为串行加载
        'minTime' : 0, //单个资源加载所需的最小时间数（毫秒）
        'dataAttr' : 'preload',
        'concurrency':opts.concurrency || 0
    }).done(function(loader){
        if(opts.hasMusic){
            $audio = $(opts.sel_audio)
            audio = loader.get(opts.bgMusic)
            audio.loop = true
            if(opts.isMusicPlay){
                playAudio()
            }
        }
        $J_main.removeClass('hide')
        config.callback && requestAnimationFrame(opts.callback)
    })
    
    wechat('friend', opts.share_data);           // 朋友
    wechat('timeline', opts.share_data);         // 朋友圈

    var PCPrompt = new mo.PCPrompt({url:opts.PCQRcode}); // PC端展示的二维码地址
    
    $(document).on('click', '.J_share', function(e){
        
    })

    if(opts.hasMusic){
        var playAudio = function(){
            hasMusic = true;
            $audio.removeClass('off');
            audio.play();
        }

        var pauseAudio = function(){
            hasMusic = false;
            $audio.addClass('off');
            audio.pause();
        }
        $(document).on('touchstart', opts.sel_audio, function(){
            if(hasMusic){
                pauseAudio();
            }else{
                playAudio();
            }
        })
        result.playAudio = playAudio
        result.pauseAudio = pauseAudio
    }
    
    result.openShareMask = function(){
        $sharePopup.removeClass('hide')
        $sharePopup.one('click', function(){
            $(this).addClass('hide')
        })
    }


    result.loader = _loader

    return result
}


module.exports = Launcher;
// 引用样式
require('../index.html') // reload
require('../../common/js/swiper/swiper.min.css')
require('../../common/js/swiper/swiper.js')
require('../css/style.scss')
var loader = require('./loader.js'),
    utils = require('../../common/js/utils/index.js'),
    wechat = require('../../common/js/wechat/index.js'),
    Page = require('./page.js'),
    PCPrompt = require('../../common/js/motion/pc-prompt/pc-prompt.js')

var PCPrompt = new mo.PCPrompt({url:window.location.href});
// preloader
require('../plugin/bg.mp3')

// 因为通天塔会发布 img会发布到cdn 而plugin不会发布到idc ，所以plugin目录下的文件不需要 ../
var loadImages = ['../img/sprite.icon.png','../img/logo.png','plugin/bg.mp3'];

var $J_main = $('#J_main'),
    $sharePopup = $('#J_sharePopUp'),
    audio;

var myloader = loader(loadImages).done(function(loader){
    audio = loader.get('plugin/bg.mp3')
    audio.loop = true
    hasMusic = true
    $J_main.removeClass('hide')
    requestAnimationFrame(start)
})

myloader.load(['http://h5.m.jd.com/active/AcKS3D7DQJ5B5RuEQzky1RgBb6c/pages/12938/img/wrj_12.png','http://h5.m.jd.com/active/AcKS3D7DQJ5B5RuEQzky1RgBb6c/pages/12938/img/wrcang_12.png','http://h5.m.jd.com/active/AcKS3D7DQJ5B5RuEQzky1RgBb6c/pages/12938/img/wrcar_12.png'], {
    callback: function(){
        console.info('分段加载')
    }
})

var _isAudioPlay = false;

/**
 * 微信API
 */
var share_data = {
    'img': 'http://h5.m.jd.com/active/2G81HfPDtVb2HtcNrvka9ikam56u/pages/14313/img/logo.jpeg',   // 选填，默认为空或者当前页面第一张图片
    'link': window.location.href,
    'desc': '感谢支持1',
    'title': '京东2016活动 H5-Boilerplate'
}

wechat('friend', share_data);           // 朋友
wechat('timeline', share_data);         // 朋友圈


function start(){
    //TODO 初始化滑屏幕组件
    var page = Page();
    var swiper = new Swiper('#J_swiper-pagination', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        direction: 'vertical',
        onSlideChangeEnd: function(swiper){
            page.to(swiper.activeIndex)
            console.info('销毁index：' + swiper.previousIndex)
        }
    });

    $(document).on('touchstart', '#J_audio', function(){
        if(_isAudioPlay){
            $(this).addClass('off')
            _isAudioPlay = false;
            audio.pause()
        }else{
            $(this).removeClass('off')
            _isAudioPlay = true;
            audio.play()
        }
    })
    // 微信分享
    $(document).on('click', '.J_share', function(e){
        $sharePopup.removeClass('hide')
        $sharePopup.one('click', function(){
            $(this).addClass('hide')
        })
    })

    // 关闭当前webview
    $(document).on('click', '.J_close', function(){
        wechat('closeWebView'); 
    })

    //微信获取当前网络状态
    $(document).on('click', '.J_network', function(){
        wechat('network', function(res){
            $('.J_network').text('网络状态(' + res.err_msg.split(':')[1] + ')')
        });
    })

    //微信图片查看器
    $(document).on('click', '.J_preivewImage', function(){
        var imageUrls = [
            "http://pic003.cnblogs.com/2010/66372/201010/2010100914201786.jpg",
            "http://pic003.cnblogs.com/2010/66372/201010/2010100914202624.jpg",
            "http://pic003.cnblogs.com/2010/66372/201010/2010100914203364.jpg",
            "http://pic003.cnblogs.com/2010/66372/201010/2010100914204097.jpg",
            "http://pic003.cnblogs.com/2010/66372/201010/2010100914204740.gif",
            "http://pic003.cnblogs.com/2010/66372/201010/2010100914205649.jpg",
            "http://pic003.cnblogs.com/2010/66372/201010/2010100914211050.gif",
            "http://pic003.cnblogs.com/2010/66372/201010/2010100914211871.jpg",
            "http://pic003.cnblogs.com/2010/66372/201010/2010100914212444.gif",
            "http://pic003.cnblogs.com/2010/66372/201010/2010100914213091.jpg",
            "http://pic003.cnblogs.com/2010/66372/201010/2010100914213952.gif",
            "http://pic003.cnblogs.com/2010/66372/201010/2010100914214777.gif",
            "http://pic003.cnblogs.com/2010/66372/201010/2010100914215454.gif",
            "http://pic003.cnblogs.com/2010/66372/201010/2010100914220482.gif",
            "http://pic003.cnblogs.com/2012/66372/201208/2012082923435810.gif",
            "http://pic003.cnblogs.com/2012/66372/201208/2012082923440536.gif",
            "http://pic003.cnblogs.com/2012/66372/201208/2012082923441776.gif"
        ];
        var imgData = {
            current: imageUrls[0],
            urls: imageUrls
        };
        wechat('imagePreview', imgData);
    })

    $(document).on('click', '.J_email', function(){
        wechat('email', share_data);
    })

}




// 获取系统信息，设置初始设置屏幕
var system = uni.getSystemInfoSync()
console.log(system)
// #ifndef H5
var screenHeightPx = system.screenHeight
var screenWidthPx = system.screenWidth
// #endif

// #ifdef H5
// 在H5中如果是PC端或者是iPad等大屏端就进行大屏适配
var browser = {
	            versions: function() {
	                var u = navigator.userAgent, app = navigator.appVersion;
	                return {     //移动终端浏览器版本信息
	                    trident: u.indexOf('Trident') > -1, //IE内核
	                    presto: u.indexOf('Presto') > -1, //opera内核
	                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
	                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
	                    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
	                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
	                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
	                    iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
	                    iPad: u.indexOf('iPad') > -1, //是否iPad
	                    webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
	                };
	            } (),
	            language: (navigator.browserLanguage || navigator.language).toLowerCase()
	        }
var screenHeightPx = document.body.clientHeight
if(!browser.versions.mobile || browser.versions.iPad){
	var screenWidthPx = 450
}			
// #endif
console.log('屏幕宽高，单位px：', screenWidthPx, screenHeightPx)

export default {
	// #ifdef H5
	browser,
	// #endif
	system,
	screenHeightPx,
	screenWidthPx
}


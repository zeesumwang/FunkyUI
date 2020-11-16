<script>
	
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	/* #ifndef APP-NVUE */
	/* 在非APP端隐藏所有页面的滚动条 */
	::-webkit-scrollbar {
	    display: none; 
	    width: 0px !important;  
	    height: 0px !important;  
	    -webkit-appearance: none;  
	    background-color: #007AFF;  
	}
	/* 禁止在PC端的图片元素被鼠标拖动 */
	img {
	  -webkit-user-drag: none;
	}
	/* #endif */
</style>

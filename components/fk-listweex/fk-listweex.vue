<template>

	
		<list 
			:style="{'width': width + 'px'}" 
			:show-scrollbar="showScrollbar" 
			:bounce="bounce"
			:scrollable="true"
			@scroll="scroll"
		>
			<!-- #ifdef APP-NVUE -->
			<refresh v-if="hasRefresh" ref="refresh" @refresh="onrefresh" @pullingdown="onpullingdown" :display="isRefresh ? 'show' : 'hide'">
				<view 
					style="justify-content: center;align-items: center;flex-direction: row;flex-wrap: nowrap;" 
					:style="{'width': width + 'px', 'height': maxPullingDistance + 'px'}"
				>
					<loading-indicator v-if="isRefresh" :animating="true" style="color: #FFFFFF;width: 20px;height: 20px;margin: 10px;"></loading-indicator>
					<image class="refreshIcon" 
						:class="{'refreshIconActive': movedDistance >= refreshDistance}" 
						:style="{width: isRefresh || isTouchMove == false ? 0 : '30px', margin: isRefresh  || isTouchMove == false ? 0 : '5px'}" 
						:src="pullingIcon"
					>
					</image>
					
					<text :style="{color: refreshTextColor, fontSize: refreshTextFontSize, width: !isRefresh && isTouchMove == false ? 0 : '60px'}">{{refreshTip}}</text>
				</view>
			</refresh>
			<!-- #endif -->
			

			
			<fk-cell ref="topElement" id="topElement"></fk-cell>
			<slot></slot>
			

		</list>
		

	

	
</template>

<script>
	// #ifdef APP-NVUE
	const dom = uni.requireNativePlugin('dom') // 在APP端引入weex的dom组件
	// #endif
	
	import screenInfo from "@/common/helper.js"
	
	export default {
		name: "fkListweex",
		props: {
			height: {
				type: Number,
				default() {
					return 350
				},
			},
			width: {
				type: Number,
				default() {
					return 350
				},
			},
			hasRefresh: {
				type: Boolean,
				default() {
					return true
				}
			},
			pullingIcon: {
				type: String,
				default() {
					return "/static/pullingDown.png"
				}
			},
			refreshingIcon: {
				type: String,
				default() {
					return "/static/refreshing.png"
				}
			},
			showScrollbar: {
				type: Boolean,
				default() {
					return false
				}
			},
			bounce: {
				type: Boolean,
				default() {
					return true
				}
			},
			maxPullingDistance: {
				type: Number,
				default() {
					return 60
				}
			},
			refreshDistance: {
				type: Number,
				default() {
					return 55
				}
			},
			refreshTextColor: {
				type: String,
				default() {
					return "#ffffff"
				}
			},
			refreshTextFontSize: {
				type: String,
				default() {
					return '12px'
				}
			},
			isRefresh: {
				type: Boolean,
				default() {
					return false
				}
			},
			tips: {
				type: Object,
				default() {
					return {
						'notSatisfied': '下拉刷新',
						'satisfied': '释放刷新',
						'release': '正在刷新..'
					}
				}
			}
		},
		data() {
			return {
				isTouchDown: false,
				isTouchMove: false,
				isTop: true,
				isBottom: false,
				isFirst: true,
				moveStartY: 0,
				moveStartX: 0,
				movedDistance: 0,
				display: false,
				isMouseDown: false,
				rotateDegree: 0,
				refreshTip: '',
				
				scrollWithAnimation: false,
				scrollTop: 0,
				
				latestY: 0,
				movementY: 0,
			};
		},
		beforeCreate() {
		},
		created() {
			// #ifdef H5
			if(!screenInfo.browser.versions.mobile){
				this.scrollWithAnimation = false
			}
			// #endif
		},
		mounted() {
		},
		methods: {
			backToTop: function() {
				// #ifdef APP-NVUE
				let topElement = this.$refs['topElement']
				dom.scrollToElement(topElement, {
					offset: 0,
					animated: true
				})
				// #endif
				// #ifndef APP-NVUE
				this.scrollWithAnimation = true
				this.scrollTop = 0
				setTimeout(()=>{this.scrollWithAnimation = false},300)
				
				// #endif
				console.log('backingTop')
			},
			scrolltoupper: function(e) {
				this.isTop = true
			},
			scrolltolower: function(e) {
				this.isBottom = true
			},
			detectScrollAction: function(e) {
				let deltaY = 0 
				// #ifdef APP-NVUE
				this.isTouchDown = e.isDragging
				// NVUE下使用的<list>组件的@scroll事件，其Y轴变化量没给出，需要自行计算
				deltaY = e.contentOffset.y - this.latestY
				this.latestY = e.contentOffset.y
				// #endif
				
				// #ifndef APP-NVUE
				// 非NVUE下使用的<scroll-view>组件，其Y轴变化量已给出，直接获取
				deltaY = e.detail.deltaY
				// #endif
				
				// console.log(deltaY)/* 
				if(this.isTouchDown == true && deltaY > 15) {
					this.$emit('dragingDown')
					// console.log("向下拖动")
				}
				if(this.isTouchDown == true && deltaY < -15) {
					this.$emit('dragingUp')
					// console.log("向上拖动")
				}
			},
			detectRefresh: function() {
				// 非APP端，判断下拉程度，设置图标动态旋转角度
				// #ifndef APP-NVUE
				if(this.movedDistance > this.refreshDistance * 0.718){
					this.rotateDegree = Math.min((this.movedDistance - this.refreshDistance * 0.718) / (this.refreshDistance * (1 - 0.718)) * 180, 179.99)
				}
				else{
					this.rotateDegree = 0
				}
				// #endif
				
				// 判断是否满足刷新条件
				if(this.movedDistance >= this.refreshDistance){
					this.refreshTip = this.tips.satisfied
				}
				else {
					this.refreshTip = this.tips.notSatisfied
				}
			},
			checkPulling: function(e) {
				if(this.isFirst){
					this.moveStartY = e.changedTouches[0].pageY
					this.moveStartX = e.changedTouches[0].pageX
					this.isFirst = false
				}
				else{
					var movedY = e.changedTouches[0].pageY - this.moveStartY
					if(movedY < 0){
						return
					}
					var movedX = Math.abs(e.changedTouches[0].pageX - this.moveStartX)
					
					// 当拖拽角度小于45度才进行下拉更新，tan45` = 1，对边比临边。
					if(movedY !== 0 && movedX / movedY < 1 && movedX < this.maxPullingDistance) {
						this.movedDistance = Math.min(movedY,this.maxPullingDistance)
						this.detectRefresh()
					}
				}
			},
			wheel: function(e) {
				// #ifdef H5
				// H5下的滚轮引起的滚动自动默认为触摸，以适配PC端，参照MDN文档：https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event
				this.isTouchDown = true
				// #endif
			},
			scroll: function(e) {
				this.detectScrollAction(e)
				
				// #ifndef APP-NVUE
				// 同步PC端下鼠标点摁触摸的滚动和滚轮的滚动状态
				this.scrollTop = e.detail.scrollTop
				
				if(e.detail.scrollTop <= 4){
					this.isTop = true
				}
				else{
					if(this.isTop){
						this.isTop = false
					}
					if(this.isBottom){
						this.isBottom = false
					}
				}
				// #endif
			},
			touchstart: function() {
				this.isTouchDown = true
				if(!this.isRefresh){
					this.movedDistance = 0
				}
			},
			touchmove: function(e) {
				if(this.isRefresh || !this.isTop){
					return
				}
				else{
					this.isTouchMove = true
					this.checkPulling(e)
				}
			},
			touchend: function() {
				// #ifdef APP-NVUE
				this.movedDistance = 0
				// #endif
				
				this.isTouchDown = false
				this.isTouchMove = false
				this.isFirst = true
				
				if(this.refreshTip == this.tips.satisfied){
					this.refreshTip = this.tips.release
					this.$emit("refreshing")
				}
				else{
				}
			},
			
			// 在PC端监听mousedown/mousemove/mouseup事件模拟手机端触摸事件
			// MDN文档(https://developer.mozilla.org/zh-CN/docs/Web/API/Element/mousemove_event)
			// #ifdef H5
			mousedown: function(e) {
				this.isMouseDown = true
				// this.scrollWithAnimation = false
				this.touchstart()
			},
			mousemove: function(e) {
				if(this.isMouseDown) {
					this.scrollTop -= e.movementY
					this.movementY += e.movementY
					let touchevent = {'changedTouches':[{'pageY': e.screenY, 'pageX': e.screenX}]}
					this.touchmove(touchevent)
				}
			},
			mouseup: function(e) {
				// PC端模拟移动端页面平滑滚动
				// this.scrollWithAnimation = true
				// var movementY = this.movementY
				// var step = Math.abs(movementY)
				// for(var i = 0; i < step;i++){
				// 	let event = {"movementY": movementY * (1/step)}
				// 	this.scrollTop -= event.movementY
				// }
				// this.scrollTop -= movementY
				// 置零平滑距离
				// this.movementY = 0
				// 同步到触摸结束事件
				this.isMouseDown = false
				this.touchend()				
			},
			// #endif
			
			
			// nvue下释放刷新也转到touchend
			onrefresh: function(e) {
				console.log(e)
				this.touchend()
			},
			onpullingdown: function(e) {
				this.refreshDistance = e.viewHeight
				this.movedDistance = e.pullingDistance
				this.isTouchMove = true
				this.detectRefresh()
			}
		}
	}
</script>

<style>

	/* 下拉松开回弹动画 */
	.pulldown {
		height: 0px;
		transition-property: height;
		transition-duration: 300ms;
	}
	
	/* 旋转动画 */
	.scroll-rotate {
		-webkit-animation: scrollRotate 0.6s linear infinite;
		animation: scrollRotate 0.6s linear infinite;
	}
	
	@-webkit-keyframes scrollRotate {
		0% {
			-webkit-transform: rotate(0deg);
		}
		100% {
			-webkit-transform: rotate(360deg);
		}
	}
	@keyframes mescrollRotate {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	
	.refreshIcon {
		width: 30px;
		height: 30px;
		margin: 5px; 
		transition-duration: 200ms;
		transition-property: transform;
		transform: rotate(0deg); 
		transform-origin: 15px 15px;
	}
	.refreshIconActive {
		transform: rotate(180deg);
	}
</style>

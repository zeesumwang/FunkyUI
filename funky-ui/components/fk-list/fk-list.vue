<template>
	<view>
		<!-- #ifdef APP-NVUE -->
		<!-- <view ref="refresh" style="width: 40px;height: 40px;border-radius: 20px;background-color: #4CD964;position: absolute;opacity: 1;top: 0;"></view> -->
		<!-- #endif -->
		
		<!-- #ifndef APP-NVUE -->
		<view
			v-if="hasRefresh"
			:class="{'pulldown':(!isTouchMove) && (!isRefresh)}" 
			style="justify-content: center;align-items: center;flex-direction: row;" 
			:style="{ height: (isTop == true && isTouchMove ? movedDistance : isRefresh || isTouchMove ? movedDistance: 0) + 'px'}"
		>
			<image 
				v-if="isRefresh" 
				class="scroll-rotate" 
				style="width: 26px;height: 26px;margin: 7px;" 
				:src="refreshingIcon"
			>
			</image>
			<image 
				v-if="!isRefresh && iconRealTimeRotate" 
				style="width: 26px;height: 26px;margin: 7px;" 
				:style="{transform: 'rotate(' + rotateDegree + 'deg)'}" 
				:src="pullingIcon"
			>
			</image>
			<image 
				v-if="!isRefresh && (!iconRealTimeRotate) && movedDistance > 0" 
				class="refreshIcon"
				:class="{'refreshIconActive': movedDistance >= refreshDistance}" 
				:style="{width: isRefresh || isTouchMove == false ? 0 : '26px', margin: isRefresh  || isTouchMove == false ? 0 : '7px'}" 
				:src="pullingIcon"
			>
			</image>
			<text v-if="isTouchMove && movedDistance > 0 || isRefresh" style="width: 60px;" :style="{color: refreshTextColor, fontSize: refreshTextFontSize}">{{refreshTip}}</text>
		</view>
		
		<scroll-view 
			@scroll="scroll" 
			@wheel="wheel"
			@scrolltoupper="scrolltoupper" 
			@scrolltolower="scrolltolower"	
			@touchstart="touchstart"
			@touchmove="touchmove"
			@touchend="touchend"
			@mousedown="mousedown"
			@mousemove.native="mousemove($event)"
			@mouseup="mouseup"
			@mouseleave="mouseup"
			:offset-accuracy="15"
			:enable-flex="true"
			:scroll-into-view="scrollIntoView"
			:scroll-y="true" 
			:scroll-with-animation="scrollWithAnimation"
			:scroll-top="scrollTop"
			:show-scrollbar="showScrollbar" 
			:bounce="bounce"
			:style="{'height': height + 'px','width': width + 'px'}"
		>
		
		<view> <!-- scroll-view中加入一个view防止scrollview的固定高度影响position: sticky;的粘性布局，以实现吸顶效果 -->
			<fk-cell ref="topElement" id="topElement"></fk-cell>
			<slot></slot>
		</view>
			
		</scroll-view>
	
		<!-- #endif -->
		
		<!-- #ifdef APP-NVUE -->
		<list 
			v-if="platform=='android'"
			ref="list"
			:style="{'height': height + 'px','width': width + 'px'}" 
			:show-scrollbar="showScrollbar" 
			:bounce="!bounce"
			:scrollable="scrollable"
			:loadmoreoffset="50"
			:offset-accuracy="15"
			:alwaysScrollableVertical="true"
			@scroll="scroll"
			@loadmore="loadmore"
			@verticalpan="verticalpan"
		>
			<refresh v-if="hasRefresh" ref="refresh" @refresh="onrefresh" @pullingdown="onpullingdown" :display="isRefresh ? 'show' : 'hide'">
				<view 
					style="justify-content: center;align-items: center;flex-direction: row;flex-wrap: nowrap;" 
					:style="{'width': width + 'px', 'height': maxPullingDistance + 'px'}"
				>
					<loading-indicator v-if="isRefresh" :animating="true" style="width: 20px;height: 20px;margin: 10px;" :style="{color: refreshTextColor}"></loading-indicator>
					<image 
						class="refreshIcon" 
						:class="{'refreshIconActive': movedDistance >= refreshDistance}" 
						:style="{width: isRefresh || isTouchMove == false ? 0 : '26px', margin: isRefresh  || isTouchMove == false ? 0 : '7px'}" 
						:src="pullingIcon"
					>
					</image>
					
					<text :style="{color: refreshTextColor, fontSize: refreshTextFontSize, width: !isRefresh && isTouchMove == false ? 0 : '60px'}">{{refreshTip}}</text>
				</view>
			</refresh>
			<fk-cell ref="topElement" id="topElement"></fk-cell>
			<slot></slot>
		</list>
	
		<list
			v-if="platform=='ios'"
			:style="{'height': height + 'px','width': width + 'px'}" 
			:show-scrollbar="showScrollbar" 
			:bounce="bounce"
			:scrollable="scrollable"
			:loadmoreoffset="50"
			:offset-accuracy="15"
			:alwaysScrollableVertical="true"
			@scroll="scroll"
			@loadmore="loadmore"
		>
			<refresh v-if="hasRefresh" ref="refresh" @refresh="onrefresh" @pullingdown="onpullingdown" :display="isRefresh ? 'show' : 'hide'">
				<view 
					style="justify-content: center;align-items: center;flex-direction: row;flex-wrap: nowrap;" 
					:style="{'width': width + 'px', 'height': maxPullingDistance + 'px'}"
				>
					<loading-indicator v-if="isRefresh" :animating="true" style="width: 20px;height: 20px;margin: 10px;" :style="{color: refreshTextColor}"></loading-indicator>
					<image 
						class="refreshIcon" 
						:class="{'refreshIconActive': movedDistance >= refreshDistance}" 
						:style="{width: isRefresh || isTouchMove == false ? 0 : '26px', margin: isRefresh  || isTouchMove == false ? 0 : '7px'}" 
						:src="pullingIcon"
					>
					</image>
					
					<text :style="{color: refreshTextColor, fontSize: refreshTextFontSize, width: !isRefresh && isTouchMove == false ? 0 : '60px'}">{{refreshTip}}</text>
				</view>
			</refresh>
			<fk-cell ref="topElement" id="topElement"></fk-cell>
			<slot></slot>
		</list>
		<!-- #endif -->
</view>
</template>

<script>
	// #ifdef APP-NVUE
	const dom = uni.requireNativePlugin('dom') // 在APP端引入weex的dom组件
	// #endif
	
	import screenInfo from "../../common/helper.js"
	import icons from "../../common/iconBase64.js"
	
	export default {
		name: "fkList",
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
			refreshMode: {
				type: String,
				default() {
					return 'bindingX'
				}
			},
			iconRealTimeRotate: {
				type: Boolean,
				default() {
					return false
				}
			},
			pullingIcon: {
				type: String,
				default() {
					return icons.pullingDownIcon
				}
			},
			refreshingIcon: {
				type: String,
				default() {
					return icons.refreshingIcon
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
			},
			scrollable: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				platform: '',
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
				scrollIntoView: '',
				scrollTop: 0,
				maxScrollTop: 0,
				
				latestY: 0,
				lastHeight: 0,
				movementY: 0,
				dragingDown: false,
				dragingUp: false
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
			// #ifdef APP-NVUE
			this.platform = screenInfo.system.platform
			// #endif
		},
		mounted() {
		},
		methods: {
			// #ifdef H5
			// 节流
			ThrottlePro: function (fn, interval) {
			  // last为上一次触发回调的时间
			  let last = 0
			  
			  // 将throttle处理结果当作函数返回
			  return function () {
				  // 保留调用时的this上下文
				  let context = this
				  // 保留调用时传入的参数
				  let args = arguments
				  // 记录本次触发回调的时间
				  let now = +new Date()
				  
				  // 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
				  if (now - last >= interval) {
				  // 如果时间间隔大于我们设定的时间间隔阈值，则执行回调
					console.log("执行")
					last = now;
					fn.apply(context, args);
				  }
				}
			},
			// #endif
			backToTop: function() {
				// #ifdef APP-NVUE
				let topElement = this.$refs['topElement']
				dom.scrollToElement(topElement, {
					offset: 0,
					animated: true
				})
				// #endif
				
				// #ifndef APP-NVUE
				
				// #ifdef H5
				this.scrollWithAnimation = true
				this.scrollTop = 0
				this.$nextTick(()=>{
					this.scrollWithAnimation = false
				})
				// #endif
				
				// #ifdef MP
				this.scrollWithAnimation = true
				this.scrollIntoView = ''
				this.$nextTick(()=> {
				                this.scrollIntoView = 'topElement'
								this.scrollWithAnimation = false
				            });
				// #endif
				
				// #endif
			},
			scrolltoupper: function(e) {
				this.isTop = true
			},
			scrolltolower: function(e) {
				this.isBottom = true
				this.loadmore()
			},
			detectScrollAction: function(e) {
				let deltaY = 0 
				
				// #ifdef APP-NVUE
				// NVUE下不监听touchstart事件，是否有手指触摸屏幕由scroll事件中的isDragging属性确定
				this.isTouchDown = e.isDragging
				// NVUE下使用的<list>组件的@scroll事件，其Y轴变化量没给出，需要自行计算
				if(this.isTouchDown == true) {
					deltaY = e.contentOffset.y - this.latestY
					this.latestY = e.contentOffset.y
				}
				// console.log(e.contentSize.height,e.contentOffset.y)
				// #endif
				
				// #ifndef APP-NVUE
				// 非NVUE下使用的<scroll-view>组件，其Y轴变化量已给出，直接获取
				deltaY = e.detail.deltaY
				// #endif
				
				// console.log(deltaY)/* 
				if(this.isTouchDown == true && deltaY > 10 && deltaY < 80) {
					if(this.dragingDown !== true) {
						// #ifdef APP-NVUE
						// 过滤在APP安卓端bounce回弹效果下，上拉加载更多时触发的Y轴变化
						let isLoadMoreBounce = (e.contentSize.height!==this.lastHeight)
						this.lastHeight = e.contentSize.height
						if(isLoadMoreBounce){
							// console.log("过滤在bounce回弹效果下，上拉加载更多时触发的Y轴变化")
							return
						}
						// #endif
						this.$emit('dragingDown')
						this.dragingDown = true
						this.dragingUp = false
						// console.log("向下拖动",deltaY)						
					}
				}
				if(this.isTouchDown == true && deltaY < -30 && deltaY > -80) {
					if(this.dragingUp !== true) {
						this.$emit('dragingUp')
						this.dragingUp = true
						this.dragingDown = false
						// console.log("向上提拉",deltaY,this.isTouchDown)
					}
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
					// 计算当前Y轴偏移量
					var movedY = e.changedTouches[0].pageY - this.moveStartY
					// 如果movedY小于零，则为上拉，上拉不进行操作
					if(movedY < 0) {
						return
					}
					// 过滤/节流，只有1px的变化才会更新(已废弃，在手机端是采样触摸位置的原因，导致所有的偏移量都不是整数)
					// if(movedY % 1 !== 0){
					// 	console.log(movedY)
					// 	return
					// }
					// 计算当前X轴偏移量
					var movedX = Math.abs(e.changedTouches[0].pageX - this.moveStartX)
					
					// 当拖拽角度小于30度才进行下拉更新，tan30` ~ 0.577，对边比临边。
					if(movedX / movedY < 0.577 && movedX < 44 || this.movedDistance > 0) {
						this.movedDistance = Math.min(movedY,this.maxPullingDistance)
						this.detectRefresh()
					}
					else{
						this.isFirst = true
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
				this.$emit('scroll',e)
				this.detectScrollAction(e)
				
				// #ifndef APP-NVUE
				// 同步PC端下鼠标点摁触摸的滚动和滚轮的滚动状态
				// #ifdef H5
				this.scrollTop = e.detail.scrollTop
				this.maxScrollTop = e.detail.scrollHeight
				// #endif
				
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
				if(this.isMouseDown){
					this.isMouseDown = false
					return
				}
				this.isMouseDown = true
				this.scrollWithAnimation = false
				this.touchstart()
			},
			mousemove: function(e) {
				this.fakeTouchMove(e)
			},
			fakeTouchMove: function(e) {
				if(this.isMouseDown) {
					// if(Math.abs(e.movementY)<3 && !this.isTop){
					// 	return
					// }
					let newScrollTop = Math.max(0, this.scrollTop - e.movementY)
					this.scrollTop = Math.min(newScrollTop,this.maxScrollTop)
					this.movementY += e.movementY
					let touchevent = {'changedTouches':[{'pageY': e.screenY, 'pageX': e.screenX}]}
					this.touchmove(touchevent)
				}
				else{
					return
				}
			},
			mouseup: function() {
				// PC端模拟移动端页面平滑滚动
				this.scrollWithAnimation = true
				var movementY = this.movementY * 2
				var step = Math.abs(movementY)
				for(var i = 0; i < step;i++){
					if(!this.isMouseDown){
						return
					}
					let event = {"movementY": movementY * (1/step)}
					this.scrollTop -= event.movementY
				}
				this.scrollTop -= movementY
				// 置零平滑距离
				this.movementY = 0
				// 同步到触摸结束事件
				this.isMouseDown = false
				this.touchend()				
			},
			// #endif
			
			
			// nvue下释放刷新也转到touchend
			onrefresh: function(e) {
				this.touchend()
			},
			onpullingdown: function(e) {
				this.refreshDistance = e.viewHeight
				this.movedDistance = e.pullingDistance
				this.isTouchMove = true
				this.detectRefresh()
			},
			
			loadmore: function() {
				this.$emit('loadmore')
			},
			getEl: function(e) {
				if (typeof(e[0]) == 'object') {
					return e[0].ref
				} else {
					return e.ref
				}
			},
			verticalpan: function(e) {
				e.stopPropagation()
			}
		}
	}
</script>

<style>
	/* #ifndef APP-NVUE */
	/* 下拉松开回弹动画 */
	.pulldown {
		height: 0px;
		opacity: 0;
		transition-property: height opacity;
		transition-duration: 300ms;
	}
	
	/* 旋转动画 */
	.scroll-rotate {
		-webkit-animation: scrollRotate 1s linear infinite;
		animation: scrollRotate 1s linear infinite;
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
	/* #endif */
	
	.refreshIcon {
		width: 26px;
		height: 26px;
		margin: 7px; 
		transition-duration: 150ms;
		transition-property: transform;
		transform: rotate(0deg); 
		transform-origin: 13px 13px;
	}
	.refreshIconActive {
		transform: rotate(180deg);
	}
</style>

<template>
	<view>
		<!-- #ifndef APP-NVUE -->
		
		<scroll-view 
			@scroll="scroll" 
			@scrolltoupper="scrolltoupper" 
			@scrolltolower="scrolltolower"	
			@touchmove="touchmove"
			@touchend="touchend"
			@mousedown="mousedown"
			@mousemove.native="mousemove($event)"
			@mouseup="mouseup"
			:scroll-y="true" 
			:scroll-top="scrollTop"
			:show-scrollbar="showScrollbar" 
			:bounce="bounce"
			:style="{'height': height + 'px','width': width + 'px'}"
			style="scroll-behavior: auto;"
		>
			<view
				v-if="hasRefresh"
				:class="{'pulldown':!isTouchMove && !isRefresh}" 
				style="justify-content: center;align-items: center;flex-direction: row;" 
				:style="{ height: (isTop == true && isTouchMove ? movedDistance : isRefresh ? movedDistance: 0) + 'px'}"
			>
			
				<image v-if="isRefresh" class="scroll-rotate" style="width: 30px;height: 30px;margin: 5px;" :src="refreshingIcon"></image>
				<image v-if="!isRefresh" style="width: 30px;height: 30px;margin: 5px;" :style="{transform: 'rotate(' + rotateDegree + 'deg)'}" :src="pullingIcon"></image>
				
				<text style="width: 60px;" :style="refreshTextStyle">{{refreshTip}}</text>
			</view>
		<!-- #endif -->
		
		<!-- #ifdef APP-NVUE -->
		<list 
			:style="{'height': height + 'px','width': width + 'px'}" 
			:show-scrollbar="showScrollbar" 
			:bounce="bounce"
			:scrollable="true"
		>
			<refresh v-if="hasRefresh" ref="refresh" @refresh="onrefresh" @pullingdown="onpullingdown" :display="display">
				
			</refresh>
		<!-- #endif -->
			
			<slot></slot>
			
		<!-- #ifdef APP-NVUE -->
		</list>
		<!-- #endif -->
		
		<!-- #ifndef APP-NVUE -->
		</scroll-view>
		<!-- #endif -->
	</view>
</template>

<script>
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
					return 45
				}
			},
			refreshTextStyle: {
				type: Object,
				default() {
					return {
						"color": "#ffffff",
						"fontSize": "12px"
					}
				}
			},
			isRefresh: {
				type: Boolean,
				default() {
					return false
				}
			}
		},
		data() {
			return {
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
				refreshTip: "下拉刷新",
				scrollTop: 0
			};
		},
		created() {
		},
		mounted() {
		},
		methods: {
			scrolltoupper: function(e) {
				this.isTop = true
			},
			scrolltolower: function(e) {
				this.isBottom = true
			},
			scroll: function(e) {
				this.scrollTop = e.detail.scrollTop
				if(e.detail.scrollTop <= 1){
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
			},
			touchmove: function(e) {
				if(this.isRefresh || !this.isTop){
					return
				}
				this.movedDistance = 0
				this.isTouchMove = true
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
						if(this.movedDistance > this.refreshDistance * 0.618){
							this.rotateDegree = Math.min((this.movedDistance - this.refreshDistance * 0.618) / (this.refreshDistance * 0.618) * 180, 179.9)
						}
						else{
							this.rotateDegree = 0
						}
						if(this.movedDistance >= this.refreshDistance){
							this.refreshTip = "释放刷新"
						}
						else {
							this.refreshTip = "下拉刷新"
						}
					}
				}
			},
			touchend: function() {
				this.isTouchMove = false
				this.isFirst = true
				if(this.refreshTip == "释放刷新"){
					this.refreshTip = "正在刷新.."
					this.$emit("refreshing")
				}
				else{
				}
			},
			
			// 在PC端监听mousedown/mousemove/mouseup事件模拟手机端触摸事件
			// MDN文档(https://developer.mozilla.org/zh-CN/docs/Web/API/Element/mousemove_event)
			mousedown: function(e) {
				this.isMouseDown = true
			},
			mousemove: function(e) {
				if(this.isMouseDown) {
					this.scrollTop -= e.movementY
					
					if(this.isTop || this.isBottom){
						let touchevent = {'changedTouches':[{'pageY': e.screenY, 'pageX': e.screenX}]}
						this.touchmove(touchevent)
					}
					else{
						
					}
				}
			},
			mouseup: function(e) {
				this.isMouseDown = false
				this.touchend()
			},
			
			// nvue下释放刷新也转到touchend
			onrefresh: function(e) {
				this.touchend()
			},
			onpullingdown: function(e) {
				console.log(e)
			}
		}
	}
</script>

<style>
	/* #ifndef APP-NVUE */
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
	/* #endif */
</style>

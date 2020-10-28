<template>
	
		<!-- #ifndef APP-NVUE -->
		<scroll-view 
			@scroll="scroll" 
			@scrolltoupper="scrolltoupper" 
			@scrolltolower="scrolltolower"	
			@touchmove="touchmove"
			@touchend="touchend"
			:scroll-y="true" 
			:show-scrollbar="false" 
			:style="{'height': height + 'px','width': width + 'px'}"
		>
			<fk-cell>
				<view 
					:class="{'pulldown':!isTouchMove}" 
					style="justify-content: center;align-items: center;" 
					:style="{ height: (isTop == true && isTouchMove ? refreshHeight : 0) + 'px'}"
				>
					<image style="width: 30px;height: 30px;" :src="refreshIcon"></image>
				</view>
			</fk-cell>
		<!-- #endif -->
		
		<!-- #ifdef APP-NVUE -->
		<list :style="{'height': height + 'px','width': width + 'px'}">
			<refresh ref="refresh" @refresh="onrefresh" @pullingdown="onpullingdown" :display="display">
				
			</refresh>
		<!-- #endif -->
		
			
			<slot></slot>
			
		<!-- #ifdef APP-NVUE -->
		</list>
		<!-- #endif -->
		
		<!-- #ifndef APP-NVUE -->
		</scroll-view>
		<!-- #endif -->
	
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
			refreshIcon: {
				type: String,
				default() {
					return "/static/logo.png"
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
				refreshHeight: 0,
				display: false
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
				// console.log(e.detail.scrollTop)
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
				this.isTouchMove = true
				var movedY = Math.abs(e.changedTouches[0].pageY - this.moveStartY)
				var movedX = Math.abs(e.changedTouches[0].pageX - this.moveStartX)
				
				// 当拖拽角度小于45度才进行下拉更新，tan45` = 1，对边比临边。
				if(movedY !== 0 && movedX / movedY < 1) {
					if(this.isFirst){
						this.moveStartY = e.changedTouches[0].pageY
						this.moveStartX = e.changedTouches[0].pageX
						this.isFirst = false
					}
					else{
						this.refreshHeight = Math.min(movedY,150)
					}
					
					if(this.isTop){
						let event = {'type':'Top','moveY':this.refreshHeight}
						this.$emit('pullingdown',event)
					}
					else if(this.isBottom){
						let event = {'type':'Bottom','moveY':this.refreshHeight}
						this.$emit('draggingup',event)
					}
					else{
						// console.log('touchmove异常',e)
					}
				}
			},
			touchend: function(e) {
				this.isTouchMove = false
				this.isFirst = true
				this.refreshHeight = 0
			},
			onrefresh: function(e) {
				console.log(e)
			},
			onpullingdown: function(e) {
				console.log(e)
			}
		}
	}
</script>

<style>
.pulldown {
	height: 0px;
	transition-property: height;
	transition-duration: 300ms;
}
</style>

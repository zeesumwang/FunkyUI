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
				<view :class="{'pulldown':!isTouchMove}" style="justify-content: center;align-items: center;" :style="{ height: (isTop==true&&isTouchMove ? movedY : 0) + 'px'}">
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
				movedY: 0,
				display: false
			};
		},
		created() {
		},
		mounted() {
			console.log(this.$refs.refresh)
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
				if(this.isTop){
					if(this.isFirst){
						this.moveStartY = e.changedTouches[0].pageY
						this.isFirst = false
					}
					else{
						let movedY = Math.abs(e.changedTouches[0].pageY - this.moveStartY)
						this.movedY = Math.min(movedY,150)
					}
					let event = {'type':'Top','moveY':this.movedY}
					this.$emit('pullingdown',event)
				}
				else if(this.isBottom){
					if(this.isFirst){
						this.moveStartY = e.changedTouches[0].pageY
						this.isFirst = false
					}
					else{
						let movedY = Math.abs(e.changedTouches[0].pageY - this.moveStartY)
						this.movedY = Math.min(movedY,150)
					}
					let event = {'type':'Bottom','moveY':this.movedY}
					this.$emit('draggingup',event)
				}
				else{
					// console.log('touchmove异常',e)
				}
			},
			touchend: function(e) {
				this.isTouchMove = false
				this.isFirst = true
				this.movedY = 0
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

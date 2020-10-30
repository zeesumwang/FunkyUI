<template>
	<view class="app">
		<!-- #ifndef H5 -->
		<view :style="{height: statusBarHeight + 'px'}"></view>
		<!-- #endif -->
		
		<swiper 
		  :style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}"
		  @change="swiperChange" 
		  @transition="transition" 
		  @animationfinish="animationfinish"
		  easing-function="easeInOutCubic" 
		  duration="300"
		  :indicator-dots="false"
		  :current="currentFabIndex"
		  >

			<swiper-item v-if="hideCount>0">
				<view
					class="page"
					:style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}"
				>
					<slot name="hidePage"></slot>
				</view>
			</swiper-item>
			
			<swiper-item>
				<view
					class="page"
					:style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}"
				>
					<slot name="mainPage0"></slot>
				</view>
			</swiper-item>
			
			<swiper-item>
				<view
					class="page"
					:style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}"
				>
				<slot name="mainPage1"></slot>
				</view>
			</swiper-item>
			
			<swiper-item>
				<view
					class="page"
					:style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}"
				>
				<slot name="mainPage2"></slot>
				</view>
			</swiper-item>
			
			<swiper-item>
				<view
					class="page"
					:style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}"
				>
					<slot name="mainPage3"></slot>
				</view>
			</swiper-item>
	
		</swiper>

		<label>
			<fk-transition elevation="10px" :duration="120" :mode-class="fabModeClass" :styles="transfromClass" :show="isFabShow">
				<view
					v-for="(fab,index) in fabList" 
					class="fab_item" 
					:id="fab.id" 
					:key="index" 
					@tap="fabClick"
				>
					<image
						mode="aspectFill"
						:src="fab.url" 
						style="width: 20px;height: 20px;opacity: 0.2" 
						:style="{
									opacity:
										virtualCurrentFabIndex==index+hideCount
										? virtualCurrentFabIndexOpacity 
										: targetFabIndex==index+hideCount
										? targetFabIndexOpacity 
										: 0.2
									,
									borderRadius: 
										fab.id=='user'
										? '20px' 
										: ''
								}"
					/>
				</view>
			</fk-transition>
		</label>
		
	</view>
</template>

<script>
	// #ifdef APP-NVUE
	const Binding = uni.requireNativePlugin('bindingx');
	// const dom = weex.requireModule('dom');
	// #endif

	import screenInfo from "@/common/helper.js"

	export default {
		name: "fkIndex",
		props: {
			fabList: {
				type: Array,
				default() {
					return []
				}
			},
			isFabShow: {
				type: Boolean,
				default() {
					return true
				}
			},
			backgroundColor: {
				type: String,
				default() {
					return '#1e1e1e'
				}
			},
			opacity: {
				type: Number,
				default() {
					return 1
				}
			},
			borderRadius: {
				type: Number,
				default() {
					return 50
				}
			},
			fabModeClass: {
				type: Array,
				default() {
					return ['slide-bottom','fade']
				}
			},
			position: {
				type: String,
				default() {
					return 'right'
				}
			},
			widthScale: {
				type: Number,
				default() {
					return 0.618
				}
			},
			bottom: {
				type: Number,
				default() {
					return 21
				}
			},
			hideCount: {
				type: Number,
				default() {
					return 0
				}
			},
			current: {
				type: Number,
				default() {
					return 0
				}
			}
		},
		data() {
			return {
				transfromClass: {},

				isFabClick: false,
				isContinuity: 0,
				
				currentFabIndex: 0,
				virtualCurrentFabIndex: 0,
				virtualCurrentFabIndexOpacity: 1,
				targetFabIndex: '',
				targetFabIndexOpacity: '',
				
				screenHeight: '',
				screenHeightPx: {},
				screenWidthPx: '',
				statusBarHeight: '',
			}
		},
		created() {
			// 设置显示页加上负一屏的偏移
			this.currentFabIndex = this.current + this.hideCount
			this.virtualCurrentFabIndex = this.current + this.hideCount
			
			// 获取全局变量中的屏幕宽高		
			this.screenHeightPx = screenInfo.screenHeightPx
			this.screenWidthPx = screenInfo.screenWidthPx
			this.statusBarHeight = screenInfo.system.statusBarHeight
			
			this.transfromClass = {
					'position': 'fixed',
					/* #ifndef APP-NVUE */
					'display': 'flex',
					/* #endif */
					'background-color': this.backgroundColor,
					'opacity': this.opacity,
					'justify-content': 'space-around',
					'align-items': 'center',
					'border-radius': this.borderRadius + 'px',
					'flex-direction': 'row',
					'width': Math.max(200, this.screenWidthPx * this.widthScale) + 'px',
					'bottom': this.bottom + 'px',
				}
			if(this.position == 'left'){
				this.transfromClass.right = (this.screenWidthPx - Math.max(200, this.screenWidthPx * this.widthScale)) / 2  + 'px'
			}
			else{
				this.transfromClass.left = (this.screenWidthPx - Math.max(200, this.screenWidthPx * this.widthScale)) / 2  + 'px'
			}
		},
		methods: {
			transition: function(e) {
				// 如果是点击fab进行切换，则不用展示过度动画。
				if (this.isFabClick == true) {
					return
				}
				
				// 对连续的滑屏事件进行dx校准，在连续滑屏的时候只有一段连续的transition事件

				if (e.detail.dx > 0){
					var dx = e.detail.dx - this.screenWidthPx * this.isContinuity
				}
				else {
					var dx = e.detail.dx + this.screenWidthPx * this.isContinuity
				}
				
				if (dx > 0 && this.virtualCurrentFabIndex != 4) {
					this.targetFabIndex = this.virtualCurrentFabIndex + 1
				} 
				else if (dx < 0 && this.virtualCurrentFabIndex != 0) {
					this.targetFabIndex = this.virtualCurrentFabIndex - 1
				}
				
				this.targetFabIndexOpacity = Math.max(1.0 * Math.abs(dx) / this.screenWidthPx, 0.2)
				this.virtualCurrentFabIndexOpacity = Math.max(1.2 - this.targetFabIndexOpacity, 0.2)
				
				
				// 优化H5连续滑屏
				if (this.targetFabIndexOpacity > 1){
					// console.log("连续滑动触发",this.currentFabIndex,this.virtualCurrentFabIndex,this.targetFabIndex)
					this.isContinuity 	+= 1 
					// if (this.isContinuity > 0){
					// 	console.log('连续滑屏 x',this.isContinuity + 1)
					// }
					let real_dx = dx
					
					if (real_dx > 0 && this.virtualCurrentFabIndex != 4){
						this.targetFabIndex += 1
						this.virtualCurrentFabIndex += 1
					}
					else if (real_dx < 0 && this.virtualCurrentFabIndex != 0) {
						this.targetFabIndex -= 1
						this.virtualCurrentFabIndex -= 1
					}
					
					let tempOpacity = this.virtualCurrentFabIndexOpacity
					this.virtualCurrentFabIndexOpacity = 1
					this.targetFabIndexOpacity = 0.2
					// console.log("改变fab的指向",this.currentFabIndex,this.virtualCurrentFabIndex,this.targetFabIndex)
				}
				
				
			},
			animationfinish: function() {
				this.isContinuity = 0
				this.virtualCurrentFabIndexOpacity = 1
				this.targetFabIndexOpacity = 0
				this.virtualCurrentFabIndex = this.currentFabIndex
				this.targetFabIndex = -1
				this.isFabClick = false
			},
			fabClick: function(e) {
				if (!this.isFabShow) {
					return
				}
				this.isFabClick = true
				
				let clickId = e.currentTarget.id
				
				this.$emit('fabClick',{'clickId': clickId})
				for(var i = 0; i < this.fabList.length; i++){
					if (clickId == this.fabList[i].id) {
						this.currentFabIndex = this.hideCount + i
					}
				}
				
				this.virtualCurrentFabIndex = this.currentFabIndex
			},
			swiperChange: function(e) {
				let swiper_item_index = e.detail.current
				this.currentFabIndex = swiper_item_index
				this.$emit('indexChange', {'nowPage': this.currentFabIndex - this.hideCount})
				if (swiper_item_index < this.hideCount) {
					// console.log("显示负一屏")
				} 
				else {
					// console.log("隐藏负一屏"）
				}
			}			
		}
	}
</script>

<style scoped>
	.app {
		background-color: #0D0D0D;
		flex: 1;
		flex-direction: column;
	}
	
	.page {
		/* #ifndef APP-NVUE */
		display: flex;
		/* overflow-x: hidden;
		overflow-y: scroll; */
		/* #endif */
		
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
	}
	
	.status_bar {
		height: 32px;
		width: 450px;
		background-color: #0d0d0d;
	}

	.fab {
		width: 245px;
		height: 50px;
		border-radius: 100px;
		border-width: 1px;
		background-color: #212121;
		position: fixed;
		left: 65px;
		bottom: 21px;
		flex: 1;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
	}

	.fab_item {
		height: 50px;
		width: 50px;
		/* background-color: #007AFF; */
		align-items: center;
		justify-content: center;
	}

</style>

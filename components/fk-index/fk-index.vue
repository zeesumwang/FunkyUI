<template>
	<view class="index">
		<!-- #ifndef H5-->
		<view :style="{height: statusBarHeight + 'px'}"></view>
		<!-- #endif -->

		<swiper :style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}" @change="swiperChange" @transition="transition"
		 @animationfinish="animationfinish" :duration="duration" :indicator-dots="false" :current="currentFabIndex">

			<swiper-item v-if="hideCount>0">
				<view class="page" :style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}">
					<slot name="hidePage"></slot>
				</view>
			</swiper-item>

			<swiper-item>
				<view class="page" :style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}">
					<slot name="mainPage0"></slot>
				</view>
			</swiper-item>

			<swiper-item>
				<view class="page" :style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}">
					<slot name="mainPage1"></slot>
				</view>
			</swiper-item>

			<swiper-item>
				<view class="page" :style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}">
					<slot name="mainPage2"></slot>
				</view>
			</swiper-item>

			<swiper-item>
				<view class="page" :style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}">
					<slot name="mainPage3"></slot>
				</view>
			</swiper-item>

		</swiper>

		<label>
			<fk-transition :elevation="10" :blurEffect="'dark'" :backgroundColor="backgroundColor" :opacity="opacity" :duration="200"
			 :mode-class="fabModeClass" :styles="transfromClass" :show="isFabShow">
				<view v-for="(fab,index) in fabList" class="fabItem" :id="fab.id" :key="index" @tap="fabClick">
					<image :ref="'fabIcon'+index" class="fabIcon" mode="aspectFill" :src="fab.url" style="width: 20px;height: 20px;opacity: 0.2"
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
								}" />
				</view>
			</fk-transition>
		</label>

	</view>
</template>

<script>
	// #ifdef APP-NVUE
	const BindingX = uni.requireNativePlugin('bindingx');
	// #endif

	import screenInfo from "@/common/helper.js"

	export default {
		name: "fkIndex",
		props: {
			fabList: {
				type: Array,
				default () {
					return []
				}
			},
			duration: {
				type: Number,
				default: 300
			},
			isFabShow: {
				type: Boolean,
				default () {
					return true
				}
			},
			backgroundColor: {
				type: String,
				default () {
					return "30,30,30,0.618"
				}
			},
			opacity: {
				type: Number,
				default: 0.8
			},
			borderRadius: {
				type: Number,
				default () {
					return 50
				}
			},
			fabModeClass: {
				type: Array,
				default () {
					return ['fade', 'zoom-in', 'slide-bottom']
				}
			},
			position: {
				type: String,
				default () {
					return 'right'
				}
			},
			widthScale: {
				type: Number,
				default () {
					return 0.618
				}
			},
			bottom: {
				type: Number,
				default () {
					return 21
				}
			},
			hideCount: {
				type: Number,
				default () {
					return 1
				}
			},
			current: {
				type: Number,
				default () {
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
				targetFabIndexOpacity: 0.2,

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
				'justifyContent': 'space-around',
				'alignItems': 'center',
				'borderRadius': this.borderRadius + 'px',
				'flexDirection': 'row',
				'width': Math.max(200, this.screenWidthPx * this.widthScale) + 'px',
				'bottom': this.bottom + 'px',
			}
			if (this.position == 'left') {
				this.transfromClass.right = (this.screenWidthPx - Math.max(200, this.screenWidthPx * this.widthScale)) / 2 + 'px'
			} else {
				this.transfromClass.left = (this.screenWidthPx - Math.max(200, this.screenWidthPx * this.widthScale)) / 2 + 'px'
			}
		},
		mounted() {

		},
		methods: {
			transition: function(e) {
				// 如果是点击fab进行切换，则不用展示过度动画。
				if (this.isFabClick == true) {
					return
				}

				// 对连续的滑屏事件进行dx校准，在连续滑屏的时候只有一段连续的transition事件
				if (e.detail.dx > 0) {
					var dx = e.detail.dx - this.screenWidthPx * this.isContinuity
				} else {
					var dx = e.detail.dx + this.screenWidthPx * this.isContinuity
				}

				if (dx > 0 && this.virtualCurrentFabIndex != 4) {
					this.targetFabIndex = this.virtualCurrentFabIndex + 1
				} else if (dx < 0 && this.virtualCurrentFabIndex != 0) {
					this.targetFabIndex = this.virtualCurrentFabIndex - 1
				}

				this.targetFabIndexOpacity = Math.max(1.0 * Math.abs(dx) / this.screenWidthPx, 0.2)
				this.virtualCurrentFabIndexOpacity = Math.max(1.2 - this.targetFabIndexOpacity, 0.2)
				
				// 优化H5/MP/APP-IOS连续滑屏
				if (this.targetFabIndexOpacity > 1) {
					// console.log("连续滑动触发",this.currentFabIndex,this.virtualCurrentFabIndex,this.targetFabIndex)
					this.isContinuity += 1
					// if (this.isContinuity > 0){
					// 	console.log('连续滑屏 x',this.isContinuity + 1)
					// }
					let real_dx = dx

					if (real_dx > 0 && this.virtualCurrentFabIndex != 4) {
						this.targetFabIndex += 1
						this.virtualCurrentFabIndex += 1
					} else if (real_dx < 0 && this.virtualCurrentFabIndex != 0) {
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
				this.targetFabIndexOpacity = 0.2
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

				this.$emit('fabClick', {
					'clickId': clickId
				})
				for (var i = 0; i < this.fabList.length; i++) {
					if (clickId == this.fabList[i].id) {
						this.currentFabIndex = this.hideCount + i
					}
				}

				this.virtualCurrentFabIndex = this.currentFabIndex
			},
			swiperChange: function(e) {
				let swiper_item_index = e.detail.current
				this.currentFabIndex = swiper_item_index
				this.$emit('indexChange', {
					'nowPage': this.currentFabIndex - this.hideCount
				})
				if (swiper_item_index < this.hideCount) {
					// console.log("显示负一屏")
				} else {
					// console.log("隐藏负一屏"）
				}
			}
		}
	}
</script>

<style scoped>
	.index {
		background-color: #0D0D0D;
		flex: 1;
		flex-direction: column;
	}

	.page {
		/* #ifndef APP-NVUE */
		display: flex;
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

	.fabItem {
		height: 50px;
		width: 50px;
		/* background-color: #007AFF; */
		align-items: center;
		justify-content: center;
	}

	.fabIcon {
		/* #ifndef APP-NVUE */
		transition-duration: 10ms;
		transition-property: opacity;
		/* #endif */
	}
</style>

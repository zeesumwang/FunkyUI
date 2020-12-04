<template>
	<view style="flex: 1;justify-content: center;align-items: center;background-color: #000000;">
		<swiper ref="swiper" @touchstart="touchstart" :style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}">
			<swiper-item style="background-color: #8F9CFF;" :style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}">
				
			</swiper-item>
			<swiper-item style="background-color: #fd9a48;" :style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}">
				
			</swiper-item>
		</swiper>
		<view ref="tag" style="position: fixed;bottom: 0;background-color: #000000;width: 60px;height: 60px;"></view>
	</view>
</template>

<script>
	import screenInfo from '../../common/helper.js'
	const Binding = uni.requireNativePlugin('bindingx');
	export default {
		data() {
			return {
				screenHeightPx: 0,
				screenWidthPx: 0,
				statusBarHeight: 0
			}
		},
		methods: {
			
		},
		created() {
			// 获取全局变量中的屏幕宽高
			this.screenHeightPx = screenInfo.screenHeightPx
			this.screenWidthPx = screenInfo.screenWidthPx
			this.statusBarHeight = screenInfo.system.statusBarHeight
		},
		methods: {
			touchstart(e) {
				var swiper = this.$refs.swiper 
				console.log(swiper)
			},
			transition(e) {
				console.log(e)
			}
		}
	}
</script>

<style>

</style>

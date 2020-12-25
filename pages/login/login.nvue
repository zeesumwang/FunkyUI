<template>
	<view>
		<view :style="{height: statusBarHeight + 'px'}"></view>
		<view :style="{width: screenWidthPx + 'px', height: screenHeightPx + 'px'}" style="background-color: #8F9CFF;">
			
		</view>
	</view>	
</template>

<script>
	import screenInfo from "@/funky-ui/common/helper.js"
	
	export default {
		data() {
			return {
				screenHeightPx: 0,
				screenWidthPx: 0,
				statusBarHeight: 0,
			}
		},
		onLoad() {
			this.screenHeightPx = screenInfo.screenHeightPx
			this.screenWidthPx = screenInfo.screenWidthPx
			this.statusBarHeight = screenInfo.statusBarHeight
		},
		methods: {
			
		}
	}
</script>

<style>

</style>

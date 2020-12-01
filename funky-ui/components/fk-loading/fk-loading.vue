<template>
	
	<!-- #ifdef APP-NVUE -->
	<loading-indicator v-if="show" :animating="true" :style="{color: refreshColor,width: width + 'px', height: height + 'px'}">
	<!-- #endif -->
	
	<!-- #ifndef APP-NVUE -->
	<image
		v-if="show" 
		class="scroll-rotate" 
		:style="{color: refreshColor,width: width + 'px', height: height + 'px'}"
		:src="refreshingIcon"
	>
	<!-- #endif -->
	
	<!-- #ifdef APP-NVUE -->
	</loading-indicator>
	<!-- #endif -->
	
</template>

<script>
	import icons from "../../common/iconBase64.js"
	
	export default {
		props: {
			show: {
				type: Boolean,
				default: false
			},
			refreshingIcon: {
				type: String,
				default: icons.refreshingIcon
			},
			refreshColor: {
				type: String,
				default: '#ffffff'
			},
			width: {
				type: Number,
				default: 30
			},
			height: {
				type: Number,
				default: 30
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style scoped>
/* #ifndef APP-NVUE */
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
</style>

<template>
	<fk-transition style="position: fixed;" :elevation="0" :blurEffect="'none'" :backgroundColor="backgroundColor" :opacity="0" :duration="200"
	 :mode-class="modeClass" :styles="transfromClass" :show="isNotied">
		<view :style="{'background-color': 'rgba(30,30,30,' + opacity + ')'}" style="border-radius: 50px;" elevation="5px" :blurEffect="blurEffect">
			<text style="font-size: 13px;margin-top: 8px;margin-bottom: 8px;margin-left: 16px;margin-right: 16px;" :style="{'color': color}">{{msg}}</text>
		</view>
	</fk-transition>
</template>

<script>
	import screenInfo from "@/common/helper.js"
	export default {
		props: {
			isNotied: {
				type: Boolean,
				default: false
			},
			msg: {
				type: String,
				default: "That's enough having FunkyUI!"
			},
			height: {
				type: Number,
				default: 220
			},
			backgroundColor: {
				type: String,
				default: "#1e1e1e"
			},
			color: {
				type: String,
				default: "#ffffff"
			},
			modeClass: {
				type: Array,
				default() {
					return ['fade','slide-top','zoom-in']
				}
			}
		},
		data() {
			return {
				transfromClass: {
					'flex': '1',
					/* #ifndef APP-NVUE */
					'display': 'flex',
					/* #endif */
					'justifyContent': 'center',
					'alignItems': 'center',
					'borderRadius': '50px',
					'top': '0px',
					'height': this.height + 'px',
					'width': screenInfo.screenWidthPx + 'px'
				},
				blurEffect: 'none',
				opacity: 0.8
			};
		},
		created() {
			if(screenInfo.system.brand == 'Apple'){
				this.blurEffect = 'dark'
				this.opacity = 0.618
			}
			else{
				this.opacity = 0.8
			}
		}
	}
</script>

<style>

</style>

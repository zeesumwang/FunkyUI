<template>
	<view class="container">
		
		<view ref="my" :style="{height: screenWidthPx + 'px',width: screenWidthPx + 'px'}" style="background-color: #fb73c8;" @touchstart="touchStart">
			
		</view>

	</view>
</template>

<style>
	.container {
		flex: 1;
		background-color: #0D0D0D;
		justify-content: center;
		align-items: center;
	}


</style>

<script>
	const Binding = uni.requireNativePlugin('bindingx');
	import screenInfo from "../../common/helper.js"
	
	export default {
		data() {
			return {
				x: 0,
				y: 0,
				isInAnimation: false,
				gesToken: 0,
				opacity: 1,
				screenHeightPx: 0,
				screenWidthPx: 0,
				statusBarHeight: 0,
			}
		},
		created() {
			// 获取全局变量中的屏幕宽高
			this.screenHeightPx = screenInfo.screenHeightPx
			this.screenWidthPx = screenInfo.screenWidthPx
			this.statusBarHeight = screenInfo.system.statusBarHeight
		},
		methods: {
			getEl: function(e) {
				return e.ref;
			},
			touchStart: function(e) {
				var self = this;
				if (this.isInAnimation === true) {
					console.log('we are in animation, drop pan gesture...');
					if (this.gesToken) {
						Binding.unbind({
							eventType: 'pan',
							token: self.gesToken
						});
						this.gesToken = undefined;
					}
					return;
				}
				var my = this.getEl(this.$refs.my);
				var translate_x_origin = 'x+0';
				var opacity_x_origin = '1-abs(x)/600';
				var gesTokenObj = Binding.bind({
					anchor: my,
					eventType: 'pan',
					props: [{
							element: my,
							property: 'transform.translateX',
							expression: translate_x_origin
						},
						{
							element: my,
							property: 'opacity',
							expression: opacity_x_origin
						}
					]
				}, function(e) {
					// console.log(e)
					if (e.state === 'end') {
						self.x += e.deltaX;
						self.y += e.deltaY;
						self.opacity = 1 - Math.abs(e.deltaX) / 600;
						// anim
						self.bindTiming();
					}
				});
				self.gesToken = gesTokenObj.token;
			},
			bindTiming: function() {
				this.isInAnimation = true;
				var my = this.getEl(this.$refs.my);
				var self = this;
				// should equal with timing duration
				var exit_origin = 't>1000';
				var changed_x;
				var final_x;
				var final_opacity;
				var translate_x_origin;
				var shouldDismiss = false;
				if (self.x >= -750 / 2 && self.x <= 750 / 2) {
					shouldDismiss = false;
					final_x = 0;
					changed_x = 0 - self.x;
					final_opacity = 1;
					translate_x_origin = `easeOutElastic(t,${self.x},${changed_x},1000)`
				} else if (self.x < -750 / 2) {
					shouldDismiss = true;
					final_x = -750;
					changed_x = -750 - self.x;
					final_opacity = 0;
					translate_x_origin = `easeOutExpo(t,${self.x},${changed_x},1000)`
				} else { // x > 750/2
					final_x = 750;
					shouldDismiss = true;
					changed_x = 750 - self.x;
					final_opacity = 0;
					translate_x_origin = `easeOutExpo(t,${self.x},${changed_x},1000)`
				}
				var changed_opacity = final_opacity - self.opacity;
				var opacity_origin = `linear(t,${self.opacity},${changed_opacity},1000)`;
				var result = Binding.bind({
					eventType: 'timing',
					exitExpression: exit_origin,
					props: [{
							element: my,
							property: 'transform.translateX',
							expression: translate_x_origin
						},
						{
							element: my,
							property: 'opacity',
							expression: opacity_origin
						}
					]
				}, function(e) {
					if (e.state === 'end' ||
						e.state === 'exit') {
						// reset x
						self.x = final_x;
						self.isInAnimation = false;
						if (shouldDismiss) {
							// remove card from hierarchy
						}
					}
				});
			}
		}
	}
</script>

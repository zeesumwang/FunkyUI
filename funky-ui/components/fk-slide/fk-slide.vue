<template>
	<view style="flex: 1;justify-content: center;align-items: center;background-color: #000000;">
		<view ref="sliderWraper">
			<swiper ref="swiper" id="swiper" @touchstart="touchstart" :style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}">
				<swiper-item ref="swiper-item" style="background-color: #8F9CFF;" :style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}">
					<list ref="list" :style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}">
						<cell>
							<view :style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}" style="background-color: #ffaa00;">
								<text>??</text>
							</view>
						</cell>
						<cell>
							<view :style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}" style="background-color: #aa0000;">
								<text>??</text>
							</view>
						</cell>
					</list>
				</swiper-item>
				<swiper-item style="background-color: #fd9a48;" :style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}">
					
				</swiper-item>
			</swiper>
		</view>
		
		
		<view ref="tag" style="position: fixed;bottom: 0;background-color: #ff0000;width: 60px;height: 60px;"></view>
	</view>
</template>

<script>
	
	const Binding = uni.requireNativePlugin('bindingx');
	
	import screenInfo from '../../common/helper.js'
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
		mounted() {
			setTimeout(()=>{
				this.bindTap()
			},1000)
		},
		methods: {
			bindTap() {
				var swiper = this.getEl(this.$refs.sliderWraper.children[0].children[0])
				var tag = this.getEl(this.$refs.tag)
				var list = this.getEl(this.$refs.list)
				// this.$refs.sliderWraper.children[0].children[0].id = 'slide'
				// this.$refs.sliderWraper.children[0].children[0].event = []
				console.log(this.$refs.sliderWraper.children[0].children[0])
				// console.log(this.$refs['swiper-item'].$el)
				
				Binding.bind({
					eventType: 'scroll',
					anchor: list,
					props: [{
							element: tag,
							property: 'opacity',
							expression: '1-(y/100)'
						}]
				}, function(e) {
					console.log(e)
				})
			},
			getEl: function(e) {
				if(typeof(e[0])=='object'){
					return e[0].ref
				}
				else{
					return e.ref
				}
			},
			touchstart(e) {
				var swiper = this.$refs.sliderWraper.children[0].children[0].ref
				var tag = this.$refs.tag
				// console.log(swiper)
				// console.log(tag.ref)
			},
			transition(e) {
				console.log(e)
			}
		}
	}
</script>

<style>

</style>

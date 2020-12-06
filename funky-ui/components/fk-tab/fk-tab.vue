<template>
	<view class="container">

		<scroller ref="scroller" @scroll="scroll" @horizontalpan="horizontalpan"
		 @swipe="swipe" :scrollable="false" :show-scrollbar="false" :scrollToBegin="false" :offset-accuracy="1"
		 :scroll-direction="'horizontal'" :pagingEnabled="false" :style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}"
		 style="flex-direction: row;">
		 
			<view @touchstart="checkPage(0)" ref='page-hide' id='page-hide' style="background-color: #b97b00;justify-content: center;" :style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}">
				<view :style="{height: statusBarHeight + 'px'}"></view>
				<list>
					<cell v-for="(item, index) in data" :key="index" style="justify-content: center;align-items: center;">
						<view style="height: 220px;border-radius: 10px;margin-bottom: 5px;justify-content: center;align-items: center;background-color: #1e1e1e;"
						 :style="{width: screenWidthPx -10 + 'px'}">
							<!-- <text style="color: #ebebeb">{{item}}</text> -->
						</view>
					</cell>
				</list>
			</view>
			
			<view v-for="(item,index) in fabList" :ref="'page-'+item.id" :id="'page-'+item.id" :key="index" @touchstart="checkPage(index + 1)" style="background-color: #000000;justify-content: center;" :style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}">
				<view :style="{height: statusBarHeight + 'px'}"></view>
				<list>
					<cell v-for="(item, index) in data" :key="index" style="justify-content: center;align-items: center;">
						<view style="height: 220px;border-radius: 10px;margin-bottom: 5px;justify-content: center;align-items: center;background-color: #1e1e1e;"
						 :style="{width: screenWidthPx -10 + 'px'}">
							<!-- <text style="color: #ebebeb">{{item}}</text> -->
						</view>
					</cell>
				</list>
			</view>
			
		</scroller>


		<view ref='fab' elevation="10px" style="height: 46px;position: fixed;justify-content: space-around;align-items: center;flex-direction: row;background-color: #1e1e1e;border-radius: 50px;"
		 :style="{left: screenWidthPx * (1-0.618) *0.5 + 'px',top: statusBarHeight * 1.5 + 'px',width: screenWidthPx * 0.618 + 'px'}">
			<image v-for="(item, index) in fabList" :key="item.id" :id="item.id" :ref="item.id" :src="item.url" style="width: 20px;height: 20px;"
			 :style="{borderRadius: item.id == 'user' ? '25px' : 0, opacity: index == 0 ? 1 : 0.2}">
			</image>
		</view>
	</view>
</template>

<style>
	.container {
		flex: 1;
		background-color: #0d0d0d;
		justify-content: center;
		align-items: center;
	}
</style>

<script>
	const BindingX = uni.requireNativePlugin('bindingx');
	const dom = uni.requireNativePlugin('dom') // 在APP端引入weex的dom组件
	import screenInfo from "../../common/helper.js"

	export default {
		data() {
			return {
				fabList: [{
						id: 'home',
						url: "/static/home.png"
					},
					{
						id: 'search',
						url: "/static/search.png"
					},
					{
						id: 'message',
						url: "/static/flash.png"
					},
					{
						id: 'user',
						url: "/static/logo.jpg"
					}
				],
				screenHeightPx: 0,
				screenWidthPx: 0,
				realScreenWidth: 750,
				statusBarHeight: 0,
				data: [],
				changedTouches: [],

				startContentOffsetX: 360,
				swiper: 0,
				contentOffsetX: 0,
			}
		},
		created() {
			// 获取全局变量中的屏幕宽高
			this.screenHeightPx = screenInfo.screenHeightPx
			this.screenWidthPx = screenInfo.screenWidthPx
			this.statusBarHeight = screenInfo.system.statusBarHeight

			if (screenInfo.system.platform !== 'ios') {
				this.realScreenWidth = this.screenWidthPx,
					this.contentOffsetX = this.screenWidthPx
			}
			for (var i = 0; i < 20; i++) {
				this.data.push(i)
			}
		},
		mounted() {
			setTimeout(() => {
				this.bindTap()
			}, 100)
			var indexElement = this.$refs['page-home'][0]
			dom.scrollToElement(indexElement, {
				offset: 0,
				animated: true
			})
			this.swiper = this.getEl(this.$refs['scroller'])
		},
		methods: {
			bindTap: function() {
				var fab = this.getEl(this.$refs['fab'])
				var fabHeight = this.statusBarHeight * 0.5
				var maxTranslateY = fabHeight * 5

				var props = [{
					element: fab,
					property: 'transform.translateY',
					expression: `${maxTranslateY} * (x < ${this.realScreenWidth} ? (1 - x / ${this.realScreenWidth}) : 0)`
				}]

				for (var i = 0; i < this.fabList.length; i++) {
					let fabItem = this.getEl(this.$refs[this.fabList[i].id])
					let subExpression = (1 + i) * this.realScreenWidth
					let expression =
						`x == ${subExpression} ? 1 : (x < ${subExpression} ? max((x - ${i*this.realScreenWidth}) / ${this.realScreenWidth}, 0.2) : max(1 - ((x - ${subExpression}) / ${this.realScreenWidth}), 0.2))`
					let prop = {
						element: fabItem,
						property: 'opacity',
						expression: expression
					}
					props.push(prop)
				}

				BindingX.bind({
					eventType: 'scroll',
					anchor: this.swiper,
					props: props
				}, ((e) => {
					// console.log(e.x)
				}))

			},
			getEl: function(e) {
				if (typeof(e[0]) == 'object') {
					return e[0].ref
				} else {
					return e.ref
				}
			},
			horizontalpan: function(e) {
				if (e.state == 'start') {
					this.touchstart(e)
					// BindingX.prepare({
					// 	eventType: 'pan',
					// 	anchor: this.swiper
					// })

					BindingX.bind({
						eventType: 'pan',
						anchor: this.swiper,
						props: [{
							element: this.swiper,
							property: 'scroll.contentOffsetX',
							expression: `${this.contentOffsetX} - x`
						}]
					}, ((e) => {
						
					}))
				}
				else if(e.state == 'end') {
					this.touchend(e)
				}
			},
			scroll: function(e) {
				this.contentOffsetX = Math.ceil(Math.abs(e.contentOffset.x))
			},
			checkPage: function(index) {
				this.startContentOffsetX = Math.abs(index * this.realScreenWidth)
				// console.log(index,this.startContentOffsetX)
			},
			touchstart: function(e) {
				BindingX.unbindAll()
				
				var identifier = e.changedTouches[0].identifier
				var screenX = e.changedTouches[0].screenX
				var screenY = e.changedTouches[0].screenY
				var isRecord = false
				for (var i = 0; i < this.changedTouches.length; i++) {
					if (identifier == this.changedTouches[i].identifier) {
						this.changedTouches[i] = {
							'identifier': identifier,
							'timestamp': e.timestamp,
							'screenX': screenX,
							'screenY': screenY
						}
						isRecord = true
						break
					}
				}
				if (!isRecord) {
					this.changedTouches.push({
						'identifier': identifier,
						'timestamp': e.timestamp,
						'screenX': screenX,
						'screenY': screenY
					})
				}
				
				// console.log(e)
			},
			touchend: function(e) {
				var identifier = e.changedTouches[0].identifier
				var screenX = e.changedTouches[0].screenX
				for (var i = 0; i < this.changedTouches.length; i++) {
					if (this.changedTouches[i].identifier == identifier) {
						var duration = e.timestamp - this.changedTouches[i].timestamp
						var deltaX = -(screenX - this.changedTouches[i].screenX)
						var speed = Math.abs(deltaX) / duration

						if (speed > 0.68) {
							if (deltaX > 10) {
								let changeBy = this.startContentOffsetX + this.realScreenWidth - this.contentOffsetX
								let anmDuration = Math.abs(changeBy) / speed
								if(speed > 2) {
									anmDuration = 300
								}
								else if(speed > 1 && speed < 2) {
									anmDuration = 400
								}
								else {
									anmDuration = 500
								}
								console.log('加速下一屏', anmDuration, speed)
								this.transition(anmDuration, this.swiper, changeBy, ((e) => {
									
								}))
							} else if (deltaX < -10) {
								let changeBy = -(this.contentOffsetX - (this.startContentOffsetX - this.realScreenWidth))
								let anmDuration = Math.abs(changeBy) / speed
								if(speed > 2) {
									anmDuration = 300
								}
								else if(speed > 1 && speed < 2) {
									anmDuration = 400
								}
								else {
									anmDuration = 500
								}
								console.log('加速上一屏', anmDuration, speed)
								this.transition(anmDuration, this.swiper, changeBy, ((e) => {
									
								}))
							}
						} else {
							var deltaX = this.contentOffsetX - this.startContentOffsetX

							var contentWidth = this.realScreenWidth * 4
							if (this.contentOffsetX >= 0 && this.contentOffsetX <= contentWidth) {
								if (Math.abs(deltaX) > this.realScreenWidth * 0.5) {
									if (deltaX > 0) {
										// console.log('下一屏')
										let changeBy = this.startContentOffsetX + this.realScreenWidth - this.contentOffsetX
										let anmDuration = Math.abs(changeBy) / speed
										if(speed > 2) {
											anmDuration = 300
										}
										else if(speed > 1 && speed < 2) {
											anmDuration = 400
										}
										else {
											anmDuration = 500
										}
										this.transition(anmDuration, this.swiper, changeBy, ((e) => {
										
										}))
									} else {
										// console.log('上一屏')
										let changeBy = -(this.contentOffsetX - (this.startContentOffsetX - this.realScreenWidth))
										let anmDuration = Math.abs(changeBy) / speed
										if(speed > 2) {
											anmDuration = 300
										}
										else if(speed > 1 && speed < 2) {
											anmDuration = 400
										}
										else {
											anmDuration = 500
										}
										this.transition(anmDuration, this.swiper, changeBy, ((e) => {
											
										}))
									}
								} else {
									// console.log('回弹')
									let changeBy = -deltaX
									let anmDuration = Math.abs(changeBy) / speed
									this.transition(500, this.swiper, changeBy, ((e) => {}))
								}
							}
						}
						break
					}
				}

			},
			transition: function(duration, el, changeBy, callback) {
				let easingFunction = 'easeOutQuart'
				var expression = `${easingFunction}(t,${this.contentOffsetX},${changeBy},${duration})`
				let token = BindingX.bind({
					eventType: 'timing',
					exitExpression: {
						origin: `t>${duration}`
					},
					props: [{
						element: el,
						property: 'scroll.contentOffsetX',
						expression: expression
					}]
				}, callback)
				return token
			},
			swipe: function(e) {
				// console.log(e)
			}
		}
	}
</script>

<template>
	<view class="container">

		<scroller ref="scroller" @scroll="scroll" @horizontalpan="horizontalpan"
		 :scrollable="false" :show-scrollbar="false" :scrollToBegin="false" :offset-accuracy="1"
		 :scroll-direction="'horizontal'" :pagingEnabled="false" :style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}"
		 style="flex-direction: row;">
		 
			<view @touchstart="checkPage(0)" ref='page-hide' id='page-hide' style="background-color: #b97b00;justify-content: center;" :style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}">
				<view :style="{height: statusBarHeight + 'px'}"></view>
				<fk-list :width="screenWidthPx" :height="screenHeightPx - statusBarHeight" :isRefresh="isRefresh" @refreshing="refreshing">
					<fk-cell v-for="(item, index) in data" :key="index" style="justify-content: center;align-items: center;">
						<view style="height: 220px;border-radius: 10px;margin-bottom: 5px;justify-content: center;align-items: center;background-color: #1e1e1e;"
						 :style="{width: screenWidthPx -10 + 'px'}">
							<text style="color: #ebebeb">{{item}}</text>
						</view>
					</fk-cell>
				</fk-list>
			</view>
			
			<view v-for="(item,index) in fabList" :ref="'page-'+item.id" :id="'page-'+item.id" :key="index" @touchstart="checkPage(index + 1)" style="background-color: #0d0d0d;justify-content: center;" :style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}">
				<view :style="{height: statusBarHeight + 'px'}"></view>
				<fk-list :width="screenWidthPx" :height="screenHeightPx - statusBarHeight" :isRefresh="isRefresh" @refreshing="refreshing">
					<fk-cell v-for="(item, index) in data" :key="index" style="justify-content: center;align-items: center;">
						<view style="height: 220px;border-radius: 10px;margin-bottom: 5px;justify-content: center;align-items: center;background-color: #191919;"
						 :style="{width: screenWidthPx -10 + 'px'}">
							<text style="color: #ebebeb">{{item}}</text>
						</view>
					</fk-cell>
				</fk-list>
			</view>
			
			<view ref='fab' elevation="10px" style="height: 46px;position: fixed;justify-content: space-around;align-items: center;flex-direction: row;background-color: #1e1e1e;border-radius: 50px;"
			 :style="{left: screenWidthPx * (1-0.618) *0.5 + 'px',bottom: statusBarHeight * 0.5 + 'px',width: screenWidthPx * 0.618 + 'px'}">
				<image v-for="(item, index) in fabList" :key="item.id" :id="item.id" :ref="item.id" :src="item.url" style="width: 20px;height: 20px;"
				 :style="{borderRadius: item.id == 'user' ? '25px' : 0, opacity: index == 0 ? 1 : 0.2}">
				</image>
			</view>
		</scroller>


		
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
	
	import BindingX from "weex-bindingx"
	console.log(BindingX)
	// #ifdef APP-NVUE
	// const BindingX = uni.requireNativePlugin('bindingx');
	const dom = uni.requireNativePlugin('dom') // 在APP端引入weex的dom组件
	// #endif
	
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
				panToken: 0,
				scrollToken: 0,
				anmToken: 0,
				isRefresh: false
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
			else{
				this.realScreenWidth = 750,
				this.contentOffsetX = 750
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
			
			// #ifdef APP-NVUE
			dom.scrollToElement(indexElement, {
				offset: 0,
				animated: true
			})
			// #endif
			
			this.swiper = this.getEl(this.$refs['scroller'])
		},
		methods: {
			refreshing: function() {
				this.isRefresh = true
				setTimeout(() => {
					this.isRefresh = false
					// this.showNotied('刷新成功', 1500)
				}, 1200)
			},
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

				this.scrollToken = BindingX.bind({
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
			getDuration: function(speed) {
				let anmDuration = 0
				if(speed > 3) {
					anmDuration = 200
				}
				else if(speed > 2) {
					anmDuration = 300
				}
				else if(speed > 1 && speed < 2) {
					anmDuration = 400
				}
				else {
					anmDuration = 500
				}
				return anmDuration
			},
			scroll: function(e) {
				if(screenInfo.system.platform == 'ios') {
					this.contentOffsetX = Math.ceil(Math.abs(e.contentOffset.x)) * (750 / this.screenWidthPx)
				}
				else {
					this.contentOffsetX = Math.ceil(Math.abs(e.contentOffset.x))
				}
				// console.log(this.contentOffsetX)
			},
			checkPage: function(index) {
				this.startContentOffsetX = Math.abs(index * this.realScreenWidth)
				// console.log(index,this.startContentOffsetX)
			},
			horizontalpan: function(e) {
				if (e.state == 'start') {
					this.touchstart(e)
					// console.log(this.contentOffsetX)
					if(screenInfo.system.platform == 'ios') {
						var expression = `${this.contentOffsetX} - x * (750 / 175)`
					}
					else{
						var expression = `${this.contentOffsetX} - x`
					}
					this.panToken = BindingX.bind({
						eventType: 'pan',
						anchor: this.swiper,
						props: [{
							element: this.swiper,
							property: 'scroll.contentOffsetX',
							expression: expression
						}]
					}, ((e) => {
						// console.log(e)
					}))
				}
				else if(e.state == 'end') {
					this.touchend(e)
				}
			},			
			touchstart: function(e) {
				if(screenInfo.system.platform == 'ios'){
					BindingX.unbindAll()
					this.bindTap()
				}
				else{
					BindingX.unbindAll()
				}
				
				BindingX.prepare({
					eventType: 'pan',
					anchor: this.swiper
				})
				
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
						console.log(speed)
						if (speed > 0.5) {
							if (deltaX > 10) {
								let changeBy = this.startContentOffsetX + this.realScreenWidth - this.contentOffsetX
								let anmDuration = this.getDuration(speed)
								
								// console.log('加速下一屏', anmDuration, speed)
								this.transition(anmDuration, this.swiper, changeBy, ((e) => {
									
								}))
							} else if (deltaX < -10) {
								let changeBy = -(this.contentOffsetX - (this.startContentOffsetX - this.realScreenWidth))
								let anmDuration = this.getDuration(speed)
								// console.log('加速上一屏', anmDuration, speed)
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
										let anmDuration = this.getDuration(speed)
										this.transition(anmDuration, this.swiper, changeBy, ((e) => {
										
										}))
									} else {
										// console.log('上一屏')
										let changeBy = -(this.contentOffsetX - (this.startContentOffsetX - this.realScreenWidth))
										let anmDuration = this.getDuration(speed)
										this.transition(anmDuration, this.swiper, changeBy, ((e) => {
											
										}))
									}
								} else {
									// console.log('回弹')
									let changeBy = -deltaX
									let anmDuration = this.getDuration(speed)
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
				this.anmToken = BindingX.bind({
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
				return this.anmToken
			},
			swipe: function(e) {
				// console.log(e)
			}
		}
	}
</script>

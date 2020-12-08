<template>
	<view class="container">

		<scroller ref="scroller" @scroll="scroll" @horizontalpan="horizontalpan" @touchend="touchend" @touchstart="touchstart" :scrollable="false" :show-scrollbar="false"
		 :scrollToBegin="false" :offset-accuracy="0.9" :scroll-direction="'horizontal'" :pagingEnabled="false" :style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}"
		 style="flex-direction: row;">

			<view @touchstart="checkPage(0)" ref='page-hide' id='page-hide' style="background-color: #76c6e6;justify-content: center;"
			 :style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}">
				<view :style="{height: statusBarHeight + 'px'}"></view>

				<fk-list :width="screenWidthPx" :height="screenHeightPx - statusBarHeight" :hasRefresh="false" :isRefresh="isRefresh"
				 @refreshing="refreshing">
					<!-- <list :style="{width: screenWidthPx + 'px', height: screenHeightPx - statusBarHeight+ 'px'}" > -->
					<fk-cell v-for="(item, index) in data" :key="index" style="justify-content: center;align-items: center;">
						<view style="height: 220px;border-radius: 10px;margin-bottom: 5px;justify-content: center;align-items: center;background-color: #1e1e1e;"
						 :style="{width: screenWidthPx -10 + 'px'}">
							<text style="color: #ebebeb">{{item}}</text>
						</view>
					</fk-cell>
					<!-- </list> -->
				</fk-list>
			</view>

			<view v-for="(item,index) in fabList" :ref="'page-'+item.id" :id="'page-'+item.id" :key="index" @touchstart="checkPage(index + 1)"
			 style="background-color: #0d0d0d;justify-content: center;" :style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}">
				<view :style="{height: statusBarHeight + 'px'}"></view>
				<fk-list :width="screenWidthPx" :height="screenHeightPx - statusBarHeight" :hasRefresh="true" :isRefresh="isRefresh"
				 @refreshing="refreshing">
					<!-- <list :style="{width: screenWidthPx + 'px', height: screenHeightPx - statusBarHeight+ 'px'}"> -->
					<fk-cell v-for="(item, idx) in data" :key="idx" style="justify-content: center;align-items: center;">
						<view style="border-radius: 10px;margin-bottom: 5px;justify-content: center;align-items: center;background-color: #eb6191;"
						 :style="{width: screenWidthPx -10 + 'px',height: (index + 1) * 88 + 'px'}">
							<text style="color: #ebebeb">{{item}}</text>
						</view>
					</fk-cell>
					<!-- </list> -->
				</fk-list>
			</view>

			<view ref='fab' elevation="10px" style="height: 46px;position: fixed;justify-content: space-around;align-items: center;flex-direction: row;background-color: #1e1e1e;border-radius: 50px;"
			 :style="{left: screenWidthPx * (1-0.618) *0.5 + 'px',bottom: statusBarHeight * 0.5 + 'px',width: screenWidthPx * 0.618 + 'px'}">
				<image v-for="(item, index) in fabList" :key="item.id" :id="item.id" :ref="item.id" :src="item.url" style="width: 20px;height: 20px;"
				 :style="{borderRadius: item.id == 'user' ? '25px' : 0, opacity: index == 0 ? 1 : 0.2}">
				</image>
				<view style="width: 5px;height: 5px;border-radius: 2.5px;background-color: #FFFFFF;position: absolute;bottom: 5px;"
				 :style="{left: platform == 'ios' ? (headFabX - 2.5 + 'px') : (headFabX - 2.5 + 'px')}" ref="indicator"></view>
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
	// console.log(BindingX)
	// #ifdef APP-NVUE
	// const BindingX = uni.requireNativePlugin('bindingx');
	const dom = uni.requireNativePlugin('dom') // 在APP端引入weex的dom组件
	// #endif

	import screenInfo from "../../common/helper.js"

	export default {
		data() {
			return {
				platform: '',
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
				isRefresh: false,
				headFabX: 0,
				endFabX: 0,
			}
		},
		created() {
			this.platform = screenInfo.system.platform
			// 获取全局变量中的屏幕宽高
			this.screenHeightPx = screenInfo.screenHeightPx
			this.screenWidthPx = screenInfo.screenWidthPx
			this.statusBarHeight = screenInfo.system.statusBarHeight

			if (screenInfo.system.platform !== 'ios') {
				this.realScreenWidth = this.screenWidthPx,
					this.contentOffsetX = this.screenWidthPx
			} else {
				this.realScreenWidth = 750,
					this.contentOffsetX = 750
			}
			for (var i = 0; i < 20; i++) {
				this.data.push(i)
			}
		},
		mounted() {
			var indexElement = this.$refs['page-home'][0]

			// #ifdef APP-NVUE
			dom.scrollToElement(indexElement, {
				offset: 0,
				animated: true
			})
			// #endif

			this.swiper = this.getEl(this.$refs['scroller'])

			var endFabIndex = this.fabList.length - 1
			
			setTimeout(() => {
				dom.getComponentRect(this.getEl(this.$refs.fab),(res)=>{
					var fabLeft = res.size.left
					dom.getComponentRect(this.getEl(this.$refs[this.fabList[0].id]), ((res) => {
						if(this.platform == 'ios'){
							this.headFabX = res.size.left + res.size.width * 0.5 - fabLeft
						}
						else{
							this.headFabX = res.size.left + res.size.width * 0.5 - fabLeft
						}
						dom.getComponentRect(this.getEl(this.$refs[this.fabList[endFabIndex].id]), ((res) => {
							if(this.platform == 'ios'){
								this.endFabX = res.size.left + res.size.width * 0.5 - fabLeft
							}
							else{
								this.endFabX = res.size.left + res.size.width * 0.5 - fabLeft
							}
							this.bindTap()
						}))
					}))
				})				
			}, 100)
			


		},
		methods: {
			refreshing: function() {
				this.isRefresh = true
				setTimeout(() => {
					this.isRefresh = false
				}, 2000)
			},
			bindTap: function() {
				var indicator = this.getEl(this.$refs['indicator'])
				var fab = this.getEl(this.$refs['fab'])
				var fabHeight = this.statusBarHeight * 0.5
				var fabMaxTranslateY = fabHeight * 4
				if(this.platform == 'ios') {
					var indicatorMaxTranslateX = this.endFabX - this.headFabX
				}
				else {
					var indicatorMaxTranslateX = this.endFabX - this.headFabX
				}
				var indicatorExpression = `x > ${this.realScreenWidth} ? (x - ${this.realScreenWidth}) * ${indicatorMaxTranslateX / 3} / ${this.realScreenWidth} : 0`
					// `x > ${this.realScreenWidth} ? max((x * ${indicatorMaxTranslateX - 10} / ${this.realScreenWidth * (this.fabList.length + 1)} - ${indicatorMaxTranslateX / 4}), 0) : 0`
				var props = [{
						element: fab,
						property: 'transform.translateY',
						expression: `${fabMaxTranslateY} * (x < ${this.realScreenWidth} ? (1 - x / ${this.realScreenWidth}) : 0)`
					},
					{
						element: indicator,
						property: 'transform.translateX',
						expression: indicatorExpression
					}
				]

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
				if (speed > 3) {
					anmDuration = 300
				} else if (speed > 2) {
					anmDuration = 300
				} else if (speed > 1 && speed < 2) {
					anmDuration = 400
				} else {
					anmDuration = 500
				}
				return anmDuration
			},
			scroll: function(e) {
				if (screenInfo.system.platform == 'ios') {
					this.contentOffsetX = Math.ceil(Math.abs(e.contentOffset.x)) * (750 / this.screenWidthPx)
				} else {
					this.contentOffsetX = Math.ceil(Math.abs(e.contentOffset.x))
				}
				// console.log(this.contentOffsetX)
			},
			checkPage: function(index) {
				let touchPageContentOffset = Math.abs(index * this.realScreenWidth)
				let scrollDistance = Math.abs(touchPageContentOffset - this.contentOffsetX)
				if (scrollDistance > this.realScreenWidth * 0.5) {
					this.startContentOffsetX = Math.abs((index + 1) * this.realScreenWidth)
				} else {
					this.startContentOffsetX = touchPageContentOffset
				}
				// console.log(index, this.startContentOffsetX, this.contentOffsetX, scrollDistance)
			},
			horizontalpan: function(e) {
				// console.log(e)
				// e.stopPropagation()
				if (e.state == 'start') {
					// this.touchstart(e)
					// binding pan
					if (screenInfo.system.platform == 'ios') {
						var expression = `${this.contentOffsetX} - x * (750 / 175)`
					} else {
						var expression = `${this.contentOffsetX} - x`
					}
					
					this.panToken = BindingX.bind({
						eventType: 'pan',
						anchor: this.swiper,
						props: [{
								element: this.swiper,
								property: 'scroll.contentOffsetX',
								expression: expression
							},
					
						]
					}, ((e) => {
						// console.log(e)
					}))
					// console.log(this.contentOffsetX)
				} else if (e.state == 'end') {
					// this.touchend(e)
				}
			},
			touchstart: function(e) {
				// 取消之前全部绑定，实现在timing过程中能够点击停止
				if (screenInfo.system.platform == 'ios') {
					BindingX.unbindAll()
					// 再次绑定scroller的scroll事件
					this.bindTap()
				} else {
					BindingX.unbindAll()
					// 安卓端的unbindAll不会取消scroll事件的绑定，无需再次绑定
				}
				// 再次准备绑定pan事件
				BindingX.prepare({
					eventType: 'pan',
					anchor: this.swiper
				})
				// 记录触摸开始位置和触摸指（支持多点触摸）
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
				var screenY = e.changedTouches[0].screenY
				for (var i = 0; i < this.changedTouches.length; i++) {
					if (this.changedTouches[i].identifier == identifier) {
						var duration = e.timestamp - this.changedTouches[i].timestamp
						var deltaX = -(screenX - this.changedTouches[i].screenX)
						var deltaY = -(screenY - this.changedTouches[i].screenY)
						
						
						var speedX = Math.abs(deltaX) / duration
						var speedY = Math.abs(deltaY) / duration
						var speed = speedX

						this.changePage(speed, deltaX, deltaY)
						break
					}
				}

			},
			changePage: function(speed, deltaX,deltaY) {
				// console.log(speed)
				
				if (speed > 0.5) {
					if(this.contentOffsetX % this.realScreenWidth == 0){
						if(Math.abs(deltaY)/Math.abs(deltaX) > 0.44)  {
							console.log("手势过滤",Math.abs(deltaY)/Math.abs(deltaX))
							return
						}
						else{
							console.log(this.contentOffsetX % this.realScreenWidth,Math.abs(deltaY),Math.abs(deltaY)/Math.abs(deltaX))
						}
					}
					
					
					if (deltaX > 50) {
						let changeBy = this.startContentOffsetX + this.realScreenWidth - this.contentOffsetX
						let anmDuration = this.getDuration(speed)

						// console.log('加速下一屏', anmDuration, speed)
						this.transition(anmDuration, this.swiper, changeBy, ((e) => {

						}))
					} else if (deltaX < -50) {
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
							this.transition(300, this.swiper, changeBy, ((e) => {}))
						}
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
				this.anmToken = token
				return this.anmToken
			},
			swipe: function(e) {
				// console.log(e)
			}
		}
	}
</script>

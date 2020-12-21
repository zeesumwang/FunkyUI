
<template>
	<view class="container">
		<label>	
			<fk-transition
				ref="fab"
				:show="true"
				:elevation="fabElevation" 
				:blurEffect="fabBlurEffect"
				:styles="fabStyles"
				:backgroundColor="fabBackgroundColor"
				:opacity="fabOpacity"
			>
				
				<slot name="fab"></slot>
				<view
					style="position: absolute;bottom: 0px;float: left;"
					:style="{left: (headFabX - (12 + 3) + 'px')}" 
					ref="indicator"
				>
					<slot name="indicator"></slot>
				</view>
			</fk-transition>
		</label>
		
		<label>	
		<scroller ref="scroller" @scroll="scroll" @horizontalpan="horizontalpan" :scrollable="false" :show-scrollbar="false"
		 :scrollToBegin="false" :offset-accuracy="0.9" :scroll-direction="'horizontal'" :pagingEnabled="false" :style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}"
		 style="flex-direction: row;">
			
			<view style="flex-direction: row;background-color: #0d0c0d;">
				<view v-if="hasHidePage" @touchstart="checkPage(0)" ref='page-hide' id='page-hide'>
					<slot name="hidePage"></slot>
				</view>
				
				<view v-for="(item,index) in pageList" :ref="'page-'+item.id" :id="'page-'+item.id" :key="index" @touchstart="checkPage(index + (hasHidePage ? 1 : 0))"
				 :style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}">
					<slot :name="'mainPage'+index"></slot>
				</view>
			</view>

		</scroller>
		</label>
	</view>
</template>

<style>
	.container {
		flex: 1;
		justify-content: center;
		align-items: center;
	}
</style>

<script>
	// import BindingX from "weex-bindingx" //bindingX兼容H5端，可是uniapp.require无法引入
	// console.log(BindingX)
	// #ifdef APP-NVUE
	const BindingX = uni.requireNativePlugin('bindingx');
	const dom = uni.requireNativePlugin('dom') // 在APP端引入weex的dom组件
	// #endif

	import screenInfo from "../../common/helper.js"

	export default {
		name: 'fkTab',
		props: {
			pageList: {
				type: Array,
				default () {
					return []
				}
			},
			defaultPageId: {
				type: String,
				default: ""
			},
			hasHidePage: {
				type: Boolean,
				default: false
			},
			fabStyles: {
				type: Object,
				default () {
					return {
						'height': '50px',
						'justifyContent': 'space-around',
						'alignItems': 'center',
						'flexDirection': 'row',
						'width': '350px'
					}
				}
			},
			fabBackgroundColor: {
				type: String,
				default: '#ffffff'
			},
			fabOpacity: {
				type: Number,
				default: 0.98
			},
			fabElevation: {
				type: Number,
				default: 10
			},
			fabBlurEffect: {
				type: String,
				default: 'none'
			},
			bindProps: {
				type: Object,
				default () {
					return []
				}
			},
			bindFabProperty: {
				type: String,
				default: ''
			},
			bindFabExpression: {
				type: String,
				default: ''
			},			
		},
		data() {
			return {
				platform: '',
				screenHeightPx: 0,
				screenWidthPx: 0,
				realScreenWidth: 750,
				statusBarHeight: 0,
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
				recordCount: 0,
				currentPage: 0
			}
		},
		created() {			
			this.platform = screenInfo.system.platform
			// 获取全局变量中的屏幕宽高
			this.screenHeightPx = screenInfo.screenHeightPx
			this.screenWidthPx = screenInfo.screenWidthPx
			this.statusBarHeight = screenInfo.system.statusBarHeight

			if (screenInfo.system.platform !== 'ios') {
				this.realScreenWidth = this.screenWidthPx
				if(this.hasHidePage){
					this.contentOffsetX = this.screenWidthPx
				}
				else{
					this.contentOffsetX = 0
				}
			} else {
				this.realScreenWidth = 750
				if(this.hasHidePage){
					this.contentOffsetX = 750
				}
				else{
					this.contentOffsetX = 0
				}
			}
			
		},
		mounted() {
			setTimeout(() => {
				if(this.defaultPageId !== ""){
					var indexElement = this.getEl(this.$refs['page-' + this.defaultPageId])
					
					// #ifdef APP-NVUE
					dom.scrollToElement(indexElement, {
						offset: 0,
						animated: true
					})
					// #endif
				}				
				
				this.swiper = this.getEl(this.$refs['scroller'])
				// dom.getComponentRect(this.swiper,(res)=>{console.log(res)})
				var endFabIndex = this.pageList.length - 1
				
				dom.getComponentRect(this.getEl(this.$refs.fab.$refs.ani), (res) => {
					var fabLeft = res.size.left
					dom.getComponentRect(this.getEl(this.$refs.fab.$refs.ani.children[0]), ((res) => {
						this.headFabX = res.size.left + res.size.width * 0.5 - fabLeft
						dom.getComponentRect(this.getEl(this.$refs.fab.$refs.ani.children[this.pageList.length-1]), ((res) => {
							this.endFabX = res.size.left + res.size.width * 0.5 - fabLeft
							this.bindTap()
						}))
					}))
				})
			}, 100)
			
		},
		methods: {
			bindTap: function() {
				var props = []
				
				// 绑定传入的自定义表达式
				for (var i = 0;i < this.bindProps.length; i++) {
					props.push(this.bindProps[i])
				}
				
				// 绑定fab整体
				if(this.bindFabExpression !== '' && this.bindFabProperty !== ''){
					var fab = this.getEl(this.$refs.fab.$refs.ani)
					var bindFabProp = {
							element: fab,
							property: this.bindFabProperty,
							expression: this.bindFabExpression
						}
					props.push(bindFabProp)
				}
				
				// 根据是否有负一屏设置x的偏移
				var variable = `x`
				if(!this.hasHidePage) {
					variable = `x + ${this.realScreenWidth}`
				}
				
				// 绑定提示器
				var indicator = this.getEl(this.$refs['indicator'])
				var indicatorMaxTranslateX = this.endFabX - this.headFabX
				var indicatorExpression =
					`${variable} > ${this.realScreenWidth} ? (${variable} - ${this.realScreenWidth}) * ${indicatorMaxTranslateX / (this.pageList.length - 1)} / ${this.realScreenWidth} : 0`

				props.push({
						element: indicator,
						property: 'transform.translateX',
						expression: indicatorExpression
					})
				
				// 绑定每一项的透明度
				for (var i = 0; i < this.pageList.length; i++) {
					let fabItem = this.getEl(this.$refs.fab.$refs.ani.children[i])
					let subExpression = (1 + i) * this.realScreenWidth
					let expression =
						`${variable} == ${subExpression} ? 1 : (${variable} < ${subExpression} ? max((${variable} - ${i*this.realScreenWidth}) / ${this.realScreenWidth}, 0.2) : max(1 - ((${variable} - ${subExpression}) / ${this.realScreenWidth}), 0.2))`
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
			bindPan: function() {
				// binding pan
				if (screenInfo.system.platform == 'ios') {
					var maxDeltaX = this.screenWidthPx
					var expression = `${this.contentOffsetX} - x * (750 / ${maxDeltaX})`
				} else {
					var expression = `${this.contentOffsetX} - x`
				}
				// 准备绑定pan事件
				BindingX.prepare({
					eventType: 'pan',
					anchor: this.swiper
				})
				this.panToken = BindingX.bind({
						eventType: 'pan',
						anchor: this.swiper,
						props: [{
								element: this.swiper,
								property: 'scroll.contentOffsetX',
								expression: expression
							}
						]
					},
					((e)=>{
						if(e.state !== 'start'){
							BindingX.unbind({token: this.panToken.token, eventType: 'pan'})
						}						
					})
				)
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
					anmDuration = 200
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
				if (scrollDistance > 0) {
					if (this.contentOffsetX % this.realScreenWidth > this.realScreenWidth * 0.5) {
						this.startContentOffsetX = (Math.floor(this.contentOffsetX / this.realScreenWidth) + 1) * this.realScreenWidth
					} else {
						this.startContentOffsetX = Math.floor(this.contentOffsetX / this.realScreenWidth) * this.realScreenWidth
					}
				} else {
					this.startContentOffsetX = touchPageContentOffset
				}
				// console.log(this.startContentOffsetX)
			},
			horizontalpan: function(e) {
				this.$emit('horizontalpan',e)
				// console.log(e)
				// e.stopPropagation() // 阻止冒泡无效
				if(e.state == 'start') {
					this.touchstart(e)
				}
				if(e.state == 'end') {
					this.touchend(e)
				}
				if(e.state == 'move') {
					this.panmove(e)
				}
			},
			panmove: function(e) {
				if (this.recordCount > 0) {
					return
				}
				this.recordCount += 1
				var vectorX = e.changedTouches[0].screenX - this.changedTouches[0].screenX
				var vectorY = e.changedTouches[0].screenY - this.changedTouches[0].screenY
				var deltaX = Math.abs(vectorX)
				var deltaY = Math.abs(vectorY)

				if (deltaX > deltaY) {
					if(this.contentOffsetX < 2 && vectorX > 0) {
						this.$emit('bindparent', {e: e,touch: this.changedTouches})
						return				
					}
					else if((this.contentOffsetX == this.realScreenWidth * (this.pageList.length - 1)) && this.hasHidePage == false && vectorX < 0) {
						this.$emit('bindparent', {e: e,touch: this.changedTouches})
						return
					}
					else{
						this.bindPan()
					}					
				}
			},
			touchstart: function(e) {
				// 取消之前全部绑定，实现在timing过程中能够点击停止
				if (screenInfo.system.platform == 'ios') {
					BindingX.unbind({token:this.anmToken.token,eventType:'timing'})
					BindingX.unbind({token:this.panToken.token,eventType:'pan'})
					// BindingX.unbindAll()
					// 再次绑定scroller的scroll事件
					// this.bindTap()
				} else {
					BindingX.unbind({token:this.anmToken.token,eventType:'timing'})
					BindingX.unbind({token:this.panToken.token,eventType:'pan'})
					// BindingX.unbind()
					// BindingX.unbindAll()
					// 安卓端的unbindAll不会取消scroll事件的绑定，无需再次绑定
				}

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
			},
			touchend: function(e) {
				this.recordCount = 0
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
				this.changedTouches = []
			},
			changePage: function(speed, deltaX, deltaY) {
				// console.log(speed)
				if (speed > 0.5 && (this.contentOffsetX % this.realScreenWidth) !== 0) {

					if (deltaX > 0) {
						let changeBy = this.startContentOffsetX + this.realScreenWidth - this.contentOffsetX
						let anmDuration = this.getDuration(speed)

						// console.log('加速下一屏', anmDuration, speed)
						this.transition(anmDuration, this.swiper, changeBy, ((e) => {
							if (e.state !== 'start') {
								this.pageChange()
							}
						}))
					} else if (deltaX < 0) {
						let changeBy = -(this.contentOffsetX - (this.startContentOffsetX - this.realScreenWidth))
						let anmDuration = this.getDuration(speed)
						// console.log('加速上一屏', anmDuration, speed)
						this.transition(anmDuration, this.swiper, changeBy, ((e) => {
							if (e.state !== 'start') {
								this.pageChange()
							}
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
									if (e.state !== 'start') {
										this.pageChange()
									}
								}))
							} else {
								// console.log('上一屏')
								let changeBy = -(this.contentOffsetX - (this.startContentOffsetX - this.realScreenWidth))
								let anmDuration = this.getDuration(speed)
								this.transition(anmDuration, this.swiper, changeBy, ((e) => {
									if (e.state !== 'start') {
										this.pageChange()
									}
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
			scrollToPage: function(pageId) {
				var Element = this.getEl(this.$refs[pageId])
				dom.scrollToElement(Element, {
					offset: 0,
					animated: true
				})
			},
			pageChange: function() {
				if(this.hasHidePage){
					this.currentPage = Math.floor(this.contentOffsetX / this.realScreenWidth) - 1
					this.$emit('pageChange', this.currentPage)
				}
				else{
					this.currentPage = Math.floor(this.contentOffsetX / this.realScreenWidth)
					this.$emit('pageChange', this.currentPage)
				}
			}
		}
	}
</script>

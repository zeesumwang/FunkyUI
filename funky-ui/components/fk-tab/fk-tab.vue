
<template>
	<view class="container"
		@touchstart="scrollerTouchStart"
		@touchend="scrollerTouchEnd"
		@touchcancel="scrollerTouchCancel">
		
		<slot name="header"></slot>
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
				style="position: absolute;bottom: 0px;"
				:style="{left: (headFabX - indicatorBias + 'px'),opacity: isBindTab ? 1 : 0}" 
				ref="indicator"
			>
				<slot name="indicator"></slot>
			</view>
		</fk-transition>
		
		<scroller 
			ref="scroller" 
			:shouldStopPropagationInitResult="true"
			shouldStopPropagationInterval="1000000"
			@horizontalpan="horizontalpan"
			:scrollable="false" 
			:show-scrollbar="false"
			:scrollToBegin="false" 
			:offset-accuracy="true ? 100000 : (PageBias < 11 || PageBias > realScreenWidth - 11) && !isBindPan || isAttachBiasLeft || isAttachBiasRight ? 0.9 : 10" 
			:scroll-direction="'horizontal'" 
			:pagingEnabled="false" 
			:style="{height: height + 'px',width: width + 'px',backgroundColor: backgroundColor}"
			style="flex-direction: row;">
			
			<view :style="{width: bounceBias + 'px'}"></view>
			
			<view v-if="hasHidePage" ref='page-hide' id='page-hide'>
				<slot name="hidePage"></slot>
			</view>
			
			<view 
				v-for="(item,index) in pageList" 
				:ref="'page-'+item.id" 
				:id="'page-'+item.id" 
				:key="index"
			>
				<slot :name="'mainPage'+index"></slot>
			</view>
			
			<view :style="{width: bounceBias + 'px'}"></view>
		</scroller>
		
		<view style="position: absolute;left: 10px;top: 60px;" v-if="debug">
			<view style="flex-direction: row;">
				<text style="color: #DD524D;">isBindPan: </text>
				<text style="color: #008000;">{{isBindPan}}</text>
			</view>
			<view style="flex-direction: row;">
				<text style="color: #DD524D;">isBindTiming: </text>
				<text style="color: #008000;">{{isBindTiming}}</text>
			</view>
			<view style="flex-direction: row;">
				<text style="color: #DD524D;">isBindParent: </text>
				<text style="color: #008000;">{{isBindParent}}</text>
			</view>
			<view style="flex-direction: row;">
				<text style="color: #DD524D;">contentOffsetX: </text>
				<text style="color: #008000;">{{contentOffsetX}}</text>
			</view>
			<view style="flex-direction: row;">
				<text style="color: #DD524D;">PageBias: </text>
				<text style="color: #008000;">{{PageBias}}</text>
			</view>
		</view>
	</view>
</template>

<style>
	.container {
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
			parentId: {
				default: ''
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
						'justifyContent': 'space-around',
						'alignItems': 'center',
						'flexDirection': 'row',
						'width': '200px',
						'position': 'relative'
					}
				}
			},
			backgroundColor: {
				type: String,
				default: '#ffffff'
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
			indicatorBias: {
				type: Number,
				default: 0
			},
			bindProps: {
				type: Array,
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
			easingFunction: {
				type: String,
				default: 'easeOutExpo'
			},
			cubicBezierControl: {
				type: String,
				default: '.38,.38,.0,1'
			},
			height: {
				type: Number,
				default: 350
			},
			width: {
				type: Number,
				default: 350
			},
			bounceMode: {
				type: Boolean,
				default: false
			},
			anmDurationGradient: {
				type: Array,
				default() {
					return [700,600,500,400]
				}
			},
			bounceBias: {
				type: Number,
				default: 0
			},
			parentContentOffsetX: {
				type: Number,
				default: 0
			},
			isBindParent :{
				type: Boolean,
				default: false
			},
			debug :{
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				isBindTab: false,
				isBindPan: false,
				isBindTiming: false,
				isTouchStart: false,
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
				anmToken: {},
				isRefresh: false,
				headFabX: 0,
				endFabX: 0,
				recordCount: 0,
				currentPage: 0,
				bindParentMode: '',
				lastUnbindAnmToken: '',
				stopPropagation: false,
				isHorizontalpan: false,
				isRebindTouch: false,
				scrollerBias: 0,
				pageCount: 0
			}
		},
		computed: {
			contentWidth: function() {
				return this.realScreenWidth * (this.pageCount - 1) + this.scrollerBias
			},
			isAttachBiasLeft: function() {
				return this.contentOffsetX <= this.scrollerBias + 2
			},
			isAttachBiasRight: function() {
				return (this.contentOffsetX >= this.contentWidth - 2)
			},
			isParentScrolling: function() {
				return this.parentContentOffsetX % this.realScreenWidth !== 0
			},
			PageBias: function() {
				return (this.contentOffsetX - this.scrollerBias) % this.realScreenWidth
			}
		},
		created() {			
			this.platform = screenInfo.system.platform
			// 获取全局变量中的屏幕宽高
			this.screenHeightPx = screenInfo.screenHeightPx
			this.screenWidthPx = screenInfo.screenWidthPx
			this.statusBarHeight = screenInfo.system.statusBarHeight

			if (this.platform !== 'ios') {
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
			this.scrollerBias = this.bounceBias / this.screenWidthPx * this.realScreenWidth
			if(this.hasHidePage == true) {
				this.pageCount = this.pageList.length + 1
			}
			else{
				this.pageCount = this.pageList.length
			}
		},
		mounted() {
			if(this.defaultPageId !== ""){
				var indexElement = this.getEl(this.$refs['page-' + this.defaultPageId])
				
				// #ifdef APP-NVUE
				dom.scrollToElement(indexElement, {
					offset: 0,
					animated: true
				})
				// #endif
			}
			setTimeout(() => {				
				this.swiper = this.getEl(this.$refs['scroller'])
				// 准备绑定pan事件
				BindingX.prepare({
					eventType: 'pan',
					anchor: this.swiper
				})
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
			}, 500)
			
		},
		methods: {
			getEl: function(e) {
				if (typeof(e[0]) == 'object') {
					return e[0].ref
				} else {
					return e.ref
				}
			},
			getDuration: function(speed) {
				let anmDuration = 0
				if (speed > 3.5) {
					anmDuration = this.anmDurationGradient[3]
				} else if (speed > 2.5) {
					anmDuration = this.anmDurationGradient[2]
				} else if (speed > 1.5 && speed <= 2.5) {
					anmDuration = this.anmDurationGradient[1]
				} else {
					anmDuration = this.anmDurationGradient[0]
				}
				return anmDuration
			},
			scroll: function(e) {
				// e.stopPropagation(true)
				if (this.platform == 'ios') {
					this.contentOffsetX = Math.abs(e.contentOffset.x) * (750 / this.screenWidthPx)
				} else {
					this.contentOffsetX = Math.abs(e.contentOffset.x)
				}
				this.$emit('scroll', {'ref': this.swiper,'contentOffsetX': this.contentOffsetX - this.scrollerBias})
			},
			scrollToPage: function(pageId) {
				var Element = this.getEl(this.$refs[pageId])
				dom.scrollToElement(Element, {
					offset: 0,
					animated: true
				})
				setTimeout(()=>{this.pageChange()},400)				
			},
			pageChange: function() {
				if(this.hasHidePage){
					this.currentPage = Math.floor((Math.round(this.contentOffsetX) - this.scrollerBias) / this.realScreenWidth) - 1
					this.$emit('pageChange', {'currentPage': this.currentPage,'swiperRef': this.swiper})
				}
				else{
					this.currentPage = Math.floor((Math.round(this.contentOffsetX) - this.scrollerBias) / this.realScreenWidth)
					this.$emit('pageChange', {'currentPage': this.currentPage,'swiperRef': this.swiper})
				}
				this.bindTimingFinshed()
			},
			bindTimingFinshed: function() {
				this.isBindTiming = false
				this.$emit('scrollend')
			},
			unbindPan: function() {
				BindingX.unbind({token:this.panToken.token,eventType:'pan'})
				this.isBindPan = false
			},
			unbindTiming: function() {
				// 取消之前动画绑定，实现在timing过程中能够点击停止
				if(this.anmToken.token == undefined || this.anmToken == {}) {
					return
				}
				// console.log("unbindTiming",this.swiper,this.anmToken)
				if (this.platform == 'ios') {
					BindingX.unbind({token:this.anmToken.token,eventType:'timing'})
				} else {
					BindingX.unbind({token:this.anmToken.token,eventType:'timing'})
				}
				this.anmToken = {}
				this.isBindTiming = false
			},
			bindTap: function() {
				this.isBindTab = true
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
				var variable = `x - ${this.scrollerBias}`
				if(!this.hasHidePage) {
					variable = `x - ${this.scrollerBias} + ${this.realScreenWidth}`
				}
				
				// 绑定提示器
				var indicator = this.getEl(this.$refs['indicator'])
				var indicatorMaxTranslateX = this.endFabX - this.headFabX
				var indicatorMinTranslateX = -1 * indicatorMaxTranslateX / (this.pageList.length - 1) * (this.scrollerBias / this.screenWidthPx)
				// console.log(indicatorMaxTranslateX)
				var indicatorExpression =
					`${variable} > ${this.realScreenWidth - this.scrollerBias} ? (${variable} - ${this.realScreenWidth}) * ${indicatorMaxTranslateX / (this.pageList.length - 1)} / ${this.realScreenWidth} : ${indicatorMinTranslateX}`

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
				}
				, 
				((e) => {
					if(e.state == 'turn') {
						// console.log(e)
						let scrollevent = {
							contentOffset: {
								x: e.x
							}
						}
						this.scroll(scrollevent)
					}
					
				})
				)

			},
			bindPan: function(ref) {
				// binding pan				
				if(this.isBindPan) {
					// console.log('alreadyBindPan')
					return
				}
				if(this.isBindParent) {
					// console.log('alreadyBindPan')
					return
				}
				
				var swiper = this.swiper
				if(ref !== undefined){
					swiper = ref
				}
				
				let scrollstartEvent = {'detail':'bindingPan','anchor':swiper,'target':this.swiper}
				this.$emit('scrollstart',scrollstartEvent)
				this.isBindPan = true
				// console.log('bindingPan',scrollstartEvent)
				var panExpression = ''
				var bounceBiasExp = `${this.contentOffsetX} >= ${this.scrollerBias} && ${this.contentOffsetX} <= ${this.contentWidth}`
				if (this.platform == 'ios') {
					var maxDeltaX = this.screenWidthPx * 0.5
					panExpression = `${bounceBiasExp} ? (${this.contentOffsetX} - x * (750 / ${this.screenWidthPx})) : (${this.contentOffsetX} - x * (750 / ${this.screenWidthPx})) `
				} else {
					panExpression = `${bounceBiasExp} ? (${this.contentOffsetX} - x) : ${this.contentOffsetX} - x`
				}
				
				this.panToken = BindingX.bind(
					{
						eventType: 'pan',
						anchor: swiper,
						props: [{
								element: this.swiper,
								property: 'scroll.contentOffsetX',
								expression: panExpression
							}
						]
					},
					((e)=>{
						// console.log(e)
						if(e.state !== 'start'){
							// console.log(e)
							this.unbindPan()
						}
					})
				)
			},			
			bindTiming: function(speed, deltaX, deltaY) {
				// console.log('bindTiming',this.swiper,this.anmToken)
				this.isBindTiming = true
				this.anmToken = {} //  重置anmToken
				var isBounce = (this.contentOffsetX <= this.scrollerBias || this.contentOffsetX >= this.contentWidth)
				var changeBy = 0
				
				if (deltaX > 0){
					// console.log('左滑')
					if(this.PageBias > this.realScreenWidth / 2 && !isBounce) {
						// console.log('下一屏')
						let changeBy = this.realScreenWidth - this.PageBias
						let anmDuration = this.getDuration(speed)
						this.transition(anmDuration, this.swiper, changeBy, ((e) => {
							if (e.state !== 'start' && e.t < 10000000) {
								this.pageChange()
							}
						}))
					}
					else if (speed > 0.5 && this.PageBias !== 0 && !isBounce){
						let anmDuration = this.getDuration(speed)
						let changeBy = this.realScreenWidth - this.PageBias
						// console.log('加速下一屏')
						this.transition(anmDuration, this.swiper, changeBy, ((e) => {
							if (e.state !== 'start' && e.t < 10000000) {
								this.pageChange()
							}
						}))
					}
					else {
						// console.log('回弹')
						let changeBy = - this.PageBias
						let duration = this.anmDurationGradient[2]
						if(changeBy > this.realScreenWidth * 0.25) {
							duration = this.anmDurationGradient[0]
						}
						this.transition(duration, this.swiper, changeBy, ((e) => {
							if (e.state !== 'start' && e.t < 10000000) {
								this.bindTimingFinshed()
							}
						}))
					}
				}  
				else{
					// console.log('右滑')
					if(this.PageBias < this.realScreenWidth / 2) {
						if (isBounce) {
							// console.log('回弹')
						}
						else {
							// console.log('上一屏')
						}
						
						let changeBy = - this.PageBias
						let anmDuration = this.getDuration(speed)
						this.transition(anmDuration, this.swiper, changeBy, ((e) => {
							if (e.state !== 'start' && e.t < 10000000) {
								this.pageChange()
							}
						}))
					}
					else if (speed > 0.5 && this.PageBias !== 0){
						let anmDuration = this.getDuration(speed)
						let changeBy = - this.PageBias
						// console.log('加速上一屏')						
						this.transition(anmDuration, this.swiper, changeBy, ((e) => {
							if (e.state !== 'start' && e.t < 10000000) {
								this.pageChange()
							}
						}))
					}
					else {
						// console.log('回弹')
						let changeBy = this.realScreenWidth - this.PageBias
						// console.log(changeBy,this.realScreenWidth)
						let duration = this.anmDurationGradient[2]
						if(changeBy > this.realScreenWidth * 0.25) {
							duration = this.anmDurationGradient[0]
						}
						this.transition(duration, this.swiper, changeBy, ((e) => {
							if (e.state !== 'start' && e.t < 10000000) {
								this.bindTimingFinshed()
							}
						}))
					}
				}
			},
			transition: function(duration, el, changeBy, callback) {
				if (changeBy == 0) {
					return
				}
				// console.log(duration, el, changeBy)
				var cubicBezierControl = ''
				if(this.easingFunction == 'cubicBezier') {
					cubicBezierControl += ','
					cubicBezierControl += this.cubicBezierControl 
				}
				
				var expression = `${this.easingFunction}(t,${this.contentOffsetX},${changeBy},${duration}${cubicBezierControl})`
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
				// console.log(this.anmToken)
			},
			scrollerTouchStart: function(e) {
				e.stopPropagation()
				if(e.timeStamp) {
					e.timestamp = e.timeStamp
				}
				else{
					return
				}
				
				e.subSwiper = this.swiper
				e.bindType = 'touch'
				// console.log('bindParentScroll--touch',this.swiper)
				this.$emit('bindParentScroll', e)
				this.isTouchStart = true
				// console.log('viewTouchStart',this.swiper,this.isRebindTouch,this.PageBias,this.parentContentOffsetX,e)
				this.unbindTiming()
				
				if(this.PageBias !== 0 && !this.isRebindTouch) {
					this.$emit('lockTouch')
					this.isRebindTouch = true
					e.type = 'scrollerTouchStart'
					this.touchstart(e)
					this.bindPan()
				}
				else {
					this.$emit('unlockTouch')
				}
			},
			scrollerTouchMove: function(e) {
				e.stopPropagation()   
				if(this.isRebindTouch) {
					e.type = 'scrollerTouchMove'
					if(e.timeStamp) {
						e.timestamp = e.timeStamp
					}
					this.touchmove(e)
				}
				else {
					return
				}				
			},
			scrollerTouchEnd: function(e) {
				e.stopPropagation()
				if(this.isTouchStart == false) {
					return
				}
				this.unbindPan()
				// console.log('viewTouchEnd',this.swiper,this.isTouchStart)
				if(this.isRebindTouch) {
					this.isRebindTouch = false
					e.type = 'scrollerTouchEnd'
					if(e.timeStamp) {
						e.timestamp = e.timeStamp
					}					
					this.touchend(e)
					this.$emit('unlockTouch')
				}
				this.isTouchStart = false
			},
			scrollerTouchCancel: function(e) {
				e.stopPropagation()
				this.scrollerTouchEnd(e)
			},
			horizontalpan: function(e) {
				e.stopPropagation()
				if(this.isRebindTouch) {
					return
				}
				
				if(e.state == 'start') {
					e.type = 'horizontalPanStart'
					this.isHorizontalpan = true
					this.touchstart(e)
				}
				if(e.state == 'move') { 
					e.type = 'horizontalPanMove'
					this.touchmove(e)
				}
				if(e.state == 'end') {
					e.type = 'horizontalPanEnd'
					this.touchend(e)
					this.isHorizontalpan = false
				}
				if(e.state == 'cancel') {
					console.log('?')
					e.type = 'horizontalPanEnd'
					this.touchend(e)
					this.isHorizontalpan = false
				}
			},
			touchstart: function(e) {
				if(this.stopPropagation) {
					return
				}
				
				this.recordCount = 0
				this.changedTouches = []
				// console.log(e.type,this.swiper,this.stopPropagation)
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
			touchmove: function(e) {
				if(this.stopPropagation) {
					return
				}
				if (this.recordCount > 0) {
					return
				}
				// console.log(e.type,this.swiper,this.stopPropagation)
				
				this.recordCount += 1
				var vectorX = e.changedTouches[0].screenX - this.changedTouches[0].screenX
				var vectorY = e.changedTouches[0].screenY - this.changedTouches[0].screenY
				// console.log(this.changedTouches.length)
				var deltaX = Math.abs(vectorX)
				var deltaY = Math.abs(vectorY)
			
				if (deltaX > 0) {
					if(this.bounceMode) {
						this.bindPan()
					}
					else{
						// console.log(vectorX,this.isAttachBiasLeft,this.contentOffsetX <= this.scrollerBias + 2, this.contentOffsetX)
						if ((this.isAttachBiasLeft && vectorX > 0) || (this.isAttachBiasRight && vectorX < 0) || this.isParentScrolling) {
							e.subSwiper = this.swiper
							if (!this.bounceMode && (this.contentOffsetX + 2 < this.scrollerBias || this.contentOffsetX - 2 > this.contentWidth)) {								
								this.bindPan()
							}
							else {
								e.bindType = 'pan'
								// console.log('bindParentScroll--pan',this.swiper)
								this.$emit('bindParentScroll', e)
								this.bindParentMode = 'pan'
							}
						}
						else{
							this.bindPan()
						}
					}
				}
				else {
					// console.log('error',deltaX,deltaY)
				}
			},
			touchend: function(e) {
				if(this.stopPropagation) {
					return
				}
				
				// console.log(e.type,this.swiper,this.stopPropagation)
				
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

						// console.log(speed, deltaX, duration,e.type)
						this.bindTiming(speed, deltaX, deltaY)
						break
					}
				}
				this.changedTouches = []				
			}
		}
	}
</script>

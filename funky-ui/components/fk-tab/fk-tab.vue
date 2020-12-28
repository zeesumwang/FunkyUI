
<template>
	<view class="container">
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
			v-if="touchMode" 
			ref="scroller" 
			@scroll="scroll" 
			@horizontalpan="horizontalpan"
			@touchmove="scrollerTouchMove"
			@touchend="scrollerTouchEnd"
			:scrollable="false" 
			:show-scrollbar="false"
			:scrollToBegin="false" 
			:offset-accuracy="0.01" 
			:scroll-direction="'horizontal'" 
			:pagingEnabled="false" 
			:style="{height: height + 'px',width: width + 'px',backgroundColor: backgroundColor}"
			style="flex-direction: row;">
			
			<view style="width: 100px;height: 100px;"></view>
			
			<view v-if="hasHidePage" @touchstart="checkPageStart($event,0)" ref='page-hide' id='page-hide'>
				<slot name="hidePage"></slot>
			</view>
			
			<view 
				v-for="(item,index) in pageList" 
				:ref="'page-'+item.id" 
				:id="'page-'+item.id" 
				:key="index"
				@touchstart="checkPageStart($event,index + (hasHidePage ? 1 : 0))"
				@touchcancel="checkPageCancel"
				@touchend="checkPageEnd">
				<slot :name="'mainPage'+index"></slot>
			</view>
			
			<view style="width: 100px;height: 100px;"></view>
		</scroller>
		
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
			touchMode: {
				type: Boolean,
				default: true
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
						'width': '350px',
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
			easingFunction: {
				type: String,
				default: 'easeOutBack'
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
			}			
		},
		data() {
			return {
				isBindTab: false,
				isBindPan: false,
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
				isBindParent: false,
				parentContentOffsetX: 0,
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
			this.scrollerBias = 100/this.screenWidthPx * this.realScreenWidth
			if(this.hasHidePage == true) {
				this.pageCount = this.pageList.length + 1
			}
			else{
				this.pageCount = this.pageList.length
			}
		},
		mounted() {
			setTimeout(() => {
				if(this.defaultPageId !== ""){
					var indexElement = this.getEl(this.$refs['page-' + this.defaultPageId])
					
					// #ifdef APP-NVUE
					dom.scrollToElement(indexElement, {
						offset: 0,
						animated: false
					})
					// #endif
				}	
			},100)
						
			setTimeout(() => {				
				this.swiper = this.getEl(this.$refs['scroller'])
				
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
		updated() {
			// console.log('updated')
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
				let anmDuration = 600
				if (speed > 3) {
					anmDuration = 300
				} else if (speed > 2) {
					anmDuration = 400
				} else if (speed > 1 && speed <= 2) {
					anmDuration = 500
				} else {
					anmDuration = 600
				}
				return anmDuration
			},
			scroll: function(e) {
				if (this.platform == 'ios') {
					this.contentOffsetX = Math.ceil(Math.abs(e.contentOffset.x)) * (750 / this.screenWidthPx)
				} else {
					this.contentOffsetX = Math.ceil(Math.abs(e.contentOffset.x))
				}
			},			
			setParentContentOffsetX: function(parentContentOffsetX) {
				if(parentContentOffsetX !== undefined) {
					this.parentContentOffsetX = parentContentOffsetX
				}
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
				this.bindTimingFinshed()
				if(this.hasHidePage){
					this.currentPage = Math.floor((this.contentOffsetX - this.scrollerBias) / this.realScreenWidth) - 1
					this.$emit('pageChange', this.currentPage)
				}
				else{
					this.currentPage = Math.floor((this.contentOffsetX - this.scrollerBias) / this.realScreenWidth)
					this.$emit('pageChange', this.currentPage)
				}
			},
			bindTimingFinshed: function() {
				this.$emit('scrollend')
			},
			unbindPan: function() {
				BindingX.unbind({token:this.panToken.token,eventType:'pan'})
			},
			unbindTiming: function(token) {
				// 取消之前全部绑定，实现在timing过程中能够点击停止
				if(token !== undefined) {
					this.anmToken = token
				}
				// console.log(this.anmToken)
				if(this.anmToken.token == undefined) {
					return
				}
				
				if (this.platform == 'ios') {
					BindingX.unbind({token:this.anmToken.token,eventType:'timing'})
					// console.log('unbindTiming',this.anmToken.token,this.swiper)
					// BindingX.unbind({token:this.panToken.token,eventType:'pan'})
					// BindingX.unbindAll()
					// 再次绑定scroller的scroll事件
					// this.bindTap()
				} else {
					BindingX.unbind({token:this.anmToken.token,eventType:'timing'})
					// console.log('unbindTiming',this.anmToken.token,this.swiper)
					// BindingX.unbind({token:this.panToken.token,eventType:'pan'})
					// BindingX.unbindAll()
					// this.bindTap()
					// 安卓端的unbindAll()不会取消scroll事件的绑定，无需再次绑定
				}
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
				}, ((e) => {
					// console.log(e.x)
				}))

			},
			bindPan: function(id) {
				// binding pan
				// console.log('bindingPan')
				if(this.isBindPan) {
					console.log('alreadyBindPan')
					return
				}
				this.isBindPan = true
				this.$emit('scrollstart')
				this.parentContentOffsetX = 0
				this.isBindParent = false
				var swiper = this.swiper
				if(id !== undefined){
					swiper = id
				}
				// console.log(this.pageCount,this.contentWidth,this.contentOffsetX)
				var panExpression = ''
				var bounceBiasExp = `${this.contentOffsetX} >= ${this.scrollerBias} && ${this.contentOffsetX} <= ${this.contentWidth}`
				if (this.platform == 'ios') {
					var maxDeltaX = this.screenWidthPx * 0.5
					panExpression = `${bounceBiasExp} ? (${this.contentOffsetX} - x * (750 / ${this.screenWidthPx})) : (${this.contentOffsetX} - x * (750 / ${this.screenWidthPx})) `
				} else {
					panExpression = `${bounceBiasExp} ? (${this.contentOffsetX} - x) : ${this.contentOffsetX} - x`
				}
				// 准备绑定pan事件
				BindingX.prepare({
					eventType: 'pan',
					anchor: swiper
				})
				this.panToken = BindingX.bind({
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
						if(e.state !== 'start'){
							BindingX.unbind({token: this.panToken.token, eventType: 'pan'})
							this.isBindPan = false
						}						
					})
				)
			},					
			checkPageStart: function(e,index) {
				// e.stopPropagation() 			
				
				this.unbindTiming()
				this.$emit('unbindParentTiming')
				this.isBindParent = false
				
				this.stopPropagation = false
				this.parentContentOffsetX = 0
				
				if(this.PageBias !== 0) {
					this.$emit('setParentContentOffsetX',this.contentOffsetX - this.scrollerBias)
				}
				
				if(this.PageBias !== 0) {
					this.isRebindTouch = true
					e.type = 'scrollerTouchStart'
					this.touchstart(e)
				}
				
				let touchPageContentOffset = Math.abs(index * this.realScreenWidth)
				// let scrollDistance = Math.abs(touchPageContentOffset - this.contentOffsetX)
				// if (scrollDistance > 0) {
				// 	if (this.PageBias > this.realScreenWidth * 0.5) {
				// 		this.startContentOffsetX = (Math.floor((this.contentOffsetX - this.scrollerBias) / this.realScreenWidth) + 1) * this.realScreenWidth
				// 	} else {
				// 		this.startContentOffsetX = Math.floor((this.contentOffsetX - this.scrollerBias) / this.realScreenWidth) * this.realScreenWidth
				// 	}
				// } else {
				// 	this.startContentOffsetX = touchPageContentOffset
				// }
				this.startContentOffsetX = touchPageContentOffset
				this.startContentOffsetX += this.scrollerBias
			},
			scrollerTouchMove: function(e) {
				if(this.isRebindTouch) {
					e.type = 'scrollerTouchMove'
					this.touchmove(e)
				}
				else {
					return
				}				
			},
			scrollerTouchEnd: function(e) {				
				if(this.isRebindTouch) {
					this.isRebindTouch = false
					e.type = 'scrollerTouchEnd'
					this.touchend(e)
				}
				else {
					return
				}				
			},
			horizontalpan: function(e) {
				// e.stopPropagation() // 阻止冒泡，该API对horizontalpan无效，在ios中偶尔会冒泡到父组件，在Android中一直会冒泡，所以要自行实现阻止冒泡
				
				if(this.isRebindTouch) {
					return
				}
				
				if(e.state == 'start') {
					this.isHorizontalpan = true
					e.type = 'horizontalPanStart'
					this.touchstart(e)
				}
				if(e.state == 'move') {
					if(!this.isHorizontalpan){
						return
					}
					e.type = 'horizontalPanMove'
					this.touchmove(e)
				}
				if(e.state == 'end') {
					if(!this.isHorizontalpan){
						return
					}
					this.isHorizontalpan = false
					e.type = 'horizontalPanEnd'
					this.touchend(e)
				}	
			},
			touchstart: function(e) {
				console.log(e.type,this.swiper)
				this.recordCount = 0
				this.changedTouches = []
				this.isBindPan = false
				this.$emit('stopPropagation')
				if(this.stopPropagation){
					return
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
			touchmove: function(e) {
				if(this.stopPropagation){
					return
				}
				if (this.recordCount > 0) {
					return
				}
				console.log(e.type,this.swiper)
				
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
							// console.log('绑定父组件')
							this.isBindParent = true
							if (this.isBindParent == true) {
								e.subSwiper = this.swiper
								if (!this.bounceMode && (this.contentOffsetX + 2 < this.scrollerBias || this.contentOffsetX > this.contentWidth + 2)) {
									this.bindPan()
								}
								else {
									this.$emit('bindParentScroll', e)
								}
							}
							return				
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
				if(this.stopPropagation){
					return
				}
				
				console.log(e.type,this.swiper)
				
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

						if(this.isBindParent) {
							this.$emit('bindParentTiming',speed, deltaX, deltaY)
						}
						else {
							this.bindTiming(speed, deltaX, deltaY)
						}
						
						break
					}
				}
				this.changedTouches = []
			},			
			bindTiming: function(speed, deltaX, deltaY) {
				this.anmToken = {} //  重置anmToken
				var isBounce = (this.contentOffsetX <= this.scrollerBias || this.contentOffsetX >= this.contentWidth)
				var changeBy = 0
				
				if (deltaX > 0) {
					changeBy = this.startContentOffsetX + this.realScreenWidth - this.contentOffsetX
				}
				else {
					changeBy = -(this.contentOffsetX - (this.startContentOffsetX - this.realScreenWidth))
				}				
				
				if (speed > 0.5 && (this.PageBias) !== 0 && !this.isBindParent && !isBounce) {
					let anmDuration = this.getDuration(speed)
					if (deltaX > 0) {
						if (changeBy + this.contentOffsetX > this.contentWidth) {
							changeBy = this.contentWidth - this.contentOffsetX
							anmDuration = 200
						}
						
						// console.log('加速下一屏', anmDuration, speed, this.swiper,this.contentOffsetX,changeBy)
						
						this.transition(anmDuration, this.swiper, changeBy, ((e) => {
							if (e.state !== 'start') {
								this.pageChange()
							}
						}))
					} 
					else {
						if (changeBy + this.contentOffsetX + 2 < this.scrollerBias) {
							changeBy = -1 * (this.contentOffsetX - this.scrollerBias)
							anmDuration = 200
						}
						
						// console.log('加速上一屏', anmDuration, speed, this.swiper,this.contentOffsetX,changeBy)
						
						this.transition(anmDuration, this.swiper, changeBy, ((e) => {
							if (e.state !== 'start') {
								this.pageChange()
							}
						}))
					}
				} 
				else {
					var deltaX = this.contentOffsetX - this.startContentOffsetX
					
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
						this.transition(300, this.swiper, changeBy, ((e) => {
							this.bindTimingFinshed()
						}))
					}
					
				}
			},
			transition: function(duration, el, changeBy, callback) {
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
			}
		}
	}
</script>

<template>
	<view>
		<view
			@tap="$emit('subButtonTap','subButton3')"
			ref="subButton3"
			:style="{top: top + 'px',left: left + 'px',width: width + 'px',height: height + 'px'}"
			elevation="10px"
			style="position: fixed;border-width: 3px;border-color: #ec7d9c;background-color: #FFFFFF; border-radius: 25px;justify-content: center;align-items: center;">
			<text style="color: #ec7d9c;font-size: 12px;font-weight: bold;">Touch</text>
		</view>
		
		<view
			@tap="$emit('subButtonTap','subButton2')"
			ref="subButton2"
			:style="{top: top + 'px',left: left + 'px',width: width + 'px',height: height + 'px'}"
			elevation="10px"
			style="position: fixed;border-width: 3px;border-color: #ec7d9c;background-color: #FFFFFF; border-radius: 25px;justify-content: center;align-items: center;">
			<text style="color: #ec7d9c;font-size: 12px;font-weight: bold;">Easing</text>
		</view>
		
		<view
			@tap="$emit('subButtonTap','subButton1')"
			ref="subButton1"
			:style="{top: top + 'px',left: left + 'px',width: width + 'px',height: height + 'px'}"
			elevation="10px"
			style="position: fixed;border-width: 3px;border-color: #ec7d9c;background-color: #FFFFFF; border-radius: 25px;justify-content: center;align-items: center;">
			<text style="color: #ec7d9c;font-size: 12px;font-weight: bold;">Debug</text>
		</view>
		
		<view
			ref="mainButton"
			:style="{top: top + 'px',left: left + 'px',width: width + 'px',height: height + 'px'}"
      @panstart="bindmainButtonPan()"
			@tap="isShow ? hideSubButton() : showSubButton()"
			elevation="15px"
			style="position: fixed;border-width: 3px;border-color: #FFFFFF;background-color: #ec7d9c; border-radius: 25px;justify-content: center;align-items: center;">
			<text style="color: #FFFFFF;font-size: 15px;font-weight: bold;">Dev</text>
		</view>
	</view>
</template>

<script>
	import screenInfo from "@/funky-ui/common/helper.js"
	// #ifdef APP-NVUE
	const BindingX = uni.requireNativePlugin('bindingx');
	const dom = uni.requireNativePlugin('dom') // 在APP端引入weex的dom组件
	// #endif
	export default {
		name: 'fkFloatButton',
		props: {
			top: {
				type: Number,
				default: 350
			},
			left: {
				type: Number,
				default: 15
			},
			width: {
				type: Number,
				default: 50
			},
			height: {
				type: Number,
				default: 50
			}
		},
		data() {
			return {
				mainButtonDeltaY: 0,
				mainButtonDeltaX: 0,
				mainButton: '',
				subButton1: '',
				subButton2: '',
				subButton3: '',
				isBindingTime: false,
				isShow: false,
				realScreenWidth: 750,
				orientation: ''
			}
		},
		created() {
			this.realScreenWidth = screenInfo.screenWidthPx
			if(this.realScreenWidth * 0.5 > this.left + 0.5 * this.width) {
				this.orientation = 'left'
			}
			else{
				this.orientation = 'right'
			}
		},
		mounted() {
			this.mainButton = this.getEl(this.$refs.mainButton)
			this.subButton1 = this.getEl(this.$refs.subButton1)
			this.subButton2 = this.getEl(this.$refs.subButton2)
			this.subButton3 = this.getEl(this.$refs.subButton3)
		},
		methods: {
			getEl: function(e) {
				if (typeof(e[0]) == 'object') {
					return e[0].ref
				} else {
					return e.ref
				}
			},
      bindmainButtonScale: function(e) {
        BindingX.bind({
        	eventType: 'timing',
        	exitExpression: 't>200',
        	props: [
        		{
        			element: this.mainButton,
        			property: 'transform.scale',
        			expression: `easeOutBack(t,1,0.2,500)`
        		}
        	]
        })
      },
      bindmainButtonScaleSub: function(e) {
        BindingX.bind({
        	eventType: 'timing',
        	exitExpression: 't>200',
        	props: [
        		{
        			element: this.mainButton,
        			property: 'transform.scale',
        			expression: `easeOutBack(t,1.2,-0.2,500)`
        		}
        	]
        })
      },
			bindmainButtonPan: function(e) {
				if(this.isBindingTime) {
					return
				}
				if(this.isShow) {
					this.hideSubButton()
					return
				}
        // this.bindmainButtonScale();
				BindingX.bind({
						eventType: 'pan',
						anchor: this.mainButton,
						props: [
							{
								element: this.mainButton,
								property: 'transform.translateX',
								expression: `x + (${this.mainButtonDeltaX})`
							},
							{
								element: this.mainButton,
								property: 'transform.translateY',
								expression: `y + (${this.mainButtonDeltaY})`
							},
							{
								element: this.subButton1,
								property: 'transform.translateX',
								expression: `x + (${this.mainButtonDeltaX})`
							},
							{
								element: this.subButton1,
								property: 'transform.translateY',
								expression: `y + (${this.mainButtonDeltaY})`
							},
							{
								element: this.subButton2,
								property: 'transform.translateX',
								expression: `x + (${this.mainButtonDeltaX})`
							},
							{
								element: this.subButton2,
								property: 'transform.translateY',
								expression: `y + (${this.mainButtonDeltaY})`
							},
							{
								element: this.subButton3,
								property: 'transform.translateX',
								expression: `x + (${this.mainButtonDeltaX})`
							},
							{
								element: this.subButton3,
								property: 'transform.translateY',
								expression: `y + (${this.mainButtonDeltaY})`
							}
						]
					},
					((e) => {
            console.log(e.state)
						// pan有start/end/cancel 3个状态
						if (e.state !== 'start') {
							BindingX.unbind({token: e.token,eventType: 'pan'})
							this.mainButtonDeltaY += parseFloat(e.deltaY);
							this.mainButtonDeltaX += parseFloat(e.deltaX);
              console.log(this.mainButtonDeltaX,this.mainButtonDeltaY)
              // this.bindmainButtonScaleSub();
							this.bindmainButtonTiming();
						}
					})
				)
			},
			bindmainButtonTiming: function() {
				if(this.left < 0.5 * this.realScreenWidth) {
					var margin = this.left
				}
				else {
					var margin = this.realScreenWidth - this.left
				}
				let expressionY = `easeOutBack(t,${this.mainButtonDeltaY},0,500)`;
				if(this.mainButtonDeltaX + this.width * 0.5 > 0.5 * this.realScreenWidth - margin){
					var orientation = 'right'
					var changeByX = (this.realScreenWidth - margin * 2) - this.mainButtonDeltaX - this.width
					var expressionX = `easeOutBack(t,${this.mainButtonDeltaX},${changeByX},500)`
				}
				else {
					var orientation = 'left'
					var changeByX = this.mainButtonDeltaX
					var expressionX = `easeOutBack(t,${this.mainButtonDeltaX},${-changeByX},500)`
				}
				// console.log(orientation)
				
				this.isBindingTime = true
				BindingX.bind({
						eventType: 'timing',
						exitExpression: 't>500',
						props: [
							{
								element: this.mainButton,
								property: 'transform.translateX',
								expression: expressionX
							},
              {
              	element: this.mainButton,
              	property: 'transform.translateY',
              	expression: expressionY
              },
							{
								element: this.subButton1,
								property: 'transform.translateX',
								expression: expressionX
							},
              {
              	element: this.subButton1,
              	property: 'transform.translateY',
              	expression: expressionY
              },
							{
								element: this.subButton2,
								property: 'transform.translateX',
								expression: expressionX
							},
              {
              	element: this.subButton2,
              	property: 'transform.translateY',
              	expression: expressionY
              },
							{
								element: this.subButton3,
								property: 'transform.translateX',
								expression: expressionX
							},
              {
              	element: this.subButton3,
              	property: 'transform.translateY',
              	expression: expressionY
              },
						]
					},
					((e) => {
						if(e.state !== 'start') {
							if(orientation == 'left') {
								this.mainButtonDeltaX = 0
							}
							else {
								this.mainButtonDeltaX += changeByX
							}
							this.orientation = orientation
							this.isBindingTime = false
						}
					})
				)
			},
			showSubButton: function(e) {
				if(this.isBindingTime) {
					return
				}
				let startX = this.mainButtonDeltaX
				let startY = this.mainButtonDeltaY
				// console.log(this.orientation)
				if(this.orientation == 'left') {
					var symbol = 1
				}
				else{
					var symbol = -1
				}
				this.isBindingTime = true
				BindingX.bind({
						eventType: 'timing',
						exitExpression: 't>500',
						props: [
							{
								element: this.subButton3,
								property: 'transform.translateX',
								expression: `easeOutBack(t,${startX},${this.width * symbol},500)`
							},
							{
								element: this.subButton3,
								property: 'transform.translateY',
								expression: `easeOutBack(t,${startY},${this.width},500)`
							},
							{
								element: this.subButton2,
								property: 'transform.translateX',
								expression: `easeOutBack(t,${startX},${Math.SQRT2 * this.width * symbol},500)`
							},
              {
              	element: this.subButton2,
              	property: 'transform.translateY',
              	expression: `easeOutBack(t,${startY},0,500)`
              },
							{
								element: this.subButton1,
								property: 'transform.translateX',
								expression: `easeOutBack(t,${startX},${this.width * symbol},500)`
							},
							{
								element: this.subButton1,
								property: 'transform.translateY',
								expression: `easeOutBack(t,${startY},${-1 * this.width},500)`
							},
						]
					},((e) => {
						if(e.state !== 'start') {
							this.isBindingTime = false
						}
					}))
				this.isShow = true
			},
			hideSubButton: function(e) {
				if(this.isBindingTime) {
					return
				}
				if(this.orientation == 'left') {
					var symbol = 1
				}
				else{
					var symbol = -1
				}
				let startX = this.mainButtonDeltaX
				let startY = this.mainButtonDeltaY
				this.isBindingTime = true
				BindingX.bind({
						eventType: 'timing',
						exitExpression: 't>500',
						props: [
							{
								element: this.subButton3,
								property: 'transform.translateX',
								expression: `easeInBack(t,${startX + this.width * symbol},${-1 * this.width * symbol},500)`
							},
							{
								element: this.subButton3,
								property: 'transform.translateY',
								expression: `easeInBack(t,${startY + this.width},${-1 * this.width},500)`
							},
							{
								element: this.subButton2,
								property: 'transform.translateX',
								expression: `easeInBack(t,${startX + (Math.SQRT2 * this.width) * symbol},${Math.SQRT2 * -1 * this.width * symbol},500)`
							},
              {
              	element: this.subButton2,
              	property: 'transform.translateY',
              	expression: `easeInBack(t,${startY},0,500)`
              },
							{
								element: this.subButton1,
								property: 'transform.translateX',
								expression: `easeInBack(t,${startX + this.width * symbol},${-1 * this.width * symbol},500)`
							},
							{
								element: this.subButton1,
								property: 'transform.translateY',
								expression: `easeInBack(t,${startY - this.width},${this.width},500)`
							},
						]
					},((e) => {
						if(e.state !== 'start') {
							this.isBindingTime = false
						}
					}))
				this.isShow = false
			}
		}
	}
</script>

<style>

</style>

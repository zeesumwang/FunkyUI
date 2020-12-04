<template>
	<view class="container">

		<scroller ref="scroller" :scroll-left="scrollLeft" :show-scrollbar="false" scroll-direction='horizontal' :scroll-x="true" :pagingEnabled="true"
		 :style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}" style="flex-direction: row;">
			<view style="background-color: #fb73c8;justify-content: center;" :style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}">
				<view :style="{height: statusBarHeight + 'px'}"></view>
				<list>
					<cell v-for="(item, index) in data" :key="index">
						<view style="height: 100px;justify-content: center;align-items: center;">
							<text>{{item}}</text>
						</view>
					</cell>
				</list>
			</view>
			<view style="background-color: #f4e159;justify-content: center;" :style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}">
				<view :style="{height: statusBarHeight + 'px'}"></view>
				<list>
					<cell v-for="(item, index) in data" :key="index">
						<view style="height: 100px;justify-content: center;align-items: center;">
							<text>{{item}}</text>
						</view>
					</cell>
				</list>
			</view>
			<view style="background-color: #2ef1f5;justify-content: center;" :style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}">
				<view :style="{height: statusBarHeight + 'px'}"></view>
				<list>
					<cell v-for="(item, index) in data" :key="index">
						<view style="height: 100px;justify-content: center;align-items: center;">
							<text>{{item}}</text>
						</view>
					</cell>
				</list>
			</view>
			<view style="background-color: #28d72a;justify-content: center;" :style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}">
				<view :style="{height: statusBarHeight + 'px'}"></view>
				<list>
					<cell v-for="(item, index) in data" :key="index">
						<view style="height: 100px;justify-content: center;align-items: center;">
							<text>{{item}}</text>
						</view>
					</cell>
				</list>
			</view>
			<view style="background-color: #f23021;justify-content: center;" :style="{height: screenHeightPx + 'px',width: screenWidthPx + 'px'}">
				<view :style="{height: statusBarHeight + 'px'}"></view>
				<list>
					<cell v-for="(item, index) in data" :key="index">
						<view style="height: 100px;justify-content: center;align-items: center;">
							<text>{{item}}</text>
						</view>
					</cell>
				</list>
			</view>
		</scroller>


		<view ref='fab' style="height: 46px;position: fixed;justify-content: space-around;align-items: center;flex-direction: row;background-color: #393a3a;border-radius: 50px;"
		 :style="{left: screenWidthPx * (1-0.618) *0.5 + 'px',bottom: statusBarHeight * 0.5 + 'px',width: screenWidthPx * 0.618 + 'px'}">
			<image v-for="(item, index) in fabList" :key="item.id" :id="item.id" :ref="item.id" :src="item.url" style="width: 20px;height: 20px;"
				:style="{borderRadius: item.id == 'user' ? '25px' : 0, opacity: index == 0 ? 1 : 0.2}"
			>
			</image>
		</view>
	</view>
</template>

<style>
	.container {
		flex: 1;
		background-color: #ffffff;
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
				screenWidthRpx: 750,
				statusBarHeight: 0,
				data: [],
				scrollLeft: 0
			}
		},
		created() {
			// 获取全局变量中的屏幕宽高
			this.screenHeightPx = screenInfo.screenHeightPx
			this.screenWidthPx = screenInfo.screenWidthPx
			this.statusBarHeight = screenInfo.system.statusBarHeight
			this.scrollLeft = this.screenWidthPx
			if(screenInfo.system.platform !== 'ios'){
				this.screenWidthRpx = this.screenWidthPx
			}
			for (var i = 0; i < 50; i++) {
				this.data.push(i)
			}
		},
		mounted() {
			setTimeout(()=>{
				this.bindTap()
			},100)
		},
		methods: {
			bindTap: function() {
				var swiper = this.getEl(this.$refs['scroller'])
				var fab = this.getEl(this.$refs['fab'])
				var fabHeight = this.statusBarHeight * 0.5
				var maxTranslateY = fabHeight * 5
				
				
				var props = [{
							element: fab,
							property: 'transform.translateY',
							expression: `${maxTranslateY} * (x < ${this.screenWidthRpx} ? (1 - x / ${this.screenWidthRpx}) : 0)`
						}]
				
				
				for(var i = 0; i < this.fabList.length; i++){
					let fabItem = this.getEl(this.$refs[this.fabList[i].id])
					let subExpression = (1+i)*this.screenWidthRpx
					let expression = `x == ${subExpression} ? 1 : (x < ${subExpression} ? max((x - ${i*this.screenWidthRpx}) / 750, 0.2) : max(1 - ((x - ${subExpression}) / 750), 0.2))`
					let prop = {
						element: fabItem,
						property: 'opacity',
						expression: expression
					}
					props.push(prop)
				}
				
				Binding.bind({
					eventType: 'scroll',
					anchor: swiper,
					props: props
				}, ((e) => {
					console.log(e.x)
				}))
			},
			getEl: function(e) {
				if(typeof(e[0])=='object'){
					return e[0].ref
				}
				else{
					return e.ref
				}
			}
		}
	}
	
</script>

<template>
	<view style="align-items: center;">
		<view :style="{height: statusBarHeight + 'px'}"></view>
		<view style="height: 280px;border-radius: 5px;filter: blur(3px);" :style="{width: screenWidthPx -40 + 'px'}">
			<view style="position: absolute;bottom: 0px;flex-direction: column;" :style="{width: screenWidthPx -40 + 'px'}">
				<view style="flex-direction: row;justify-content: space-between;" :style="{width: screenWidthPx -40 + 'px'}">
					<image src="/static/logo.jpg" class="logo">
					</image>
					<view style="align-items: center;flex-direction: row;">
						<view style="background-color: #1a181a;justify-content: center;align-items: center;border-radius: 30px;height: 40px;margin-right: 8px;">
							<text style="color: #EBEBEB;font-size: 14px;padding: 6px;padding-left: 20px;padding-right: 20px;">编辑资料</text>
						</view>
						<view style="background-color: #1a181a;justify-content: center;align-items: center;border-radius: 30px;height: 40px;width: 40px">
							<text style="color: #EBEBEB;font-size: 14px;">⊙</text>
						</view>						
					</view>
				</view>
				<view class="userInfoRow">
					<text style="color: #EBEBEB;font-size: 28px;font-weight: bold;">销魂小山楂</text>
				</view>
				<view class="userInfoRow">
					<text style="color: #6c6b6c;font-size: 12px;">过于丰富，无法简介。</text>
				</view>
				<view class="userInfoRow">
					<view style="flex-direction: row;">
						<view style="background-color: #1a181a;margin-right: 6px;border-radius: 6px;">
							<text style="color: #EBEBEB;font-size: 12px;padding: 6px;">20岁</text>
						</view>						
						<view style="background-color: #1a181a;margin-right: 6px;border-radius: 6px;">
							<text style="color: #EBEBEB;font-size: 12px;padding: 6px;">双鱼座</text>
						</view>						
					</view>
				</view>
				
				<view class="userInfoRow">
					<view style="flex-direction: row;justify-content: space-between;align-items: center;">
						<view style="flex-direction: row;align-items: center;">
							<view>
								<text style="color: #EBEBEB;font-size: 14px;padding: 6px;">26</text>
							</view>
							<view>
								<text style="color: #6c6b6c;font-size: 12px;">关注</text>
							</view>
							<view>
								<text style="color: #EBEBEB;font-size: 14px;padding: 6px;">26</text>
							</view>
							<view>
								<text style="color: #6c6b6c;font-size: 12px;">粉丝</text>
							</view>
							<view>
								<text style="color: #EBEBEB;font-size: 14px;padding: 6px;">26</text>
							</view>
							<view>
								<text style="color: #6c6b6c;font-size: 12px;">点赞</text>
							</view>
						</view>
						<view>
							<view style="flex-direction: row;align-items: center;">
								<image src="/static/flash.png" style="width: 14px;height: 14px;margin: 2px;"></image>
								<text style="color: #EBEBEB;font-size: 14px;padding: 6px;">电量中心</text>
							</view>
						</view>
					</view>
				</view>
				
			</view>			
		</view>
		<fk-tab ref="subTab" :pageList="pageList" @bindparent="bindparent" @unbindparent="unbindparent" @parentbindTiming="parentbindTiming">
			<template v-slot:fab>
				<view v-for="(item, index) in pageList" :key="item.id" :id="item.id" :ref="item.id" :style="{opacity: index == 0 ? 1 : 0.2}">
					<text>{{item.text}}</text>
				</view>
			</template>
			
			<template v-slot:mainPage0>
				<fk-list :width="screenWidthPx" :height="screenHeightPx - statusBarHeight" :hasRefresh="true" :isRefresh="isRefresh"
				 @refreshing="refreshing">
					<fk-cell style="justify-content: center;align-items: center;">
						<view style="height: 250px;background-color: #007AFF;" :style="{width: screenWidthPx -10 + 'px'}">
							<text style="color: #514f50">???</text>
						</view>
					</fk-cell>
				</fk-list>
			</template>
			
			<template v-slot:mainPage1>
				<fk-list :width="screenWidthPx" :height="screenHeightPx - statusBarHeight" :hasRefresh="true" :isRefresh="isRefresh"
				 @refreshing="refreshing">
					<fk-cell style="justify-content: center;align-items: center;">
						<view style="height: 250px;background-color: #007AFF;" :style="{width: screenWidthPx -10 + 'px'}">
							<text style="color: #514f50">???</text>
						</view>
					</fk-cell>
				</fk-list>
			</template>
		</fk-tab>
		
	</view>
</template>

<script>
	import screenInfo from "@/funky-ui/common/helper.js"

	export default {
		data() {
			return {
				screenHeightPx: 0,
				screenWidthPx: 0,
				statusBarHeight: 0,
				isRefresh: false,
				pageList: [
					{
						id: 'mine',
						text: '我的'
					},
					{
						id: 'liked',
						text: '点赞'
					}
				]
			}
		},
		created() {
			this.screenHeightPx = screenInfo.screenHeightPx
			this.screenWidthPx = screenInfo.screenWidthPx
			this.statusBarHeight = screenInfo.system.statusBarHeight
		},
		methods: {
			refreshing: function() {
				this.isRefresh = true
				setTimeout(() => {
					this.isRefresh = false
				}, 2000)
			},
			bindparent: function(e) {
				// console.log("bindParent")
				this.$parent.bindPan(e.subSwiper)
			},
			unbindparent: function() {
				console.log("unbindParent")
				// this.$parent.bindTiming(0, deltaX, 0)
				this.$parent.changedTouches = []
			},
			parentbindTiming: function(speed, deltaX, deltaY) {	
				// console.log("bindparentbindTiming")
				this.$parent.bindTiming(speed, deltaX, deltaY)
			},
			unbindSubTab: function(e) {
				this.$refs.subTab.unbindAll(e)
				this.$refs.subTab.isBindParent = true
			}
		}
	}
</script>

<style>
	.logo {		
		width: 90px;
		height: 90px;
		border-radius: 90px;
	}
	.userInfoRow {
		margin-top: 10px;
	}
</style>

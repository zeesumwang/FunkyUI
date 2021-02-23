<template>
		
	<view style="align-items: center;flex: 1" :style="{width: screenWidthPx + 'px', height: screenHeightPx + 'px'}">
		
		<view :style="{height: statusBarHeight + 'px'}"></view>
		<view style="height: 280px;" :style="{width: screenWidthPx -40 + 'px'}">
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
		
		<fk-tab 
			ref="subTab" 
			:indicatorBias="16" 
			:backgroundColor="'#0b0b0b'" 
			:fabBackgroundColor="'#0b0b0b'"
			:fabElevation="0"
			:height="screenHeightPx - statusBarHeight - 280 - 32 - 3" 
			:width="screenWidthPx" 
			:pageList="pageList"
			:defaultPageId="'mine'"
			:isBindParent="isBindParent"
			:easingFunction="easingFunction"
			@bindParentScroll="bindParentScroll">
			
			<template v-slot:fab>
				<view v-for="(item, index) in pageList" :key="item.id" :id="item.id" :ref="item.id" :style="{opacity: index == 0 ? 1 : 0.2}" 
					style="justify-content: center;align-items: center;height: 32px;">
					<text style="color: #EBEBEB;font-size: 16px;font-weight: bold">{{item.text}}</text>
				</view>
			</template>
			
			<template v-slot:indicator>
				<view 
					style="
					height: 3px;
					width: 32px;
					border-radius: 3px;
					background-image: linear-gradient(to bottom, #ec7d9c, #ec7d9c);"
				>						
				</view>	
			</template>
			
			<template v-slot:mainPage0>
				<fk-list :width="screenWidthPx" :height="screenHeightPx - statusBarHeight - 280" :hasRefresh="true" :isRefresh="isRefresh" :scrollable="listScrollable"
				 @refreshing="refreshing">
					<fk-cell style="justify-content: center;align-items: center;">
						<view style="height: 250px;justify-content: center;align-items: center;" :style="{width: screenWidthPx -10 + 'px'}">
							<text style="color: #EBEBEB">???</text>
						</view>
					</fk-cell>
					<fk-cell style="justify-content: center;align-items: center;">
						<view style="height: 250px;justify-content: center;align-items: center;" :style="{width: screenWidthPx -10 + 'px'}">
							<text style="color: #EBEBEB">???</text>
						</view>
					</fk-cell>
					<fk-cell style="justify-content: center;align-items: center;">
						<view style="height: 250px;justify-content: center;align-items: center;" :style="{width: screenWidthPx -10 + 'px'}">
							<text style="color: #EBEBEB">???</text>
						</view>
					</fk-cell>
				</fk-list>
			</template>
			
			<template v-slot:mainPage1>
				<fk-list :width="screenWidthPx" :height="screenHeightPx - statusBarHeight - 280" :hasRefresh="true" :isRefresh="isRefresh" :scrollable="listScrollable"
				 @refreshing="refreshing">
					<fk-cell style="justify-content: center;align-items: center;">
						<view style="height: 250px;justify-content: center;align-items: center;" :style="{width: screenWidthPx -10 + 'px'}">
							<text style="color: #EBEBEB">???</text>
						</view>
					</fk-cell>
					<fk-cell style="justify-content: center;align-items: center;">
						<view style="height: 250px;justify-content: center;align-items: center;" :style="{width: screenWidthPx -10 + 'px'}">
							<text style="color: #EBEBEB">???</text>
						</view>
					</fk-cell>
					<fk-cell style="justify-content: center;align-items: center;">
						<view style="height: 250px;justify-content: center;align-items: center;" :style="{width: screenWidthPx -10 + 'px'}">
							<text style="color: #EBEBEB">???</text>
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
		props: {
			listScrollable: {
				type: Boolean,
				default: false
			},
			parentContentOffsetX: {
				type: Number,
				default: 0
			},
			easingFunction: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				screenHeightPx: 0,
				screenWidthPx: 0,
				statusBarHeight: 0,
				isRefresh: false,
				isBindParent: false,
				pageList: [
					{
						id: 'mine',
						text: '我的'
					},
					{
						id: 'liked',
						text: '收藏'
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
			stopPropagation: function(e) {
				// console.log('stopPropagation')
				// this.$parent.stopPropagation = true
			},
			resetStopPropagation: function(e) {
				// console.log('resetStopPropagation')
				// this.$parent.stopPropagation = false
			},
			bindParentScroll: function(e) {
				// console.log(e.bindType)
				if(e.bindType == 'touch') {
					if(this.$parent.PageBias !== 0) {
						this.$parent.unbindTiming()
						this.$parent.bindPan(e.subSwiper)
						this.isBindParent = true
					}
					else {
						this.isBindParent = false
					}
				}
				else {
					if(this.$parent.PageBias == 0) {
						this.$parent.unbindTiming()
						this.$parent.bindPan(e.subSwiper)
						this.isBindParent = true
					}
					else {
						this.isBindParent = false
					}
				}
			}
		}
	}
</script>

<style>
	.logo {		
		width: 90px;
		height: 90px;
		border-bottom-left-radius: 45px;
		border-bottom-right-radius: 45px;
		border-top-right-radius: 45px;
		border-top-left-radius: 45px;
	}
	.userInfoRow {
		margin-top: 10px;
	}
</style>

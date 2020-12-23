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
		<fk-tab ref="subTab" :pageList="pageList" @bindParentScroll="bindParentScroll" @bindParentTiming="bindParentTiming" @unbindParentTiming="unbindParentTiming">
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
			deepClone: function(target) {
			    // 定义一个变量
			    let result;
			    // 如果当前需要深拷贝的是一个对象的话
			    if (typeof target === 'object') {
			    // 如果是一个数组的话
			        if (Array.isArray(target)) {
			            result = []; // 将result赋值为一个数组，并且执行遍历
			            for (let i in target) {
			                // 递归克隆数组中的每一项
			                result.push(this.deepClone(target[i]))
			            }
			         // 判断如果当前的值是null的话；直接赋值为null
			        } else if(target===null) {
			            result = null;
			         // 判断如果当前的值是一个RegExp对象的话，直接赋值    
			        } else if(target.constructor===RegExp){
			            result = target;
			        }else {
			         // 否则是普通对象，直接for in循环，递归赋值对象的所有值
			            result = {};
			            for (let i in target) {
			                result[i] = this.deepClone(target[i]);
			            }
			        }
			     // 如果不是对象的话，就是基本数据类型，那么直接赋值
			    } else {
			        result = target;
			    }
			     // 返回最终结果
			    return result;
			},
			refreshing: function() {
				this.isRefresh = true
				setTimeout(() => {
					this.isRefresh = false
				}, 2000)
			},
			bindParentScroll: function(e) {
				// console.log("bindParentScroll")
				this.$parent.bindPan(e.subSwiper)
				if(screenInfo.system.platform === 'ios') {
					// this.$parent.bindTap(e.subSwiper)
				}				
			},
			bindParentTiming: function(speed, deltaX, deltaY) {	
				console.log("bindbindParentTiming")
				// console.log(this.$parent.anmToken)
				this.$parent.bindTiming(speed, deltaX, deltaY)
				// console.log(this.$parent.anmToken)
			},
			unbindParentTiming: function() {	
				console.log("unbindbindParentTiming")
				this.$parent.unbindTiming()
			},
			unbindSubTabTiming: function(parentContentOffsetX) {
				// console.log("unbindSubTabTiming")
				this.$refs.subTab.unbindPan()
				this.$refs.subTab.unbindTiming()
				this.$refs.subTab.setParentContentOffsetX(parentContentOffsetX)
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

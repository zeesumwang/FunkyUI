<template>
	<view>
		<view :style="{height: screenHeightPx + 'px'}" class="loginPage">
			<image src="/static/icon.png" style="width: 96px;height: 96px;margin: 50px;"></image>
			<view>
				<text style="font-size: 12px;align-self: flex-start;color: #6c6b6c;">手机号码</text>
				<view style="flex-direction: row;display: flex;justify-content: flex-start;align-items: center;" class="row">
					<text style="font-size: 18px;color: #ebebeb;">+86</text>
					<input :maxlength='11' type="digit" @input="phoneNumInput" class="phoneInput" style="margin-left: 10px;" :cursor-spacing="200"/>
				</view>
			</view>
			<view style="margin-top: 10px;">
				<text style="font-size: 12px;align-self: flex-start;color: #6c6b6c;">验证码</text>
				<view style="flex-direction: row;display: flex;justify-content: center;align-items: center;" class="row">
					<input :maxlength="6" type="digit" @input="verifyInput" class="phoneInput" style="margin-left: 0px;" :cursor-spacing="100" />
					<text class="verify" @tap="getVerifyCode">获取验证码</text>
				</view>
			</view>
			<view @tap="login" class="loginButton">
				<text style="color: #FFFFFF;font-size: 18px;">登录</text>
			</view>
		</view>
	</view>
</template>

<script>
	import screenInfo from "@/funky-ui/common/helper.js"
	
	export default {
		data() {
			return {
				phoneNum: '',
				verifyCode: '',
				screenHeightPx: 999,
				screenWidthPx: 0,
				statusBarHeight: 0,
			}
		},
		mounted() {
			this.statusBarHeight = screenInfo.system.statusBarHeight
			this.screenHeightPx = screenInfo.screenHeightPx
			this.screenWidthPx = screenInfo.screenWidthPx
		},
		onLoad() {
			
		},
		methods: {
			phoneNumInput: function(e) {
				this.phoneNum = e.detail.value
			},
			verifyInput: function(e) {
				this.verifyCode = e.detail.value
			},
			getVerifyCode: function() {
				if (this.phoneNum.length < 11) {
					uni.showToast({
						title:'请输入正确手机号',
						icon: 'none'
					})
					return
				}
				uni.showLoading({
					mask: true
				})
				uni.request({
					url: 'https://code-server.api.funkydog.club/app/phone_msg/?phone_num=' + this.phoneNum,
					method: 'GET',
					complete: (res) => {
						uni.hideLoading()
					},
					success: (res) => {
						console.log(res)
						uni.showToast({
							title: '发送成功'
						})
					},
					fail: () => {
						uni.showToast({
							title: '发送失败',
							icon: 'none'
						})
					}
				})
			},
			login: function() {
				if(this.verifyCode.length < 6 || this.phoneNum.length < 11) {
					uni.showToast({
						title:'请检查手机号和验证码',
						icon: 'none'
					})
					return
				}
				uni.showLoading({
					mask: true
				})
				uni.request({
					url: 'https://code-server.api.funkydog.club/app/phone_auth/',
					method: 'POST',
					data: {
						"phone_num": this.phoneNum,
						"v_code": this.verifyCode
					},
					complete: ()=> {
						uni.hideLoading()
					},
					success: (res) => {
						if(res.statusCode !== 200) {
							uni.showToast({
								title:'登录失败，请重试！',
								icon: 'none'
							})
							return
						}
						uni.setStorage({
						    key: 'token',
						    data: res.data.token,
						    success: function () {
						        uni.showToast({
						        	title:'登录成功！',
						        })
								uni.redirectTo({
									url: '../index'
								})
						    }
						})
					},
					fail: (res) => {
						uni.showToast({
							title:'登录失败，请重试！',
							icon: 'none'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.loginPage {
		width: 750rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #0D0D0D;
	}
	.phoneInput {
		width: 180px;
		color: #ebebeb;
		font-size: 18px;
		height: 40px;
		caret-color: $uni-color-primary;
	}
	.row {
		width: 280px;
		border-bottom-width: 1px;
		border-bottom-style: solid;
		border-bottom-color: $uni-color-primary;
	}
	.verify {
		font-size: 12px;
		color: $uni-color-primary;
	}
	
	.loginButton {
		margin-top: 40px;
		display: flex;
		background-color: $uni-color-primary;
		height: 40px;
		width: 280px;
		border-radius: 6px;
		justify-content: center;
		align-items: center;
	}
</style>

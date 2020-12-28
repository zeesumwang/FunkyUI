<template>
	<view>
		<view :style="{height: statusBarHeight + 'px'}"></view>
		<fk-list :width="screenWidthPx" :height="screenHeightPx - statusBarHeight" :hasRefresh="true" :isRefresh="isRefresh" :scrollable="listScrollable"
		 @refreshing="refreshing">
			<fk-cell v-for="(item, index) in stations" :key="index" style="justify-content: center;align-items: center;">
				<view style="height: 220px;border-radius: 10px;margin-bottom: 5px;justify-content: center;align-items: center;background-color: #252626;"
				 :style="{width: screenWidthPx -10 + 'px'}" @tap="getStationInfo(item.stationId)">
					<text style="color: #ebebeb; font-size: 14px;">{{item.cityName}}-{{item.entName}}</text>
				</view>
			</fk-cell>
		</fk-list>
		
	</view>
</template>

<script>
	import screenInfo from "@/funky-ui/common/helper.js"
	
	export default {
		props: {
			listScrollable: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				screenHeightPx: 0,
				screenWidthPx: 0,
				statusBarHeight: 0,
				isRefresh: false,
				stations: [],
				stationInfo: []
			}
		},
		created() {
			this.screenHeightPx = screenInfo.screenHeightPx
			this.screenWidthPx = screenInfo.screenWidthPx
			this.statusBarHeight = screenInfo.system.statusBarHeight
			uni.request({
				url: "http://60.164.242.118:8090/station/listAll",
				success: (res) => {
					this.stations = res.data.data
					console.log("获取全部站点ID")
				}
			})
		},
		methods: {
			refreshing: function() {
				this.isRefresh = true
				setTimeout(() => {
					this.isRefresh = false
				}, 2000)
			},
			getStationInfo: function(stationId) {
				uni.navigateTo({
					url: `jg/jgInfo?stationId=${stationId}`,
					complete: (e) => {
						// console.log(e)
					}
				})
				uni.showLoading({
					title: "获取站点信息" + stationId
				})
			}
		}
	}
</script>

<style>

</style>

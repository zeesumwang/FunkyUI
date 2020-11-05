<template>
	<scroll-view>
		<view style="flex: 1;flex-direction: row;justify-content: space-between;">
			<view style="height: fit-content;" :style="{width: columnWidth + 'px'}" v-for="columnNum in columnCount" :key="columnNum" :id="'column'+columnNum">
				<fk-image :limitWidth="columnWidth" url="https://geancloud.oss-cn-hangzhou.aliyuncs.com/weibo/2711147d7b5989ccebc3367e042b433b.jpg"></fk-image>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	import screenInfo from "@/common/helper.js"
	export default {
		name: "fkWaterfall",
		props: {
			'columnCount': {
				type: Number,
				default: 2
			}
		},
		created() {
			this.columnWidth = screenInfo.screenWidthPx / this.columnCount
		},
		data() {
			return {
				lastHeightInfo: [],
				columnWidth: 0
			};
		}
	}
</script>

<style>

</style>

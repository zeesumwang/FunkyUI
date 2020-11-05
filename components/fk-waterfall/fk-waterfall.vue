<template>
	<view>
		<scroll-view style="width: 0px;height: 0px;">
			<!-- 预加载图片，不显示，通过加载完成后图片的高度选择投入哪个图片列表 -->
			<fk-image style="width: 0px;height: 0px;" :limitWidth="columnWidth" v-for="(url,index) in urlList" :key="url+index" :src="url" @loadSuccess="loadSuccess"></fk-image>
		</scroll-view>
		<scroll-view :scroll-y="true" v-if="loadCount==urlCount" :style="{width: width + 'px', height: height + 'px'}" style="position: fixed;">
			<view style="flex: 1;flex-direction: row;justify-content: space-between;">
				<view :style="{width: columnWidth + 'px'}" v-for="columnNum in columnCount" :key="columnNum">
					
						<fk-image v-for="(url,index) in columnInfo.url['column'+(columnNum-1)]" :key="url+index" :limitWidth="columnWidth" :src="url"></fk-image>
					
				</view>
			</view>
		</scroll-view>
	</view>
	
</template>

<script>
	import screenInfo from "@/common/helper.js"
	export default {
		name: "fkWaterfall",
		props: {
			'columnCount': {
				type: Number,
				default: 2
			},
			'urlList': {
				type: Array,
				default() {
					return [
						'https://geancloud.oss-cn-hangzhou.aliyuncs.com/weibo/2711147d7b5989ccebc3367e042b433b.jpg',					
						'https://geancloud.oss-cn-hangzhou.aliyuncs.com/ins/587fd446257ace0807610e265220c709.jpg@!400',
						'https://geancloud.oss-cn-hangzhou.aliyuncs.com/weibo/2711147d7b5989ccebc3367e042b433b.jpg',
						'https://geancloud.oss-cn-hangzhou.aliyuncs.com/weibo/2711147d7b5989ccebc3367e042b433b.jpg',
						'https://geancloud.oss-cn-hangzhou.aliyuncs.com/ins/587fd446257ace0807610e265220c709.jpg@!400',
						'https://geancloud.oss-cn-hangzhou.aliyuncs.com/weibo/2711147d7b5989ccebc3367e042b433b.jpg',
						'https://geancloud.oss-cn-hangzhou.aliyuncs.com/weibo/2711147d7b5989ccebc3367e042b433b.jpg',
						'https://geancloud.oss-cn-hangzhou.aliyuncs.com/ins/587fd446257ace0807610e265220c709.jpg@!400',
						'https://geancloud.oss-cn-hangzhou.aliyuncs.com/weibo/2711147d7b5989ccebc3367e042b433b.jpg',
						'https://geancloud.oss-cn-hangzhou.aliyuncs.com/weibo/2711147d7b5989ccebc3367e042b433b.jpg',
						'https://geancloud.oss-cn-hangzhou.aliyuncs.com/ins/587fd446257ace0807610e265220c709.jpg@!400',
						'https://geancloud.oss-cn-hangzhou.aliyuncs.com/weibo/2711147d7b5989ccebc3367e042b433b.jpg',
					]
				}
			}
		},
		data() {
			return {
				lastHeightInfo: [],
				columnWidth: 0,
				columnInfo: {
					'url': {},
					'height': []
				},
				height: 0,
				width: 0,
				urlCount: 0,
				loadCount: 0
			};
		},
		created() {
			this.width = screenInfo.screenWidthPx
			this.height = screenInfo.screenHeightPx
			this.urlCount = this.urlList.length
			// 初始化瀑布流的列宽
			this.columnWidth = screenInfo.screenWidthPx / this.columnCount
			// 初始化瀑布流各列的图片列表为空，各列初始高度为0
			for(var i = 0; i < this.columnCount; i++){
				this.columnInfo.url['column'+i] = []
				this.columnInfo.height.push(0)
			}
		},
		methods: {
			loadSuccess: function(e) {
				let minHeight = Math.min.apply(null, this.columnInfo.height)
				let minHeightColumnIndex = this.columnInfo.height.indexOf(minHeight)
				this.columnInfo.url['column'+minHeightColumnIndex].push(e.url)
				this.columnInfo.height[minHeightColumnIndex] += e.height
				this.loadCount += 1
			}
		}
	}
</script>

<style>

</style>

<template>
	<!-- #ifdef APP-NVUE -->
	<waterfall :column-count="columnCount" :column-gap="0">
	<!-- #endif -->
		<!-- #ifndef APP-NVUE -->
		<fk-list 
			v-if="loadedCount==urlCount"
			:height="height"
			:width="width"
			:isRefresh="isRefresh" 
			@refreshing="$emit('refreshing')"
			@dragingDown="$emit('dragingDown')" 
			@dragingUp="$emit('dragingUp')"
		>
			<fk-cell>
				<view style="flex-direction: row;justify-content: space-between;">
					<view :style="{width: columnWidth + 'px'}" v-for="columnNum in columnCount" :key="columnNum">
						<text style="color: #007AFF;">{{columnNum}}</text>
						<!-- 小程序端的起点为0 -->
						<!-- #ifdef MP -->
						<fk-image v-for="(url,index) in columnInfo.url['column'+(columnNum)]" :key="index" :limitWidth="columnWidth" :src="url+'?x-oss-process=image/resize,h_400,w_400'"></fk-image>
						<!-- #endif -->
						<!-- #ifndef MP -->
						<fk-image v-for="(url,index) in columnInfo.url['column'+(columnNum-1)]" :key="index" :limitWidth="columnWidth" :src="url+'?x-oss-process=image/resize,h_400,w_400'"></fk-image>
						<!-- #endif -->
					</view>
				</view>
			</fk-cell>
			
		</fk-list>
		<!-- #endif -->
		
	<!-- #ifdef APP-NVUE -->
		<cell v-for="(url,index) in urlList" :key="index" :style="{width: columnWidth + 'px'}">
			<text style="color: #007AFF;">{{index}}</text>
			<fk-image :limitWidth="columnWidth" :src="url+'?x-oss-process=image/resize,h_600,w_600'" @loadSuccess="loadSuccess"></fk-image>
		</cell>
	</waterfall>
	<!-- #endif -->
	
</template>

<script>
	// import screenInfo from "@/common/helper.js"
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
					return []
				}
			},
			'width': {
				type: Number,
				default: 0,
			},
			'height': {
				type: Number,
				default: 0
			},
			'isRefresh': {
				type: Boolean,
				default: false
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
				urlCount: 0,
				loadedCount: 0
			};
		},
		created() {
			
		},
		mounted() {
			// 初始化瀑布流的列宽
			this.columnWidth = this.width / this.columnCount
			// 统计url的总数
			this.urlCount = this.urlList.length
			// #ifndef APP-NVUE
			// 非APP端的额外实现
			// 初始化瀑布流各列的图片列表为空，各列初始高度为0
			for(var i = 0; i < this.columnCount; i++){
				this.columnInfo.url['column'+i] = []
				this.columnInfo.height.push(0)
			}
			this.setWaterfall()
			// #endif			
		},
		methods: {
			async setWaterfall () {
				for(var i = 0; i < this.urlList.length; i++){
					await this.getImageInfo(this.urlList[i])
				}
				this.$emit("setWaterfallSuccess")
			},
			async getImageInfo (url) {
				var [error, res] = await uni.getImageInfo({
					src: url,
				});
				let imgWidth = this.columnWidth
				let imgHeight = imgWidth * res.height / res.width
				let event = {'height': imgHeight,'url': url}
				await this.loadSuccess(event)
			},
			async loadSuccess (e) {
				// #ifndef APP-NVUE
				let minHeight = Math.min.apply(null, this.columnInfo.height)
				let minHeightColumnIndex = this.columnInfo.height.indexOf(minHeight)
				this.columnInfo.url['column'+minHeightColumnIndex].push(e.url)
				this.columnInfo.height[minHeightColumnIndex] += e.height
				// #endif
				this.loadedCount += 1
				
			}
		}
	}
</script>

<style>

</style>

<template>
	<!-- #ifdef APP-NVUE -->
	<waterfall 
		:column-count="columnCount" 
		:column-gap="0"
		:style="{'height': height + 'px','width': width + 'px'}"
		:show-scrollbar="showScrollbar" 
		:bounce="bounce"
		:scrollable="true"
		:loadmoreoffset="50"
		:offset-accuracy="15"
		@scroll="scroll"
		@loadmore="$emit('loadmore')"
	>
		<refresh v-if="hasRefresh" ref="refresh" @refresh="onrefresh" @pullingdown="onpullingdown" :display="isRefresh ? 'show' : 'hide'">
			<view 
				style="justify-content: center;align-items: center;flex-direction: row;flex-wrap: nowrap;" 
				:style="{'width': width + 'px', 'height': maxPullingDistance + 'px'}"
			>
				<loading-indicator v-if="isRefresh" :animating="true" style="width: 20px;height: 20px;margin: 10px;" :style="{color: refreshTextColor}"></loading-indicator>
				<image class="refreshIcon" 
					:class="{'refreshIconActive': movedDistance >= refreshDistance}" 
					:style="{width: isRefresh || isTouchMove == false ? 0 : '26px', margin: isRefresh  || isTouchMove == false ? 0 : '7px'}" 
					:src="pullingIcon"
				>
				</image>
				
				<text :style="{color: refreshTextColor, fontSize: refreshTextFontSize, width: !isRefresh && isTouchMove == false ? 0 : '60px'}">{{refreshTip}}</text>
			</view>
		</refresh>
	<!-- #endif -->
		<!-- #ifndef APP-NVUE -->
		<fk-list 
			ref="fk-list"
			:height="height"
			:width="width"
			:hasRefresh="hasRefresh"
			:pullingIcon="pullingIcon"
			:refreshingIcon="refreshingIcon"
			:bounce="bounce"
			:showScrollbar="showScrollbar"
			:maxPullingDistance="maxPullingDistance"
			:refreshDistance="refreshDistance"
			:refreshTextColor="refreshTextColor"
			:refreshTextFontSize="refreshTextFontSize"
			:tips="tips"
			:isRefresh="isRefresh" 
			@refreshing="$emit('refreshing')"
			@dragingDown="$emit('dragingDown')" 
			@dragingUp="$emit('dragingUp')"
			@loadmore="$emit('loadmore')"
		>
			<fk-cell>
				<view style="flex-direction: row;justify-content: space-between;">
					<view :style="{width: columnWidth + 'px'}" v-for="columnNum in columnCount" :key="columnNum">
						<!-- <text style="color: #007AFF;">{{columnNum}}</text> -->
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
		<cell ref="topElement"></cell>
		<cell v-for="(url,index) in urlList" :key="index+url" :style="{width: columnWidth + 'px'}">
			<fk-image :limitWidth="columnWidth" :src="url+'?x-oss-process=image/resize,h_600,w_600'" @loadSuccess="loadSuccess"></fk-image>
		</cell>
	</waterfall>
	<!-- #endif -->
	
</template>

<script>
	// #ifdef APP-NVUE
	const dom = uni.requireNativePlugin('dom') // 在APP端引入weex的dom组件
	// #endif
	
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
			hasRefresh: {
				type: Boolean,
				default() {
					return true
				}
			},
			pullingIcon: {
				type: String,
				default() {
					return "/static/pullingDown.png"
				}
			},
			refreshingIcon: {
				type: String,
				default() {
					return "/static/refreshing.png"
				}
			},
			showScrollbar: {
				type: Boolean,
				default() {
					return false
				}
			},
			bounce: {
				type: Boolean,
				default() {
					return true
				}
			},
			maxPullingDistance: {
				type: Number,
				default() {
					return 60
				}
			},
			refreshDistance: {
				type: Number,
				default() {
					return 55
				}
			},
			refreshTextColor: {
				type: String,
				default() {
					return "#ffffff"
				}
			},
			refreshTextFontSize: {
				type: String,
				default() {
					return '12px'
				}
			},
			'isRefresh': {
				type: Boolean,
				default: false
			},
			tips: {
				type: Object,
				default() {
					return {
						'notSatisfied': '下拉刷新',
						'satisfied': '释放刷新',
						'release': '正在刷新..'
					}
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
				urlCount: 0,
				loadedCount: 0,
				isTouchMove: false,
				movedDistance: 0,
				dragingUp: false,
				dragingDown: false
			};
		},
		created() {
					
		},
		mounted() {
			// ** 以下代码必须放在mounted钩子上，在created中H5正常，但MP小程序会无法正确读取列宽等信息 **
			// 初始化瀑布流的列宽
			this.columnWidth = this.width / this.columnCount
			// 统计url的总数
			this.urlCount = this.urlList.length
			// #ifndef APP-NVUE
			// 非APP端的额外实现
			// 初始化瀑布流各列的图片列表为空，各列初始高度为0
			for(var i = 0; i < this.columnCount; i++){
				this.$set(this.columnInfo.url,'column'+i,[])
				this.$set(this.columnInfo.height,i,0)
			}
			this.setWaterfall(this.urlList)
			// #endif	
		},
		watch: {
			// #ifndef APP-NVUE
			urlList: async function(newUrlList,oldUrlList) {
				this.urlCount = this.urlList.length
				var urlList = this.urlList.slice(this.loadedCount,newUrlList.length)
				await this.setWaterfall(urlList)
			}
			// #endif
		},
		methods: {
			async setWaterfall (urlList) {
				for(var i = 0; i < urlList.length; i++){
					await this.getImageInfo(urlList[i])
				}
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
				var newArray = this.columnInfo.url['column'+minHeightColumnIndex]
				newArray.push(e.url)
				this.$set(this.columnInfo.url,'column'+minHeightColumnIndex,newArray)
				var newHeight = this.columnInfo.height[minHeightColumnIndex] + e.height
				this.$set(this.columnInfo.height,minHeightColumnIndex,newHeight)
				
				// #endif
				this.loadedCount += 1
			},
			backToTop: function() {
				// #ifdef APP-NVUE
				let topElement = this.$refs['topElement']
				dom.scrollToElement(topElement, {
					offset: 0,
					animated: true
				})
				// #endif
				
				// #ifndef APP-NVUE
				this.$refs['fk-list'].backToTop()
				// #endif
			},
			detectScrollAction: function(e) {
				let deltaY = 0 
				// #ifdef APP-NVUE
				this.isTouchDown = e.isDragging
				// NVUE下使用的<list>组件的@scroll事件，其Y轴变化量没给出，需要自行计算
				if(this.isTouchDown == true) {
					deltaY = e.contentOffset.y - this.latestY
					this.latestY = e.contentOffset.y
				}
				// #endif
				
				// #ifndef APP-NVUE
				// 非NVUE下使用的<scroll-view>组件，其Y轴变化量已给出，直接获取
				deltaY = e.detail.deltaY
				// #endif
				
				// console.log(deltaY)/* 
				if(this.isTouchDown == true && deltaY > 10) {
					if(this.dragingDown !== true) {
						this.$emit('dragingDown')
						this.dragingDown = true
						this.dragingUp = false
						console.log("向下拖动")
					}
				}
				if(this.isTouchDown == true && deltaY < -30) {
					if(this.dragingUp !== true) {
						this.$emit('dragingUp')
						this.dragingUp = true
						this.dragingDown = false
						console.log("向上拖动")
					}
				}
			},
			detectRefresh: function() {
				// 非APP端，判断下拉程度，设置图标动态旋转角度
				// #ifndef APP-NVUE
				if(this.movedDistance > this.refreshDistance * 0.718){
					this.rotateDegree = Math.min((this.movedDistance - this.refreshDistance * 0.718) / (this.refreshDistance * (1 - 0.718)) * 180, 179.99)
				}
				else{
					this.rotateDegree = 0
				}
				// #endif
				
				// 判断是否满足刷新条件
				if(this.movedDistance >= this.refreshDistance){
					this.refreshTip = this.tips.satisfied
				}
				else {
					this.refreshTip = this.tips.notSatisfied
				}
			},
			scroll: function(e) {
				this.detectScrollAction(e)
				
				// #ifndef APP-NVUE
				// 同步PC端下鼠标点摁触摸的滚动和滚轮的滚动状态
				// #ifdef H5
				this.scrollTop = e.detail.scrollTop
				// #endif
				
				if(e.detail.scrollTop <= 4){
					this.isTop = true
				}
				else{
					if(this.isTop){
						this.isTop = false
					}
					if(this.isBottom){
						this.isBottom = false
					}
				}
				// #endif
			},
			touchend: function() {
				// #ifdef APP-NVUE
				this.movedDistance = 0
				// #endif
				
				this.isTouchDown = false
				this.isTouchMove = false
				this.isFirst = true
				
				if(this.refreshTip == this.tips.satisfied){
					this.refreshTip = this.tips.release
					this.$emit("refreshing")
				}
				else{
				}
			},
			// nvue下释放刷新也转到touchend
			onrefresh: function(e) {
				console.log(e)
				this.touchend()
			},
			onpullingdown: function(e) {
				this.refreshDistance = e.viewHeight
				this.movedDistance = e.pullingDistance
				this.isTouchMove = true
				this.detectRefresh()
			}
		}
	}
</script>

<style scoped>
	.refreshIcon {
		width: 26px;
		height: 26px;
		margin: 7px; 
		transition-duration: 200ms;
		transition-property: transform;
		transform: rotate(0deg); 
		transform-origin: 13px 13px;
	}
	.refreshIconActive {
		transform: rotate(180deg);
	}
</style>

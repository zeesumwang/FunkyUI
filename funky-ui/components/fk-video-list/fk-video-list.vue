<template>
	<!-- #ifdef APP-NVUE -->
	<list :pagingEnabled="true" @scrollend="listScrollEnd" :show-scrollbar="false">
		<cell 
			v-for="(video,index) in videoData"
			:key="index"
		>
	<!-- #endif -->
	
	<!-- #ifndef APP-NVUE -->
	<swiper :circular="true" :vertical="true" :style="{'width': screenWidthPx + 'px','height': screenHeightPx + 'px'}" @transition="transition" @change="swiperChange" @animationfinish="swiperAnimationfinish">
		<swiper-item
			v-for="(video,index) in videoDataRecycle"
			:key="index"
		>
	<!-- #endif -->	
			
			<!-- #ifdef APP-NVUE -->
			<fk-video
				:videoId="'video'+index"
				:width="screenWidthPx"
				:height="screenHeightPx"
				:src="video.url"
				:poster="video.cover"
				:isPlay="(index == currentVideo) && isAnimationfinish && isPlay"
			/>
			<!-- #endif -->
			
			<!-- #ifndef APP-NVUE -->
			<fk-video
				:videoId="'video'+index"
				:width="screenWidthPx"
				:height="screenHeightPx"
				:src="video.url"
				:poster="video.cover"
				:isPlay="(index == currentVideoRecycle) && isAnimationfinish && isPlay"
			/>
			<!-- #endif -->
			
		
	<!-- #ifndef APP-NVUE -->
		</swiper-item>
	</swiper>
	<!-- #endif -->
		
	<!-- #ifdef APP-NVUE -->
		</cell>
	</list>
	<!-- #endif -->
	
</template>

<script>
	import screenInfo from "@/common/helper.js"
	
	export default {
		name: "fkVideoList",
		props: {
			videoData: {
				type: Array,
				default() {
					return[]
				}
			},
			isPlay: {
				type: Boolean,
				default: false
			},
			loadmoreoffset: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				screenHeightPx: 0,
				screenWidthPx: 0,
				currentVideo: 0,
				currentVideoRecycle: 0,
				lastPlayVideo: 0,
				nextVideo: 0,
				preVideo: 0,
				isAnimationfinish: true,
				videoDataRecycle: [],
				isTop: true,
				isBottom: false,
				moveY: 0
			};
		},
		created() {
			this.screenHeightPx = screenInfo.screenHeightPx
			this.screenWidthPx = screenInfo.screenWidthPx
			if(this.videoData.length >= 3) {
				this.videoDataRecycle = this.videoData.slice(0,3)
			}
			else{
				this.videoDataRecycle = this.videoData
			}
			// console.log(this.videoData.length)
		},
		methods: {
			listScrollEnd: function(e) {
				let videoCount = this.videoData.length
				let currentVideo = Math.abs(e.contentOffset.y) / e.contentSize.height * videoCount
				if(currentVideo !== this.currentVideo){
					this.currentVideo = currentVideo
					this.videoChange()
				}
			},
			swiperChange: function(e) {
				let action = ''
				if(e.detail.current > this.currentVideoRecycle) {
					if(e.detail.current == 2 && this.currentVideoRecycle == 0){
						action = 'sub'
					}
					else{
						action = 'add'
					}					
				}
				else{
					if(e.detail.current == 0 && this.currentVideoRecycle == 2) {
						action = 'add'
					}
					else{
						action = 'sub'
					}
				}
				if(action == 'sub') {
					this.currentVideo -= 1
					this.nextVideo = this.currentVideo + 1
					this.preVideo = Math.max(this.currentVideo - 1,0)
				}
				else if(action == 'add') {
					this.currentVideo += 1
					this.nextVideo = this.currentVideo + 1
					this.preVideo = Math.max(this.currentVideo - 1,0)
				}
				else {
					throw Error
				}
				this.currentVideoRecycle = e.detail.current
				this.isAnimationfinish = false
				// console.log(this.currentVideoRecycle,this.preVideo,this.currentVideo,this.nextVideo)
				this.videoChange()
			},
			swiperAnimationfinish: function() {
				this.isAnimationfinish = true
				this.lastPlayVideo = this.currentVideo
			},			
			videoChange: function() {
				// #ifndef APP-NVUE
				let preIndex = this.currentVideoRecycle - 1
				let nextIndex = this.currentVideoRecycle + 1
				if(this.currentVideoRecycle == 0){
					preIndex = 2
				}
				if(this.currentVideoRecycle == 2){
					nextIndex = 0
				}
				
				if(this.nextVideo < this.videoData.length - this.loadmoreoffset){
					this.videoDataRecycle[preIndex] = this.videoData[this.preVideo]
					this.videoDataRecycle[nextIndex] = this.videoData[this.nextVideo]
					this.isBottom = false
				}
				else{
					this.isBottom = true
					this.$emit('loadmore')
					// console.log('bottom')
				}
				
				if(this.preVideo == this.currentVideoRecycle && this.currentVideo == 0){
					this.isTop = true
					this.$emit('reachTop')
					// console.log('top')
				}
				else{
					this.isTop = false
				}
				
				// #endif
				this.$emit('videoChange',{'currentVideo': this.currentVideo,'videoCount': this.videoData.length})
			},
			transition: function(e) {
				if(this.isTop){
					console.log(this.lastPlayVideo)
					if(this.lastPlayVideo > 0){
						this.swiperAnimationfinish()
					}
					if(e.detail.dy < 0 && this.videoDataRecycle.length !== 1) {
						this.videoDataRecycle = this.videoDataRecycle.slice(0,1)
						
					}
					else if(e.detail.dy > 0){
						this.videoDataRecycle = this.videoData.slice(0,3)
					}
					else{
						// console.log(e.detail.dy,this.currentVideo,this.lastPlayVideo)
					}
				}
			}
		}
	}
</script>

<style>

</style>

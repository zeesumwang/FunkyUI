<template>
	<!-- #ifdef APP-NVUE -->
	<list :pagingEnabled="true" @scrollend="listScrollEnd" :show-scrollbar="false">
		<cell 
			v-for="(video,index) in videoData"
			:key="index"
		>
	<!-- #endif -->
	
	<!-- #ifndef APP-NVUE -->
	<swiper :circular="true" :vertical="true" :style="{'width': screenWidthPx + 'px','height': screenHeightPx + 'px'}" @change="swiperChange" @animationfinish="swiperAnimationfinish">
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
			}
		},
		data() {
			return {
				screenHeightPx: 0,
				screenWidthPx: 0,
				currentVideo: 0,
				currentVideoRecycle: 0,
				nextVideo: 0,
				preVideo: 0,
				isAnimationfinish: true,
				videoDataRecycle: [],
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
			// console.log(this.videoDataRecycle.length)
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
				console.log(this.currentVideo)
				this.currentVideoRecycle = e.detail.current
				this.isAnimationfinish = false
				this.videoChange()
			},
			swiperAnimationfinish: function(e) {
				this.isAnimationfinish = true
			},			
			videoChange: function() {
				// #ifndef APP-NVUE
				
				if(this.videoData.length > 3 && this.nextVideo > 2){
					this.videoDataRecycle[0] = this.videoData[this.nextVideo]
				}
				// #endif
				
				this.$emit('videoChange',{'currentVideo': this.currentVideo,'videoCount': this.videoData.length})
			},
		}
	}
</script>

<style>

</style>

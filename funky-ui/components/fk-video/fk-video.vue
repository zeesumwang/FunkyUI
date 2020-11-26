<template>
	<view style="justify-content: center;align-items: center;flex: 1;display: flex;" :style="{'width': width + 'px','height': height + 'px'}" >
		
		<!-- #ifdef APP-NVUE -->
		<image
			v-if="poster!=='' && !isPlay && !isVideoLoad"
			:src="poster" 
			:style="{'width': width + 'px','height': imageHight + 'px'}" 
			@load="imageLoad"
		/>
		<!-- #endif -->
		
		<!-- #ifndef APP-NVUE -->
		<fk-transition
			v-if="poster!==''"
			:backgroundColor="'#000000'" 
			:show="!isPlay && poster!==''" 
			:styles="{'width': width + 'px','height': height + 'px','justify-content':'center','align-items':'center'}" 
			:duration="300" 
			:mode-class="['fade','zoom-out']"
		>
			<image
				:src="poster" 
				:style="{'width': width + 'px','height': imageHight + 'px'}" 
				@load="imageLoad"
			/>
		</fk-transition>
		
		<!-- #endif -->
	
	
		<!-- #ifdef APP-NVUE -->
		<video
			:id="videoId"
			:style="{'width': width + 'px','height': (isPlay ? height : 0) + 'px'}" 
			:src="src"
			:autoplay="false" 
			:loop="true"
			:show-loading="true"
			:show-progress="false"
			:show-fullscreen-btn="false"
			:show-play-btn="false"
			:enable-progress-gesture="false"				
			:controls="false"
			@play="play"
			@waiting="waiting"
			@pause="pause"
		/>
		<!-- #endif -->
		
		
		<!-- #ifdef MP -->
		<video
			v-if="isPlay"
			:id="videoId"
			:style="{'width': width + 'px','height': height + 'px'}" 
			:src="src"
			:autoplay="true" 
			:loop="true"
			:show-progress="false"
			:show-fullscreen-btn="false"
			:show-play-btn="false"
			:enable-progress-gesture="false"				
			:controls="false"
			@play="play"
		/>
		<!-- #endif -->
		
		
		<!-- #ifdef H5 -->
		<video
			:id="videoId"
			:style="{'width': width + 'px','height': (poster == '' ? height : poster !== '' && isPlay ? height : 0) + 'px'}" 
			:src="src"
			:autoplay="false" 
			:loop="true"
			:show-progress="false"
			:show-fullscreen-btn="false"
			:show-play-btn="false"
			:enable-progress-gesture="false"				
			:controls="false"
			@play="play"
			@loadedmetadata="loadedmetadata"
		/>
		<!-- #endif -->
		
	</view>
</template>

<script>
	export default {
		props: {
			videoId: {
				type: String,
				default: ''
			},
			src: {
				type: String,
				default: ''
			},
			poster: {
				type: String,
				default: ''
			},
			height: {
				type: Number,
				default: 150
			},
			width: {
				type: Number,
				default: 150
			},
			isPlay: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				imageHight: 0,
				isVideoLoad: false
			}
		},
		watch:  {
			isPlay: function(val) {
				// console.log(this.videoId,val)
				if (val === false) {
					uni.createVideoContext(this.videoId).pause();
				} else {
					uni.createVideoContext(this.videoId).play();
				}
			}
		},
		methods: {
			imageLoad: function(e) {
				this.imageHight = this.width / e.detail.width * e.detail.height
			},
			play: function(e) {
				this.isVideoLoad = true
			},
			waiting: function(e) {
			},
			pause: function(e) {
				this.isVideoLoad = false
			},
			loadedmetadata: function(e) {
				this.isVideoLoad = true
			}
		}
	}
</script>

<style>

</style>

<template>
	<view style="justify-content: center;align-items: center;flex: 1;display: flex;" :style="{'width': width + 'px','height': height + 'px'}" >
		
		<!-- #ifdef APP-NVUE -->
		<fk-transition
			:backgroundColor="'#000000'" 
			:show="isShowPoster && poster!==''" 
			:styles="{'width': width + 'px','height': height + 'px','justify-content':'center','align-items':'center'}" 
			:duration="200" 
			:mode-class="['fade', 'zoom-out']"
		>
			<image
				:src="poster" 
				:style="{'width': width + 'px','height': imageHight + 'px'}" 
				@load="imageLoad"
			/>
		</fk-transition>
		<!-- #endif -->
		
		<!-- #ifndef APP-NVUE -->
		<fk-transition
			v-if="poster!==''"
			:backgroundColor="'#000000'" 
			:show="!isPlay && poster!==''" 
			:styles="{'width': width + 'px','height': height + 'px','justify-content':'center','align-items':'center'}" 
			:duration="200" 
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
			:ref="videoId"
			style="position: absolute;"
			:style="{'width': width + 'px','height': (isPlay && !isShowPoster ? height : 0) + 'px'}" 
			:src="src"
			:autoplay="false" 
			:loop="true"
			:show-loading="false"
			:show-progress="false"
			:show-fullscreen-btn="false"
			:show-play-btn="false"
			:enable-progress-gesture="false"				
			:controls="false"
			@play="play"
			@loadedmetadata="loadedmetadata"
			@waiting="waiting"
			@pause="pause"
			@timeupdate="timeupdate"
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
			@loadedmetadata="loadedmetadata"
			@waiting="waiting"
			@pause="pause"
			@timeupdate="timeupdate"
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
			@waiting="waiting"
			@pause="pause"
			@timeupdate="timeupdate"
		/>
		<!-- #endif -->
		
		<!-- #ifndef APP-NVUE -->
		<fk-loading :show="!isVideoLoad" style="position: absolute;opacity: 0.618;"></fk-loading>
		<!-- #endif -->
		
		
		<!-- <slot :name="videoId"></slot> -->
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
			},
		},
		data() {
			return {
				imageHight: 0,
				isVideoLoad: false,
				isShowPoster: true,
				waitCount: 0
			}
		},
		watch:  {
			isPlay: function(val) {
				// console.log(this.videoId,val)
				if (val === false) {
					uni.createVideoContext(this.videoId).pause()
					this.isShowPoster = true
				} else {
					// console.log(this.isShowPoster)
					if(this.poster == ''){
						uni.createVideoContext(this.videoId).play();
					}
					else{
						// #ifndef APP-NVUE
						setTimeout(()=> {this.isShowPoster = false;uni.createVideoContext(this.videoId).play();}, 200)
						// #endif
						// #ifdef APP-NVUE
						this.isShowPoster = false
						uni.createVideoContext(this.videoId).play()
						// #endif
					}				
				}
			}
		},
		methods: {
			imageLoad: function(e) {
				this.imageHight = this.width / e.detail.width * e.detail.height
			},
			play: function(e) {
				// console.log(this.isVideoLoad)
				// console.log(this.videoId,e)
			},
			waiting: function(e) {
				this.waitCount += 1
				// console.log('缓冲次数:',this.waitCount)
				if(this.isVideoLoad == true && this.waitCount>1){
					this.isVideoLoad = false
				}
				// console.log(this.videoId,e)
			},
			timeupdate: function(e) {
				if(this.isVideoLoad == false){
					this.isVideoLoad = true
				}
			},
			pause: function(e) {
				// this.isVideoLoad = false
			},
			loadedmetadata: function(e) {
				this.$emit('loadedmetadata',e)
			}
		}
	}
</script>

<style scoped>

</style>

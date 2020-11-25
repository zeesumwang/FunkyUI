<template>
	<scroll-view :pagingEnabled="true" :scroll-y="true">
		<view 
			v-for="(video,index) in video_data"
			:key="index"
		>
		
			<video
				:autoplay="false" 
				:show-progress="false"
				:show-fullscreen-btn="false"
				:show-play-btn="false"
				:style="{'width': screenWidthPx + 'px','height': screenHeightPx + 'px'}" 
				:src="video.url"
			>
			</video>
		
		</view>
	</scroll-view>
</template>

<script>
	import screenInfo from "@/common/helper.js"
	
	export default {
		name: "fkVideoList",
		props: {
			video_data: {
				type: Array,
				default() {
					return[]
				}
			}
		},
		data() {
			return {
				screenHeightPx: 0,
				screenWidthPx: 0
			};
		},
		created() {
			this.screenHeightPx = screenInfo.screenHeightPx
			this.screenWidthPx = screenInfo.screenWidthPx
		},
		methods: {
			apear: function(e) {
				console.log(e)
			}
		}
	}
</script>

<style>

</style>

<template>
	<view style="justify-content: center;align-items: center;">
		<image :style="{'width': limitWidth + 'px','height': height + 'px'}" :src="src" @load="loadSuccess" @error="loadError" referrerPolicy="no-referrer" :mode="mode">
		</image>
		<text v-if="loadStatus=='loading'" style="position: absolute;color: #FFFFFF;text-align: center;" :style="{width: limitWidth + 'px'}">{{loadTips.loading}}</text>
		<text v-if="loadStatus=='loadFail'" style="position: absolute;color: #FFFFFF;text-align: center;" :style="{width: limitWidth + 'px'}">{{loadTips.loadFail}}</text>
	</view>
	
</template>

<script>
	export default {
		name: "fkImage",
		props:{
			src: {
				type: String,
				default: ''
			},
			limitWidth: {
				type: Number,
				default: 168
			},
			mode: {
				type: String,
				// #ifdef APP-NVUE
				default: 'aspectFit',
				// #endif
				// #ifndef APP-NVUE
				default: 'scaleToFill'
				// #endif
			},
			loadTips: {
				type: Object,
				default() {
					return {
						'loading': '加载中..',
						'loadFail': '加载失败'
					}
				}
			}
		},
		data() {
			return {
				height: 0,
				loadStatus: 'loading'
			};
		},
		methods: {
			scale: async function(e) {
				if(this.limitWidth == 0){
					this.height = e.detail.height
				}
				else{
					this.height = e.detail.height * this.limitWidth / e.detail.width
				}
			},
			loadSuccess: async function(e) {
				this.loadStatus = "loadSuccess"
				await this.scale(e)
				this.$emit('loadSuccess',{'height': this.height,'url': this.src})
			},
			loadError: function(e) {
				this.loadStatus = "loadFail"
				this.$emit('loadError',e)
			}
		}
	}
</script>

<style>

</style>

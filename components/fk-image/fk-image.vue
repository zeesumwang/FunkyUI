<template>
	<view style="justify-content: center;align-items: center;">
		<text v-if="height==0" style="color: #C0C0C0;position: absolute;">加载中..</text>
		<image :style="{'width': limitWidth + 'px','height': height + 'px'}" :src="src" @load="loadSuccess" @error="loadError" referrerPolicy="no-referrer" mode="aspectFit">
		</image>
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
				default: 137.5
			}
		},
		data() {
			return {
				height: 0
			};
		},
		methods: {
			scale: function(e) {
				if(this.limitWidth == 0){
					this.height = e.detail.height
				}
				else{
					this.height = e.detail.height * this.limitWidth / e.detail.width
				}
			},
			loadSuccess: function(e) {
				this.scale(e)
				this.$emit('loadSuccess',{'height': this.height,'url': this.src})
			},
			loadError: function(e) {
				this.$emit('loadError',e)
			}
		}
	}
</script>

<style>

</style>

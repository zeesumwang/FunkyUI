<template>
	<view>
		<image :style="{'width': limitWidth + 'px','height': height + 'px'}" :src="src" @load="loadSuccess" @error="loadError" referrerPolicy="no-referrer" :mode="mode">
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
				default: 168
			},
			mode: {
				type: String,
				default: 'scaleToFill'
			}			
		},
		data() {
			return {
				height: 168
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
				await this.scale(e)
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

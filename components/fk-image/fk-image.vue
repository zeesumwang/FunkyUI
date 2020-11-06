<template>
	<image :style="{'width': width + 'px','height': height + 'px'}" :src="src" @load="loadSuccess" @error="loadError" referrerPolicy="no-referrer" mode="aspectFit">
	</image>
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
				width: 0,
				height: 0
			};
		},
		methods: {
			scale: function(e) {
				if(this.limitWidth == 0 || this.limitWidth >= e.detail.width){
					this.width = e.detail.width
					this.height = e.detail.height
				}
				else{
					this.height = e.detail.height * this.limitWidth / e.detail.width
					this.width = this.limitWidth
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

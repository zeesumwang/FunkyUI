<template>
	<label>
		<image :style="{'width': width + 'px','height': height + 'px'}" :src="url" @load="loadSuccess" @error="loadError" />
	</label>
</template>

<script>
	export default {
		name: "fkImage",
		props:{
			url: {
				type: String,
				default: '@/static/default_img.png'
			},
			limitWidth: {
				type: Number,
				default: 0
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
				this.$emit('loadSuccess',e)
			},
			loadError: function(e) {
				this.$emit('loadError',e)
			}
		}
	}
</script>

<style>

</style>

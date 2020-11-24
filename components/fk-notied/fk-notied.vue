<template>
	<fk-transition :blurEffect="'none'" :backgroundColor="backgroundColor" :opacity="opacity" :duration="200"
	 :mode-class="['fade','slide-top','zoom-in']" :styles="transfromClass" :show="isNotied">
		<text>{{msg}}</text>
	</fk-transition>
</template>

<script>
	export default {
		props: {
			isNotied: {
				type: Boolean,
				default: false
			},
			msg: {
				type: String,
				default: "展示通知"
			},
			backgroundColor: {
				type: String,
				default: ""
			},
			opacity: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				transfromClass: {
					'position': 'fixed',
					/* #ifndef APP-NVUE */
					'display': 'flex',
					/* #endif */
					'justifyContent': 'center',
					'alignItems': 'center',
					'borderRadius': '50px',
					'top': '0px',
					'height': '150px',
					'marginLeft': 'auto',
					'marginRight': 'auto'
				}
			};
		}
	}
</script>

<style>

</style>

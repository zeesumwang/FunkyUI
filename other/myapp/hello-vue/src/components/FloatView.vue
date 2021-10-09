<template>
  <div
    @touchstart.stop="touchstart"
    @touchmove.stop="touchmove"
    @touchend.stop="touchend"
    @longpress="longpress"
    @click="longpress"
    :style="{
      left: left + 'px',
      top: top + 'px',
      width: width + 'px',
      height: height + 'px',
      transitionPropery: transitionPropery,
      transitionDuration: transitionDuration,
      transitionDelay: transitionDelay,
      transitionTimingFunction: transitionTimingFunction
    }"
  >
    <slot></slot>
    <input v-show="isEdit" :value="transitionTimingFunction">
  </div>
</template>

<script>

export default {
  name: "FloatView",
  props: {
    width: {
      default: 40,
    },
    height: {
      default: 40,
    },
    initPosition: {
      default: {
        left: 10,
        top: 100,
      },
    },
    transitionTimingFunction: {
      default: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    },
  },
  data() {
    return {
      isEdit: false,
      left: 0,
      top: 0,
      biasX: 0,
      biasY: 0,
      transitionPropery: 'left',
      transitionDuration: null,
      transitionDelay: '0ms',
    };
  },
  created() {
    this.left = this.initPosition.left;
    this.top = this.initPosition.top;
  },
  methods: {
    touchstart(e) {
      this.transitionDuration = '0ms';
      this.biasX = e.touches[0].clientX - this.left;
      this.biasY = e.touches[0].clientY - this.top;
    },
    touchmove(e) {
      this.left = e.touches[0].clientX - this.biasX;
      this.top = e.touches[0].clientY - this.biasY;
    },
    touchend() {
      this.transitionDuration = '250ms';
      if (this.left + this.width * 0.5 > screen.availWidth * 0.5) {
        this.left = screen.availWidth - (this.initPosition.left + this.width);
      } else {
        this.left = this.initPosition.left;
      }
    },
    longpress() {
      if (this.isEdit) {
        this.isEdit = false;
      } else {
        this.isEdit = true;
      }
    }
  }
};
</script>

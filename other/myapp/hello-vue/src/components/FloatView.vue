<template>
  <div
    @touchstart.stop="touchstart"
    @touchmove.stop="touchmove"
    @touchend.stop="touchend"
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
  </div>
</template>

<script>

export default {
  name: "FloatView",
  props: {
    moveable: {
      default: true
    },
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
    actionDuration: {
      default: 250,
    },
    moveAction: {
      type: Function,
    }
  },
  data() {
    return {
      left: 0,
      top: 0,
      biasX: 0,
      biasY: 0,
      transitionPropery: 'left',
      transitionDuration: null,
      transitionDelay: '0ms',
      isDrag: false,
    };
  },
  created() {
    this.left = this.initPosition.left;
    this.top = this.initPosition.top;
  },
  methods: {
    touchstart(e) {
      if (!this.moveable) {
        return
      }
      this.isDrag = true;
      this.transitionDuration = '0ms';
      this.biasX = e.touches[0].clientX - this.left;
      this.biasY = e.touches[0].clientY - this.top;
    },
    touchmove(e) {
      if (!this.moveable) {
        return
      }
      if (!this.isDrag) {
        return
      }
      this.left = e.touches[0].clientX - this.biasX;
      this.top = e.touches[0].clientY - this.biasY;
    },
    touchend() {
      if (!this.moveable) {
        return
      }
      this.isDrag = false;
      this.transitionDuration = this.actionDuration + 'ms';
      this.moveAction(this);
    },
  }
};
</script>

<template>
  <div
    :style="{ display: 'flex', flexDirection: 'column' }"
    @pan="pan"
    @swipe="swipe"
  >
    <div :style="style.home">
      <div v-for="item in list" :key="item" :style="style.info">
        <img src="https://www.python.org/static/img/python-logo.png" />
      </div>
    </div>
    <float-view
      :style="{
        position: 'fixed',
        borderRadius: '45px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'solid',
        borderWidth: '2px',
        borderColor: '#fff',
        backgroundColor: 'pink'
      }"
      :transitionTimingFunction="transitionTimingFunction"
    >
      <div>1</div>
    </float-view>
    <float-view
      :style="{
        position: 'fixed',
        borderRadius: '45px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'solid',
        borderWidth: '2px',
        borderColor: '#fff',
        backgroundColor: 'pink'
      }"
      :transitionTimingFunction="'cubic-bezier(0.16, 1, 0.3, 1)'"
      :initPosition="{ left: 10, top: 160 }"
      :moveAction="action"
    >
      <div>2</div>
    </float-view>
    <float-view
      :style="{
        position: 'fixed',
        borderRadius: '45px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'solid',
        borderWidth: '2px',
        borderColor: '#fff',
        backgroundColor: 'pink'
      }"
      :transitionTimingFunction="'cubic-bezier(0.34, 1.56, 0.64, 1)'"
      :initPosition="{ left: 10, top: 220 }"
    >
      <div>3</div>
    </float-view>
  </div>
</template>

<script>
import FloatView from "./components/FloatView.vue";

export default {
  name: "App",
  components: {
    FloatView
  },
  data() {
    return {
      style: {
        home: {
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          left: "0px",
          top: "0px",
          overflow: "scroll",
          backgroundColor: "#932323",
          transition: "none"
        },
        info: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }
      },
      list: [],
      startX: 0,
      transitionTimingFunction: "ease-in-out"
    };
  },
  created() {
    for (let i = 0; i < 100; i++) {
      this.list.push(i);
    }
    this.style.home.height = screen.availHeight + "px";
    this.style.home.width = screen.availWidth + "px";
    console.log(screen.availWidth, screen.availHeight);
  },
  mounted() {},
  methods: {
    pan(e) {
      console.log(e);
    },
    swipe(e) {
      console.log(e);
    },
    touchstart(e) {
      this.startX = e.touches[0].clientX;
      this.style.home.transition = "none";
    },
    touchmove(e) {
      this.style.home.left = e.touches[0].clientX - this.startX + "px";
    },
    touchend() {
      this.style.home.transition = "all 500ms";
      this.style.home.left = 0 + "px";
    },
    action(e) {
      e = JSON.stringify(e);
      console.log(e);
      let action = new Function(e, "let e = JSON.parse(" + e +");console.log(e); ");
      action();
    },
    actionW(e) {
      console.log(e);
      if (e.left + e.width * 0.5 > screen.availWidth * 0.5) {
        e.left = screen.availWidth - (e.initPosition.left + e.width);
      } else {
        e.left = e.initPosition.left;
      }
    }
  }
};
</script>

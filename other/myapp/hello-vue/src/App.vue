<template>
  <div :style="editPageStyle" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">
    <float-view v-bind="mainConfig"> </float-view>
    <float-view v-bind="mainConfig"> </float-view>
    <float-view v-bind="floatButton"> </float-view>
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
      mainConfig: {
        styles: {
          backgroundColor: "grey",
          overflow: "scroll",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start"
        },
        height: screen.availHeight,
        width: screen.availWidth,
        moveable: false,
        children: []
      },
      //
      floatButton: {
        name: "floatButton",
        styles: {
          position: "absolute",
          borderRadius: "45px",
        },
        initPosition: {
          x: 10,
          y: 100
        },
        width: 40,
        height: 40,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        moveable: true,
        action: {
          clickAction: "console.log(e.$refs[e.name])",
          moveAction:
            "console.log(e);{if (e.x + e.width * 0.5 > screen.availWidth * 0.5) { e.x = screen.availWidth - (e.initPosition.x + e.width); } else { e.x = e.initPosition.x; }}"
        },
        children: [
          {
            styles: {
              position: "absolute",
              borderRadius: "45px",
              borderStyle: "solid",
              borderWidth: "2px",
              borderColor: "#fff",
              backgroundColor: "pink"
            },
            width: 40,
            height: 40,
            children: [
              {
                type: "text",
                value: "dev",
                style: {
                  color: "#fff"
                },
                initPosition: {
                  x: 5,
                  y: 5
                },
                width: 30,
                height: 30,
                moveable: false
              }
            ]
          },
          {
            styles: {
              position: "absolute",
              borderRadius: "45px",
              borderStyle: "solid",
              borderWidth: "2px",
              borderColor: "#fff",
              backgroundColor: "pink"
            },
            width: 40,
            height: 40,
            children: [
              {
                type: "text",
                value: "dev",
                style: {
                  color: "#fff"
                },
                initPosition: {
                  x: 5,
                  y: 5
                },
                width: 30,
                height: 30,
                moveable: false
              }
            ]
          },
        ]
      },
      editPageStyle: {
        overflowX: "scroll",
        display: "flex",
        flexDirection: "row",
        height: screen.availHeight + "px",
        width: screen.availWidth * 2 + "px",
        position: "fixed",
        left: "0px"
      },
      startX: 0,
      startTime: 0,
      duration: 0
    };
  },
  created() {
    for (let i = 0; i < 100; i++) {
      this.mainConfig.children.push({
        type: "img",
        value: "https://www.python.org/static/img/python-logo.png",
        width: screen.availWidth
      });
    }
  },
  mounted() {},
  methods: {
    touchstart(e) {
      console.log(e);
      this.startX = e.touches[0].clientX;
      this.duration = 0;
    },
    touchmove(e) {
      this.editPageStyle.left = e.touches[0].clientX - this.startX + "px";
    },
    touchend() {
      this.startTime = new Date().getTime();
      this.duration = 500;
      window.requestAnimationFrame(this.swiperAnimation())
    },
    swiperAnimation() {
      const progress = new Date().getTime() - this.startTime;
      this.editPageStyle.left = this.editPageStyle.left * (1 - progress / this.duration) + "px";
      if (progress < this.duration) {
        window.requestAnimationFrame(this.swiperAnimation());
      }
    }
  }
};
</script>

<template>
  <div
    class="v-pane"
    :class="classes"
    :style="{ width: width, height: height }"
  >
    <div class="v-resizer" data-resizer="data-resizer">
      <slot name="resizer"></slot>
    </div>
    <div class="content">
      <div class="innerContent">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pane',
  props: {
    initWidth: {
      type: String
    },
    initHeight: {
      type: String
    },
    classes: {
      type: String
    }
  },
  data() {
    return {
      width: undefined,
      height: undefined
    }
  },
  mounted() {
    this.width = this.initWidth
    this.height = this.initHeight
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}
.v-pane {
  position: relative;
  display: flex;
}
.v-pane.vertical {
  flex-direction: column;
}
.v-pane .v-resizer {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #616161;
}
.v-pane.vertical > .v-resizer {
  width: 100%;
  cursor: row-resize;
  background: linear-gradient(#9d9d9d, #9d9d9d) 50% calc(50% - 4px) / 40px 3px
      no-repeat,
    linear-gradient(#9d9d9d, #9d9d9d) 50% calc(50% + 4px) / 40px 3px no-repeat,
    #616161;
  border-top: 1px solid #4a4c52;
  border-bottom: 1px solid #202125;
}
.v-pane.horizontal > .v-resizer {
  height: 100%;
  cursor: col-resize;
  background: linear-gradient(#9d9d9d, #9d9d9d) calc(50% - 4px) 50% / 3px 40px
      no-repeat,
    linear-gradient(#9d9d9d, #9d9d9d) calc(50% + 4px) 50% / 3px 40px no-repeat,
    #616161;
  border-left: 1px solid #4a4c52;
  border-right: 1px solid #202125;
}
.v-pane:first-of-type .v-resizer {
  cursor: auto;
  background: #616161;
}
.v-pane.collapsed .v-resizer {
  background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(0, 0, 0, 0.2) 10px,
      rgba(0, 0, 0, 0.2) 20px
    ),
    #616161;
}
.v-pane .content {
  flex: 1;
  overflow: auto;
}
</style>

<template>
  <div class="pane">
    <div class="resizer" data-resizer="data-resizer">
      <div class="resizer-content">
        <slot name="resizer"></slot>
      </div>
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
  name: 'Pane'
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}
.pane {
  position: relative;
  display: flex;
}
.pane.vertical {
  flex-direction: column;
}
.pane .resizer {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e0e0e0;
}
.pane.vertical .resizer {
  background: linear-gradient(#696c74, #696c74) 50% calc(50% - 3px) / 35px 2px
      no-repeat,
    linear-gradient(#696c74, #696c74) 50% calc(50% + 3px) / 35px 2px no-repeat,
    #36393f;
  border-top: 1px solid #4a4c52;
  border-bottom: 1px solid #202125;
  height: 30px;
  width: 100%;
  cursor: row-resize;
}
.pane.horizontal .resizer {
  width: 30px;
  height: 100%;
  background: linear-gradient(#696c74, #696c74) calc(50% - 3px) 50% / 2px 35px
      no-repeat,
    linear-gradient(#696c74, #696c74) calc(50% + 3px) 50% / 2px 35px no-repeat,
    #36393f;
  border-left: 1px solid #4a4c52;
  border-right: 1px solid #202125;
  cursor: col-resize;
}
.pane:first-of-type .resizer {
  cursor: auto;
  background: #36393f;
}
.pane.collapsed .resizer {
  background: repeating-linear-gradient(
    45deg,
    #54565c,
    #54565c 10px,
    #444549 10px,
    #444549 20px
  );
}
.pane .content {
  flex: 1;
  overflow: auto;
}
.pane .content .innerContent {
  padding: 10px;
}
.pane .content {
  background: #c5c5c5;
}
</style>

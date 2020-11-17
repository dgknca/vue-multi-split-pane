

<template>
  <div id="app">
    <MultiSplitPane
      split="horizontal"
      height="400px"
      width="1000px"
      resizerWidth="30px"
      classes="v-pane-custom"
      @onPaneCollapsed="onPaneCollapsed"
      @onPaneExpanded="onPaneExpanded"
    >
      <Pane>
        <template v-slot:content>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consectetur,
          excepturi in dolores accusantium praesentium quidem laborum neque ut
          ipsum veritatis ratione rem, esse totam voluptates ullam nesciunt
          tempora architecto laudantium!
        </template>
      </Pane>
      <Pane>
        <template v-slot:content>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consectetur,
          excepturi in dolores accusantium praesentium quidem laborum neque ut
          ipsum veritatis ratione rem, esse totam voluptates ullam nesciunt
          tempora architecto laudantium!
        </template>
      </Pane>
      <Pane>
        <template v-slot:content>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consectetur,
          excepturi in dolores accusantium praesentium quidem laborum neque ut
          ipsum veritatis ratione rem, esse totam voluptates ullam nesciunt
          tempora architecto laudantium!
        </template>
      </Pane>
    </MultiSplitPane>

    <div style="margin-top:50px"></div>

    <MultiSplitPane
      height="400px"
      width="1000px"
      classes="v-pane-custom"
      @onPaneCollapsed="onPaneCollapsed"
      @onPaneExpanded="onPaneExpanded"
    >
      <Pane>
        <template v-slot:content>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consectetur,
          excepturi in dolores accusantium praesentium quidem laborum neque ut
          ipsum veritatis ratione rem, esse totam voluptates ullam nesciunt
          tempora architecto laudantium!
        </template>
      </Pane>
      <Pane>
        <template v-slot:content>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consectetur,
          excepturi in dolores accusantium praesentium quidem laborum neque ut
          ipsum veritatis ratione rem, esse totam voluptates ullam nesciunt
          tempora architecto laudantium!
        </template>
      </Pane>
      <Pane>
        <template v-slot:content>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consectetur,
          excepturi in dolores accusantium praesentium quidem laborum neque ut
          ipsum veritatis ratione rem, esse totam voluptates ullam nesciunt
          tempora architecto laudantium!
        </template>
      </Pane>
    </MultiSplitPane>

    <div style="margin-top:50px"></div>

    <MultiSplitPane
      split="horizontal"
      height="400px"
      width="1000px"
      resizerWidth="30px"
      :nested="true"
      classes="v-pane-custom"
      @onPaneCollapsed="onPaneCollapsed"
      @onPaneExpanded="onPaneExpanded"
    >
      <Pane>
        <template v-slot:content>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consectetur,
          excepturi in dolores accusantium praesentium quidem laborum neque ut
          ipsum veritatis ratione rem, esse totam voluptates ullam nesciunt
          tempora architecto laudantium!
        </template>
      </Pane>
      <Pane classes="paneNested">
        <template v-slot:content>
          <MultiSplitPane
            height="400px"
            resizerWidth="30px"
            classes="v-pane-custom"
            @onPaneCollapsed="onPaneCollapsed"
            @onPaneExpanded="onPaneExpanded"
          >
            <Pane>
              <template v-slot:content>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Consectetur, excepturi in dolores accusantium praesentium quidem
                laborum neque ut ipsum veritatis ratione rem, esse totam
                voluptates ullam nesciunt tempora architecto laudantium!
              </template>
            </Pane>
            <Pane>
              <template v-slot:content>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Consectetur, excepturi in dolores accusantium praesentium quidem
                laborum neque ut ipsum veritatis ratione rem, esse totam
                voluptates ullam nesciunt tempora architecto laudantium!
              </template>
            </Pane>
          </MultiSplitPane>
        </template>
      </Pane>
    </MultiSplitPane>
  </div>
</template>
<script>
import Vue from 'vue';
import { MultiSplitPane, Pane } from '@/entry'

export default {
  name: 'ServeDev',
  components: {
    MultiSplitPane,
    Pane
  },
  methods: {
    onPaneCollapsed(paneIndex, paneClasses, containerClasses) {
      console.log(
        `${paneIndex}. pane collapsed. Pane class: '${paneClasses}' MultiSplitPane class: '${containerClasses}'`
      )
    },
    onPaneExpanded(paneIndex, paneClasses, containerClasses) {
      console.log(
        `${paneIndex}. pane expanded. Pane class: '${paneClasses}' MultiSplitPane class: '${containerClasses}'`
      )
    }
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Fira+Code&display=swap');
body {
  font-family: 'Fira Code', monospace;
  background: #d8d1d9;
}

#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
}

@media screen and (max-width: 768px) {
  #app {
    padding: 0;
  }
}

.v-pane-custom .v-pane .content {
  background: #fff;
}
.v-pane-custom .content .innerContent {
  padding: 20px;
  line-height: 1.5;
}

.paneNested > .content > .innerContent {
  padding: 0;
}
</style>

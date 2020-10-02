<template>
  <div>
    <MultiSplitPane
      height="400px"
      @onPaneCollapsed="onPaneCollapsed"
      @onPaneExpanded="onPaneExpanded"
    >
      <Pane>
        <template v-slot:content>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consectetur,
          excepturi in dolores accusantium praesentium quidem laborum neque ut
          ipsum veritatis ratione rem, esse totam voluptates ullam nesciunt
          tempora architecto laudantium! Lorem, ipsum dolor sit amet consectetur
          adipisicing elit. Consectetur, excepturi in dolores accusantium
          praesentium quidem laborum neque ut ipsum veritatis ratione rem, esse
          totam voluptates ullam nesciunt tempora architecto laudantium! Lorem,
          ipsum dolor sit amet consectetur adipisicing elit. Consectetur,
          excepturi in dolores accusantium praesentium quidem laborum neque ut
          ipsum veritatis ratione rem, esse totam voluptates ullam nesciunt
          tempora architecto laudantium! Lorem, ipsum dolor sit amet consectetur
          adipisicing elit. Consectetur, excepturi in dolores accusantium
          praesentium quidem laborum neque ut ipsum veritatis ratione rem, esse
          totam voluptates ullam nesciunt tempora architecto laudantium! Lorem,
          ipsum dolor sit amet consectetur adipisicing elit. Consectetur,
          excepturi in dolores accusantium praesentium quidem laborum neque ut
          ipsum veritatis ratione rem, esse totam voluptates ullam nesciunt
          tempora architecto laudantium! Lorem, ipsum dolor sit amet consectetur
          adipisicing elit. Consectetur, excepturi in dolores accusantium
          praesentium quidem laborum neque ut ipsum veritatis ratione rem, esse
          totam voluptates ullam nesciunt tempora architecto laudantium!
        </template>
      </Pane>
      <Pane>
        <template v-slot:resizer>
          Resizer Slot
        </template>
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
  </div>
</template>

<script>
import MultiSplitPane from './components/MultiSplitPane.vue'
import Pane from './components/Pane'

export default {
  name: 'App',
  components: {
    MultiSplitPane,
    Pane
  },
  methods: {
    onPaneCollapsed(index) {
      console.log('onPaneCollapsed', index)
    },
    onPaneExpanded(index) {
      console.log('onPaneExpanded', index)
    }
  }
}
</script>

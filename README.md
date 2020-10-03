# Vue Multi Split Pane

A component based on Vue.js. Provides unlimited resizable multi pane support. Only provides vertical split for now.

## Demo

[Live Demo](https://vue-multi-split-pane.vercel.app/)

### Install

```bash
npm i vue-multi-split-pane
```

### Example

```js
import { MultiSplitPane, Pane } from 'vue-multi-split-pane'

export default {
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
```

```html
<MultiSplitPane
  split="horizontal"
  height="400px"
  resizerWidth="30px"
  @onPaneCollapsed="onPaneCollapsed"
  @onPaneExpanded="onPaneExpanded"
>
  <Pane>
    <template v-slot:content>
      Content 1
    </template>
  </Pane>
  <Pane>
    <template v-slot:resizer>
      You can send resizer slot also.
    </template>
    <template v-slot:content>
      Content 2
    </template>
  </Pane>
  <Pane>
    <template v-slot:content>
      Content 3
    </template>
  </Pane>
</MultiSplitPane>
```

## Props

| Prop         | Description                                                                  |        value         | default  |
| :----------- | :--------------------------------------------------------------------------- | :------------------: | :------: |
| split        | orientation of the MultiSplitPane                                            | vertical, horizontal | vertical |
| width        | width of the MultiSplitPane                                                  |        String        |   100%   |
| height       | height of the MultiSplitPane                                                 |        String        |   auto   |
| resizerWidth | width/height of the resizers. valid for horizontal and vertical orientation. |        String        |   30px   |
| classes      | classes of the MultiSplitPane                                                |        String        |   none   |

## Events

| Event                  | Description                                                         |
| :--------------------- | :------------------------------------------------------------------ |
| onPaneCollapsed(index) | Event will be fired when collapsed any pane. Used on MultiSplitPane |
| onPaneExpanded(index)  | Event will be fired when expanded any pane. Used on MultiSplitPane  |

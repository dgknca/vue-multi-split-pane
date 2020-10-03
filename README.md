# Vue Multi Split Pane

A component based on Vue.js. Provides unlimited multi pane support. Only provides vertical split for now.

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
  height="400px"
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

| Prop    | Description                   |  type  | required | default |
| :------ | :---------------------------- | :----: | :------: | :-----: |
| width   | width of the MultiSplitPane   | String |  false   |  100%   |
| height  | height of the MultiSplitPane  | String |   true   |  none   |
| classes | classes of the MultiSplitPane | String |  false   |  none   |

## Events

| Event                  | Description                                                         |
| :--------------------- | :------------------------------------------------------------------ |
| onPaneCollapsed(index) | Event will be fired when collapsed any pane. Used on MultiSplitPane |
| onPaneExpanded(index)  | Event will be fired when expanded any pane. Used on MultiSplitPane  |

## TODO

- Horizontal split

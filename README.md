# Vue Multi Split Pane

A component based on Vue.js. Provides unlimited resizable multi pane support.

## Demo

[Live Demo](https://vue-multi-split-pane.vercel.app/) | [Codesandbox](https://codesandbox.io/s/vue-multi-split-pane-7noiu?file=/src/App.vue) | [JSFiddle](https://jsfiddle.net/t6fr8s0m/) | [Codepen](https://codepen.io/dgknca/pen/wvzvbGY)

### Install

<a href="https://nodei.co/npm/vue-multi-split-pane/"><img src="https://nodei.co/npm/vue-multi-split-pane.png"></a>

```bash
npm i vue-multi-split-pane
```

### Browser

```html
<script src="https://unpkg.com/vue-multi-split-pane"></script>
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
    onPaneCollapsed(paneIndex, paneClass, containerClass) {
      console.log(
        `${paneIndex}. pane collapsed. Pane class: '${paneClass}' MultiSplitPane class: '${containerClass}'`
      )
    },
    onPaneExpanded(paneIndex, paneClass, containerClass) {
      console.log(
        `${paneIndex}. pane expanded. Pane class: '${paneClass}' MultiSplitPane class: '${containerClass}'`
      )
    }
  }
}
```

```html
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
    <template v-slot:resizer>
      resizer slot
    </template>
    <template v-slot:content>
      Content 1
    </template>
  </Pane>
  <Pane>
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

### Nested Pane Example

```html
<MultiSplitPane
  split="horizontal"
  height="400px"
  width="1000px"
  resizerWidth="30px"
  :nested="true"
  classes="v-pane-custom"
>
  <Pane>
    <template v-slot:content>
      Lorem, ipsum dolor sit amet consectetur adipisicing elit.
    </template>
  </Pane>
  <Pane classes="paneNested">
    <template v-slot:content>
      <MultiSplitPane
        height="400px"
        resizerWidth="30px"
        classes="v-pane-custom"
      >
        <Pane>
          <template v-slot:content>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
          </template>
        </Pane>
        <Pane>
          <template v-slot:content>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
          </template>
        </Pane>
      </MultiSplitPane>
    </template>
  </Pane>
</MultiSplitPane>
```

### Initial Width Example

Also `initHeight` props is available for vertical split.

```html
<MultiSplitPane
  split="horizontal"
  height="400px"
  width="1000px"
  resizerWidth="30px"
  classes="v-pane-custom"
>
  <Pane initWidth="75%">
    <template v-slot:content>
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consectetur,
      excepturi in dolores accusantium praesentium quidem laborum neque ut ipsum
      veritatis ratione rem, esse totam voluptates ullam nesciunt tempora
      architecto laudantium!
    </template>
  </Pane>
  <Pane initWidth="25%">
    <template v-slot:content>
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consectetur,
      excepturi in dolores accusantium praesentium quidem laborum neque ut ipsum
      veritatis ratione rem, esse totam voluptates ullam nesciunt tempora
      architecto laudantium!
    </template>
  </Pane>
</MultiSplitPane>
```

## Props

| Prop         | Description                                                                  |        value         |  default  |
| :----------- | :--------------------------------------------------------------------------- | :------------------: | :-------: |
| split        | Orientation of the MultiSplitPane                                            | vertical, horizontal | vertical  |
| width        | Width of the MultiSplitPane                                                  |        String        |   100%    |
| height       | Height of the MultiSplitPane                                                 |        String        |   auto    |
| resizerWidth | Width/height of the resizers. Valid for horizontal and vertical orientation. |        String        |   30px    |
| classes      | Custom class prop. Can be send to MultiSplitPane or Pane                     |        String        |   none    |
| :nested      | Will you use nested MultiSplitPane? Then should be true.                     |       Boolean        |   false   |
| initWidth    | Can be used to set initial width for specific Pane component.                |        String        | undefined |
| initHeight   | Can be used to set initial height for specific Pane component.               |        String        | undefined |

## Events

| Event                                                    | Description                                                         |
| :------------------------------------------------------- | :------------------------------------------------------------------ |
| onPaneCollapsed ( paneIndex, paneClass, containerClass ) | Event will be fired when collapsed any pane. Used on MultiSplitPane |
| onPaneExpanded ( paneIndex, paneClass, containerClass )  | Event will be fired when expanded any pane. Used on MultiSplitPane  |

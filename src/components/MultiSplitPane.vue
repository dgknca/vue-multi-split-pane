<template>
  <div
    ref="resizable"
    data-resizable="data-resizable"
    :style="{ height: height, 'max-width': width, display: display }"
    :class="[classes]"
  >
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'MultiSplitPane',
  props: {
    height: { type: String, required: true },
    width: { type: String, default: '100%' },
    classes: { type: String },
    split: { type: String, default: 'vertical' },
    resizerWidth: { type: String, default: '30px' }
  },
  data() {
    return {
      root: null,
      panes: [],
      resizers: [],
      fracs: [],
      pos: [],
      collapsedPanes: [],
      display: null
    }
  },
  methods: {
    setFracs(fracArray) {
      this.fracs = fracArray
      this.initPos()
      this.applyFracs()
    },
    getDistance(orientation) {
      if (orientation == 'horizontal') {
        return this.root.getBoundingClientRect().left
      } else {
        return this.root.getBoundingClientRect().top
      }
    },
    getDimension(orientation) {
      if (orientation == 'horizontal') {
        return this.root.clientWidth
      } else {
        return this.root.clientHeight
      }
    },
    getResizerDimension(orientation) {
      if (orientation == 'horizontal') {
        return this.resizers[0].offsetWidth
      } else {
        return this.resizers[0].offsetHeight
      }
    },
    addDragLogic(i, resizer) {
      if (i === 0) return // The first pane size can not be changed!

      let eDownFunc = eDown => {
        eDown.preventDefault()

        if (eDown.type == 'touchstart') eDown = eDown.touches[0]

        let shift

        this.split == 'horizontal'
          ? (shift = eDown.pageX - resizer.getBoundingClientRect().left)
          : (shift = eDown.pageY - resizer.getBoundingClientRect().top)

        let onMouseMove = eMove => {
          if (eMove.type == 'touchmove') eMove = eMove.touches[0]
          let coor = this.split == 'horizontal' ? eMove.pageX : eMove.pageY

          let numerator =
            coor -
            shift -
            this.getDistance(this.split) -
            this.getResizerDimension(this.split) * i
          let nominator =
            this.getDimension(this.split) -
            this.getResizerDimension(this.split) * this.panes.length

          let newPos = numerator / nominator

          if (newPos < 0) newPos = 0
          if (newPos > 1) newPos = 1

          this.updatePos(i, newPos)
          this.updateFracs()
          this.applyFracs()
        }

        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mouseup', () =>
          window.removeEventListener('mousemove', onMouseMove)
        )

        window.addEventListener('touchmove', onMouseMove)
        window.addEventListener('touchend', () =>
          window.removeEventListener('touchmove', onMouseMove)
        )
      }
      resizer.addEventListener('mousedown', eDownFunc)
      resizer.addEventListener('touchstart', eDownFunc)
    },
    initPos() {
      this.pos = []
      let cumulative = 0

      this.panes.forEach(pane => {
        if (this.split == 'horizontal') {
          pane.querySelector('.v-resizer').style.width = this.resizerWidth
          pane.classList.add('horizontal')
        } else {
          pane.querySelector('.v-resizer').style.height = this.resizerWidth
          pane.classList.add('vertical')
        }
      })

      for (let i = 0; i < this.fracs.length; i++) {
        this.pos.push(cumulative)
        cumulative += this.fracs[i]
      }
    },
    updatePos(resizerI, newPos) {
      if (newPos < this.pos[resizerI]) {
        for (let i = resizerI - 1; i >= 0; i--) {
          let iPos = this.pos[i]

          if (iPos < newPos) break
          else this.pos[i] = newPos
        }
      } else {
        for (let i = resizerI + 1; i < this.pos.length; i++) {
          let iPos = this.pos[i]

          if (iPos > newPos) break
          else this.pos[i] = newPos
        }
      }

      this.pos[resizerI] = newPos
    },
    updateFracs() {
      this.fracs = []
      for (let i = 0, j = 1; i < this.pos.length; i++, j++) {
        let iPos = this.pos[i]
        let jPos = j === this.pos.length ? 1 : this.pos[j]
        this.fracs.push(jPos - iPos)
      }
    },
    applyFracs() {
      let getStyleStr = frac => {
        let dim = this.split == 'horizontal' ? 'width' : 'height'

        return `
              ${dim}: calc((100% - ${this.panes.length *
          this.getResizerDimension(
            this.split
          )}px) * ${frac} + ${this.getResizerDimension(this.split)}px);
            `
      }

      this.panes.forEach((pane, i) => {
        let iFrac = this.fracs[i]
        if (iFrac === 0 && this.collapsedPanes[i] !== 1) {
          pane.classList.add('collapsed')
          this.collapsedPanes[i] = 1
          this.$emit('onPaneCollapsed', i)
        } else if (iFrac !== 0 && this.collapsedPanes[i] === 1) {
          pane.classList.remove('collapsed')
          this.collapsedPanes[i] = 0
          this.$emit('onPaneExpanded', i)
        }

        pane.setAttribute('style', getStyleStr(iFrac))
      })
    }
  },
  mounted() {
    this.split === 'horizontal'
      ? (this.display = 'flex')
      : (this.display = 'block')

    this.collapsedPanes.fill(0, 0, this.$slots.default.length)

    this.root = this.$refs.resizable

    // Looking for panes (direct children of root element)
    this.panes = this.root.querySelectorAll('[data-resizable] > *')

    // Looking for resizers
    this.resizers = this.root.querySelectorAll(
      '[data-resizable] > .v-pane > [data-resizer]'
    )

    // Calculating initial fracs and pos
    let initFrac = 1 / this.panes.length
    this.panes.forEach(() => this.fracs.push(initFrac))

    this.initPos()
    this.applyFracs()

    // Adding drag logic to resizers
    this.resizers.forEach((resizer, i) => this.addDragLogic(i, resizer))
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}
[data-resizable] {
  overflow: auto;
  border: 1px solid #e0e0e0;
  width: 100%;
}
</style>

<template>
  <div
    ref="resizable"
    data-resizable="data-resizable"
    :style="{ height: height, width: width }"
    :class="[classes]"
  >
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'MultiSplitPane',
  props: ['height', 'width', 'classes'],
  data() {
    return {
      root: null,
      panes: [],
      resizers: [],
      fracs: [],
      pos: []
    }
  },
  methods: {
    setFracs(fracArray) {
      this.fracs = fracArray
      this.initPos()
      this.applyFracs()
    },
    getTop() {
      return this.root.getBoundingClientRect().top
    },
    getHeight() {
      return this.root.clientHeight
    },
    getResizerHeight() {
      return this.resizers[0].offsetHeight
    },
    addDragLogic(i, resizer) {
      if (i === 0) return // The first pane size can not be changed!

      resizer.addEventListener('mousedown', eDown => {
        eDown.preventDefault()
        let shiftY = eDown.clientY - resizer.getBoundingClientRect().top

        let onMouseMove = eMove => {
          let numerator =
            eMove.pageY - shiftY - this.getTop() - this.getResizerHeight() * i
          let nominator =
            this.getHeight() - this.getResizerHeight() * this.panes.length

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
      })
    },

    initPos() {
      this.pos = []
      let cumulative = 0

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
        return `
              height: calc((100% - ${this.panes.length *
                this.getResizerHeight()}px) * ${frac} + ${this.getResizerHeight()}px);
            `
      }

      this.panes.forEach((pane, i) => {
        let iFrac = this.fracs[i]

        if (iFrac === 0) pane.classList.add('collapsed')
        else pane.classList.remove('collapsed')

        pane.setAttribute('style', getStyleStr(iFrac))
      })
    }
  },
  mounted() {
    this.root = this.$refs.resizable

    // Looking for panes (direct children of root element)
    this.panes = this.root.querySelectorAll('[data-resizable] > *')

    // Looking for resizers
    this.resizers = this.root.querySelectorAll(
      '[data-resizable] [data-resizer]'
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
}
</style>

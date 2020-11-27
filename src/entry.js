// Import vue components
import * as components from '@/lib-components/index.js'

// install function executed by Vue.use()
const install = function installVueMultiSplitPane(Vue) {
  if (install.installed) return
  install.installed = true
  Object.entries(components).forEach(([componentName, component]) => {
    Vue.component(componentName, component)
  })
}

// Create module definition for Vue.use()
const plugin = {
  install
}

// To auto-install on non-es builds, when vue is found
// eslint-disable-next-line no-redeclare
/* global window, global */
if ('false' === process.env.ES_BUILD) {
  let GlobalVue = null
  if (typeof window !== 'undefined') {
    GlobalVue = window.Vue
  } else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue
  }
  if (GlobalVue) {
    GlobalVue.use(plugin)
  }
}
// Default export is library as a whole, registered via Vue.use()
export default plugin

// To allow individual component use, export components
// each can be registered via Vue.component()
export * from '@/lib-components/index.js'

//
//
//
//
//
//
//
//
//
//
var script = {
  name: 'MultiSplitPane',
  props: {
    height: {
      type: String,
      required: true
    },
    width: {
      type: String,
      default: '100%'
    },
    classes: {
      type: String
    },
    split: {
      type: String,
      default: 'vertical'
    },
    resizerWidth: {
      type: String,
      default: '30px'
    },
    nested: {
      type: Boolean,
      default: false
    }
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
    };
  },

  methods: {
    setFracs(fracArray) {
      this.fracs = fracArray;
      this.initPos();
      this.applyFracs();
    },

    getDistance(orientation) {
      if (orientation == 'horizontal') {
        return this.root.getBoundingClientRect().left;
      } else {
        return this.root.getBoundingClientRect().top;
      }
    },

    getDimension(orientation) {
      if (orientation == 'horizontal') {
        return this.root.clientWidth;
      } else {
        return this.root.clientHeight;
      }
    },

    getResizerDimension(orientation) {
      if (orientation == 'horizontal') {
        return this.resizers[0].offsetWidth;
      } else {
        return this.resizers[0].offsetHeight;
      }
    },

    addDragLogic(i, resizer) {
      if (i === 0) return; // The first pane size can not be changed!

      let eDownFunc = eDown => {
        eDown.preventDefault();
        if (eDown.type == 'touchstart') eDown = eDown.touches[0];
        let shift;
        this.split == 'horizontal' ? shift = eDown.pageX - resizer.getBoundingClientRect().left : shift = eDown.pageY - resizer.getBoundingClientRect().top;

        let onMouseMove = eMove => {
          if (eMove.type == 'touchmove') eMove = eMove.touches[0];
          let coor = this.split == 'horizontal' ? eMove.pageX : eMove.pageY;
          let numerator = coor - shift - this.getDistance(this.split) - this.getResizerDimension(this.split) * i;
          let nominator = this.getDimension(this.split) - this.getResizerDimension(this.split) * this.panes.length;
          let newPos = numerator / nominator;
          if (newPos < 0) newPos = 0;
          if (newPos > 1) newPos = 1;
          this.updatePos(i, newPos);
          this.updateFracs();
          this.applyFracs();
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', () => window.removeEventListener('mousemove', onMouseMove));
        window.addEventListener('touchmove', onMouseMove);
        window.addEventListener('touchend', () => window.removeEventListener('touchmove', onMouseMove));
      };

      resizer.addEventListener('mousedown', eDownFunc);
      resizer.addEventListener('touchstart', eDownFunc);
    },

    initPos() {
      this.pos = [];
      let cumulative = 0;
      this.panes.forEach(pane => {
        if (this.split == 'horizontal') {
          pane.querySelector('.v-resizer').style.width = this.resizerWidth;
          pane.classList.add('horizontal');
        } else {
          pane.querySelector('.v-resizer').style.height = this.resizerWidth;
          pane.classList.add('vertical');
        }
      });

      for (let i = 0; i < this.fracs.length; i++) {
        this.pos.push(cumulative);
        cumulative += this.fracs[i];
      }
    },

    updatePos(resizerI, newPos) {
      if (newPos < this.pos[resizerI]) {
        for (let i = resizerI - 1; i >= 0; i--) {
          let iPos = this.pos[i];
          if (iPos < newPos) break;else this.pos[i] = newPos;
        }
      } else {
        for (let i = resizerI + 1; i < this.pos.length; i++) {
          let iPos = this.pos[i];
          if (iPos > newPos) break;else this.pos[i] = newPos;
        }
      }

      this.pos[resizerI] = newPos;
    },

    updateFracs() {
      this.fracs = [];

      for (let i = 0, j = 1; i < this.pos.length; i++, j++) {
        let iPos = this.pos[i];
        let jPos = j === this.pos.length ? 1 : this.pos[j];
        this.fracs.push(jPos - iPos);
      }
    },

    applyFracs() {
      let getStyleStr = frac => {
        let dim = this.split == 'horizontal' ? 'width' : 'height';
        return `
              ${dim}: calc((100% - ${this.panes.length * this.getResizerDimension(this.split)}px) * ${frac} + ${this.getResizerDimension(this.split)}px);
            `;
      };

      this.panes.forEach((pane, i) => {
        let iFrac = this.fracs[i];

        if (iFrac === 0 && this.collapsedPanes[i] !== 1) {
          pane.classList.add('collapsed');
          this.collapsedPanes[i] = 1;
          this.$emit('onPaneCollapsed', i, pane.classList, this.root.classList);
        } else if (iFrac !== 0 && this.collapsedPanes[i] === 1) {
          pane.classList.remove('collapsed');
          this.collapsedPanes[i] = 0;
          this.$emit('onPaneExpanded', i, pane.classList, this.root.classList);
        }

        pane.setAttribute('style', getStyleStr(iFrac));
      });
    }

  },

  mounted() {
    this.split === 'horizontal' ? this.display = 'flex' : this.display = 'block';
    this.collapsedPanes.fill(0, 0, this.$slots.default.length);
    this.root = this.$refs.resizable;

    if (this.nested) {
      this.panes = this.root.querySelectorAll('[data-resizable].nested > .v-pane'); // Looking for resizers

      this.resizers = this.root.querySelectorAll('[data-resizable].nested > .v-pane > [data-resizer]');
    } else {
      this.panes = this.root.querySelectorAll('[data-resizable] > .v-pane');
      this.resizers = this.root.querySelectorAll('[data-resizable] > .v-pane > [data-resizer]');
    } // Calculating initial fracs and pos


    let initFrac = 1 / this.panes.length;
    this.panes.forEach(() => this.fracs.push(initFrac));
    this.initPos();
    this.applyFracs(); // Adding drag logic to resizers

    this.resizers.forEach((resizer, i) => this.addDragLogic(i, resizer));
  }

};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = script;
/* template */

var __vue_render__ = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    ref: "resizable",
    class: [_vm.classes, {
      nested: _vm.nested
    }],
    style: {
      height: _vm.height,
      'max-width': _vm.width,
      display: _vm.display
    },
    attrs: {
      "data-resizable": "data-resizable"
    }
  }, [_vm._t("default")], 2);
};

var __vue_staticRenderFns__ = [];
/* style */

const __vue_inject_styles__ = function (inject) {
  if (!inject) return;
  inject("data-v-d31868b8_0", {
    source: "*[data-v-d31868b8]{box-sizing:border-box}[data-resizable][data-v-d31868b8]{overflow:auto;width:100%}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


const __vue_scope_id__ = "data-v-d31868b8";
/* module identifier */

const __vue_module_identifier__ = undefined;
/* functional template */

const __vue_is_functional_template__ = false;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, createInjector, undefined, undefined);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script$1 = {
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
    };
  },

  mounted() {
    this.width = this.initWidth;
    this.height = this.initHeight;
  }

};

/* script */
const __vue_script__$1 = script$1;
/* template */

var __vue_render__$1 = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "v-pane",
    class: _vm.classes,
    style: {
      width: _vm.width,
      height: _vm.height
    }
  }, [_c('div', {
    staticClass: "v-resizer",
    attrs: {
      "data-resizer": "data-resizer"
    }
  }, [_vm._t("resizer")], 2), _vm._v(" "), _c('div', {
    staticClass: "content"
  }, [_c('div', {
    staticClass: "innerContent"
  }, [_vm._t("content")], 2)])]);
};

var __vue_staticRenderFns__$1 = [];
/* style */

const __vue_inject_styles__$1 = function (inject) {
  if (!inject) return;
  inject("data-v-b7f37b34_0", {
    source: "*[data-v-b7f37b34]{box-sizing:border-box}.v-pane[data-v-b7f37b34]{position:relative;display:flex}.v-pane.vertical[data-v-b7f37b34]{flex-direction:column}.v-pane .v-resizer[data-v-b7f37b34]{display:flex;align-items:center;justify-content:center;background-color:#616161}.v-pane.vertical>.v-resizer[data-v-b7f37b34]{width:100%;cursor:row-resize;background:linear-gradient(#9d9d9d,#9d9d9d) 50% calc(50% - 4px)/40px 3px no-repeat,linear-gradient(#9d9d9d,#9d9d9d) 50% calc(50% + 4px)/40px 3px no-repeat,#616161;border-top:1px solid #4a4c52;border-bottom:1px solid #202125}.v-pane.horizontal>.v-resizer[data-v-b7f37b34]{height:100%;cursor:col-resize;background:linear-gradient(#9d9d9d,#9d9d9d) calc(50% - 4px) 50%/3px 40px no-repeat,linear-gradient(#9d9d9d,#9d9d9d) calc(50% + 4px) 50%/3px 40px no-repeat,#616161;border-left:1px solid #4a4c52;border-right:1px solid #202125}.v-pane:first-of-type .v-resizer[data-v-b7f37b34]{cursor:auto;background:#616161}.v-pane.collapsed .v-resizer[data-v-b7f37b34]{background:repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(0,0,0,.2) 10px,rgba(0,0,0,.2) 20px),#616161}.v-pane .content[data-v-b7f37b34]{flex:1;overflow:auto}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


const __vue_scope_id__$1 = "data-v-b7f37b34";
/* module identifier */

const __vue_module_identifier__$1 = undefined;
/* functional template */

const __vue_is_functional_template__$1 = false;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$1 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, createInjector, undefined, undefined);

var components = /*#__PURE__*/Object.freeze({
  __proto__: null,
  MultiSplitPane: __vue_component__,
  Pane: __vue_component__$1
});

// Import vue components

const install = function installVueMultiSplitPane(Vue) {
  if (install.installed) return;
  install.installed = true;
  Object.entries(components).forEach(([componentName, component]) => {
    Vue.component(componentName, component);
  });
}; // Create module definition for Vue.use()


const plugin = {
  install
}; // To auto-install on non-es builds, when vue is found

export default plugin;
export { __vue_component__ as MultiSplitPane, __vue_component__$1 as Pane };

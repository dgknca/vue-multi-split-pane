'use strict';Object.defineProperty(exports,'__esModule',{value:true});function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}//
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
  data: function data() {
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
    setFracs: function setFracs(fracArray) {
      this.fracs = fracArray;
      this.initPos();
      this.applyFracs();
    },
    getDistance: function getDistance(orientation) {
      if (orientation == 'horizontal') {
        return this.root.getBoundingClientRect().left;
      } else {
        return this.root.getBoundingClientRect().top;
      }
    },
    getDimension: function getDimension(orientation) {
      if (orientation == 'horizontal') {
        return this.root.clientWidth;
      } else {
        return this.root.clientHeight;
      }
    },
    getResizerDimension: function getResizerDimension(orientation) {
      if (orientation == 'horizontal') {
        return this.resizers[0].offsetWidth;
      } else {
        return this.resizers[0].offsetHeight;
      }
    },
    addDragLogic: function addDragLogic(i, resizer) {
      var _this = this;

      if (i === 0) return; // The first pane size can not be changed!

      var eDownFunc = function eDownFunc(eDown) {
        eDown.preventDefault();
        if (eDown.type == 'touchstart') eDown = eDown.touches[0];
        var shift;
        _this.split == 'horizontal' ? shift = eDown.pageX - resizer.getBoundingClientRect().left : shift = eDown.pageY - resizer.getBoundingClientRect().top;

        var onMouseMove = function onMouseMove(eMove) {
          if (eMove.type == 'touchmove') eMove = eMove.touches[0];
          var coor = _this.split == 'horizontal' ? eMove.pageX : eMove.pageY;
          var numerator = coor - shift - _this.getDistance(_this.split) - _this.getResizerDimension(_this.split) * i;

          var nominator = _this.getDimension(_this.split) - _this.getResizerDimension(_this.split) * _this.panes.length;

          var newPos = numerator / nominator;
          if (newPos < 0) newPos = 0;
          if (newPos > 1) newPos = 1;

          _this.updatePos(i, newPos);

          _this.updateFracs();

          _this.applyFracs();
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', function () {
          return window.removeEventListener('mousemove', onMouseMove);
        });
        window.addEventListener('touchmove', onMouseMove);
        window.addEventListener('touchend', function () {
          return window.removeEventListener('touchmove', onMouseMove);
        });
      };

      resizer.addEventListener('mousedown', eDownFunc);
      resizer.addEventListener('touchstart', eDownFunc);
    },
    initPos: function initPos() {
      var _this2 = this;

      this.pos = [];
      var cumulative = 0;
      this.panes.forEach(function (pane) {
        if (_this2.split == 'horizontal') {
          pane.querySelector('.v-resizer').style.width = _this2.resizerWidth;
          pane.classList.add('horizontal');
        } else {
          pane.querySelector('.v-resizer').style.height = _this2.resizerWidth;
          pane.classList.add('vertical');
        }
      });

      for (var i = 0; i < this.fracs.length; i++) {
        this.pos.push(cumulative);
        cumulative += this.fracs[i];
      }
    },
    updatePos: function updatePos(resizerI, newPos) {
      if (newPos < this.pos[resizerI]) {
        for (var i = resizerI - 1; i >= 0; i--) {
          var iPos = this.pos[i];
          if (iPos < newPos) break;else this.pos[i] = newPos;
        }
      } else {
        for (var _i = resizerI + 1; _i < this.pos.length; _i++) {
          var _iPos = this.pos[_i];
          if (_iPos > newPos) break;else this.pos[_i] = newPos;
        }
      }

      this.pos[resizerI] = newPos;
    },
    updateFracs: function updateFracs() {
      this.fracs = [];

      for (var i = 0, j = 1; i < this.pos.length; i++, j++) {
        var iPos = this.pos[i];
        var jPos = j === this.pos.length ? 1 : this.pos[j];
        this.fracs.push(jPos - iPos);
      }
    },
    applyFracs: function applyFracs() {
      var _this3 = this;

      var getStyleStr = function getStyleStr(frac) {
        var dim = _this3.split == 'horizontal' ? 'width' : 'height';
        return "\n              ".concat(dim, ": calc((100% - ").concat(_this3.panes.length * _this3.getResizerDimension(_this3.split), "px) * ").concat(frac, " + ").concat(_this3.getResizerDimension(_this3.split), "px);\n            ");
      };

      this.panes.forEach(function (pane, i) {
        var iFrac = _this3.fracs[i];

        if (iFrac === 0 && _this3.collapsedPanes[i] !== 1) {
          pane.classList.add('collapsed');
          _this3.collapsedPanes[i] = 1;

          _this3.$emit('onPaneCollapsed', i, pane.classList, _this3.root.classList);
        } else if (iFrac !== 0 && _this3.collapsedPanes[i] === 1) {
          pane.classList.remove('collapsed');
          _this3.collapsedPanes[i] = 0;

          _this3.$emit('onPaneExpanded', i, pane.classList, _this3.root.classList);
        }

        pane.setAttribute('style', getStyleStr(iFrac));
      });
    }
  },
  mounted: function mounted() {
    var _this4 = this;

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


    var initFrac = 1 / this.panes.length;
    this.panes.forEach(function () {
      return _this4.fracs.push(initFrac);
    });
    this.initPos();
    this.applyFracs(); // Adding drag logic to resizers

    this.resizers.forEach(function (resizer, i) {
      return _this4.addDragLogic(i, resizer);
    });
  }
};function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
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
}function createInjectorSSR(context) {
    if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
    }
    if (!context)
        return () => { };
    if (!('styles' in context)) {
        context._styles = context._styles || {};
        Object.defineProperty(context, 'styles', {
            enumerable: true,
            get: () => context._renderStyles(context._styles)
        });
        context._renderStyles = context._renderStyles || renderStyles;
    }
    return (id, style) => addStyle(id, style, context);
}
function addStyle(id, css, context) {
    const group =  css.media || 'default' ;
    const style = context._styles[group] || (context._styles[group] = { ids: [], css: '' });
    if (!style.ids.includes(id)) {
        style.media = css.media;
        style.ids.push(id);
        let code = css.source;
        style.css += code + '\n';
    }
}
function renderStyles(styles) {
    let css = '';
    for (const key in styles) {
        const style = styles[key];
        css +=
            '<style data-vue-ssr-id="' +
                Array.from(style.ids).join(' ') +
                '"' +
                (style.media ? ' media="' + style.media + '"' : '') +
                '>' +
                style.css +
                '</style>';
    }
    return css;
}/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
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

var __vue_inject_styles__ = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-d31868b8_0", {
    source: "*[data-v-d31868b8]{box-sizing:border-box}[data-resizable][data-v-d31868b8]{overflow:auto;width:100%}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__ = "data-v-d31868b8";
/* module identifier */

var __vue_module_identifier__ = "data-v-d31868b8";
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject shadow dom */

var __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, createInjectorSSR, undefined);//
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
    classes: {
      type: String
    }
  }
};/* script */
var __vue_script__$1 = script$1;
/* template */

var __vue_render__$1 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "v-pane",
    class: _vm.classes
  }, [_vm._ssrNode("<div data-resizer=\"data-resizer\" class=\"v-resizer\" data-v-5d5a746e>", "</div>", [_vm._t("resizer")], 2), _vm._ssrNode(" "), _vm._ssrNode("<div class=\"content\" data-v-5d5a746e>", "</div>", [_vm._ssrNode("<div class=\"innerContent\" data-v-5d5a746e>", "</div>", [_vm._t("content")], 2)])], 2);
};

var __vue_staticRenderFns__$1 = [];
/* style */

var __vue_inject_styles__$1 = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-5d5a746e_0", {
    source: "*[data-v-5d5a746e]{box-sizing:border-box}.v-pane[data-v-5d5a746e]{position:relative;display:flex}.v-pane.vertical[data-v-5d5a746e]{flex-direction:column}.v-pane .v-resizer[data-v-5d5a746e]{display:flex;align-items:center;justify-content:center;background-color:#616161}.v-pane.vertical>.v-resizer[data-v-5d5a746e]{width:100%;cursor:row-resize;background:linear-gradient(#9d9d9d,#9d9d9d) 50% calc(50% - 4px)/40px 3px no-repeat,linear-gradient(#9d9d9d,#9d9d9d) 50% calc(50% + 4px)/40px 3px no-repeat,#616161;border-top:1px solid #4a4c52;border-bottom:1px solid #202125}.v-pane.horizontal>.v-resizer[data-v-5d5a746e]{height:100%;cursor:col-resize;background:linear-gradient(#9d9d9d,#9d9d9d) calc(50% - 4px) 50%/3px 40px no-repeat,linear-gradient(#9d9d9d,#9d9d9d) calc(50% + 4px) 50%/3px 40px no-repeat,#616161;border-left:1px solid #4a4c52;border-right:1px solid #202125}.v-pane:first-of-type .v-resizer[data-v-5d5a746e]{cursor:auto;background:#616161}.v-pane.collapsed .v-resizer[data-v-5d5a746e]{background:repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(0,0,0,.2) 10px,rgba(0,0,0,.2) 20px),#616161}.v-pane .content[data-v-5d5a746e]{flex:1;overflow:auto}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__$1 = "data-v-5d5a746e";
/* module identifier */

var __vue_module_identifier__$1 = "data-v-5d5a746e";
/* functional template */

var __vue_is_functional_template__$1 = false;
/* style inject shadow dom */

var __vue_component__$1 = /*#__PURE__*/normalizeComponent({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, createInjectorSSR, undefined);/* eslint-disable import/prefer-default-export */
var index = {
  MultiSplitPane: __vue_component__,
  Pane: __vue_component__$1
};var components=/*#__PURE__*/Object.freeze({__proto__:null,'default': index});var install = function installVueMultiSplitPane(Vue) {
  if (install.installed) return;
  install.installed = true;
  Object.entries(components).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        componentName = _ref2[0],
        component = _ref2[1];

    Vue.component(componentName, component);
  });
}; // Create module definition for Vue.use()


var plugin = {
  install: install
}; // To auto-install on non-es builds, when vue is found
// eslint-disable-next-line no-redeclare

/* global window, global */

{
  var GlobalVue = null;

  if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
  } else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue;
  }

  if (GlobalVue) {
    GlobalVue.use(plugin);
  }
} // Default export is library as a whole, registered via Vue.use()
exports.default=plugin;
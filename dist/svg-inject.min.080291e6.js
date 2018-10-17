// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"scripts\\svg-inject.min.js":[function(require,module,exports) {
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (a, s) {
  var d,
      o,
      f = null,
      v = !0,
      y = "length",
      u = "createElement",
      l = "title",
      m = "__svgInject",
      p = "LOAD_FAIL",
      r = "SVG_NOT_SUPPORTED",
      h = "SVG_INVALID",
      g = ["src", "alt", "onload", "onerror"],
      b = s[u]("a"),
      A = "undefined" != typeof SVGRect,
      c = { useCache: v, copyAttributes: v, makeIdsUnique: v },
      w = { clipPath: ["clip-path"], "color-profile": f, cursor: f, filter: f, linearGradient: ["fill", "stroke"], marker: ["marker", "marker-end", "marker-mid", "marker-start"], mask: f, pattern: ["fill", "stroke"], radialGradient: ["fill", "stroke"] },
      S = 1,
      k = 2,
      E = 3,
      j = 1;function x(e, t, r, n) {
    if (t) {
      t.setAttribute("data-inject-url", r);var i = e.parentNode;if (i) {
        n.copyAttributes && function c(e, t) {
          for (var r = e.attributes, n = 0; n < r[y]; ++n) {
            var i = r[n],
                o = i.name;if (-1 == g.indexOf(o)) {
              var a = i.value;if (o == l) {
                var f = s.createElementNS("http://www.w3.org/2000/svg", l);f.textContent = a;var u = t.firstElementChild;u && u.tagName.toLowerCase() == l ? t.replaceChild(f, u) : t.insertBefore(f, u);
              } else t.setAttribute(o, a);
            }
          }
        }(e, t), n.makeIdsUnique && function h(e) {
          var t,
              r,
              n,
              i,
              o,
              a = "--inject-" + j++,
              f = e.querySelectorAll("[id]"),
              u = {};for (t = 0; t < f[y]; t++) {
            if ((i = (n = f[t]).tagName) in w) {
              for (n.id, o = w[i] || [i], r = 0; r < o[y]; r++) {
                u[o[r]] = !0;
              }n.id += a;
            }
          }var c = Object.keys(u);if (c[y]) {
            c.push("style");var l,
                s,
                d,
                v = new RegExp('url\\("?#([a-zA-Z][\\w:.-]*)"?\\)', "g"),
                m = e.querySelectorAll("*");for (t = 0; t < m[y]; t++) {
              if ((l = m[t]).hasAttributes()) for (r = 0; r < c[y]; r++) {
                s = c[r];var p = (d = l.getAttribute(s)) && d.replace(v, "url(#$1" + a + ")");p !== d && l.setAttribute(s, p);
              }
            }
          }
        }(t);var o = n.beforeInject,
            a = o && o(e, t) || t;i.replaceChild(a, e), e[m] = k, C(e), n.afterInject && n.afterInject(e, a);
      }
    } else N(e, n);
  }function I() {
    for (var e = {}, t = arguments, r = 0; r < t[y]; ++r) {
      var n = t[r];if (n) for (var i in n) {
        n.hasOwnProperty(i) && (e[i] = n[i]);
      }
    }return e;
  }function L(e, t) {
    var r;try {
      r = function n() {
        return o = o || new DOMParser();
      }().parseFromString(e, "text/xml");
    } catch (i) {
      return f;
    }return t && r.getElementsByTagName("parsererror").length ? f : r.documentElement;
  }function C(e) {
    e.removeAttribute("onload");
  }function n(e, t, r) {
    e[m] = E, r.onFail && r.onFail(e, t);
  }function N(e, t) {
    C(e), n(e, h, t);
  }
  function G(e, t) {
    C(e), n(e, r, t);
  }function O(e, t) {
    n(e, p, t);
  }function T(e) {
    e.onload = f, e.onerror = f;
  }function V() {
    throw new Error("img not set");
  }var e = function _(e, t) {
    var n = I(c, t),
        l = {};function r(e, t) {
      if (t = I(n, t), e && "undefined" != typeof e[y]) for (var r = 0; r < e[y]; ++r) {
        i(e[r], t);
      } else i(e, t);
    }function i(o, a) {
      if (o) {
        if (!o[m]) {
          if (T(o), !A) return void G(o, a);var e = a.beforeLoad && a.beforeLoad(o) || o.getAttribute("src");if (null === e) return;o[m] = S;var f = function n(e) {
            return b.href = e, b.href;
          }(e),
              u = a.useCache,
              c = function c(e) {
            if (u) {
              for (var t = l[f], r = 0; r < t[y]; ++r) {
                t[r](e);
              }l[f] = e;
            }
          };if (u) {
            var t = l[f],
                r = function r(e) {
              e === p ? O(o, a) : e === h ? N(o, a) : x(o, L(e, !1), f, a);
            };if (t !== undefined) return void (Array.isArray(t) ? t.push(r) : r(t));l[f] = [];
          }!function i(e, t, r) {
            if (e) {
              var n = new XMLHttpRequest();n.onreadystatechange = function () {
                if (4 == n.readyState) {
                  var e = n.status;200 == e ? t(n.responseXML, n.responseText.trim()) : 400 <= e ? r() : 0 == e && r();
                }
              }, n.open("GET", e, v), n.send();
            }
          }(f, function (e, t) {
            if (o[m] == S) {
              var r = e instanceof Document ? e.documentElement : L(t, !0);if (r instanceof SVGElement) {
                var n = a.afterLoad;n && (n(r), u && (t = function i() {
                  return d = d || new XMLSerializer();
                }().serializeToString(r))), x(o, r, f, a), c(t);
              } else N(o, a), c(h);
            }
          }, function () {
            O(o, a), c(p);
          });
        }
      } else V();
    }return A && function o(e) {
      var t = s.getElementsByTagName("head")[0];if (t) {
        var r = s[u]("style");r.type = "text/css", r.appendChild(s.createTextNode(e)), t.appendChild(r);
      }
    }('img[onload^="' + e + '("]{visibility:hidden;}'), r.setOptions = function (e) {
      n = I(n, e);
    }, r.create = _, r.err = function (e, t) {
      e ? e[m] != E && (T(e), A ? (C(e), O(e, n)) : G(e, n), t && (C(e), e.src = t)) : V();
    }, a[e] = r;
  }("SVGInject");"object" == (typeof module === "undefined" ? "undefined" : _typeof(module)) && "object" == _typeof(module.exports) && (module.exports = e);
}(window, document);
},{}],"..\\..\\..\\AppData\\Roaming\\npm\\node_modules\\parcel-bundler\\src\\builtins\\hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '56251' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();

      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["..\\..\\..\\AppData\\Roaming\\npm\\node_modules\\parcel-bundler\\src\\builtins\\hmr-runtime.js","scripts\\svg-inject.min.js"], null)
//# sourceMappingURL=/svg-inject.min.080291e6.map
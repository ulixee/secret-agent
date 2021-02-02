(window.webpackJsonp=window.webpackJsonp||[]).push([[141],{v9iY:function(e,t,r){"use strict";r.r(t);var s=r("Ow4o"),o=r("vu0Y"),n=r("pLV6");function i(e){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}n.a.config.optionMergeStrategies;var a={VueRemarkRoot:o.a},d=function(e){var t=e.options.components=e.options.components||{},r=e.options.computed=e.options.computed||{};Object.keys(a).forEach((function(e){"object"===i(a[e])&&"function"==typeof a[e].render||"function"==typeof a[e]&&"function"==typeof a[e].options.render?t[e]=a[e]:r[e]=function(){return a[e]}}))},l=n.a.config.optionMergeStrategies,c="__vueRemarkFrontMatter",v={excerpt:null,title:"[AwaitedDOM](/docs/basic-interfaces/awaited-dom) <span>/</span> ParentNode"};var u=function(e){e.options[c]&&(e.options[c]=v),n.a.util.defineReactive(e.options,c,v),e.options.computed=l.computed({$frontmatter:function(){return e.options[c]}},e.options.computed)},_=Object(s.a)({},(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("VueRemarkRoot",[r("h1",{attrs:{id:"awaiteddom-spanspan-parentnode"}},[r("a",{attrs:{href:"#awaiteddom-spanspan-parentnode","aria-hidden":"true"}},[e._v("#")]),r("a",{attrs:{href:"/docs/basic-interfaces/awaited-dom"}},[e._v("AwaitedDOM")]),r("span",[e._v("/")]),e._v(" ParentNode")]),r("div",{staticClass:"overview"},[r("span",{staticClass:"seoSummary"},[e._v("The "),r("code",[r("strong",[e._v("ParentNode")])]),e._v(" mixin contains methods and properties that are common to all types of "),r("code",[e._v("Node")]),e._v(" objects that can have children.")]),e._v(" It's implemented by "),r("code",[e._v("Element")]),e._v(", "),r("code",[e._v("Document")]),e._v(", and "),r("code",[e._v("DocumentFragment")]),e._v(" objects.")]),r("div",{staticClass:"overview"},[e._v("See "),r("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/API/Document_object_model/Locating_DOM_elements_using_selectors",target:"mdnrel"}},[e._v("Locating DOM elements using selectors")]),e._v(" to learn how to use CSS selectors to find nodes or elements of interest.")]),r("h2",{attrs:{id:"properties"}},[r("a",{attrs:{href:"#properties","aria-hidden":"true"}},[e._v("#")]),e._v("Properties")]),r("h3",{attrs:{id:"childElementCount"}},[r("a",{attrs:{href:"#childElementCount","aria-hidden":"true"}},[e._v("#")]),e._v(".childElementCount "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns the number of children of this "),r("code",[e._v("ParentNode")]),e._v(" which are elements.")]),r("h4",{attrs:{id:"type-promisenumber"}},[r("a",{attrs:{href:"#type-promisenumber","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<number>")])]),r("h3",{attrs:{id:"children"}},[r("a",{attrs:{href:"#children","aria-hidden":"true"}},[e._v("#")]),e._v(".children "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns a live "),r("code",[e._v("HTMLCollection")]),e._v(" containing all of the "),r("code",[e._v("Element")]),e._v(" objects that are children of this "),r("code",[e._v("ParentNode")]),e._v(", omitting all of its non-element nodes.")]),r("h4",{attrs:{id:"type-superhtmlcollection"}},[r("a",{attrs:{href:"#type-superhtmlcollection","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("a",{attrs:{href:"./super-html-collection"}},[r("code",{pre:!0},[e._v("SuperHTMLCollection")])])]),r("h3",{attrs:{id:"firstElementChild"}},[r("a",{attrs:{href:"#firstElementChild","aria-hidden":"true"}},[e._v("#")]),e._v(".firstElementChild "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns the first node which is both a child of this "),r("code",[e._v("ParentNode")]),r("em",[e._v("and")]),e._v(" is also an "),r("code",[e._v("Element")]),e._v(", or "),r("code",[e._v("null")]),e._v(" if there is none.")]),r("h4",{attrs:{id:"type-superelement"}},[r("a",{attrs:{href:"#type-superelement","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("a",{attrs:{href:"./super-element"}},[r("code",{pre:!0},[e._v("SuperElement")])])]),r("h3",{attrs:{id:"lastElementChild"}},[r("a",{attrs:{href:"#lastElementChild","aria-hidden":"true"}},[e._v("#")]),e._v(".lastElementChild "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns the last node which is both a child of this "),r("code",[e._v("ParentNode")]),r("em",[e._v("and")]),e._v(" is an "),r("code",[e._v("Element")]),e._v(", or "),r("code",[e._v("null")]),e._v(" if there is none.")]),r("h4",{attrs:{id:"type-superelement-1"}},[r("a",{attrs:{href:"#type-superelement-1","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("a",{attrs:{href:"./super-element"}},[r("code",{pre:!0},[e._v("SuperElement")])])]),r("h2",{attrs:{id:"methods"}},[r("a",{attrs:{href:"#methods","aria-hidden":"true"}},[e._v("#")]),e._v("Methods")]),r("h3",{attrs:{id:"querySelector"}},[r("a",{attrs:{href:"#querySelector","aria-hidden":"true"}},[e._v("#")]),e._v(".querySelector"),r("em",[e._v("(selectors)")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns the first "),r("code",[e._v("Element")]),e._v(" with the current element as root that matches the specified group of selectors.")]),r("h4",{attrs:{id:"arguments"}},[r("a",{attrs:{href:"#arguments","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Arguments")]),e._v(":")]),r("ul",[r("li",[e._v("selectors "),r("code",{pre:!0},[e._v("string")]),e._v(". A "),r("code",{pre:!0},[e._v("string")]),e._v(" containing one or more selectors to match against. This string must be a valid compound selector list supported by the browser; if it's not, a "),r("code",[e._v("SyntaxError")]),e._v(" exception is thrown. See "),r("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/API/Document_object_model/Locating_DOM_elements_using_selectors",target:"mdnrel"}},[e._v("Locating DOM elements using selectors")]),e._v(" for more information about using selectors to identify elements. Multiple selectors may be specified by separating them using commas.")])]),r("h4",{attrs:{id:"returns-superelement"}},[r("a",{attrs:{href:"#returns-superelement","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("a",{attrs:{href:"./super-element"}},[r("code",{pre:!0},[e._v("SuperElement")])])]),r("h3",{attrs:{id:"querySelectorAll"}},[r("a",{attrs:{href:"#querySelectorAll","aria-hidden":"true"}},[e._v("#")]),e._v(".querySelectorAll"),r("em",[e._v("(selectors)")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns a "),r("code",[e._v("NodeList")]),e._v(" representing a list of elements with the current element as root that matches the specified group of selectors.")]),r("h4",{attrs:{id:"arguments-1"}},[r("a",{attrs:{href:"#arguments-1","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Arguments")]),e._v(":")]),r("ul",[r("li",[e._v("selectors "),r("code",{pre:!0},[e._v("string")]),e._v(". A "),r("code",{pre:!0},[e._v("string")]),e._v(" containing one or more selectors to match against. This string must be a valid CSS selector string; if it's not, a "),r("code",[e._v("SyntaxError")]),e._v(" exception is thrown. See "),r("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/API/Document_object_model/Locating_DOM_elements_using_selectors",target:"mdnrel"}},[e._v("Locating DOM elements using selectors")]),e._v(" for more information about using selectors to identify elements. Multiple selectors may be specified by separating them using commas.")])]),r("h4",{attrs:{id:"returns-supernodelist"}},[r("a",{attrs:{href:"#returns-supernodelist","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("a",{attrs:{href:"./super-node-list"}},[r("code",{pre:!0},[e._v("SuperNodeList")])])]),r("h2",{attrs:{id:"unimplemented-specs"}},[r("a",{attrs:{href:"#unimplemented-specs","aria-hidden":"true"}},[e._v("#")]),e._v("Unimplemented Specs")]),r("h4",{attrs:{id:"methods-1"}},[r("a",{attrs:{href:"#methods-1","aria-hidden":"true"}},[e._v("#")]),e._v("Methods")]),r("table",[r("thead",[r("tr",[r("th"),r("th")])]),r("tbody",[r("tr",[r("td",[r("code",{pre:!0},[e._v("append()")])]),r("td",[r("code",{pre:!0},[e._v("prepend()")])])])])])])}),[],!1,null,null,null);"function"==typeof d&&d(_),"function"==typeof u&&u(_);t.default=_.exports},vu0Y:function(e,t,r){"use strict";t.a={name:"VueRemarkRoot",render:function(e){return e("div",null,this.$slots.default)}}}}]);
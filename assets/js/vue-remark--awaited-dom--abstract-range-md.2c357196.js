(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{B5Kf:function(e,t,n){"use strict";n.r(t);var a=n("Ow4o"),r=n("vu0Y"),o=n("pLV6");function s(e){return(s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}o.a.config.optionMergeStrategies;var i={VueRemarkRoot:r.a},d=function(e){var t=e.options.components=e.options.components||{},n=e.options.computed=e.options.computed||{};Object.keys(i).forEach((function(e){"object"===s(i[e])&&"function"==typeof i[e].render||"function"==typeof i[e]&&"function"==typeof i[e].options.render?t[e]=i[e]:n[e]=function(){return i[e]}}))},c=o.a.config.optionMergeStrategies,p="__vueRemarkFrontMatter",h={excerpt:null,title:"[AwaitedDOM](/docs/basic-interfaces/awaited-dom) <span>/</span> AbstractRange"};var f=function(e){e.options[p]&&(e.options[p]=h),o.a.util.defineReactive(e.options,p,h),e.options.computed=c.computed({$frontmatter:function(){return e.options[p]}},e.options.computed)},v=Object(a.a)({},(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("VueRemarkRoot",[n("h1",{attrs:{id:"awaiteddom-spanspan-abstractrange"}},[n("a",{attrs:{href:"#awaiteddom-spanspan-abstractrange","aria-hidden":"true"}},[e._v("#")]),n("a",{attrs:{href:"/docs/basic-interfaces/awaited-dom"}},[e._v("AwaitedDOM")]),n("span",[e._v("/")]),e._v(" AbstractRange")]),n("div",{staticClass:"overview"},[n("span",{staticClass:"seoSummary"},[e._v("The "),n("strong",[n("code",[e._v("AbstractRange")])]),e._v(" abstract interface is the base class upon which all DOM range types are defined. A "),n("strong",[e._v("range")]),e._v(" is an object that indicates the start and end points of a section of content within the document.")])]),n("div",{staticClass:"overview"},[e._v("As an abstract interface, you will not directly instantiate an object of type "),n("code",[e._v("AbstractRange")]),e._v(". Instead, you will use the "),n("code",[e._v("Range")]),e._v(" or "),n("code",[e._v("StaticRange")]),e._v(" interfaces. To understand the difference between those two interfaces, and how to choose which is appropriate for your needs.")]),n("h2",{attrs:{id:"properties"}},[n("a",{attrs:{href:"#properties","aria-hidden":"true"}},[e._v("#")]),e._v("Properties")]),n("h3",{attrs:{id:"collapsed"}},[n("a",{attrs:{href:"#collapsed","aria-hidden":"true"}},[e._v("#")]),e._v(".collapsed "),n("div",{staticClass:"specs"},[n("i",[e._v("W3C")])])]),n("p",[e._v("A Boolean value which is "),n("code",[e._v("true")]),e._v(" if the range is "),n("strong",[e._v("collapsed")]),e._v(". A collapsed range is one whose start position and end position are the same, resulting in a zero-character-long range.")]),n("h4",{attrs:{id:"type-promiseboolean"}},[n("a",{attrs:{href:"#type-promiseboolean","aria-hidden":"true"}},[e._v("#")]),n("strong",[e._v("Type")]),e._v(": "),n("code",{pre:!0},[e._v("Promise<boolean>")])]),n("h3",{attrs:{id:"endContainer"}},[n("a",{attrs:{href:"#endContainer","aria-hidden":"true"}},[e._v("#")]),e._v(".endContainer "),n("div",{staticClass:"specs"},[n("i",[e._v("W3C")])])]),n("p",[e._v("The DOM "),n("code",[e._v("Node")]),e._v(" in which the end of the range, as specified by the "),n("code",[e._v("endOffset")]),e._v(" property, is located.")]),n("h4",{attrs:{id:"type-supernode"}},[n("a",{attrs:{href:"#type-supernode","aria-hidden":"true"}},[e._v("#")]),n("strong",[e._v("Type")]),e._v(": "),n("a",{attrs:{href:"./super-node"}},[n("code",{pre:!0},[e._v("SuperNode")])])]),n("h3",{attrs:{id:"endOffset"}},[n("a",{attrs:{href:"#endOffset","aria-hidden":"true"}},[e._v("#")]),e._v(".endOffset "),n("div",{staticClass:"specs"},[n("i",[e._v("W3C")])])]),n("p",[e._v("An integer value indicating the offset, in characters, from the beginning of the node's contents to the beginning of the range represented by the range object. This value must be less than the length of the "),n("code",[e._v("endContainer")]),e._v(" node.")]),n("h4",{attrs:{id:"type-promisenumber"}},[n("a",{attrs:{href:"#type-promisenumber","aria-hidden":"true"}},[e._v("#")]),n("strong",[e._v("Type")]),e._v(": "),n("code",{pre:!0},[e._v("Promise<number>")])]),n("h3",{attrs:{id:"startContainer"}},[n("a",{attrs:{href:"#startContainer","aria-hidden":"true"}},[e._v("#")]),e._v(".startContainer "),n("div",{staticClass:"specs"},[n("i",[e._v("W3C")])])]),n("p",[e._v("The DOM "),n("code",[e._v("Node")]),e._v(" in which the beginning of the range, as specified by the "),n("code",[e._v("startOffset")]),e._v(" property, is located.")]),n("h4",{attrs:{id:"type-supernode-1"}},[n("a",{attrs:{href:"#type-supernode-1","aria-hidden":"true"}},[e._v("#")]),n("strong",[e._v("Type")]),e._v(": "),n("a",{attrs:{href:"./super-node"}},[n("code",{pre:!0},[e._v("SuperNode")])])]),n("h3",{attrs:{id:"startOffset"}},[n("a",{attrs:{href:"#startOffset","aria-hidden":"true"}},[e._v("#")]),e._v(".startOffset "),n("div",{staticClass:"specs"},[n("i",[e._v("W3C")])])]),n("p",[e._v("An integer value indicating the offset, in characters, from the beginning of the node's contents to the last character of the contents referred to  by the range object. This value must be less than the length of the node indicated in "),n("code",[e._v("startContainer")]),e._v(".")]),n("h4",{attrs:{id:"type-promisenumber-1"}},[n("a",{attrs:{href:"#type-promisenumber-1","aria-hidden":"true"}},[e._v("#")]),n("strong",[e._v("Type")]),e._v(": "),n("code",{pre:!0},[e._v("Promise<number>")])])])}),[],!1,null,null,null);"function"==typeof d&&d(v),"function"==typeof f&&f(v);t.default=v.exports},vu0Y:function(e,t,n){"use strict";t.a={name:"VueRemarkRoot",render:function(e){return e("div",null,this.$slots.default)}}}}]);
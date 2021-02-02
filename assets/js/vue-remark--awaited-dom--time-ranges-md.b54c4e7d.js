(window.webpackJsonp=window.webpackJsonp||[]).push([[176],{iBLe:function(e,t,r){"use strict";r.r(t);var n=r("Ow4o"),i=r("vu0Y"),o=r("pLV6");function a(e){return(a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}o.a.config.optionMergeStrategies;var s={VueRemarkRoot:i.a},d=function(e){var t=e.options.components=e.options.components||{},r=e.options.computed=e.options.computed||{};Object.keys(s).forEach((function(e){"object"===a(s[e])&&"function"==typeof s[e].render||"function"==typeof s[e]&&"function"==typeof s[e].options.render?t[e]=s[e]:r[e]=function(){return s[e]}}))},u=o.a.config.optionMergeStrategies,v="__vueRemarkFrontMatter",c={excerpt:null,title:"[AwaitedDOM](/docs/basic-interfaces/awaited-dom) <span>/</span> TimeRanges"};var m=function(e){e.options[v]&&(e.options[v]=c),o.a.util.defineReactive(e.options,v,c),e.options.computed=u.computed({$frontmatter:function(){return e.options[v]}},e.options.computed)},p=Object(n.a)({},(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("VueRemarkRoot",[r("h1",{attrs:{id:"awaiteddom-spanspan-timeranges"}},[r("a",{attrs:{href:"#awaiteddom-spanspan-timeranges","aria-hidden":"true"}},[e._v("#")]),r("a",{attrs:{href:"/docs/basic-interfaces/awaited-dom"}},[e._v("AwaitedDOM")]),r("span",[e._v("/")]),e._v(" TimeRanges")]),r("div",{staticClass:"overview"},[e._v("The "),r("code",[e._v("TimeRanges")]),e._v(" interface is used to represent a set of time ranges, primarily for the purpose of tracking which portions of media have been buffered when loading it for use by the "),r("code",[e._v("<audio>")]),e._v(" and "),r("code",[e._v("<video>")]),e._v(" elements.")]),r("div",{staticClass:"overview"},[e._v("A "),r("code",[e._v("TimeRanges")]),e._v(" object includes one or more ranges of time, each specified by a starting and ending time offset. You reference each time range by using the "),r("code",[e._v("start()")]),e._v(" and "),r("code",[e._v("end()")]),e._v(" methods, passing the index number of the time range you want to retrieve.")]),r("div",{staticClass:"overview"},[e._v('The term "'),r("a",{staticClass:"external",attrs:{href:"https://www.w3.org/TR/html52/semantics-embedded-content.html#normalized-timeranges-object",rel:"noopener"}},[e._v("normalized TimeRanges object")]),e._v("\" indicates that ranges in such an object are ordered, don't overlap, aren't empty, and don't touch (adjacent ranges are folded into one bigger range).")]),r("h2",{attrs:{id:"properties"}},[r("a",{attrs:{href:"#properties","aria-hidden":"true"}},[e._v("#")]),e._v("Properties")]),r("h3",{attrs:{id:"length"}},[r("a",{attrs:{href:"#length","aria-hidden":"true"}},[e._v("#")]),e._v(".length "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns an "),r("code",[e._v("unsigned long")]),e._v(" representing the number of time ranges represented by the time range object.")]),r("h4",{attrs:{id:"type-promisenumber"}},[r("a",{attrs:{href:"#type-promisenumber","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<number>")])]),r("h2",{attrs:{id:"methods"}},[r("a",{attrs:{href:"#methods","aria-hidden":"true"}},[e._v("#")]),e._v("Methods")]),r("h3",{attrs:{id:"end"}},[r("a",{attrs:{href:"#end","aria-hidden":"true"}},[e._v("#")]),e._v(".end"),r("em",[e._v("(index)")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns the time for the end of the specified range.")]),r("h4",{attrs:{id:"arguments"}},[r("a",{attrs:{href:"#arguments","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Arguments")]),e._v(":")]),r("ul",[r("li",[e._v("index "),r("code",{pre:!0},[e._v("number")]),e._v(". "),r("code",[e._v("index")]),e._v(" is the range number to return the ending time for.")])]),r("h4",{attrs:{id:"returns-promisenumber"}},[r("a",{attrs:{href:"#returns-promisenumber","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<number>")])]),r("h3",{attrs:{id:"start"}},[r("a",{attrs:{href:"#start","aria-hidden":"true"}},[e._v("#")]),e._v(".start"),r("em",[e._v("(index)")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns the time for the start of the range with the specified index.")]),r("h4",{attrs:{id:"arguments-1"}},[r("a",{attrs:{href:"#arguments-1","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Arguments")]),e._v(":")]),r("ul",[r("li",[e._v("index "),r("code",{pre:!0},[e._v("number")]),e._v(". "),r("code",[e._v("index")]),e._v(" is the range number to return the starting time for.")])]),r("h4",{attrs:{id:"returns-promisenumber-1"}},[r("a",{attrs:{href:"#returns-promisenumber-1","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<number>")])])])}),[],!1,null,null,null);"function"==typeof d&&d(p),"function"==typeof m&&m(p);t.default=p.exports},vu0Y:function(e,t,r){"use strict";t.a={name:"VueRemarkRoot",render:function(e){return e("div",null,this.$slots.default)}}}}]);
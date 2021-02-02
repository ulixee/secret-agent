(window.webpackJsonp=window.webpackJsonp||[]).push([[133],{uyv6:function(e,t,r){"use strict";r.r(t);var a=r("Ow4o"),o=r("vu0Y"),i=r("pLV6");function s(e){return(s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}i.a.config.optionMergeStrategies;var n={VueRemarkRoot:o.a},d=function(e){var t=e.options.components=e.options.components||{},r=e.options.computed=e.options.computed||{};Object.keys(n).forEach((function(e){"object"===s(n[e])&&"function"==typeof n[e].render||"function"==typeof n[e]&&"function"==typeof n[e].options.render?t[e]=n[e]:r[e]=function(){return n[e]}}))},c=i.a.config.optionMergeStrategies,v="__vueRemarkFrontMatter",p={excerpt:null,title:"[AwaitedDOM](/docs/basic-interfaces/awaited-dom) <span>/</span> MediaStream"};var u=function(e){e.options[v]&&(e.options[v]=p),i.a.util.defineReactive(e.options,v,p),e.options.computed=c.computed({$frontmatter:function(){return e.options[v]}},e.options.computed)},_=Object(a.a)({},(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("VueRemarkRoot",[r("h1",{attrs:{id:"awaiteddom-spanspan-mediastream"}},[r("a",{attrs:{href:"#awaiteddom-spanspan-mediastream","aria-hidden":"true"}},[e._v("#")]),r("a",{attrs:{href:"/docs/basic-interfaces/awaited-dom"}},[e._v("AwaitedDOM")]),r("span",[e._v("/")]),e._v(" MediaStream")]),r("div",{staticClass:"overview"},[r("span",{staticClass:"seoSummary"},[e._v("The "),r("strong",[r("code",[e._v("MediaStream")])]),e._v(" interface represents a stream of media content. A stream consists of several "),r("strong",[e._v("tracks")]),e._v(" such as video or audio tracks. Each track is specified as an instance of "),r("code",[e._v("MediaStreamTrack")]),e._v(".")]),e._v("You can obtain a MediaStream object either by using the constructor or by calling "),r("code",[e._v("MediaDevices.getUserMedia()")]),e._v(".")]),r("div",{staticClass:"overview"},[e._v("Some user agents subclass this interface to provide more precise information or functionality, like in "),r("code",[e._v("CanvasCaptureMediaStream")]),e._v(".")]),r("h2",{attrs:{id:"properties"}},[r("a",{attrs:{href:"#properties","aria-hidden":"true"}},[e._v("#")]),e._v("Properties")]),r("h3",{attrs:{id:"active"}},[r("a",{attrs:{href:"#active","aria-hidden":"true"}},[e._v("#")]),e._v(".active "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("A Boolean value that returns "),r("code",[e._v("true")]),e._v(" if the "),r("code",[e._v("MediaStream")]),e._v(" is active, or "),r("code",[e._v("false")]),e._v(" otherwise.")]),r("h4",{attrs:{id:"type-promiseboolean"}},[r("a",{attrs:{href:"#type-promiseboolean","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<boolean>")])]),r("h3",{attrs:{id:"id"}},[r("a",{attrs:{href:"#id","aria-hidden":"true"}},[e._v("#")]),e._v(".id "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("A "),r("code",{pre:!0},[e._v("string")]),e._v(" containing 36 characters denoting a universally unique identifier (UUID) for the object.")]),r("h4",{attrs:{id:"type-promisestring"}},[r("a",{attrs:{href:"#type-promisestring","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<string>")])]),r("h2",{attrs:{id:"methods"}},[r("a",{attrs:{href:"#methods","aria-hidden":"true"}},[e._v("#")]),e._v("Methods")]),r("h3",{attrs:{id:"clone"}},[r("a",{attrs:{href:"#clone","aria-hidden":"true"}},[e._v("#")]),e._v(".clone"),r("em",[e._v("()")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns a clone of the "),r("code",[e._v("MediaStream")]),e._v(" object. The clone will, however, have a unique value for "),r("code",[e._v("id")]),e._v(".")]),r("h4",{attrs:{id:"returns-mediastream"}},[r("a",{attrs:{href:"#returns-mediastream","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("a",{attrs:{href:"./media-stream"}},[r("code",{pre:!0},[e._v("MediaStream")])])]),r("h2",{attrs:{id:"unimplemented-specs"}},[r("a",{attrs:{href:"#unimplemented-specs","aria-hidden":"true"}},[e._v("#")]),e._v("Unimplemented Specs")]),r("h4",{attrs:{id:"properties-1"}},[r("a",{attrs:{href:"#properties-1","aria-hidden":"true"}},[e._v("#")]),e._v("Properties")]),r("table",[r("thead",[r("tr",[r("th"),r("th")])]),r("tbody",[r("tr",[r("td",[r("code",{pre:!0},[e._v("onaddtrack")])]),r("td",[r("code",{pre:!0},[e._v("onremovetrack")])])])])]),r("h4",{attrs:{id:"methods-1"}},[r("a",{attrs:{href:"#methods-1","aria-hidden":"true"}},[e._v("#")]),e._v("Methods")]),r("table",[r("thead",[r("tr",[r("th"),r("th")])]),r("tbody",[r("tr",[r("td",[r("code",{pre:!0},[e._v("addTrack()")])]),r("td",[r("code",{pre:!0},[e._v("getAudioTracks()")])])]),r("tr",[r("td",[r("code",{pre:!0},[e._v("getTrackById()")])]),r("td",[r("code",{pre:!0},[e._v("getTracks()")])])]),r("tr",[r("td",[r("code",{pre:!0},[e._v("getVideoTracks()")])]),r("td",[r("code",{pre:!0},[e._v("removeTrack()")])])]),r("tr",[r("td",[r("code",{pre:!0},[e._v("addEventListener()")])]),r("td",[r("code",{pre:!0},[e._v("dispatchEvent()")])])]),r("tr",[r("td",[r("code",{pre:!0},[e._v("removeEventListener()")])]),r("td")])])])])}),[],!1,null,null,null);"function"==typeof d&&d(_),"function"==typeof u&&u(_);t.default=_.exports},vu0Y:function(e,t,r){"use strict";t.a={name:"VueRemarkRoot",render:function(e){return e("div",null,this.$slots.default)}}}}]);
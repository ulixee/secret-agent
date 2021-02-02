(window.webpackJsonp=window.webpackJsonp||[]).push([[173],{"gw/l":function(e,t,r){"use strict";r.r(t);var i=r("Ow4o"),a=r("vu0Y"),s=r("pLV6");function o(e){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}s.a.config.optionMergeStrategies;var n={VueRemarkRoot:a.a},d=function(e){var t=e.options.components=e.options.components||{},r=e.options.computed=e.options.computed||{};Object.keys(n).forEach((function(e){"object"===o(n[e])&&"function"==typeof n[e].render||"function"==typeof n[e]&&"function"==typeof n[e].options.render?t[e]=n[e]:r[e]=function(){return n[e]}}))},p=s.a.config.optionMergeStrategies,c="__vueRemarkFrontMatter",v={excerpt:null,title:"[AwaitedDOM](/docs/basic-interfaces/awaited-dom) <span>/</span> TextTrackCue"};var h=function(e){e.options[c]&&(e.options[c]=v),s.a.util.defineReactive(e.options,c,v),e.options.computed=p.computed({$frontmatter:function(){return e.options[c]}},e.options.computed)},u=Object(i.a)({},(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("VueRemarkRoot",[r("h1",{attrs:{id:"awaiteddom-spanspan-texttrackcue"}},[r("a",{attrs:{href:"#awaiteddom-spanspan-texttrackcue","aria-hidden":"true"}},[e._v("#")]),r("a",{attrs:{href:"/docs/basic-interfaces/awaited-dom"}},[e._v("AwaitedDOM")]),r("span",[e._v("/")]),e._v(" TextTrackCue")]),r("div",{staticClass:"overview"},[r("span",{staticClass:"seoSummary"},[r("code",[r("strong",[e._v("TextTrackCue")])]),e._v(" is an abstract class which is used as the basis for the various derived cue types, such as "),r("code",[e._v("VTTCue")]),e._v("; you will instead work with those derived types.")]),e._v(" These cues represent a string of text that is presented for some duration of time during the performance of a "),r("code",[e._v("TextTrack")]),e._v(". The cue includes the start time (the time at which the text will be displayed) and the end time (the time at which it will be removed from the display), as well as other information.")]),r("h2",{attrs:{id:"properties"}},[r("a",{attrs:{href:"#properties","aria-hidden":"true"}},[e._v("#")]),e._v("Properties")]),r("h3",{attrs:{id:"endTime"}},[r("a",{attrs:{href:"#endTime","aria-hidden":"true"}},[e._v("#")]),e._v(".endTime "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("A "),r("code",[e._v("double")]),e._v(" that represents the video time that the cue will stop being displayed, in seconds.")]),r("h4",{attrs:{id:"type-promisenumber"}},[r("a",{attrs:{href:"#type-promisenumber","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<number>")])]),r("h3",{attrs:{id:"id"}},[r("a",{attrs:{href:"#id","aria-hidden":"true"}},[e._v("#")]),e._v(".id "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("A "),r("code",{pre:!0},[e._v("string")]),e._v(" that identifies the cue.")]),r("h4",{attrs:{id:"type-promisestring"}},[r("a",{attrs:{href:"#type-promisestring","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<string>")])]),r("h3",{attrs:{id:"pauseOnExit"}},[r("a",{attrs:{href:"#pauseOnExit","aria-hidden":"true"}},[e._v("#")]),e._v(".pauseOnExit "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("A "),r("code",[e._v("boolean")]),e._v(" for whether the video will pause when this cue stops being displayed.")]),r("h4",{attrs:{id:"type-promiseboolean"}},[r("a",{attrs:{href:"#type-promiseboolean","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<boolean>")])]),r("h3",{attrs:{id:"startTime"}},[r("a",{attrs:{href:"#startTime","aria-hidden":"true"}},[e._v("#")]),e._v(".startTime "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("A "),r("code",[e._v("double")]),e._v(" that represents the video time that the cue will start being displayed, in seconds.")]),r("h4",{attrs:{id:"type-promisenumber-1"}},[r("a",{attrs:{href:"#type-promisenumber-1","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<number>")])]),r("h3",{attrs:{id:"track"}},[r("a",{attrs:{href:"#track","aria-hidden":"true"}},[e._v("#")]),e._v(".track "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("The "),r("code",[e._v("TextTrack")]),e._v(" that this cue belongs to, or "),r("code",[e._v("null")]),e._v(" if it doesn't belong to any.")]),r("h4",{attrs:{id:"type-texttrack"}},[r("a",{attrs:{href:"#type-texttrack","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("a",{attrs:{href:"./text-track"}},[r("code",{pre:!0},[e._v("TextTrack")])])]),r("h2",{attrs:{id:"unimplemented-specs"}},[r("a",{attrs:{href:"#unimplemented-specs","aria-hidden":"true"}},[e._v("#")]),e._v("Unimplemented Specs")]),r("h4",{attrs:{id:"properties-1"}},[r("a",{attrs:{href:"#properties-1","aria-hidden":"true"}},[e._v("#")]),e._v("Properties")]),r("table",[r("thead",[r("tr",[r("th"),r("th")])]),r("tbody",[r("tr",[r("td",[r("code",{pre:!0},[e._v("onenter")])]),r("td",[r("code",{pre:!0},[e._v("onexit")])])])])]),r("h4",{attrs:{id:"methods"}},[r("a",{attrs:{href:"#methods","aria-hidden":"true"}},[e._v("#")]),e._v("Methods")]),r("table",[r("thead",[r("tr",[r("th"),r("th")])]),r("tbody",[r("tr",[r("td",[r("code",{pre:!0},[e._v("addEventListener()")])]),r("td",[r("code",{pre:!0},[e._v("dispatchEvent()")])])]),r("tr",[r("td",[r("code",{pre:!0},[e._v("removeEventListener()")])]),r("td")])])])])}),[],!1,null,null,null);"function"==typeof d&&d(u),"function"==typeof h&&h(u);t.default=u.exports},vu0Y:function(e,t,r){"use strict";t.a={name:"VueRemarkRoot",render:function(e){return e("div",null,this.$slots.default)}}}}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[180],{fppy:function(e,t,i){"use strict";i.r(t);var a=i("Ow4o"),r=i("vu0Y"),o=i("pLV6");function s(e){return(s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}o.a.config.optionMergeStrategies;var n={VueRemarkRoot:r.a},c=function(e){var t=e.options.components=e.options.components||{},i=e.options.computed=e.options.computed||{};Object.keys(n).forEach((function(e){"object"===s(n[e])&&"function"==typeof n[e].render||"function"==typeof n[e]&&"function"==typeof n[e].options.render?t[e]=n[e]:i[e]=function(){return n[e]}}))},d=o.a.config.optionMergeStrategies,v="__vueRemarkFrontMatter",p={excerpt:null,title:"[AwaitedDOM](/docs/basic-interfaces/awaited-dom) <span>/</span> VideoTrack"};var _=function(e){e.options[v]&&(e.options[v]=p),o.a.util.defineReactive(e.options,v,p),e.options.computed=d.computed({$frontmatter:function(){return e.options[v]}},e.options.computed)},l=Object(a.a)({},(function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("VueRemarkRoot",[i("h1",{attrs:{id:"awaiteddom-spanspan-videotrack"}},[i("a",{attrs:{href:"#awaiteddom-spanspan-videotrack","aria-hidden":"true"}},[e._v("#")]),i("a",{attrs:{href:"/docs/basic-interfaces/awaited-dom"}},[e._v("AwaitedDOM")]),i("span",[e._v("/")]),e._v(" VideoTrack")]),i("div",{staticClass:"overview"},[i("span",{staticClass:"seoSummary"},[e._v("The "),i("code",[e._v("VideoTrack")]),e._v(" interface represents a single video track from a "),i("code",[e._v("<video>")]),e._v(" element.")]),e._v(" The most common use for accessing a "),i("code",[e._v("VideoTrack")]),e._v(" object is to toggle its "),i("code",[e._v("selected")]),e._v(" property in order to make it the active video track for its "),i("code",[e._v("<video>")]),e._v(" element.")]),i("h2",{attrs:{id:"properties"}},[i("a",{attrs:{href:"#properties","aria-hidden":"true"}},[e._v("#")]),e._v("Properties")]),i("h3",{attrs:{id:"id"}},[i("a",{attrs:{href:"#id","aria-hidden":"true"}},[e._v("#")]),e._v(".id "),i("div",{staticClass:"specs"},[i("i",[e._v("W3C")])])]),i("p",[e._v("A "),i("code",{pre:!0},[e._v("string")]),e._v(" which uniquely identifies the track within the media. This ID can be used to locate a specific track within a video track list by calling "),i("code",[e._v("VideoTrackList.getTrackById()")]),e._v(". The ID can also be used as the fragment part of the URL if the media supports seeking by media fragment per the "),i("a",{staticClass:"external",attrs:{href:"https://www.w3.org/TR/media-frags/",rel:"noopener"}},[e._v("Media Fragments URI specification")]),e._v(".")]),i("h4",{attrs:{id:"type-promisestring"}},[i("a",{attrs:{href:"#type-promisestring","aria-hidden":"true"}},[e._v("#")]),i("strong",[e._v("Type")]),e._v(": "),i("code",{pre:!0},[e._v("Promise<string>")])]),i("h3",{attrs:{id:"kind"}},[i("a",{attrs:{href:"#kind","aria-hidden":"true"}},[e._v("#")]),e._v(".kind "),i("div",{staticClass:"specs"},[i("i",[e._v("W3C")])])]),i("p",[e._v("A "),i("code",{pre:!0},[e._v("string")]),e._v(" specifying the category into which the track falls. For example, the main video track would have a "),i("code",[e._v("kind")]),e._v(" of "),i("code",[e._v('"main"')]),e._v(".")]),i("h4",{attrs:{id:"type-promisestring-1"}},[i("a",{attrs:{href:"#type-promisestring-1","aria-hidden":"true"}},[e._v("#")]),i("strong",[e._v("Type")]),e._v(": "),i("code",{pre:!0},[e._v("Promise<string>")])]),i("h3",{attrs:{id:"label"}},[i("a",{attrs:{href:"#label","aria-hidden":"true"}},[e._v("#")]),e._v(".label "),i("div",{staticClass:"specs"},[i("i",[e._v("W3C")])])]),i("p",[e._v("A "),i("code",{pre:!0},[e._v("string")]),e._v(" providing a human-readable label for the track. For example, a track whose "),i("code",[e._v("kind")]),e._v(" is "),i("code",[e._v('"sign"')]),e._v(" might have a "),i("code",[e._v("label")]),e._v(" of "),i("code",[e._v('"A sign-language interpretation"')]),e._v(". This string is empty if no label is provided.")]),i("h4",{attrs:{id:"type-promisestring-2"}},[i("a",{attrs:{href:"#type-promisestring-2","aria-hidden":"true"}},[e._v("#")]),i("strong",[e._v("Type")]),e._v(": "),i("code",{pre:!0},[e._v("Promise<string>")])]),i("h3",{attrs:{id:"language"}},[i("a",{attrs:{href:"#language","aria-hidden":"true"}},[e._v("#")]),e._v(".language "),i("div",{staticClass:"specs"},[i("i",[e._v("W3C")])])]),i("p",[e._v("A "),i("code",{pre:!0},[e._v("string")]),e._v(" specifying the video track's primary language, or an empty string if unknown. The language is specified as a BCP 47 ("),i("a",{staticClass:"external",attrs:{href:"https://tools.ietf.org/html/rfc5646",rel:"noopener"}},[e._v("RFC 5646")]),e._v(") language code, such as "),i("code",[e._v('"en-US"')]),e._v(" or "),i("code",[e._v('"pt-BR"')]),e._v(".")]),i("h4",{attrs:{id:"type-promisestring-3"}},[i("a",{attrs:{href:"#type-promisestring-3","aria-hidden":"true"}},[e._v("#")]),i("strong",[e._v("Type")]),e._v(": "),i("code",{pre:!0},[e._v("Promise<string>")])]),i("h3",{attrs:{id:"selected"}},[i("a",{attrs:{href:"#selected","aria-hidden":"true"}},[e._v("#")]),e._v(".selected "),i("div",{staticClass:"specs"},[i("i",[e._v("W3C")])])]),i("p",[e._v("A Boolean value which controls whether or not the video track is active. Only a single video track can be active at any given time, so setting this property to "),i("code",[e._v("true")]),e._v(" for one track while another track is active will make that other track inactive.")]),i("h4",{attrs:{id:"type-promiseboolean"}},[i("a",{attrs:{href:"#type-promiseboolean","aria-hidden":"true"}},[e._v("#")]),i("strong",[e._v("Type")]),e._v(": "),i("code",{pre:!0},[e._v("Promise<boolean>")])])])}),[],!1,null,null,null);"function"==typeof c&&c(l),"function"==typeof _&&_(l);t.default=l.exports},vu0Y:function(e,t,i){"use strict";t.a={name:"VueRemarkRoot",render:function(e){return e("div",null,this.$slots.default)}}}}]);
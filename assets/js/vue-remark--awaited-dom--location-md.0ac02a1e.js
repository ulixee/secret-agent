(window.webpackJsonp=window.webpackJsonp||[]).push([[130],{JKv7:function(t,e,r){"use strict";r.r(e);var i=r("Ow4o"),s=r("vu0Y"),a=r("pLV6");function o(t){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}a.a.config.optionMergeStrategies;var n={VueRemarkRoot:s.a},v=function(t){var e=t.options.components=t.options.components||{},r=t.options.computed=t.options.computed||{};Object.keys(n).forEach((function(t){"object"===o(n[t])&&"function"==typeof n[t].render||"function"==typeof n[t]&&"function"==typeof n[t].options.render?e[t]=n[t]:r[t]=function(){return n[t]}}))},d=a.a.config.optionMergeStrategies,h="__vueRemarkFrontMatter",_={excerpt:null,title:"[AwaitedDOM](/docs/basic-interfaces/awaited-dom) <span>/</span> Location"};var p=function(t){t.options[h]&&(t.options[h]=_),a.a.util.defineReactive(t.options,h,_),t.options.computed=d.computed({$frontmatter:function(){return t.options[h]}},t.options.computed)},c=Object(i.a)({},(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("VueRemarkRoot",[r("h1",{attrs:{id:"awaiteddom-spanspan-location"}},[r("a",{attrs:{href:"#awaiteddom-spanspan-location","aria-hidden":"true"}},[t._v("#")]),r("a",{attrs:{href:"/docs/basic-interfaces/awaited-dom"}},[t._v("AwaitedDOM")]),r("span",[t._v("/")]),t._v(" Location")]),r("div",{staticClass:"overview"},[t._v("The "),r("strong",[r("code",[t._v("Location")])]),t._v(" interface represents the location (URL) of the object it is linked to. Changes done on it are reflected on the object it relates to. Both the "),r("code",[t._v("Document")]),t._v(" and "),r("code",[t._v("Window")]),t._v(" interface have such a linked "),r("code",[t._v("Location")]),t._v(", accessible via "),r("code",[t._v("Document.location")]),t._v(" and "),r("code",[t._v("Window.location")]),t._v(" respectively.")]),r("h2",{attrs:{id:"properties"}},[r("a",{attrs:{href:"#properties","aria-hidden":"true"}},[t._v("#")]),t._v("Properties")]),r("h3",{attrs:{id:"hash"}},[r("a",{attrs:{href:"#hash","aria-hidden":"true"}},[t._v("#")]),t._v(".hash "),r("div",{staticClass:"specs"},[r("i",[t._v("W3C")])])]),r("p",[t._v("Is a "),r("code",{pre:!0},[t._v("string")]),t._v(" containing a "),r("code",[t._v("'#'")]),t._v(" followed by the fragment identifier of the URL.")]),r("h4",{attrs:{id:"type-promisestring"}},[r("a",{attrs:{href:"#type-promisestring","aria-hidden":"true"}},[t._v("#")]),r("strong",[t._v("Type")]),t._v(": "),r("code",{pre:!0},[t._v("Promise<string>")])]),r("h3",{attrs:{id:"host"}},[r("a",{attrs:{href:"#host","aria-hidden":"true"}},[t._v("#")]),t._v(".host "),r("div",{staticClass:"specs"},[r("i",[t._v("W3C")])])]),r("p",[t._v("Is a "),r("code",{pre:!0},[t._v("string")]),t._v(" containing the host, that is the "),r("em",[t._v("hostname")]),t._v(", a "),r("code",[t._v("':'")]),t._v(", and the "),r("em",[t._v("port")]),t._v(" of the URL.")]),r("h4",{attrs:{id:"type-promisestring-1"}},[r("a",{attrs:{href:"#type-promisestring-1","aria-hidden":"true"}},[t._v("#")]),r("strong",[t._v("Type")]),t._v(": "),r("code",{pre:!0},[t._v("Promise<string>")])]),r("h3",{attrs:{id:"hostname"}},[r("a",{attrs:{href:"#hostname","aria-hidden":"true"}},[t._v("#")]),t._v(".hostname "),r("div",{staticClass:"specs"},[r("i",[t._v("W3C")])])]),r("p",[t._v("Is a "),r("code",{pre:!0},[t._v("string")]),t._v(" containing the domain of the URL.")]),r("h4",{attrs:{id:"type-promisestring-2"}},[r("a",{attrs:{href:"#type-promisestring-2","aria-hidden":"true"}},[t._v("#")]),r("strong",[t._v("Type")]),t._v(": "),r("code",{pre:!0},[t._v("Promise<string>")])]),r("h3",{attrs:{id:"href"}},[r("a",{attrs:{href:"#href","aria-hidden":"true"}},[t._v("#")]),t._v(".href "),r("div",{staticClass:"specs"},[r("i",[t._v("W3C")])])]),r("p",[t._v("Is a stringifier that returns a "),r("code",{pre:!0},[t._v("string")]),t._v(" containing the entire URL. If changed, the associated document navigates to the new page. It can be set from a different origin than the associated document.")]),r("h4",{attrs:{id:"type-promisestring-3"}},[r("a",{attrs:{href:"#type-promisestring-3","aria-hidden":"true"}},[t._v("#")]),r("strong",[t._v("Type")]),t._v(": "),r("code",{pre:!0},[t._v("Promise<string>")])]),r("h3",{attrs:{id:"origin"}},[r("a",{attrs:{href:"#origin","aria-hidden":"true"}},[t._v("#")]),t._v(".origin "),r("div",{staticClass:"specs"},[r("i",[t._v("W3C")])])]),r("p",[t._v("Returns a "),r("code",{pre:!0},[t._v("string")]),t._v(" containing the canonical form of the origin of the specific location.")]),r("h4",{attrs:{id:"type-promisestring-4"}},[r("a",{attrs:{href:"#type-promisestring-4","aria-hidden":"true"}},[t._v("#")]),r("strong",[t._v("Type")]),t._v(": "),r("code",{pre:!0},[t._v("Promise<string>")])]),r("h3",{attrs:{id:"pathname"}},[r("a",{attrs:{href:"#pathname","aria-hidden":"true"}},[t._v("#")]),t._v(".pathname "),r("div",{staticClass:"specs"},[r("i",[t._v("W3C")])])]),r("p",[t._v("Is a "),r("code",{pre:!0},[t._v("string")]),t._v(" containing an initial "),r("code",[t._v("'/'")]),t._v(" followed by the path of the URL.")]),r("h4",{attrs:{id:"type-promisestring-5"}},[r("a",{attrs:{href:"#type-promisestring-5","aria-hidden":"true"}},[t._v("#")]),r("strong",[t._v("Type")]),t._v(": "),r("code",{pre:!0},[t._v("Promise<string>")])]),r("h3",{attrs:{id:"port"}},[r("a",{attrs:{href:"#port","aria-hidden":"true"}},[t._v("#")]),t._v(".port "),r("div",{staticClass:"specs"},[r("i",[t._v("W3C")])])]),r("p",[t._v("Is a "),r("code",{pre:!0},[t._v("string")]),t._v(" containing the port number of the URL.")]),r("h4",{attrs:{id:"type-promisestring-6"}},[r("a",{attrs:{href:"#type-promisestring-6","aria-hidden":"true"}},[t._v("#")]),r("strong",[t._v("Type")]),t._v(": "),r("code",{pre:!0},[t._v("Promise<string>")])]),r("h3",{attrs:{id:"protocol"}},[r("a",{attrs:{href:"#protocol","aria-hidden":"true"}},[t._v("#")]),t._v(".protocol "),r("div",{staticClass:"specs"},[r("i",[t._v("W3C")])])]),r("p",[t._v("Is a "),r("code",{pre:!0},[t._v("string")]),t._v(" containing the protocol scheme of the URL, including the final "),r("code",[t._v("':'")]),t._v(".")]),r("h4",{attrs:{id:"type-promisestring-7"}},[r("a",{attrs:{href:"#type-promisestring-7","aria-hidden":"true"}},[t._v("#")]),r("strong",[t._v("Type")]),t._v(": "),r("code",{pre:!0},[t._v("Promise<string>")])]),r("h3",{attrs:{id:"search"}},[r("a",{attrs:{href:"#search","aria-hidden":"true"}},[t._v("#")]),t._v(".search "),r("div",{staticClass:"specs"},[r("i",[t._v("W3C")])])]),r("p",[t._v("Is a "),r("code",{pre:!0},[t._v("string")]),t._v(" containing a "),r("code",[t._v("'?'")]),t._v(' followed by the parameters or "querystring" of the URL. Modern browsers provide URLSearchParams and URL.searchParams to make it easy to parse out the parameters from the querystring.')]),r("h4",{attrs:{id:"type-promisestring-8"}},[r("a",{attrs:{href:"#type-promisestring-8","aria-hidden":"true"}},[t._v("#")]),r("strong",[t._v("Type")]),t._v(": "),r("code",{pre:!0},[t._v("Promise<string>")])]),r("h2",{attrs:{id:"methods"}},[r("a",{attrs:{href:"#methods","aria-hidden":"true"}},[t._v("#")]),t._v("Methods")]),r("h3",{attrs:{id:"assign"}},[r("a",{attrs:{href:"#assign","aria-hidden":"true"}},[t._v("#")]),t._v(".assign"),r("em",[t._v("(url)")]),r("div",{staticClass:"specs"},[r("i",[t._v("W3C")])])]),r("p",[t._v("Loads the resource at the URL provided in parameter.")]),r("h4",{attrs:{id:"arguments"}},[r("a",{attrs:{href:"#arguments","aria-hidden":"true"}},[t._v("#")]),r("strong",[t._v("Arguments")]),t._v(":")]),r("ul",[r("li",[t._v("url "),r("code",{pre:!0},[t._v("string")]),t._v(". Is a "),r("code",{pre:!0},[t._v("string")]),t._v(" containing the URL of the page to navigate to.")])]),r("h4",{attrs:{id:"returns-promisevoid"}},[r("a",{attrs:{href:"#returns-promisevoid","aria-hidden":"true"}},[t._v("#")]),r("strong",[t._v("Returns")]),t._v(": "),r("code",{pre:!0},[t._v("Promise<void>")])]),r("h3",{attrs:{id:"reload"}},[r("a",{attrs:{href:"#reload","aria-hidden":"true"}},[t._v("#")]),t._v(".reload"),r("em",[t._v("()")]),r("div",{staticClass:"specs"},[r("i",[t._v("W3C")])])]),r("p",[t._v("Reloads the resource from the current URL. Its optional unique parameter is a "),r("code",{pre:!0},[t._v("boolean")]),t._v(", which, when it is "),r("code",[t._v("true")]),t._v(", causes the page to always be reloaded from the server. If it is "),r("code",[t._v("false")]),t._v(" or not specified, the browser may reload the page from its cache.")]),r("h4",{attrs:{id:"returns-promisevoid-1"}},[r("a",{attrs:{href:"#returns-promisevoid-1","aria-hidden":"true"}},[t._v("#")]),r("strong",[t._v("Returns")]),t._v(": "),r("code",{pre:!0},[t._v("Promise<void>")])]),r("h3",{attrs:{id:"replace"}},[r("a",{attrs:{href:"#replace","aria-hidden":"true"}},[t._v("#")]),t._v(".replace"),r("em",[t._v("(url)")]),r("div",{staticClass:"specs"},[r("i",[t._v("W3C")])])]),r("p",[t._v("Replaces the current resource with the one at the provided URL. The difference from the "),r("code",[t._v("assign()")]),t._v(" method is that after using "),r("code",[t._v("replace()")]),t._v(" the current page will not be saved in session "),r("code",[t._v("History")]),t._v(", meaning the user won't be able to use the "),r("em",[t._v("back")]),t._v(" button to navigate to it.")]),r("h4",{attrs:{id:"arguments-1"}},[r("a",{attrs:{href:"#arguments-1","aria-hidden":"true"}},[t._v("#")]),r("strong",[t._v("Arguments")]),t._v(":")]),r("ul",[r("li",[t._v("url "),r("code",{pre:!0},[t._v("string")]),t._v(". Is a "),r("code",{pre:!0},[t._v("string")]),t._v(" containing the URL of the page to navigate to.")])]),r("h4",{attrs:{id:"returns-promisevoid-2"}},[r("a",{attrs:{href:"#returns-promisevoid-2","aria-hidden":"true"}},[t._v("#")]),r("strong",[t._v("Returns")]),t._v(": "),r("code",{pre:!0},[t._v("Promise<void>")])]),r("h3",{attrs:{id:"toString"}},[r("a",{attrs:{href:"#toString","aria-hidden":"true"}},[t._v("#")]),t._v(".toString"),r("em",[t._v("()")]),r("div",{staticClass:"specs"},[r("i",[t._v("W3C")])])]),r("p",[t._v("Returns a "),r("code",{pre:!0},[t._v("string")]),t._v(" containing the whole URL. It is a synonym for "),r("code",[t._v("HTMLHyperlinkElementUtils.href")]),t._v(", though it can't be used to modify the value.")]),r("h4",{attrs:{id:"returns-promisestring"}},[r("a",{attrs:{href:"#returns-promisestring","aria-hidden":"true"}},[t._v("#")]),r("strong",[t._v("Returns")]),t._v(": "),r("code",{pre:!0},[t._v("Promise<string>")])])])}),[],!1,null,null,null);"function"==typeof v&&v(c),"function"==typeof p&&p(c);e.default=c.exports},vu0Y:function(t,e,r){"use strict";e.a={name:"VueRemarkRoot",render:function(t){return t("div",null,this.$slots.default)}}}}]);
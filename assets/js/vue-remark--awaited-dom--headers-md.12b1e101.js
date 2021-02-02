(window.webpackJsonp=window.webpackJsonp||[]).push([[50],{lUZl:function(e,t,r){"use strict";r.r(t);var a=r("Ow4o"),s=r("vu0Y"),o=r("pLV6");function n(e){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}o.a.config.optionMergeStrategies;var i={VueRemarkRoot:s.a},d=function(e){var t=e.options.components=e.options.components||{},r=e.options.computed=e.options.computed||{};Object.keys(i).forEach((function(e){"object"===n(i[e])&&"function"==typeof i[e].render||"function"==typeof i[e]&&"function"==typeof i[e].options.render?t[e]=i[e]:r[e]=function(){return i[e]}}))},v=o.a.config.optionMergeStrategies,_="__vueRemarkFrontMatter",h={excerpt:null,title:"[AwaitedDOM](/docs/basic-interfaces/awaited-dom) <span>/</span> Headers"};var u=function(e){e.options[_]&&(e.options[_]=h),o.a.util.defineReactive(e.options,_,h),e.options.computed=v.computed({$frontmatter:function(){return e.options[_]}},e.options.computed)},c=Object(a.a)({},(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("VueRemarkRoot",[r("h1",{attrs:{id:"awaiteddom-spanspan-headers"}},[r("a",{attrs:{href:"#awaiteddom-spanspan-headers","aria-hidden":"true"}},[e._v("#")]),r("a",{attrs:{href:"/docs/basic-interfaces/awaited-dom"}},[e._v("AwaitedDOM")]),r("span",[e._v("/")]),e._v(" Headers")]),r("div",{staticClass:"overview"},[r("span",{staticClass:"seoSummary"},[e._v("The "),r("strong",[r("code",[e._v("Headers")])]),e._v(" interface of the Fetch API allows you to perform various actions on HTTP request and response headers. These actions include retrieving, setting, adding to, and removing headers from the list of the request's headers.")]),e._v(" A "),r("code",[e._v("Headers")]),e._v(" object has an associated header list, which is initially empty and consists of zero or more name and value pairs.  "),r("span",{staticStyle:{"line-height":"19.0909080505371px"}},[e._v("You can add to this using methods like "),r("code",[e._v("append()")]),e._v(" (see "),r("a",{attrs:{href:"#Examples"}},[e._v("Examples")]),e._v(".) ")]),e._v("In all methods of this interface, header names are matched by case-insensitive byte sequence. ")]),r("div",{staticClass:"overview"},[e._v("For security reasons, some headers can only be controlled by the user agent. These headers include the forbidden header names  and forbidden response header names.")]),r("div",{staticClass:"overview"},[e._v("A Headers object also has an associated guard, which takes a value of "),r("code",[e._v("immutable")]),e._v(", "),r("code",[e._v("request")]),e._v(", "),r("code",[e._v("request-no-cors")]),e._v(", "),r("code",[e._v("response")]),e._v(", or "),r("code",[e._v("none")]),e._v(". This affects whether the "),r("code",[e._v("set()")]),e._v(", "),r("code",[e._v("delete()")]),e._v(", and "),r("code",[e._v("append()")]),e._v(" methods will mutate the header. For more information see Guard.")]),r("div",{staticClass:"overview"},[e._v("You can retrieve a "),r("code",[e._v("Headers")]),e._v(" object via the "),r("code",[e._v("Request.headers")]),e._v(" and "),r("code",[e._v("Response.headers")]),e._v(" properties, and create a new "),r("code",[e._v("Headers")]),e._v(" object using the "),r("code",[e._v("Headers.Headers()")]),e._v(" constructor.")]),r("div",{staticClass:"overview"},[e._v("An object implementing "),r("code",[e._v("Headers")]),e._v(" can directly be used in a "),r("code",[e._v("for...of")]),e._v(" structure, instead of "),r("code",[e._v("entries()")]),e._v(": "),r("code",[e._v("for (var p of myHeaders)")]),e._v(" is equivalent to "),r("code",[e._v("for (var p of myHeaders.entries())")]),e._v(".")]),r("h2",{attrs:{id:"methods"}},[r("a",{attrs:{href:"#methods","aria-hidden":"true"}},[e._v("#")]),e._v("Methods")]),r("h3",{attrs:{id:"append"}},[r("a",{attrs:{href:"#append","aria-hidden":"true"}},[e._v("#")]),e._v(".append"),r("em",[e._v("(name, value)")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Appends a new value onto an existing header inside a "),r("code",[e._v("Headers")]),e._v(" object, or adds the header if it does not already exist.")]),r("h4",{attrs:{id:"arguments"}},[r("a",{attrs:{href:"#arguments","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Arguments")]),e._v(":")]),r("ul",[r("li",[e._v("name "),r("code",{pre:!0},[e._v("string")]),e._v(". The name of the HTTP header you want to add to the "),r("code",[e._v("Headers")]),e._v(" object.")]),r("li",[e._v("value "),r("code",{pre:!0},[e._v("string")]),e._v(". The value of the HTTP header you want to add.")])]),r("h4",{attrs:{id:"returns-promisevoid"}},[r("a",{attrs:{href:"#returns-promisevoid","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<void>")])]),r("h3",{attrs:{id:"delete"}},[r("a",{attrs:{href:"#delete","aria-hidden":"true"}},[e._v("#")]),e._v(".delete"),r("em",[e._v("(name)")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Deletes a header from a "),r("code",[e._v("Headers")]),e._v(" object.")]),r("h4",{attrs:{id:"arguments-1"}},[r("a",{attrs:{href:"#arguments-1","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Arguments")]),e._v(":")]),r("ul",[r("li",[e._v("name "),r("code",{pre:!0},[e._v("string")]),e._v(". The name of the HTTP header you want to delete from the "),r("code",[e._v("Headers")]),e._v(" object.")])]),r("h4",{attrs:{id:"returns-promisevoid-1"}},[r("a",{attrs:{href:"#returns-promisevoid-1","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<void>")])]),r("h3",{attrs:{id:"entries"}},[r("a",{attrs:{href:"#entries","aria-hidden":"true"}},[e._v("#")]),e._v(".entries"),r("em",[e._v("()")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns an "),r("code",[e._v("iterator")]),e._v(" allowing to go through all key/value pairs contained in this object.")]),r("h4",{attrs:{id:"returns-promise"}},[r("a",{attrs:{href:"#returns-promise","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<>")])]),r("h3",{attrs:{id:"forEach"}},[r("a",{attrs:{href:"#forEach","aria-hidden":"true"}},[e._v("#")]),e._v(".forEach"),r("em",[e._v("()")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Executes a provided function once for each array element.")]),r("h4",{attrs:{id:"returns-promise-1"}},[r("a",{attrs:{href:"#returns-promise-1","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<>")])]),r("h3",{attrs:{id:"get"}},[r("a",{attrs:{href:"#get","aria-hidden":"true"}},[e._v("#")]),e._v(".get"),r("em",[e._v("(name)")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns a "),r("code",[e._v("ByteString")]),e._v(" sequence of all the values of a header within a "),r("code",[e._v("Headers")]),e._v(" object with a given name.")]),r("h4",{attrs:{id:"arguments-2"}},[r("a",{attrs:{href:"#arguments-2","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Arguments")]),e._v(":")]),r("ul",[r("li",[e._v("name "),r("code",{pre:!0},[e._v("string")]),e._v(". The name of the HTTP header whose values you want to retrieve from the "),r("code",[e._v("Headers")]),e._v(" object. If the given name is not the name of an HTTP header, this method throws a "),r("code",[e._v("TypeError")]),e._v(". The name is case-insensitive.")])]),r("h4",{attrs:{id:"returns-promisestring"}},[r("a",{attrs:{href:"#returns-promisestring","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<string>")])]),r("h3",{attrs:{id:"has"}},[r("a",{attrs:{href:"#has","aria-hidden":"true"}},[e._v("#")]),e._v(".has"),r("em",[e._v("(name)")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns a boolean stating whether a "),r("code",[e._v("Headers")]),e._v(" object contains a certain header.")]),r("h4",{attrs:{id:"arguments-3"}},[r("a",{attrs:{href:"#arguments-3","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Arguments")]),e._v(":")]),r("ul",[r("li",[e._v("name "),r("code",{pre:!0},[e._v("string")]),e._v(". The name of the HTTP header you want to test for. If the given name is not a valid HTTP header name, this method throws a "),r("code",[e._v("TypeError")]),e._v(".")])]),r("h4",{attrs:{id:"returns-promiseboolean"}},[r("a",{attrs:{href:"#returns-promiseboolean","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<boolean>")])]),r("h3",{attrs:{id:"keys"}},[r("a",{attrs:{href:"#keys","aria-hidden":"true"}},[e._v("#")]),e._v(".keys"),r("em",[e._v("()")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns an "),r("code",[e._v("iterator")]),e._v(" allowing you to go through all keys of the key/value pairs contained in this object.")]),r("h4",{attrs:{id:"returns-promise-2"}},[r("a",{attrs:{href:"#returns-promise-2","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<>")])]),r("h3",{attrs:{id:"set"}},[r("a",{attrs:{href:"#set","aria-hidden":"true"}},[e._v("#")]),e._v(".set"),r("em",[e._v("(name, value)")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Sets a new value for an existing header inside a "),r("code",[e._v("Headers")]),e._v(" object, or adds the header if it does not already exist.")]),r("h4",{attrs:{id:"arguments-4"}},[r("a",{attrs:{href:"#arguments-4","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Arguments")]),e._v(":")]),r("ul",[r("li",[e._v("name "),r("code",{pre:!0},[e._v("string")]),e._v(". The name of the HTTP header you want to set to a new value. If the given name is not the name of an HTTP header, this method throws a "),r("code",[e._v("TypeError")]),e._v(".")]),r("li",[e._v("value "),r("code",{pre:!0},[e._v("string")]),e._v(". The new value you want to set.")])]),r("h4",{attrs:{id:"returns-promisevoid-2"}},[r("a",{attrs:{href:"#returns-promisevoid-2","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<void>")])]),r("h3",{attrs:{id:"values"}},[r("a",{attrs:{href:"#values","aria-hidden":"true"}},[e._v("#")]),e._v(".values"),r("em",[e._v("()")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns an "),r("code",[e._v("iterator")]),e._v(" allowing you to go through all values of the key/value pairs contained in this object.")]),r("h4",{attrs:{id:"returns-promise-3"}},[r("a",{attrs:{href:"#returns-promise-3","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<>")])])])}),[],!1,null,null,null);"function"==typeof d&&d(c),"function"==typeof u&&u(c);t.default=c.exports},vu0Y:function(e,t,r){"use strict";t.a={name:"VueRemarkRoot",render:function(e){return e("div",null,this.$slots.default)}}}}]);
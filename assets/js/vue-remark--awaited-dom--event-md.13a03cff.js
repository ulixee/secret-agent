(window.webpackJsonp=window.webpackJsonp||[]).push([[42],{g7Zn:function(e,t,n){"use strict";n.r(t);var o=n("Ow4o"),r=n("vu0Y"),a=n("pLV6");function s(e){return(s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}a.a.config.optionMergeStrategies;var i={VueRemarkRoot:r.a},d=function(e){var t=e.options.components=e.options.components||{},n=e.options.computed=e.options.computed||{};Object.keys(i).forEach((function(e){"object"===s(i[e])&&"function"==typeof i[e].render||"function"==typeof i[e]&&"function"==typeof i[e].options.render?t[e]=i[e]:n[e]=function(){return i[e]}}))},c=a.a.config.optionMergeStrategies,v="__vueRemarkFrontMatter",p={excerpt:null,title:"[AwaitedDOM](/docs/basic-interfaces/awaited-dom) <span>/</span> Event"};var l=function(e){e.options[v]&&(e.options[v]=p),a.a.util.defineReactive(e.options,v,p),e.options.computed=c.computed({$frontmatter:function(){return e.options[v]}},e.options.computed)},h=Object(o.a)({},(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("VueRemarkRoot",[n("h1",{attrs:{id:"awaiteddom-spanspan-event"}},[n("a",{attrs:{href:"#awaiteddom-spanspan-event","aria-hidden":"true"}},[e._v("#")]),n("a",{attrs:{href:"/docs/basic-interfaces/awaited-dom"}},[e._v("AwaitedDOM")]),n("span",[e._v("/")]),e._v(" Event")]),n("div",{staticClass:"overview"},[n("span",{staticClass:"seoSummary"},[e._v("The "),n("code",[n("strong",[e._v("Event")])]),e._v(" interface represents an event which takes place in the DOM.")])]),n("div",{staticClass:"overview"},[e._v("An event can be triggered by the user action e.g. clicking the mouse button or tapping keyboard, or generated by APIs to represent the progress of an asynchronous task. It can also be triggered programmatically, such as by calling the "),n("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/click",title:"The HTMLElement.click() method simulates a mouse click&nbsp;on an element."}},[n("code",[e._v("HTMLElement.click()")])]),e._v(" method of an element, or by defining the event, then sending it to a specified target using "),n("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent",title:"Dispatches an Event at the specified EventTarget, (synchronously) invoking the affected EventListeners in the appropriate order. The normal event processing rules (including the capturing and optional bubbling phase) also apply to events dispatched manually with dispatchEvent()."}},[n("code",[e._v("EventTarget.dispatchEvent()")])]),e._v(".")]),n("div",{staticClass:"overview"},[e._v("There are many types of events, some of which use other interfaces based on the main "),n("code",[e._v("Event")]),e._v(" interface. "),n("code",[e._v("Event")]),e._v(" itself contains the properties and methods which are common to all events.")]),n("div",{staticClass:"overview"},[e._v('Many DOM elements can be set up to accept (or "listen" for) these events, and execute code in response to process (or "handle") them. Event-handlers are usually connected (or "attached") to various '),n("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/HTML/Element"}},[e._v("HTML elements")]),e._v(" (such as "),n("code",[e._v("<button>")]),e._v(", "),n("code",[e._v("<div>")]),e._v(", "),n("code",[e._v("<span>")]),e._v(", etc.) using "),n("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener",title:"The EventTarget method addEventListener() sets up a function that will be&nbsp;called whenever the specified event is delivered to the target."}},[n("code",[e._v("EventTarget.addEventListener()")])]),e._v(", and this generally replaces using the old HTML "),n("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/HTML/Global_attributes"}},[e._v("event handler attributes")]),e._v(". Further, when properly added, such handlers can also be disconnected if needed using "),n("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener",title:"The EventTarget.removeEventListener() method removes from the&nbsp;EventTarget an event listener previously registered with EventTarget.addEventListener(). The event listener to be removed is identified using a combination of the event type, the event listener function itself, and various optional options that may affect the matching process; see Matching event listeners for removal"}},[n("code",[e._v("removeEventListener()")])]),e._v(".")]),n("h2",{attrs:{id:"unimplemented-specs"}},[n("a",{attrs:{href:"#unimplemented-specs","aria-hidden":"true"}},[e._v("#")]),e._v("Unimplemented Specs")]),n("h4",{attrs:{id:"properties"}},[n("a",{attrs:{href:"#properties","aria-hidden":"true"}},[e._v("#")]),e._v("Properties")]),n("table",[n("thead",[n("tr",[n("th"),n("th")])]),n("tbody",[n("tr",[n("td",[n("code",{pre:!0},[e._v("bubbles")])]),n("td",[n("code",{pre:!0},[e._v("cancelable")])])]),n("tr",[n("td",[n("code",{pre:!0},[e._v("cancelBubble")])]),n("td",[n("code",{pre:!0},[e._v("composed")])])]),n("tr",[n("td",[n("code",{pre:!0},[e._v("currentTarget")])]),n("td",[n("code",{pre:!0},[e._v("defaultPrevented")])])]),n("tr",[n("td",[n("code",{pre:!0},[e._v("eventPhase")])]),n("td",[n("code",{pre:!0},[e._v("isTrusted")])])]),n("tr",[n("td",[n("code",{pre:!0},[e._v("target")])]),n("td",[n("code",{pre:!0},[e._v("timeStamp")])])]),n("tr",[n("td",[n("code",{pre:!0},[e._v("type")])]),n("td")])])]),n("h4",{attrs:{id:"methods"}},[n("a",{attrs:{href:"#methods","aria-hidden":"true"}},[e._v("#")]),e._v("Methods")]),n("table",[n("thead",[n("tr",[n("th"),n("th")])]),n("tbody",[n("tr",[n("td",[n("code",{pre:!0},[e._v("composedPath()")])]),n("td",[n("code",{pre:!0},[e._v("initEvent()")])])]),n("tr",[n("td",[n("code",{pre:!0},[e._v("preventDefault()")])]),n("td",[n("code",{pre:!0},[e._v("stopImmediatePropagation()")])])]),n("tr",[n("td",[n("code",{pre:!0},[e._v("stopPropagation()")])]),n("td")])])])])}),[],!1,null,null,null);"function"==typeof d&&d(h),"function"==typeof l&&l(h);t.default=h.exports},vu0Y:function(e,t,n){"use strict";t.a={name:"VueRemarkRoot",render:function(e){return e("div",null,this.$slots.default)}}}}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[147],{oP2T:function(e,t,r){"use strict";r.r(t);var o=r("Ow4o"),s=r("vu0Y"),i=r("pLV6");function a(e){return(a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}i.a.config.optionMergeStrategies;var n={VueRemarkRoot:s.a},d=function(e){var t=e.options.components=e.options.components||{},r=e.options.computed=e.options.computed||{};Object.keys(n).forEach((function(e){"object"===a(n[e])&&"function"==typeof n[e].render||"function"==typeof n[e]&&"function"==typeof n[e].options.render?t[e]=n[e]:r[e]=function(){return n[e]}}))},v=i.a.config.optionMergeStrategies,_="__vueRemarkFrontMatter",c={excerpt:null,title:"[AwaitedDOM](/docs/basic-interfaces/awaited-dom) <span>/</span> Selection"};var h=function(e){e.options[_]&&(e.options[_]=c),i.a.util.defineReactive(e.options,_,c),e.options.computed=v.computed({$frontmatter:function(){return e.options[_]}},e.options.computed)},u=Object(o.a)({},(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("VueRemarkRoot",[r("h1",{attrs:{id:"awaiteddom-spanspan-selection"}},[r("a",{attrs:{href:"#awaiteddom-spanspan-selection","aria-hidden":"true"}},[e._v("#")]),r("a",{attrs:{href:"/docs/basic-interfaces/awaited-dom"}},[e._v("AwaitedDOM")]),r("span",[e._v("/")]),e._v(" Selection")]),r("div",{staticClass:"overview"},[r("strong",[e._v("This is an experimental technology")]),r("br"),e._v("Check the "),r("a",{attrs:{href:"#Browser_compatibility"}},[e._v("Browser compatibility table")]),e._v(" carefully before using this in production.")]),r("h2",{attrs:{id:"properties"}},[r("a",{attrs:{href:"#properties","aria-hidden":"true"}},[e._v("#")]),e._v("Properties")]),r("h3",{attrs:{id:"anchorNode"}},[r("a",{attrs:{href:"#anchorNode","aria-hidden":"true"}},[e._v("#")]),e._v(".anchorNode "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns the "),r("code",[e._v("Node")]),e._v(" in which the selection begins. Can return "),r("code",[e._v("null")]),e._v(" if selection never existed in the document (e.g., an iframe that was never clicked on).")]),r("h4",{attrs:{id:"type-supernode"}},[r("a",{attrs:{href:"#type-supernode","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("a",{attrs:{href:"./super-node"}},[r("code",{pre:!0},[e._v("SuperNode")])])]),r("h3",{attrs:{id:"anchorOffset"}},[r("a",{attrs:{href:"#anchorOffset","aria-hidden":"true"}},[e._v("#")]),e._v(".anchorOffset "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns a number representing the offset of the selection's anchor within the "),r("code",[e._v("anchorNode")]),e._v(". If "),r("code",[e._v("anchorNode")]),e._v(" is a text node, this is the number of characters within anchorNode preceding the anchor. If "),r("code",[e._v("anchorNode")]),e._v(" is an element, this is the number of child nodes of the "),r("code",[e._v("anchorNode")]),e._v(" preceding the anchor.")]),r("h4",{attrs:{id:"type-promisenumber"}},[r("a",{attrs:{href:"#type-promisenumber","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<number>")])]),r("h3",{attrs:{id:"focusNode"}},[r("a",{attrs:{href:"#focusNode","aria-hidden":"true"}},[e._v("#")]),e._v(".focusNode "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns the "),r("code",[e._v("Node")]),e._v(" in which the selection ends. Can return "),r("code",[e._v("null")]),e._v(" if selection never existed in the document (for example, in an "),r("code",[e._v("iframe")]),e._v(" that was never clicked on).")]),r("h4",{attrs:{id:"type-supernode-1"}},[r("a",{attrs:{href:"#type-supernode-1","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("a",{attrs:{href:"./super-node"}},[r("code",{pre:!0},[e._v("SuperNode")])])]),r("h3",{attrs:{id:"focusOffset"}},[r("a",{attrs:{href:"#focusOffset","aria-hidden":"true"}},[e._v("#")]),e._v(".focusOffset "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns a number representing the offset of the selection's anchor within the "),r("code",[e._v("focusNode")]),e._v(". If "),r("code",[e._v("focusNode")]),e._v(" is a text node, this is the number of characters within "),r("code",[e._v("focusNode")]),e._v(" preceding the focus. If "),r("code",[e._v("focusNode")]),e._v(" is an element, this is the number of child nodes of the "),r("code",[e._v("focusNode")]),e._v(" preceding the focus.")]),r("h4",{attrs:{id:"type-promisenumber-1"}},[r("a",{attrs:{href:"#type-promisenumber-1","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<number>")])]),r("h3",{attrs:{id:"isCollapsed"}},[r("a",{attrs:{href:"#isCollapsed","aria-hidden":"true"}},[e._v("#")]),e._v(".isCollapsed "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns a Boolean indicating whether the selection's start and end points are at the same position.")]),r("h4",{attrs:{id:"type-promiseboolean"}},[r("a",{attrs:{href:"#type-promiseboolean","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<boolean>")])]),r("h3",{attrs:{id:"rangeCount"}},[r("a",{attrs:{href:"#rangeCount","aria-hidden":"true"}},[e._v("#")]),e._v(".rangeCount "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns the number of ranges in the selection.")]),r("h4",{attrs:{id:"type-promisenumber-2"}},[r("a",{attrs:{href:"#type-promisenumber-2","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<number>")])]),r("h3",{attrs:{id:"type"}},[r("a",{attrs:{href:"#type","aria-hidden":"true"}},[e._v("#")]),e._v(".type "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns a "),r("code",{pre:!0},[e._v("string")]),e._v(" describing the type of the current selection.")]),r("h4",{attrs:{id:"type-promisestring"}},[r("a",{attrs:{href:"#type-promisestring","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<string>")])]),r("h2",{attrs:{id:"methods"}},[r("a",{attrs:{href:"#methods","aria-hidden":"true"}},[e._v("#")]),e._v("Methods")]),r("h3",{attrs:{id:"addRange"}},[r("a",{attrs:{href:"#addRange","aria-hidden":"true"}},[e._v("#")]),e._v(".addRange"),r("em",[e._v("(range)")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("A "),r("code",[e._v("Range")]),e._v(" object that will be added to the selection.")]),r("h4",{attrs:{id:"arguments"}},[r("a",{attrs:{href:"#arguments","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Arguments")]),e._v(":")]),r("ul",[r("li",[e._v("range "),r("a",{attrs:{href:"./range"}},[r("code",{pre:!0},[e._v("Range")])]),e._v(". A "),r("code",[e._v("Range")]),e._v(" object that will be added to the "),r("code",[e._v("Selection")]),e._v(".")])]),r("h4",{attrs:{id:"returns-promisevoid"}},[r("a",{attrs:{href:"#returns-promisevoid","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<void>")])]),r("h3",{attrs:{id:"collapse"}},[r("a",{attrs:{href:"#collapse","aria-hidden":"true"}},[e._v("#")]),e._v(".collapse"),r("em",[e._v("(node, offset?)")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Collapses the current selection to a single point.")]),r("h4",{attrs:{id:"arguments-1"}},[r("a",{attrs:{href:"#arguments-1","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Arguments")]),e._v(":")]),r("ul",[r("li",[e._v("node "),r("a",{attrs:{href:"./node"}},[r("code",{pre:!0},[e._v("Node")])]),e._v(". The caret location will be within this node. This value can also be set to "),r("code",[e._v("null")]),e._v(" — if "),r("code",[e._v("null")]),e._v(" is specified, the method will behave like "),r("code",[e._v("Selection.removeAllRanges()")]),e._v(", i.e. all ranges will be removed from the selection.")]),r("li",[e._v("offset "),r("code",{pre:!0},[e._v("number")]),e._v(". The offset in "),r("code",[e._v("node")]),e._v(" to which the selection will be collapsed. If not specified, the default value "),r("code",[e._v("0")]),e._v(" is used.")])]),r("h4",{attrs:{id:"returns-promisevoid-1"}},[r("a",{attrs:{href:"#returns-promisevoid-1","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<void>")])]),r("h3",{attrs:{id:"collapseToEnd"}},[r("a",{attrs:{href:"#collapseToEnd","aria-hidden":"true"}},[e._v("#")]),e._v(".collapseToEnd"),r("em",[e._v("()")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Collapses the selection to the end of the last range in the selection.")]),r("h4",{attrs:{id:"returns-promisevoid-2"}},[r("a",{attrs:{href:"#returns-promisevoid-2","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<void>")])]),r("h3",{attrs:{id:"collapseToStart"}},[r("a",{attrs:{href:"#collapseToStart","aria-hidden":"true"}},[e._v("#")]),e._v(".collapseToStart"),r("em",[e._v("()")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Collapses the selection to the start of the first range in the selection.")]),r("h4",{attrs:{id:"returns-promisevoid-3"}},[r("a",{attrs:{href:"#returns-promisevoid-3","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<void>")])]),r("h3",{attrs:{id:"containsNode"}},[r("a",{attrs:{href:"#containsNode","aria-hidden":"true"}},[e._v("#")]),e._v(".containsNode"),r("em",[e._v("(node, allowPartialContainment?)")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Indicates if a certain node is part of the selection.")]),r("h4",{attrs:{id:"arguments-2"}},[r("a",{attrs:{href:"#arguments-2","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Arguments")]),e._v(":")]),r("ul",[r("li",[e._v("node "),r("a",{attrs:{href:"./node"}},[r("code",{pre:!0},[e._v("Node")])]),e._v(". The node that is being looked for in the selection.")]),r("li",[e._v("allowPartialContainment "),r("code",{pre:!0},[e._v("boolean")]),e._v(". When "),r("code",[e._v("true")]),e._v(", "),r("code",[e._v("containsNode()")]),e._v(" returns "),r("code",[e._v("true")]),e._v(" when a part of the node is part of the selection. When "),r("code",[e._v("false")]),e._v(", "),r("code",[e._v("containsNode()")]),e._v(" only returns "),r("code",[e._v("true")]),e._v(" when the entire node is part of the selection. If not specified, the default value "),r("code",[e._v("false")]),e._v(" is used.")])]),r("h4",{attrs:{id:"returns-promiseboolean"}},[r("a",{attrs:{href:"#returns-promiseboolean","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<boolean>")])]),r("h3",{attrs:{id:"deleteFromDocument"}},[r("a",{attrs:{href:"#deleteFromDocument","aria-hidden":"true"}},[e._v("#")]),e._v(".deleteFromDocument"),r("em",[e._v("()")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Deletes the selection's content from the document.")]),r("h4",{attrs:{id:"returns-promisevoid-4"}},[r("a",{attrs:{href:"#returns-promisevoid-4","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<void>")])]),r("h3",{attrs:{id:"empty"}},[r("a",{attrs:{href:"#empty","aria-hidden":"true"}},[e._v("#")]),e._v(".empty"),r("em",[e._v("()")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Removes all ranges from the selection. This is an alias for "),r("code",[e._v("removeAllRanges()")]),e._v(" — See "),r("code",[e._v("Selection.removeAllRanges()")]),e._v(" for more details.")]),r("h4",{attrs:{id:"returns-promisevoid-5"}},[r("a",{attrs:{href:"#returns-promisevoid-5","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<void>")])]),r("h3",{attrs:{id:"extend"}},[r("a",{attrs:{href:"#extend","aria-hidden":"true"}},[e._v("#")]),e._v(".extend"),r("em",[e._v("(node, offset?)")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Moves the focus of the selection to a specified point.")]),r("h4",{attrs:{id:"arguments-3"}},[r("a",{attrs:{href:"#arguments-3","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Arguments")]),e._v(":")]),r("ul",[r("li",[e._v("node "),r("a",{attrs:{href:"./node"}},[r("code",{pre:!0},[e._v("Node")])]),e._v(". The node within which the focus will be moved.")]),r("li",[e._v("offset "),r("code",{pre:!0},[e._v("number")]),e._v(". The offset position within "),r("code",[e._v("node")]),e._v(" where the focus will be moved to. If not specified, the default value "),r("code",[e._v("0")]),e._v(" is used.")])]),r("h4",{attrs:{id:"returns-promisevoid-6"}},[r("a",{attrs:{href:"#returns-promisevoid-6","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<void>")])]),r("h3",{attrs:{id:"getRangeAt"}},[r("a",{attrs:{href:"#getRangeAt","aria-hidden":"true"}},[e._v("#")]),e._v(".getRangeAt"),r("em",[e._v("(index)")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns a "),r("code",[e._v("Range")]),e._v(" object representing one of the ranges currently selected.")]),r("h4",{attrs:{id:"arguments-4"}},[r("a",{attrs:{href:"#arguments-4","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Arguments")]),e._v(":")]),r("ul",[r("li",[e._v("index "),r("code",{pre:!0},[e._v("number")]),e._v(". The zero-based index of the range to return. A negative number or a number greater than or equal to "),r("code",[e._v("Selection.rangeCount")]),e._v(" will result in an error.")])]),r("h4",{attrs:{id:"returns-range"}},[r("a",{attrs:{href:"#returns-range","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("a",{attrs:{href:"./range"}},[r("code",{pre:!0},[e._v("Range")])])]),r("h3",{attrs:{id:"modify"}},[r("a",{attrs:{href:"#modify","aria-hidden":"true"}},[e._v("#")]),e._v(".modify"),r("em",[e._v("(alter, direction, granularity)")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Changes the current selection.")]),r("h4",{attrs:{id:"arguments-5"}},[r("a",{attrs:{href:"#arguments-5","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Arguments")]),e._v(":")]),r("ul",[r("li",[e._v("alter "),r("code",{pre:!0},[e._v("string")]),e._v(". The type of change to apply. Specify "),r("code",[e._v('"move"')]),e._v(" to move the current cursor position or "),r("code",[e._v('"extend"')]),e._v(" to extend the current selection.")]),r("li",[e._v("direction "),r("code",{pre:!0},[e._v("string")]),e._v(". The direction in which to adjust the current selection. You can specify "),r("code",[e._v('"forward"')]),e._v(" or "),r("code",[e._v('"backward"')]),e._v(" to adjust in the appropriate direction based on the language at the selection point. If you want to adjust in a specific direction, you can specify "),r("code",[e._v('"left"')]),e._v(" or "),r("code",[e._v('"right"')]),e._v(".")]),r("li",[e._v("granularity "),r("code",{pre:!0},[e._v("string")]),e._v(". The distance to adjust the current selection or cursor position. You can move by "),r("code",[e._v('"character"')]),e._v(", "),r("code",[e._v('"word"')]),e._v(", "),r("code",[e._v('"sentence"')]),e._v(", "),r("code",[e._v('"line"')]),e._v(", "),r("code",[e._v('"paragraph"')]),e._v(", "),r("code",[e._v('"lineboundary"')]),e._v(", "),r("code",[e._v('"sentenceboundary"')]),e._v(", "),r("code",[e._v('"paragraphboundary"')]),e._v(", or "),r("code",[e._v('"documentboundary"')]),e._v(".")])]),r("h4",{attrs:{id:"returns-promisevoid-7"}},[r("a",{attrs:{href:"#returns-promisevoid-7","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<void>")])]),r("h3",{attrs:{id:"removeAllRanges"}},[r("a",{attrs:{href:"#removeAllRanges","aria-hidden":"true"}},[e._v("#")]),e._v(".removeAllRanges"),r("em",[e._v("()")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Removes all ranges from the selection.")]),r("h4",{attrs:{id:"returns-promisevoid-8"}},[r("a",{attrs:{href:"#returns-promisevoid-8","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<void>")])]),r("h3",{attrs:{id:"removeRange"}},[r("a",{attrs:{href:"#removeRange","aria-hidden":"true"}},[e._v("#")]),e._v(".removeRange"),r("em",[e._v("(range)")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Removes a range from the selection.")]),r("h4",{attrs:{id:"arguments-6"}},[r("a",{attrs:{href:"#arguments-6","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Arguments")]),e._v(":")]),r("ul",[r("li",[e._v("range "),r("a",{attrs:{href:"./range"}},[r("code",{pre:!0},[e._v("Range")])]),e._v(". A range object that will be removed to the selection.")])]),r("h4",{attrs:{id:"returns-promisevoid-9"}},[r("a",{attrs:{href:"#returns-promisevoid-9","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<void>")])]),r("h3",{attrs:{id:"selectAllChildren"}},[r("a",{attrs:{href:"#selectAllChildren","aria-hidden":"true"}},[e._v("#")]),e._v(".selectAllChildren"),r("em",[e._v("(node)")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Adds all the children of the specified node to the selection.")]),r("h4",{attrs:{id:"arguments-7"}},[r("a",{attrs:{href:"#arguments-7","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Arguments")]),e._v(":")]),r("ul",[r("li",[e._v("node "),r("a",{attrs:{href:"./node"}},[r("code",{pre:!0},[e._v("Node")])]),e._v(". All children of "),r("code",[e._v("parentNode")]),e._v(" will be selected. "),r("code",[e._v("parentNode")]),e._v(" itself is not part of the selection.")])]),r("h4",{attrs:{id:"returns-promisevoid-10"}},[r("a",{attrs:{href:"#returns-promisevoid-10","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<void>")])]),r("h3",{attrs:{id:"setBaseAndExtent"}},[r("a",{attrs:{href:"#setBaseAndExtent","aria-hidden":"true"}},[e._v("#")]),e._v(".setBaseAndExtent"),r("em",[e._v("(anchorNode, anchorOffset, focusNode, focusOffset)")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Sets the selection to be a range including all or parts of two specified DOM nodes, and any content located between them.")]),r("h4",{attrs:{id:"arguments-8"}},[r("a",{attrs:{href:"#arguments-8","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Arguments")]),e._v(":")]),r("ul",[r("li",[e._v("anchorNode "),r("a",{attrs:{href:"./node"}},[r("code",{pre:!0},[e._v("Node")])]),e._v(". The node at the start of the selection.")]),r("li",[e._v("anchorOffset "),r("code",{pre:!0},[e._v("number")]),e._v(". The number of child nodes from the start of the anchor node that should be excluded from the selection. So for example, if the value is 0 the whole node is included. If the value is 1, the whole node minus the first child node is included. And so on.")]),r("li",[e._v("focusNode "),r("a",{attrs:{href:"./node"}},[r("code",{pre:!0},[e._v("Node")])]),e._v(". The node at the end of the selection.")]),r("li",[e._v("focusOffset "),r("code",{pre:!0},[e._v("number")]),e._v(". The number of child nodes from the start of the focus node that should be included in the selection. So for example, if the value is 0 the whole node is excluded. If the value is 1, the first child node is included. And so on.")])]),r("h4",{attrs:{id:"returns-promisevoid-11"}},[r("a",{attrs:{href:"#returns-promisevoid-11","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<void>")])]),r("h3",{attrs:{id:"setPosition"}},[r("a",{attrs:{href:"#setPosition","aria-hidden":"true"}},[e._v("#")]),e._v(".setPosition"),r("em",[e._v("(node, offset?)")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Collapses the current selection to a single point. This is an alias for "),r("code",[e._v("collapse()")]),e._v(" — See "),r("code",[e._v("Selection.collapse()")]),e._v(" for more details.")]),r("h4",{attrs:{id:"arguments-9"}},[r("a",{attrs:{href:"#arguments-9","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Arguments")]),e._v(":")]),r("ul",[r("li",[e._v("node "),r("a",{attrs:{href:"./node"}},[r("code",{pre:!0},[e._v("Node")])]),e._v(". Needs content.")]),r("li",[e._v("offset "),r("code",{pre:!0},[e._v("number")]),e._v(". Needs content.")])]),r("h4",{attrs:{id:"returns-promisevoid-12"}},[r("a",{attrs:{href:"#returns-promisevoid-12","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<void>")])]),r("h3",{attrs:{id:"toString"}},[r("a",{attrs:{href:"#toString","aria-hidden":"true"}},[e._v("#")]),e._v(".toString"),r("em",[e._v("()")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns a string currently being represented by the selection object, i.e. the currently selected text.")]),r("h4",{attrs:{id:"returns-promisestring"}},[r("a",{attrs:{href:"#returns-promisestring","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<string>")])])])}),[],!1,null,null,null);"function"==typeof d&&d(u),"function"==typeof h&&h(u);t.default=u.exports},vu0Y:function(e,t,r){"use strict";t.a={name:"VueRemarkRoot",render:function(e){return e("div",null,this.$slots.default)}}}}]);
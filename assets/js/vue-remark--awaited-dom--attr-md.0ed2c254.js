(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{vu0Y:function(e,t,r){"use strict";t.a={name:"VueRemarkRoot",render:function(e){return e("div",null,this.$slots.default)}}},wGtS:function(e,t,r){"use strict";r.r(t);var s=r("Ow4o"),a=r("vu0Y"),o=r("pLV6");function i(e){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}o.a.config.optionMergeStrategies;var n={VueRemarkRoot:a.a},d=function(e){var t=e.options.components=e.options.components||{},r=e.options.computed=e.options.computed||{};Object.keys(n).forEach((function(e){"object"===i(n[e])&&"function"==typeof n[e].render||"function"==typeof n[e]&&"function"==typeof n[e].options.render?t[e]=n[e]:r[e]=function(){return n[e]}}))},v=o.a.config.optionMergeStrategies,_="__vueRemarkFrontMatter",h={excerpt:null,title:"[AwaitedDOM](/docs/basic-interfaces/awaited-dom) <span>/</span> Attr"};var p=function(e){e.options[_]&&(e.options[_]=h),o.a.util.defineReactive(e.options,_,h),e.options.computed=v.computed({$frontmatter:function(){return e.options[_]}},e.options.computed)},c=Object(s.a)({},(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("VueRemarkRoot",[r("h1",{attrs:{id:"awaiteddom-spanspan-attr"}},[r("a",{attrs:{href:"#awaiteddom-spanspan-attr","aria-hidden":"true"}},[e._v("#")]),r("a",{attrs:{href:"/docs/basic-interfaces/awaited-dom"}},[e._v("AwaitedDOM")]),r("span",[e._v("/")]),e._v(" Attr")]),r("div",{staticClass:"overview"},[e._v("The "),r("code",[r("strong",[e._v("Attr")])]),e._v(" interface represents one of a DOM element's attributes as an object. In most DOM methods, you will directly retrieve the attribute as a string (e.g., "),r("code",[e._v("Element.getAttribute()")]),e._v("), but certain functions (e.g., "),r("code",[e._v("Element.getAttributeNode()")]),e._v(") or means of iterating return "),r("code",[e._v("Attr")]),e._v(" types.")]),r("h2",{attrs:{id:"properties"}},[r("a",{attrs:{href:"#properties","aria-hidden":"true"}},[e._v("#")]),e._v("Properties")]),r("h3",{attrs:{id:"localName"}},[r("a",{attrs:{href:"#localName","aria-hidden":"true"}},[e._v("#")]),e._v(".localName "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("A "),r("code",{pre:!0},[e._v("string")]),e._v(" representing the local part of the qualified name of the attribute.")]),r("h4",{attrs:{id:"type-promisestring"}},[r("a",{attrs:{href:"#type-promisestring","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<string>")])]),r("h3",{attrs:{id:"name"}},[r("a",{attrs:{href:"#name","aria-hidden":"true"}},[e._v("#")]),e._v(".name "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("The attribute's name.")]),r("h4",{attrs:{id:"type-promisestring-1"}},[r("a",{attrs:{href:"#type-promisestring-1","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<string>")])]),r("h3",{attrs:{id:"namespaceURI"}},[r("a",{attrs:{href:"#namespaceURI","aria-hidden":"true"}},[e._v("#")]),e._v(".namespaceURI "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("A "),r("code",{pre:!0},[e._v("string")]),e._v(" representing the namespace URI of the attribute, or "),r("code",[e._v("null")]),e._v(" if there is no namespace.")]),r("h4",{attrs:{id:"type-promisestring-2"}},[r("a",{attrs:{href:"#type-promisestring-2","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<string>")])]),r("h3",{attrs:{id:"ownerElement"}},[r("a",{attrs:{href:"#ownerElement","aria-hidden":"true"}},[e._v("#")]),e._v(".ownerElement "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("The element holding the attribute.")]),r("div",{staticClass:"note"},[r("p",[r("strong",[e._v("Note:")]),e._v(" DOM Level 4 removed this property. The assumption was that since you get an "),r("code",[e._v("Attr")]),e._v(" object from an "),r("code",[e._v("Element")]),e._v(", you should already know the associated element."),r("br"),e._v("\n  As that doesn't hold true in cases like "),r("code",[e._v("Attr")]),e._v(" objects being returned by "),r("code",[e._v("Document.evaluate")]),e._v(", the DOM Living Standard reintroduced the property.")]),r("p",[e._v("Gecko outputs a deprecation note starting from Gecko 7.0 (Firefox 7.0 / Thunderbird 7.0 / SeaMonkey 2.4). This note was removed again in Gecko 49.0 (Firefox 49.0 / Thunderbird 49.0 / SeaMonkey 2.46).")])]),r("h4",{attrs:{id:"type-superelement"}},[r("a",{attrs:{href:"#type-superelement","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("a",{attrs:{href:"./super-element"}},[r("code",{pre:!0},[e._v("SuperElement")])])]),r("h3",{attrs:{id:"prefix"}},[r("a",{attrs:{href:"#prefix","aria-hidden":"true"}},[e._v("#")]),e._v(".prefix "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("A "),r("code",{pre:!0},[e._v("string")]),e._v(" representing the namespace prefix of the attribute, or "),r("code",[e._v("null")]),e._v(" if no prefix is specified.")]),r("h4",{attrs:{id:"type-promisestring-3"}},[r("a",{attrs:{href:"#type-promisestring-3","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<string>")])]),r("h3",{attrs:{id:"specified"}},[r("a",{attrs:{href:"#specified","aria-hidden":"true"}},[e._v("#")]),e._v(".specified "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("This property always returns "),r("code",[e._v("true")]),e._v(". Originally, it returned "),r("code",[e._v("true ")]),e._v("if the attribute was explicitly specified in the source code or by a script, and "),r("code",[e._v("false")]),e._v(" if its value came from the default one defined in the document's "),r("acronym",{attrs:{title:"Document Type Definition"}},[e._v("DTD")]),e._v(".")],1),r("h4",{attrs:{id:"type-promiseboolean"}},[r("a",{attrs:{href:"#type-promiseboolean","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<boolean>")])]),r("h3",{attrs:{id:"value"}},[r("a",{attrs:{href:"#value","aria-hidden":"true"}},[e._v("#")]),e._v(".value "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("The attribute's value.")]),r("h4",{attrs:{id:"type-promisestring-4"}},[r("a",{attrs:{href:"#type-promisestring-4","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<string>")])]),r("h3",{attrs:{id:"baseURI"}},[r("a",{attrs:{href:"#baseURI","aria-hidden":"true"}},[e._v("#")]),e._v(".baseURI "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns a "),r("code",{pre:!0},[e._v("string")]),e._v(" representing the base URL of the document containing the "),r("code",[e._v("Node")]),e._v(".")]),r("h4",{attrs:{id:"type-promisestring-5"}},[r("a",{attrs:{href:"#type-promisestring-5","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<string>")])]),r("h3",{attrs:{id:"childNodes"}},[r("a",{attrs:{href:"#childNodes","aria-hidden":"true"}},[e._v("#")]),e._v(".childNodes "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns a live "),r("code",[e._v("NodeList")]),e._v(" containing all the children of this node. "),r("code",[e._v("NodeList")]),e._v(" being live means that if the children of the "),r("code",[e._v("Node")]),e._v(" change, the "),r("code",[e._v("NodeList")]),e._v(" object is automatically updated.")]),r("h4",{attrs:{id:"type-supernodelist"}},[r("a",{attrs:{href:"#type-supernodelist","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("a",{attrs:{href:"./super-node-list"}},[r("code",{pre:!0},[e._v("SuperNodeList")])])]),r("h3",{attrs:{id:"firstChild"}},[r("a",{attrs:{href:"#firstChild","aria-hidden":"true"}},[e._v("#")]),e._v(".firstChild "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns a "),r("code",[e._v("Node")]),e._v(" representing the first direct child node of the node, or "),r("code",[e._v("null")]),e._v(" if the node has no child.")]),r("h4",{attrs:{id:"type-supernode"}},[r("a",{attrs:{href:"#type-supernode","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("a",{attrs:{href:"./super-node"}},[r("code",{pre:!0},[e._v("SuperNode")])])]),r("h3",{attrs:{id:"isConnected"}},[r("a",{attrs:{href:"#isConnected","aria-hidden":"true"}},[e._v("#")]),e._v(".isConnected "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("A boolean indicating whether or not the Node is connected (directly or indirectly) to the context object, e.g. the "),r("code",[e._v("Document")]),e._v(" object in the case of the normal DOM, or the "),r("code",[e._v("ShadowRoot")]),e._v(" in the case of a shadow DOM.")]),r("h4",{attrs:{id:"type-promiseboolean-1"}},[r("a",{attrs:{href:"#type-promiseboolean-1","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<boolean>")])]),r("h3",{attrs:{id:"lastChild"}},[r("a",{attrs:{href:"#lastChild","aria-hidden":"true"}},[e._v("#")]),e._v(".lastChild "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns a "),r("code",[e._v("Node")]),e._v(" representing the last direct child node of the node, or "),r("code",[e._v("null")]),e._v(" if the node has no child.")]),r("h4",{attrs:{id:"type-supernode-1"}},[r("a",{attrs:{href:"#type-supernode-1","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("a",{attrs:{href:"./super-node"}},[r("code",{pre:!0},[e._v("SuperNode")])])]),r("h3",{attrs:{id:"nextSibling"}},[r("a",{attrs:{href:"#nextSibling","aria-hidden":"true"}},[e._v("#")]),e._v(".nextSibling "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns a "),r("code",[e._v("Node")]),e._v(" representing the next node in the tree, or "),r("code",[e._v("null")]),e._v(" if there isn't such node.")]),r("h4",{attrs:{id:"type-supernode-2"}},[r("a",{attrs:{href:"#type-supernode-2","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("a",{attrs:{href:"./super-node"}},[r("code",{pre:!0},[e._v("SuperNode")])])]),r("h3",{attrs:{id:"nodeName"}},[r("a",{attrs:{href:"#nodeName","aria-hidden":"true"}},[e._v("#")]),e._v(".nodeName "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns a "),r("code",{pre:!0},[e._v("string")]),e._v(" containing the name of the "),r("code",[e._v("Node")]),e._v(". The structure of the name will differ with the node type. E.g. An "),r("code",[e._v("HTMLElement")]),e._v(" will contain the name of the corresponding tag, like "),r("code",[e._v("'audio'")]),e._v(" for an "),r("code",[e._v("HTMLAudioElement")]),e._v(", a "),r("code",[e._v("Text")]),e._v(" node will have the "),r("code",[e._v("'#text'")]),e._v(" string, or a "),r("code",[e._v("Document")]),e._v(" node will have the "),r("code",[e._v("'#document'")]),e._v(" string.")]),r("h4",{attrs:{id:"type-promisestring-6"}},[r("a",{attrs:{href:"#type-promisestring-6","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<string>")])]),r("h3",{attrs:{id:"nodeType"}},[r("a",{attrs:{href:"#nodeType","aria-hidden":"true"}},[e._v("#")]),e._v(".nodeType "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns an "),r("code",[e._v("unsigned short")]),e._v(" representing the type of the node. Possible values are:")]),r("code",{staticClass:"language-html"},[r("table",{staticClass:"standard-table"},[r("thead",[r("tr",[r("th",{attrs:{scope:"col"}},[e._v("Name")]),r("th",{attrs:{scope:"col"}},[e._v("Value")])])]),r("tbody",[r("tr",[r("td",[r("code",[e._v("ELEMENT_NODE")])]),r("td",[r("code",[e._v("1")])])]),r("tr",[r("td",[r("code",[e._v("ATTRIBUTE_NODE")]),e._v(" "),r("span",{staticClass:"icon-only-inline",attrs:{title:"This deprecated API should no longer be used, but will probably still work."}},[r("i",{staticClass:"icon-thumbs-down-alt"})])]),r("td",[r("code",[e._v("2")])])]),r("tr",[r("td",[r("code",[e._v("TEXT_NODE")])]),r("td",[r("code",[e._v("3")])])]),r("tr",[r("td",[r("code",[e._v("CDATA_SECTION_NODE")])]),r("td",[r("code",[e._v("4")])])]),r("tr",[r("td",[r("code",[e._v("ENTITY_REFERENCE_NODE")]),e._v(" "),r("span",{staticClass:"icon-only-inline",attrs:{title:"This deprecated API should no longer be used, but will probably still work."}},[r("i",{staticClass:"icon-thumbs-down-alt"})])]),r("td",[r("code",[e._v("5")])])]),r("tr",[r("td",[r("code",[e._v("ENTITY_NODE")]),e._v(" "),r("span",{staticClass:"icon-only-inline",attrs:{title:"This deprecated API should no longer be used, but will probably still work."}},[r("i",{staticClass:"icon-thumbs-down-alt"})])]),r("td",[r("code",[e._v("6")])])]),r("tr",[r("td",[r("code",[e._v("PROCESSING_INSTRUCTION_NODE")])]),r("td",[r("code",[e._v("7")])])]),r("tr",[r("td",[r("code",[e._v("COMMENT_NODE")])]),r("td",[r("code",[e._v("8")])])]),r("tr",[r("td",[r("code",[e._v("DOCUMENT_NODE")])]),r("td",[r("code",[e._v("9")])])]),r("tr",[r("td",[r("code",[e._v("DOCUMENT_TYPE_NODE")])]),r("td",[r("code",[e._v("10")])])]),r("tr",[r("td",[r("code",[e._v("DOCUMENT_FRAGMENT_NODE")])]),r("td",[r("code",[e._v("11")])])]),r("tr",[r("td",[r("code",[e._v("NOTATION_NODE")]),e._v(" "),r("span",{staticClass:"icon-only-inline",attrs:{title:"This deprecated API should no longer be used, but will probably still work."}},[r("i",{staticClass:"icon-thumbs-down-alt"})])]),r("td",[r("code",[e._v("12")])])])])])]),r("h4",{attrs:{id:"type-promisenumber"}},[r("a",{attrs:{href:"#type-promisenumber","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<number>")])]),r("h3",{attrs:{id:"nodeValue"}},[r("a",{attrs:{href:"#nodeValue","aria-hidden":"true"}},[e._v("#")]),e._v(".nodeValue "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns / Sets the value of the current node.")]),r("h4",{attrs:{id:"type-promisestring-7"}},[r("a",{attrs:{href:"#type-promisestring-7","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<string>")])]),r("h3",{attrs:{id:"ownerDocument"}},[r("a",{attrs:{href:"#ownerDocument","aria-hidden":"true"}},[e._v("#")]),e._v(".ownerDocument "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns the "),r("code",[e._v("Document")]),e._v(" that this node belongs to. If the node is itself a document, returns "),r("code",[e._v("null")]),e._v(".")]),r("h4",{attrs:{id:"type-superdocument"}},[r("a",{attrs:{href:"#type-superdocument","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("a",{attrs:{href:"./super-document"}},[r("code",{pre:!0},[e._v("SuperDocument")])])]),r("h3",{attrs:{id:"parentElement"}},[r("a",{attrs:{href:"#parentElement","aria-hidden":"true"}},[e._v("#")]),e._v(".parentElement "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns an "),r("code",[e._v("Element")]),e._v(" that is the parent of this node. If the node has no parent, or if that parent is not an "),r("code",[e._v("Element")]),e._v(", this property returns "),r("code",[e._v("null")]),e._v(".")]),r("h4",{attrs:{id:"type-superelement-1"}},[r("a",{attrs:{href:"#type-superelement-1","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("a",{attrs:{href:"./super-element"}},[r("code",{pre:!0},[e._v("SuperElement")])])]),r("h3",{attrs:{id:"parentNode"}},[r("a",{attrs:{href:"#parentNode","aria-hidden":"true"}},[e._v("#")]),e._v(".parentNode "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns a "),r("code",[e._v("Node")]),e._v(" that is the parent of this node. If there is no such node, like if this node is the top of the tree or if doesn't participate in a tree, this property returns "),r("code",[e._v("null")]),e._v(".")]),r("h4",{attrs:{id:"type-supernode-3"}},[r("a",{attrs:{href:"#type-supernode-3","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("a",{attrs:{href:"./super-node"}},[r("code",{pre:!0},[e._v("SuperNode")])])]),r("h3",{attrs:{id:"previousSibling"}},[r("a",{attrs:{href:"#previousSibling","aria-hidden":"true"}},[e._v("#")]),e._v(".previousSibling "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns a "),r("code",[e._v("Node")]),e._v(" representing the previous node in the tree, or "),r("code",[e._v("null")]),e._v(" if there isn't such node.")]),r("h4",{attrs:{id:"type-supernode-4"}},[r("a",{attrs:{href:"#type-supernode-4","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("a",{attrs:{href:"./super-node"}},[r("code",{pre:!0},[e._v("SuperNode")])])]),r("h3",{attrs:{id:"textContent"}},[r("a",{attrs:{href:"#textContent","aria-hidden":"true"}},[e._v("#")]),e._v(".textContent "),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns / Sets the textual content of an element and all its descendants.")]),r("h4",{attrs:{id:"type-promisestring-8"}},[r("a",{attrs:{href:"#type-promisestring-8","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<string>")])]),r("h2",{attrs:{id:"methods"}},[r("a",{attrs:{href:"#methods","aria-hidden":"true"}},[e._v("#")]),e._v("Methods")]),r("h3",{attrs:{id:"compareDocumentPosition"}},[r("a",{attrs:{href:"#compareDocumentPosition","aria-hidden":"true"}},[e._v("#")]),e._v(".compareDocumentPosition"),r("em",[e._v("(other)")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Compares the position of the current node against another node in any other document.")]),r("h4",{attrs:{id:"arguments"}},[r("a",{attrs:{href:"#arguments","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Arguments")]),e._v(":")]),r("ul",[r("li",[e._v("other "),r("a",{attrs:{href:"./node"}},[r("code",{pre:!0},[e._v("Node")])]),e._v(". The other "),r("code",[e._v("Node")]),e._v(" with which to compare the first "),r("em",[r("code",[e._v("node")])]),e._v("’s document position.")])]),r("h4",{attrs:{id:"returns-promisenumber"}},[r("a",{attrs:{href:"#returns-promisenumber","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<number>")])]),r("h3",{attrs:{id:"contains"}},[r("a",{attrs:{href:"#contains","aria-hidden":"true"}},[e._v("#")]),e._v(".contains"),r("em",[e._v("(other)")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns a "),r("code",{pre:!0},[e._v("boolean")]),e._v(" value indicating whether or not a node is a descendant of the calling node.")]),r("h4",{attrs:{id:"arguments-1"}},[r("a",{attrs:{href:"#arguments-1","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Arguments")]),e._v(":")]),r("ul",[r("li",[e._v("other "),r("a",{attrs:{href:"./node"}},[r("code",{pre:!0},[e._v("Node")])]),e._v(". Needs content.")])]),r("h4",{attrs:{id:"returns-promiseboolean"}},[r("a",{attrs:{href:"#returns-promiseboolean","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<boolean>")])]),r("h3",{attrs:{id:"getRootNode"}},[r("a",{attrs:{href:"#getRootNode","aria-hidden":"true"}},[e._v("#")]),e._v(".getRootNode"),r("em",[e._v("(options?)")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns the context object's root which optionally includes the shadow root if it is available. ")]),r("h4",{attrs:{id:"arguments-2"}},[r("a",{attrs:{href:"#arguments-2","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Arguments")]),e._v(":")]),r("ul",[r("li",[e._v("options "),r("code",{pre:!0},[e._v("GetRootNodeOptions")]),e._v(". An object that sets options for getting the root node. The available options are:  "),r("ul",[r("li",[r("code",[e._v("composed")]),e._v(": A `boolean` that indicates whether the shadow root should be returned ("),r("code",[e._v("false")]),e._v(", the default), or a root node beyond shadow root ("),r("code",[e._v("true")]),e._v(").")])])])]),r("h4",{attrs:{id:"returns-supernode"}},[r("a",{attrs:{href:"#returns-supernode","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("a",{attrs:{href:"./super-node"}},[r("code",{pre:!0},[e._v("SuperNode")])])]),r("h3",{attrs:{id:"hasChildNodes"}},[r("a",{attrs:{href:"#hasChildNodes","aria-hidden":"true"}},[e._v("#")]),e._v(".hasChildNodes"),r("em",[e._v("()")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns a "),r("code",{pre:!0},[e._v("boolean")]),e._v(" indicating whether or not the element has any child nodes.")]),r("h4",{attrs:{id:"returns-promiseboolean-1"}},[r("a",{attrs:{href:"#returns-promiseboolean-1","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<boolean>")])]),r("h3",{attrs:{id:"isDefaultNamespace"}},[r("a",{attrs:{href:"#isDefaultNamespace","aria-hidden":"true"}},[e._v("#")]),e._v(".isDefaultNamespace"),r("em",[e._v("(namespace)")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Accepts a namespace URI as an argument and returns a "),r("code",{pre:!0},[e._v("boolean")]),e._v(" with a value of "),r("code",[e._v("true")]),e._v(" if the namespace is the default namespace on the given node or "),r("code",[e._v("false")]),e._v(" if not.")]),r("h4",{attrs:{id:"arguments-3"}},[r("a",{attrs:{href:"#arguments-3","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Arguments")]),e._v(":")]),r("ul",[r("li",[e._v("namespace "),r("code",{pre:!0},[e._v("string")]),e._v(". "),r("code",[e._v("namespaceURI")]),e._v(" is a string representing the namespace against which the element will be checked.")])]),r("h4",{attrs:{id:"returns-promiseboolean-2"}},[r("a",{attrs:{href:"#returns-promiseboolean-2","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<boolean>")])]),r("h3",{attrs:{id:"isEqualNode"}},[r("a",{attrs:{href:"#isEqualNode","aria-hidden":"true"}},[e._v("#")]),e._v(".isEqualNode"),r("em",[e._v("(otherNode)")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns a "),r("code",{pre:!0},[e._v("boolean")]),e._v(" which indicates whether or not two nodes are of the same type and all their defining data points match.")]),r("h4",{attrs:{id:"arguments-4"}},[r("a",{attrs:{href:"#arguments-4","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Arguments")]),e._v(":")]),r("ul",[r("li",[e._v("otherNode "),r("a",{attrs:{href:"./node"}},[r("code",{pre:!0},[e._v("Node")])]),e._v(". "),r("code",[e._v("otherNode")]),e._v(": The "),r("code",[e._v("Node")]),e._v(" to compare equality with.")])]),r("h4",{attrs:{id:"returns-promiseboolean-3"}},[r("a",{attrs:{href:"#returns-promiseboolean-3","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<boolean>")])]),r("h3",{attrs:{id:"isSameNode"}},[r("a",{attrs:{href:"#isSameNode","aria-hidden":"true"}},[e._v("#")]),e._v(".isSameNode"),r("em",[e._v("(otherNode)")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns a "),r("code",{pre:!0},[e._v("boolean")]),e._v(" value indicating whether or not the two nodes are the same (that is, they reference the same object).")]),r("h4",{attrs:{id:"arguments-5"}},[r("a",{attrs:{href:"#arguments-5","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Arguments")]),e._v(":")]),r("ul",[r("li",[e._v("otherNode "),r("a",{attrs:{href:"./node"}},[r("code",{pre:!0},[e._v("Node")])]),e._v(". "),r("code",[r("var",[e._v("otherNode")])]),e._v(" The "),r("code",[e._v("Node")]),e._v(" to test against.")])]),r("h4",{attrs:{id:"returns-promiseboolean-4"}},[r("a",{attrs:{href:"#returns-promiseboolean-4","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<boolean>")])]),r("h3",{attrs:{id:"lookupNamespaceURI"}},[r("a",{attrs:{href:"#lookupNamespaceURI","aria-hidden":"true"}},[e._v("#")]),e._v(".lookupNamespaceURI"),r("em",[e._v("(prefix)")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Accepts a prefix and returns the namespace URI associated with it on the given node if found (and "),r("code",[e._v("null")]),e._v(" if not). Supplying "),r("code",[e._v("null")]),e._v(" for the prefix will return the default namespace.")]),r("h4",{attrs:{id:"arguments-6"}},[r("a",{attrs:{href:"#arguments-6","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Arguments")]),e._v(":")]),r("ul",[r("li",[e._v("prefix "),r("code",{pre:!0},[e._v("string")]),e._v(". The prefix to look for. If this parameter is "),r("code",[e._v("null")]),e._v(", the method will return the default namespace URI, if any.")])]),r("h4",{attrs:{id:"returns-promisestring"}},[r("a",{attrs:{href:"#returns-promisestring","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<string>")])]),r("h3",{attrs:{id:"lookupPrefix"}},[r("a",{attrs:{href:"#lookupPrefix","aria-hidden":"true"}},[e._v("#")]),e._v(".lookupPrefix"),r("em",[e._v("(namespace)")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Returns a "),r("code",{pre:!0},[e._v("string")]),e._v(" containing the prefix for a given namespace URI, if present, and "),r("code",[e._v("null")]),e._v(" if not. When multiple prefixes are possible, the result is implementation-dependent.")]),r("h4",{attrs:{id:"arguments-7"}},[r("a",{attrs:{href:"#arguments-7","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Arguments")]),e._v(":")]),r("ul",[r("li",[e._v("namespace "),r("code",{pre:!0},[e._v("string")]),e._v(". Needs content.")])]),r("h4",{attrs:{id:"returns-promisestring-1"}},[r("a",{attrs:{href:"#returns-promisestring-1","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<string>")])]),r("h3",{attrs:{id:"normalize"}},[r("a",{attrs:{href:"#normalize","aria-hidden":"true"}},[e._v("#")]),e._v(".normalize"),r("em",[e._v("()")]),r("div",{staticClass:"specs"},[r("i",[e._v("W3C")])])]),r("p",[e._v("Clean up all the text nodes under this element (merge adjacent, remove empty).")]),r("h4",{attrs:{id:"returns-promisevoid"}},[r("a",{attrs:{href:"#returns-promisevoid","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),e._v(": "),r("code",{pre:!0},[e._v("Promise<void>")])]),r("h2",{attrs:{id:"unimplemented-specs"}},[r("a",{attrs:{href:"#unimplemented-specs","aria-hidden":"true"}},[e._v("#")]),e._v("Unimplemented Specs")]),r("h4",{attrs:{id:"methods-1"}},[r("a",{attrs:{href:"#methods-1","aria-hidden":"true"}},[e._v("#")]),e._v("Methods")]),r("table",[r("thead",[r("tr",[r("th"),r("th")])]),r("tbody",[r("tr",[r("td",[r("code",{pre:!0},[e._v("appendChild()")])]),r("td",[r("code",{pre:!0},[e._v("cloneNode()")])])]),r("tr",[r("td",[r("code",{pre:!0},[e._v("insertBefore()")])]),r("td",[r("code",{pre:!0},[e._v("removeChild()")])])]),r("tr",[r("td",[r("code",{pre:!0},[e._v("replaceChild()")])]),r("td",[r("code",{pre:!0},[e._v("addEventListener()")])])]),r("tr",[r("td",[r("code",{pre:!0},[e._v("dispatchEvent()")])]),r("td",[r("code",{pre:!0},[e._v("removeEventListener()")])])])])])])}),[],!1,null,null,null);"function"==typeof d&&d(c),"function"==typeof p&&p(c);t.default=c.exports}}]);
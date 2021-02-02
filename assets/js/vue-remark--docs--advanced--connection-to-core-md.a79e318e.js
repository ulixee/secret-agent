(window.webpackJsonp=window.webpackJsonp||[]).push([[191],{qnZM:function(t,e,n){"use strict";n.r(e);var o=n("Ow4o"),a=n("vu0Y"),s=n("pLV6");function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}s.a.config.optionMergeStrategies;var c={VueRemarkRoot:a.a},p=function(t){var e=t.options.components=t.options.components||{},n=t.options.computed=t.options.computed||{};Object.keys(c).forEach((function(t){"object"===r(c[t])&&"function"==typeof c[t].render||"function"==typeof c[t]&&"function"==typeof c[t].options.render?e[t]=c[t]:n[t]=function(){return c[t]}}))},i=s.a.config.optionMergeStrategies,l="__vueRemarkFrontMatter",v={excerpt:null,title:"ConnectionToCore"};var u=function(t){t.options[l]&&(t.options[l]=v),s.a.util.defineReactive(t.options,l,v),t.options.computed=i.computed({$frontmatter:function(){return t.options[l]}},t.options.computed)},_=Object(o.a)({},(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("VueRemarkRoot",[n("h1",{attrs:{id:"connectiontocore"}},[n("a",{attrs:{href:"#connectiontocore","aria-hidden":"true"}},[t._v("#")]),t._v("ConnectionToCore")]),n("blockquote",[n("p",[t._v("ConnectionToCore is a built-in mechanism to stream commands to local and remote instances of SecretAgent using the same simple interface.")])]),n("p",[t._v('When you install SecretAgent, it comes ready to run locally with a Chromium engine and client all in your local codebase. However, as you begin to scale the number of concurrent scrapes, you will end up needing to manage a fleet of "engines" running on a number of computers.')]),n("pre",{pre:!0,attrs:{class:"language-javascript"}},[n("code",{pre:!0,attrs:{class:"language-javascript"}},[n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token maybe-class-name"}},[t._v("Agent")]),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token maybe-class-name"}},[t._v("BaseAgent")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("require")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'@secret-agent/client'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token maybe-class-name"}},[t._v("Agent")]),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token maybe-class-name"}},[t._v("FullAgent")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("require")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'@secret-agent'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("async")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token arrow operator"}},[t._v("=>")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" local "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("FullAgent")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// connects to full, local installation")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" remote "),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("BaseAgent")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    connectionToCore"),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("RemoteConnectionToCore")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      host"),n("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[t._v("'192.168.1.1:3444'")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token method function property-access"}},[t._v("catch")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{pre:!0,attrs:{class:"token console class-name"}},[t._v("console")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{pre:!0,attrs:{class:"token property-access"}},[t._v("log")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")])])]),n("p",[t._v("There are 2 built-in connections in SecretAgent:")]),n("ul",[n("li",[n("code",{pre:!0},[t._v("Default")]),t._v(" - instantiates and connects to a locally install SecretAgent "),n("code",{pre:!0},[t._v("Core")])]),n("li",[n("code",{pre:!0},[t._v("RemoteConnectionToCore")]),t._v(" - takes a host to dial over tcp. See more "),n("a",{attrs:{href:"./remote"}},[t._v("here")])])]),n("h3",{attrs:{id:"configuration"}},[n("a",{attrs:{href:"#configuration","aria-hidden":"true"}},[t._v("#")]),t._v("Configuration")]),n("p",[t._v("When you provide a connectionToCore to a "),n("a",{attrs:{href:"../basic-interfaces/handler"}},[t._v("Handler")]),t._v(" or "),n("a",{attrs:{href:"../basic-interfaces/agent"}},[t._v("Agent")]),t._v(", SecretAgent will accept either an "),n("code",{pre:!0},[t._v("options")]),t._v(" object or a "),n("code",{pre:!0},[t._v("RemoteConnectionToCore")]),t._v(" instance.")]),n("p",[t._v("The following methods allow you to configure the "),n("code",{pre:!0},[t._v("connectionToCore")])]),n("ul",[n("li",[n("a",{attrs:{href:"../basic-interfaces/agent#configure"}},[t._v("agent.configure()")]),t._v(" - apply the connection to the default agent, or to a an agent constructed prior to the first connection.")]),n("li",[n("a",{attrs:{href:"../basic-interfaces/agent#constructor"}},[t._v("new Agent()")]),t._v(" - the new agent will use this connection.")]),n("li",[n("a",{attrs:{href:"../basic-interfaces/handler#constructor"}},[t._v("new Handler(...connections)")]),t._v(" - a handler takes one or more coreClientConnection options or instances.  ")])]),n("h3",{attrs:{id:"options"}},[n("a",{attrs:{href:"#options","aria-hidden":"true"}},[t._v("#")]),t._v("Options")]),n("p",[t._v("The provided settings configure the connection to "),n("code",{pre:!0},[t._v("Core")]),t._v(". Note: some configurations will apply to all connected Agents and Handlers ("),n("code",{pre:!0},[t._v("localProxyPortStart")]),t._v(", "),n("code",{pre:!0},[t._v("sessionsDir")]),t._v(", "),n("code",{pre:!0},[t._v("replayServerPort")]),t._v(").")]),n("ul",[n("li",[t._v("options "),n("code",{pre:!0},[t._v("object")]),t._v('. A set of settings that controls the creation of a "connection" to a '),n("code",{pre:!0},[t._v("SecretAgent Core")]),t._v("."),n("ul",[n("li",[t._v("host "),n("code",{pre:!0},[t._v("string")]),t._v(". An optional "),n("code",{pre:!0},[t._v("hostname:port")]),t._v(' url that will be used to establish a connection to a SecretAgent Core running on another machine. If no host is provided, a connection to a "locally" running '),n("code",{pre:!0},[t._v("Core")]),t._v(" will be attempted.")]),n("li",[t._v("maxConcurrency "),n("code",{pre:!0},[t._v("number")]),t._v('. The max number of Agents to allow to be dispatched and created at the same time. Agents are "active" until the dispatchAgent callback is complete, or the created Agent is closed. If not provided, this number will match the max allowed by a '),n("code",{pre:!0},[t._v("Core")]),t._v(".")]),n("li",[t._v("agentTimeoutMillis "),n("code",{pre:!0},[t._v("number")]),t._v(". The number of milliseconds to give each Agent in this connection to complete a session. A TimeoutError will be thrown if this time is exceeded.")]),n("li",[t._v("localProxyPortStart "),n("code",{pre:!0},[t._v("number")]),t._v(" defaults to "),n("code",{pre:!0},[t._v("any open port")]),t._v(". Starting internal port to use for the mitm proxy.")]),n("li",[t._v("sessionsDir "),n("code",{pre:!0},[t._v("string")]),t._v(" defaults to "),n("code",{pre:!0},[t._v("os.tmpdir()/.secret-agent")]),t._v(". Directory to store session files and mitm certificates.")]),n("li",[t._v("replayServerPort "),n("code",{pre:!0},[t._v("number")]),t._v('. Port to start a live replay server on. Defaults to "any open port".')])])]),n("li",[t._v("connection "),n("code",{pre:!0},[t._v("CoreClientConnection")]),t._v(". A pre-initialized connection to a "),n("code",{pre:!0},[t._v("SecretAgent Core")]),t._v(". You can use this option to pre-check your connection to a remote connection, or to provide customization to the connection.")])])])}),[],!1,null,null,null);"function"==typeof p&&p(_),"function"==typeof u&&u(_);e.default=_.exports},vu0Y:function(t,e,n){"use strict";e.a={name:"VueRemarkRoot",render:function(t){return t("div",null,this.$slots.default)}}}}]);
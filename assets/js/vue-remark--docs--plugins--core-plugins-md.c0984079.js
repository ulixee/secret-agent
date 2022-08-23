(window.webpackJsonp=window.webpackJsonp||[]).push([[221],{"9YY8":function(e,t,r){"use strict";r.r(t);var s=r("Ow4o"),n=r("vu0Y"),a=r("pLV6");function o(e){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}a.a.config.optionMergeStrategies;var i={VueRemarkRoot:n.a},p=function(e){var t=e.options.components=e.options.components||{},r=e.options.computed=e.options.computed||{};Object.keys(i).forEach((function(e){"object"===o(i[e])&&"function"==typeof i[e].render||"function"==typeof i[e]&&"function"==typeof i[e].options.render?t[e]=i[e]:r[e]=function(){return i[e]}}))},u=a.a.config.optionMergeStrategies,c="__vueRemarkFrontMatter",l={excerpt:null,title:"Core Plugins"};var v=function(e){e.options[c]&&(e.options[c]=l),a.a.util.defineReactive(e.options,c,l),e.options.computed=u.computed({$frontmatter:function(){return e.options[c]}},e.options.computed)},d=Object(s.a)({},(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("VueRemarkRoot",[r("h1",{attrs:{id:"core-plugins"}},[r("a",{attrs:{href:"#core-plugins","aria-hidden":"true"}},[e._v("#")]),e._v("Core Plugins")]),r("blockquote",[r("p",[e._v("Core plugins extend SecretAgent's backend functionality at the Core level. These plugins have full control over TCP fingerprinting, header order, HTML rendering, audio codecs and thousands of other variables that allow undetectable emulation of any browser you desire.")])]),r("h2",{attrs:{id:"creating-your-own-core-plugin"}},[r("a",{attrs:{href:"#creating-your-own-core-plugin","aria-hidden":"true"}},[e._v("#")]),e._v("Creating Your Own Core Plugin")]),r("p",[e._v("Adding a new plugin is as simple as creating a javascript class with the correct properties and methods, then registering it with "),r("code",{pre:!0},[e._v("agent.use()")]),e._v(".")]),r("p",[e._v("We recommend using the CorePlugin base class provided by @secret-agent/plugin-utils, which handles setting most of the required properties and methods, everything except the static "),r("code",{pre:!0},[e._v("id")]),e._v(" property. Here's a simple plugin that adds a single hello() method to agent, which outputs to the browser's console.")]),r("pre",{pre:!0,attrs:{class:"language-javascript"}},[r("code",{pre:!0,attrs:{class:"language-javascript"}},[r("span",{pre:!0,attrs:{class:"token keyword module"}},[e._v("import")]),e._v(" "),r("span",{pre:!0,attrs:{class:"token imports"}},[r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v(" "),r("span",{pre:!0,attrs:{class:"token maybe-class-name"}},[e._v("ClientPlugin")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v(" "),r("span",{pre:!0,attrs:{class:"token maybe-class-name"}},[e._v("CorePlugin")]),e._v(" "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")])]),e._v(" "),r("span",{pre:!0,attrs:{class:"token keyword module"}},[e._v("from")]),e._v(" "),r("span",{pre:!0,attrs:{class:"token string"}},[e._v("'@secret-agent/plugin-utils'")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(";")]),e._v("\n\n"),r("span",{pre:!0,attrs:{class:"token keyword module"}},[e._v("export")]),e._v(" "),r("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("class")]),e._v(" "),r("span",{pre:!0,attrs:{class:"token class-name"}},[e._v("ClientHelloPlugin")]),e._v(" "),r("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("extends")]),e._v(" "),r("span",{pre:!0,attrs:{class:"token class-name"}},[e._v("ClientPlugin")]),e._v(" "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n  "),r("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("static")]),e._v(" readonly id "),r("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=")]),e._v(" "),r("span",{pre:!0,attrs:{class:"token string"}},[e._v("'hello-plugin'")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(";")]),e._v("\n\n  "),r("span",{pre:!0,attrs:{class:"token function"}},[e._v("onAgent")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),r("span",{pre:!0,attrs:{class:"token parameter"}},[e._v("agent"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v(" sendToCore")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),e._v(" "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n    agent"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(".")]),r("span",{pre:!0,attrs:{class:"token method-variable function-variable method function property-access"}},[e._v("hello")]),e._v(" "),r("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=")]),e._v(" "),r("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("async")]),e._v(" "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),r("span",{pre:!0,attrs:{class:"token parameter"}},[e._v("name")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),e._v(" "),r("span",{pre:!0,attrs:{class:"token arrow operator"}},[e._v("=>")]),e._v(" "),r("span",{pre:!0,attrs:{class:"token keyword control-flow"}},[e._v("await")]),e._v(" "),r("span",{pre:!0,attrs:{class:"token function"}},[e._v("sendToCore")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),r("span",{pre:!0,attrs:{class:"token string"}},[e._v("'hello-plugin'")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v(" name"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(";")]),e._v("\n  "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),e._v("\n"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),e._v("\n\n"),r("span",{pre:!0,attrs:{class:"token keyword module"}},[e._v("export")]),e._v(" "),r("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("class")]),e._v(" "),r("span",{pre:!0,attrs:{class:"token class-name"}},[e._v("CoreHelloPlugin")]),e._v(" "),r("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("extends")]),e._v(" "),r("span",{pre:!0,attrs:{class:"token class-name"}},[e._v("CorePlugin")]),e._v(" "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n  "),r("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("static")]),e._v(" readonly id "),r("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=")]),e._v(" "),r("span",{pre:!0,attrs:{class:"token string"}},[e._v("'hello-plugin'")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(";")]),e._v("\n\n  "),r("span",{pre:!0,attrs:{class:"token function"}},[e._v("onClientCommand")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),r("span",{pre:!0,attrs:{class:"token parameter"}},[r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v(" puppetPage "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v(" name")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),e._v(" "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n    "),r("span",{pre:!0,attrs:{class:"token template-string"}},[r("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[e._v("`")]),r("span",{pre:!0,attrs:{class:"token string"}},[e._v("Hello ")]),r("span",{pre:!0,attrs:{class:"token interpolation"}},[r("span",{pre:!0,attrs:{class:"token interpolation-punctuation punctuation"}},[e._v("${")]),e._v("name"),r("span",{pre:!0,attrs:{class:"token interpolation-punctuation punctuation"}},[e._v("}")])]),r("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[e._v("`")])]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(";")]),e._v("\n  "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),e._v("\n"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")])])]),r("p",[e._v("As shown above, you can export multiple plugins from the same file. Also a client/core plugin combination can share the same "),r("code",{pre:!0},[e._v("id")]),e._v(" (unlike two core plugins, which must each have unique ids).")]),r("p",[e._v("To register this plugin in SecretAgent, just pass it to "),r("code",{pre:!0},[e._v("agent.use()")]),e._v(". In the following example we pass through a path to the plugin file instead of the plugin class itself -- we're doing this because by default Core runs in a separate process from Client.")]),r("pre",{pre:!0,attrs:{class:"language-javascript"}},[r("code",{pre:!0,attrs:{class:"language-javascript"}},[r("span",{pre:!0,attrs:{class:"token keyword module"}},[e._v("import")]),e._v(" "),r("span",{pre:!0,attrs:{class:"token imports"}},[e._v("agent")]),e._v(" "),r("span",{pre:!0,attrs:{class:"token keyword module"}},[e._v("from")]),e._v(" "),r("span",{pre:!0,attrs:{class:"token string"}},[e._v("'secret-agent'")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(";")]),e._v("\n\nagent"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(".")]),r("span",{pre:!0,attrs:{class:"token method function property-access"}},[e._v("use")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),e._v("require"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(".")]),r("span",{pre:!0,attrs:{class:"token method function property-access"}},[e._v("resolve")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),r("span",{pre:!0,attrs:{class:"token string"}},[e._v("'./HelloPlugin'")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(";")]),e._v("\n\n"),r("span",{pre:!0,attrs:{class:"token keyword control-flow"}},[e._v("await")]),e._v(" agent"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(".")]),r("span",{pre:!0,attrs:{class:"token method function property-access"}},[e._v("hello")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),r("span",{pre:!0,attrs:{class:"token string"}},[e._v("'World'")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(";")])])]),r("p",[e._v("The rest of this page documents the various functionalities you can add to your class.")]),r("h2",{attrs:{id:"constructor"}},[r("a",{attrs:{href:"#constructor","aria-hidden":"true"}},[e._v("#")]),e._v("Constructor")]),r("h3",{attrs:{id:"new-corepluginemcreateoptionsem"}},[r("a",{attrs:{href:"#new-corepluginemcreateoptionsem","aria-hidden":"true"}},[e._v("#")]),e._v("new CorePlugin"),r("em",[e._v("(createOptions)")])]),r("p",[e._v("New instance of CorePlugin is created for every agent instance. The createOptions object has three properties.")]),r("h4",{attrs:{id:"arguments"}},[r("a",{attrs:{href:"#arguments","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Arguments")]),e._v(":")]),r("ul",[r("li",[e._v("createOptions "),r("code",{pre:!0},[e._v("object")]),e._v(" Receives the following:"),r("ul",[r("li",[e._v("userAgentOption "),r("code",{pre:!0},[e._v("UserAgentOption")]),e._v(". An object containing various attributes of the chosen userAgent (name, version, etc).")]),r("li",[e._v("browserEngine "),r("code",{pre:!0},[e._v("BrowserEngine")]),e._v(". An instance containing the current BrowserEngine.")]),r("li",[e._v("plugins "),r("code",{pre:!0},[e._v("Plugins")]),e._v(". An instance containing the current instance of Plugins attached to this session.")]),r("li",[e._v("logger "),r("code",{pre:!0},[e._v("BoundLog")]),e._v(". An instance of logger you can use to log output.")])])])]),r("h2",{attrs:{id:"class-properties"}},[r("a",{attrs:{href:"#class-properties","aria-hidden":"true"}},[e._v("#")]),e._v("Class Properties")]),r("h3",{attrs:{id:"corepluginid-required"}},[r("a",{attrs:{href:"#corepluginid-required","aria-hidden":"true"}},[e._v("#")]),e._v("CorePlugin.id "),r("em",[e._v("required")])]),r("p",[e._v("This should usually be set to the plugin's npm package name.")]),r("h4",{attrs:{id:"type-string"}},[r("a",{attrs:{href:"#type-string","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("code",{pre:!0},[e._v("string")])]),r("h3",{attrs:{id:"coreplugintype-required"}},[r("a",{attrs:{href:"#coreplugintype-required","aria-hidden":"true"}},[e._v("#")]),e._v("CorePlugin.type "),r("em",[e._v("required")])]),r("p",[e._v("This tells SecretAgent that the plugin is a CorePlugin. It must always be set.")]),r("h4",{attrs:{id:"type-string-this-must-always-be-set-to-coreplugin"}},[r("a",{attrs:{href:"#type-string-this-must-always-be-set-to-coreplugin","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Type")]),e._v(": "),r("code",{pre:!0},[e._v("string")]),e._v(". This must always be set to "),r("code",{pre:!0},[e._v("'CorePlugin'")]),e._v(".")]),r("h2",{attrs:{id:"instance-method-hooks"}},[r("a",{attrs:{href:"#instance-method-hooks","aria-hidden":"true"}},[e._v("#")]),e._v("Instance Method Hooks")]),r("p",[e._v("The following methods are optional. Add them to your plugin as needed.")]),r("h3",{attrs:{id:"configureemconfigem"}},[r("a",{attrs:{href:"#configureemconfigem","aria-hidden":"true"}},[e._v("#")]),e._v("configure"),r("em",[e._v("(config)")])]),r("p",[e._v("This hook is called during the initialization of a session/browserEmulator as well as every time agent.configure is called from the client.")]),r("h4",{attrs:{id:"arguments-1"}},[r("a",{attrs:{href:"#arguments-1","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Arguments")]),e._v(":")]),r("ul",[r("li",[e._v("config "),r("code",{pre:!0},[e._v("object")]),e._v(" Receives any (or none) of the following:"),r("ul",[r("li",[e._v("viewport "),r("code",{pre:!0},[e._v("Viewport")]),e._v(". This is an object containing browser width and height as well as screenWidth and screenHeight, among other properties.")]),r("li",[e._v("geolocation "),r("code",{pre:!0},[e._v("Geolocation")]),e._v(". This is an object containing longtitude and latitude, among other properties.")]),r("li",[e._v("timezoneId "),r("code",{pre:!0},[e._v("string")]),e._v(". The configured unicode TimezoneId or host default (eg, America/New_York).")]),r("li",[e._v("locale "),r("code",{pre:!0},[e._v("string")]),e._v(". The configured locale in use (eg, en-US).")])])])]),r("p",[e._v("Modify any value in the object to change it session-wide.")]),r("h4",{attrs:{id:"returns-void"}},[r("a",{attrs:{href:"#returns-void","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),r("code",{pre:!0},[e._v("void")])]),r("h3",{attrs:{id:"onclientcommandemmeta-argsem-optional"}},[r("a",{attrs:{href:"#onclientcommandemmeta-argsem-optional","aria-hidden":"true"}},[e._v("#")]),e._v("onClientCommand"),r("em",[e._v("(meta, ...args)")]),r("em",[e._v("optional")])]),r("p",[e._v("This method is called every time a ClientPlugin calls sendToCore to this plugin's ID.")]),r("h4",{attrs:{id:"arguments-2"}},[r("a",{attrs:{href:"#arguments-2","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Arguments")]),e._v(":")]),r("ul",[r("li",[e._v("meta "),r("code",{pre:!0},[e._v("OnClientommandMeta")]),e._v(". This object currently has a single property - puppetPage.")]),r("li",[e._v("args: "),r("code",{pre:!0},[e._v("any[]")]),e._v(". Whatever args the ClientPlugin passed through sendToCore.")])]),r("h4",{attrs:{id:"returns-promise--void"}},[r("a",{attrs:{href:"#returns-promise--void","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),r("code",{pre:!0},[e._v("Promise")]),e._v(" | "),r("code",{pre:!0},[e._v("void")])]),r("h3",{attrs:{id:"ondnsconfigurationemsettings-idnssettingsem"}},[r("a",{attrs:{href:"#ondnsconfigurationemsettings-idnssettingsem","aria-hidden":"true"}},[e._v("#")]),e._v("onDnsConfiguration"),r("em",[e._v("(settings: IDnsSettings)")])]),r("p",[e._v("Configures the DNS over TLS connection that Chrome defaults to using if your DNS provider supports it.")]),r("h4",{attrs:{id:"returns-promise--void-1"}},[r("a",{attrs:{href:"#returns-promise--void-1","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),r("code",{pre:!0},[e._v("Promise")]),e._v(" | "),r("code",{pre:!0},[e._v("void")])]),r("h3",{attrs:{id:"ontcpconfigurationemsettings-itcpsettingsem"}},[r("a",{attrs:{href:"#ontcpconfigurationemsettings-itcpsettingsem","aria-hidden":"true"}},[e._v("#")]),e._v("onTcpConfiguration"),r("em",[e._v("(settings: ITcpSettings)")])]),r("p",[e._v("Some Tcp settings vary based on the Operating System making http requests.\nCurrent supports:")]),r("ul",[r("li",[r("code",{pre:!0},[e._v("windowSize")])]),r("li",[r("code",{pre:!0},[e._v("ttl")])])]),r("p",[e._v("Alter the object's values to change session-wide.")]),r("h4",{attrs:{id:"returns-promise--void-2"}},[r("a",{attrs:{href:"#returns-promise--void-2","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),r("code",{pre:!0},[e._v("Promise")]),e._v(" | "),r("code",{pre:!0},[e._v("void")])]),r("h3",{attrs:{id:"ontlsconfigurationemsettings-itlssettingsem"}},[r("a",{attrs:{href:"#ontlsconfigurationemsettings-itlssettingsem","aria-hidden":"true"}},[e._v("#")]),e._v("onTlsConfiguration"),r("em",[e._v("(settings: ITlsSettings)")])]),r("p",[e._v("Emulate the ClientHello signature, which can vary between browser versions")]),r("h4",{attrs:{id:"returns-promise--void-3"}},[r("a",{attrs:{href:"#returns-promise--void-3","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),r("code",{pre:!0},[e._v("Promise")]),e._v(" | "),r("code",{pre:!0},[e._v("void")])]),r("h3",{attrs:{id:"onhttp2sessionconnectemrequest-ihttpresourceloaddetails-settings-ihttp2connectsettingsem"}},[r("a",{attrs:{href:"#onhttp2sessionconnectemrequest-ihttpresourceloaddetails-settings-ihttp2connectsettingsem","aria-hidden":"true"}},[e._v("#")]),e._v("onHttp2SessionConnect"),r("em",[e._v("(request: IHttpResourceLoadDetails, settings: IHttp2ConnectSettings)")])]),r("p",[e._v("A callback is provided for each HTTP2 Session that is created allowing you to customize the initial SETTINGS and WINDOW_UPDATE frames.")]),r("p",[e._v("Current Supports")]),r("ul",[r("li",[r("code",{pre:!0},[e._v("settings")]),e._v(". Http2RequestSettings using keys from Node.js settings ("),r("a",{attrs:{href:"https://nodejs.org/api/http2.html#http2_settings_object",target:"_blank",rel:"nofollow noopener noreferrer"}},[e._v("https://nodejs.org/api/http2.html#http2_settings_object")]),e._v(")")]),r("li",[r("code",{pre:!0},[e._v("localWindowSize")]),e._v(". A value to trigger a WINDOW_UPDATE frame with the initial connect.")])]),r("p",[e._v("Alter the object's values per Http2 Session.")]),r("h4",{attrs:{id:"returns-promise--void-4"}},[r("a",{attrs:{href:"#returns-promise--void-4","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),r("code",{pre:!0},[e._v("Promise")]),e._v(" | "),r("code",{pre:!0},[e._v("void")])]),r("h3",{attrs:{id:"beforehttprequestemrequest-ihttpresourceloaddetailsem"}},[r("a",{attrs:{href:"#beforehttprequestemrequest-ihttpresourceloaddetailsem","aria-hidden":"true"}},[e._v("#")]),e._v("beforeHttpRequest"),r("em",[e._v("(request: IHttpResourceLoadDetails)")])]),r("p",[e._v("A callback is provided for each HTTP request where you are given the opportunity to re-order, re-case, and add or remove headers so that they resemble real browser requests. Headless Chrome is known to provide headers is different order on occasion from headed. See "),r("a",{attrs:{href:"https://github.com/ulixee/double-agent",target:"_blank",rel:"nofollow noopener noreferrer"}},[e._v("https://github.com/ulixee/double-agent")]),e._v(" for details.")]),r("h4",{attrs:{id:"returns-promise--void-5"}},[r("a",{attrs:{href:"#returns-promise--void-5","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),r("code",{pre:!0},[e._v("Promise")]),e._v(" | "),r("code",{pre:!0},[e._v("void")])]),r("h3",{attrs:{id:"beforehttpresponseemresource-ihttpresourceloaddetailsem"}},[r("a",{attrs:{href:"#beforehttpresponseemresource-ihttpresourceloaddetailsem","aria-hidden":"true"}},[e._v("#")]),e._v("beforeHttpResponse"),r("em",[e._v("(resource: IHttpResourceLoadDetails)")])]),r("p",[e._v("Callbacks on each cookie set, and to return the valid list of cookies. This callback can be used to simulate cookie behavior that varies from the underlying browser - for instance Safari 13.")]),r("h4",{attrs:{id:"returns-promise--void-6"}},[r("a",{attrs:{href:"#returns-promise--void-6","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),r("code",{pre:!0},[e._v("Promise")]),e._v(" | "),r("code",{pre:!0},[e._v("void")])]),r("h3",{attrs:{id:"onnewpuppetpageempage-ipuppetpageem"}},[r("a",{attrs:{href:"#onnewpuppetpageempage-ipuppetpageem","aria-hidden":"true"}},[e._v("#")]),e._v("onNewPuppetPage"),r("em",[e._v("(page: IPuppetPage)")])]),r("p",[e._v("This is called every time a new page/iframe is loaded. Use this hook to modify the DOM environment (i.e., to emulate various browser features) before a website loads.")]),r("h4",{attrs:{id:"returns-promise"}},[r("a",{attrs:{href:"#returns-promise","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),r("code",{pre:!0},[e._v("Promise")])]),r("h3",{attrs:{id:"onnewpuppetworkeremworker-ipuppetworkerem"}},[r("a",{attrs:{href:"#onnewpuppetworkeremworker-ipuppetworkerem","aria-hidden":"true"}},[e._v("#")]),e._v("onNewPuppetWorker"),r("em",[e._v("(worker: IPuppetWorker)")])]),r("p",[e._v("This is called every time a new worker is loaded within a page. Use this hook to modify the DOM environment (i.e., to emulate various browser features) before a website loads.")]),r("h4",{attrs:{id:"returns-promise-1"}},[r("a",{attrs:{href:"#returns-promise-1","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),r("code",{pre:!0},[e._v("Promise")])]),r("h3",{attrs:{id:"websitehasfirstpartyinteractionemurl-urlem"}},[r("a",{attrs:{href:"#websitehasfirstpartyinteractionemurl-urlem","aria-hidden":"true"}},[e._v("#")]),e._v("websiteHasFirstPartyInteraction"),r("em",[e._v("(url: URL)")])]),r("p",[e._v('Callback to indicate a domain has "first-party" interaction. Some browsers, like Safari 13.1, started granting cookie storage to websites only after a user has directly interacted with them.')]),r("h4",{attrs:{id:"returns-promise--void-7"}},[r("a",{attrs:{href:"#returns-promise--void-7","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),r("code",{pre:!0},[e._v("Promise")]),e._v(" | "),r("code",{pre:!0},[e._v("void")])]),r("h3",{attrs:{id:"playinteractionseminteractions-runfn-helperem"}},[r("a",{attrs:{href:"#playinteractionseminteractions-runfn-helperem","aria-hidden":"true"}},[e._v("#")]),e._v("playInteractions"),r("em",[e._v("(interactions, runFn, helper)")])]),r("p",[e._v("Use this method if you want to change the speed or randomness of user Interactions (mouse movements, typing, etc).")]),r("h4",{attrs:{id:"returns-promise-2"}},[r("a",{attrs:{href:"#returns-promise-2","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),r("code",{pre:!0},[e._v("Promise")])]),r("h3",{attrs:{id:"getstartingmousepointemhelperem"}},[r("a",{attrs:{href:"#getstartingmousepointemhelperem","aria-hidden":"true"}},[e._v("#")]),e._v("getStartingMousePoint"),r("em",[e._v("(helper)")])]),r("p",[e._v("This is used within Core to run the mouse Interactions correctly.")]),r("h4",{attrs:{id:"returns-promise-3"}},[r("a",{attrs:{href:"#returns-promise-3","aria-hidden":"true"}},[e._v("#")]),r("strong",[e._v("Returns")]),r("code",{pre:!0},[e._v("Promise")])])])}),[],!1,null,null,null);"function"==typeof p&&p(d),"function"==typeof v&&v(d);t.default=d.exports},vu0Y:function(e,t,r){"use strict";t.a={name:"VueRemarkRoot",render:function(e){return e("div",null,this.$slots.default)}}}}]);
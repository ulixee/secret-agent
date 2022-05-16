# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.6.4](https://github.com/unblocked-web/agent/compare/v1.6.3...v1.6.4) (2022-01-24)


### Bug Fixes

* **mitm:** lookup public ip should use https ([5a68228](https://github.com/unblocked-web/agent/commit/5a6822851a71aff940900ea4f41365c997314ee2))





## [1.6.3](https://github.com/unblocked-web/agent/compare/v1.6.2...v1.6.3) (2022-01-14)


### Bug Fixes

* **client:** wait for all command queue flushes ([95664f5](https://github.com/unblocked-web/agent/commit/95664f570b6b7e233ea6b6227ad5f363cce52287))
* **core:** cleanup event listener memory ([6f7d7bb](https://github.com/unblocked-web/agent/commit/6f7d7bb449714876ab9a90ec4697c012d8c7bff3))
* **core:** in page nav not resolving resource ([2539d78](https://github.com/unblocked-web/agent/commit/2539d7809d0709d709cff9bba48f411361e8ebc9))





## [1.6.2](https://github.com/unblocked-web/agent/compare/v1.6.1...v1.6.2) (2021-12-20)


### Bug Fixes

* **client:** reload should return a resource ([83b80b5](https://github.com/unblocked-web/agent/commit/83b80b5b3d70bc06344fb64d31fed1434ac98114)), closes [#393](https://github.com/unblocked-web/agent/issues/393)
* **core:** navigations directly to hash fixed ([c02f61b](https://github.com/unblocked-web/agent/commit/c02f61b549d34c438614ab8f63c8fce17af60d2c)), closes [#404](https://github.com/unblocked-web/agent/issues/404)


### Features

* **client:** return resource in waitForLocation ([253b33b](https://github.com/unblocked-web/agent/commit/253b33b3528952432528949ab0dc2c8b4cf9a50c))
* **core:** dialogs should run out of command line ([52a737f](https://github.com/unblocked-web/agent/commit/52a737ff7ca380b00a1f156aa7dacf5e9af0bcfb)), closes [#397](https://github.com/unblocked-web/agent/issues/397)





## [1.6.1](https://github.com/unblocked-web/agent/compare/v1.5.15...v1.6.1) (2021-12-14)


### Bug Fixes

* **core:** frame navigations on redirects ([de3ea24](https://github.com/unblocked-web/agent/commit/de3ea248a0fda5b8d08c7de961bac4f9fdc0b83e))
* **core:** handle detached when elements not there ([5b46bd9](https://github.com/unblocked-web/agent/commit/5b46bd97cf1ca1aa3bc0fed625064764726872f4))
* **puppet:** extract navigation loader ([77d8e2e](https://github.com/unblocked-web/agent/commit/77d8e2e34286469a2df1d9e00e631c6e773760eb))
* **replay:** fix ability to replay data attributes ([9440995](https://github.com/unblocked-web/agent/commit/944099560870c8479f0be59426fa194daf17ab4d))


### Features

* **plugins:** add frames to execute js ([65258a3](https://github.com/unblocked-web/agent/commit/65258a3fa6ad23f7263bd0f90d86bebf751d8e94))





# [1.6.0](https://github.com/unblocked-web/agent/compare/v1.5.15...v1.6.0) (2021-12-14)


### Bug Fixes

* **core:** handle detached when elements not there ([5b46bd9](https://github.com/unblocked-web/agent/commit/5b46bd97cf1ca1aa3bc0fed625064764726872f4))
* **puppet:** extract navigation loader ([77d8e2e](https://github.com/unblocked-web/agent/commit/77d8e2e34286469a2df1d9e00e631c6e773760eb))
* **replay:** fix ability to replay data attributes ([9440995](https://github.com/unblocked-web/agent/commit/944099560870c8479f0be59426fa194daf17ab4d))


### Features

* **plugins:** add frames to execute js ([65258a3](https://github.com/unblocked-web/agent/commit/65258a3fa6ad23f7263bd0f90d86bebf751d8e94))





## [1.5.15](https://github.com/unblocked-web/agent/compare/v1.5.14...v1.5.15) (2021-11-24)


### Bug Fixes

* **client:** handle ws closing during shutdown ([09bfe29](https://github.com/unblocked-web/agent/commit/09bfe29f54a4307fe0df1370a35a87d7950e9378))
* **mitm:** clean invalid response characters ([5d85921](https://github.com/unblocked-web/agent/commit/5d859217d7cf6aa870058e4234a079c0027e35b3))
* **plugins:** improve user agent selector ([cd708bb](https://github.com/unblocked-web/agent/commit/cd708bbc8e46705376f9cf3bd438a59c0063b6e7))
* **puppet:** better handling of default loader ([2979ba7](https://github.com/unblocked-web/agent/commit/2979ba7b323aab6896f9c2f006ca4bbbe40e69cb))
* **puppet:** consisten timeout handling ([ba6bcee](https://github.com/unblocked-web/agent/commit/ba6bcee3384811824ae3dc3789c5c3fc6088905a))
* **puppet:** don't use contexts we didn't initiate ([710acab](https://github.com/unblocked-web/agent/commit/710acabd1b4c0275d95048cb9f0053e2775f4d77))
* **puppet:** fix flakiness on frame stopped ([002a516](https://github.com/unblocked-web/agent/commit/002a51601123565b774f3589ddd9e35494516035))
* **puppet:** fix shutdown issues (port from hero) ([2b70752](https://github.com/unblocked-web/agent/commit/2b70752054edae95701243cc59afa48e113856fe))


### Features

* **plugins:** mask public ip in webrtc ([14d3c67](https://github.com/unblocked-web/agent/commit/14d3c673327c149084ae32cd71c944cf60a84df3))





## [1.5.14](https://github.com/unblocked-web/agent/compare/v1.5.13...v1.5.14) (2021-11-15)


### Bug Fixes

* **core:** don't lose old user-profile storage ([9fe9ae4](https://github.com/unblocked-web/agent/commit/9fe9ae4d6827a93f6b681dc10455d4695369b37f)), closes [#342](https://github.com/unblocked-web/agent/issues/342)
* **human-emulator:** fix updated traget point ([98eabd1](https://github.com/unblocked-web/agent/commit/98eabd183660fd2cbbc44575f2703ae86e5e2950))
* **puppet:** fix stack trace for protocol error ([8a5b4bf](https://github.com/unblocked-web/agent/commit/8a5b4bf16b53268509b0ad93d3db74559f6de699))


### Features

* **mitm:** add documentUrl to resources ([7fcbf8f](https://github.com/unblocked-web/agent/commit/7fcbf8faf84a72360d490f14c72910ea54619dc6))







**Note:** Version bump only for package @unblocked-web/agent-monorepo





## [1.5.12](https://github.com/unblocked-web/agent/compare/v1.5.11...v1.5.12) (2021-09-26)


### Bug Fixes

* **mitm:** handle certs resolving before set ([4ea9566](https://github.com/unblocked-web/agent/commit/4ea956633443ce195174a1c05844c147a0a6731a))
* **mitm:** waitForLocation reload on post ([fb3e3d7](https://github.com/unblocked-web/agent/commit/fb3e3d7819cdf472d00370f5bcbdbd262e961a67))





## [1.5.11](https://github.com/unblocked-web/agent/compare/v1.5.10...v1.5.11) (2021-09-20)


### Bug Fixes

* **plugins:** fix dynamic plugins + types ([98ed6f8](https://github.com/unblocked-web/agent/commit/98ed6f839915aff76bdaf31bc98addeddc309f17))





## [1.5.10](https://github.com/unblocked-web/agent/compare/v1.5.9...v1.5.10) (2021-09-11)


### Bug Fixes

* **plugins:** not calling initialization in time ([1ecebed](https://github.com/unblocked-web/agent/commit/1ecebed990f70fc61250b779b15b8dcbc1e4c2c7))
* **user-profile:** handle empty database ([c9abf9a](https://github.com/unblocked-web/agent/commit/c9abf9ab846df0d9df3ccd3b952379e8f79d9dfe))





## [1.5.9](https://github.com/unblocked-web/agent/compare/v1.5.8...v1.5.9) (2021-09-08)


### Bug Fixes

* **plugin:** export ClientPlugin/CorePlugin ([882674c](https://github.com/unblocked-web/agent/commit/882674c9397d878922ce9863429f5e156d3df9e4))
* **plugins:** iframe content window wrong ([7381189](https://github.com/unblocked-web/agent/commit/7381189f44cf28738e50dab40546b9b83141c31d))


### Features

* **core:** only use valid sinceCommandIds ([75056c3](https://github.com/unblocked-web/agent/commit/75056c3ba343b89de8be0536743343b1a3bea238))
* **docs:** tweak docs ([39632b5](https://github.com/unblocked-web/agent/commit/39632b5a51b97eb708fa8f26ac7d247725474926))
* **plugins:** remove codecs overrides for chrome ([17a16a5](https://github.com/unblocked-web/agent/commit/17a16a515de3dfa65d6624f5c3f5244a744755d1))





## [1.5.8](https://github.com/unblocked-web/agent/compare/v1.5.7...v1.5.8) (2021-08-30)


### Bug Fixes

* **core:** throw invalid selectors, fix wait x/y ([2025f27](https://github.com/unblocked-web/agent/commit/2025f27d749011730609202cbf5798496a3fccc1))
* **plugins:** fix versions not sorting correctly ([b9e7620](https://github.com/unblocked-web/agent/commit/b9e76205c9c615f2639ca39e0f1e589c8bf15adf))


### Features

* **replay:** use old scripts for path to start core ([c1f893d](https://github.com/unblocked-web/agent/commit/c1f893de9a871d3e94450a721ac7c05fcc17ceee))





## [1.5.7](https://github.com/unblocked-web/agent/compare/v1.5.6...v1.5.7) (2021-08-26)


### Bug Fixes

* **mitm:** disable upstream proxy for dns lookup ([bacfb10](https://github.com/unblocked-web/agent/commit/bacfb1020ff7e27c91dc53894ecb6572ff97b878))
* track frame network events before create ([56f924d](https://github.com/unblocked-web/agent/commit/56f924d9c2d815e09f1b1cd80ca9e3af41734450))


### Features

* move back to pipeTransport ([e13f048](https://github.com/unblocked-web/agent/commit/e13f048b22776bf847bddb870f921d148f243b10))





## [1.5.6](https://github.com/unblocked-web/agent/compare/v1.5.5...v1.5.6) (2021-08-15)


### Bug Fixes

* **core:** handle single page app location changes ([da27e1d](https://github.com/unblocked-web/agent/commit/da27e1d9affeccd838d72b53ea3dfc15654c098a))
* **puppet:** always shut down chrome ([b16ed81](https://github.com/unblocked-web/agent/commit/b16ed81715ef02630ab0f8f48f12c60b7a0f12ee))
* **puppet:** catch errors in indexedDb export ([a787b1d](https://github.com/unblocked-web/agent/commit/a787b1d94da81cb3ed768fb0b1587d96739a23e7))
* allow no rectangle for screenshot ([e4d5597](https://github.com/unblocked-web/agent/commit/e4d559717831afb277ca47b83c840c78dcf8fa08))





## [1.5.5](https://github.com/unblocked-web/agent/compare/v1.5.4...v1.5.5) (2021-07-29)


### Bug Fixes

* **client:** allow plugins in handlers ([5371d99](https://github.com/unblocked-web/agent/commit/5371d99dbb7968b55b895444203e7b204acfa19c))
* **core:** fix headed browser size/viewport docs ([c1623be](https://github.com/unblocked-web/agent/commit/c1623be023d8aa02a554231cd98d2ce6cb00216f))
* **mitm:** certs message invalid ([b6b0a5c](https://github.com/unblocked-web/agent/commit/b6b0a5c63f6ddab0f5a4523bf9698b75e4620485)), closes [#309](https://github.com/unblocked-web/agent/issues/309)
* change userAgent example to remove asterisk ([f268ae8](https://github.com/unblocked-web/agent/commit/f268ae8ab65510a008e6b4112330c89b23e9ff8c))
* cherrypick bug fixes from hero ([a3e8fbf](https://github.com/unblocked-web/agent/commit/a3e8fbfa42570df605487f53b5b0cc784eaf6423))
* lerna hero reference wrong ([de13ab7](https://github.com/unblocked-web/agent/commit/de13ab7c33301ff69575a4d43ce75378f6bcb4f1))
* restructure issues ([186bc06](https://github.com/unblocked-web/agent/commit/186bc0661fcacf541fb1577510c37e03c4f8eb70))
* reversed the reorg from two days ago ([aa5fddd](https://github.com/unblocked-web/agent/commit/aa5fddddbb66645bef9f6ab1b2d469bc9501f892))


### Features

* **plugins:** chrome 88 emulator data ([f537be2](https://github.com/unblocked-web/agent/commit/f537be23fa2d101f275d01671e3f0d12ac1374a6))





## [1.5.4](https://github.com/unblocked-web/agent/compare/v1.5.3...v1.5.4) (2021-07-14)


### Bug Fixes

* **mitm:** http2 session frame emulator data ([1e61a91](https://github.com/unblocked-web/agent/commit/1e61a91dad0f575ddbdde9dc66acba7e8de62df6))
* fixed paths ([6a28d80](https://github.com/unblocked-web/agent/commit/6a28d8069111356e0b63d23003187ecd08a365b8))
* fixed some unclear documentation related to plugins ([9868428](https://github.com/unblocked-web/agent/commit/98684285e5218808f506fad1cdf68c0e4662e017))
* useragent was not correctly parsing mac os 11 ([3a177ed](https://github.com/unblocked-web/agent/commit/3a177edb690f0f6373942720f3fdf304a2aad596))
* **core:** fix interact with elements in iframes ([c0c7a6e](https://github.com/unblocked-web/agent/commit/c0c7a6e0b93fddf418edf1298bb2d1419ebd65ed))
* **puppet:** clean data dir on close ([6c2b85f](https://github.com/unblocked-web/agent/commit/6c2b85f007656192a8c103c2aa6752a0de3ab091))
* **puppet:** retry on failure to delete chrome dir ([ccb07b3](https://github.com/unblocked-web/agent/commit/ccb07b3a9f77e51ce35fbd20dd6a5b8c7310eaf4))


### Features

* args can now be passed into ExecuteJsPlugin ([0ed06f0](https://github.com/unblocked-web/agent/commit/0ed06f0e98a3076c04e5a1aedd5e0dfc53ac6392))
* first stab at documenting plugins + simplified plugin architecture ([fcaa3cf](https://github.com/unblocked-web/agent/commit/fcaa3cfdca98b6f85128c196369d63ae40642df1))
* register Core plugins through agent.use ([eb08964](https://github.com/unblocked-web/agent/commit/eb0896454ed1e265459fc174a937f666c975844d))





## [1.5.3](https://github.com/unblocked-web/agent/compare/v1.5.2...v1.5.3) (2021-07-01)


### Bug Fixes

* **interfaces:** remove looping reference ([83d6d88](https://github.com/unblocked-web/agent/commit/83d6d8807b515b036980490eace7d80550b27f53))
* **mitm:** workers timing out on init ([42b8e5c](https://github.com/unblocked-web/agent/commit/42b8e5cdb6a466252e8ea20c3a1037dfc7b43999))
* **puppet:** headed not launching on ubuntu ([6f8a9a1](https://github.com/unblocked-web/agent/commit/6f8a9a17857e952bbcedfa26aede9bd2451604c4)), closes [#272](https://github.com/unblocked-web/agent/issues/272)
* **website:** fix contributors links ([e816b3b](https://github.com/unblocked-web/agent/commit/e816b3be3782b5382a07886c684e98964142247d))





## [1.5.2](https://github.com/unblocked-web/agent/compare/v1.5.1...v1.5.2) (2021-06-30)


### Bug Fixes

* **core:** headed mode broken ([9d6ad5b](https://github.com/unblocked-web/agent/commit/9d6ad5b54fb2d7464c3cbae90653a04af16d5c1f))
* **docs:** wrong frame api ([66733e5](https://github.com/unblocked-web/agent/commit/66733e541d8315d95fb71fc3da9896c0626cec61))
* **plugins:** inconsistent dom env properties ([405e91b](https://github.com/unblocked-web/agent/commit/405e91bc07fd7225c6eebe8d46843242c8527c48))
* **replay:** iframe display when load too quick ([784a0ef](https://github.com/unblocked-web/agent/commit/784a0efbe61e64062dcf8bd110cc6c8ddffd2902))
* **replay:** replay notifier breaks on unhandled ([21b38c5](https://github.com/unblocked-web/agent/commit/21b38c58e80c720ab24798ece7c9d0e2448d14e0))
* when importing plugins try default on require ([be0f7d5](https://github.com/unblocked-web/agent/commit/be0f7d5f285152cadb4eb62aad54ea4827b1fdef))


### Features

* **core:** improve mouse message when not there ([b9711d6](https://github.com/unblocked-web/agent/commit/b9711d6b3b27882ff2be711382464243493d71a7))
* dynamically require core extender plugins required by client ([f069514](https://github.com/unblocked-web/agent/commit/f069514fc01916437a37c281354a64eb4f14839f))





## [1.5.1](https://github.com/unblocked-web/agent/compare/v1.5.0...v1.5.1) (2021-06-28)


### Bug Fixes

* remove console logs, basic emulator bug ([c028062](https://github.com/unblocked-web/agent/commit/c028062a8130caa4cae1c65381bc66a55a6cf45b))





# [1.5.0](https://github.com/unblocked-web/agent/compare/v1.4.1-alpha.4...v1.5.0) (2021-06-28)


### Bug Fixes

* **replay:** show post navigations correctly ([f452cc4](https://github.com/unblocked-web/agent/commit/f452cc44f405f64cff2f7c070af9440e39176696)), closes [#259](https://github.com/unblocked-web/agent/issues/259)
* a number of tweaks to get client extender plugins working ([bc89574](https://github.com/unblocked-web/agent/commit/bc8957491b4b3180b67796ae9eb2487250a839df))
* eslint errors, tests hanging ([e413531](https://github.com/unblocked-web/agent/commit/e4135311adc2a7841bbe1ec7d0cbe7c8f339468a))
* hid BrowserEmulator and HumanEmulator docs until I finish rewriting them ([de8a549](https://github.com/unblocked-web/agent/commit/de8a5499955914be64992274bc3a0c8df656d437))
* userAgent option wasn't being properly extracted ([18dbda6](https://github.com/unblocked-web/agent/commit/18dbda6b5834d9900ba7f51260ad8519f7b4c56d))
* **client:** add key to detached tab ([5c9ed99](https://github.com/unblocked-web/agent/commit/5c9ed998d370d407bc45d47fb6af3528cf6bba05))
* **core:** flaky tests, fix interact with string ([0d708dd](https://github.com/unblocked-web/agent/commit/0d708ddfaddd3a03c9043cbc3d952836bc6e3350))
* **core:** flushing outside transactions ([5abd143](https://github.com/unblocked-web/agent/commit/5abd1439e875880c683f24e9b87fec0e4331b24c))
* **core:** noscript messing up frozen tabs ([6c55805](https://github.com/unblocked-web/agent/commit/6c558056985bd8049940ad76543aa535f7790bbb))
* **core:** store detached in sessions db ([4b228f3](https://github.com/unblocked-web/agent/commit/4b228f35157fc92dffc8e4c077e35f91bbb24e51))
* **core:** update attachedstate to nodepointer ([1bec22a](https://github.com/unblocked-web/agent/commit/1bec22a329b6da410fb7de0a36bcd6e19b23f902))
* **deps:** peg awaited dom version ([3e6ffaf](https://github.com/unblocked-web/agent/commit/3e6ffaf52cdf2933a5608417ee7178ed36512aa8))
* **dns:** handle dns socket disconnect ([8149e61](https://github.com/unblocked-web/agent/commit/8149e61d8eb6ea26e0e5a6c92a9f8abc6eb6dccf))
* **docs:** absolute urls to nested links ([480092b](https://github.com/unblocked-web/agent/commit/480092b03ce1b708fb8d9cff52090f1aea59087e))
* **docs:** frame link broken ([d428fd3](https://github.com/unblocked-web/agent/commit/d428fd38101c0d58f4f69aa98eb0efd2de5e92da))
* **emulate:** fix launching headed ([dd56372](https://github.com/unblocked-web/agent/commit/dd563728ff4d01fd4abf2f00c9c21339985c9679))
* **mitm:** clean premature shutdown errors ([8037c64](https://github.com/unblocked-web/agent/commit/8037c6470593994cdb05a0c3a761d982472e1601))
* **mitm:** fix install script, reuse same h2 conn ([ebb0693](https://github.com/unblocked-web/agent/commit/ebb06933879575c2bbaf311a50ac0e3ecc2ae843))
* **mitm:** handle malformed urls ([7190390](https://github.com/unblocked-web/agent/commit/71903904ae63b9fc2a236002c1420b0a0d95e299))
* **mitm:** http2 header order wrong ([801b3c8](https://github.com/unblocked-web/agent/commit/801b3c84a18f6eee51464d889edf9e01134fba9a))
* **mitm:** proper errors when mitm binary missing ([382669f](https://github.com/unblocked-web/agent/commit/382669fb2d86c86e010bf16ed3cdd0391d047f85))
* fixed issues with dns looking test ([e5bbb28](https://github.com/unblocked-web/agent/commit/e5bbb286b5c88a24dafc04a611114c2bfaec83ac))
* navigation test hanging ([115418a](https://github.com/unblocked-web/agent/commit/115418aa7b9d73e9ee74051a26faac4d3bea1a9f))
* **mitm:** remove blocking actions ([4a75179](https://github.com/unblocked-web/agent/commit/4a75179bc0bd1081a489e3a83d1f1dc57e50990e))
* **replay:** fix assets in different data location ([082dcff](https://github.com/unblocked-web/agent/commit/082dcffea00c25ba72a39e9b4f3f405406657db4))
* correctly match Dns error message in test ([9071d80](https://github.com/unblocked-web/agent/commit/9071d8021459bd3642bef1116b791c55967d3071))
* removed emulate-safari-13 dependency ([20b3c71](https://github.com/unblocked-web/agent/commit/20b3c71045f2fe4c25d80888acdd646157601654))
* setup submodules before running github lint ([6ce69c8](https://github.com/unblocked-web/agent/commit/6ce69c822c7286f3a596dd0a706a11c5f21a3bab))
* **puppet:** wait for loader before new tab ([d045701](https://github.com/unblocked-web/agent/commit/d045701d00f421b529b5aafd32e1e25a1a15da38))


### Features

* **client:** add output to handlers ([1c143b4](https://github.com/unblocked-web/agent/commit/1c143b4e84145a4eb5e8df0e52c7d69c64efeb7a))
* **client:** allow awaiting xpath ([708dfd9](https://github.com/unblocked-web/agent/commit/708dfd9ad09fbead841c88bdc54582fd7fe10868)), closes [#239](https://github.com/unblocked-web/agent/issues/239)
* **client:** update awaited-dom ([f9699fb](https://github.com/unblocked-web/agent/commit/f9699fbadb2c2020e88056edb33eeb5331ed1556))
* **client+core:** input/outputs ([d48a1de](https://github.com/unblocked-web/agent/commit/d48a1de1ae5f293fdb884ae23c2402cf4e14ee36))
* **core:** compress dom changes ([ef7def9](https://github.com/unblocked-web/agent/commit/ef7def9fcd7c72ef56a6a334e68562348fdbf7a3))
* **core:** detached tab ([9e32e47](https://github.com/unblocked-web/agent/commit/9e32e47f2e0c17a138593f554d966a346d2800e5))
* **core:** don’t save detached when no changes ([fbabac5](https://github.com/unblocked-web/agent/commit/fbabac5cd9475a87cfc3ee76d9f71df00a9de722))
* **core:** geolocation feature ([0ecbb14](https://github.com/unblocked-web/agent/commit/0ecbb14307c6cdebb99cf2e2ab3c3d27702aa6fa))
* **core:** javascript dialog handling ([e02d84b](https://github.com/unblocked-web/agent/commit/e02d84b3f1d5c01da5c2b581c6889922584a92d0))
* **core:** prefetch jsPaths from prior runs ([4f523bd](https://github.com/unblocked-web/agent/commit/4f523bdbafe18c19517831edd8d0b325dd023de4))
* **core:** store agent options in session table ([aab1025](https://github.com/unblocked-web/agent/commit/aab1025ccef2f3545743d98ec728161c47b51493))
* **core:** waitForFileChooser ([cf3beb9](https://github.com/unblocked-web/agent/commit/cf3beb9b3d06dbd3548e5a23746641f5addbfade))
* **docs:** add detached documentation ([18bbc64](https://github.com/unblocked-web/agent/commit/18bbc646ba1129e95e98cd45f953b15a5d7a36e0))
* **emulators:** drive devtools from emulator ([d71b9cd](https://github.com/unblocked-web/agent/commit/d71b9cd734c3621e25ddb5bd53544d1b7dcba504))
* **emulators:** move installation into emulators ([351c58d](https://github.com/unblocked-web/agent/commit/351c58d2fb3333725370bfb1dbc29027005ced8a))
* **emulators:** move launch args into emulators ([6888736](https://github.com/unblocked-web/agent/commit/6888736ca15d4a299a2a32a31568f61a5a90d1ce))
* **interact:** better error for null interaction ([40ba3cf](https://github.com/unblocked-web/agent/commit/40ba3cf97e0aa3d8a84f5b7e4a0a7d353a42604a))
* **interfaces:** fix devtools command typing ([00af054](https://github.com/unblocked-web/agent/commit/00af054cc6c971c59b35c964bbe3ba568aadb151))
* **mitm:** determine alpn on proxy connect ([398735d](https://github.com/unblocked-web/agent/commit/398735d4dd8ab219c520da775e92f42ee9889544))
* **plugin:** chrome dependencies in npm packages ([62d99c9](https://github.com/unblocked-web/agent/commit/62d99c90b0bc653f568eff9cf2279109f2d24bfe))
* **replay:** add output streaming to replay ([dd0f3b8](https://github.com/unblocked-web/agent/commit/dd0f3b87518c5967c41b8d79829f80899769ee6d))
* added support for plugins ([0fda55d](https://github.com/unblocked-web/agent/commit/0fda55d7a57d300d765c462389e76da0e1fe0822))
* **replay:** show frozen tabs ([d2eff14](https://github.com/unblocked-web/agent/commit/d2eff14ac12b06dfb1325a41f542c5ae9714a471))
* extracted browser emulators to their own repos ([e2ee11a](https://github.com/unblocked-web/agent/commit/e2ee11ac6609f6eb6b9afa3a6b83bddb13d30201))
* **mitm:** move mitm control to emulators ([d944805](https://github.com/unblocked-web/agent/commit/d944805edd92a52c5c7eb7a46e3d5de13c6e12cb))





## [1.4.1-alpha.4](https://github.com/unblocked-web/agent/compare/v1.4.1-alpha.3...v1.4.1-alpha.4) (2021-04-20)


### Bug Fixes

* **mitm:** store certs with network db ([eed99f1](https://github.com/unblocked-web/agent/commit/eed99f1c36841fc30e55265378a5c47a68ce7185))





## [1.4.1-alpha.3](https://github.com/unblocked-web/agent/compare/v1.4.1-alpha.2...v1.4.1-alpha.3) (2021-04-20)


### Bug Fixes

* **client:** explicit mjs exports ([d3e4525](https://github.com/unblocked-web/agent/commit/d3e4525ee8fb0430c4073791efde9741e01d9f9d))
* **core:** allow retrieving datasets ([582ed16](https://github.com/unblocked-web/agent/commit/582ed16fd07c09346afbbcd7f9e3d5e9e375aeb8)), closes [#213](https://github.com/unblocked-web/agent/issues/213)
* **core:** convert dates to numbers ([da17efe](https://github.com/unblocked-web/agent/commit/da17efecaa8301070ed3c98d8d4d423d44d50f74))
* **core:** fix location change triggers ([360dfa0](https://github.com/unblocked-web/agent/commit/360dfa0325bb5b87fe299c387d48b4bbcf45cabe))
* **core:** fix looping for node id lookup ([91ac3bc](https://github.com/unblocked-web/agent/commit/91ac3bcabe75bc8c4ef58518671727fc22e6a6b6))
* **core:** handle url not loaded yet for nav in 88 ([ddafb11](https://github.com/unblocked-web/agent/commit/ddafb114a9ce64fc16f9dc1171a60730d70bd56a))
* **core:** improve navigation tracking ([2e75570](https://github.com/unblocked-web/agent/commit/2e755704d182c960d7844a03be9874360dc11ba4))
* **core:** properly record back/forward nav ([6a1a52a](https://github.com/unblocked-web/agent/commit/6a1a52a5551c18d87d0c545bb0a3748e49e2cbdd))
* **emulate:** fix removed iframe platform ([27d2e4f](https://github.com/unblocked-web/agent/commit/27d2e4f356e1201383ccd2f568cd6696c949b8ae))
* **http:** timeout sockets that dont connect ([da59e41](https://github.com/unblocked-web/agent/commit/da59e419756c80ece2b6b34f8365e90c82673fff))
* **mitm:** fix ipc timeouts ([851be03](https://github.com/unblocked-web/agent/commit/851be03be65fb0718b8af8230ab76360a7f006ef))
* **puppet:** dont double-create isolated world ([0df01e2](https://github.com/unblocked-web/agent/commit/0df01e26184dca1f10aa0a43c8203b12e4eec8af))
* **puppet:** fix chrome-88 ([f917b52](https://github.com/unblocked-web/agent/commit/f917b5237fd9010e041b68fa493a77bfd4d8fea0))


### Features

* **client:** getJsValue should return value ([84dcd65](https://github.com/unblocked-web/agent/commit/84dcd650fb6dc358904374e59965a72e7c3b2aa6))
* **core:** optimize string reuse in high traffic ([3c03c3a](https://github.com/unblocked-web/agent/commit/3c03c3aa1639a74a38160fb9cfd13882774fc70f))
* **core:** single script install ([4b80047](https://github.com/unblocked-web/agent/commit/4b8004721c2146e09d1c6b33433500b79db02522))
* **core:** throw fetch error if no origin ([0c10980](https://github.com/unblocked-web/agent/commit/0c10980b9db085cd042444fb1eca9514eb89ba91))
* **mitm:** move go files to new dir ([23780f9](https://github.com/unblocked-web/agent/commit/23780f96668e9e0ac2db2a04f7300d33b77fc09e))
* **mitm:** support mitm per browser context ([f1dea45](https://github.com/unblocked-web/agent/commit/f1dea4525dbac2faac04e2779a1be7312c100df5))
* **mitm:** use shared mitm socket ([f80334b](https://github.com/unblocked-web/agent/commit/f80334b59f03f59dda63040b28146c51cff1825d))
* **puppet:** convert to websocket ([43af64e](https://github.com/unblocked-web/agent/commit/43af64e3ee6167bf8ff5c2f0c07977fc7a368ed1))
* updated chrome 80, 81, 83 + added 84, 85, 86, 87, and 88 ([62f9638](https://github.com/unblocked-web/agent/commit/62f96389abbe8c095d4eafb229293f8ee247edad))





## [1.4.1-alpha.2](https://github.com/unblocked-web/agent/compare/v1.4.1-alpha.1...v1.4.1-alpha.2) (2021-04-02)


### Bug Fixes

* **human:** fix re-hovering over current location ([7eb202a](https://github.com/unblocked-web/agent/commit/7eb202ab19c43af8642a395351db6debdf0eb83d)), closes [#209](https://github.com/unblocked-web/agent/issues/209)
* **mitm:** websockets use http1 in chrome ([0643003](https://github.com/unblocked-web/agent/commit/0643003d5878913b9439cc013cc2e6533711d423))


### Features

* **core:** return null for non-existent elements ([871c2fa](https://github.com/unblocked-web/agent/commit/871c2fa22d761e37836b3ecb1d765c6a5fc7cdee))
* **emulate:** wait 3 seconds after load ([1dd0fd5](https://github.com/unblocked-web/agent/commit/1dd0fd5b6d151339b8c19ea95db43eef60998b00))
* **replay:** show nodes running execJsPath ([bb1a270](https://github.com/unblocked-web/agent/commit/bb1a270aa44e5965443fdfa7640cdedb70ff005a))





## [1.4.1-alpha.1](https://github.com/unblocked-web/agent/compare/v1.4.1-alpha.0...v1.4.1-alpha.1) (2021-03-31)


### Bug Fixes

* **client:** adjust return error pattern to throw ([884e87d](https://github.com/unblocked-web/agent/commit/884e87db16a5706dc50416e3df0defa67f0606e2))
* **client:** fix logging dependency error ([22900c4](https://github.com/unblocked-web/agent/commit/22900c49da47e8ce0d910c255d9b535527ce040d))
* **core:** block resources not working ([5488b34](https://github.com/unblocked-web/agent/commit/5488b34230e85209c428469b9ed2356077443120))
* **core:** fix failing interact test ([d0993e6](https://github.com/unblocked-web/agent/commit/d0993e6539cdb10d502e8eec396414e04f6ad03c))
* **core:** hang closing ([233ff06](https://github.com/unblocked-web/agent/commit/233ff0678de8abd181e989ce849b21c0d9cbff6a))
* **emulate:** mask widevine checks ([65e8655](https://github.com/unblocked-web/agent/commit/65e8655e5d906ba538f9ebc84f21f7d6a5356f47))
* **mitm:** directly handle reused socket closing ([8651445](https://github.com/unblocked-web/agent/commit/86514453fe8e12314f61a28c7fcf1ffd673585e7))
* **mitm:** fix reusing sockets ([5d56597](https://github.com/unblocked-web/agent/commit/5d565975554fa8d8c3603031977efe99494a19f9))
* **mitm:** invalid header char bugs ([2d794d9](https://github.com/unblocked-web/agent/commit/2d794d928c74d36b1e8530e8350fe1aa8a51d656))
* **mitm:** store resources if tab not found ([60c76d0](https://github.com/unblocked-web/agent/commit/60c76d0bbca07cf1d1338d2ba1593f9725beae6f))
* **puppet:** enable gpu by default ([9a06165](https://github.com/unblocked-web/agent/commit/9a061657eaf844a385e17953cb7436181fadad6a))
* **puppet:** record logs for failing tests ([3d7ee18](https://github.com/unblocked-web/agent/commit/3d7ee18101bf6c913438901d9191caf1116de35f))


### Features

* **handler:** re-q unstarted agents on disconnect ([b0ece5b](https://github.com/unblocked-web/agent/commit/b0ece5bdaa203352932dd524b1eddc082df6fb31))
* **interact:** peg nodeid for interactions ([8a4db76](https://github.com/unblocked-web/agent/commit/8a4db764b11cd9b0fae0acde44ee7887d7c9f2ef))





## [1.4.1-alpha.0](https://github.com/unblocked-web/agent/compare/v1.4.0-alpha.1...v1.4.1-alpha.0) (2021-03-23)


### Bug Fixes

* **client:** properly handle unhandled disconnect ([e3afedd](https://github.com/unblocked-web/agent/commit/e3afedd90f0c614dab8ed5a02ba40de013e24b1d))
* **core:** stop writing to db if it goes readonly ([9fc9e2f](https://github.com/unblocked-web/agent/commit/9fc9e2f67ea5a5dd495fbfcb6946698c279c118c))
* **core:** type serializer, fix null headers issue ([e4d832b](https://github.com/unblocked-web/agent/commit/e4d832b62278c67c59edb7bb6d0b2097a6b8669b))
* **emulator:** polyfill setAppBadge/clearAppBadge ([5cfa400](https://github.com/unblocked-web/agent/commit/5cfa40082de419458656370622552c668b0a071f))
* **ghost:** fix oom error ([7ec100f](https://github.com/unblocked-web/agent/commit/7ec100f2070223a9172855fa23cedfcc61537755))
* **mitm:** cached resources to use cached status ([26079b5](https://github.com/unblocked-web/agent/commit/26079b5ee040efc7abbc57a422bb356f9b41a39e))
* **mitm:** empty headers bug, clean errors ([3170688](https://github.com/unblocked-web/agent/commit/3170688287dce2cc3d431a26da027e11e33049cd))
* **mitm:** fix url error ([d53ae18](https://github.com/unblocked-web/agent/commit/d53ae18a905fce3fea45a1e19edd9498ed4c54bd))
* **mitm:** some WHATWG urls failing to parse ([4e29bbb](https://github.com/unblocked-web/agent/commit/4e29bbb5c88d8ba25badf38021ff9f443c32ff29))
* **puppet:** don’t emit timeouts ([1dd386f](https://github.com/unblocked-web/agent/commit/1dd386f7cde45a66c7976a63b1e162b5b93863f1))
* **puppet:** handle crashed windows ([290e923](https://github.com/unblocked-web/agent/commit/290e923544008c3cd84b568c2d8a7c2f0de38437))


### Features

* **client:** expose frames ([44a6b12](https://github.com/unblocked-web/agent/commit/44a6b129fef6f541cffc24e8913fd76defcf3aef))





# [1.4.0-alpha.1](https://github.com/unblocked-web/agent/compare/v1.4.0-alpha.0...v1.4.0-alpha.1) (2021-03-11)


### Bug Fixes

* test timeout ([b7b6af2](https://github.com/unblocked-web/agent/commit/b7b6af2a28d349df8e7e9aed49ca3bfe67ad08e1))





# [1.4.0-alpha.0](https://github.com/unblocked-web/agent/compare/v1.3.1-alpha.1...v1.4.0-alpha.0) (2021-03-11)


### Bug Fixes

* **client:** fix close handling ([f413ea8](https://github.com/unblocked-web/agent/commit/f413ea8c66b0e07512a7b6fbd0d9857bebad1d7c))
* **client:** resource timeout + blank new tab ([4fdd378](https://github.com/unblocked-web/agent/commit/4fdd3789edf9c2a7290b4deb660aa2d7194ec9c8))
* **client:** translate errors when session n/a ([6c15793](https://github.com/unblocked-web/agent/commit/6c15793f67cadfcf7d62e270848fbef895e397af))
* **core:** exports not working <= node 14.12 ([d793601](https://github.com/unblocked-web/agent/commit/d793601a052c243a541cf0331c79d00bc1332d1e))
* **core:** handle canceled navigation redirect ([348c058](https://github.com/unblocked-web/agent/commit/348c05863519ad6daaf8386c35a2b021883bd386))
* **core:** try to fix tab test ([2f74a1e](https://github.com/unblocked-web/agent/commit/2f74a1e48f2aa04d05c9826ac654de88686af597))
* **docs:** reference Chrome vs Chromium ([94226b2](https://github.com/unblocked-web/agent/commit/94226b20aff716f150a8d1134052ddef7b188378))
* **ghost:** fix oom in bezierjs ([1d4ab06](https://github.com/unblocked-web/agent/commit/1d4ab06c572f1d9aff7b8edd00ba9603c7da1f45))
* **mitm:** don’t let dns errors go unhandled ([c8d8ac0](https://github.com/unblocked-web/agent/commit/c8d8ac08e9cf1923f14e47318857bccdab85504e))
* **mitm:** don’t wait for browser resources ([4c70bd5](https://github.com/unblocked-web/agent/commit/4c70bd5ae89bf38cda80049d522e0b25f842240d)), closes [#176](https://github.com/unblocked-web/agent/issues/176)
* **mitm:** enable cache handler for test ([79e069b](https://github.com/unblocked-web/agent/commit/79e069b71798fd5fa53fe1927db8729a75a7e61a))
* **mitm:** handle http2 push canceled errors ([f1fbe4d](https://github.com/unblocked-web/agent/commit/f1fbe4de5277c603af894b30a917157b39873b90))
* **mitm:** try/catch around mitm throw areas ([e58b7a2](https://github.com/unblocked-web/agent/commit/e58b7a2ba67ab6c5a435b83fa2b69b3ecc8f3465))
* **replay:** don’t remove preserved tags ([fe023d5](https://github.com/unblocked-web/agent/commit/fe023d5707fb9b1c7e1bed987bbde4ba0dd6511d))
* failing test ([a6ae58d](https://github.com/unblocked-web/agent/commit/a6ae58dc02940fce6a9184d0d5adc1b2ee29bd45))
* failing test ([9064518](https://github.com/unblocked-web/agent/commit/906451802f31f362c7e82bf2b094a03bfcf74420))
* lerna config ([77a1810](https://github.com/unblocked-web/agent/commit/77a18100ba1e29576323b35e1e947bf83d96b5e5))
* removed unnecessary browserVersionDir in EngineFetcher ([9daa98a](https://github.com/unblocked-web/agent/commit/9daa98a42234b27898e2e2c2bada3815a5826ba6))
* renamed some vars, removed chromium blocks, and modified BrowserFetcher ([60955b2](https://github.com/unblocked-web/agent/commit/60955b259c15c887e20ae423ed8683caed80751d))
* test reliability ([76aea40](https://github.com/unblocked-web/agent/commit/76aea4051f71f489a62c15385a337b17a19afaf2))
* **puppet:** extract linux chrome ([55f8ef5](https://github.com/unblocked-web/agent/commit/55f8ef57ba410685697f5dc73f923026c8b0c4a6))
* **puppet:** no chrome launch errors to client ([1e636a6](https://github.com/unblocked-web/agent/commit/1e636a6625c47c67ee8a4e7d5be05ce99b513a5f))


### Features

* **client:** coreHost & disconnecting errors ([aed9fc3](https://github.com/unblocked-web/agent/commit/aed9fc3f49996a661ab6b70e5446c9442649802a)), closes [#165](https://github.com/unblocked-web/agent/issues/165)
* **client:** waitForAllDispatchesSettled ([cf3e6b5](https://github.com/unblocked-web/agent/commit/cf3e6b540fd312e771f72ff27a08bf3ee9f6212a))
* **puppet:** switch to chrome ([d064e53](https://github.com/unblocked-web/agent/commit/d064e53ace2107ac95348cf721c3cc35afe07efc))
* **puppet:** unsupported linux install message ([fe6e634](https://github.com/unblocked-web/agent/commit/fe6e63472a813c6275433b8dfb00e094c49c8a6a))
* **puppet:** update docker to for new installs ([19351b5](https://github.com/unblocked-web/agent/commit/19351b556718161c885b5dfb12f7fa80af8daf46))
* **replay:** update for mac silicon + deps ([30ffec7](https://github.com/unblocked-web/agent/commit/30ffec74fc06485b56344f17374a082d2055c1f1))
* **website:** blog post about chrome + atom ([b6dc12b](https://github.com/unblocked-web/agent/commit/b6dc12b4eb008100d30c58699468b877ce1e86ff))
* **website:** blog post about chrome + atom ([5f0cafa](https://github.com/unblocked-web/agent/commit/5f0cafa633f50aa0757dc3627ec6b06c27fd8f99))





## [1.3.1-alpha.1](https://github.com/unblocked-web/agent/compare/v1.3.1-alpha.0...v1.3.1-alpha.1) (2021-02-19)


### Bug Fixes

* os version should fallback to major if no minor exists ([374cf76](https://github.com/unblocked-web/agent/commit/374cf7601060350df985f2ff41bde56c6cd8b824))
* pass all node vars to CoreProcess ([821a438](https://github.com/unblocked-web/agent/commit/821a4381e1a79717b19e1a95ce3e2bbb1cc6177c))





# [1.3.0-alpha.4](https://github.com/unblocked-web/agent/compare/v1.3.0-alpha.3...v1.3.0-alpha.4) (2021-02-15)


### Bug Fixes

* **core:** fix core shutdown test ([28dd09a](https://github.com/unblocked-web/agent/commit/28dd09af20572a1ac2962abcde20599f119a3508))
* **core:** only reject navigation with errors ([7e7cfd3](https://github.com/unblocked-web/agent/commit/7e7cfd37cff860422d8c46bed90eba31652df9d5)), closes [#153](https://github.com/unblocked-web/agent/issues/153)
* **core/client:** export usable mjs/cjs ([ca149ef](https://github.com/unblocked-web/agent/commit/ca149efbfbdf03da0fda7d127348e5de6f2a4f8b))
* **emulate:** clean toString stack trace ([21582b3](https://github.com/unblocked-web/agent/commit/21582b31d891d19299c22ddf30e15a6c38bf242a))
* **logger:** don’t use colors if disalbed in node ([c3af5a0](https://github.com/unblocked-web/agent/commit/c3af5a07984865bfa6f5278fe442bea80f00166f))
* **mitm:** change log level of mitm request errors ([da9f98f](https://github.com/unblocked-web/agent/commit/da9f98fe3df7feb79585b686ab9fe0474dea9e27))
* **puppet:** fix waiting for worker ready ([e511009](https://github.com/unblocked-web/agent/commit/e51100900dd52c6962639bab240f1cdac24f5d50))


### Features

* **client:** add http cache and load failures ([571e64f](https://github.com/unblocked-web/agent/commit/571e64f108df7a0cbfd32609c37ff76261014dc6))
* **emulate:** workers run stealth scripts ([e6e845e](https://github.com/unblocked-web/agent/commit/e6e845e68654c73ddaefe2110065a20d044f773d))





# [1.3.0-alpha.3](https://github.com/unblocked-web/agent/compare/v1.3.0-alpha.2...v1.3.0-alpha.3) (2021-02-11)


### Bug Fixes

* **core:** cancel interaction on navigate ([eaa6605](https://github.com/unblocked-web/agent/commit/eaa6605d9325618cde2a281aa699ab4a6d82be83))
* **core:** only wait for main frame ([52d36d8](https://github.com/unblocked-web/agent/commit/52d36d81609f65105cc30667378d67155b271f76))
* **docs:** fix port param in remote docs ([3b452d8](https://github.com/unblocked-web/agent/commit/3b452d871e3778c6ca6fb1d19ec0b44bdbec4da7))
* **puppet:** non-popups getting opener ([e79584f](https://github.com/unblocked-web/agent/commit/e79584f5b71557bebe86b0301a8a0e9e55d8ac8f))





# [1.3.0-alpha.2](https://github.com/unblocked-web/agent/compare/v1.3.0-alpha.1...v1.3.0-alpha.2) (2021-02-09)


### Bug Fixes

* **blog:** fix some blog typos ([e85efb6](https://github.com/unblocked-web/agent/commit/e85efb686a99bd1f9395e107aa528703de7b9259))
* **client:** correctly catch some canceled promise ([1d5906f](https://github.com/unblocked-web/agent/commit/1d5906f5bff7e757bd084bb98883b56f3cf22bbe))
* **client:** fix reviving stack traces in typeson ([7a0e38b](https://github.com/unblocked-web/agent/commit/7a0e38b6e8efd30a2d70c0c3c73d8fc121e316a9))
* **dist:** copy .mjs files properly to npm dist ([cc717e0](https://github.com/unblocked-web/agent/commit/cc717e02ef94233ad867393640fc740b26038a95))
* **docs:** document missing props ([58e6a68](https://github.com/unblocked-web/agent/commit/58e6a68d1d1755fe459e9a1cb1151ce959e8c143)), closes [#156](https://github.com/unblocked-web/agent/issues/156)
* **mitm:** error reading destroyed from scoket ([f09e67f](https://github.com/unblocked-web/agent/commit/f09e67f95ffa70c96e2c4a1c24fc4883c4aa2c50))
* **mitm:** read failed/cached browser resources ([150db8b](https://github.com/unblocked-web/agent/commit/150db8b3785705afdc54b915684ae0c828a5ecf8))





# [1.3.0-alpha.1](https://github.com/unblocked-web/agent/compare/v1.3.0-alpha.0...v1.3.0-alpha.1) (2021-02-06)


### Bug Fixes

* ejs modules not being copied to dist ([606102e](https://github.com/unblocked-web/agent/commit/606102e1a671b9a3dbab16b4411af8499aed3820))
* fix some linting in DomExtractor + added it to eslint ignore ([952943f](https://github.com/unblocked-web/agent/commit/952943ff3f7d50c475dc0c9de78bcf4b206f526a))
* pulled latest DomExtractor from DA ([a599e05](https://github.com/unblocked-web/agent/commit/a599e058560732aa6a83f2994d4b3dc9628e2d6f))
* sessionId should be set on browserEmulator regardless of user Profile ([083260d](https://github.com/unblocked-web/agent/commit/083260dcfd47037879bf2bec8bed56f47eae8a41))
* some tests were failing ([91217b2](https://github.com/unblocked-web/agent/commit/91217b2e7d79a0d8a1a9b9c2e388b5dab7af3372))


### Features

* replaced chrome 80, 81, 83 emulators with more robust os-level data ([276b269](https://github.com/unblocked-web/agent/commit/276b26923368c5ed5636f65ad14fb2b3a9f87e9e))
* **core:** friendly message setting cookies ([a9d9ecf](https://github.com/unblocked-web/agent/commit/a9d9ecf054f6e21db037093fc255ae8fc26da3a7)), closes [#142](https://github.com/unblocked-web/agent/issues/142)
* **core:** tweak logging for not-really-errors ([bd5f9eb](https://github.com/unblocked-web/agent/commit/bd5f9ebf38eb58adc14542dc4e32737b0ad8ff9e))
* **replay:** don’t hang if screen not available ([22edc84](https://github.com/unblocked-web/agent/commit/22edc8412216a50b98b7cf99f6a32e0bc4687e1d)), closes [#146](https://github.com/unblocked-web/agent/issues/146)
* **replay:** fix ubuntu loading dashboard over replay ([a9e633a](https://github.com/unblocked-web/agent/commit/a9e633a19099d36385cc3cc5e90108543caa9867))





# [1.3.0-alpha.0](https://github.com/unblocked-web/agent/compare/v1.2.0-alpha.5...v1.3.0-alpha.0) (2021-02-02)


### Bug Fixes

* **build:** ignore emulator json files for ts ([b64f208](https://github.com/unblocked-web/agent/commit/b64f2087003502383643056f6db9257b98b231c8))
* **client:** allow waiting on resources ([d3414a8](https://github.com/unblocked-web/agent/commit/d3414a8f82b3c31c012953bf739d493076f0a759))
* **client:** error handling for session connect ([82e58b8](https://github.com/unblocked-web/agent/commit/82e58b826908d7e14d21f58673b1eb0044b4b9a2))
* **core:** elements offscreen fail isVisible ([f0042fc](https://github.com/unblocked-web/agent/commit/f0042fc79bc8006c34c2eae408e193ad3eea7fb7))
* **core:** full close down of on premature exit ([aa53e85](https://github.com/unblocked-web/agent/commit/aa53e85782a57da4d69f8750a5c3719c60683f5b))
* **core:** handle visible for height > innerHeight ([b7a1e65](https://github.com/unblocked-web/agent/commit/b7a1e65dced687fb3df0677a26e6b56cc1e34c97))
* **core:** isVisible fix, scroll below 0 fix ([7c0c451](https://github.com/unblocked-web/agent/commit/7c0c451a2bf4675fc07205649ca78bc56fe7890c))
* **emulators:** safari cookie handling fix ([3507c26](https://github.com/unblocked-web/agent/commit/3507c2665afd6e94b5f99633e748fa4d455d81db))
* **mitm:** preflight requests not always sent ([45ebe22](https://github.com/unblocked-web/agent/commit/45ebe224cd60c9e518139ff40786b90ee640be52))
* **puppet:** assigning wrong id to network fetches ([c4b6746](https://github.com/unblocked-web/agent/commit/c4b674655ceff4a4642fe9aada355709dc243e22))
* **puppet:** fallback to requestid in fetch ([28ad324](https://github.com/unblocked-web/agent/commit/28ad3242d679c8fa1d67e2f278f559a61fdd46ff))
* **puppet:** launch non-default (83) headed chrome ([84a02aa](https://github.com/unblocked-web/agent/commit/84a02aa48db41ecb3a1e831e56a4bf1fb805486e))
* **replay:** fix replay launch in new setup on win ([add1b97](https://github.com/unblocked-web/agent/commit/add1b97084d9d83f0cdad77362a238aeef92cf68))
* added userAgentOptions() to @BrowserEmulatorClassDecorator ([0a2187c](https://github.com/unblocked-web/agent/commit/0a2187ca3937618aa59f87045e03c34d13ff7cf0))
* converted some props of IBrowserEmulator to optional ([8e74bed](https://github.com/unblocked-web/agent/commit/8e74bed69d03bbc961292d4a3b89f9706cb1d555))
* emulators only had partial data ([3dd86db](https://github.com/unblocked-web/agent/commit/3dd86db74cdc6e3e02afc7556e1ba41716c37293))
* mitm session ports were getting reused and conflicting ([0e11465](https://github.com/unblocked-web/agent/commit/0e11465d3882234e1cc650f372155458ea8bd6e1))
* **replay:** upgrade axios (dependabot) ([2f55df9](https://github.com/unblocked-web/agent/commit/2f55df902cd7d3cf5e542c57c7df01f869340cf8))
* added url in comments to show where darwinToMacOsVersionMap was pulled ([ed873b1](https://github.com/unblocked-web/agent/commit/ed873b11965ab7255e32202b1b9e84d754178d89))
* allow setting SA_SHOW_REPLAY in a script ([18d63d6](https://github.com/unblocked-web/agent/commit/18d63d640dc69e83512908bbdec1263aba87d953))
* disabled eslint rule for a failing line ([749ae1e](https://github.com/unblocked-web/agent/commit/749ae1e65b86338ff9666b9e3e7dc9dadf114677))
* increase node memory limit for yarn lint on github ([9c8a914](https://github.com/unblocked-web/agent/commit/9c8a914d3b4b63aaa31812e014631770fbf95977))
* tweaked a few lint issues ([ad9f17d](https://github.com/unblocked-web/agent/commit/ad9f17da63bad824a7e2dba8d77c0ec0fe9ea9da))
* updated dom diffs to include all oses supported by browserstack ([686a2e2](https://github.com/unblocked-web/agent/commit/686a2e2c00dd4191db79824f29ac119a1e99715e))
* updated some things to work with Slab ([51dada5](https://github.com/unblocked-web/agent/commit/51dada5d267ec05a6dbe3d1da9f62b4f3754d5a1))
* viewports window width/height must include frame border width/height ([cca0c8e](https://github.com/unblocked-web/agent/commit/cca0c8ec66bee1eafd7dcac2564eb8e0fc18747c))


### Features

* **client:** add ability to get agent metadata ([55df775](https://github.com/unblocked-web/agent/commit/55df775b3b9e78db99bc726ae54a683cc701a7e2))
* **client:** add sessionid/name to logs + errors ([7d88f35](https://github.com/unblocked-web/agent/commit/7d88f3555076647307dc1e9e6cea9b102033c756))
* **client:** built-in remote + handlers ([bfaa739](https://github.com/unblocked-web/agent/commit/bfaa739517a458db9dd1bd6374770840eb95b847))
* **client:** coreConnection as configuration ([ac284ca](https://github.com/unblocked-web/agent/commit/ac284cac3fa867a9623fd841edf96d04906e3072))
* **client:** export required enums and consts ([4cce3a7](https://github.com/unblocked-web/agent/commit/4cce3a769e41bba49ad8a8bc8c83de53711f091b))
* **core:** add getComputedStyles to tab ([0e3bccd](https://github.com/unblocked-web/agent/commit/0e3bccd9c27ac1e6b122238ca7292182c169ebe6))
* **core:** add screenshot capability ([f075f89](https://github.com/unblocked-web/agent/commit/f075f89636edb81c4626c51929665373069de31a))
* **core:** confirm mouse clicks hit targets ([bf2b047](https://github.com/unblocked-web/agent/commit/bf2b047ca9e49665f7f150e66780b79fd02b7972))
* **core:** convert all connections to server ([a27fafd](https://github.com/unblocked-web/agent/commit/a27fafd9a04e52f602a557f7304164c2308006c6))
* **core:** convert closing logs to stats ([382979d](https://github.com/unblocked-web/agent/commit/382979df1a758de82297169465be0e57c2c87b53))
* **core:** convert server to use websockets ([2d1804c](https://github.com/unblocked-web/agent/commit/2d1804ce7521fe065c01491e3f5e084852369f55))
* **core:** merge injected scripts into core ([f674f7b](https://github.com/unblocked-web/agent/commit/f674f7b85a9cf66dd3558d849a78f6b9aa1099dc))
* **core:** merge session-state and core ([dcc6002](https://github.com/unblocked-web/agent/commit/dcc6002c2003d981267e51c8dacf5201fe3b9fda))
* **core:** timeouts for back/fwd/goto, add reload ([bae2a8e](https://github.com/unblocked-web/agent/commit/bae2a8eaf20b2a855c98986d5c2c9b5e11b004ec))
* **core:** waitForLocation/Load takes a timeout ([02758c7](https://github.com/unblocked-web/agent/commit/02758c7fc1e5394db84f91aa8235c3364b6c0692))
* **core:** waitForPaintingStable ([1955b79](https://github.com/unblocked-web/agent/commit/1955b791ce8a7cf20a679986e63885950efa6813))
* **dns:** global cache for dns ([55f253d](https://github.com/unblocked-web/agent/commit/55f253d9be1fb8fb9e3bd410cc6bc58bb69fedba))
* **replay:** ability to launch via bin ([518d320](https://github.com/unblocked-web/agent/commit/518d320e157b4d28e0ce99864c4f53aa5fa439a8))
* **replay:** allow running out of a dist dir ([e5bfe21](https://github.com/unblocked-web/agent/commit/e5bfe211e0388bd4b1be1da97356046b983b80ea))
* **replay:** convert api to use web sockets ([18c8008](https://github.com/unblocked-web/agent/commit/18c80087d22f3ee95ee2eb5853b422219da6ceb1))
* **replay:** move to lighter semver lib ([5c4d1dc](https://github.com/unblocked-web/agent/commit/5c4d1dcfaf4a79d6457857647203addbbda8eba5))
* **replay:** prefer local build to binary ([71589cf](https://github.com/unblocked-web/agent/commit/71589cfc0ae8f31911e72b9f3e1fd3bcc4254c35))
* **replay:** single install of replay ([5425bee](https://github.com/unblocked-web/agent/commit/5425bee76488ac5bff4f46d8b99eb874dd7f5a35))
* browser window size now takes into calculation os nav bars ([ab65a65](https://github.com/unblocked-web/agent/commit/ab65a650e4b63e77ad5e165f7a60e3e024140f66))
* emulators pull roundRobinPercent from config ([2590387](https://github.com/unblocked-web/agent/commit/2590387d4ca7f79e6916e3321b5d27e19c6a1341))
* mv renderingOptions => blockedResourceTypes ([ffa1b74](https://github.com/unblocked-web/agent/commit/ffa1b74d0b470387ec104027667e8523a51bfa15)), closes [#113](https://github.com/unblocked-web/agent/issues/113)
* **website:** blog post on handlers ([8024f03](https://github.com/unblocked-web/agent/commit/8024f0343e63689afd9aba589e80816a5880f838))
* pull in os-version maps from Slab to reduce chance of stale data ([201b3c9](https://github.com/unblocked-web/agent/commit/201b3c9d028b798ce4a88ec05fd9833c95d89a0b))
* randomize the Viewports browser positionX/Y ([66c1f4a](https://github.com/unblocked-web/agent/commit/66c1f4a89a434352ae5c8add46481c1f6d28f03f))
* updated emulator data to handle more runtime OSes ([f57f3b5](https://github.com/unblocked-web/agent/commit/f57f3b5f1b18bcdaf56bf7e9a4475bf2e0c0b1c6))


### BREAKING CHANGES

* renames “renderingOptions” to “blockedResourceTypes”. Default is now “None”





# [1.2.0-alpha.5](https://github.com/unblocked-web/agent/compare/v1.2.0-alpha.4...v1.2.0-alpha.5) (2020-12-29)


### Bug Fixes

* **browser-emulators:** fix cross frame tostring ([27a69d9](https://github.com/unblocked-web/agent/commit/27a69d9703766d653c0e841e6d69458e643faba2))
* **mitm:** bug with duplicate header on response ([ba3c015](https://github.com/unblocked-web/agent/commit/ba3c015db4f62af5c7e77d6694fec9ad7679882c)), closes [#111](https://github.com/unblocked-web/agent/issues/111)
* **puppet:** workers not tracking devtools calls ([b339758](https://github.com/unblocked-web/agent/commit/b339758c8bb5b2076f1337dee3d0deefaf3fb7ad))





# [1.2.0-alpha.4](https://github.com/unblocked-web/agent/compare/v1.2.0-alpha.3...v1.2.0-alpha.4) (2020-12-22)


### Bug Fixes

* **replay:** replay crashes on win10 during load ([b6e517b](https://github.com/unblocked-web/agent/commit/b6e517bcd6a66bf206c8a2436374cca401f5b00d))
* **replay:** shutting down before example load ([937fd9b](https://github.com/unblocked-web/agent/commit/937fd9b3452053687c13760c643141b7eab6534a))





# [1.2.0-alpha.3](https://github.com/unblocked-web/agent/compare/v1.2.0-alpha.2...v1.2.0-alpha.3) (2020-12-16)


### Bug Fixes

* **mitm:** bubble proxy errors properly to client ([b6a72f5](https://github.com/unblocked-web/agent/commit/b6a72f59ef8e7739654ab82b170aa0e15d38ebd0)), closes [#98](https://github.com/unblocked-web/agent/issues/98)
* **replay:** multiple sessions showing incorrectly ([20ba30c](https://github.com/unblocked-web/agent/commit/20ba30caebcef42de65dee18e6b82d92c7193d9c))


### Features

* **client:** update awaited dom to 1.1.8 ([a1b9b68](https://github.com/unblocked-web/agent/commit/a1b9b68e735ee54ceaef3436c43df0d0744c8f47))





# [1.2.0-alpha.2](https://github.com/unblocked-web/agent/compare/v1.2.0-alpha.1...v1.2.0-alpha.2) (2020-12-01)


### Bug Fixes

* **core:** don’t wait to scroll past bottom ([9f8877b](https://github.com/unblocked-web/agent/commit/9f8877b0b78924c8cf364b891ec2ed0ca6167d92))
* **core:** fix errors on goto bubbling up ([30d4208](https://github.com/unblocked-web/agent/commit/30d4208c079e171fd6e0640810a4812e0a9a3d59))
* **docs:** secret agent.md url broken ([167fe5a](https://github.com/unblocked-web/agent/commit/167fe5a37b7f32257b59ddd38e5142728ffc768c))
* **emulate-humans:** fix some tests ([b1e05d7](https://github.com/unblocked-web/agent/commit/b1e05d79168fdf60f4ba6c63b8b74441c5c52f56))
* **eslint:** add return types to client code ([c2e31cc](https://github.com/unblocked-web/agent/commit/c2e31ccba4974f2bda269e77e6df9b82a2695d4f))
* **mitm:** remove auth as separate proxy param ([ec14b30](https://github.com/unblocked-web/agent/commit/ec14b302ed6389769b61e77337ba9fe873a647ed))
* **mitm-socket:** fix cpu spiking sockets ([b71e141](https://github.com/unblocked-web/agent/commit/b71e14158c1bb948e9ce33abf01b4522930caafe))
* **replay:** fix stalling loads ([7ca1dbd](https://github.com/unblocked-web/agent/commit/7ca1dbd91e59d5c5d6812ba62bec517f746b2374))
* don’t use vertical screen orientations ([7121e94](https://github.com/unblocked-web/agent/commit/7121e940e331e8a15fa9b67dfc3b3d0322ddb161))


### Features

* **proxy:** configure proxy via client + socks5 ([880c938](https://github.com/unblocked-web/agent/commit/880c93803bebc78b835a8f2fb5133d633a315337))





# [1.2.0-alpha.1](https://github.com/unblocked-web/agent/compare/v1.2.0-alpha.0...v1.2.0-alpha.1) (2020-11-20)


### Bug Fixes

* emulators should not use accept-language values from json if using custom locale ([fc00660](https://github.com/unblocked-web/agent/commit/fc0066009a95bba60df2d7de6ed9a5435a807d4b))
* emulators were failing some double-agent tests ([5ae4f55](https://github.com/unblocked-web/agent/commit/5ae4f5507662ed91d19086d9dbab192e50a8f5c5))
* unwind some dependencies ([240bea6](https://github.com/unblocked-web/agent/commit/240bea6ac7cb87bfcccbc56fb54043f5c2ff7b4b))


### Features

* **human-emulators:** ghost emulator ([70bcf27](https://github.com/unblocked-web/agent/commit/70bcf273a2e995f8168dced9797d441b6eaec80b))





# [1.2.0-alpha.0](https://github.com/unblocked-web/agent/compare/v1.1.0-alpha.1...v1.2.0-alpha.0) (2020-11-11)


### Bug Fixes

* **emulator:** bug fix for Error.toString ([d23704a](https://github.com/unblocked-web/agent/commit/d23704a3731d2f5617d0493064c8c9593793b4df))


### Features

* **awaited-dom:** documentation for props ([029a1f5](https://github.com/unblocked-web/agent/commit/029a1f5b10cc13119d4bb808d35f80cce4aeb3dd))
* **browser-emulators:** refactor emulator filenames ([b5da042](https://github.com/unblocked-web/agent/commit/b5da0426e39aad64178659cc93f441f781f917ba))
* **core:** store data files in a single location ([c3299b6](https://github.com/unblocked-web/agent/commit/c3299b6a0dc2fc42d7a7df3746ab34c2d8b15ea0))





# [1.1.0-alpha.1](https://github.com/unblocked-web/agent/compare/v1.1.0-alpha.0...v1.1.0-alpha.1) (2020-11-05)


### Bug Fixes

* **mitm:** should add host to http1 headers ([b655ea9](https://github.com/unblocked-web/agent/commit/b655ea925b531a53bb9b55271df5150881783bcf))


### Features

* **client:** get/set/delete cookies + domstorage ([2e2de6b](https://github.com/unblocked-web/agent/commit/2e2de6b9f2debf5eadf54b03b3f8d9db7cace269))
* **client:** split out IUnblocked AgentClass ([8765900](https://github.com/unblocked-web/agent/commit/876590001e62598daaad71d9a236e94600717c72))





# [1.1.0-alpha.0](https://github.com/unblocked-web/agent/compare/v1.0.0-alpha.21...v1.1.0-alpha.0) (2020-11-03)


### Bug Fixes

* **puppet:** incorrect reuse of executionContextId ([e5d8f8d](https://github.com/unblocked-web/agent/commit/e5d8f8d1e90c7cebefae51b570ddb743ea8f39fe))


### chore

* **client:** merge Browser/User into Unblocked Agent ([364ed8a](https://github.com/unblocked-web/agent/commit/364ed8ab9c16cdf40c8ad1f151de4b06efcc557d))


### BREAKING CHANGES

* **client:** this change modifies the core interface for interacting with SecretAgent, as createBrowser is removed.





# [1.0.0-alpha.21](https://github.com/unblocked-web/agent/compare/v1.0.0-alpha.20...v1.0.0-alpha.21) (2020-11-02)


### Bug Fixes

* **core:** improved waitForElement ([4d139b3](https://github.com/unblocked-web/agent/commit/4d139b3aa920dc400691eb035f61936948e187b0))
* **mitm:** cache content-type ([68d7384](https://github.com/unblocked-web/agent/commit/68d7384305e46106830f1a548d6de77c7b9deb07))
* **replay:** cross domain iframes ([db65711](https://github.com/unblocked-web/agent/commit/db6571120ccf1c5fa59c091bde6d752706c5c2e6))
* **replay:** loading resources ([747f4ff](https://github.com/unblocked-web/agent/commit/747f4ff24ba7ef1b162f0a2a5f1327ebd39cf18e))
* bugs in replay ([2bf8808](https://github.com/unblocked-web/agent/commit/2bf8808ae115ba9ea9f3cc64f3eba673fcb311aa))


### Features

* **core:** improve jspath waitForElement perf ([435576a](https://github.com/unblocked-web/agent/commit/435576a47a31dfedcfd3307c090e23b63998c716))
* **locale:** add locale emulation + tests ([57cc7ff](https://github.com/unblocked-web/agent/commit/57cc7ff8c342dc27a477b16cca066dffb9687e2f))
* **replay:** add support for iframe and shadows ([0978fd5](https://github.com/unblocked-web/agent/commit/0978fd55802ebf4285a48ef1ce0d208e2d21aeba))
* **replay:** record heirarchy of elements ([89310c0](https://github.com/unblocked-web/agent/commit/89310c0ba186d02e01b246dfa9c56f89d7a651af))
* **replay:** set screen viewport ([f818ff5](https://github.com/unblocked-web/agent/commit/f818ff5577d49d284a4116d328e78dc1d235824a))
* **session:** support CSSOM for recorder/playback ([0cbe7c8](https://github.com/unblocked-web/agent/commit/0cbe7c81aa6e6111a82db4bcbff5bf2efbc6d5b9))
* **session:** track frame dom node ids ([a41d678](https://github.com/unblocked-web/agent/commit/a41d6786d6fd10a386d9c2739713a26b6063b127))
* **session-state:** record and playback shadows ([508fd39](https://github.com/unblocked-web/agent/commit/508fd3988eb5e25d2c11a713a99f3f6a5a78ed5b))





# [1.0.0-alpha.20](https://github.com/unblocked-web/agent/compare/v1.0.0-alpha.19...v1.0.0-alpha.20) (2020-10-23)


### Bug Fixes

* **mitm:** tweak stored msg for connect errors ([6c819d5](https://github.com/unblocked-web/agent/commit/6c819d5cd5315028a8f6b49337d2beed8aef20dd))
* order of session closing ([046243b](https://github.com/unblocked-web/agent/commit/046243b7b2f84f633674dbe23122eb1d58ca431c))
* **puppet:** stabilize chained nav ([7a99f69](https://github.com/unblocked-web/agent/commit/7a99f693da6f03c6c77d2b604e55b6f70dd25adc))
* mitmRequestAgent tests ([d93b4fa](https://github.com/unblocked-web/agent/commit/d93b4fa72bd0aceea70079777f1f6c3bdcfae630))


### Features

* **client:** add scrollTo shortcut ([a1613f1](https://github.com/unblocked-web/agent/commit/a1613f15907c6eaea30e597bdabc3238eb7c96c1))
* **mitm:** dns over tls lookups ([8797847](https://github.com/unblocked-web/agent/commit/8797847fd5388ee6e4165c02390d45587799edbf))
* **mitm:** store ca/keys in network.db ([fd69f97](https://github.com/unblocked-web/agent/commit/fd69f97cee898720d5e5a5b30e0697b728c6e8d4))
* **puppet:** use mouse wheel events ([1efea8a](https://github.com/unblocked-web/agent/commit/1efea8abcf094d8c6644ecdedd5f0069b2fd909c))
* **session-state:** record devtools logs ([784da7f](https://github.com/unblocked-web/agent/commit/784da7f7728671485bce55b877fa350981c88ea2))
* **session-state:** record mitm resource states ([08976df](https://github.com/unblocked-web/agent/commit/08976dfa95f3b2629aedaca3002cc07b97e5bd2e))





# [1.0.0-alpha.19](https://github.com/unblocked-web/agent/compare/v1.0.0-alpha.18...v1.0.0-alpha.19) (2020-10-13)


### Bug Fixes

* **replay:** install script broke ([b79c572](https://github.com/unblocked-web/agent/commit/b79c572883a8c7b0240c97c13ca1d0cf9ef8cc43))





# [1.0.0-alpha.18](https://github.com/unblocked-web/agent/compare/v1.0.0-alpha.17...v1.0.0-alpha.18) (2020-10-13)


### Bug Fixes

* **replay:** bug with monorepo replay versions ([05aa786](https://github.com/unblocked-web/agent/commit/05aa786527d0b65d7097cbba623633294c615627))





# [1.0.0-alpha.17](https://github.com/unblocked-web/agent/compare/v1.0.0-alpha.16...v1.0.0-alpha.17) (2020-10-13)


### Bug Fixes

* publish latest replay ([62d1ef0](https://github.com/unblocked-web/agent/commit/62d1ef046bccb2d90df206d5425999a80b7d4fd8))





# [1.0.0-alpha.16](https://github.com/unblocked-web/agent/compare/v1.0.0-alpha.15...v1.0.0-alpha.16) (2020-10-13)


### Bug Fixes

* extend tests for emulate test ([71764b7](https://github.com/unblocked-web/agent/commit/71764b7c52b46d47e3a0334c94a97429ad375703))
* **core:** dont close client on promise rejections ([37f1169](https://github.com/unblocked-web/agent/commit/37f11690131c4bf08e481c803cdb3fba68c7985f))
* **core:** wait for location change on new tab ([0c70d6e](https://github.com/unblocked-web/agent/commit/0c70d6e7553025222b9fe4139407be4d69ee20b9))
* **mitm:** catch exceptions on closed h2 session ([6b5c7d4](https://github.com/unblocked-web/agent/commit/6b5c7d455c06d21f59ad4674199d76d73a5373d2))
* **mitm:** don’t send duplicated headers to h2 ([ece1b1f](https://github.com/unblocked-web/agent/commit/ece1b1fe421d2b7aa2728f1031b30c5efa1e4948))
* **mitm:** duplicate if-none-match header ([1cbe1f1](https://github.com/unblocked-web/agent/commit/1cbe1f1cecacaac9c99af040ddbf39c72c959a4a))
* **replay:** fix command overlays ([926dcba](https://github.com/unblocked-web/agent/commit/926dcba7e10635c3917ffa9dca72c6fb6fe29016))


### Features

* **client:** xpath support, array index access ([c59ccbc](https://github.com/unblocked-web/agent/commit/c59ccbc47eda9c61c360f04beb00a6a8e032f31e))
* **core:** isElementVisible - can user see elem ([213c351](https://github.com/unblocked-web/agent/commit/213c351cbc9bf4c6e8852fe0694bfafcdd602cbe))





# [1.0.0-alpha.15](https://github.com/unblocked-web/agent/compare/v1.0.0-alpha.14...v1.0.0-alpha.15) (2020-10-06)


### Bug Fixes

* **mitm:** filter response headers ([828dc94](https://github.com/unblocked-web/agent/commit/828dc94bdb880713567fb2629eec79c2c6f0d6ed))





# [1.0.0-alpha.14](https://github.com/unblocked-web/agent/compare/v1.0.0-alpha.13...v1.0.0-alpha.14) (2020-10-06)


### Bug Fixes

* **client:** don’t shutdown on rejected promises ([86a331b](https://github.com/unblocked-web/agent/commit/86a331bede88daca8b17c079f23910ff776fb4c4))
* **mitm:** change headers after alpn is set ([a21d4ca](https://github.com/unblocked-web/agent/commit/a21d4cab3f3adcc9e413f976ac6864ae85cb053e))
* **mitm:** push headers + header arrays ([f411b93](https://github.com/unblocked-web/agent/commit/f411b936c98219d1b57740f3504322fd5de6037c))
* **replay:** fix http2 push headers ([755667f](https://github.com/unblocked-web/agent/commit/755667f4ec4b32c9e22b2541fa7ef08aa613d063))
* **replay:** resetting navigation needs to clear ([daf9431](https://github.com/unblocked-web/agent/commit/daf94318029f2d6ddf0ce88686f7748bc1d28f0c))
* **replay:** use shadow dom for replay elements ([b19b382](https://github.com/unblocked-web/agent/commit/b19b3820eb93fd7302e7fd416dde6e5aad988209))







**Note:** Version bump only for package @unblocked-web/agent-monorepo





# [1.0.0-alpha.12](https://github.com/unblocked-web/agent/compare/v1.0.0-alpha.11...v1.0.0-alpha.12) (2020-09-29)


### Bug Fixes

* **puppet:** chrome 80 test flakiness ([9f16cd1](https://github.com/unblocked-web/agent/commit/9f16cd1993e0bd038f748b2b986bd69a311b11f6))
* lint and puppet test chrome 80 ([0ce09ac](https://github.com/unblocked-web/agent/commit/0ce09ac71e3f9a9a802ba90f9c7aab9021f07e5c))
* refactor to pause debugger on attach ([63a9bd1](https://github.com/unblocked-web/agent/commit/63a9bd125e7f334a85a2dedc2490f4e66366ea6d))
* **mitm:** simplify errors, handle not caught ([27820ac](https://github.com/unblocked-web/agent/commit/27820ac784771b4c58e3f07bd96f15209f82f28c))
* **replay:** playback on page 2 ([005bed8](https://github.com/unblocked-web/agent/commit/005bed89efd198b434e947d21390678eceef5eee))


### Features

* **core:** back/forward api ([805af3d](https://github.com/unblocked-web/agent/commit/805af3d48822c1306b73f5c084d65b0855819213)), closes [#32](https://github.com/unblocked-web/agent/issues/32)
* **docs:** Update documentation ([2295725](https://github.com/unblocked-web/agent/commit/2295725dceed7026bee9a4a291d551c75fe5279f)), closes [#56](https://github.com/unblocked-web/agent/issues/56)
* **mitm:** switch mitm to use authorization ([fade6e8](https://github.com/unblocked-web/agent/commit/fade6e81d58d947c03a7b54e37a887bbc0bba5a2))
* **puppet:** add puppet interfaces abstraction ([69bae38](https://github.com/unblocked-web/agent/commit/69bae38a03afaae3455de2a4928abd13031af662))
* **puppet:** import playwright tests ([e2b9bf5](https://github.com/unblocked-web/agent/commit/e2b9bf546af1ed899a01f460977e362b676c02e1))
* **replay:** remove ui tabs; nav to session tabs ([df8e21c](https://github.com/unblocked-web/agent/commit/df8e21cefc71ff6ad8db7d1498a1352cc71618a9))
* **replay:** spawned child tabs ([8ae0d75](https://github.com/unblocked-web/agent/commit/8ae0d754a8e263a6cae20815338532da84906a7b))
* **replay:** split session state by tab ([9367f2d](https://github.com/unblocked-web/agent/commit/9367f2d8796fda709bc8185374a5e07d4b6f78ab))
* import and shrink puppeteer ([b1816b8](https://github.com/unblocked-web/agent/commit/b1816b8f7b1a60edd456626e3c818e4ebe3c022f))
* wait for tab ([0961e97](https://github.com/unblocked-web/agent/commit/0961e97ecc4418c21536be92e1f3787aa1692117))





# [1.0.0-alpha.11](https://github.com/unblocked-web/agent/compare/v1.0.0-alpha.10...v1.0.0-alpha.11) (2020-08-25)


### Bug Fixes

* copy engine to deployed emulators ([98ea24c](https://github.com/unblocked-web/agent/commit/98ea24ca25d0cebbc1b6f6d572134e63318ce941))





# [1.0.0-alpha.10](https://github.com/unblocked-web/agent/compare/v1.0.0-alpha.9...v1.0.0-alpha.10) (2020-08-25)


### Bug Fixes

* dependency/path issues ([17a6813](https://github.com/unblocked-web/agent/commit/17a681335a3cd28cf7a668f5efd58229fa1cc59e))





# [1.0.0-alpha.9](https://github.com/unblocked-web/agent/compare/v1.0.0-alpha.8...v1.0.0-alpha.9) (2020-08-25)


### Bug Fixes

* humanoid keys => ids ([a30652e](https://github.com/unblocked-web/agent/commit/a30652e5e664955e2f337799a986447e18f25f3a))
* **emulators:** wait for doc element ([c67fbf8](https://github.com/unblocked-web/agent/commit/c67fbf8cc089881a2bf4a5def83dcac67630e4f2))
* **mitm-socket:** chrome 83 tls signature ([a699212](https://github.com/unblocked-web/agent/commit/a6992121ba7a7ee8e4f42ca1f78c4f1335c281b7)), closes [#48](https://github.com/unblocked-web/agent/issues/48) [#23](https://github.com/unblocked-web/agent/issues/23)
* **replay:** fix realtime not loading correctly ([29ff447](https://github.com/unblocked-web/agent/commit/29ff4471073a15505d27d5453cb1c13daf824f83))
* **replay:** fix rendering doctype + svg ([ac36c79](https://github.com/unblocked-web/agent/commit/ac36c791c9d3611874900c65e8180b7daa1ed232))
* vue structure for replay ([0e38bfa](https://github.com/unblocked-web/agent/commit/0e38bfa5f16c63a7900136e2300214bda395a5cf))


### Features

* **ci:** windows tests ([fd5e9db](https://github.com/unblocked-web/agent/commit/fd5e9dbd2bdd1ac4fcba94f46e8cba4eb2ce7319))
* **core:** enhance logs ([a5b6d58](https://github.com/unblocked-web/agent/commit/a5b6d58a7fbf74415d7094b374f040ab1ca2890a))
* **emulators:** add windows runtime polyfills ([51ebb11](https://github.com/unblocked-web/agent/commit/51ebb1107ff42f19a453a268c243b19c2d0f2644))
* **emulators:** enable multi-engine support ([1e008c9](https://github.com/unblocked-web/agent/commit/1e008c9fe26c977ebf85c665d0891023342a58b5))
* **mitm:** support push streams ([1b2af06](https://github.com/unblocked-web/agent/commit/1b2af0655445929ac1f4fb8dcac011b9623a75d4))
* **replay:** stream data and simplify tick tracker ([91c350c](https://github.com/unblocked-web/agent/commit/91c350cdbf9f99c19754fbb5598afe62a13fb497))
* restructure frontend to match vue project ([f3348a0](https://github.com/unblocked-web/agent/commit/f3348a01650e2747a26fa0b2ab9bd4c082300f37))





# [1.0.0-alpha.8](https://github.com/unblocked-web/agent/compare/v1.0.0-alpha.6...v1.0.0-alpha.8) (2020-08-05)


### Bug Fixes

* **emulator-plugins:** include origin for cors ([b1449c1](https://github.com/unblocked-web/agent/commit/b1449c1233dc692ccfc68d3b81070e5ff7b9fcba))
* **replay:** handle frames and page source changes ([fc703d5](https://github.com/unblocked-web/agent/commit/fc703d5181eb961307b44553aa02a62f4faf98c0))
* circleci configs ([7d8e213](https://github.com/unblocked-web/agent/commit/7d8e213032baa58a14d9f9eb6f161b4b2996b5c0))
* pool socket connections per origin ([0075f18](https://github.com/unblocked-web/agent/commit/0075f18a64a2761f0979c072e42958002664b2df))
* **ci:** circle ci fixes ([24596b5](https://github.com/unblocked-web/agent/commit/24596b5b8903d4857e60aac964a1c7f5e43731c6))
* **core:** core should autoclose if not started ([8d46a77](https://github.com/unblocked-web/agent/commit/8d46a775573733aa53cef1723fb71d60485fae9f)), closes [#41](https://github.com/unblocked-web/agent/issues/41)
* **mitm:** windows sockets ([dc3cf7d](https://github.com/unblocked-web/agent/commit/dc3cf7df9dc6ad829ed21323cb8a7ab6a2cbf9b7))
* **replay:** fix launch path to replay ([8d7059b](https://github.com/unblocked-web/agent/commit/8d7059b476ea65b440b18f6e8fe59ecc6ba95bd3))
* **socket:** http2 requests not reusing sockets ([3cbf853](https://github.com/unblocked-web/agent/commit/3cbf8531589536c763525086cfea407c3435ca9b))
* use os tmp directory ([e1f5a2b](https://github.com/unblocked-web/agent/commit/e1f5a2b7e63470b626ed906170b5c0337f5e0c43))
* windows tests ([c2943e8](https://github.com/unblocked-web/agent/commit/c2943e844d53c11f829baed60c449604e81544c8))


### Features

* **mitm:** record blocked and cached http ([bd47738](https://github.com/unblocked-web/agent/commit/bd47738e010c962e529a048d4ee33211d67a6d8f))
* **replay:** fix picker ([50d7885](https://github.com/unblocked-web/agent/commit/50d7885f836067d51dc1ef50b41376cd9e3b9508))
* **replay:** replay individual ticks on interval ([e1c29f4](https://github.com/unblocked-web/agent/commit/e1c29f443169ca4d141dcd0943ae8b493b31d6c8))
* **replay:** split app/replay in electron backend ([3b66eec](https://github.com/unblocked-web/agent/commit/3b66eec372900e764872857b67f80817f4ba2b9e))
* **session-state:** capture requests before send ([9607793](https://github.com/unblocked-web/agent/commit/960779370fa439d1c173e855bb8bdf907de9abc6))
* circle-ci fixes ([aac9a30](https://github.com/unblocked-web/agent/commit/aac9a30a3d9b6352e2e845cc2cd4ac6eca6bdd7a))





# [1.0.0-alpha.7](https://github.com/unblocked-web/agent/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2020-07-27)


### Bug Fixes

* **ci:** circle ci fixes ([24596b5](https://github.com/unblocked-web/agent/commit/24596b5b8903d4857e60aac964a1c7f5e43731c6))
* windows tests ([c2943e8](https://github.com/unblocked-web/agent/commit/c2943e844d53c11f829baed60c449604e81544c8))
* **mitm:** windows sockets ([dc3cf7d](https://github.com/unblocked-web/agent/commit/dc3cf7df9dc6ad829ed21323cb8a7ab6a2cbf9b7))
* **replay:** fix launch path to replay ([8d7059b](https://github.com/unblocked-web/agent/commit/8d7059b476ea65b440b18f6e8fe59ecc6ba95bd3))
* use os tmp directory ([e1f5a2b](https://github.com/unblocked-web/agent/commit/e1f5a2b7e63470b626ed906170b5c0337f5e0c43))


### Features

* circle-ci fixes ([aac9a30](https://github.com/unblocked-web/agent/commit/aac9a30a3d9b6352e2e845cc2cd4ac6eca6bdd7a))





# [1.0.0-alpha.6](https://github.com/unblocked-web/agent/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2020-07-22)


### Bug Fixes

* lerna packages ([92798e8](https://github.com/unblocked-web/agent/commit/92798e8c9a017754ec86edf3dfe09de90828cb00))
* packaging issues with mitm and replay ([520a912](https://github.com/unblocked-web/agent/commit/520a912d50b935270b75f2d6ef1faf5fed796e85))





# [1.0.0-alpha.5](https://github.com/unblocked-web/agent/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2020-07-21)


### Bug Fixes

* **replay:** fix replay api usage ([c54fe64](https://github.com/unblocked-web/agent/commit/c54fe64b710519088cda4638c7ad2b16a5313e13))





# [1.0.0-alpha.4](https://github.com/unblocked-web/agent/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2020-07-20)


### Bug Fixes

* **replay:** cover last tick on playbar ([baf12e7](https://github.com/unblocked-web/agent/commit/baf12e795fade634e60c64a342ea339ac6e8aa5c))
* **replay:** record close date when errors occcur ([2ce94dd](https://github.com/unblocked-web/agent/commit/2ce94dd694bba172028e8b7b00f0b3e0df0e0163)), closes [#31](https://github.com/unblocked-web/agent/issues/31)
* change shared package names ([d6181a7](https://github.com/unblocked-web/agent/commit/d6181a75a0387797177eb9aa2f71553bb7d31432))
* publish README.md with next build ([4c8b942](https://github.com/unblocked-web/agent/commit/4c8b9428616c743a1282ad2f67a42ed74a3ebd60))


### Features

* **replay:** add mouse/focus/scroll events ([efec55c](https://github.com/unblocked-web/agent/commit/efec55cf093bd4207164abd304a64f73620c45a9))
* **replay:** add session logs, detect errors ([f1865c0](https://github.com/unblocked-web/agent/commit/f1865c0aef38f6722bbcdee0244288f0f6040c5a)), closes [#31](https://github.com/unblocked-web/agent/issues/31)
* **replay:** autoplay replay ([bd13ef5](https://github.com/unblocked-web/agent/commit/bd13ef56728d4582a3e4827e21f1688e6269fbb2))
* **replay:** show commands in playbar ([58b9f7a](https://github.com/unblocked-web/agent/commit/58b9f7ac153480382cbd2f4c2f00aec64e7e852b))
* **replay:** start api from process ([403716b](https://github.com/unblocked-web/agent/commit/403716b3ba853c67ef15868fd6fb9fe1f60dbc1f))
* flatten shared workspaces ([d53da16](https://github.com/unblocked-web/agent/commit/d53da165d649163dcb724225a2ea43ce88d7eacc))





# 1.0.0-alpha.3 (2020-07-07)


### Bug Fixes

* **mitm:** small tweak for mitm tests hanging ([c969870](https://github.com/unblocked-web/agent/commit/c969870dc2f86fc107f5cc9b342b36b831ac906a))
* **session-state:** Improve page recorder perf ([14f78b9](https://github.com/unblocked-web/agent/commit/14f78b9ede550ded32594dc0a773cc880bf02783)), closes [#8](https://github.com/unblocked-web/agent/issues/8)
* .gitignore was ignoring files that were needed for website ([4b9a2e4](https://github.com/unblocked-web/agent/commit/4b9a2e4d12c88a44a78c39c0872556990cb1bb74))
* mitm timing out large bodies ([d38e78f](https://github.com/unblocked-web/agent/commit/d38e78ff0536996eefa32eb6aace848a06350f53)), closes [#8](https://github.com/unblocked-web/agent/issues/8)


### Features

* **dist:** improve packaging for double agent ([df195b6](https://github.com/unblocked-web/agent/commit/df195b630b90aea343e4bd3005d41b34c4d5431a))
* **emulators:** Emulator plugins - set agent ([e53cedb](https://github.com/unblocked-web/agent/commit/e53cedbfca077239d36116f22d5be2d1ab9ec7a3)), closes [#8](https://github.com/unblocked-web/agent/issues/8)
* **emulators:** improve page logging ([cb73806](https://github.com/unblocked-web/agent/commit/cb73806408ef7c235e4ff70539c8cc49e5cd5d90))





# 1.0.0-alpha.2 (2020-06-27)


### Bug Fixes

* Emulator plugin referencing relative paths ([f26feab](https://github.com/unblocked-web/agent/commit/f26feab5899fa11e73ad55d6239912b798aa0e79))
* missing dependencies ([67504f0](https://github.com/unblocked-web/agent/commit/67504f0f070f35ded261ec3c9734d60422b75a96))





# 1.0.0-alpha.1 (2020-06-27)


### Bug Fixes

* Emulator plugin referencing relative paths ([f26feab](https://github.com/unblocked-web/agent/commit/f26feab5899fa11e73ad55d6239912b798aa0e79))





# 1.0.0-alpha.0 (2020-06-27)

**Note:** Version bump only for package agent

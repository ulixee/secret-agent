import { BrowserEmulatorBase } from "@secret-agent/browser-emulator-utils";

export default function configureSessionTcp(emulator: BrowserEmulatorBase, settings) {
  settings.tlsClientHelloId = emulator.userAgentOption.browserId.match(/^([a-z]+-[0-9]+)/)[1];
}

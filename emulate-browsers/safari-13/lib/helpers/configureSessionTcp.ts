import { BrowserEmulatorBase, getTcpSettingsForOs } from "@secret-agent/browser-emulator-utils";

export default function configureSessionTcp(emulator: BrowserEmulatorBase, settings) {
  const tcpSettings = getTcpSettingsForOs(emulator.userAgentOption.operatingSystemId);
  if (tcpSettings) {
    settings.tcpTtl = tcpSettings.ttl;
    settings.tcpWindowSize = tcpSettings.windowSize;
  }
}

import { DnsOverTlsProviders, IBrowserEmulator } from "@secret-agent/browser-emulator-utils";

export default function configureSessionDns(emulator: IBrowserEmulator, settings) {
  settings.dnsOverTlsConnection = DnsOverTlsProviders.Cloudflare;
}

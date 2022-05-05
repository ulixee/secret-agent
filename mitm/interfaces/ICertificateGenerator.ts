import { ICertificateStore } from '@secret-agent/mitm-socket/lib/CertificateGenerator';
export default interface ICertificateGenerator {
  getCertificate(host: string): Promise<{ cert: Buffer; key: Buffer }>;
  close(): void;
}
export { ICertificateStore };

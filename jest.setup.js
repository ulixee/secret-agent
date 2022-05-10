const fs = require('fs');

// eslint-disable-next-line import/no-extraneous-dependencies
const CertificateManager = require('@unblocked-web/sa-mitm-socket/lib/CertificateGenerator').default;

module.exports = async () => {
  try {
    fs.rmdirSync(`${__dirname}/.data-test`, { recursive: true });
    fs.mkdirSync(`${__dirname}/.data-test`);
    // generate certs
    const certManager = new CertificateManager({
      storageDir: `${__dirname}/.data-test`,
    });
    await certManager.waitForConnected;
    certManager.close();
  } catch (err) {
    // ignore
  }
};

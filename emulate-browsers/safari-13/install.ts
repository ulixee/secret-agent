import install from '@secret-agent/browser-emulator-installer';
import * as dataBasic from './data/basic.json';

install({
  name: dataBasic.browserEngine.name,
  fullVersion: dataBasic.browserEngine.fullVersion,
  executablePathEnvVar: dataBasic.browserEngine.executablePathEnvVar,
});

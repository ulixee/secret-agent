import * as ChildProcess from 'child_process';
import * as Fs from 'fs';
import * as Http from 'http';
import * as Lockfile from 'proper-lockfile';
import {
  getBinaryPath,
  getInstallDirectory,
  getLocalBuildPath,
  isBinaryInstalled,
  isLocalBuildPresent,
} from './install/Utils';

const replayDir = getInstallDirectory();
const registrationApiFilepath = `${replayDir}/api.txt`;
const launchLockPath = `${replayDir}/launch`;

let registrationHost = '';
function resolveHost() {
  try {
    registrationHost = Fs.readFileSync(registrationApiFilepath, 'utf8');
  } catch (err) {
    // no-op
    registrationHost = '';
  }
  return registrationHost;
}

try {
  if (!Fs.existsSync(replayDir)) {
    Fs.mkdirSync(replayDir, { recursive: true });
  }
  if (!Fs.existsSync(registrationApiFilepath)) {
    Fs.writeFileSync(registrationApiFilepath, '');
  } else {
    resolveHost();
  }
} catch (err) {
  // couldn't listen for file
}

let apiStartPath: string;
try {
  apiStartPath = require.resolve('@ulixee/hero-core/start');
} catch (err) {
  // not installed locally (not main)
}

let hasLocalReplay = false;
try {
  require.resolve('./app');
  hasLocalReplay = Boolean(JSON.parse(process.env.HERO_USE_REPLAY_BINARY ?? 'false')) === false;
} catch (err) {
  // not installed locally
}

const showDebugLogs = Boolean(JSON.parse(process.env.HERO_REPLAY_DEBUG ?? 'false'));

export async function replay(launchArgs: IReplayScriptRegistration): Promise<any> {
  const {
    replayApiUrl,
    sessionsDataLocation,
    sessionName,
    scriptInstanceId,
    sessionId,
    scriptStartDate,
  } = launchArgs;

  const scriptMeta = {
    replayApiUrl,
    dataLocation: sessionsDataLocation,
    sessionName,
    sessionId,
    scriptStartDate,
    scriptInstanceId,
    apiStartPath,
    nodePath: process.execPath,
  };

  if (await registerScript(scriptMeta)) {
    return;
  }

  // cross-process lock around the launch process so we don't open multiple instances
  let release: () => Promise<void>;
  try {
    release = await Lockfile.lock(launchLockPath, {
      retries: 5,
      stale: 30e3,
      fs: Fs,
      realpath: false,
    });
    // make sure last "lock holder" didn't write the
    if (await registerScript(scriptMeta)) {
      return;
    }

    await openReplayApp('--sa-replay');

    if (!(await registerScript(scriptMeta))) {
      console.log("Couldn't register this script with the Replay app.", scriptMeta);
    }
  } catch (err) {
    if (showDebugLogs) {
      console.log('Error launching Replay', scriptMeta, err);
    }
  } finally {
    if (release) await release();
  }
}

export async function openReplayApp(...extraArgs: string[]) {
  Fs.writeFileSync(registrationApiFilepath, '');

  let child: ChildProcess.ChildProcess;
  if (isLocalBuildPresent()) {
    child = await launchReplay(getLocalBuildPath(), ['--local-build-launch', ...extraArgs]);
  } else if (hasLocalReplay) {
    const replayPath = require.resolve('@ulixee/replay');
    child = await launchReplay(
      'yarn electron',
      [replayPath, '--electron-launch', ...extraArgs],
      true,
    );
  } else if (isBinaryInstalled()) {
    child = await launchReplay(getBinaryPath(), ['--binary-launch', ...extraArgs]);
  }

  let registrationResolve: () => any;
  let registrationReject: (reason?: any) => any;
  const registrationComplete = new Promise<void>((resolve, reject) => {
    registrationResolve = resolve;
    registrationReject = reject;
  });
  const onPrematureExit = (code, signal) =>
    registrationReject(new Error(`Replay shutdown with exit code ${code}: ${signal}`));
  child.once('exit', onPrematureExit);
  child.once('error', registrationReject);
  // wait for change
  const watcher = Fs.watch(registrationApiFilepath, { persistent: false, recursive: false }, () => {
    if (resolveHost()) {
      registrationResolve();
    }
  });
  return registrationComplete.finally(() => {
    watcher.close();
    child.off('exit', onPrematureExit);
    child.off('error', registrationReject);
  });
}

function launchReplay(
  appPath: string,
  args: string[],
  needsShell = false,
): ChildProcess.ChildProcess {
  const child = ChildProcess.spawn(appPath, args, {
    detached: true,
    stdio: ['ignore', showDebugLogs ? 'inherit' : 'ignore', showDebugLogs ? 'inherit' : 'ignore'],
    shell: needsShell,
    windowsHide: false,
  });
  child.unref();
  return child;
}

async function registerScript(data: any): Promise<boolean> {
  if (!resolveHost()) return false;

  try {
    const url = new URL(registrationHost);
    const request = Http.request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const response = new Promise<Http.IncomingMessage>((resolve, reject) => {
      request.on('error', reject);
      request.on('response', resolve);
    });
    request.end(JSON.stringify(data));
    if ((await response)?.statusCode === 200) {
      // registered successfully
      return true;
    }
  } catch (err) {
    // doesn't exist
  }
  Fs.writeFileSync(registrationApiFilepath, '');
  registrationHost = '';
  return false;
}

interface IReplayScriptRegistration {
  replayApiUrl: string;
  sessionsDataLocation: string;
  sessionName: string;
  sessionId: string;
  scriptStartDate: string;
  scriptInstanceId: string;
}

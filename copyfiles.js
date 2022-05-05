// eslint-disable-next-line import/no-extraneous-dependencies,import/no-self-import
const copyfiles = require('copyfiles');
const pkg = require('./package.json');

const copyToDir = process.env.OUT_DIR;
const isBuild = copyToDir === 'build';
const workspaces = pkg.workspaces.packages
  .map(x => x.replace('/*', ''))
  .filter(x => !x.startsWith('../') && !x.includes('/build'));

const copyArgs = [
  '-e "node_modules"',
  'examples/*.js',
  'examples/*.mjs',
  'mitm-socket/go/*.*',
  'package*.json',
  '.*ignore',
];
if (isBuild) {
  copyArgs.push('testing/*/**', 'core/test/server/*', 'core/test/assets/**/*', 'yarn.lock');
}

for (const workspace of workspaces) {
  copyArgs.push(
    `${workspace}/*.cjs`,
    `${workspace}/package*.json`,
    `${workspace}/*.mjs`,
    `${workspace}/**/.*ignore`,
    `${workspace}/**/*.sh`,
  );
}

if (isBuild) copyArgs.push('-a');

copyfiles([...copyArgs, copyToDir], {}, () => {
  // eslint-disable-next-line no-console
  console.log('Files Copied');
});

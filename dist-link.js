const fs = require('fs');
const path = require('path');

const depPaths = {};

const baseDir = `${__dirname}/build-dist`;

const useRelativePaths = process.env.RELATIVE_PATHS;

function processPackageJson(packagePath, linkPass) {
  const packageJson = JSON.parse(fs.readFileSync(`${packagePath}/package.json`, 'utf8'));

  if (packageJson.private) {
    console.log('Private package, skipping', packagePath);
    return;
  }

  if (linkPass) {
    if (useRelativePaths) {
      depPaths[packageJson.name] =
        path.relative(packagePath, baseDir) + packagePath.replace(baseDir, '');
    } else {
      depPaths[packageJson.name] = packagePath;
    }
    return;
  }

  const deps = packageJson.dependencies || {};
  for (const dep of Object.keys(deps)) {
    if (dep.startsWith('@secret-agent')) {
      deps[dep] = depPaths[dep];
    }
  }
  packageJson.dependencies = deps;
  fs.writeFileSync(`${packagePath}/package.json`, JSON.stringify(packageJson, null, 2));
}

function processDir(path, linkPass) {
  for (const dirname of fs.readdirSync(path)) {
    if (dirname === 'node_modules' || dirname.startsWith('.')) continue;
    const fullpath = `${path}/${dirname}`;
    if (fs.existsSync(`${fullpath}/package.json`)) {
      processPackageJson(fullpath, linkPass);
    }
    if (fs.lstatSync(fullpath).isDirectory()) {
      processDir(fullpath, linkPass);
    }
  }
}

processDir(baseDir, true);
console.log(depPaths);
processDir(baseDir, false);

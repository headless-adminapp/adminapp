import fs from 'fs';
import path from 'path';

const packageDir = process.cwd();

const packageName = path.basename(packageDir);

console.log(`Generating package.json for ${packageName}`);

const packageJsonContent = fs.readFileSync(
  path.join(packageDir, 'package.json'),
  'utf8'
);

interface PackageJson {
  dependencies: Record<string, string>;
  scripts: Record<string, string>;
}

const packageJson = JSON.parse(packageJsonContent) as PackageJson;

Object.keys(packageJson.dependencies).forEach((dependency) => {
  if (dependency.startsWith('@headless-adminapp/')) {
    // remove the dependency
    delete packageJson.dependencies[dependency];
  }
});

packageJson.scripts = {};

const newPackageJsonContent = JSON.stringify(packageJson, null, 2);

fs.writeFileSync(
  path.join(packageDir, 'dist', 'package.json'),
  newPackageJsonContent,
  'utf8'
);

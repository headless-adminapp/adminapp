import { exec } from 'node:child_process';

import fs from 'fs';
import path from 'path';

const bundleTestingDirectories = ['next/13', 'next/14'];

async function executeCommand(
  command: string,
  options: { cwd: string; verbose?: boolean }
) {
  return new Promise<void>((resolve, reject) => {
    exec(
      command,
      {
        cwd: options.cwd,
      },
      (error, stdout, stderr) => {
        if (error) {
          if (stderr) {
            console.error(stderr);
          }
          if (stdout) {
            console.error(stdout);
          }
          reject(error);
        } else {
          resolve();
        }
      }
    );
  });
}

async function copyFolder(source: string, destination: string) {
  await fs.promises.mkdir(destination, { recursive: true });

  const entries = await fs.promises.readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      await copyFolder(srcPath, destPath);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

async function copyPackage({
  directory,
  name,
}: {
  directory: string;
  name: string;
}): Promise<Record<string, string>> {
  const node_modules = path.join(
    directory,
    'node_modules',
    '@headless-adminapp',
    name
  );

  if (fs.existsSync(node_modules)) {
    await fs.promises.rm(node_modules, { recursive: true });
  }

  const packageJsonPath = path.join(
    __dirname,
    '../packages',
    name,
    'dist',
    'package.json'
  );

  const packageJson = JSON.parse(
    fs.readFileSync(packageJsonPath, { encoding: 'utf-8' })
  );

  const deps = packageJson.dependencies || {};

  await copyFolder(
    path.join(__dirname, '../packages', name, 'dist'),
    path.join(directory, 'node_modules', '@headless-adminapp', name)
  );

  return deps;
}

async function copyPackages({
  directory,
  packages,
}: {
  directory: string;
  packages: string[];
}) {
  for (const name of packages) {
    await copyPackage({ directory, name });

    // await installPackageDeps(deps, directory);
  }
}

function getPackageDeps(name: string): Record<string, string> {
  const packageJsonPath = path.join(
    __dirname,
    '../packages',
    name,
    'dist',
    'package.json'
  );

  const packageJson = JSON.parse(
    fs.readFileSync(packageJsonPath, { encoding: 'utf-8' })
  );

  const deps = packageJson.dependencies || {};

  return deps;
}

function getPackagesDeps(packages: string[]): Record<string, string> {
  return packages.reduce((acc, name) => {
    const deps = getPackageDeps(name);

    return { ...acc, ...deps };
  }, {});
}

// eslint-disable-next-line unused-imports/no-unused-vars
async function installPackageDeps(
  deps: Record<string, string>,
  directory: string
) {
  for (const [name, version] of Object.entries(deps)) {
    await executeCommand(
      `pnpm install ${name}@${version} --ignore-workspace --optional`,
      {
        cwd: directory,
      }
    );
  }
}

async function syncOptionalDeps(
  deps: Record<string, string>,
  directory: string
) {
  const packageJsonPath = path.join(directory, 'package.json');

  const packageJson = JSON.parse(
    fs.readFileSync(packageJsonPath, { encoding: 'utf-8' })
  );

  const optionalDeps = packageJson.optionalDependencies || {};

  const newOptionalDeps = { ...optionalDeps, ...deps };

  // sort keys
  const sortedNewOptionalDeps = Object.keys(newOptionalDeps)
    .sort()
    .reduce((acc, key) => {
      acc[key] = newOptionalDeps[key];
      return acc;
    }, {} as Record<string, string>);

  if (JSON.stringify(optionalDeps) !== JSON.stringify(sortedNewOptionalDeps)) {
    packageJson.optionalDependencies = sortedNewOptionalDeps;

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }
}

async function run() {
  const ora = (await import('ora')).default;
  for (const testingDirectory of bundleTestingDirectories) {
    const spinner = ora({
      prefixText: `${testingDirectory}:`,
      text: 'Installing...',
    });

    spinner.start();
    try {
      const directory = path.join(
        __dirname,
        '../testing/bundle',
        testingDirectory
      );

      const packages = [
        'icons',
        'core',
        'app',
        'icons-fluent',
        'fluent',
        'server-sdk',
        'server-sdk-mongo',
        'server-sdk-sequelize',
      ];

      const optionalDeps = getPackagesDeps(packages);

      await syncOptionalDeps(optionalDeps, directory);

      await executeCommand('pnpm install --ignore-workspace', {
        cwd: directory,
      });

      await copyPackages({
        directory,
        packages,
      });

      spinner.text = 'Building...';

      await executeCommand('pnpm run build', {
        cwd: directory,
        verbose: false,
      });

      spinner.succeed('Done!');
    } catch (error) {
      spinner.fail('Failed!');
      console.error(error);
    }
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

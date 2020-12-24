import path from 'path';
import shell from 'shelljs';
import { spawnSync } from 'child_process';

const resourcesPath = process.env.NODE_ENV === 'development'
  ? path.resolve('./src/helpers')
  : path.join(process.resourcesPath, './app/src/helpers');

const isConnected = (): boolean => {
  console.log({resourcesPath});
  const { stdout } = spawnSync('sh', [`${resourcesPath}/connected.sh`], {
    encoding: 'utf-8'
  });

  return stdout === 'true';
};

export default isConnected;

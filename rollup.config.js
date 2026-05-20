import typescript from '@rollup/plugin-typescript';
import serve from 'rollup-plugin-serve';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { version } from './package.json';
import { logCardInfo } from './rollup.config.helper.mjs';

const dev = process.env.ROLLUP_WATCH;
const port = process.env.PORT || 8235;
const currentVersion = dev ? 'DEVELOPMENT' : `v${version}`;
const custombanner = logCardInfo(currentVersion);

const serveopts = {
  contentBase: ['./dist'],
  port,
  allowCrossOrigin: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
};

const plugins = [
  nodeResolve({
    preferBuiltins: false,
  }),
  commonjs(),
  json(),
  dev && serve(serveopts),
];

export default [
  {
    input: 'src/more-info-custom.ts',
    output: [
      {
        file: 'dist/more-info-custom.js',
        format: 'es',
        sourcemap: dev ? true : false,
        inlineDynamicImports: true,
        banner: custombanner,
        sourcemapIgnoreList: (relativeSourcePath, sourcemapPath) => {
          // will ignore-list all files with node_modules in their paths
          return relativeSourcePath.includes('node_modules');
        },
      },
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
      }),
      ...plugins,
    ],
    moduleContext: (id) => {
      const thisAsWindowForModules = [
        'node_modules/@formatjs/intl-utils/lib/src/diff.js',
        'node_modules/@formatjs/intl-utils/lib/src/resolve-locale.js',
      ];
      if (thisAsWindowForModules.some((id_) => id.trimRight().endsWith(id_))) {
        return 'window';
      }
    },
    watch: {
      exclude: 'node_modules/**',
    },
  },
];

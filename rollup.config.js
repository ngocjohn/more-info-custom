import typescript from '@rollup/plugin-typescript';
import serve from 'rollup-plugin-serve';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { version } from './package.json';
import { logCardInfo } from './rollup.config.helper.mjs';

const dev = process.env.ROLLUP_WATCH;
const port = process.env.PORT || 8235;
const currentVersion = dev ? 'DEVELOPMENT' : `v${version}`;
const custombanner = logCardInfo(currentVersion);
const outputFile = dev ? 'dist/more-info-custom.js' : 'build/more-info-custom.js';

const serveopts = {
  contentBase: ['./dist'],
  port,
  allowCrossOrigin: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
};

const terserOpt = {
  module: true,
  compress: {
    drop_console: ['log', 'error'],
    module: false,
  },
};

const plugins = [
  nodeResolve({
    preferBuiltins: false,
  }),
  commonjs(),
  json(),
  dev && serve(serveopts),
  !dev && terser(terserOpt),
];

export default [
  {
    input: 'src/more-info-custom.ts',
    output: [
      {
        file: outputFile,
        format: 'es',
        sourcemap: dev ? true : false,
        inlineDynamicImports: true,
        banner: custombanner,
      },
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        outDir: dev ? './dist/' : './build/',
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
  },
];

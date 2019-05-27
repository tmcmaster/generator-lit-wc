import createDefaultConfig from '@open-wc/building-rollup/modern-config';

export default createDefaultConfig(
  {
      input: 'src/index.js',
      outputDir: 'dist/release'
    }
  );

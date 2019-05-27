import createDefaultConfig from '@open-wc/building-rollup/modern-config';

// noinspection JSUnusedGlobalSymbols
export default createDefaultConfig(
    {
        input: 'src/index.js',
        outputDir: 'dist/release'
    }
);

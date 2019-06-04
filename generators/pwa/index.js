// noinspection JSUnresolvedFunction
const Generator = require('yeoman-generator');

// noinspection JSUnresolvedVariable
module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }

    // noinspection JSUnusedGlobalSymbols
    async prompting() {
        this.answers = await this.prompt([
            {
                type: 'input',
                name: 'applicationName',
                message: 'Application Name',
                default: 'tm-app'
            },
            {
                type: 'input',
                name: 'description',
                message: 'Description',
                default: 'Progressive Web Application'
            }
        ]);
    }

    // noinspection JSUnusedGlobalSymbols
    writing() {
        console.log('## Application Name: ', this.answers.applicationName);
        console.log('## Description: ', this.answers.description);

        this._writeProjectFiles(this.answers);
    }

    _writeProjectFiles(answers) {
        const COPY_AS_IS = [
            'build-utils',
            'src/@types',
            'src/img',
            'src/actions',
            'src/models',
            'src/redux',
            'src/views',
            'src/index.html',
            'src/index.ts',
            'src/manifest.webmanifest',
            'src/styles.css',
            'src/sw.js',
            'package.json',
            'README.md',
            'webpack.config.js'
        ];

        const COPY_WITH_VARIABLES = [
            '.gitignore',
            'LICENSE',
            'tsconfig.json'
        ];

        COPY_AS_IS.forEach(file => {
            // noinspection JSUnresolvedFunction
            this.fs.copyTpl(
                this.templatePath(file),
                this.destinationPath(file), {
                    applicationName: answers.applicationName,
                    description: answers.description
                }
            );
        });

        COPY_WITH_VARIABLES.forEach(file => {
            // noinspection JSValidateTypes
            this.fs.copy(
                this.templatePath(file),
                this.destinationPath(file),
            );
        });
    }
};
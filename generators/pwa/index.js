// noinspection JSUnresolvedFunction
const Generator = require('yeoman-generator');

const DEFAULTS = {
    author: {
        name: 'Tim McMaster',
        email: 'tim@mcmaster.id.au'
    },
    project: {
        name: 'pwa-example',
        description: 'Progressive Web Application Example'
    },
    app: {
        title: 'PWA Example',
        iconText: 'PWA',
        description: 'Progressive Web Application Example'
    }
};

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
                name: 'authorName',
                message: 'Author Name',
                default: DEFAULTS.author.name
            },{
                type: 'input',
                name: 'authorEmail',
                message: 'Author Email',
                default: DEFAULTS.author.email
            },{
                type: 'input',
                name: 'projectName',
                message: 'Project Name',
                default: DEFAULTS.project.name
            },{
                type: 'input',
                name: 'projectDescription',
                message: 'Project Description',
                default: DEFAULTS.project.description
            },{
                type: 'input',
                name: 'appTitle',
                message: 'Application Title',
                default: DEFAULTS.app.title
            },
            {
                type: 'input',
                name: 'appIconText',
                message: 'Application Icon Text',
                default: DEFAULTS.app.iconText
            },
            {
                type: 'input',
                name: 'appDescription',
                message: 'Application Description',
                default: DEFAULTS.app.description
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
            '.gitignore',
            'build-utils',
            'src/@types',
            'src/img',
            'src/actions',
            'src/models',
            'src/redux',
            'src/views',
            'src/index.ts',
            'src/styles.css',
            'src/sw.js',
            'tsconfig.json',
            'webpack.config.js'
        ];

        const COPY_WITH_VARIABLES = [
            'LICENSE',
            'package.json',
            'README.md',
            'src/index.html',
            'src/manifest.webmanifest'
        ];

        COPY_WITH_VARIABLES.forEach(file => {
            // noinspection JSUnresolvedFunction
            this.fs.copyTpl(
                this.templatePath(file),
                this.destinationPath(file),
                this.answers
            );
        });

        COPY_AS_IS.forEach(file => {
            // noinspection JSValidateTypes
            this.fs.copy(
                this.templatePath(file),
                this.destinationPath(file),
            );
        });
    }
};
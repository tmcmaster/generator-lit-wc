// noinspection JSUnresolvedFunction
const Generator = require('yeoman-generator');
// noinspection JSUnresolvedFunction
const process = require('process');
// noinspection JSUnresolvedFunction
const common = require('../../lib/common.js');

// noinspection JSUnresolvedVariable
module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.option('ignore-folder', {
            type: Boolean,
            default: false,
            description: '--ignore-folder : Do not use the folder name as an element name.',
        });

        const folderName = process.cwd().split('/').pop();
        this.elementNames = common.createElementNamesInitial(args, opts, folderName);
        console.log('== Element Names: ', this.elementNames);
    }

    // noinspection JSUnusedGlobalSymbols
    async prompting() {
        const elementNames = this.elementNames.join(' ');

        this.answers = await this.prompt([
            {
                type: 'input',
                name: 'elementNames',
                message: 'Element Names',
                default: elementNames
            },
            {
                type: 'input',
                name: 'description',
                message: 'Element Description',
                default: 'Web component that extends LitElement.'
            }
        ]);
    }

    // noinspection JSUnusedGlobalSymbols
    writing() {
        this._processAnswers();
        this._writeProjectFiles();
        this._writeRolupFiles();
        this._writeDemoFiles();
        this._writeSrcFiles();
    }

    _processAnswers() {
        this.description = this.answers.description;
        this.elementNames = common.createElementNamesAnswers(this.answers.elementNames);
        this.elementName = this.elementNames[0];
        console.log('## Element Name: ', this.elementName);
        console.log('## Element Names: ', this.elementNames);
        console.log('## Description: ', this.description);
    }

    _writeProjectFiles() {
        const self = this;

        // noinspection JSUnresolvedFunction
        self.fs.copyTpl(
            self.templatePath('package.json'),
            self.destinationPath('package.json'), {
                elementName: self.elementName,
                description: self.description
            }
        );
        // noinspection JSUnresolvedFunction
        self.fs.copyTpl(
            self.templatePath('LICENSE'),
            self.destinationPath('LICENSE'), {
                elementName: self.elementName
            }
        );
        // noinspection JSUnresolvedFunction
        self.fs.copyTpl(
            self.templatePath('README.md'),
            self.destinationPath('README.md'), {
                elementName: self.elementName,
                description: self.description
            }
        );
    }

    _writeRolupFiles() {
        const self = this;

        // noinspection JSValidateTypes
        self.fs.copy(
            self.templatePath('rollup-release.config.js'),
            self.destinationPath('rollup-release.config.js'),
        );
        // noinspection JSValidateTypes
        self.fs.copy(
            self.templatePath('rollup-site.config.js'),
            self.destinationPath('rollup-site.config.js')
        );
    }

    _writeDemoFiles() {
        const self = this;

        const elementBlock = common.generateElementBlockDemo(self.elementNames);

        // noinspection JSValidateTypes
        self.fs.copy(
            self.templatePath('demo/index.html'),
            self.destinationPath('demo/index.html')
        );
        // noinspection JSUnresolvedFunction
        self.fs.copyTpl(
            self.templatePath('demo/index.js'),
            self.destinationPath('demo/index.js'), {
                elementName: self.elementName,
                elementBlock: elementBlock
            }
        );
    }

    _writeSrcFiles() {
        const self = this;
        const importBlock = common.generateImportBlockSrc(self.elementNames);

        // noinspection JSUnresolvedFunction
        this.fs.copyTpl(
            self.templatePath('src/index.js.template'),
            self.destinationPath('src/index.js'), {
                importBlock: importBlock
            }
        );

        this.elementNames.forEach((elementName) => {
            // noinspection JSUnresolvedFunction
            self.fs.copyTpl(
                self.templatePath('src/tm-element.js.template'),
                self.destinationPath('src/' + elementName + '.js'), {
                    elementName: elementName,
                    className: common.dashToCamel(elementName, true)
                }
            );
        });

        console.log('###############');
    }
};



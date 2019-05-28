const Generator = require('yeoman-generator');
const process = require('process');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.option('ignore-folder', {
            type: Boolean,
            default: false,
            description: '--ignore-folder : Do not use the folder name as an element name.',
        });

        const folderName = process.cwd().split('/').pop();

        this._initialiseAtStartup(args, opts, folderName);
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
                default: 'Web component that extends LitElement.', // Default to solution folder name
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

    _initialiseAtStartup(args, opts, folderName) {
        this.ignoreFolder = opts['ignore-folder'];

        this.elementNames = (args && args.length > 0 ? args : []);
        this.elementName = (this.ignoreFolder ? (this.elementNames.length > 0 ? this.elementNames[0] : 'tm-element') : folderName);

        if (!this.ignoreFolder) {
            this.elementNames.unshift(folderName);
        }

        this.elementNames = checkElementNames(this.elementNames);
        this.elementName = checkElementName(this.elementName);
    }

    _processAnswers() {
        this.description = this.answers.description;

        if (this.elementNames.length === 0) {
            this.elementNames.push('element');
        }

        this.elementNames = this.answers.elementNames.replace(/,/g, ' ').replace(/\s+/g, ' ').split(' ');
        this.elementNames = checkElementNames(this.elementNames);
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

        const elementBlock = generateElementBlockDemo(this.elementNames);

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
        const importBlock = generateImportBlockSrc(this.elementNames);

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
                    className: dashToCamel(elementName, true)
                }
            );
        });

        console.log('###############');
    }


};


function generateImportBlockSrc(elementNames) {
    return elementNames.map((elementName) => {
        return `import './${elementName}';`
    }).join('\n');
}

function generateElementBlockDemo(elementNames) {
    return elementNames.map((elementName) => {
        return `  <${elementName}></${elementName}>`
    }).join('\n');
}

function checkElementNames(elementNames) {
    return (elementNames === undefined ? undefined
        : elementNames.map((e) => checkElementName(e)));
}

function checkElementName(elementName) {
    return (elementName === undefined ? undefined
        : (elementName.includes('-') ? elementName : 'tm-' + elementName));
}

function dashToCamel(value, capitaliseFirst) {
    let result = value.toLowerCase().replace(/\b-([a-z])/g, (_, word) => word[0].toUpperCase());
    return (capitaliseFirst ? result[0].toUpperCase() + result.slice(1, result.length) : result);
}
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.option('set', {
            type: Boolean,
            default: false,
            description: 'set : configure to support a set of web components.',
        });

        this.elementNames = (this.args && this.args.length > 0 ? this.args : []);
        this.elementName = (this.elementNames.length > 0 ? this.elementNames[0] : undefined);
        this.setMode = opts.set || this.elementNames.length > 1;

        console.log('Set Mode:', this.setMode);
        console.log('Element Names:', this.elementNames);
    }

    // noinspection JSUnusedGlobalSymbols
    async prompting() {
        const self = this;

        const prompts = [];
        if (this.elementName === undefined) {
            prompts.push({
                type: 'input',
                name: 'elementName',
                message: 'Element Name',
                default: this.appname.replace(/\s+/g, '-'), // Default to solution folder name
            });
        }

        self.answers = await self.prompt([
            ...prompts,
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
        const self = this;
        this.elementName = (this.elementNames.length > 0 ? this.elementNames[0] : this.answers.elementName);
        this.elementNames = this.elementNames;
        this.description = self.answers.description;

        console.log('Element Name: ', this.elementName);
        console.log('Element Namea: ', this.elementNames);
        console.log('Description: ', this.description);


        // noinspection JSUnresolvedFunction
        self.fs.copyTpl(
            self.templatePath('package.json'),
            self.destinationPath('package.json'), {
                elementName: this.elementName,
                description: this.description
            }
        );
        // noinspection JSUnresolvedFunction
        self.fs.copyTpl(
            self.templatePath('LICENSE'),
            self.destinationPath('LICENSE'), {
                elementName: this.elementName
            }
        );
        // noinspection JSUnresolvedFunction
        self.fs.copyTpl(
            self.templatePath('README.md'),
            self.destinationPath('README.md'), {
                elementName: this.elementName,
                description: this.description
            }
        );


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



        this.writeDemoFiles();
        this.writeSrcFiles();

    }

    writeDemoFiles() {
        const self = this;

        const elementBlock = this.generateElementBlockDemo();

        // noinspection JSValidateTypes
        self.fs.copy(
            self.templatePath('demo/index.html'),
            self.destinationPath('demo/index.html')
        );
        // noinspection JSUnresolvedFunction
        self.fs.copyTpl(
            self.templatePath('demo/index.js'),
            self.destinationPath('demo/index.js'), {
                elementName: this.elementName,
                elementBlock: elementBlock
            }
        );
    }

    writeSrcFiles() {
        const self = this;
        const importBlock = this.generateImportBlockSrc();

        console.log('Import Block: ', importBlock);

        // noinspection JSUnresolvedFunction
        this.fs.copyTpl(
            self.templatePath('src/index.js.template'),
            self.destinationPath('src/index.js'), {
                elementName: this.elementName,
                importBlock: importBlock
            }
        );

        this.elementNames.forEach((elementName) => {
            // noinspection JSUnresolvedFunction
            self.fs.copyTpl(
                self.templatePath('src/tm-element.js'),
                self.destinationPath('src/' + elementName + '.js'), {
                    elementName: elementName
                }
            );
        });
    }

    generateImportBlockSrc() {
        return this.elementNames.map((elementName) => {
            return `import './${elementName}';`
        }).join('\n');
    }

    generateElementBlockDemo() {
        return this.elementNames.map((elementName) => {
            return `  <${elementName}></${elementName}>`
        }).join('\n');
    }
};

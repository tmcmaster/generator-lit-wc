const Generator = require('yeoman-generator');

module.exports = class extends Generator {
    // noinspection JSUnusedGlobalSymbols
    async prompting() {
        const self = this;
        self.answers = await self.prompt([
            {
                type: 'input',
                name: 'elementName',
                message: 'Element Name',
                default: self.appname, // Default to solution folder name
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
        self.fs.copyTpl(
            self.templatePath('LICENSE'),
            self.destinationPath('LICENSE'), {
                elementName: self.answers.elementName
            }
        );
        // noinspection JSUnresolvedFunction
        self.fs.copyTpl(
            self.templatePath('package.json'),
            self.destinationPath('package.json'), {
                elementName: self.answers.elementName,
                description: self.answers.description
            }
        );
        // noinspection JSUnresolvedFunction
        self.fs.copyTpl(
            self.templatePath('README.md'),
            self.destinationPath('README.md'), {
                elementName: self.answers.elementName,
                description: self.answers.description
            }
        );
        // noinspection JSUnresolvedFunction
        self.fs.copyTpl(
            self.templatePath('src/tm-element.js'),
            self.destinationPath('src/' + self.answers.elementName + '.js'), {
                elementName: self.answers.elementName
            }
        );
        // noinspection JSValidateTypes
        self.fs.copy(
            self.templatePath('demo/index.html'),
            self.destinationPath('demo/index.html')
        );
        // noinspection JSUnresolvedFunction
        self.fs.copyTpl(
            self.templatePath('demo/index.js'),
            self.destinationPath('demo/index.js'), {
                elementName: self.answers.elementName
            }
        );
    }
};

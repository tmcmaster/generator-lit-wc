const Generator = require('yeoman-generator');

module.exports = class extends Generator {
    async prompting() {
        const self = this;
        self.answers = await self.prompt([{
            type: 'input',
            name: 'elementName',
            message: 'Element name',
            default: self.appname, // Default to solution folder name
        }
        ]);
    }

    writing() {
        const self = this;
        self.fs.copy(
            self.templatePath('LICENSE'),
            self.destinationPath('LICENSE'),
        );
        self.fs.copyTpl(
            self.templatePath('package.json'),
            self.destinationPath('package.json'), {
                elementName: self.answers.elementName
            },
        );
        self.fs.copyTpl(
            self.templatePath('README.md'),
            self.destinationPath('README.md'), {
                elementName: self.answers.elementName
            },
        );

        self.fs.copyTpl(
            self.templatePath('src/tm-element.js'),
            self.destinationPath('src/' + self.answers.elementName + '.js'), {
                elementName: self.answers.elementName
            },
        );
    }
};

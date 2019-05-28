const Generator = require('yeoman-generator');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.defaultElementName = (this.appname === 'src' ? 'tm-element' : this.appname.replace(/\s+/g, '-'));
    }

    async prompting() {
        const defaultElementName = this.defaultElementName;
        self.answers = await self.prompt([
            {
                type: 'input',
                name: 'elementName',
                message: 'Element Name',
                default: defaultElementName
            }
        ]);
    }
    writing() {
        const elementName = this.answers.elementName;

    }
}
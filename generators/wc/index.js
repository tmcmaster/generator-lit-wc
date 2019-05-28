const Generator = require('yeoman-generator');

// noinspection JSUnresolvedFunction
const common = require('../../lib/common.js');

// noinspection JSUnresolvedVariable
module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        // noinspection JSUnresolvedVariable
        const folderName = process.cwd().split('/').pop();
        if (folderName === 'src') {
            opts['ignore-folder'] = true;
        }
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
            }
        ]);
    }
    // noinspection JSUnusedGlobalSymbols
    writing() {
        this._processAnswers();
        this._writeSrcFiles();
    }

    _processAnswers() {
        this.elementNames = common.createElementNamesAnswers(this.answers.elementNames);
        console.log('## Element Names: ', this.elementNames);
    }

    _writeSrcFiles() {
        this.elementNames.forEach((elementName) => {
            // noinspection JSUnresolvedFunction
            this.fs.copyTpl(
                this.templatePath('tm-element.js.template'),
                this.destinationPath(elementName + '.js'), {
                    elementName: elementName,
                    className: common.dashToCamel(elementName, true)
                }
            );
        });
    }
};
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
    return (elementNames === undefined ? [] : elementNames.map((e) => checkElementName(e)));
}

function checkElementName(elementName) {
    return (elementName === undefined ? undefined
        : (elementName.includes('-') ? elementName : 'tm-' + elementName));
}

function dashToCamel(value, capitaliseFirst) {
    let result = value.toLowerCase().replace(/\b-([a-z])/g, (_, word) => word[0].toUpperCase());

    return (capitaliseFirst ? result[0].toUpperCase() + result.slice(1, result.length) : result);
}

function createElementNamesInitial(args, opts, folderName) {
    const ignoreFolder = opts['ignore-folder'];

    const elementNames = (args && args.length > 0 ? args : []);

    if (!ignoreFolder) {
        elementNames.unshift(folderName);
    }

    return checkElementNames(elementNames).filter(e => e !== undefined);
}

function createElementNamesAnswers(elementNamesString) {
    if (!elementNamesString || elementNamesString.length === 0) {
        return ['tm-element']
    }
    const elementNames = elementNamesString.replace(/,/g, ' ').replace(/\s+/g, ' ').split(' ');
    if (!Array.isArray(elementNames)) {
        return checkElementNames([elementNames]);
    } else if (elementNames.length === 0) {
        return ['tm-element'];
    } else {
        return checkElementNames(elementNames);
    }
}

// noinspection JSUnresolvedVariable
module.exports = {
    generateElementBlockDemo,
    generateImportBlockSrc,
    dashToCamel,
    createElementNamesInitial,
    createElementNamesAnswers
};
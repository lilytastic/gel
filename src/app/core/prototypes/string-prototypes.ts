String.prototype.trimWhiteSpaces = trimWhiteSpaces;
String.prototype.splice = splice;
String.prototype.prettify = prettify;
String.prototype.replaceAt = replaceAt;

interface String {
    trimWhiteSpaces: typeof trimWhiteSpaces;
    splice: typeof splice;
    prettify: typeof prettify;
}

function replaceAt(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}
function trimWhiteSpaces() {
    return this.split(' ').join('');
}
function splice(start, end?) {
    if (end) {
        return this.slice(0, start) + this.slice(end);
    } else {
        return this.slice(0, start);
    }
}
function prettify() {
    let newString = this.trim();
    for (let i = 0; i < newString.length; i++) {
        const char = newString[i];
        let newChar = char;
        const prevChar = (i > 0) ? newString[i - 1] : '';
        const nextChar = (i < newString.length - 1) ? newString[i + 1] : '';
        switch (char) {
            case '"':
                if (prevChar === ' ' || prevChar === '') {
                    newChar = '“';
                } else {
                    newChar = '”';
                }
                break;
            case `'`:
                if (prevChar === ' ' || prevChar === '') {
                    newChar = '‘';
                } else {
                    newChar = '’';
                }
                break;
            default:
                break;
        }
        if (char !== newChar) {
            newString = newString.replaceAt(i, newChar);
        }
    }
    newString = newString.replace(/\.\.\./g, '…');
    newString = newString.replace(/--/g, '–');
    console.log(newString);
    return newString;
}

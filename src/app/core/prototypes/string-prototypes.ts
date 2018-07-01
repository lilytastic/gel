String.prototype.trimWhiteSpaces = trimWhiteSpaces;
String.prototype.splice = splice;

interface String {
    trimWhiteSpaces: typeof trimWhiteSpaces;
    splice: typeof splice;
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

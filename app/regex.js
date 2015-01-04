var regexMappings = [];
var absoluteUrlRegex = new RegExp("(http(s?):)?//([^\"'> \t\)]+)","g");
var relativeUrlRegex = new RegExp("/(?!(/))|(url\())([^\"'> \t\)]*)","g");
regexMappings.push(absoluteUrlRegex);
regexMappings.push(relativeUrlRegex);
module.exports = regexMappings;

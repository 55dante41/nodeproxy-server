var regexMappings = [];
var absoluteUrlRegex = new RegExp("(http(s?):)?//([^\"'> \t\)]+)");
//var relativeUrlRegex = new RegExp("/(?!(/)|(http(s?)://)|(url\())([^\"'> \t\)]*)");
regexMappings.push(absoluteUrlRegex);
//regexMappings.push(relativeUrlRegex);
module.exports = regexMappings;

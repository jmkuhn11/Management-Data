module.exports = {
    addWhiteSpace(inStr, length) {
      var newStr = inStr;
      while (newStr.length < length + 2) {
        newStr += " ";
      }
      return newStr;
    }
}

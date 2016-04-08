
//String repeater for load tests
Tests.Utilities = {};
Tests.Utilities.Repeat = function (pattern, count) {
    if (count < 1) return '';
    var result = '';
    while (count > 1) {
        if (count & 1) result += pattern;
        count >>= 1, pattern += pattern;
    }
    return result + pattern;
}

//Make arrays of X size with 
Tests.Utilities.MakeArray = function (count) {
    if (count < 1) return [];
    var result = [];
    while (count >= 1) {
        result.push(String(count));
        count--;
    }
    return result;
}

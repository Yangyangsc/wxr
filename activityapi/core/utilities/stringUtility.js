module.exports.endsWith =function(str,suffix){
     return (str.substr(str.length - suffix.length) === suffix);
}

module.exports.startWith=function(str,prefix){
      return (str.substr(0, prefix.length) === prefix);
}

module.exports.trim =function(str){
       return str.replace(/^\s+|\s+$/g, '');
}

module.exports.trimEnd  =function(str){
       return str.replace(/\s+$/, '');
}

module.exports.trimStart   =function(str){
       return str.replace(/^\s+/, '');
}

module.exports.format  =function(str,args){
    var _dic = typeof args === "object" ? args : arguments;
        return str.replace(/\{([^{}]+)\}/g, function(str, key) {
        // return key in _dic ? _dic[key] : str;
        return _dic.hasOwnProperty(key) ? _dic[key] : str;
    });
}

/*
var str = "参数{0}参数{1}参数{2}参数{3}参数{hehe}参数{{fuck}}参数{ooxx}";
console.log( str.format("001", "002") ); // 参数001参数002参数{3}参数{hehe}参数{{fuck}}参数{ooxx}
console.log( str.format(["001", "002"]) ); // 参数001参数002参数{3}参数{hehe}参数{{fuck}}参数{ooxx}
console.log( str.format([null, "", undefined, 1]) ); // 参数null参数参数undefined参数1参数{hehe}参数{{fuck}}参数{ooxx}

console.log( str.format({hehe: "呵呵", fuck: "法克"}) ); // 参数{0}参数{1}参数{3}参数呵呵参数{法克}参数{ooxx}
console.log( str.format({"1":"111", hehe: "呵呵", ooxx: "哈哈"}) ); // 参数{0}参数111参数{3}参数呵呵参数{{fuck}}参数哈哈
console.log( str.format({"1":undefined, hehe: null, ooxx: ""}) ); // 参数{0}参数undefined参数{2}参数{3}参数null参数{{fuck}}参数
*/
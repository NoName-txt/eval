String.prototype.replaceAll = function(find,replace) {
    return this.replace(new RegExp(find, 'g'), replace);
}

const colors = {
    "Reset": "\x1b[0m",
    "Bright": "\x1b[1m",
    "Dim": "\x1b[2m",
    "Underscore": "\x1b[4m",
    "Blink": "\x1b[5m",
    "Reverse": "\x1b[7m",
    "Hidden": "\x1b[8m",
    "Black": "\x1b[30m",
    "Red": "\x1b[31m",
    "Green": "\x1b[32m",
    "Yellow": "\x1b[33m",
    "Blue": "\x1b[34m",
    "Purple": "\x1b[35m",
    "Cyan": "\x1b[36m",
    "White": "\x1b[37m",
    "BgBlack": "\x1b[40m",
    "BgRed": "\x1b[41m",
    "BgGreen": "\x1b[42m",
    "BgYellow": "\x1b[43m",
    "BgBlue": "\x1b[44m",
    "BgPurple": "\x1b[45m",
    "BgCyan": "\x1b[46m",
    "BgWhite": "\x1b[47m"
}

function lowerName(data){
    var result = Object.fromEntries(Object.entries(data).map(([ key, value ]) =>
    [ key.toLowerCase(), value ]))
    return result;
}

function nameArray(data){
    var result = Object.entries(data).map(([ key ]) => key.toLowerCase())
    return result;
}

function log(message,color){
    if(!message) throw new Error("\x1b[35mYazı Giriniz!\x1b[0m");
    if(!nameArray(colors).includes(color)) throw new Error("\x1b[35mBöyle Bir Renk Bende Yok!\x1b[0m");
    
    let clr = lowerName(colors);
    console.log(`${clr[color.toLowerCase()]}%s\x1b[0m`,message)
}

function betterLog(message){
    if(!message) throw new Error("\x1b[35mYazı Giriniz!\x1b[0m");

    var nameClr = nameArray(colors);
    var lowerClr = lowerName(colors);

    message = message + "\x1b[0m"

    for(let i=0; i < nameClr.length; i++){
        message = message.replaceAll(`@${nameClr[i]}`,`${lowerClr[nameClr[i]]}`);
    }
    console.log(message);
}

module.exports = {colors,log,betterLog};
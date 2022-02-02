const fs = require("fs");

class Database{
    constructor({dataPath="./data.json"} = {}){
        this.path = dataPath;
        if (!fs.existsSync(dataPath)) {
            console.log("Database File Created \nPath: " + this.path);
            fs.writeFileSync(dataPath,"{}", { flag: 'wx' })
        }
        this.readFile = () => JSON.parse(fs.readFileSync(dataPath, "utf8"));
        this.writeFile = (data) => fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    }

    delete(info) {
        return this.set(info,undefined);
    }
    
    set(info, is) {
        const data = this.readFile();

        const text = info.toString()

        function setValue(obj, path, value) {
            var a = path.split(".");
            var o = obj
            while (a.length - 1) {
                var n = a.shift();
                if (!(n in o)) o[n] = {}
                o = o[n]
            }
            o[a[0]] = value
        }
        
        setValue(data, text, is);
        return this.writeFile(data);

    }
    
    get(info) {
        const data = this.readFile();
        const text = info.toString();

        function getValue(obj, path) {
            var a = path.split(".");
            var o = obj
            while (a.length - 1) {
                var n = a.shift();
                if (!(n in o)) o[n] = {}
                o = o[n]
            }
            return o[a[0]]
        }

        return getValue(data, text);;
    }

    fetch(info){
        return this.get(info)
    }

    has(info){
        const data = this.get(info);
        if(data === undefined) return false; else return true;
    }

    add(info,number){
        const data = this.get(info);
        if(isNaN(data) && isNaN(number)) throw new Error("This is not a number");
        var newNumber = data + number;
        return this.set(info,newNumber);
    }

    async push(info, value) {
        const data = await this.get(info);
        if (!data) {
            return this.set(info,[value]);
        }
        if (Array.isArray(data)) {
            var arr = data;
            arr.push(value);
            return this.set(info,arr);
        } else {
            return this.set(info,[value]);
        }
    }
    pull(info, text,id) {
        let dt = this.get(info);
        if (!dt) return;
        if (!Array.isArray(dt)) return;
        if (dt.length == 1) {
            if(id){
                if(dt[0][id] == text) return this.delete(info);
            }else{
                if(dt[0] == text) return this.delete(info);
            }
        } else {
            if(id){
                let ex = [];
                dt.forEach(dts => {
                    if (dts[id] === text) return;
                    ex.push(dts);
                    this.set(info,ex);
                });
            }else{
                let ex = [];
                dt.forEach(dts => {
                    if (dts === text) return;
                    ex.push(dts);
                    this.set(info,ex);
                });
            }
            
        }
        return text;
    }

    getAll() {
        let data = this.readFile();
        return data;
    }
  
  }

  module.exports = Database;

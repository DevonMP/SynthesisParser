const itemBases = require('./itemBases.json');
class Item {
    constructor(inputText) {
        this.mods = this.getModsFromText(inputText);
        this.itemType = this.getTypeFromText(inputText);
    }
    
    getModsFromText(item){
        var lines = item.trim().replace("\t","").split("\n");
        lines.filter(function(element){return element != "";});
        var mods = [];
        var Fractured = false;
        for(var i =0; i < lines.length; i++){
            var currentLine = lines[(lines.length-1) - i].trim();
            if(i == 0 && currentLine== 'Fractured Item'){
                Fractured = true;
                continue;
            }
            if( i > 1 && currentLine == "--------"){
                return mods;
            }
            if (currentLine != "--------"){
                mods.push({
                    modText: this.getModText(currentLine),
                    value:this.getModValue(currentLine)
                });
            }
        }
        return mods;
    }

    getModText(mod){
        return mod.replace('(fractured)', '').trim()
    }

    getModValue(mod){
        var myregex = RegExp('([-\\d\.]+)','g');
        var matches;
        var total = 0.0;
        var count = 0.0;
        while((matches = myregex.exec(mod)) !== null){
            total += parseFloat(matches[0]);
            count++;
        }
        return  total / count;
    }

    getTypeFromText(item) {
        var lines = item.split("\n");
        return itemBases[lines[2].trim()];
    }
}

module.exports = Item;
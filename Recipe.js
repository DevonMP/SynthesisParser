const cheerio = require('cheerio');

class Recipe {
    constructor(row){
        this.text = cheerio.load(row[0]).text();
        this.value = row[1];
        this.requiredMod = this.getModTemplate(row);
		this.types = this.getModTypes(row);
        this.result = this.getResult(row);
        this.TopTier = false;
        this.Tier = 0;
        if(this.text.indexOf("per second") > -1){
            this.value = this.value / 60;
        }
    }

    getModTemplate(mod){
        var $ = cheerio.load(mod[0]);
        $('.mod-value').each(function(){
            $(this).text($(this).text().replace('%', '\\%').replace('+','\\+').replace('#', '\\d+'));
        });
        return "^" + $.text() + "$";
    }

    getModTypes(mod){
        var $ = cheerio.load(mod[2]);
        var types = [];
        $('a').each(function(){
            types.push($(this).attr('href').split('?cn=')[1]);
        });
        return types;
    }

    getResult(mod){
        var $ = cheerio.load(mod[3]);
        var results = [];
        $('li').each(function(){
            results.push($(this).text());
        });
        return results;
    }
}

 module.exports = Recipe;
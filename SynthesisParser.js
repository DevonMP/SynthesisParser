const Recipe = require('./Recipe.js');
const Item = require('./Item.js');
const synthesisMods = require('./ItemSynthesisMods.json');

const sampleItem = `Rarity: Rare
Hate Nail
Coral Ring
--------
Requirements:
Level: 38
--------
Item Level: 74
--------
+22 to maximum Life
--------
Adds 8 to 16 Cold Damage to Attacks (fractured)
+62 to Evasion Rating (fractured)
+17 to Dexterity
+35% to Fire Resistance
+11 Life gained on Kill
--------
Fractured Item`;

function GetPossibleSynthesisMods(item, recipes){
	var lastRecipe;
	var wasMatch = false;
	var validRecipes = [];
	for(var i in recipes){
		var currentRecipe = recipes[i];
		if(currentRecipe.types.includes(item.itemType)){
			validRecipes.push(currentRecipe);
		}
	}
	var tier = 0;
	for(var i in validRecipes){
		var currentRecipe = validRecipes[i];
		var isMatch = false;
		if(lastRecipe != null && lastRecipe.text != currentRecipe.text){
			tier = 0;
		}
		tier++;
		
		for(var x in item.mods){
			if(item.mods[x].modText.match(currentRecipe.text) &&
				item.mods[x].value * 3 > currentRecipe.value
			){
				isMatch = true;
			}
		}

		if(wasMatch && !isMatch){
			console.log(currentRecipe.result + " " + tier);
		}
		wasMatch = isMatch;
		lastRecipe = currentRecipe;
	}

	return null;
}

function loadRecipes(modData){
	var modTemplates = [];
	for(var i in modData){
		modTemplates.push(new Recipe(modData[i]));
	}
	return modTemplates;
}
const myItem = new Item(sampleItem);
const recipes = loadRecipes(synthesisMods.data);
recipes.sort(function(a, b){
	if(a.text.localeCompare(b.text) == 0){
		return a.value - b.value;
	}
	return a.text.localeCompare(b.text);
});
//console.log(recipes);
GetPossibleSynthesisMods(myItem, recipes);
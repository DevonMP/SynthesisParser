$("#mainform").submit(function(e){
    e.preventDefault();
    $.post('/itemdata', $(this).serialize(),function(data){
        $("#possibleMods").html("");
        console.log(data);
        for(i in data){
            var listElement = $("<ul />");
            for(x in data[i].recipe.result){
                $(listElement).append($("<li>"+data[i].recipe.result[x]+"</li>"));
            }
            if(data[i].recipe.TopTier){
                listElement.addClass("TopTier");
            }
            var listItem = $("<li />");
            $(listItem).append("<span class='mod'>"+data[i].mod.modText+"</span> ");
            $(listItem).append("<span class='tier'>Tier "+data[i].recipe.Tier+"</span>");
            listItem.append(listElement);
            
            if(data[i].mod.fractured){
                $(listItem).addClass("Fractured");
            }
            $("#possibleMods").append(listItem);
        }
    })
});

$("#item").click(function(){$(this).val("");});
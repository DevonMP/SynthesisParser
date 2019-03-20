$("#mainform").submit(function(e){
    e.preventDefault();
    $.post('/itemdata', $(this).serialize(),function(data){
        $("#possibleMods").html("");
        console.log(data);
        for(i in data){
            var listElement = $("<ul />");
            for(x in data[i].result){
                $(listElement).append($("<li>"+data[i].result[x]+"</li>"));
            }
            if(data[i].TopTier){
                listElement.addClass("TopTier");
            }
            var listItem = $("<li />");
            listItem.append(listElement);
            $("#possibleMods").append(listItem);
        }
    })
});

$("#item").click(function(){$(this).val("");});
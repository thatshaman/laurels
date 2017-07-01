var commerceValue = {};
var commerceItems = {
    ectoplasm: [19721],
    T1: [24342, 24346, 24272, 24352, 24284, 24296, 24278, 24290],
    T2: [24343, 24347, 24273, 24353, 24285, 24297, 24279, 24291],
    T3: [24344, 24348, 24274, 24354, 24286, 24298, 24280, 24292],
    T4: [24345, 24349, 24275, 24355, 24287, 24363, 24281, 24293],
    T5: [24341, 24350, 24276, 24356, 24288, 24299, 24282, 24294],
    T6: [24358, 24351, 24277, 24357, 24289, 24300, 24283, 24295]
};


var bagValue = { T1: [], T2: [], T3: [], T4: [], T5: [], T6: [] };
var bagCount = {
    T1: { min: 15, max: 25 },
    T2: { min: 15, max: 20 },
    T3: { min: 10, max: 20 },
    T4: { min: 10, max: 20 },
    T5: { min: 10, max: 20 },
    T6: { min: 3, max: 3 },
}

var items = [];
var tradingPostURL = "https://api.guildwars2.com/v2/commerce/prices?ids=" + commerceItems.ectoplasm.concat(commerceItems.T1, commerceItems.T2, commerceItems.T3, commerceItems.T4, commerceItems.T5, commerceItems.T6).join();

var low = 0;
var high = 0;
var average = 0;
var median = 0;
var ecto = 0;

$(document).ready(function () {
    fillList();
    loadTradingPostData();

    $("#link_low").click(function () {
        updateList(low);
    });

    $("#link_median").click(function () {
        updateList(median);
    });


    $("#link_average").click(function () {
        updateList(average);
    });

    $("#link_high").click(function () {
        updateList(high);
    });

    $("#tierSelection").val("6").trigger("change");
    $("#tierSelection").change(function () {
        updateTier($("#tierSelection").val());
    });

});


// Load current trading post data
function loadTradingPostData() {
    jQuery.ajax({
        url: tradingPostURL,
        async: false,
        dataType: 'json',
        success: function (data, status, request) {

            for (var i = 0; i < data.length; i++) {
                commerceValue[data[i].id] = data[i].sells.unit_price;
            }

            for (var t = 1; t < 7; t++) {
                for (var i = 0; i < commerceItems["T" + t].length; i++) {
                    bagValue["T" + t].push(commerceValue[commerceItems["T" + t][i]]);
                }
            }

            ecto = commerceValue[commerceItems.ectoplasm] * 0.85;
            updateTier(6);
        }
    });
}

// Fills the list with vendor data
function fillList() {
    var items = $("#items");
    $.each(laurelData, function (key, data) {
        var header = $("<li />");
        header.html(key);
        header.attr("data-role", "list-divider");
        header.appendTo(items);

        for (var i = 0; i < data.length; i++) {
            var entry = $("<li class='laurelEntry'/>");
            entry.html("<a href='#'><img class='icon' src='" + data[i].Icon + "'/> <span class='rarity_" + data[i].Rarity + "'>" + data[i].Name + "</span><span class='gold'></span></a>");

            entry.attr("data-price", data[i].Price);
            entry.attr("data-base", data[i].Base);
            entry.attr("data-ecto", data[i].Ecto);

            entry.appendTo(items);
        }
    });
    items.listview("refresh");
}

// Updates the price 
function updateList(price) {

    var items = $("#items li");
    for (var i = 0; i < items.length; i++) {
        var entry = $(items[i]);
        if (entry.data("price") !== undefined) {
            var goldPrice = (price * entry.data("price")) + (entry.data("ecto") * ecto) + entry.data("base");
            entry.find(".gold").html(formatGold(goldPrice));
        }
    }
}

function updateTier(tier) {
    high = Math.round((bagValue["T" + tier].high() * 0.85) * bagCount["T" + tier].max);
    low = Math.round((bagValue["T" + tier].low() * 0.85) * bagCount["T" + tier].min);
    average = Math.round((bagValue["T" + tier].average() * 0.85) * ((bagCount["T" + tier].max + bagCount["T" + tier].min) / 2));
    median = Math.round((bagValue["T" + tier].median() * 0.85) * ((bagCount["T" + tier].max + bagCount["T" + tier].min) / 2));

    // Update buttons
    $("#high").html(formatGold(high));
    $("#avg").html(formatGold(average));
    $("#median").html(formatGold(median));
    $("#low").html(formatGold(low));

    $("#link_low").removeClass("ui-btn-active");
    $("#link_average").addClass("ui-btn-active");
    $("#link_high").removeClass("ui-btn-active");
    $("#link_median").removeClass("ui-btn-active");

    updateList(average);
}

// Converts copper to HTML format
function formatGold(val) {
    var retval = "<div class='coins'>";
    retval += Math.floor(val / 10000) + " <img src='https://render.guildwars2.com/file/090A980A96D39FD36FBB004903644C6DBEFB1FFB/156904.png' class='coin'/> ";
    retval += Math.floor(val / 100) % 100 + " <img src='https://render.guildwars2.com/file/E5A2197D78ECE4AE0349C8B3710D033D22DB0DA6/156907.png' class='coin'/> ";
    retval += val % 100 + " <img src='https://render.guildwars2.com/file/6CF8F96A3299CFC75D5CC90617C3C70331A1EF0E/156902.png' class='coin'/>";
    retval += "</div>";

    return retval;
}


// Prototype calculation functions
Array.prototype.average = function () {
    retval = undefined;

    if (this.length > 0) {
        retval = 0;
        for (i = 0; i < this.length; i++) {
            retval += this[i];
        }
        retval = retval / this.length;
    }
    return retval;
}

Array.prototype.low = function () {
    retval = undefined;
    for (i = 0; i < this.length; i++) {
        if (i == 0) {
            retval = this[i];
        } else {
            if (this[i] < retval) retval = this[i];
        }
    }
    return retval;
}

Array.prototype.high = function () {
    retval = undefined;
    for (i = 0; i < this.length; i++) {
        if (i == 0) {
            retval = this[i];
        } else {
            if (this[i] > retval) retval = this[i];
        }
    }
    return retval;
}

Array.prototype.median = function () {
    retval = undefined;

    var sorted = this.sort(function (a, b) { return a - b; });
    var halfpoint = Math.floor(sorted.length / 2);
    if (sorted.length % 2) {
        retval = sorted[halfpoint];
    }
    else {
        retval = (sorted[halfpoint - 1] + sorted[halfpoint]) / 2.0;
    }

    return retval;
}

// SNIP LAUREL VENDOR DATA BELOW

var laurelData = {
    "General":
    [
        {
            "Name": "Endless Mystery Cat Tonic",
            "Rarity": "Exotic",
            "Icon": "https://render.guildwars2.com/file/CD32DE71FB72130237D60446AF319DBB5F80A120/534193.png",
            "Price": 100,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Chauncey von Snuffles III",
            "Rarity": "Masterwork",
            "Icon": "https://render.guildwars2.com/file/C69DEDA60D6346EC9B1FC8BA481B130FF909CA1A/534194.png",
            "Price": 75,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Goedulf",
            "Rarity": "Masterwork",
            "Icon": "https://render.guildwars2.com/file/B16F7809AC181AD4FEB1F1E6DA2FC1A76B6DE89E/534195.png",
            "Price": 75,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "10 Mystic Binding Agents",
            "Rarity": "Fine",
            "Icon": "https://render.guildwars2.com/file/2CB9736615E23CC0630B09B774CAA20FE9639906/534216.png",
            "Price": 10,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "2 Pieces of Profession Gear",
            "Rarity": "Rare",
            "Icon": "https://render.guildwars2.com/file/605107FD3667E62F3B0400F7BDE1F03AEEDAD24F/534200.png",
            "Price": 5,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Unidentified Dye",
            "Rarity": "Basic",
            "Icon": "https://render.guildwars2.com/file/109A6B04C4E577D9266EEDA21CC30E6B800DD452/66587.png",
            "Price": 5,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "3 Obsidian Shards",
            "Rarity": "Legendary",
            "Icon": "https://render.guildwars2.com/file/AE16FCC326D80A3906B17B6A75E8A91980BE4670/434362.png",
            "Price": 3,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Advanced Harvesting Sickle",
            "Rarity": "Masterwork",
            "Icon": "https://render.guildwars2.com/file/EFBB674F9965A2304CBAC39376230396D73EBCFD/534199.png",
            "Price": 2,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Advanced Logging Axe",
            "Rarity": "Masterwork",
            "Icon": "https://render.guildwars2.com/file/2412B19F25D5F118689B0BCBB6DE45D141094BDA/534203.png",
            "Price": 2,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Advanced Mining Pick",
            "Rarity": "Masterwork",
            "Icon": "https://render.guildwars2.com/file/A4A81F6ADFF658EB1276D759D770F2AB53AA450A/534205.png",
            "Price": 2,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Experience Booster",
            "Rarity": "Masterwork",
            "Icon": "https://render.guildwars2.com/file/433FE6E01CDA243EDBDC24F96F06D5FC2FAF195A/66584.png",
            "Price": 1,
            "Base": 0,
            "Ecto": 0
        },

        {
            "Name": "Item Booster",
            "Rarity": "Masterwork",
            "Icon": "https://render.guildwars2.com/file/F1E6C29D6A783A9563E5D516532C6E079C5A6069/66669.png",
            "Price": 1,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Laureate Experience Booster",
            "Rarity": "Masterwork",
            "Icon": "https://render.guildwars2.com/file/285619C550C64409B45D613E257CF63D1AD19657/534196.png",
            "Price": 1,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Tiny Crafting Bag",
            "Rarity": "Fine",
            "Icon": "https://render.guildwars2.com/file/9A54C444930C7D0DEE6FFDDE92603CD851F7CB90/534210.png",
            "Price": 1,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Small Crafting Bag",
            "Rarity": "Fine",
            "Icon": "https://render.guildwars2.com/file/452575F50F3A7005BDF49F08F913DB0EE17441DC/534211.png",
            "Price": 1,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Light Crafting Bag",
            "Rarity": "Fine",
            "Icon": "https://render.guildwars2.com/file/940FF213716780060BA2760A0CC606C4333DE3FA/534212.png",
            "Price": 1,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Medium Crafting Bag",
            "Rarity": "Fine",
            "Icon": "https://render.guildwars2.com/file/780F646336EBBE9F6B904AA515441026F1E2FE25/534213.png",
            "Price": 1,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Large Crafting Bag",
            "Rarity": "Fine",
            "Icon": "https://render.guildwars2.com/file/190A14720A79FED075949798D29D136DBF7EBD92/534214.png",
            "Price": 1,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Heavy Crafting Bag",
            "Rarity": "Fine",
            "Icon": "https://render.guildwars2.com/file/6BA1C677C05D4C65044949FA1116EB112A4E053D/534215.png",
            "Price": 1,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Essence of Llamatic Elegance",
            "Rarity": "Fine",
            "Icon": "https://render.guildwars2.com/file/121292531DA9401B3CD8E81709C777411D3C6540/983554.png",
            "Price": 3,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Ascended Salvage Tool",
            "Rarity": "Ascended",
            "Icon": "https://render.guildwars2.com/file/042999E003ABE71E0AB73B189A5EA40D07BF91C4/1200206.png",
            "Price": 1,
            "Base": 20000,
            "Ecto": 0
        },
        {
            "Name": "Essence of Skrittish Charity",
            "Rarity": "Fine",
            "Icon": "https://render.guildwars2.com/file/71193CC1CE1D362FED55E061A2C5A744902033B5/1322547.png",
            "Price": 3,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Chest of Legendary Shards",
            "Rarity": "Exotic",
            "Icon": "https://render.guildwars2.com/file/02BEB919E40F2A4E61AF3AD8AA3701A7D99A62EA/1493226.png",
            "Price": 10,
            "Base": 0,
            "Ecto": 0
        }
    ],
    "Ascended Gear":
    [
        {
            "Name": "Ascended Recipe",
            "Rarity": "Ascended",
            "Icon": "https://render.guildwars2.com/file/162616E65F5D247791C12B0BA27442536637E1D8/631170.png",
            "Price": 5,
            "Base": 20000,
            "Ecto": 0
        },
        {
            "Name": "Amulet",
            "Rarity": "Ascended",
            "Icon": "https://render.guildwars2.com/file/541C48535B97654CD816F553B67770F7BCB595B5/534269.png",
            "Price": 30,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Ring",
            "Rarity": "Ascended",
            "Icon": "https://render.guildwars2.com/file/B155B37AD048CA9054F749043C3E4E99973DF8DF/511826.png",
            "Price": 35,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Accessory",
            "Rarity": "Ascended",
            "Icon": "https://render.guildwars2.com/file/0E4C0C67CA06D97FD9E93C08BC600103D15AAF6A/543880.png",
            "Price": 40,
            "Base": 0,
            "Ecto": 50
        },
        {
            "Name": "Gilded Enrichment",
            "Rarity": "Fine",
            "Icon": "https://render.guildwars2.com/file/04716CEDA6593593DDF1DEF826D521D39E6875A1/534271.png",
            "Price": 20,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Magical Enrichment",
            "Rarity": "Fine",
            "Icon": "https://render.guildwars2.com/file/5D073A680E66AE473CAC54D1B775AE0DE90E776E/534273.png",
            "Price": 20,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Experienced Enrichment",
            "Rarity": "Fine",
            "Icon": "https://render.guildwars2.com/file/CB540FC0D1A0F52B2B68370378A4137F66350222/534270.png",
            "Price": 10,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Karmic Enrichment",
            "Rarity": "Fine",
            "Icon": "https://render.guildwars2.com/file/F508A75DDFBFC87133FFC5ADA3DADFF5640A2E0C/534272.png",
            "Price": 10,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Basic Infusion",
            "Rarity": "Basic",
            "Icon": "https://render.guildwars2.com/file/79FB4479F4A0E9DB923E48CAB1F777F8F70B974F/511834.png",
            "Price": 5,
            "Base": 0,
            "Ecto": 0
        }

    ],
    "WvW":
    [
        {
            "Name": "Trebuchet Blueprints",
            "Rarity": "Basic",
            "Icon": "https://render.guildwars2.com/file/B233DDC4D8A2EB1BF10F533E62E8BE0D7C734D4D/63045.png",
            "Price": 2,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "2 Catapult Blueprints",
            "Rarity": "Basic",
            "Icon": "https://render.guildwars2.com/file/0F68450F2D9AAE580294070426EFD7AF66F1CE71/63047.png",
            "Price": 2,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "3 Ballista Blueprints",
            "Rarity": "Basic",
            "Icon": "https://render.guildwars2.com/file/27E67AB70677EB0DB834A4D4244CBE65FA1F1DC7/62862.png",
            "Price": 2,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "4 Flame Ram Blueprints",
            "Rarity": "Basic",
            "Icon": "https://render.guildwars2.com/file/0CF25610DF30C07F57F7AF9058F4636B15A2A7D7/66267.png",
            "Price": 2,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "4 Arrow Cart Blueprints",
            "Rarity": "Basic",
            "Icon": "https://render.guildwars2.com/file/02052733FF693927AC44EEBCAAFF4B5AB0E974AD/63046.png",
            "Price": 2,
            "Base": 0,
            "Ecto": 0
        }
    ],
    "One-Time Purchases":
    [
        {
            "Name": "Crafting Starter Kit",
            "Rarity": "Fine",
            "Icon": "https://render.guildwars2.com/file/6FA4A40C7B06D4FE38CA376810F8C5A2B477B29A/534192.png",
            "Price": 3,
            "Base": 0,
            "Ecto": 0
        }
    ],
    "Living World Season 1 Rewards":
    [
        {
            "Name": "Living World Season 1 Reward",
            "Rarity": "Exotic",
            "Icon": "https://render.guildwars2.com/file/B762EADCBB01980DB6A5BC18C334757380C99274/681024.png",
            "Price": 25,
            "Base": 150000,
            "Ecto": 0
        }
    ],
    "Living World Season 2 Rewards":
    [
        {
            "Name": "Amulet",
            "Rarity": "Ascended",
            "Icon": "https://render.guildwars2.com/file/699EB7CA63EB1BFE2BC29A44E9D0D61A099723BE/931175.png",
            "Price": 30,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Ring",
            "Rarity": "Ascended",
            "Icon": "https://render.guildwars2.com/file/C4B35B0C3B66EBF35447F75B2ABDEEA63B0004FD/904697.png",
            "Price": 35,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Accessory",
            "Rarity": "Ascended",
            "Icon": "https://render.guildwars2.com/file/DBA4B091EF0BA5302EFE01A213E441054367D95A/904692.png",
            "Price": 40,
            "Base": 0,
            "Ecto": 50
        }
    ],
    "Achievement Rewards":
    [
        {
            "Name": "Recipe: Superior Rune",
            "Rarity": "Exotic",
            "Icon": "https://render.guildwars2.com/file/64F6762697317B5472056E11A3B2310E273BA16C/849265.png",
            "Price": 1,
            "Base": 864,
            "Ecto": 0
        },
        {
            "Name": "Utility Recipe",
            "Rarity": "Masterwork",
            "Icon": "https://render.guildwars2.com/file/E19734B71C949924A1353106E513DE62729A5313/849374.png",
            "Price": 1,
            "Base": 4000,
            "Ecto": 0
        },
        {
            "Name": "Dungeon Accessory",
            "Rarity": "Ascended",
            "Icon": "https://render.guildwars2.com/file/59FBD6C721C264E678D3D81B6F0E99C758BC1693/866835.png",
            "Price": 40,
            "Base": 50000,
            "Ecto": 0
        },
        {
            "Name": "Guide: Mistward Armor",
            "Rarity": "Exotic",
            "Icon": "https://render.guildwars2.com/file/2D1AE5B60CDBBC50075CA20EE6191EC4707DBF44/849310.png",
            "Price": 1,
            "Base": 0,
            "Ecto": 0
        }
    ]
};
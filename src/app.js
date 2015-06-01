var tradingPostURL = "https://api.guildwars2.com/v2/commerce/prices?ids=24357,24289,24300,24283,24295,24358,24351,24277,19721";

var low = 99999;
var high = 0;
var average = 0;
var ecto = 0;

$(document).ready(function ()
{
    fillList();
    loadTradingPostData();

    $("#link_low").click(function ()
    {
        updateList(low);
    });

    $("#link_average").click(function ()
    {
        updateList(average);
    });

    $("#link_high").click(function ()
    {
        updateList(high);
    });

});

// Load current T6 data from trading post
function loadTradingPostData()
{
    jQuery.ajax({
        url: tradingPostURL,
        async: false,
        dataType: 'json',
        success: function (data, status, request)
        {
            for (var i = 0; i < data.length; i++)
            {
                var price = data[i].sells.unit_price;
                if (data[i].id != 19721)
                {
                    average += price;
                    if (low > price) low = price;
                    if (high < price) high = price;
                }
                else
                {
                    // etco
                    ecto = price;
                }
            }

            // Multiply by 3 items, substract 15% Fee
            high = Math.round((high * 0.85) * 3);
            low = Math.round((low * 0.85) * 3);
            average = Math.round(((average * 0.85) * 3) / 8);

            // Update buttons
            $("#high").html(formatGold(high));
            $("#avg").html(formatGold(average));
            $("#low").html(formatGold(low));

            updateList(average);
        }
    });
}

// Fills the list with vendor data
function fillList()
{
    var items = $("#items");
    $.each(laurelData, function (key, data)
    {
        var header = $("<li />");
        header.html(key);
        header.attr("data-role", "list-divider");
        header.appendTo(items);

        for (var i = 0; i < data.length; i++)
        {
            var entry = $("<li class='laurelEntry'/>");
            entry.html("<a href='#'><img src='" + data[i].Icon + "'/> <span class='rarity_" + data[i].Rarity + "'>" + data[i].Name + "</span><span class='gold'></span></a>");

            entry.attr("data-price", data[i].Price);
            entry.attr("data-base", data[i].Base);
            entry.attr("data-ecto", data[i].Ecto);

            entry.appendTo(items);
        }
    });
    items.listview("refresh");
}

// Updates the price 
function updateList(price)
{

    var items = $("#items li");
    for (var i = 0; i < items.length; i++)
    {
        var entry = $(items[i]);
        if (entry.data("price") !== undefined)
        {
            var goldPrice = (price * entry.data("price")) + (entry.data("ecto") * ecto) + entry.data("base");
            entry.find(".gold").html(formatGold(goldPrice));
        }
    }

}

// Converts copper to HTML format
function formatGold(val)
{
    var retval = "<div class='coins'>";
    retval += Math.floor(val / 10000) + " <img src='https://render.guildwars2.com/file/090A980A96D39FD36FBB004903644C6DBEFB1FFB/156904.png' class='coin'/> ";
    retval += Math.floor(val / 100) % 100 + " <img src='https://render.guildwars2.com/file/E5A2197D78ECE4AE0349C8B3710D033D22DB0DA6/156907.png' class='coin'/> ";
    retval += val % 100 + " <img src='https://render.guildwars2.com/file/6CF8F96A3299CFC75D5CC90617C3C70331A1EF0E/156902.png' class='coin'/>";
    retval += "</div>";

    return retval;
}

// SNIP LAUREL VENDOR DATA BELOW

var laurelData = {
    "General":
        [
            {
                "Name": "Endless Mystery Cat Tonic",
                "Rarity": "Exotic", "Icon": "https://render.guildwars2.com/file/CD32DE71FB72130237D60446AF319DBB5F80A120/534193.png",
                "Price": 100,
                "Base": 0,
                "Ecto": 0
            },
            {
                "Name": "Chauncey von Snuffles III",
                "Rarity": "Masterwork", "Icon": "https://render.guildwars2.com/file/C69DEDA60D6346EC9B1FC8BA481B130FF909CA1A/534194.png",
                "Price": 75,
                "Base": 0,
                "Ecto": 0
            },
            {
                "Name": "Goedulf",
                "Rarity": "Masterwork", "Icon": "https://render.guildwars2.com/file/B16F7809AC181AD4FEB1F1E6DA2FC1A76B6DE89E/534195.png",
                "Price": 75,
                "Base": 0,
                "Ecto": 0
            },
            {
                "Name": "Mystic Binding Agent (10)",
                "Rarity": "Fine", "Icon": "https://render.guildwars2.com/file/2CB9736615E23CC0630B09B774CAA20FE9639906/534216.png",
                "Price": 10,
                "Base": 0,
                "Ecto": 0
            },
            {
                "Name": "Gear Box (2)",
                "Rarity": "Rare", "Icon": "https://render.guildwars2.com/file/605107FD3667E62F3B0400F7BDE1F03AEEDAD24F/534200.png",
                "Price": 5,
                "Base": 0,
                "Ecto": 0
            },
            {
                "Name": "Unidentified Dye",
                "Rarity": "Basic", "Icon": "https://render.guildwars2.com/file/109A6B04C4E577D9266EEDA21CC30E6B800DD452/66587.png",
                "Price": 5,
                "Base": 0,
                "Ecto": 0
            },
            {
                "Name": "Obsidian Shard (3)",
                "Rarity": "Legendary", "Icon": "https://render.guildwars2.com/file/AE16FCC326D80A3906B17B6A75E8A91980BE4670/434362.png",
                "Price": 3,
                "Base": 0,
                "Ecto": 0
            },
            {
                "Name": "Advanced Harvesting Sickle",
                "Rarity": "Masterwork", "Icon": "http://wiki.guildwars2.com/images/4/4d/Advanced_Harvesting_Sickle.png",
                "Price": 2,
                "Base": 0,
                "Ecto": 0
            },
            {
                "Name": "Advanced Logging Axe",
                "Rarity": "Masterwork", "Icon": "http://wiki.guildwars2.com/images/d/d7/Advanced_Logging_Axe.png",
                "Price": 2,
                "Base": 0,
                "Ecto": 0
            },
            {
                "Name": "Advanced Mining Pick",
                "Rarity": "Masterwork", "Icon": "http://wiki.guildwars2.com/images/5/50/Advanced_Mining_Pick.png",
                "Price": 2,
                "Base": 0,
                "Ecto": 0
            },
            {
                "Name": "Laureate Experience Booster",
                "Rarity": "Masterwork", "Icon": "http://wiki.guildwars2.com/images/4/43/Laureate_Experience_Booster.png",
                "Price": 1,
                "Base": 0,
                "Ecto": 0
            },
            {
                "Name": "Laureate Magic Find Booster",
                "Rarity": "Masterwork", "Icon": "http://wiki.guildwars2.com/images/6/6a/Laureate_Magic_Find_Booster.png",
                "Price": 1,
                "Base": 0,
                "Ecto": 0
            },
            {
                "Name": "Laureate Coin Booster",
                "Rarity": "Masterwork", "Icon": "http://wiki.guildwars2.com/images/f/f4/Laureate_Coin_Booster.png",
                "Price": 1,
                "Base": 0,
                "Ecto": 0
            },
            {
                "Name": "Tiny Crafting Bag",
                "Rarity": "Fine", "Icon": "http://wiki.guildwars2.com/images/7/70/Tiny_Crafting_Bag.png",
                "Price": 1,
                "Base": 0,
                "Ecto": 0
            },
            {
                "Name": "Small Crafting Bag",
                "Rarity": "Fine", "Icon": "http://wiki.guildwars2.com/images/2/26/Small_Crafting_Bag.png",
                "Price": 1,
                "Base": 0,
                "Ecto": 0
            },
            {
                "Name": "Light Crafting Bag",
                "Rarity": "Fine", "Icon": "http://wiki.guildwars2.com/images/d/d9/Light_Crafting_Bag.png",
                "Price": 1,
                "Base": 0,
                "Ecto": 0
            },
            {
                "Name": "Medium Crafting Bag",
                "Rarity": "Fine", "Icon": "http://wiki.guildwars2.com/images/b/bc/Medium_Crafting_Bag.png",
                "Price": 1,
                "Base": 0,
                "Ecto": 0
            },
            {
                "Name": "Large Crafting Bag",
                "Rarity": "Fine", "Icon": "http://wiki.guildwars2.com/images/c/ce/Large_Crafting_Bag.png",
                "Price": 1,
                "Base": 0,
                "Ecto": 0
            },
            {
                "Name": "Heavy Crafting Bag",
                "Rarity": "Fine", "Icon": "http://wiki.guildwars2.com/images/a/a3/Heavy_Crafting_Bag.png",
                "Price": 1,
                "Base": 0,
                "Ecto": 0
            },
            {
                "Name": "Letter of Commendation (2)",
                "Rarity": "Rare", "Icon": "http://wiki.guildwars2.com/images/9/93/Influence_letter.png",
                "Price": 16,
                "Base": 0,
                "Ecto": 0
            },
            {
                "Name": "Essence of Llamatic Elegance",
                "Rarity": "Fine", "Icon": "http://wiki.guildwars2.com/images/9/95/Essence_of_Llamatic_Elegance.png",
                "Price": 3,
                "Base": 0,
                "Ecto": 0
            }
        ],
    "Ascended Gear":
    [
        {
            "Name": "Amulet",
            "Rarity": "Ascended", "Icon": "http://wiki.guildwars2.com/images/9/9c/Syzygy.png",
            "Price": 30,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Ring",
            "Rarity": "Ascended", "Icon": "http://wiki.guildwars2.com/images/9/98/Solaria%2C_Circle_of_the_Sun.png",
            "Price": 35,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Accessory",
            "Rarity": "Ascended", "Icon": "http://wiki.guildwars2.com/images/0/0c/Celestial_Sigil.png",
            "Price": 40,
            "Base": 0,
            "Ecto": 50
        },
        {
            "Name": "Gilded Infusion",
            "Rarity": "Fine", "Icon": "http://wiki.guildwars2.com/images/5/54/Gilded_Infusion.png",
            "Price": 20,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Magical Infusion",
            "Rarity": "Fine", "Icon": "http://wiki.guildwars2.com/images/1/11/Magical_Infusion.png",
            "Price": 20,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Experienced Infusion",
            "Rarity": "Fine", "Icon": "http://wiki.guildwars2.com/images/5/53/Experienced_Infusion.png",
            "Price": 10,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Karmic Infusion",
            "Rarity": "Fine", "Icon": "http://wiki.guildwars2.com/images/f/f0/Karmic_Infusion.png",
            "Price": 10,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Healing Infusion",
            "Rarity": "Basic", "Icon": "http://wiki.guildwars2.com/images/a/a8/Healing_Infusion.png",
            "Price": 5,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Resilient Infusion",
            "Rarity": "Basic", "Icon": "http://wiki.guildwars2.com/images/b/b6/Resilient_Infusion.png",
            "Price": 5,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Vital Infusion",
            "Rarity": "Basic", "Icon": "http://wiki.guildwars2.com/images/4/41/Vital_Infusion.png",
            "Price": 5,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Malign Infusion",
            "Rarity": "Basic", "Icon": "http://wiki.guildwars2.com/images/a/a8/Malign_Infusion.png",
            "Price": 5,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Mighty Infusion",
            "Rarity": "Basic", "Icon": "http://wiki.guildwars2.com/images/a/a3/Mighty_Infusion.png",
            "Price": 5,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Precise Infusion",
            "Rarity": "Basic", "Icon": "http://wiki.guildwars2.com/images/3/31/Precise_Infusion.png",
            "Price": 5,
            "Base": 0,
            "Ecto": 0
        }
    ],
    "WvW":
    [
        {
            "Name": "Trebuchet Blueprints",
            "Rarity": "Basic", "Icon": "http://wiki.guildwars2.com/images/3/32/Trebuchet_Blueprints.png",
            "Price": 2,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Catapult Blueprints (2)",
            "Rarity": "Basic", "Icon": "http://wiki.guildwars2.com/images/e/ec/Catapult_Blueprints.png",
            "Price": 2,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Ballista Blueprints (3)",
            "Rarity": "Basic", "Icon": "http://wiki.guildwars2.com/images/4/41/Ballista_Blueprints.png",
            "Price": 2,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Flame Ram Blueprints (4)",
            "Rarity": "Basic", "Icon": "http://wiki.guildwars2.com/images/c/ca/Flame_Ram_Blueprints.png",
            "Price": 2,
            "Base": 0,
            "Ecto": 0
        },
        {
            "Name": "Arrow Cart Blueprints (4)",
            "Rarity": "Basic", "Icon": "http://wiki.guildwars2.com/images/5/5b/Arrow_Cart_Blueprints.png",
            "Price": 2,
            "Base": 0,
            "Ecto": 0
        }
    ],
    "Living World Season 1 Rewards":
    [
        {
            "Name": "Living World Season 1 Reward",
            "Rarity": "Exotic", "Icon": "http://wiki.guildwars2.com/images/b/b6/Hot_Air_Balloon_Souvenir.png",
            "Price": 25,
            "Base": 150000,
            "Ecto": 0
        }
    ]
};
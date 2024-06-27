$("#StartButton").click(function() {
    // alert("Done")
    window.location.href = window.location.href + "login"

})

var SettingsOpen = false;
var OpenTab = 1;
var hostname = window.location.href.split("/")[0] + "//" + window.location.href.split("/")[2];
var CurrentSettings = {

  "Theme":1,
  "Font":1,
  "Background": 3 

}

var Settings = [
    [
      {
        "gradient": 1,
        "ActualBackground":"rgb(200, 200, 200), white 80%, rgb(185, 185, 185)",
        "Background":"white,white",
        "Text":"Pdf",
        "Color":"black",
        "Font":"Montserrat",
        "border":"black",
        "ButtonBg":"#FFE3B8",
        "ButtonColor":"black",
        "ButtonBorder":"black"
      },
      {
        "gradient":1,
        "ActualBackground":"#cfb896, #FFE3B8 80%, #cfb896",
        "Background":"#FFE3B8,#FFE3B8",
        "Text":"Archaic",
        "Color":"black",
        "Font":"Montserrat",
        "border":"black",
        "ButtonBg":"white",
        "ButtonColor":"black",
        "ButtonBorder":"black"
      },
      {
        "gradient":1,
        "ActualBackground":"#2A2A2A,#2A2A2A 80%, #2A2A2A",
        "Background":"#2A2A2A,#2A2A2A",
        "Text":"Night",
        "Color":"#FFD260",
        "Font":"Montserrat",
        "border":"#FFD260",
        "ButtonBg":"#FFD260",
        "ButtonColor":"rgb(42,42,42)",
        "ButtonBorder":"#FFD260"
      },
      {
        "gradient":1,
        "ActualBackground":"#2A2A2A,#2A2A2A 80%, #2A2A2A",
        "Background":"#2A2A2A,#2A2A2A",
        "Text":"Filler",
        "Color":"#FFD260",
        "Font":"Montserrat",
        "border":"#FFD260",
        "ButtonBg":"#FFD260",
        "ButtonColor":"rgb(42,42,42)",
        "ButtonBorder":"#FFD260"
      }
      
    ],
    [
      {
        "gradient":1,
        "Background":"#6F0000,#200122",
        "Text":"Horror",
        "Font":"Montserrat",
        "Color":"White"
      },
      {
        "gradient":1,
        "Background":"#FFFFFF,#076585",
        "Text":"Optimism",
        "Font":"Montserrat",
        "Color":"Black"
      },
      {
        "gradient":1,
        "Background":"#FFB88C,#DE6262",
        "Text":"Sunset",
        "Font":"Montserrat",
        "Color":"White"
      },
      {
        "gradient":1,
        "Background":"#6441A5,#2A0845",
        "Text":"Mystery",
        "Font":"Montserrat",
        "Color":"White"
      }
    ],
    [
  
      {
  
        "Font":"Montserrat",
        "Text":"Font",
        "Size":"1.05vw",
        "Weight":"normal",
        "Color":"Black"
  
      },
      {
        
        "Font":"Bad Script",
        "Text":"Font",
        "Size":"1.2vw",
        "Weight":"normal",
        "Color":"Black"
  
      },
      {
        
        "Font":"Moon Dance",
        "Text":"Font",
        "Size":"1.3vw",
        "Weight":"bolder",
        "Color":"Black"
  
      },
      {
        
        "Font":"New Rocker",
        "Size":"1.15vw",
        "Text":"Font",
        "Weight":"normal",
        "Color":"Black"
  
      }
  
  
    ]
  ]



//============Gets the settings
window.addEventListener("load", function () {
    UpdateSettings();
  });
  
//===Settings Events

$(".Tab").click(function(event) {

    tabs = $(".Tab").get();
    for (var i = 0; i < tabs.length;i++) {
      if (tabs[i].id == event.target.id) {
        OpenTab = i;
        tabs[i].style.boxShadow = "rgba(255, 255, 255, 1) 0px 3px 0px 0px";
        var options = $(".Option").get();
        console.log(options)
        for (var j = 0; j < options.length;j++) {
          var CurrentOption = Settings[i][j];
          //This case works only for font family options
          if (i == 2) {
            CurrentOption["gradient"] = 1; 
            CurrentOption["Background"] = Settings[0][CurrentSettings["Theme"]]["Background"];
            CurrentOption["Color"] = Settings[0][CurrentSettings["Theme"]]["Color"];
  
          }
          //deletes one if it's the first Tab
          if (i == 0) {
  
            options[3].style.display = "none";
  
          }else {
  
            options[3].style.display = "block";
  
          }
          options[j].style.color = CurrentOption["Color"];
          //Checks if the background is a gradient or not;
          if (CurrentOption["gradient"] == 1) {
  
            options[j].style.background = "linear-gradient(to right," + CurrentOption["Background"] + ")";
  
          }else {
            options[j].style.background = CurrentOption["Background"];
  
  
          }
          options[j].style.fontFamily = CurrentOption["Font"];
          options[j].innerHTML = CurrentOption["Text"];
  
        }
  
      }else {
  
        tabs[i].style.boxShadow = "inset rgba(117, 117, 117, 0.668) 0px -5px 5px 0px";
  
      }
  
    }
  
  }) 
  
  
  $(".NavBar").click(function() {
    if (SettingsOpen) {
  
      $(".Form").css("z-index","2");
      $(".Redirect").css("z-index","1");
      SettingsOpen = false;
      $(".NavBar img").css("transform","rotateZ(0deg)");
      $(".SettingsDiv").css("margin-left","150vw");
  
    }else {
  
      $(".Form").css("z-index","0");
      $(".Redirect").css("z-index","0");
      SettingsOpen = true;
      $(".NavBar img").css("transform","rotateZ(180deg)");
      $(".SettingsDiv").css("margin-left","0");
  
    }
  
  })
  
  
$(".Submit").click(function() {

  $(".Form").css("background",Settings[0][CurrentSettings["Theme"]]["ActualBackground"].split(",")[2]);

});



$(".Option").click(function() {
    //============Update CurrentTheme
    var i = OpenTab;
    var j = $(this).attr("id")[3];

    if (i == 0) {
        $(".Form").css("background",Settings[i][j]["Background"].split(",")[0]);
        $(".Form").css("border","1px solid " + Settings[i][j]["border"]);
        $(".Form").css("color",Settings[i][j]["Color"]);
        $(".Input").css("color",Settings[i][j]["Color"]);
        $(".Submit").css("color",Settings[i][j]["Color"]);
        $(".Redirect").css("background",Settings[i][j]["Background"].split(",")[0]);
        $(".Redirect").css("border","1px solid " + Settings[i][j]["border"]);
        $(".Redirect").css("color",Settings[i][j]["Color"]);
        CurrentSettings["Theme"] = parseInt(j);
    }else if (i == 1) {

        $("body").css("background","linear-gradient(to bottom," + Settings[i][j]["Background"] + ")");
        CurrentSettings["Background"] = parseInt(j);

    }else {

        $(".Form").css("font-family",Settings[i][j]["Font"]);
        $(".Form").css("font-weight",Settings[i][j]["Weight"]);
        $(".Redirect").css("font-family",Settings[i][j]["Font"]);
        $(".Redirect").css("font-weight",Settings[i][j]["Weight"]);
        CurrentSettings["Font"] = parseInt(j);

    }
    ChangeSettings();
});

async function ChangeSettings() {
    var response = await fetch(hostname + "/uiSettings", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(CurrentSettings),
    });
    var data = await response.json()
    if (!data['success']) {

        console.log("something went wrong");

    }
  };
  
async function UpdateSettings() {

    fetch(hostname + "/uiSettings")
    .then((response) => {

        if (!response.ok) {

            console.error("Something went wrong, GET request to Settings");

        }else {

            return response.json();

        }

    })
    .then((data) => {

        CurrentSettings = data;
        //============Changing the theme
        console.log(CurrentSettings);
        $(".Form").css("background",Settings[0][CurrentSettings["Theme"]]["Background"].split(",")[0]);
        $(".Form").css("border","1px solid " + Settings[0][CurrentSettings["Theme"]]["border"]);
        $(".Form").css("color",Settings[0][CurrentSettings["Theme"]]["Color"]);
        $(".Input").css("color",Settings[0][CurrentSettings["Theme"]]["Color"]);
        $(".Submit").css("color",Settings[0][CurrentSettings["Theme"]]["Color"]);
        $(".Redirect").css("background",Settings[0][CurrentSettings["Theme"]]["Background"].split(",")[0]);
        $(".Redirect").css("border","1px solid " + Settings[0][CurrentSettings["Theme"]]["border"]);
        $(".Redirect").css("color",Settings[0][CurrentSettings["Theme"]]["Color"]);
        
        //=============Changing the background
        $("body").css("background","linear-gradient(to bottom," + Settings[1][CurrentSettings["Background"]]["Background"] + ")");

        //=============Changing the font
        $(".Form").css("font-family",Settings[2][CurrentSettings["Font"]]["Font"]);
        $(".Form").css("font-weight",Settings[2][CurrentSettings["Font"]]["Weight"]);
        $(".Redirect").css("font-family",Settings[2][CurrentSettings["Font"]]["Font"]);
        $(".Redirect").css("font-weight",Settings[2][CurrentSettings["Font"]]["Weight"]);

    })

}
  
$(".StartButton").click(function() {
    fetch(hostname + "/reset", {

      headers : {

        "Access-Control-Allow-Origin":"*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET, POST",
        "Access-Control-Allow-Headers": "Content-Type, Accept"

      }

    })
          .then( (response) => {

              if (!response.ok) {

                console.error(response.ok);

              } else {
                console.log(response);
                return response.json()

              }
            
          })
          .then((data) => {
            //Resets then sends data
            console.log(data)
            if (data["status"] != "Successful") {

              console.error("Error in server side : " + data["status"]);

            } else {
              const socket = io();
              var file = $(".FileInput").get(0).files[0]
              var name = (file ? file.name : "-1");
              var NameList = name.split(".");
              var extension = NameList[NameList.length - 1];
              if (extension == "doc") {
        
                extension = "docx";
        
              }
              // console.log(extension);
              if (name == "-1" || extension != CurrentInput) {
        
                $(".File").html("Please provide the selected input type");
                $(".File").css("border","1px solid red");
                $(".File").css("font-size","1.2rem");
          
              } else {
                if (extension == "docx") {
                  // console.log(extension)
                  socket.emit("upload_word", file, (status) => {
        
                    console.log("File Uploaded Successfully : " + status);
                    // window.location.href = window.location.href + "Book"
        
                  });
        
                } else if (extension == "txt") {
        
                  socket.emit("upload_txt", file, () => {
                    
                    console.log("File Uploaded Successfully : ");
        
                  });
        
        
                } else {
        
                  socket.emit("upload_pdf", file, () => {
                    
                    console.log("File Uploaded Successfully : " );
                    // window.location.href = window.location.href + "Book"
        
                  });
        
                }
        
              }
          
              
          
              socket.on('upload_successful', (message) => {
                  // console.log(message);
                  window.location.href = hostname + "/Book";
                  
          
              });
              socket.on('upload_error', (message) => {
          
                  alert("Something went wrong : " + message);
          
              });

            }
            
    })
    
})

var SettingsOpen = false;
var OpenTab = 1;
var CurrentInput = "pdf";
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
        "ActualBackground":"#969696, white 80%, rgb(185, 185, 185)",
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
        "ActualBackground":"#0E0E0E,#2A2A2A 80%, #2A2A2A",
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
      SettingsOpen = false;
      $(".StartButton").css("z-index","2");
      $(".NavBar img").css("transform","rotateZ(0deg)");
      $(".SettingsDiv").css("margin-left","150vw");
  
    }else {
  
      SettingsOpen = true;
      $(".StartButton").css("z-index","0");
      $(".NavBar img").css("transform","rotateZ(180deg)");
      $(".SettingsDiv").css("margin-left","0");
  
    }
  
  })
  
$(".InputDiv li").hover(
  (event) => {event.target.style.color = "black";}, 
  (event) => {event.target.style.color = Settings[0][CurrentSettings["Theme"]]["Color"];}
);
  
$(".Option").click(function() {
    //============Update CurrentTheme
    var i = OpenTab;
    var j = $(this).attr("id")[3];

    if (i == 0) {
        $(".Left").css("background","linear-gradient( to right," + Settings[i][j]["ActualBackground"] + ")");
        $(".Right").css("background","linear-gradient( to left," + Settings[i][j]["ActualBackground"] + ")");
        $(".Left").css("border","1px solid " + Settings[i][j]["border"]);
        $(".Right").css("border","1px solid " + Settings[i][j]["border"]);
        $(".Left p").css("color",Settings[i][j]["Color"]);
        $(".Right p").css("color",Settings[i][j]["Color"]);
        $(".BoxContainer button").css("background",Settings[i][j]["ActualBackground"].split(",")[0]);
        $(".BoxContainer button").css("border","1px solid " + Settings[i][j]["border"]);
        $(".BoxContainer button").css("color",Settings[i][j]["Color"]);
        $(".StartButton ").css("background",Settings[i][j]["Background"].split(",")[0]);
        $(".StartButton ").css("border","1px solid " + Settings[i][j]["border"]);
        $(".StartButton ").css("color",Settings[i][j]["Color"]);
        $(".ChangeTheme ").css("background",Settings[i][j]["Background"].split(",")[0]);
        $(".ChangeTheme ").css("border","1px solid " + Settings[i][j]["border"]);
        $(".ChangeTheme ").css("color",Settings[i][j]["Color"]);
        $(".ChangeTheme a ").css("color",Settings[i][j]["Color"]);
        CurrentSettings["Theme"] = parseInt(j);
    }else if (i == 1) {

        $("body").css("background","linear-gradient(to bottom," + Settings[i][j]["Background"] + ")");
        CurrentSettings["Background"] = parseInt(j);

    }else {

        $(".Page").css("font-family",Settings[i][j]["Font"]);
        $(".Page").css("font-size",Settings[i][j]["Size"]);
        $(".Page").css("font-weight",Settings[i][j]["Weight"]);
        $(".BoxContainer button").css("font-family",Settings[i][j]["Font"]);
        $(".BoxContainer button").css("font-weight",Settings[i][j]["Weight"]);
        CurrentSettings["Font"] = parseInt(j);

    }
    ChangeSettings();
});


//============Logging out
$(".Logout").click(function() {

  window.location.href = hostname + "/logout"

})



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
        $(".Left").css("background","linear-gradient( to right," + Settings[0][CurrentSettings["Theme"]]["ActualBackground"] + ")");
        $(".Right").css("background","linear-gradient( to left," + Settings[0][CurrentSettings["Theme"]]["ActualBackground"] + ")");
        $(".Left").css("border","1px solid " + Settings[0][CurrentSettings["Theme"]]["border"]);
        $(".Right").css("border","1px solid " + Settings[0][CurrentSettings["Theme"]]["border"]);
        $(".Left p").css("color",Settings[0][CurrentSettings["Theme"]]["Color"]);
        $(".Right p").css("color",Settings[0][CurrentSettings["Theme"]]["Color"]);
        $(".BoxContainer button").css("background",Settings[0][CurrentSettings["Theme"]]["ActualBackground"].split(",")[0]);
        $(".BoxContainer button").css("border","1px solid " + Settings[0][CurrentSettings["Theme"]]["border"]);
        $(".BoxContainer button").css("color",Settings[0][CurrentSettings["Theme"]]["Color"]);
        $(".StartButton ").css("background",Settings[0][CurrentSettings["Theme"]]["Background"].split(",")[0]);
        $(".StartButton ").css("border","1px solid " + Settings[0][CurrentSettings["Theme"]]["border"]);
        $(".StartButton ").css("color",Settings[0][CurrentSettings["Theme"]]["Color"]);
        $(".ChangeTheme ").css("background",Settings[0][CurrentSettings["Theme"]]["Background"].split(",")[0]);
        $(".ChangeTheme ").css("border","1px solid " + Settings[0][CurrentSettings["Theme"]]["border"]);
        $(".ChangeTheme ").css("color",Settings[0][CurrentSettings["Theme"]]["Color"]);
        $(".ChangeTheme a ").css("color",Settings[0][CurrentSettings["Theme"]]["Color"]);
        
        //=============Changing the background
        $("body").css("background","linear-gradient(to bottom," + Settings[1][CurrentSettings["Background"]]["Background"] + ")");

        //=============Changing the font
        $(".Page").css("font-family",Settings[2][CurrentSettings["Font"]]["Font"]);
        $(".Page").css("font-size",Settings[2][CurrentSettings["Font"]]["Size"]);
        $(".Page").css("font-weight",Settings[2][CurrentSettings["Font"]]["Weight"]);
        $(".BoxContainer button").css("font-family",Settings[2][CurrentSettings["Font"]]["Font"]);
        $(".BoxContainer button").css("font-weight",Settings[2][CurrentSettings["Font"]]["Weight"]);

    })

}
  
//======================= File/Text Input Handling Stuff=======================//
$(".FileInput").change(function() {

  var file = $(".FileInput").get(0).files[0]
  var name = (file ? file.name : "Select a file");
  $(".File").html(name);
  $(".File").css("font-size","1.2rem");

})

//========= File Input Button
$(".File").click(function() {

  $(".FileInput").get(0).click();

})
//============handling Input
$(".ChangeTheme li").click(function(event) {

  var type = event.target.id; 
  CurrentInput = type;
  // console.log(Settings[0][CurrentSettings["Theme"]]["Color"]);
  $(".File").css("border","1px solid " + Settings[0][CurrentSettings["Theme"]]["Color"]);
  $(".File").css("font-size","1.5rem");
  $(".File").html("Select a file");
  $(".Text").css("border","1px solid " + Settings[0][CurrentSettings["Theme"]]["Color"]);
  $(".Text").css("font-size","1.5rem");
  $(".Text").attr("placeholder","Type the title of your story");
  $(".File").css("display","block");
  $(".Text").css("display","none");

  


})


//========== Previous Book Stuff ============//
$(".Previous").click(function() {

  window.location.href = hostname + "/Book";

})
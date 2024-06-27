var PagesContent = ["", ""];
var Pages = $(".Page");
var WordsPerPage = [0, 0];
var MaxWordPerPage = 190;
var Paragraphs = $(".Page p");
var Absolutes = $(".absoluteLeft");
var done = false;
var hostname = window.location.href.split("/")[0] + "//" + window.location.href.split("/")[2];
var LoadingColor = "#3fa5ff";
var LoadingBorder = "#9dd1ff";
var Cursors = [
  document.getElementById("Cursor0"),
  0,
  0,
  document.getElementById("Cursor3"),
];

//z-index issue
var SettingsOpen = false;
var OpenTab = 1;
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
      "border":"rgb(185, 185, 185)",
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
      "border":"#cfb896",
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
var CurrentPage = 0;
var TypingSpeed = 50;
var TurnPage = false;

//Make Choice Functionality
//Navbar

//============Gets the starting text
window.addEventListener("load", function () {
  UpdateSettings();
  $(".ChoiceContainer").hide();
  $(".ButtonDiv").hide();
  GetInitial();
});


function GetInitial() {
  fetch(hostname + "/initial")
    .then((response) => {
      if (!response.ok) {
        console.error("Error Occured");
      } else {
        return response.json();
      }
    })
    .then((data) => {
      // console.log(data);
      Process(data);
    });
}

//==========Takes data then splits to chunks in PagesContent and writes the chunks to the pages
function Process(data) {
    var FirstWords = WordsPerPage[CurrentPage];
    var SecondWords = WordsPerPage[CurrentPage + 1];
    var TextWord = data["text"].split(" ");
    var index = CurrentPage;
    for (let i = 0; i < TextWord.length; i++) {
        TextWord[i] = DOMPurify.sanitize(TextWord[i]);
        if (WordsPerPage[index] >= MaxWordPerPage - 1) {
            while (WordsPerPage[index] >= MaxWordPerPage - 1) {
                index++;
                if (index > PagesContent.length - 1) {
                    PagesContent.push("");
                    WordsPerPage.push(0);
                }
            }
        }
        WordsPerPage[index]++;
        PagesContent[index] += TextWord[i] + " ";
    }
    if (PagesContent.length % 2 == 1) {
        PagesContent.push("");
        WordsPerPage.push(0);
    }
    WordsPerPage[index]++;
    WritePage(FirstWords, SecondWords);
}

// ========= Writes a chunk of the text to the page
function WritePage(PageWords, Page2Words) {
    $(".ButtonDiv").hide();
    var words = PagesContent[CurrentPage].split(" ");
    var words2 = PagesContent[CurrentPage + 1].split(" ");
    var CurrentText = Paragraphs[0].innerHTML.trim();
    var i = PageWords;
    var CurrentText2 = Paragraphs[3].innerHTML.trim();
    var i2 = Page2Words;
    // console.log(i + " - " + i2);
    var id = setInterval(function () {
        if (TurnPage) {
            TurnPage = false;
            Paragraphs[3].innerHTML = PagesContent[CurrentPage + 1];
            clearInterval(id);
        } else {
          // console.log("Indices : " + i + " - " + i2 + " | Pages : " + words.length + " - " + words2.length);
          if (i < words.length) {
                  CurrentText += " " + words[i];
                  Paragraphs[0].innerHTML = CurrentText;
                  i++;
          } else {
                  if (i2 < words2.length) {
                      CurrentText2 += " " + words2[i2];
                      Paragraphs[3].innerHTML = CurrentText2;
                      i2++;
                  } else {
                      if (CurrentPage == PagesContent.length - 2) {
                          if (WordsPerPage[CurrentPage] < MaxWordPerPage - 30) {
                              $(".absoluteLeft .ButtonDiv").show();
                          } else {
                              $(".absoluteRight .ButtonDiv").show();
                          }
                      }
                      clearInterval(id);
                  }
          }
        }
    }, TypingSpeed);
}

//=============Turning Pages
function Backward() {
    Paragraphs[2].innerHTML = Paragraphs[3].innerHTML;
    Paragraphs[1].innerHTML = Paragraphs[0].innerHTML;
    Pages[3].style.width = "0%";
    Pages[1].style.width = "100%";
    Absolutes[1].style = "grid";
    CurrentPage -= 2;
    TurnPage = true;
    var CurrentWidth = 100;
    $(".ButtonDiv").hide();
    //Preprocessing

    // console.log(CurrentPage);
    Paragraphs[0].innerHTML = PagesContent[CurrentPage];
    Paragraphs[3].innerHTML = PagesContent[CurrentPage + 1];
    var SecondWidth = 0;
    var Id = setInterval(function () {
        if (CurrentWidth >= 0) {
            Pages[1].style.width = CurrentWidth + "%";
            CurrentWidth -= 5;
        } else {
            setTimeout(function () {
                if (SecondWidth <= 100) {
                    Pages[3].style.width = SecondWidth + "%";
                    SecondWidth += 5;
                } else {
                    Absolutes[1].style.display = "none";
                    clearInterval(Id);
                    TurnPage = false;
                }
            }, 100);
        }
    }, 0.5);
}

function Forward() {
    TurnPage = true;
    var CurrentWidth = 100;
    CurrentPage += 2;
    Paragraphs[1].innerHTML = PagesContent[CurrentPage];
    Paragraphs[2].innerHTML = PagesContent[CurrentPage + 1];
    var SecondWidth = 0;
    var Id = setInterval(function () {
        if (CurrentWidth >= 0) {
            Pages[3].style.width = CurrentWidth + "%";
            CurrentWidth -= 5;
        } else {
            Absolutes[1].style.display = "grid";
            setTimeout(function () {
                if (SecondWidth <= 100) {
                    Pages[1].style.width = SecondWidth + "%";
                    SecondWidth += 5;
                } else {
                    setTimeout(function () {
                        Paragraphs[0].innerHTML = PagesContent[CurrentPage];
                        Paragraphs[3].innerHTML = PagesContent[CurrentPage + 1];
                        Pages[3].style.width = "100%";
                        Pages[1].style.width = "0%";
                        Absolutes[1].style.display = "none";
                        if (CurrentPage == PagesContent.length - 2) {
                            if (WordsPerPage[CurrentPage] < MaxWordPerPage - 30) {
                                $(".absoluteLeft .ButtonDiv").show();
                            } else {
                                $(".absoluteRight .ButtonDiv").show();
                            }
                        TurnPage = false;
                        }
                    }, 300);
                    clearInterval(Id);
                    }
            }, 100);
        }
    }, 1);
}


//======Loading Animation
function Toggle(button, on) {
  if (!on) {
    button.style.boxShadow = LoadingColor + " 0px 0px 30px 15px";
    button.style.color = "white";
    button.style.background = LoadingColor;
    button.style.border = "1px solid " + LoadingBorder;
  } else {
    button.style.boxShadow = LoadingColor + " 0px 0px 0px 0px";
    button.style.color = Settings[0][CurrentSettings["Theme"]]["ButtonColor"];
    button.style.background = Settings[0][CurrentSettings["Theme"]]["ButtonBg"];
    button.style.border = "1px solid " + Settings[0][CurrentSettings["Theme"]]["ButtonBorder"];
  }
  if (!done) {
    setTimeout(() => {
      Toggle(button, !on);
    }, 1000);
  } else {
    button.style.boxShadow = "";
    $(".Choice").prop("disabled", false);
    button.innerHTML = "Make a Choice";
    button.style.boxShadow = "";
    button.style.color = Settings[0][CurrentSettings["Theme"]]["ButtonColor"];
    button.style.background = Settings[0][CurrentSettings["Theme"]]["ButtonBg"];
    button.style.border = "1px solid " + Settings[0][CurrentSettings["Theme"]]["ButtonBorder"];
  }
}





//=============Book Events
$("#LeftBtn").click(function () {
  if (CurrentPage != 0) {
    Backward();
  }
});
$("#RightBtn").click(function () {
  if (CurrentPage != PagesContent.length - 2) {
    Forward();
  }
});

//Getting the plots
$(".Choice").click(function (event) {
  done = false;
  $(".Choice").prop("disabled", true);
  var button = event.target;
  button.innerHTML = "Creating Plots...";
  $(".Choice").css("z-index","0");
  setTimeout(() => {
    Toggle(event.target, false);
  }, 1000);
  // console.log("Request Sent");
  fetch(hostname + "/getPlots")
    .then((response) => {
      if (!response.ok) {
        console.error("Error Occured");
        LoadingColor = "rgba(255, 70, 70, 0.751)";
        LoadingBorder = "rgba(255, 200, 200, 1)";
      } else {
        return response.json();
      }
    })
    .then((data) => {
      console.log("Received plots : " + data["plots"]);
      var reg = / \*\*.*\*\*.* /;
      const plots = data["plots"].filter(value => reg.test(value));
      if (plots.length == 0) {
        var counter = 0;
        var reqs = 0;
        for (var k = 0; k < data["plots"].length;k++) {
          if (data["plots"][k].trim() != "") {
            // console.log("found a string")
            fetch(hostname + "/getTitle", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ plot: data["plots"][k] })
            })
            .then((response) => {

              if (!response.ok) {

                console.error("Error getting title : " + response.status);
                LoadingColor = "rgba(255, 70, 70, 0.751)";
                LoadingBorder = "rgba(255, 200, 200, 1)";

              } else {

                return response.json()

              }

            })
            .then((titles) => {

              plots.push(titles["title"]);
              console.log(counter);
              reqs++;
              if (reqs == 2) {

                console.log(plots);
                ProccessPlots(plots,button);

              }
              
            })
            counter++;
          }
          if (counter == 2) {
  
            break;
  
          }
        }

      } else {

        ProccessPlots(plots,button);

      }
      
      
      //   Process(data);
    });
});

function ProccessPlots(plots,button) {

  if (plots.length != 0) {

    done = true;
    button.innerHTML = "Make a Choice";
    $(".Choice").prop("disabled", false);
    $("#0").html(plots[0].split("**")[1].split(":")[0]);
    $("#1").html(plots[1].split("**")[1].split(":")[0]);
    $(".ChoiceContainer").show();

  } else {

    console.error("Empty plots arrays");
    LoadingColor = "rgba(255, 70, 70, 0.751)";
    LoadingBorder = "rgba(255, 200, 200, 1)";

  }

}


//Exit Choice Mode
$(".ChoiceContainer").click(function () {
  $(".ChoiceContainer").hide();
  $(".Choice").css("z-index","2");
});


//Developing Plots
$(".ChoiceButton").click(function (event) {
  $(".Choice").prop("disabled", true);
  var button;
  if (!$(".absoluteLeft .Choice").is(":hidden")) {
    button = $(".absoluteLeft .Choice")[0];
  } else {
    button = $(".absoluteRight .Choice")[0];
  }
  done = false;
  button.innerHTML = "Writing The Plot...";
  setTimeout(() => {
    Toggle(button, false);
  }, 1000);
  (async () => {
    const rawResponse = await fetch(hostname + "/develop", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ choice: parseInt(event.target.id) }),
    })
    .catch(function(error) {

      console.error(error);
      LoadingColor = "rgba(255, 70, 70, 0.751)";
      LoadingBorder = "rgba(255, 200, 200, 1)"

    });
    try {

      const content = await rawResponse.json();
      done = true;
      Process(content);

    } catch (error) {
      
      console.log(error);
      LoadingColor = "rgba(255, 70, 70, 0.751)";
      LoadingBorder = "rgba(255, 200, 200, 1)"

    }
    
  })();
});



//===Settings Events

$(".Tab").click(function(event) {

  tabs = $(".Tab").get();
  for (var i = 0; i < tabs.length;i++) {

    if (tabs[i].id == event.target.id) {
      console.log(tabs[i].id + " - " + event.target.id);
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
    setTimeout(function() {

      $(".Choice").css("z-index","2");

    },100)
    $(".NavBar img").css("transform","rotateZ(0deg)");
    $(".SettingsDiv").css("margin-left","150vw");

  }else {

    SettingsOpen = true;
    $(".Choice").css("z-index","0");
    $(".NavBar img").css("transform","rotateZ(180deg)");
    $(".SettingsDiv").css("margin-left","0");

  }

})



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
      $(".BoxContainer button").css("background",Settings[i][j]["Background"].split(",")[0]);
      $(".BoxContainer button").css("border","1px solid " + Settings[i][j]["Color"]);
      $(".BoxContainer button").css("color",Settings[i][j]["Color"]);
      $(".Choice ").css("background",Settings[i][j]["ButtonBg"]);
      $(".Choice ").css("border","1px solid " + Settings[i][j]["ButtonBorder"]);
      $(".Choice").css("color",Settings[i][j]["ButtonColor"]);
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

//=============Download an epub
$(".Download").click(function() {
  const text = PagesContent.join(" ");
  var percent = 30;
  $(".Download").css("width","100%");
  $(".Download").html("Looking for a title...");
  $(".Options").css("background","linear-gradient(to right,rgb(0, 171, 0) " + percent + "%,white " + percent + "%)");
  $(".Option").css("border","1px solid white");
  $(".Download").prop("disabled",true);
  fetch(hostname + "/getTitle", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ plot: "" })
  })
  .then((response) => {

    if (!response.ok) {
      
      console.error("Error getting title : " + response.status);
      LoadingColor = "rgba(255, 70, 70, 0.751)";
      LoadingBorder = "rgba(255, 200, 200, 1)";

    } else {

      return response.json()

    }

  })
  .then((titles) => {
    // console.log(titles["title"])
    percent = 60;
    $(".Download").html("Generating Document...");
    $(".Options").css("background","linear-gradient(to right,rgb(0, 171, 0) " + percent + "%,white " + percent + "%)");
    try  {
      var title = titles["title"].split("**")[1];
      const doc = new docx.Document({
        title: titles["title"],
        sections: [
          {
            properties: {
            },
            children: [
              new docx.Paragraph({
                text: title,
                heading: docx.HeadingLevel.HEADING_1
            }),
            new docx.Paragraph({
              text: "\n\n"
            }),
            new docx.Paragraph({
              text: "\n\n"
            }),
              new docx.Paragraph({
                children: [
                  new docx.TextRun( "\n\n" + text)
                ]
              })
            ]
          }
        ]
      });
      docx.Packer.toBlob(doc).then((blob) => {
      percent = 100;
      $(".Options").css("background","linear-gradient(to right,rgb(0, 171, 0) " + percent + "%,white " + percent + "%)");
        saveAs(blob, title + ".docx");
        console.log("Document created successfully");
        setTimeout(function() {
  
          percent = 0;
          $(".Download").html("Download");
          $(".Option").css("border","1px solid black");
          $(".Download").html("Download");
          $(".Download").css("width","50%");
          $(".Download").prop("disabled",false);
          $(".Options").css("background","linear-gradient(to right,rgb(0, 171, 0) " + percent + "%,white " + percent + "%)");
  
        },500)
      });
    } catch (error) {

      
      $(".Options").css("background","linear-gradient(to right, rgba(255, 70, 70, 1)" + percent + "%,white " + percent + "%)");

    }
  })
  .catch((error) => {

    console.error("Error getting title : " + error);
    LoadingColor = "rgba(255, 70, 70, 0.751)";
    LoadingBorder = "rgba(255, 200, 200, 1)";

  })




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
    // console.log("Got Data");
      CurrentSettings = data;
      //============Changing the theme
      $(".Left").css("background","linear-gradient( to right," + Settings[0][CurrentSettings["Theme"]]["ActualBackground"] + ")");
      $(".Right").css("background","linear-gradient( to left," + Settings[0][CurrentSettings["Theme"]]["ActualBackground"] + ")");
      $(".Left").css("border","1px solid " + Settings[0][CurrentSettings["Theme"]]["border"]);
      $(".Right").css("border","1px solid " + Settings[0][CurrentSettings["Theme"]]["border"]);
      $(".Left p").css("color",Settings[0][CurrentSettings["Theme"]]["Color"]);
      $(".Right p").css("color",Settings[0][CurrentSettings["Theme"]]["Color"]);
      $(".BoxContainer button").css("background",Settings[0][CurrentSettings["Theme"]]["Background"].split(",")[0]);
      $(".BoxContainer button").css("border","1px solid " + Settings[0][CurrentSettings["Theme"]]["Color"]);
      $(".BoxContainer button").css("color",Settings[0][CurrentSettings["Theme"]]["Color"]);
      $(".Choice ").css("background",Settings[0][CurrentSettings["Theme"]]["ButtonBg"]);
      $(".Choice ").css("border","1px solid " + Settings[0][CurrentSettings["Theme"]]["ButtonBorder"]);
      $(".Choice ").css("color",Settings[0][CurrentSettings["Theme"]]["ButtonColor"]);
      
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


//============ Reset Book Functionality ================//
$(".Reset").click(function() {
  fetch(hostname + "/reset")
  .then(() => {

    window.location.href = hostname + "/";

  })
  .catch(() => {

    console.error("Error Reseting : " + error);
    LoadingColor = "rgba(255, 70, 70, 0.751)";
    LoadingBorder = "rgba(255, 200, 200, 1)";

  })

}) 
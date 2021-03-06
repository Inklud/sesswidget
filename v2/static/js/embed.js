if (!botcolor) {
  var botcolor = "#1976d2";
}

// SVG Icons
sendbot =
  '<svg style="margin-top: -2.5px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="undefined ns-fill-0" fill="' +
  botcolor +
  '" width="25" height="25"> <path d="M3.4 20.4l17.45-7.48a1 1 0 0 0 0-1.84L3.4 3.6a.993.993 0 0 0-1.39.91L2 9.12c0 .5.37.93.87.99L17 12L2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z"/></svg>';
closebot =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="undefined ns-fill-0" fill="#ffffff" width="25" height="25"> <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"/></svg>';
refreshbot =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="undefined ns-fill-0" fill="#ffffff" width="25" height="25"> <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>';
minimizebot =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 11.5 24 17" class="undefined ns-fill-0" fill="#ffffff" width="40" height="25"> <path d="M6 19h12v2H6v-2z"/></svg>';

function loadjscssfile(filename, filetype) {
  if (filetype == "js") {
    //if filename is a external JavaScript file
    var fileref = document.createElement("script");
    fileref.setAttribute("type", "text/javascript");
    fileref.setAttribute("src", filename);
  } else if (filetype == "css") {
    //if filename is an external CSS file
    var fileref = document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", filename);
  }
  if (typeof fileref != "undefined")
    document.getElementsByTagName("head")[0].appendChild(fileref);
}

loadjscssfile(
  "https://widget.chatbotui.com/v2/static/js/materialize.min.js",
  "js"
); //dynamically load and add this .js file
loadjscssfile("https://widget.chatbotui.com/v2/static/css/style.css", "css"); //dynamically load and add this .css file

setTimeout(() => {
  document.body.insertAdjacentHTML(
    "beforeEnd",
    '<div class="widget" tabindex="0" id="widget"><div class="chat_header" style="background: ' +
      botcolor +
      '"><span class="chat_header_title">' +
      botname +
      '</span><span class="dropdown-trigger" href="#" data-target="dropdown1"><a href="#" id="minimize" style="padding-right: 5px; style="color: #fff" >' +
      minimizebot +
      '</a><a href="#" id="restart" style="padding-right: 2.5px; color: #fff" >' +
      refreshbot +
      '</a > <a href="#" id="close" style="color: #fff" >' +
      closebot +
      '</a > </span> <ul id="dropdown1" class="dropdown-content"> </ul> </div> <div class="chats" id="chats"> <div class="clearfix"></div> </div><div id="chat-footer"><div class="keypad"> <textarea id="userInput" placeholder="Type a message..." class="usrInput" ></textarea> <div id="sendButton" tabindex="0">' +
      sendbot +
      '</div> </div></div></div><div class="profile_div" id="profile_div" role="button" tabindex="0"><img class="imgProfile" alt="open chat" src = "' +
      botphoto +
      '" /></div >'
  );

  document.addEventListener("DOMContentLoaded", function () {
    var elemsTap = document.querySelector(".tap-target");
    var instancesTap = M.TapTarget.init(elemsTap, {});
    instancesTap.open();
    setTimeout(function () {
      instancesTap.close();
    }, 4000);
  });

  var widget = document.getElementById("profile_div");
  widget.onkeyup = function keyPress(e) {
    wkey = e.which ? e.which : window.event.keyCode;
    if (wkey == 13) hello();
    if (wkey == 32) hello();

    function hello() {
      $(".profile_div").toggle();
      $(".widget").toggle();
      $(".widget").focus();
    }
  };

  //initialization
  $(document).ready(function () {
    //Bot pop-up intro
    $("div").removeClass("tap-target-origin");

    //drop down menu for close, restart conversation & clear the chats.
    $(".dropdown-trigger").dropdown();

    //initiate the modal for displaying the charts, if you dont have charts, then you comment the below line
    $(".modal").modal();

    //enable this if u have configured the bot to start the conversation.
    // showBotTyping();
    // $("#userInput").prop('disabled', true);

    //global variables
    action_name = "action_greet_user";
    user_id = "jitesh97";

    //if you want the bot to start the conversation
    action_trigger();
  });

  // ========================== restart conversation ========================
  function restartConversation() {
    $("#userInput").prop("disabled", true);
    //destroy the existing chart
    $(".collapsible").remove();

    if (typeof chatChart !== "undefined") {
      chatChart.destroy();
    }

    $(".chart-container").remove();
    if (typeof modalChart !== "undefined") {
      modalChart.destroy();
    }
    $(".chats").html("");
    $(".usrInput").val("");
    send("/restart");
  }

  // ========================== let the bot start the conversation ========================
  function action_trigger() {
    // send an event to the bot, so that bot can start the conversation by greeting the user
    $.ajax({
      url: webhook,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        name: action_name,
        policy: "MappingPolicy",
        confidence: "0.98",
      }),
      success: function (botResponse, status) {
        console.log("Response from Rasa: ", botResponse, "\nStatus: ", status);

        setBotResponse(botResponse);

        if (botResponse.hasOwnProperty("messages")) {
          setBotResponse(botResponse.messages);
        }
        $("#userInput").prop("disabled", false);
      },
      error: function (xhr, textStatus, errorThrown) {
        // if there is no response from rasa server
        setBotResponse("");
        console.log("Error from bot end: ", textStatus);
        $("#userInput").prop("disabled", false);
      },
    });
  }

  //=====================================	user enter or sends the message =====================
  $(".usrInput").on("keyup keypress", function (e) {
    var keyCode = e.keyCode || e.which;

    var text = $(".usrInput").val();
    if (keyCode === 13) {
      if (text == "" || $.trim(text) == "") {
        e.preventDefault();
        return false;
      } else {
        //destroy the existing chart, if yu are not using charts, then comment the below lines
        $(".collapsible").remove();
        if (typeof chatChart !== "undefined") {
          chatChart.destroy();
        }

        $(".chart-container").remove();
        if (typeof modalChart !== "undefined") {
          modalChart.destroy();
        }
        $("#paginated_cards").remove();
        $(".suggestions").remove();
        $(".quickReplies").remove();
        $(".usrInput").blur();
        setUserResponse(text);
        send(text);
        e.preventDefault();
        return false;
      }
    }
  });

  var sendButton = document.getElementById("sendButton");
  sendButton.onkeyup = function keyPress(e) {
    wkey = e.which ? e.which : window.event.keyCode;
    if (wkey == 13) pressSend();
    if (wkey == 32) pressSend();

    function pressSend() {
      var text = $(".usrInput").val();
      if (text == "" || $.trim(text) == "") {
        e.preventDefault();
        return false;
      } else {
        //destroy the existing chart

        /* chatChart.destroy();
      $(".chart-container").remove();
      if (typeof modalChart !== "undefined") {
        modalChart.destroy();
      }*/

        $(".suggestions").remove();
        $("#paginated_cards").remove();
        $(".quickReplies").remove();
        $(".usrInput").blur();
        setUserResponse(text);
        send(text);
        e.preventDefault();
        return false;
      }
    }
  };

  //Send message function to send message the conversation.
  $("#sendButton").on("click", function (e) {
    var text = $(".usrInput").val();
    if (text == "" || $.trim(text) == "") {
      e.preventDefault();
      return false;
    } else {
      //destroy the existing chart

      /* chatChart.destroy();
      $(".chart-container").remove();
      if (typeof modalChart !== "undefined") {
        modalChart.destroy();
      }*/

      $(".suggestions").remove();
      $("#paginated_cards").remove();
      $(".quickReplies").remove();
      $(".usrInput").blur();
      setUserResponse(text);
      send(text);
      e.preventDefault();
      return false;
    }
  });

  //==================================== Set user response =====================================
  /*    
  Removed from User response
  '<img class="userAvatar" src=' +
      "./static/img/userAvatar.jpg" +
      '>
  */
  function setUserResponse(message) {
    var UserResponse =
      '<p class="userMsg" tabindex="0" style="background: ' +
      botcolor +
      '">' +
      message +
      ' </p><div class="clearfix"></div>';
    $(UserResponse).appendTo(".chats").show("slow");

    $(".usrInput").val("");
    scrollToBottomOfResults();
    showBotTyping();
    $(".suggestions").remove();
  }

  //=========== Scroll to the bottom of the chats after new message has been added to chat ======
  function scrollToBottomOfResults() {
    var terminalResultsDiv = document.getElementById("chats");
    terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;
  }

  //============== send the user message to rasa server =============================================
  function send(message) {
    $.ajax({
      url: webhook,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ message: message, sender: user_id }),
      success: function (botResponse, status) {
        console.log("Response from Rasa: ", botResponse, "\nStatus: ", status);

        // if user wants to restart the chat and clear the existing chat contents
        if (message.toLowerCase() == "/restart") {
          $("#userInput").prop("disabled", false);

          //if you want the bot to start the conversation after restart
          action_trigger();
          return;
        }
        setBotResponse(botResponse);
      },
      error: function (xhr, textStatus, errorThrown) {
        if (message.toLowerCase() == "/restart") {
          // $("#userInput").prop('disabled', false);
          //if you want the bot to start the conversation after the restart action.
          // action_trigger();
          // return;
        }

        // if there is no response from rasa server
        setBotResponse("");
        console.log("Error from bot end: ", textStatus);
      },
    });
  }

  //=================== set bot response in the chats ===========================================
  function setBotResponse(response) {
    //display bot response after 500 milliseconds
    setTimeout(function () {
      hideBotTyping();
      if (response.length < 1) {
        //if there is no response from Rasa, send  fallback message to the user
        var fallbackMsg = "I am facing some issues, please try again later!!!";

        var BotResponse =
          '<img class="botAvatar" src="' +
          botphoto +
          '"/><p class="botMsg">' +
          fallbackMsg +
          '</p><div class="clearfix"></div>';

        $(BotResponse).appendTo(".chats").hide().fadeIn(1000);
        scrollToBottomOfResults();
      } else {
        //if we get response from Rasa
        for (i = 0; i < response.length; i++) {
          //check if the response contains "text"
          if (response[i].hasOwnProperty("text")) {
            var BotResponse =
              '<img class="botAvatar" alt="" role=”presentation” src="' +
              botphoto +
              '"/><p tabindex="0" aria-live="polite" class="botMsg">' +
              response[i].text +
              '</p><div class="clearfix"></div>';
            $(BotResponse).appendTo(".chats").hide().fadeIn(1000);
          }

          //check if the response contains "images"
          if (response[i].hasOwnProperty("image")) {
            var BotResponse =
              '<div class="singleCard">' +
              '<img class="imgcard" src="' +
              response[i].image +
              '">' +
              '</div><div class="clearfix">';
            $(BotResponse).appendTo(".chats").hide().fadeIn(1000);
          }

          //check if the response contains "buttons"
          if (response[i].hasOwnProperty("buttons")) {
            addSuggestion(response[i].buttons);
          }

          //check if the response contains "attachment"
          if (response[i].hasOwnProperty("attachment")) {
            //check if the attachment type is "video"
            if (response[i].attachment.type == "video") {
              video_url = response[i].attachment.payload.src;

              var BotResponse =
                '<div class="video-container"> <iframe src="' +
                video_url +
                '" frameborder="0" allowfullscreen></iframe> </div>';
              $(BotResponse).appendTo(".chats").hide().fadeIn(1000);
            }
          }
          //check if the response contains "custom" message
          if (response[i].hasOwnProperty("custom")) {
            //check if the custom payload type is "quickReplies"
            if (response[i].custom.payload == "quickReplies") {
              quickRepliesData = response[i].custom.data;
              showQuickReplies(quickRepliesData);
              return;
            }

            //check if the custom payload type is "pdf_attachment"
            if (response[i].custom.payload == "pdf_attachment") {
              renderPdfAttachment(response[i]);
              return;
            }

            //check if the custom payload type is "dropDown"
            if (response[i].custom.payload == "dropDown") {
              dropDownData = response[i].custom.data;
              renderDropDwon(dropDownData);
              return;
            }

            //check if the custom payload type is "location"
            if (response[i].custom.payload == "location") {
              $("#userInput").prop("disabled", true);
              getLocation();
              scrollToBottomOfResults();
              return;
            }

            //check if the custom payload type is "cardsCarousel"
            if (response[i].custom.payload == "cardsCarousel") {
              restaurantsData = response[i].custom.data;
              showCardsCarousel(restaurantsData);
              return;
            }

            //check if the custom payload type is "chart"
            if (response[i].custom.payload == "chart") {
              // sample format of the charts data:
              // var chartData = { "title": "Leaves", "labels": ["Sick Leave", "Casual Leave", "Earned Leave", "Flexi Leave"], "backgroundColor": ["#36a2eb", "#ffcd56", "#ff6384", "#009688", "#c45850"], "chartsData": [5, 10, 22, 3], "chartType": "pie", "displayLegend": "true" }

              //store the below parameters as global variable,
              // so that it can be used while displaying the charts in modal.
              chartData = response[i].custom.data;
              title = chartData.title;
              labels = chartData.labels;
              backgroundColor = chartData.backgroundColor;
              chartsData = chartData.chartsData;
              chartType = chartData.chartType;
              displayLegend = chartData.displayLegend;

              // pass the above variable to createChart function
              createChart(
                title,
                labels,
                backgroundColor,
                chartsData,
                chartType,
                displayLegend
              );
              return;
            }

            //check of the custom payload type is "collapsible"
            if (response[i].custom.payload == "collapsible") {
              data = response[i].custom.data;
              //pass the data variable to createCollapsible function
              createCollapsible(data);
            }
          }
        }
        scrollToBottomOfResults();
      }
    }, 500);
  }

  //====================================== Toggle chatbot =======================================
  $("#profile_div").click(function () {
    $(".profile_div").toggle();
    $(".widget").toggle();
  });

  //====================================== Render Pdf attachment =======================================
  function renderPdfAttachment(data) {
    pdf_url = data.custom.url;
    pdf_title = data.custom.title;
    pdf_attachment =
      '<div class="pdf_attachment">' +
      '<div class="row">' +
      '<div class="col s3 pdf_icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="undefined ns-fill-0" fill="#ffffff" width="25" height="25"><path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v1.25c0 .41-.34.75-.75.75s-.75-.34-.75-.75V8c0-.55.45-1 1-1H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2c-.28 0-.5-.22-.5-.5v-5c0-.28.22-.5.5-.5h2c.83 0 1.5.67 1.5 1.5v3zm4-3.75c0 .41-.34.75-.75.75H19v1h.75c.41 0 .75.34.75.75s-.34.75-.75.75H19v1.25c0 .41-.34.75-.75.75s-.75-.34-.75-.75V8c0-.55.45-1 1-1h1.25c.41 0 .75.34.75.75zM9 9.5h1v-1H9v1zM3 6c-.55 0-1 .45-1 1v13c0 1.1.9 2 2 2h13c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1-.45-1-1V7c0-.55-.45-1-1-1zm11 5.5h1v-3h-1v3z"/></svg></div>' +
      '<div class="col s9 pdf_link">' +
      '<a href="' +
      pdf_url +
      '" target="_blank">' +
      pdf_title +
      " </a>" +
      "</div>" +
      "</div>" +
      "</div>";
    $(".chats").append(pdf_attachment);
    scrollToBottomOfResults();
  }

  //====================================== DropDown ==================================================
  //render the dropdown messageand handle user selection
  function renderDropDwon(data) {
    var options = "";
    for (i = 0; i < data.length; i++) {
      options +=
        '<option value="' + data[i].value + '">' + data[i].label + "</option>";
    }
    var select =
      '<div class="dropDownMsg"><select class="browser-default dropDownSelect"> <option value="" disabled selected>Choose your option</option>' +
      options +
      "</select></div>";
    $(".chats").append(select);
    scrollToBottomOfResults();

    //add event handler if user selects a option.
    $("select").change(function () {
      var value = "";
      var label = "";
      $("select option:selected").each(function () {
        label += $(this).text();
        value += $(this).val();
      });

      setUserResponse(label);
      send(value);
      $(".dropDownMsg").remove();
    });
  }

  //====================================== Suggestions ===========================================

  function addSuggestion(textToAdd) {
    setTimeout(function () {
      var suggestions = textToAdd;
      var suggLength = textToAdd.length;
      $(
        ' <div class="singleCard"> <div class="suggestions"><div class="menu"></div></div></diV>'
      )
        .appendTo(".chats")
        .hide()
        .fadeIn(1000);
      // Loop through suggestions
      for (i = 0; i < suggLength; i++) {
        $(
          '<div class="menuChips" data-payload=\'' +
            suggestions[i].payload +
            "'>" +
            suggestions[i].title +
            "</div>"
        ).appendTo(".menu");
      }
      scrollToBottomOfResults();
    }, 1000);
  }

  // on click of suggestions, get the value and send to rasa
  $(document).on("click", ".menu .menuChips", function () {
    var text = this.innerText;
    var payload = this.getAttribute("data-payload");
    console.log("payload: ", this.getAttribute("data-payload"));
    setUserResponse(text);
    send(payload);

    //delete the suggestions once user click on it
    $(".suggestions").remove();
  });

  //====================================== functions for drop-down menu of the bot  =========================================

  //restart function to restart the conversation.
  $("#restart").click(function () {
    restartConversation();
  });

  var restartchataction = document.getElementById("restart");
  restartchataction.onkeyup = function keyPress(e) {
    wkey = e.which ? e.which : window.event.keyCode;
    if (wkey == 13) restartchataction();
    if (wkey == 32) restartchataction();

    function restartchataction() {
      restartConversation();
      $(".widget").focus();
    }
  };

  //clear function to clear the chat contents of the widget.
  $("#clear").click(function () {
    $(".chats").fadeOut("normal", function () {
      $(".chats").html("");
      $(".chats").fadeIn();
    });
  });

  //close function to close the widget.
  $("#close").click(function () {
    $(".profile_div").toggle();
    $(".widget").toggle();
    scrollToBottomOfResults();
  });

  var closechataction = document.getElementById("close");
  closechataction.onkeyup = function keyPress(e) {
    wkey = e.which ? e.which : window.event.keyCode;
    if (wkey == 13) closechataction();
    if (wkey == 32) closechataction();

    function closechataction() {
      $(".profile_div").toggle();
      $(".widget").toggle();
      scrollToBottomOfResults();
    }
  };

  //minimize function to minimize the widget.
  $("#minimize").click(function () {
    $(".profile_div").toggle();
    $(".widget").toggle();
    scrollToBottomOfResults();
  });

  var minimizechataction = document.getElementById("minimize");
  minimizechataction.onkeyup = function keyPress(e) {
    wkey = e.which ? e.which : window.event.keyCode;
    if (wkey == 13) minimizechataction();
    if (wkey == 32) minimizechataction();

    function minimizechataction() {
      $(".profile_div").toggle();
      $(".widget").toggle();
      scrollToBottomOfResults();
    }
  };

  //====================================== Cards Carousel =========================================

  function showCardsCarousel(cardsToAdd) {
    var cards = createCardsCarousel(cardsToAdd);

    $(cards).appendTo(".chats").show();

    if (cardsToAdd.length <= 2) {
      $(".cards_scroller>div.carousel_cards:nth-of-type(" + i + ")").fadeIn(
        3000
      );
    } else {
      for (var i = 0; i < cardsToAdd.length; i++) {
        $(".cards_scroller>div.carousel_cards:nth-of-type(" + i + ")").fadeIn(
          3000
        );
      }
      $(".cards .arrow.prev").fadeIn("3000");
      $(".cards .arrow.next").fadeIn("3000");
    }

    scrollToBottomOfResults();

    const card = document.querySelector("#paginated_cards");
    const card_scroller = card.querySelector(".cards_scroller");
    var card_item_size = 225;

    card
      .querySelector(".arrow.next")
      .addEventListener("click", scrollToNextPage);
    card
      .querySelector(".arrow.prev")
      .addEventListener("click", scrollToPrevPage);

    // For paginated scrolling, simply scroll the card one item in the given
    // direction and let css scroll snaping handle the specific alignment.
    function scrollToNextPage() {
      card_scroller.scrollBy(card_item_size, 0);
    }

    function scrollToPrevPage() {
      card_scroller.scrollBy(-card_item_size, 0);
    }
  }

  function createCardsCarousel(cardsData) {
    var cards = "";

    for (i = 0; i < cardsData.length; i++) {
      title = cardsData[i].name;
      ratings = Math.round((cardsData[i].ratings / 5) * 100) + "%";
      data = cardsData[i];
      item =
        '<div class="carousel_cards in-left">' +
        '<img class="cardBackgroundImage" src="' +
        cardsData[i].image +
        '"><div class="cardFooter">' +
        '<span class="cardTitle" title="' +
        title +
        '">' +
        title +
        "</span> " +
        '<div class="cardDescription">' +
        '<div class="stars-outer">' +
        '<div class="stars-inner" style="width:' +
        ratings +
        '" ></div>' +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>";

      cards += item;
    }

    var cardContents =
      '<div id="paginated_cards" class="cards"> <div class="cards_scroller">' +
      cards +
      '  <span class="arrow prev fa fa-chevron-circle-left "></span> <span class="arrow next fa fa-chevron-circle-right" ></span> </div> </div>';

    return cardContents;
  }

  //====================================== Quick Replies ==================================================

  function showQuickReplies(quickRepliesData) {
    var chips = "";
    for (i = 0; i < quickRepliesData.length; i++) {
      var chip =
        '<div class="chip" data-payload=\'' +
        quickRepliesData[i].payload +
        "'>" +
        quickRepliesData[i].title +
        "</div>";
      chips += chip;
    }

    var quickReplies =
      '<div class="quickReplies">' +
      chips +
      '</div><div class="clearfix"></div>';
    $(quickReplies).appendTo(".chats").fadeIn(1000);
    scrollToBottomOfResults();
    const slider = document.querySelector(".quickReplies");
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener("mousedown", (e) => {
      isDown = true;
      slider.classList.add("active");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener("mouseleave", () => {
      isDown = false;
      slider.classList.remove("active");
    });
    slider.addEventListener("mouseup", () => {
      isDown = false;
      slider.classList.remove("active");
    });
    slider.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 3; //scroll-fast
      slider.scrollLeft = scrollLeft - walk;
    });
  }

  // on click of quickreplies, get the value and send to rasa
  $(document).on("click", ".quickReplies .chip", function () {
    var text = this.innerText;
    var payload = this.getAttribute("data-payload");
    console.log("chip payload: ", this.getAttribute("data-payload"));
    setUserResponse(text);
    send(payload);

    //delete the quickreplies
    $(".quickReplies").remove();
  });

  //====================================== Get User Location ==================================================
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        getUserPosition,
        handleLocationAccessError
      );
    } else {
      response = "Geolocation is not supported by this browser.";
    }
  }

  function getUserPosition(position) {
    response =
      "Latitude: " +
      position.coords.latitude +
      " Longitude: " +
      position.coords.longitude;
    console.log("location: ", response);

    //here you add the intent which you want to trigger
    response =
      '/inform{"latitude":' +
      position.coords.latitude +
      ',"longitude":' +
      position.coords.longitude +
      "}";
    $("#userInput").prop("disabled", false);
    send(response);
    showBotTyping();
  }

  function handleLocationAccessError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.log("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        console.log("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        console.log("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        console.log("An unknown error occurred.");
        break;
    }

    response = '/inform{"user_location":"deny"}';
    send(response);
    showBotTyping();
    $(".usrInput").val("");
    $("#userInput").prop("disabled", false);
  }

  //======================================bot typing animation ======================================
  function showBotTyping() {
    var botTyping =
      '<img class="botAvatar" id="botAvatar" src="' +
      botphoto +
      '"/><div class="botTyping">' +
      '<div class="bounce1"></div>' +
      '<div class="bounce2"></div>' +
      '<div class="bounce3"></div>' +
      "</div>";
    $(botTyping).appendTo(".chats");
    $(".botTyping").show();
    scrollToBottomOfResults();
  }

  function hideBotTyping() {
    $("#botAvatar").remove();
    $(".botTyping").remove();
  }

  //====================================== Collapsible =========================================

  // function to create collapsible,
  // for more info refer:https://materializecss.com/collapsible.html
  function createCollapsible(data) {
    //sample data format:
    //var data=[{"title":"abc","description":"xyz"},{"title":"pqr","description":"jkl"}]
    list = "";
    for (i = 0; i < data.length; i++) {
      item =
        "<li>" +
        '<div class="collapsible-header">' +
        data[i].title +
        "</div>" +
        '<div class="collapsible-body"><span>' +
        data[i].description +
        "</span></div>" +
        "</li>";
      list += item;
    }
    var contents = '<ul class="collapsible">' + list + "</uL>";
    $(contents).appendTo(".chats");

    // initialize the collapsible
    $(".collapsible").collapsible();
    scrollToBottomOfResults();
  }

  //====================================== creating Charts ======================================

  //function to create the charts & render it to the canvas
  function createChart(
    title,
    labels,
    backgroundColor,
    chartsData,
    chartType,
    displayLegend
  ) {
    //create the ".chart-container" div that will render the charts in canvas as required by charts.js,
    // for more info. refer: https://www.chartjs.org/docs/latest/getting-started/usage.html
    var html =
      '<div class="chart-container"> <span class="modal-trigger" id="expand" title="expand" href="#modal1"><i class="fa fa-external-link" aria-hidden="true"></i></span> <canvas id="chat-chart" ></canvas> </div> <div class="clearfix"></div>';
    $(html).appendTo(".chats");

    //create the context that will draw the charts over the canvas in the ".chart-container" div
    var ctx = $("#chat-chart");

    // Once you have the element or context, instantiate the chart-type by passing the configuration,
    //for more info. refer: https://www.chartjs.org/docs/latest/configuration/
    var data = {
      labels: labels,
      datasets: [
        {
          label: title,
          backgroundColor: backgroundColor,
          data: chartsData,
          fill: false,
        },
      ],
    };
    var options = {
      title: {
        display: true,
        text: title,
      },
      layout: {
        padding: {
          left: 5,
          right: 0,
          top: 0,
          bottom: 0,
        },
      },
      legend: {
        display: displayLegend,
        position: "right",
        labels: {
          boxWidth: 5,
          fontSize: 10,
        },
      },
    };

    //draw the chart by passing the configuration
    chatChart = new Chart(ctx, {
      type: chartType,
      data: data,
      options: options,
    });

    scrollToBottomOfResults();
  }

  // on click of expand button, get the chart data from gloabl variable & render it to modal
  $(document).on("click", "#expand", function () {
    //the parameters are declared gloabally while we get the charts data from rasa.
    createChartinModal(
      title,
      labels,
      backgroundColor,
      chartsData,
      chartType,
      displayLegend
    );
  });

  //function to render the charts in the modal
  function createChartinModal(
    title,
    labels,
    backgroundColor,
    chartsData,
    chartType,
    displayLegend
  ) {
    //if you want to display the charts in modal, make sure you have configured the modal in index.html
    //create the context that will draw the charts over the canvas in the "#modal-chart" div of the modal
    var ctx = $("#modal-chart");

    // Once you have the element or context, instantiate the chart-type by passing the configuration,
    //for more info. refer: https://www.chartjs.org/docs/latest/configuration/
    var data = {
      labels: labels,
      datasets: [
        {
          label: title,
          backgroundColor: backgroundColor,
          data: chartsData,
          fill: false,
        },
      ],
    };
    var options = {
      title: {
        display: true,
        text: title,
      },
      layout: {
        padding: {
          left: 5,
          right: 0,
          top: 0,
          bottom: 0,
        },
      },
      legend: {
        display: displayLegend,
        position: "right",
      },
    };

    modalChart = new Chart(ctx, {
      type: chartType,
      data: data,
      options: options,
    });
  }
}, 200);

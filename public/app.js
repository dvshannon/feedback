// Grab the feed as a json
$.getJSON("/feed", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $(".feed").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
  });
  
  
  // Whenever someone clicks a p tag
  $(document).on("click", "p", function() {
    // Empty the summary from the summary section
    $("#summary").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the summary information to the page
      .then(function(data) {
        console.log(data);
        // The title of the article
        $("#summary").append("<h2>" + data.title + "</h2>");
        // An input to enter a new title
        $("#summary").append("<input id='titleinput' name='title' >");
        // A textarea to add a new summary body
        $("#summary").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new summary, with the id of the article saved to it
        $("#summary").append("<button data-id='" + data._id + "' id='savesummary'>Save Summary</button>");
  
        // If there's a summary in the article
        if (data.summary) {
          // Place the title of the summary in the title input
          $("#titleinput").val(data.summary.title);
          // Place the body of the summary in the body textarea
          $("#bodyinput").val(data.summary.body);
        }
      });
  });
  
  // When you click the savesummary button
  $(document).on("click", "#savesummary", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the summary, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from summary textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the summary section
        $("#summary").empty();
      });
  
    // Also, remove the values entered in the input and textarea for summary entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  
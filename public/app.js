
const displayHeadlines = () => {
  $("tbody").empty();
  $.getJSON("/all", (data) => {
    data.forEach((headline) => {
    let headlineDiv = $(`<div class='row border'>`).append(
      $(`<div class='col title-text'>`).text(`${headline.title}`),
      $(`<div class='col summery'>`).text(`${headline.summery}`),
      $(`<div class='col headlineLink'>`).append($(`<a href=${headline.link}>`).text(`Link to the story`))
    );
    $("#placeHeadlines").append(headlineDiv);
  });
});
}

displayHeadlines();

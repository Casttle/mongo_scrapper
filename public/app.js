
const displayHeadlines = () => {

  $.getJSON("/all", (data) => {
    data.forEach((headline) => {
    const headlineDiv = $(`<div class="row border">`).append(
      $(`<div class="col title-text">`).text(`${headline.title}`),
      $(`<div class="col summery">`).text(`${headline.summery}`),
      $(`<div class="col headlineLink">`).append($(`<a href=${headline.link}>`).text(`Link to the story`))
        .append($(`<button class="commentButton btn btn-success" data-toggle="modal" data-target="#exampleModalCenter" data-id=${headline._id}>`).text(`Comment`))
    );
    $(`#placeHeadlines`).append(headlineDiv);
  });
});
}

displayHeadlines();

// Click the Scrape button to get the latest headlines
$(document).on("click", "#scrapeButton", () => {
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
  .then((data) => {
    location.reload();
  });
});


$(document).on("click", ".commentButton", () => {
  $(".modal-body").empty();
  
  const thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: `/headline/${thisId}`
  })
    .then((data) => {
      console.log(data);
      // The title of the article
      $(`#exampleModalLongTitle`).text(data.title);

      if (data.comment) {
        data.comment.forEach((comments) => {
          $(`.modal-body`).append(
            $(`<div>`).text(comments.title),
            $(`<div>`).text(comments.body),
            $(`<button type="button" class="btn btn-danger" id=${thisId}>`).text("X")
            );
        });
      }
    });
});
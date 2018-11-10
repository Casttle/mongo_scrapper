
const displayHeadlines = () => {
  $("tbody").empty();
  $.getJSON("/all", (data) => {
    data.forEach((headline) => {
    const tr = $("<tr>").append(
      $("<td>").text(headline.title),
      $("<td>").text(headline.link),
      $("<td>").text(headline.summery)
    );
    $("tbody").append(tr);
  });
});
}

displayHeadlines();

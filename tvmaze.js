/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  const res = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`)
  console.log(res)
  const showArray = []
  const shows = res.data
  for (let show of shows){
    const showObj = {}
    showObj.id = show.show.id
    showObj.name = show.show.name
    showObj.summary = show.show.summary
    showObj.image = show.show.image.original
    showArray.push(showObj)
  }
  return showArray
  // console.log(showArray)
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
           <img class="card-img-top" src="${show.image}" alt="">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-primary get-episodes">Get Episodes!</button>
             </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
  // document.querySelector('#search-query').value = ''
  $('#search-query').val("")
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above
  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes?specials=1`)
  // console.log(res.data)
  const episodesArray = []
  const episodes = res.data
  for (let epi of episodes){
    const episodesObj = {}
    episodesObj.id = epi.id
    episodesObj.name = epi.name
    episodesObj.season = epi.season
    episodesObj.number = epi.number
    episodesArray.push(episodesObj)
  }
  return episodesArray
  // console.log(episodesArray)
}

function populateEpisodes(episodes){
  // const $episodeslist = $("#episodes-list")
  for (let epi of episodes){
    const li = $("<li id=lis >")
    // $("#lis").append(`${epi.id}, Name: ${epi.name}, Season: ${epi.season}, Number: ${epi.number}`)
    let e = (`${epi.id}, Name: ${epi.name}, Season: ${epi.season}, Number: ${epi.number}`)
    li.append(e)
    $("#episodes-list").append(li)
  }
  $("#episodes-area").show();

}


$("#shows-list").on("click", ".get-episodes", async function handleEpisodeClick(evt) {
  evt.preventDefault();
  let showId = $(evt.target).closest(".Show").data("show-id");
  let episodes = await getEpisodes(showId);
  populateEpisodes(episodes);
})
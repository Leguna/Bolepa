// Perlu diperhatikan.
var base_url = "https://api.football-data.org/v2/";
var api_key = "0338a414e6af4743975a626b0656bc9b";
var requestOption = { headers: { 'X-Auth-Token': api_key } };

function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}
function json(response) {
  return response.json();
}
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}
function toLocalTime(time) {
  var date = new Date(time);
  return date.toString().slice(0, 24);
}

function renderMatches(matches, saved = false) {
  var matchesHTML = "";
  if (!saved)
    matches = matches.matches;

  matches.forEach(function (match) {
    matchesHTML += `<div class="card s12" style="margin:16px">`
    matchesHTML += saved ? `<a href="./match.html?id=${match.id}&saved=true">` : `<a href="./match.html?id=${match.id}">`
    matchesHTML += `<div class="card-content grey-text">
                      <div style="border-bottom: solid;">
                          <span class="card-title truncate black-text center-align">${match.homeTeam.name || "-"} vs ${match.awayTeam.name || "-"}</span>
                          <span class="card-title truncate black-text center-align" style="font-weight: bold;">${match.score.fullTime.homeTeam || 0} : ${match.score.fullTime.awayTeam || 0}</span>
                      </div>
                      <div class="row">
                          <div class="col s6">
                              <h6>League</h6>
                              <p style="margin-left: 5px;" class="black-text">${match.competition.name}</p>
                              <h6>Status</h6>
                              <p style="margin-left: 5px;" class="black-text">${match.status}</p>
                          </div>
                          <div class="col s6">
                              <h6>Match Day</h6>
                              <p style="margin-left: 5px;" class="black-text">${match.matchday}</p>
                              <h6>Area</h6>
                              <p style="margin-left: 5px;" class="black-text">${match.competition.area.name}</p>
                          </div>
                      </div>
                  </div>
              </a>
          </div>
        `;
  });
  document.getElementById("matches").innerHTML = matchesHTML;
}

function renderMatchById(match, saved = false) {
  console.log(match)
  var matchHTML = `
  <div class="card s12" style="margin:16px">
    <div class="card-content grey-text">
          <div style="border-bottom: solid;">
              <span class="card-title truncate black-text center-align">${match.homeTeam.name} vs ${match.awayTeam.name}</span>
              <span class="card-title truncate black-text center-align" style="font-weight: bold;">${match.score.fullTime.homeTeam || 0} : ${match.score.fullTime.awayTeam || 0}</span>
          </div>
          <div class="row">
              <div class="col s6">
                  <h6>League</h6>
                  <p style="margin-left: 5px;" class="black-text">${match.competition.name}</p>
                  <h6>Status</h6>
                  <p style="margin-left: 5px;" class="black-text">${match.status}</p>
              </div>
              <div class="col s6">
                  <h6>Match Day</h6>
                  <p style="margin-left: 5px;" class="black-text">${match.matchday}</p>
                  <h6>Area</h6>
                  <p style="margin-left: 5px;" class="black-text">${match.competition.area.name}</p>
              </div>
              <div class="col s6">
                  <h6>Venue</h6>
                  <p style="margin-left: 5px;" class="black-text">${match.venue}</p>
                  <h6>Group</h6>
                  <p style="margin-left: 5px;" class="black-text">${match.group}</p>
              </div>
              <div class="col s6">
                  <h6>Referee</h6>
                  <p style="margin-left: 5px;" class="black-text">${(match.referees.length != 0) ? match.referees[0].name : '-'}</p>
                  <h6>Season Date</h6>
                  <p style="margin-left: 5px;" class="black-text">${match.season.startDate} to ${match.season.endDate}</p>
              </div >
          </div >
    </div >
  </div >
    `;
  document.getElementById("body-content").innerHTML = matchHTML;
  document.getElementById("logo-container").innerHTML = match.competition.name + " | " + toLocalTime(match.utcDate);
}

function getMatches() {
  if ("caches" in window) {
    caches.match(base_url + "matches", requestOption).then(function (response) {
      if (response) {
        response.json().then(function (data) {
          renderMatches(data);
        });
      }
    });
  }
  fetch(base_url + "matches", requestOption)
    .then(status)
    .then(json)
    .then(function (data) {
      renderMatches(data);
    })
    .catch(error);
}

function getMatchById() {
  return new Promise(function (resolve, reject) {

    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");

    if ("caches" in window) {
      caches.match(base_url + "matches/" + idParam, requestOption).then(function (response) {
        if (response) {
          response.json().then(function (data) {
            renderMatchById(data.match);
            resolve(data.match);
          });
        }
      });
    }
    fetch(base_url + "matches/" + idParam, requestOption)
      .then(status)
      .then(json)
      .then(function (data) {
        renderMatchById(data.match);
        resolve(data.match);
      });
  });
}

function getSavedMatches() {
  getAll().then(function (matches) {
    renderMatches(matches, true);
  });
}

function getSavedMatchById() {
  return new Promise(function (resolve, reject) {

    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");
    getById(idParam).then(function (match) {
      renderMatchById(match, true);
      resolve(match);
    });
  });
}
const wrapper = document.querySelectorAll(".wrapper");
const bookmarkLink = document.querySelector(".bookmark-link");
const moviesLink = document.querySelector(".movies-link");
const svgLink = document.querySelectorAll(".link-svg");
const moviesWrapper = document.querySelectorAll(".movies");
const searchInp = document.querySelectorAll(".search-input");

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzU5ZjdhN2NkMDhiNzEyYmQ4OTBjZSIsImlhdCI6MTc0ODM0NDY5OSwiZXhwIjoxNzUwOTM2Njk5fQ.CK7GrBZYutjT4NVvr6Mq0dDWS-tqYQgPEnzFIg-tlkk";
let moviesData = [];
let bookmarkedData = [];

wrapper[0].classList.add("show");
fetchMovies();

bookmarkLink.addEventListener("click", function () {
  toggleTab(1);
  fetchBookmarkedMovies();
});

moviesLink.addEventListener("click", function () {
  toggleTab(0);
  fetchMovies();
});

function toggleTab(index) {
  for (let i = 0; i < wrapper.length; i++) {
    if (i === index) {
      wrapper[i].classList.add("show");
    } else {
      wrapper[i].classList.remove("show");
    }
  }

  for (let i = 0; i < svgLink.length; i++) {
    if (i === index) {
      svgLink[i].style.fill = "white";
    } else {
      svgLink[i].style.fill = "#5A698F";
    }
  }
}

function fetchMovies() {
  fetchData(
    "https://entertainment-web-app-api-67zg.onrender.com/api/movies"
  ).then(function (data) {
    let result = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].category === "Movie") {
        result.push(data[i]);
      }
    }
    moviesData = result;
    render(moviesData, moviesWrapper[0], searchInp[0]);
  });
}

function fetchBookmarkedMovies() {
  fetchData(
    "https://entertainment-web-app-api-67zg.onrender.com/api/user/bookmarks"
  ).then(function (data) {
    let filtered = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].category === "Movie") {
        filtered.push(data[i]);
      }
    }

    let map = new Map();
    for (let i = 0; i < filtered.length; i++) {
      map.set(filtered[i]._id, filtered[i]);
    }

    let unique = Array.from(map.values());
    bookmarkedData = unique;
    render(bookmarkedData, moviesWrapper[1], searchInp[1]);
  });
}

function fetchData(url) {
  return fetch(url, { headers: { Authorization: "Bearer " + token } })
    .then(function (res) {
      return res.json();
    })
    .catch(function (err) {
      console.error("Fetch error:", err);
      return [];
    });
}

function render(data, container, input) {
  let html = "";
  for (let i = 0; i < data.length; i++) {
    html += movieCard(data[i]);
  }
  container.innerHTML = html;
  setupBookmarkButtons(data);
  setupSearch(input, data, container);
}

function movieCard(movie) {
  let img = movie.thumbnail.regular.medium;

  let booked = "";
  if (movie.isBookmarked) {
    booked = "booked-path";
  }

  return `<div class="card">
    <div class="img-side">
      <img src="${img}" alt="${movie.title}" />
      <button type="button" class="add-book" data-id="${movie._id}">
        <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path class="bookmark-path ${booked}" d="M1.05762 0.75H10.6094C10.628 0.75 10.6454 0.751403 10.6621 0.754883L10.7109 0.771484L10.7217 0.775391L10.7314 0.779297C10.7986 0.80616 10.8383 0.840443 10.8701 0.886719C10.9028 0.934312 10.917 0.977751 10.917 1.03613V12.9639C10.917 13.0222 10.9028 13.0657 10.8701 13.1133C10.8383 13.1596 10.7986 13.1938 10.7314 13.2207L10.7236 13.2236L10.7158 13.2275C10.7109 13.2296 10.6807 13.2412 10.6094 13.2412C10.5318 13.2412 10.4733 13.225 10.418 13.1885L10.3633 13.1445L6.35742 9.23438L5.83301 8.72363L5.30957 9.23438L1.30273 13.1455C1.21581 13.2264 1.14401 13.2499 1.05762 13.25C1.02036 13.25 0.987856 13.2428 0.955078 13.2285L0.945312 13.2246L0.93457 13.2207L0.852539 13.1738L0.795898 13.1133C0.76325 13.0657 0.750034 13.0222 0.75 12.9639V1.03613C0.750017 1.00715 0.753389 0.981911 0.760742 0.958008L0.795898 0.886719C0.827746 0.840293 0.867275 0.806216 0.93457 0.779297L0.945312 0.775391L0.955078 0.771484C0.971542 0.764321 0.988101 0.758351 1.00488 0.754883L1.05762 0.75Z" stroke="white" stroke-width="1.5"/>
        </svg>
      </button>
    </div>
    <div class="info-side">
      <div class="time-realease">
        <p>${movie.year}</p>
        <img src="./src/img/dot.svg" class="dot" />
        <img src="./src/img/film.svg" />
        <p>Movie</p>
        <img src="./src/img/dot.svg" class="dot" />
        <p>PG</p>
      </div>
      <h3>${movie.title}</h3>
    </div>
  </div>
`;
}

function setupBookmarkButtons(movies) {
  const buttons = document.querySelectorAll(".add-book");

  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    const id = button.getAttribute("data-id");
    const svg = button.querySelector(".bookmark-path");

    button.addEventListener("click", function () {
      const isSaved = svg.classList.contains("booked-path");

      if (isSaved) {
        svg.classList.remove("booked-path");
      } else {
        svg.classList.add("booked-path");
      }

      let link = "";
      let method = "";
      let body = null;

      if (isSaved) {
        link =
          "https://entertainment-web-app-api-67zg.onrender.com/api/user/remove_bookmark/" +
          id;
        method = "DELETE";
      } else {
        link =
          "https://entertainment-web-app-api-67zg.onrender.com/api/user/add_bookmark";
        method = "POST";
        body = JSON.stringify({ movieId: id });
      }

      fetch(link, {
        method: method,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: body,
      })
        .then(function (res) {
          return res.json();
        })
        .then(function () {
          let all = moviesData.concat(bookmarkedData);
          for (let j = 0; j < all.length; j++) {
            if (all[j]._id === id) {
              all[j].isBookmarked = !isSaved;
              break;
            }
          }

          if (wrapper[1].classList.contains("show")) {
            fetchBookmarkedMovies();
          }
        })
        .catch(function (err) {
          console.log("Ошибка при добавлении в закладки:", err);
        });
    });
  }
}

function setupSearch(input, data, container) {
  input.oninput = function () {
    const query = input.value.toLowerCase();
    let filtered = [];

    for (let i = 0; i < data.length; i++) {
      if (data[i].title.toLowerCase().indexOf(query) !== -1) {
        filtered.push(data[i]);
      }
    }

    if (filtered.length === 0) {
      container.innerHTML =
        '<div class="error"><img src="./src/img/error.svg" alt="" /><h3>404 Not Found</h3></div>';
    } else {
      let html = "";
      for (let i = 0; i < filtered.length; i++) {
        html += movieCard(filtered[i]);
      }
      container.innerHTML = html;
      setupBookmarkButtons(filtered);
    }
  };
}

const API_KEY = "85045981";
const BASE_URL = `https://www.omdbapi.com/?apikey=${API_KEY}&s=`;

const movieBox = document.querySelector("#movie-box");
const searchInput = document.querySelector("#search");
const toggleBtn = document.getElementById("theme-toggle");
const genreButtons = document.querySelectorAll(".genre");

const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const pageNumber = document.getElementById("page-number");

let currentPage = 1;
let currentQuery = "Avengers";

/* ⭐ Convert rating to stars */

function getStars(rating) {
    const numeric = parseFloat(rating);
    if (isNaN(numeric)) return "☆☆☆☆☆";

    const rounded = Math.round(numeric / 2);
    return "⭐".repeat(rounded) + "☆".repeat(5 - rounded);
}

/* 🎬 Fetch Movies */

async function getMovies(query, page = 1) {
    try {
        const res = await fetch(`${BASE_URL}${query}&page=${page}`);
        const data = await res.json();

        if (!data.Search) {
            movieBox.innerHTML = "<h2 style='margin-top:40px;'>No movies found 😕</h2>";
            return;
        }

        showMovies(data.Search);
        pageNumber.textContent = `Page ${page}`;

    } catch (err) {
        movieBox.innerHTML = "<h2 style='margin-top:40px;'>Unable to load movies 🚫</h2>";
    }
}

/* 🎬 Display Movies */

async function showMovies(movies) {
    movieBox.innerHTML = "";

    for (let movie of movies) {

        const detailRes = await fetch(
            `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`
        );
        const detailData = await detailRes.json();

        const rating = detailData.imdbRating || "0";

        const box = document.createElement("div");
        box.classList.add("box");

        box.innerHTML = `
            <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Image"}">
            <div class="overlay">
                <h2>${movie.Title}</h2>
                <div class="stars">
                    ${getStars(rating)} (${rating})
                </div>
                <h2>Year:</h2>
                <p>${movie.Year}</p>
            </div>
        `;

        movieBox.appendChild(box);
    }
}

/* 🔎 Search */

searchInput.addEventListener("keyup", e => {
    const query = e.target.value.trim();

    if (query) {
        currentQuery = query;
        currentPage = 1;
        getMovies(currentQuery, currentPage);
    }
});

/* 🎭 Genre Simulation */

genreButtons.forEach(btn => {
    btn.addEventListener("click", () => {

        genreButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const genre = btn.textContent;

        currentQuery = genre === "All" ? "Avengers" : genre;
        currentPage = 1;

        getMovies(currentQuery, currentPage);
    });
});

/* ⬅➡ Pagination */

nextBtn.addEventListener("click", () => {
    currentPage++;
    getMovies(currentQuery, currentPage);
});

prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        getMovies(currentQuery, currentPage);
    }
});

/* 🌙 Dark Mode */

toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    toggleBtn.textContent =
        document.body.classList.contains("dark") ? "☀️" : "🌙";
});

/* 🚀 Initial Load */

getMovies(currentQuery, currentPage);
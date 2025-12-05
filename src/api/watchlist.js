import axiosClient from "./axiosClient";

export function addToWatchlist(movieId) {
  return axiosClient.post("users/watchlist/add/", {
    movie_id: movieId,
  });
}

export function removeFromWatchlist(movieId) {
  return axiosClient.delete(`users/watchlist/remove/${movieId}/`);
}

export function getWatchlist() {
  return axiosClient.get("users/watchlist/");
}

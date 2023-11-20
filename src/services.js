import axios from "axios";

export const itemFetch = axios.create({
  baseURL: "https://fiap-shopping-list.vercel.app/"
});


export const api = {
  get(endpoint) {
    return itemFetch.get(endpoint);
  },
  post(endpoint, body) {
    return itemFetch.post(endpoint, body);
  },
  delete(endpoint) {
    return itemFetch.delete(endpoint);
  }
};

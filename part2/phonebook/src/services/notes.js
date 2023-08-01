import axios from 'axios';

const baseUrl = 'http://localhost:3001/api/persons';

const getAll = () =>
  axios
    .get(baseUrl)
    .then(response => response.data);

const create = newObject =>
  axios
    .post(baseUrl, newObject)
    .then(response => response.data);

const update = (id, newObject) =>
  axios
    .put(`${baseUrl}/${id}`, newObject)
    .then(response => response.data);

const del = (id) =>
  axios
    .delete(`${baseUrl}/${id}`);

const noteService = { getAll, create, update, del };

export default noteService;

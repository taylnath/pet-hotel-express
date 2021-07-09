// my attempt at modularizing a fetch POST pattern
let setLoaded;
let setError;
let error;
const postState = (url, body) => fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(body)
})
  .then(res => {
    setLoaded(true);
    return !res.ok && Promise.reject();
  })
  .catch(err => {
    setLoaded(true);
    setError(error);
  });

export default postState;

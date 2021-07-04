// my attempt at modularizing a fetch pattern
const onError = (setLoaded, setError) => (error) => {
  setLoaded(true);
  setError(error);
}

const onSuccess = (setLoaded, setResult) => (res) => {
  setLoaded(true);
  setResult(res);
}

const fetchState = (url, setLoaded, setResult, setError) => 
  fetch(url)
    .then(res => res.json())
    .then(onSuccess(setLoaded, setResult), onError(setLoaded, setError));

export default fetchState;
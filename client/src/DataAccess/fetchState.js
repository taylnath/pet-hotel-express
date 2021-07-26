// my attempt at modularizing a fetch pattern
const onError = (setState) => (error) => {
  console.error("Error in request:", error);
  setState({loading: false, error: true});
  return error;
}

const onSuccess = (setState, setResult) => (res) => {
  setState({loading: false, error: false}); // error will get set later if error
  if (!res.ok){
    console.log("Request did not return success:", res);
    return Promise.reject();
  } else if (setResult){
    console.log(res);
    return res.json()
      .then(res => {
        console.log("json here:", res);
        setResult(res);
        return res;
    });
  }
  return res;
}

const settings = (method, body) => {
  let result = {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
  };
  if (body){
    result.body = JSON.stringify(body);
  };
  return result;
};

const getState = (url, setResult, setState) => 
  fetch(url)
    // param order flip here is important
    .then(onSuccess(setState, setResult), onError(setState));

const postState = (url, body, setState) => 
  fetch(url, settings('POST', body))
    .then(onSuccess(setState), onError(setState));

const putState = (url, body, setState) => 
  fetch(url, settings('PUT', body))
    .then(onSuccess(setState), onError(setState));

const deleteState = (url, setState) => 
  fetch(url, settings('DELETE'))
    .then(onSuccess(setState), onError(setState));

export {
  getState,
  postState,
  putState,
  deleteState
}
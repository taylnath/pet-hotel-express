import { useState, useEffect } from 'react';
import settings from '../appSettings';
import fetchState from '../DataAccess/fetchState';
const serverURL = settings.serverURL;
console.log(serverURL);

// adapted from https://reactjs.org/docs/faq-ajax.html
function Login( { userType, userID }) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  // const [testResult, setTestResult] = useState(''); // state for reading text
  const [dataResult, setDataResult] = useState({}); // state for reading json from database
  useEffect(() => {
    // fetch(`${serverURL}/api/testText`)
    //     .then(res => res.text())
    //     .then(
    //         (result) => {
    //           setIsLoaded(true);
    //           setTestResult(result);
    //         },
    //         (error) => {
    //           setIsLoaded(true);
    //           setError(error);
    //         }
    //     );
    fetchState(`${serverURL}/api/logIn`, setIsDataLoaded, setDataResult, setError);
  }, []);
  
  if (error) return <div>Error: {error.message}</div>;
  else if (!isLoaded) return <div>Loading...</div>;
  else return (
        <div>
          <h1>Logged In!</h1>
          {/*<p>*/}
          {/*  The server says: {testResult}.*/}
          {/*</p>*/}
          <p>
            Here is the data: {JSON.stringify(dataResult)}.
          </p>
        </div>
    );
}

export default Login;
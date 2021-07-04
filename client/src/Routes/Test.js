import { useState, useEffect } from 'react';
import settings from '../appSettings';
const serverURL = settings.serverURL;
console.log(serverURL);

const GetData = async() => {
  const response = await fetch(`{serverURL}/api/test`);
  const text = await response.text();
  return text;
  // let testResult = await testResponse.text();
}

// adapted from https://reactjs.org/docs/faq-ajax.html
function Test() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [testResult, setTestResult] = useState('');
  useEffect(() => {
    console.log(`${serverURL}/api/test`);
    fetch(`${serverURL}/api/test`)
      .then(res => res.text())
      .then(
        (result) => {
          setIsLoaded(true);
          setTestResult(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, []);

  if (error) return <div>Error: {error.message}</div>;
  else if (!isLoaded) return <div>Loading...</div>;
  else return (
    <div>
      <h1>Test</h1>
      <p>
        The server says: {testResult}.
      </p>
    </div>
  );
}

export default Test;

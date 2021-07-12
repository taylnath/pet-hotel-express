import { useState, useEffect } from 'react';
import settings from '../appSettings';
import fetchState from '../DataAccess/fetchState';
import GenericModal from '../Components/GenericModal';
const serverURL = settings.serverURL;
console.log(serverURL);

// adapted from https://reactjs.org/docs/faq-ajax.html
function Test() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [testResult, setTestResult] = useState(''); // state for reading text
  const [dataResult, setDataResult] = useState({}); // state for reading json from database
  useEffect(() => {
    fetch(`${serverURL}/api/testText`)
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
      );
    fetchState(`${serverURL}/api/testData`, setIsDataLoaded, setDataResult, setError);
  }, []);

  const [modalVisible, setModalVisible] = useState(false);

  if (error) return <div>Error: {error.message}</div>;
  else if (!isLoaded) return <div>Loading...</div>;
  else return (
    <div>
      <h1>Test</h1>
      <p>
        The server says: {testResult}.
      </p>
      <p>
        Here is the data: {JSON.stringify(dataResult)}.
      </p>
      <button onClick={() => setModalVisible(true)}>Turn on modal</button>
      <GenericModal
        title="this is a modal"
        visible={modalVisible}
        setVisible={setModalVisible}
        action={() => console.log("modal submitted")}
      >
        <div>hi</div>
        <div>hello</div>
        <div>hey</div>
      </GenericModal>
    </div>
  );
}

export default Test;

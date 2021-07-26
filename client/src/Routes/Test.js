import { useState, useEffect } from 'react';
import {getState, postState, putState, deleteState} from "../DataAccess/fetchState";
import GenericModal from '../Components/GenericModal';
import LoadingStatus from '../Components/LoadingStatus';

// adapted from https://reactjs.org/docs/faq-ajax.html
function Test() {
  // loading status
  const [loadingStatus, setLoadingStatus] = useState({
    loading: true,
    error: false
  });
  const [testResult, setTestResult] = useState(''); // state for reading text
  const [dataResult, setDataResult] = useState({}); // state for reading json from database
  useEffect(() => {
    getState(`/api/testText`, setTestResult, setLoadingStatus);
    getState(`/api/testData`, setDataResult, setLoadingStatus);
  }, []);

  const [modalVisible, setModalVisible] = useState(false);

  if (loadingStatus.error) return <div>Error: {loadingStatus.error.message}</div>;
  else if (loadingStatus.loading) return <div>Loading...</div>;
  else return (
    <div>
      <h1>Test</h1>
          <LoadingStatus status={loadingStatus}/>
      <p>
        The server says: {testResult}.
      </p>
      <p>
        Here is the data: {JSON.stringify(dataResult)}.
      </p>
      <button onClick={() => getState(`/api/testText`, setTestResult, setLoadingStatus)}>Get data again</button>
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

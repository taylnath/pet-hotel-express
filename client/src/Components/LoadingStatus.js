import {Spinner} from 'react-bootstrap';

// loading status component: changes depending on if something is loading
// or errored out
// Props:
//  status = {
//   loading : false,
//   error: false
// }
function LoadingStatus(props){
  return (
    <div className="d-flex justify-content-center w-100">
    <Spinner animation="border" variant="primary" hidden={props.status.loading} className="ml-5 mr-1">Loading...</Spinner>
    {props.status.error && <div>There was a problem fetching data...</div>}
    </div>
  )
}

export default LoadingStatus;

import { Container, Row, Col, Card, Image } from "react-bootstrap";
import HeaderImage from '../Components/images/pet_hotel_home_main.jpeg'
import SereneCat from '../Components/images/serene_cat.jpeg'
import BlackCat from '../Components/images/black_cat.jpeg'
import HappyDog from '../Components/images/happy_dog.jpeg'

function Home() {
  return (
      <div>
      <div style={{minHeight: 500, backgroundImage: `url(${HeaderImage})`, backgroundRepeat: "no-repeat",backgroundSize: 'w-100'}}>
    <h1 style={{fontSize: 60, color: "black", padding: 5}}>Pet Hotel</h1>
      </div>
    <Container>
      <Row style={{padding: 15}}>
        <Col>
          Talk about PetHotel
        </Col>
        <Col>
          <Image src={SereneCat} style={{width: 450}} rounded />
        </Col>
      </Row>
  
      <Row>
        <Col>
          <Image src={HappyDog} style={{width: 450}} rounded />
        </Col>
        <Col>
        Talk about Rooms
        </Col>
      </Row>
  
      <Row>
        <Col>
        Talk about Pricing
        </Col>
        <Col>
          <Image src={BlackCat} style={{width: 450}} rounded />
        </Col>
      </Row>
  
      <Row>
        <Col>
          <Card>
            picture
          </Card>
        </Col>
        <Col>
        Vaccination Information
        </Col>
      </Row>
      
    </Container>
      </div>

  );
}

export default Home;
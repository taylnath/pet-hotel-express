import {Container, Row, Col, Image, Button} from "react-bootstrap";
import SereneCat from '../Components/images/serene_cat.jpeg';
import BlackCat from '../Components/images/black_cat.jpeg';
import HappyDog from '../Components/images/happy_dog.jpeg';
import MainImage from '../Components/images/pet_hotel_home_main.jpeg'
import {BsChevronCompactDown} from 'react-icons/bs';
import { HappyDogAttr, HomeMainAttr, SereneCatAttr, BlackCatAttr } from
      "../Components/images/attributions/attributions";

function Home() {
  return (
      <div>
        <Container className="home-container" fluid={true}>
          <Row>
            <Col className={"p-0"}>
              <div id={"home-showcase"} className={"mb-1"}>
                <h1 id={"home-h1"}>Pet Hotel</h1>
                {HomeMainAttr}
                <a href="#pet-hotel-info">
                  <BsChevronCompactDown 
                    className="wiggle"
                  />
                </a>
              </div>
            </Col>
          </Row>
        </Container>
        <Container>
          <Row id={"pet-hotel-info"} className={"align-items-center"}>
            <Col sm className={"p-3"}>
              <h2 className={"text-center mt-4"}>
                Luxury Lodging for Your Pet
              </h2>
              <p className={"mt-4"}>
                Pet Hotel provides a friendly home away from home for your
                pet while you are traveling. Your pet will love our plush lodging,
                and our beautiful property will become a favorite playground.
              </p>
              <p className={"mb-5"}>
                We are open 365 days a year, and our highly trained staff looks
                forward to your pet's next visit.
              </p>
              <div className={"text-center"}>
                {/* TODO: button should go to /reservations after final grade */}
              <Button variant={"success"} size={"lg"} href={"/bookings"}>
                Reserve Now
              </Button>
              </div>
            </Col>
            <Col sm className={"p-3 d-none d-sm-block"}>
              <Image src={SereneCat} className={"img-fluid"} rounded/>
              {SereneCatAttr}
            </Col>
          </Row>
          
          <Row id={"pet-amenities"} className={"align-items-center"}>
            <Col sm>
              <Image src={HappyDog} className={"img-fluid"} rounded/>
              {HappyDogAttr}
            </Col>
            <Col sm className={"p-3"}>
              <h2 className={"text-center"}>
                Our Services
              </h2>
              <p className={"mt-4"}>
                Pet Hotel offers 20 suites, each providing the finest in luxury
                pet accomodations. Your pet can will be pampered with a wide
                range of services, including playtime, grooming, and lots of hugs.
              </p>
              <p>
                Our lodging is $100 per night for any of our suites. We are an all
                inclusive resort, and there is no extra charge for any services.
              </p>
              <p>
                While we provide a comfy bed for your pet, please feel free to bring
                a pet bed or favorite toys from home
              </p>
            </Col>
          </Row>
          
          <Row id={"vaccine-requirements"} className={"align-items-center"}>
            <Col sm className={"p-3"}>
              <h3 className={"text-center"}>
                Immunizations
              </h3>
              <p className={"text-center"}>
                Please provide shot records prior to check-in.
              </p>
              <h5>
                Dog Vaccination Requirements
              </h5>

                <ul>
                  <li>Rabies</li>
                  <li>Distemper</li>
                  <li>Para-Influenza</li>
                  <li>Respiratory Bordetella</li>
                  <li>Hepatitis or Adenovirus</li>
                  <li>Lepto</li>
                  <li>Parvo</li>
                  <li>Both h3n2 and h3n8 flu virus vaccinations</li>
                </ul>

              <h5>
                Cat Vaccination Requirements
              </h5>
                <ul>
                  <li>Rabies</li>
                  <li>Feline Distemper</li>
                  <li>Feline Leukemia Virus</li>
                </ul>
            </Col>
            <Col sm>
              <Image src={BlackCat} className={"img-fluid"} rounded/>
              {BlackCatAttr}
            </Col>
          </Row>
        
        </Container>
      </div>
  
  );
}

export default Home;
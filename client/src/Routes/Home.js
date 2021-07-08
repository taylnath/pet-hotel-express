import {Container, Row, Col, Card, Image} from "react-bootstrap";
import HeaderImage from '../Components/images/pet_hotel_home_main.jpeg';
import SereneCat from '../Components/images/serene_cat.jpeg';
import BlackCat from '../Components/images/black_cat.jpeg';
import HappyDog from '../Components/images/happy_dog.jpeg';

function Home() {
  return (
      <div>
        <Container>
          <Row>
            <Col className={"p-3"}>
              <div id={"home-showcase"} className={"mb-1"}
              //      style={{
              //   minHeight: 525,
              //   backgroundImage: `url(${HeaderImage})`,
              //   backgroundRepeat: "no-repeat",
              //   backgroundSize: 'w-100'
              // }}
              >
                <h1 style={{fontSize: 72, color: "darkolivegreen", padding: 5}}>Pet Hotel</h1>
                <div id={"showcase-photo-attr"}
                    style={{position: "absolute", bottom: 20, right: 25}}>
                  Photo by <a
                    href="https://unsplash.com/@berkaygumustekin?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Berkay
                  Gumustekin</a> on <a
                    href="https://unsplash.com/s/photos/dog?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        <Container>
          <Row id={"pet-hotel-info"} className={"align-items-center"}>
            <Col className={"p-3"}>
              <h2 className={"text-center"}>
                Luxury Lodging for Your Pet
              </h2>
              <p className={"mt-4"}>
                Pet Hotel provides a friendly home away from home for your
                pet while you are traveling. Your pet will love our plush lodging,
                and our beautiful property will become a favorite playground.
              </p>
              <p>
                We are open 365 days a year, and our highly trained staff looks
                forward to your pet's next visit.
              </p>
              <p className={"mt-3"}>
                <div className={"text-center"}>
                  <a href={"./Reservations"} className={"text-decoration-none"}>Reserve Now</a>
                </div>
              </p>
            </Col>
            <Col className={"p-3"}>
              <Image src={SereneCat} className={"img-fluid"} rounded/>
              <div
                  style={{position: "absolute", bottom: 15, right: 25}}>
                Photo by <a
                  href="https://unsplash.com/@calicodesign?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Patrizia
                Berta</a> on <a
                  href="https://unsplash.com/s/photos/cat?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
              </div>
            </Col>
          </Row>
          
          <Row id={"pet-amenities"} className={"align-items-center"}>
            <Col>
              <Image src={HappyDog} className={"img-fluid"} rounded/>
              <div
                  style={{position: "absolute", bottom: 0}}>
                Photo by <a
                  href="https://unsplash.com/@berkaygumustekin?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Berkay
                Gumustekin</a> on <a
                  href="https://unsplash.com/s/photos/dog?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
              </div>
            </Col>
            <Col className={"p-3"}>
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
            <Col className={"p-3"}>
              <h3 className={"text-center"}>
                Immunizations
              </h3>
              <p className={"text-center"}>
                Please provide shot records prior to check-in.
              </p>
              <h5>
                Dog Vaccination Requirements
              </h5>
              <p>
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
              </p>
              <h5>
                Cat Vaccination Requirements
              </h5>
              <p>
                <ul>
                  <li>Rabies</li>
                  <li>Feline Distemper</li>
                  <li>Feline Leukemia Virus</li>
                </ul>
              </p>
            </Col>
            <Col>
              <Image src={BlackCat} className={"img-fluid"} rounded/>
              <div
                  style={{position: "absolute", bottom: 5, right: 25}}>
                Photo by <a
                  href="https://unsplash.com/@cthemaker?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
                Chris Nemeth</a> on <a
                  href="https://unsplash.com/s/photos/black-cat?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
              </div>
            </Col>
          </Row>
        
        </Container>
      </div>
  
  );
}

export default Home;
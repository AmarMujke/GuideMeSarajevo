import Banner from "./banner";
import Nav from "./nav";
import Footer from "./footer";
import LocationCards from "./LocationCards";
import Map from "./map"
import PopularSection from "./PopularSection";
import CategoryFilter from "./CategoryFilter";
import { useRef } from "react";

function Home() {
  const mapRef = useRef(null);
    
  const scrollToMap = (() => {
    if (mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  })

  return (
    <>
      <Nav />
      <Banner scrollToMap={scrollToMap}/>
      <div>
      <PopularSection />
      <div ref={mapRef}>
      <Map />
      </div>
      <h1  style={{marginTop: '8rem', textAlign: 'center'}}>Featured Locations</h1>
        <LocationCards />
      </div>
      <CategoryFilter />
      <Footer />
    </>
  );
}

export default Home;

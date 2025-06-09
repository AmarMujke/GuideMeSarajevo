import Banner from "./banner";
import Nav from "./nav";
import Footer from "./footer";
import LocationCards from "./LocationCards";
import Map from "./map"
import PopularSection from "./PopularSection";
import CategoryFilter from "./CategoryFilter";

function home() {
  return (
    <>
      <Nav />
      <Banner />
      <div>
      <PopularSection />
      <Map />
      <h1  style={{marginTop: '8rem', textAlign: 'center'}}>Featured Locations</h1>
        <LocationCards />
      </div>
      <CategoryFilter />
      <Footer />
    </>
  );
}

export default home;

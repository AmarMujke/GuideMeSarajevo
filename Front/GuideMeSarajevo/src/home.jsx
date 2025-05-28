import Banner from "./banner";
import Nav from "./nav";
import Footer from "./footer";
import LocationCards from "./components/LocationCards";
import Map from "./map"
import CategoryFilter from "./components/CategoryFilter";
import PopularSection from "./components/PopularSection";

function home() {
  return (
    <>
      <Nav />
      <Banner />
      <div>
      <PopularSection />
      <h1>Featured Locations</h1>
        <LocationCards />
      </div>
      <Map />
      <CategoryFilter />
      <Footer />
    </>
  );
}

export default home;

import Banner from "./banner";
import Nav from "./nav";
import Footer from "./footer";
import LocationCards from "./components/LocationCards";
import CategoryFilter from "./components/CategoryFilter";

function home() {
  return (
    <>
      <Nav />
      <Banner />
      <div>
      <h1>Featured Locations</h1>
        <LocationCards />
      </div>
      <CategoryFilter />
      <Footer />
    </>
  );
}

export default home;

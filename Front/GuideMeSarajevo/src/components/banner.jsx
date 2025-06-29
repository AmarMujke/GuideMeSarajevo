import "./banner.css";

function Banner({ scrollToMap }) {
  return (
    <div className="banner">
      <div id="txtBack">
        <h2>EXPLORE THE CITY!</h2>
        <h1>Turn your trip into memories.</h1>
        <button className="button-53" role="button" onClick={scrollToMap}>
          Start now
        </button>
      </div>
    </div>
  );
}

export default Banner;

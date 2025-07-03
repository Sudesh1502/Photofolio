
import './Slider.css';
import { FaBackwardFast } from "react-icons/fa6";
import { FaFastForward } from "react-icons/fa";

const Slider = ({ sliderIndex, setSliderIndex, photos }) => {
  const closeSlider = () => setSliderIndex(null);

  const showPrev = () =>{
    setSliderIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  }
  const showNext = () =>{
    setSliderIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  }
  

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          flexDirection: "column",
          color: "#fff",
        }}
      >
        <button
          onClick={closeSlider}
          style={{ position: "absolute", top: 20, right: 30, fontSize: 24 }}
        >
          ❌
        </button>
        <div style={{ textAlign: "center" }}>
          <h2>{photos[sliderIndex].title}</h2>
          <img
            src={photos[sliderIndex].imageUrl}
            alt={photos[sliderIndex].title}
            style={{ maxHeight: "80vh", maxWidth: "90vw" }}
          />
          <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
            <button
            className="sliderBtns" onClick={showPrev} style={{ marginRight: "20px" }}>
              <FaBackwardFast style={{color:"white"}} />
            </button>
            

            <button
            className="sliderBtns" onClick={showNext}><FaFastForward style={{color:"white"}} />
</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Slider;

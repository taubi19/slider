import "./styles.css";
import Slider from "./slider";

function createSlider() {
  const slider = new Slider({
    container: document.body,
    color: "#e6e6",
    min: 0,
    max: 200,
    step: 15,
  });
}

createSlider();

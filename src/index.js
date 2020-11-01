import "./styles.css";
import Slider from "./slider";

function createSlider() {
  const container = document.createElement("div");
  container.classList.add("container");
  document.body.appendChild(container);

  const slider1 = new Slider({
    container,
    color: "#e6e6",
    min: 0,
    max: 200,
    step: 15,
    radius: 200,
  });
  const slider2 = new Slider({
    container,
    color: "#e6e6",
    min: 0,
    max: 150,
    step: 15,
    radius: 150,
  });
  const slider3 = new Slider({
    container,
    color: "#e6e6",
    min: 0,
    max: 200,
    step: 15,
    radius: 100,
  });
}

createSlider();

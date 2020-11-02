export default class Slider {
  constructor({ container, color, max, min, step, radius, name }) {
    const defaultValues = {
      color: "#000000",
    };
    if (container == null) {
      throw new Error(
        "You need to specify the container for the slider to work."
      );
    }
    if (color == null) {
      console.warn(
        "Color missing. You should set the slider color as a parameter to new slider. Using default color: black"
      );
    }

    // class options
    this.container = container;
    this.color = color != null ? color : defaultValues.color;
    this.max = max;
    this.min = min;
    this.step = step;
    this.radius = radius;
    this.name = name;

    // class members
    this.circumference = null;
    this.sliderContainer = null;
    this.legendContainer = null;
    this.innerContainer = null;
    this.knob = null;
    this.strokeWidth = null;
    this.r = null; // inner radius (without stroke width)
    this.mouseDown = false;

    this.createContainers();
    this.createSlider();
  }

  createContainers() {
    const createContainer = (container, className) => {
      let elm = container.querySelector("." + className);
      if (!elm) {
        elm = document.createElement("div");
        elm.classList.add(className);
        container.appendChild(elm);
      }
      return elm;
    };

    // if sliderContainer and legendContainer don't exist, create them at first slider initialization
    this.sliderContainer = createContainer(this.container, "sliderContainer");
    this.sliderContainer.classList.add("container");
    this.legendContainer = createContainer(this.container, "legendContainer");
  }

  createSlider() {
    const width = this.radius * 2;
    const height = this.radius * 2;

    const cx = width / 2;
    const cy = height / 2;

    this.strokeWidth = 10;
    this.r = width / 2 - this.strokeWidth * 2; // inner radius

    this.circumference = 2 * Math.PI * this.r;

    const NAMESPACE = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NAMESPACE, "svg");
    svg.classList.add("circle");
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);

    const placeholderCircle = document.createElementNS(NAMESPACE, "circle");
    placeholderCircle.classList.add("placeholder-circle");
    placeholderCircle.setAttribute("cx", cx);
    placeholderCircle.setAttribute("cy", cy);
    placeholderCircle.setAttribute("r", this.r);
    placeholderCircle.setAttribute("stroke-width", this.strokeWidth);
    placeholderCircle.setAttribute("stroke-dasharray", "4 1");
    placeholderCircle.style.fill = "none";
    placeholderCircle.style.stroke = "#808080";

    const progressCircle = document.createElementNS(NAMESPACE, "circle");
    progressCircle.classList.add("progress-circle");
    progressCircle.setAttribute("cx", cx);
    progressCircle.setAttribute("cy", cy);
    progressCircle.setAttribute("r", this.r);
    progressCircle.setAttribute("stroke-width", this.strokeWidth);
    progressCircle.setAttribute("stroke-dashoffset", this.circumference);
    progressCircle.setAttribute("stroke-dasharray", this.circumference);
    progressCircle.style.transform = "rotate(-90deg)";
    progressCircle.style["transform-origin"] = "50% 50%";
    progressCircle.style.fill = "transparent";
    progressCircle.style.stroke = this.color;
    this.progressCircle = progressCircle;

    const legendItem = document.createElement("div");
    legendItem.classList.add("legend-item");
    const legendItemValue = document.createElement("span");
    legendItemValue.classList.add("legend-item-value");
    legendItemValue.textContent = this.min;
    const legendItemColor = document.createElement("span");
    legendItemColor.classList.add("legend-item-color");
    legendItemColor.style.backgroundColor = this.color;
    const legendItemName = document.createElement("span");
    legendItemName.textContent = this.name;
    legendItemName.classList.add("legend-item-name");

    legendItem.appendChild(legendItemValue);
    legendItem.appendChild(legendItemColor);
    legendItem.appendChild(legendItemName);

    this.legendItemValue = legendItemValue;
    this.legendContainer.appendChild(legendItem);

    const initialTranslateX = cx - this.strokeWidth;
    const initialTranslateY = 0;
    const knob = document.createElement("div");
    knob.classList.add("knob");
    knob.style.transform = `translate(${initialTranslateX}px, ${initialTranslateY}px)`;
    this.knob = knob;

    svg.appendChild(placeholderCircle);
    svg.appendChild(progressCircle);

    const innerContainer = document.createElement("div");
    innerContainer.classList.add("innerContainer");

    innerContainer.appendChild(svg);
    innerContainer.appendChild(knob);
    this.sliderContainer.appendChild(innerContainer);
    this.innerContainer = innerContainer;

    // mouse events
    knob.addEventListener("mousedown", this.startMoveKnob.bind(this));
    document.addEventListener("mousemove", this.moveKnob.bind(this));
    placeholderCircle.addEventListener("click", this.moveKnob.bind(this));
    progressCircle.addEventListener("click", this.moveKnob.bind(this));

    // touch events

    knob.addEventListener("touchstart", this.startTouchKnob.bind(this));
    document.addEventListener("touchmove", this.moveKnob.bind(this), {
      passive: false,
    });
  }

  startMoveKnob(e) {
    this.mouseDown = true;
    document.addEventListener("mouseup", this.endMoveKnob.bind(this));
  }

  startTouchKnob(e) {
    this.mouseDown = true;
    document.addEventListener("touchend", this.endMoveKnob.bind(this));
  }

  endMoveKnob() {
    this.mouseDown = false;
  }

  moveKnob(e) {
    if (!this.mouseDown && e.type != "click") return;

    const coords = {};
    if (
      e.type === "touchstart" ||
      e.type === "touchend" ||
      e.type === "touchmove"
    ) {
      e.preventDefault();
      coords.x = e.touches[0].clientX - this.innerContainer.offsetLeft;
      coords.y = e.touches[0].clientY - this.innerContainer.offsetTop;
    } else {
      coords.x = e.pageX - this.innerContainer.offsetLeft;
      coords.y = e.pageY - this.innerContainer.offsetTop;
    }

    const radAlpha = Math.atan2(coords.y - this.radius, coords.x - this.radius);

    const x = this.r + Math.cos(radAlpha) * this.r;
    const y = this.r + Math.sin(radAlpha) * this.r;

    this.point = { x, y };
    this.knob.style.transform = `translate(${
      this.point.x + this.strokeWidth
    }px, ${this.point.y}px)`;

    let degAlpha = (radAlpha * 180) / Math.PI + 90;
    degAlpha = (degAlpha + 360) % 360; // from radians to full circle
    this.setProgress(degAlpha);
  }

  setProgress(degAlpha) {
    let circumferencePercent = degAlpha / 360; // percent of the whole circumference
    const v = this.circumference * (1 - circumferencePercent); // dashoffset doesn't mean the full arc but the empty

    // set visual representation
    this.progressCircle.setAttribute("stroke-dashoffset", v);
    const value = Math.ceil(
      (this.max - this.min) * circumferencePercent + this.min
    );
    // update input value regarding to step value
    if (value % this.step === 0) {
      this.legendItemValue.textContent = value;
    }
  }
}

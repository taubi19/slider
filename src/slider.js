export default class Slider {
  constructor({ container, color, max, min, step, radius }) {
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
    this.container = container;
    this.color = color != null ? color : defaultValues.color;
    this.max = max;
    this.min = min;
    this.step = step;
    this.radius = radius;
    this.mouseDown = false;

    this.createSlider();
  }

  createSlider() {
    const width = 200;
    const height = 200;
    const cx = width / 2;
    const cy = height / 2;
    this.strokeWidth = 10;
    this.r = width / 2 - this.strokeWidth * 2;

    this.circumference = 2 * Math.PI * this.r;
    // console.log("this.circumference", this.circumference);

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

    const input = document.createElement("input");
    input.type = "number";
    input.max = this.max;
    input.min = this.min;
    input.step = this.step;

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
    innerContainer.appendChild(input);
    this.container.appendChild(innerContainer);

    // mouse events
    knob.addEventListener("mousedown", this.startMoveKnob.bind(this));
    document.addEventListener("mousemove", this.moveKnob.bind(this));
    placeholderCircle.addEventListener("click", this.moveKnob.bind(this));
    progressCircle.addEventListener("click", this.moveKnob.bind(this));

    // touch events

    knob.addEventListener("touchstart", this.startTouchKnob.bind(this));
    document.addEventListener("touchmove", this.moveKnob.bind(this));
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
      console.log("touch", e);
      coords.x = e.touches[0].clientX;
      coords.y = e.touches[0].clientY;
    } else {
      coords.x = e.pageX;
      coords.y = e.pageY;
    }

    const radAlpha = Math.atan2(coords.y - 100, coords.x - 100);

    const x = 80 + Math.cos(radAlpha) * this.r;
    const y = 80 + Math.sin(radAlpha) * this.r;

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
    this.progressCircle.setAttribute("stroke-dashoffset", v);
  }
}

export default class Slider {
  constructor({
    container, color, max, min, step, radius,
  }) {
    this.container = container;
    this.color = color;
    this.max = max;
    this.min = min;
    this.step = step;
    this.radius = radius;

    this.createSlider();
  }

  createSlider() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.container.appendChild(svg);
  }
}

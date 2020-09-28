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
    const width = 200;
    const height = 200;
    const strokeWidth = 10;
    const r = width / 2 - strokeWidth * 2;
    const cx = width / 2;
    const cy = height / 2;
    const circumference = 2 * Math.PI * r;
    const NAMESPACE = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NAMESPACE, 'svg');

    svg.setAttribute('width', width);
    svg.setAttribute('height', height);

    const placeholderCircle = document.createElementNS(NAMESPACE, 'circle');
    placeholderCircle.setAttribute('cx', cx);
    placeholderCircle.setAttribute('cy', cy);
    placeholderCircle.setAttribute('r', r);
    placeholderCircle.setAttribute('stroke-width', strokeWidth);
    placeholderCircle.setAttribute('stroke-dasharray', '4 1');
    placeholderCircle.style.fill = 'none';
    placeholderCircle.style.stroke = '#e6e6e6';

    const progressCircle = document.createElementNS(NAMESPACE, 'circle');
    progressCircle.setAttribute('cx', cx);
    progressCircle.setAttribute('cy', cy);
    progressCircle.setAttribute('r', r);
    progressCircle.setAttribute('stroke-width', strokeWidth);
    progressCircle.setAttribute('stroke-dashoffset', 10);
    progressCircle.style.fill = 'transparent';
    progressCircle.style.stroke = '#ebebeb';

    svg.appendChild(placeholderCircle);
    svg.appendChild(progressCircle);

    this.container.appendChild(svg);
  }
}

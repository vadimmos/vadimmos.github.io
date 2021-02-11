import { Detector } from "../detector/index.js";

const name = 'self-made-detector';

class SelfMadeDetector extends Detector{
  constructor(){
    super();

  }
}
window.customElements.define(name, SelfMadeDetector);
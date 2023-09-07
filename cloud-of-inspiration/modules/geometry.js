export class Vector extends Array {
  get _maxLength() { return Infinity; };

  assign(vector, maxLength = this._maxLength) {
    const entries = Object.entries(vector);
    maxLength = Math.min(maxLength, entries.length);
    for (let i = 0; i < maxLength; i++) {
      this[i] = entries[i][1] || 0;
    }
    return this;
  }

  static isCompatible(obj) {
    return obj && typeof obj === 'object'
      && Object.entries(obj).slice(0, this.prototype._maxLength).every(e => typeof e[1] === 'number');
  }
}
export class Vector2 extends Vector {
  get _maxLength() { return 2; };

  constructor(...args) {
    if (Vector2.isCompatible(args[0])) {
      super();
      this.assign(args[0]);
    }
    else {
      super(...args);
      this.assign(Vector.from({ length: 2 }, () => 0));
    }
  }
}
export class Position2 extends Vector2 {
  get x() { return this[0] || 0; }
  set x(v) { this[0] = v; }
  get y() { return this[1] || 0; }
  set y(v) { this[1] = v; }
}
export class Scale2 extends Vector2 {
  get w() { return this[0] || 0; }
  set w(v) { this[0] = v; }
  get h() { return this[1] || 0; }
  set h(v) { this[1] = v; }
}
export class Transform2 {
  position = new Position2();
  scale = new Scale2();

  constructor(...args) {
    if (Transform2.isCompatible(args[0])) {
      this.assign(args[0]);
    }
  }
  assign(transform) {
    if (transform.position) this.position.assign(transform.position);
    if (transform.scale) this.scale.assign(transform.scale);
    return this;
  }

  static isCompatible(obj) {
    return obj && typeof obj === 'object'
      && (Position2.isCompatible(obj.position) || Scale2.isCompatible(obj.scale));
  }
}
import p5 from 'p5';

/**
 * @refer https://github.com/GaetanThomas42/fireworks-generator
 */
class Particle {
  lifespan: number;
  pos: p5.Vector;
  vel: p5.Vector;
  acc: p5.Vector;
  applyForce: (force: p5.Vector) => void;

  constructor(
    protected p5Ins: p5,
    protected x: number,
    protected y: number,
    protected hue: any,
    protected firework: boolean,
  ) {
    this.lifespan = 255;
    this.pos = this.p5Ins.createVector(x, y);

    if (firework) {
      this.vel = this.p5Ins.createVector(0, this.p5Ins.random(-17, -8));
    } else {
      this.vel = p5.Vector.random2D();
      this.vel.mult(this.p5Ins.random(2, 6));
    }

    this.acc = this.p5Ins.createVector(0, 0);

    this.applyForce = (force: p5.Vector) => {
      this.acc.add(force);
    };
  }

  done = () => {
    if (this.lifespan < 0) {
      return true;
    } else {
      return false;
    }
  };

  update = () => {
    if (!this.firework) {
      this.vel.mult(0.95);
      this.lifespan -= 4;
    }
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  };

  show = () => {
    this.p5Ins.colorMode(this.p5Ins.HSB);
    if (!this.firework) {
      this.p5Ins.stroke(this.hue, 255, 255, this.lifespan);
      this.p5Ins.strokeWeight(2);
    } else {
      this.p5Ins.stroke(this.hue, 255, 255);
      this.p5Ins.strokeWeight(4);
    }
    this.p5Ins.point(this.pos.x, this.pos.y);
  };
}

class Firework {
  hu: any;
  firework: Particle;
  exploded: boolean;
  particles: Particle[];

  constructor(protected p5Ins: p5, protected gravity: p5.Vector) {
    this.hu = this.p5Ins.random(255);
    this.firework = new Particle(
      p5Ins,
      this.p5Ins.random(this.p5Ins.width),
      this.p5Ins.height,
      this.hu,
      true,
    );
    this.exploded = false;
    this.particles = [];
  }

  done = () => {
    if (this.exploded && this.particles.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  update = () => {
    if (!this.exploded) {
      this.firework.applyForce(this.gravity);
      this.firework.update();
      if (this.firework.vel.y >= 0) {
        this.exploded = true;
        this.explode();
      }
    }
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].applyForce(
        (((this.gravity as unknown) as number) / 4) as any,
      );
      this.particles[i].update();
      if (this.particles[i].done()) {
        this.particles.splice(i, 1);
      }
    }
  };

  explode = () => {
    for (let i = 0; i < 100; i++) {
      const p = new Particle(
        this.p5Ins,
        this.firework.pos.x,
        this.firework.pos.y,
        this.hu,
        false,
      );
      this.particles.push(p);
    }
  };

  show = () => {
    if (!this.exploded) {
      this.firework.show();
    }

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].show();
    }
  };
}

export const makeP5FireworksInstance = (
  $ele: HTMLDivElement,
  {
    width = 1080,
    height = 720,
    backgroundAlpha = 0.85,
  }: {
    width?: number;
    height?: number;
    backgroundColor?: string;
    backgroundAlpha?: number;
  } = {},
) => {
  const sketch = (s: p5) => {
    let gravity: p5.Vector;
    const fireworks: any[] = [];
    // Increase this value for more fireworks!
    const rate = 0.1;

    s.setup = () => {
      s.createCanvas(width, height);
      s.fill(255, backgroundAlpha);
      s.stroke(255, backgroundAlpha);
      s.strokeWeight(4);
      gravity = s.createVector(0, 0.2);
    };

    s.draw = () => {
      s.colorMode(s.RGB);
      s.background(0, 0, 0, backgroundAlpha);
      if (s.random(1) < rate) {
        fireworks.push(new Firework(s, gravity));
      }

      for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update();
        fireworks[i].show();
        if (fireworks[i].done()) {
          fireworks.splice(i, 1);
        }
      }
    };
  };

  return new p5(sketch, $ele);
};

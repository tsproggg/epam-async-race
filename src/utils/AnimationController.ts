export default class AnimationController {
  #animation: Animation | null = null;

  readonly #carRef: HTMLDivElement | null = null;

  readonly #trackRef: HTMLDivElement | null = null;

  constructor(
    car: HTMLDivElement | null,
    track: HTMLDivElement | null,
    animDuration: number,
  ) {
    if (!car || !track) return;

    this.#carRef = car;
    this.#trackRef = track;

    if (animDuration > 0) {
      this.#createAnimation(car, track, animDuration);
    }
  }

  createAnimation(duration: number): void {
    if (!this.#carRef || !this.#trackRef) throw new Error("No refs found");

    this.#createAnimation(this.#carRef, this.#trackRef, duration);
  }

  #createAnimation(
    car: HTMLDivElement,
    track: HTMLDivElement,
    duration: number,
  ): void {
    if (duration < 0) {
      throw new Error("Invalid animation duration");
    }
    // Suppressed for DOM manipulation
    // eslint-disable-next-line no-param-reassign
    car.style.position = "absolute";

    this.#animation = car.animate(
      [
        {
          left: 0,
        },
        {
          left: `${track.offsetWidth - car.offsetWidth}px`,
        },
      ],
      {
        duration,
        fill: "forwards",
        easing: "ease-in-out",
        iterations: 1,
      },
    );

    this.#animation.pause();
  }

  playAnimation(): void {
    this.#animation?.play();
  }

  pauseAnimation(): void {
    this.#animation?.pause();
  }

  // Robust reset: cancel animation, clear transform, force inline left=0
  resetAnimation(): void {
    if (!this.#carRef) return;
    if (!this.#animation) {
      alert("Animation not found");
    }

    this.#animation?.cancel();
    this.#carRef.style.left = "0px";
  }
}

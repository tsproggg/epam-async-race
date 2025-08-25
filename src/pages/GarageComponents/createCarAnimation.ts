export default function createCarAnimation(
  car: HTMLDivElement,
  track: HTMLDivElement,
  duration: number,
): Animation | null {
  // Suppressed for DOM manipulation
  // eslint-disable-next-line no-param-reassign
  car.style.position = "absolute";

  return car.animate(
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
}

import React, { useEffect, useState } from "react";

import { hexColorRegex } from "../../types/GlobalConst";

export default function CarIcon(props: {
  color: string;
  // eslint-disable-next-line react/require-default-props
  size?: number;
}): React.ReactNode {
  const [fillColor, setFillColor] = useState<string>("#000");
  const { color, size = 100 } = props;

  useEffect(() => {
    if (hexColorRegex.test(color)) {
      setFillColor(color);
    } else {
      setFillColor("#000");
    }
  }, [color]);

  // TODO: add some background for colors close to white or light grey
  return (
    <svg
      height={`${size}px`}
      id="car"
      viewBox="0 0 32 32"
      width={`${size}px`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill={fillColor} transform="translate(32,0) scale(-1,1)">
        <path d="M11.5 18a2.5 2.5 0 1 0 2.5 2.5 2.5 2.5 0 0 0-2.5-2.5zm0 4a1.5 1.5 0 1 1 1.5-1.5 1.5 1.5 0 0 1-1.5 1.5z" />
        <path d="M28.5 12.667 27.4 11.2A5.525 5.525 0 0 0 23 9h-3.6a8.517 8.517 0 0 0-5.441 1.97L10.319 14H9.083a5.728 5.728 0 0 0-5.558 4.34l-.51 2.039A.5.5 0 0 0 3.5 21h4a.5.5 0 0 0 0-1H4.141l.359-1.417A4.729 4.729 0 0 1 9.083 15h14.76a4.47 4.47 0 0 0 3.182-1.318l.564-.564.111.149a1.5 1.5 0 0 1 .3.9V19.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 0 0 1h1a1.5 1.5 0 0 0 1.5-1.5v-5.333a2.515 2.515 0 0 0-.5-1.5zM19 14h-7.119l2.719-2.262a7.511 7.511 0 0 1 4.4-1.721zm7.318-1.025A3.477 3.477 0 0 1 23.843 14H20v-4h3a4.521 4.521 0 0 1 3.6 1.8l.383.51z" />
        <path d="M22.5 18a2.5 2.5 0 1 0 2.5 2.5 2.5 2.5 0 0 0-2.5-2.5zm0 4a1.5 1.5 0 1 1 1.5-1.5 1.5 1.5 0 0 1-1.5 1.5zM18.5 20h-3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zM17.5 17a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1z" />
      </g>
    </svg>
  );
}

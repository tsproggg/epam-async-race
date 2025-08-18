import React, { useState } from "react";

import CarIcon from "./CarIcon";
import "../garageStyles.scss";

import type { ICar } from "../../types/ApiTypes";

export default function CarTrack(props: ICar | null): React.ReactNode {
  const [isSelected, setIsSelected] = useState<boolean>(false);

  if (props === null) {
    return null;
  }
  const { name, id, color } = props;

  return (
    <section
      id={"carTrack"}
      className={
        "flex flex-start flex-1 flex-col sm:flex-row border border-black rounded-3xl px-15 py-5"
      }
    >
      <div className={"w-auto sm:w-160 text-center"} id="controls">
        <h4 className={"mb-5"}>
          {name}
          {isSelected ? " - Selected" : ""}
        </h4>
        <div
          id="buttons"
          className={
            "flex justify-center sm:justify-around flex-wrap gap-10 sm:gap-5"
          }
        >
          <button id="select" type={"button"}>
            <span>SELECT</span>
          </button>
          <button id="delete" type={"button"}>
            <span>DELETE</span>
          </button>
          <button id="start" type={"button"}>
            <span>START</span>
          </button>
          <button id="stop" type={"button"}>
            <span>STOP</span>
          </button>
        </div>
      </div>
      <div className={"flex-1 ml-5"} id="track">
        <CarIcon color={color} />
      </div>
    </section>
  );
}

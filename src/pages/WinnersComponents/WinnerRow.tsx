import React from "react";

import CarIcon from "../GarageComponents/CarIcon";

import type { ICar, IWinner } from "../../types/ApiTypes";

export interface WinnerRowProps extends IWinner, ICar {}

export default function WinnerRow(props: WinnerRowProps): React.ReactNode {
  const { id, name, color, time, wins } = props;

  return (
    <tr className={"h-30"} id={"winnerRow"}>
      <td className={"max-w-40"}>{id}</td>
      <td className={"w-100 "}>
        <div className="flex justify-center">
          <CarIcon color={color} size={50} />
        </div>
      </td>
      <td>{name}</td>
      <td className={"max-w-100"}>{wins}</td>
      <td className={"max-w-200"}>{(time / 1000).toFixed(3)} s</td>
    </tr>
  );
}

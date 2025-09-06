import React from "react";

import { useSelector } from "react-redux";
import { Link } from "react-router";

import type { Links } from "../Links";
import type { RootState } from "../store/store";

interface NavLinkProps {
  to: Links;
  text: string;

  // eslint-disable-next-line react/require-default-props
  disableOnRaceOngoing?: boolean;
}

export default function NavLink(props: NavLinkProps): React.ReactNode {
  const isRaceOngoing: boolean = useSelector(
    (state: RootState) => state.raceStateSlice.ongoing,
  );

  const { to, text, disableOnRaceOngoing = true } = props;

  return (
    <React.Fragment>
      {disableOnRaceOngoing && isRaceOngoing ? (
        <span className="text-gray-500">{text}</span>
      ) : (
        <Link className="hover:underline" to={to}>
          {text}
        </Link>
      )}
    </React.Fragment>
  );
}

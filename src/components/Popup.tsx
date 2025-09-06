import React, { useState } from "react";

import AutoPopup from "./AutoPopup";

import type { AutoPopupProps } from "./AutoPopup";

interface PopupProps extends AutoPopupProps {
  openPopupComponent: React.ReactNode;
}

export default function Popup(props: PopupProps): React.ReactNode {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const { openPopupComponent } = props;

  return (
    <div id="popup">
      <button
        id="openPopupComponent"
        onClick={() => setIsOpened(true)}
        type="button"
      >
        {openPopupComponent}
      </button>

      {isOpened ? (
        <AutoPopup {...props} onCloseHandler={() => setIsOpened(false)} />
      ) : (
        ""
      )}
    </div>
  );
}

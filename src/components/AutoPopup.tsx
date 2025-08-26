import React, { useEffect, useRef, useState } from "react";

export interface AutoPopupProps {
  popupName: string;

  // In position, if center is true, it will override coords

  // NOTE: Since default values of props are defined in the function, I suppressed the warnings
  // eslint-disable-next-line react/require-default-props
  position?: { x: number; y: number; center: boolean };
  // eslint-disable-next-line react/require-default-props
  popupChildren?: React.ReactNode;
  // eslint-disable-next-line react/require-default-props
  onCloseHandler?: () => void;
}

// A popup opening automatically on spawn
export default function AutoPopup(props: AutoPopupProps): React.ReactNode {
  const [isOpened, setIsOpened] = useState<boolean>(true);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const {
    popupName,
    popupChildren = null,
    position = { x: 0, y: 0, center: true },
    onCloseHandler = () => {},
  } = props;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpened) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [isOpened]);

  if (!isOpened) {
    onCloseHandler();
    return null;
  }

  // TODO: add popup close on backdrop click
  return (
    <div>
      <dialog
        ref={dialogRef}
        id={"autoPopup"}
        onCancel={() => setIsOpened(false)}
        className={`absolute
            ${
              position.center
                ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                : ""
            }
            bg-white p-20 rounded-xl min-w-[300px] text-center backdrop:bg-black/50`}
        style={
          !position.center
            ? { top: position.y, left: position.x, position: "absolute" }
            : {}
        }
      >
        <div className={"flex justify-around mb-10"} id="popupHeader">
          <h5 className={"font-bold text-xl"}>{popupName}</h5>
          <button
            className={"ml-10 w-70 h-30"}
            id="closePopup"
            onClick={() => setIsOpened(false)}
            type="button"
          >
            <span>Close</span>
          </button>
        </div>
        <div className={"flex justify-center items-center"}>
          <div>{popupChildren}</div>
        </div>
      </dialog>
    </div>
  );
}

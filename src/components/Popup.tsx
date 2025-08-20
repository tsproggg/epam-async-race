import React, { useEffect, useRef, useState } from "react";

interface PopupProps {
  popupName: string;

  // If center is true, it will override coords
  position: { x: number; y: number; center: boolean };
  popupChildren: React.ReactNode;
  openPopupComponent: React.ReactNode;
}

export default function Popup(props: PopupProps): React.ReactNode {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { openPopupComponent, popupName, popupChildren, position } = props;

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

  // TODO: add popup close on backdrop click
  return (
    <div id={"popup"}>
      <button
        id="openPopupComponent"
        onClick={() => setIsOpened(true)}
        type="button"
      >
        {openPopupComponent}
      </button>

      <dialog
        ref={dialogRef}
        id={"popup-opened"}
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
            id="closePopup"
            onClick={() => setIsOpened(false)}
            type="button"
          >
            Close
          </button>
        </div>
        <div className={"flex justify-center items-center"}>
          <div>{popupChildren}</div>
        </div>
      </dialog>
    </div>
  );
}

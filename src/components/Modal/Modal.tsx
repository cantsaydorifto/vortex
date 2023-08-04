"use client";

import styles from "./modal.module.css";

const modalHandler = (
  event: React.MouseEvent<HTMLDivElement>,
  toggleModal: () => void
) => {
  if (event.target === event.currentTarget) toggleModal();
};

type modalProps = {
  toggleModal: () => void;
  id: number;
  children: React.ReactNode;
};

export default function Modal(props: modalProps) {
  return (
    <div
      onClick={(event) => modalHandler(event, props.toggleModal)}
      className={styles.overlay}
    >
      <div key={props.id} className={styles.content}>
        {props.children}
      </div>
    </div>
  );
}

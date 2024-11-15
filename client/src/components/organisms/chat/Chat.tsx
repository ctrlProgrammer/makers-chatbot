import { useEffect, useState } from "react";
import styles from "./chat.module.css";
import { useAppState } from "../../../core/store/app";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";

export const Chat = () => {
  const { sessionId, restartSessionId } = useAppState();

  const [message, setMessage] = useState("");

  const sendMessage = () => {};

  const restartSession = () => restartSessionId();

  useEffect(() => restartSessionId(), []);

  return (
    <div className={styles.chat}>
      <div className={styles.conversation}></div>
      <div className={styles.message}>
        <div className={styles.messageText}>
          <textarea name="" id="" value={message} />
        </div>
        <div className={styles.restartSession}>
          <button>
            <FontAwesomeIcon icon={faRotateRight} />
          </button>
        </div>
      </div>
    </div>
  );
};

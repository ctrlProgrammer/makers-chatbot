import { useEffect, useState } from "react";
import styles from "./chat.module.css";
import { useAppState } from "../../../core/store/app";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { APIHelper } from "../../../core/api";
import { Message } from "../../../core/types";

export const Chat = () => {
  const { sessionId, restartSessionId } = useAppState();

  const [message, setMessage] = useState("");
  const [newMessage, setNewMessage] = useState<string>("");

  const [messageHistory, setMessageHistory] = useState<Message[]>([]);

  const sendMessage = () => {
    if (newMessage != "") {
      APIHelper.SendMessage(newMessage, sessionId).then((data) => {
        if (!data || data.error) {
          toast.error("Error sending the message");
          return;
        }

        setMessage("");
        setNewMessage("");
        setMessageHistory([...messageHistory, ...data.messages.map((message: any) => ({ from: "chat", content: message.content, extra: message.extra || null, special: message.special || false, type: message.type || null }))]);
      });
    } else toast.error("Fill the message input");
  };

  const sendNewMessage = () => {
    setMessage("");
    setMessageHistory([...messageHistory, { content: message, from: "user" }]);
    setNewMessage(message);
  };

  const restartSession = () => {
    setMessageHistory([]);
    setNewMessage("");
    setMessage("");
    restartSessionId();
  };

  useEffect(() => {
    if (newMessage != "") sendMessage();
  }, [newMessage]);

  useEffect(() => restartSession(), []);

  console.log(messageHistory);

  return (
    <div className={styles.chat}>
      <div className={styles.conversation}>
        {messageHistory && Array.isArray(messageHistory)
          ? messageHistory.map((message, index) => {
              return (
                <div key={index + "_" + message.from} className={styles.message + " " + (message.from == "chat" ? styles.fromChat : styles.fromUser)}>
                  {message.special ? (
                    <>
                      {message.type == "inventory" ? (
                        <div className={styles.inventory}>
                          {message.extra && Array.isArray(message.extra)
                            ? message.extra.map((device) => {
                                return (
                                  <div className={styles.device}>
                                    <img src={device.item_image} alt="" />
                                    <div className={styles.data}>
                                      <h4>Nombre: {device.item_name}</h4>
                                      <small>Marca: {device.item_brand}</small>
                                      <small>Precio: $ {Intl.NumberFormat("ES").format(device.item_price)}</small>
                                      <small>Inventario: {device.item_balance}</small>
                                      <small>Identificador: {device.inventory_id}</small>
                                    </div>
                                  </div>
                                );
                              })
                            : ""}
                        </div>
                      ) : message.type == "device" ? (
                        <div className={styles.inventory}>
                          {message.extra ? (
                            <div className={styles.device}>
                              <img src={message.extra.item_image} alt="" />
                              <div className={styles.data}>
                                <h4>Nombre: {message.extra.item_name}</h4>
                                <small>Marca: {message.extra.item_brand}</small>
                                <small>Precio: $ {Intl.NumberFormat("ES").format(message.extra.item_price)}</small>
                                <small>Inventario: {message.extra.item_balance}</small>
                                <small>Identificador: {message.extra.inventory_id}</small>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      ) : (
                        ""
                      )}
                    </>
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>
              );
            })
          : ""}
      </div>
      <div className={styles.message}>
        <div className={styles.messageText}>
          <textarea name="" id="" value={message} onChange={(e) => setMessage(e.target.value)} />
          <button onClick={() => sendNewMessage()}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
        <div className={styles.restartSession}>
          <button onClick={() => restartSession()}>
            <FontAwesomeIcon icon={faRotateRight} />
          </button>
        </div>
      </div>
    </div>
  );
};

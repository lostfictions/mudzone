import React, { useState, useCallback } from "react";

import {
  useMessageReceivedSubscription,
  useSendMessageMutation
} from "../generated/models";

import styles from "./ChatBox.module.css";

export default function ChatBox() {
  return (
    <div className={styles.container}>
      <MessageList />
      <MessageInput />
    </div>
  );
}

function MessageList() {
  // TODO: grab from apollo cache instead?
  const [messageList, setMessageList] = useState<
    { author: string; text: string }[]
  >([]);

  const { error } = useMessageReceivedSubscription({
    variables: { channel: "default" },
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData.data) {
        setMessageList([
          ...messageList,
          subscriptionData.data.messageReceived!
        ]);
      }
    }
  });

  if (error) {
    console.error(error);
    return <div>Error! [{error}]</div>;
  }

  return (
    <div className={styles.messagelist}>
      {messageList.map(({ author, text }, i) => (
        <div key={i}>
          <span style={{ fontWeight: "bold" }}>{author}</span>: {text}
        </div>
      ))}
    </div>
  );
}

function MessageInput() {
  const [text, setText] = useState("");
  const sendMessage = useSendMessageMutation();

  const doSendMessage = useCallback(() => {
    if (text.length > 0) {
      sendMessage({ variables: { channel: "default", message: text } });
      setText("");
    }
  }, [sendMessage, text]);

  return (
    <div>
      <input
        value={text}
        onChange={e => {
          setText(e.currentTarget.value);
        }}
      />
      <button onClick={doSendMessage}>Send</button>
    </div>
  );
}

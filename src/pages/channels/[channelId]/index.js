// Channel.js

import { getAllMessages, getAllChannels } from "@/database";
import { useState, useEffect, use } from "react";
import axios from "axios";
import Link from "next/link";
import styles from "src/styles/Home.module.css";

export default function Channel({ channelId, messages: initialMessages, channels: initialChannels }) {
  const [userName, setUserName] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [channels, setChannels] = useState(initialChannels);
  const [newChannelName, setNewChannelName] = useState("");

  useEffect(() => {
    axios.get("/api/channels").then((response) => {
      const channels = response.data;
      setChannels(channels);
    });
  }, []);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submit", userName, text);

    const result = await axios.post(`/api/channels/${channelId}/messages`, {
      userName,
      text,
    });
    const newMessage = result.data;

    setMessages([...messages, newMessage]);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const response = await axios.post('/api/channels', { name: newChannelName });

    setChannels([...channels, response.data]);
    setNewChannelName('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.newChannelForm}>
        <form onSubmit={handleFormSubmit}>
          <input type="text"
                value={newChannelName}
                onChange={(event) => setNewChannelName(event.target.value)}
                placeholder="New Channel Name" />
          <button type="submit">Create Channel</button>
        </form>
      </div>

      <div className={styles.channelList}>
        <h1>Channels</h1>
        <ul>
          {channels.map((channel) => (
            <li key={channel.id} className={styles.channelItem}>
              <Link href={`/channels/${channel.id}`}>
                <a>{channel.name}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h1>Channel {channelId}</h1>
        <ul className={styles.messages}>
          {messages.map((message) => (
            <li key={message.id} className={styles.messageItem}>
              <span>{message.userName}:</span> {message.text}
            </li>
          ))}
        </ul>
        <div className={styles.messageInput}>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your name"
            />
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Your message"
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const channelId = context.query.channelId;
  const messages = await getAllMessages(channelId);
  const channels = await getAllChannels();

  return {
    props: {
      channelId,
      messages: JSON.parse(JSON.stringify(messages)),
      channels: JSON.parse(JSON.stringify(channels)),
    },
  };
}

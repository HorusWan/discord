// Channels.js

import axios from 'axios';
import { useEffect, useState } from 'react';
import { getAllChannels } from '@/database';
import Link from 'next/link';
import styles from 'src/styles/Home.module.css';

export default function Channels() {
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    // client side code --> run in the browser
    axios.get('/api/channels').then((response) => {
      const channels = response.data;
      setChannels(channels);
    });
  }, []);

  return (
    <ul className={styles.channelList}>
      {channels.map((channel) => (
        <li key={channel.id} className={styles.channel}>
          <Link href={`/channels/${channel.id}`}>
            <a>{channel.name}</a>
          </Link>
          <div className={styles.channelDescription}>{channel.description}</div>
        </li>
      ))}
    </ul>
  );
}

export async function getServerSideProps() {
  const channels = await getAllChannels();

  return {
    props: {
      channels: JSON.parse(JSON.stringify(channels)),
    },
  };
}

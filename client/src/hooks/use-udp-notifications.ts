import { useEffect } from 'react';
import dgram from 'react-native-udp';

export function useUdpNotifications(userId: number | null) {
  useEffect(() => {
    if (!userId) return;

    const socket = dgram.createSocket({ type: 'udp4' });
    const port = 5005;

    socket.bind(port);

    (socket as any).on('message', (msg: any, rinfo: any) => {
      try {
        const data = JSON.parse(msg.toString());
        if (data.type === 'like' && data.to_user_id === userId) {
          console.log('Received like notification:', data.message);
          alert(data.message);
        }
      } catch (e) {
        console.error('Failed to parse UDP message', e);
      }
    });

    (socket as any).on('error', (err: any) => {
      console.error('UDP socket error:', err);
    });

    return () => {
      socket.close();
    };
  }, [userId]);
}

import { useEffect } from 'react';
import { Platform } from 'react-native';

export function useUdpNotifications(userId: number | null) {
  useEffect(() => {
    if (!userId || Platform.OS === 'web') return;

    let dgram: any;
    try {
      dgram = require('react-native-udp');
    } catch {
      return;
    }

    if (!dgram?.createSocket) return;

    const socket = dgram.createSocket({ type: 'udp4' });
    socket.bind(5005);

    socket.on('message', (msg: any) => {
      try {
        const data = JSON.parse(msg.toString());
        if (data.type === 'like' && data.to_user_id === userId) {
          console.log('Received like notification:', data.message);
        }
      } catch {}
    });

    socket.on('error', (err: any) => {
      console.error('UDP socket error:', err);
    });

    return () => {
      socket.close();
    };
  }, [userId]);
}

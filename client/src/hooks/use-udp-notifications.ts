import { useEffect } from 'react';
import { Platform } from 'react-native';

export function useUdpNotifications(userId: number | null) {
  useEffect(() => {
    // Пропускаем выполнение на веб-платформе
    if (!userId || Platform.OS === 'web') return;

    let socket: any = null;

    const setupUdp = async () => {
      try {
        // Динамический импорт только для нативных платформ
        const dgram = await import('react-native-udp');
        socket = dgram.default.createSocket({ type: 'udp4' });
        const port = 5005;

        socket.bind(port);

        socket.on('message', (msg: any, rinfo: any) => {
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

        socket.on('error', (err: any) => {
          console.error('UDP socket error:', err);
        });

      } catch (error) {
        console.warn('UDP not available:', error);
      }
    };

    setupUdp();

    return () => {
      if (socket) {
        try {
          socket.close();
        } catch (error) {
          console.error('Error closing UDP socket:', error);
        }
      }
    };
  }, [userId]);
}
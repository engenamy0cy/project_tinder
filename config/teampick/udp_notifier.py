import socket
import json

UDP_IP = "127.0.0.1"  # In production this would be the client's IP or a relay
UDP_PORT = 5005

def send_like_notification(from_user_id, to_user_id):
    try:
        msg = json.dumps({
            "type": "like",
            "from_user_id": from_user_id,
            "to_user_id": to_user_id,
            "message": f"User {from_user_id} liked you!"
        })
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.sendto(msg.encode('utf-8'), (UDP_IP, UDP_PORT))
    except Exception as e:
        print(f"Failed to send UDP notification: {e}")

import socketio
from typing import Dict, List, Any

# Create Async Socket.IO server
# cors_allowed_origins="*" allows connection from any domain (dev mode)
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins="*",
    logger=True,
    engineio_logger=True
)

class SocketManager:
    def __init__(self):
        self.active_connections: Dict[str, str] = {}  # sid -> user_id

    async def connect(self, sid: str, environ: dict):
        print(f"Client connected: {sid}")
        # In a real app, we would authenticate the user here using the token in query params or headers
        
    async def disconnect(self, sid: str):
        if sid in self.active_connections:
            user_id = self.active_connections[sid]
            print(f"Client disconnected: {sid} (User: {user_id})")
            del self.active_connections[sid]
        else:
            print(f"Client disconnected: {sid}")

    async def register_user(self, sid: str, user_id: str):
        """Map a socket ID to a user ID"""
        self.active_connections[sid] = user_id
        await sio.emit('status', {'status': 'connected', 'user_id': user_id}, room=sid)

    async def broadcast_to_user(self, user_id: str, event: str, data: Any):
        """Send an event to a specific user if they are connected"""
        # Find all sockets for this user
        for sid, uid in self.active_connections.items():
            if uid == user_id:
                await sio.emit(event, data, room=sid)

# Initialize manager
socket_manager = SocketManager()

# Event Handlers
@sio.event
async def connect(sid, environ):
    await socket_manager.connect(sid, environ)

@sio.event
async def disconnect(sid):
    await socket_manager.disconnect(sid)

@sio.event
async def authenticate(sid, data):
    """
    Client sends { 'user_id': '...' } after connection to identify themselves.
    In production, verify JWT token here.
    """
    user_id = data.get('user_id')
    if user_id:
        await socket_manager.register_user(sid, user_id)
        
@sio.event
async def typing_start(sid, data):
    """
    Client sends { 'to_user': '...', 'chat_id': '...' }
    """
    # Relay typing status to the target user/room
    # For now, just echo or log
    pass

@sio.event
async def join_circle(sid, data):
    """
    Client sends { 'circle_id': '...' } to join a chat room
    """
    circle_id = data.get('circle_id')
    if circle_id:
        room = f"circle_{circle_id}"
        sio.enter_room(sid, room)
        print(f"Socket {sid} joined room {room}")

@sio.event
async def leave_circle(sid, data):
    """
    Client sends { 'circle_id': '...' } to leave a chat room
    """
    circle_id = data.get('circle_id')
    if circle_id:
        room = f"circle_{circle_id}"
        sio.leave_room(sid, room)
        print(f"Socket {sid} left room {room}")

@sio.event
async def message(sid, data):
    print(f"Message from {sid}: {data}")
    # Handle incoming real-time messages

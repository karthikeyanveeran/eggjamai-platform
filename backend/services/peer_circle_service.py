from typing import Dict, List, Optional
from datetime import datetime

class PeerCircleService:
    def __init__(self):
        # In-memory storage
        self.circles = [
            {
                "id": "1",
                "name": "Gaming Buddies",
                "interest": "Gaming",
                "members": ["user2", "user3"],
                "max_members": 10,
                "description": "Connect with fellow gamers, share tips, and organize gaming sessions",
                "is_anonymous": False,
                "challenges": ["Play together", "Share game reviews"],
                "created_at": datetime.now().isoformat()
            },
            {
                "id": "2",
                "name": "Exam Warriors",
                "interest": "Study Support",
                "members": ["user4", "user5"],
                "max_members": 15,
                "description": "Support each other through exam stress with study tips and motivation",
                "is_anonymous": True,
                "challenges": ["Daily study check-in", "Share study techniques"],
                "created_at": datetime.now().isoformat()
            }
        ]
        self.messages: Dict[str, List] = {}  # circle_id -> list of messages
        
        # Seed some messages
        self.messages["1"] = [
            {
                "id": "msg1",
                "user_id": "user2",
                "username": "GamerOne",
                "content": "Anyone up for a match?",
                "timestamp": datetime.now().isoformat(),
                "is_anonymous": False
            }
        ]

    def get_circles(self, interest: str = None) -> List[Dict]:
        if interest and interest.lower() != "all":
            return [c for c in self.circles if c["interest"].lower() == interest.lower()]
        return self.circles

    def get_circle(self, circle_id: str) -> Optional[Dict]:
        for circle in self.circles:
            if circle["id"] == circle_id:
                return circle
        return None

    def create_circle(self, data: Dict) -> Dict:
        new_circle = {
            "id": str(len(self.circles) + 1),
            "name": data.get("name"),
            "interest": data.get("interest"),
            "members": [data.get("creator_id")],
            "max_members": data.get("max_members", 10),
            "description": data.get("description"),
            "is_anonymous": data.get("is_anonymous", False),
            "challenges": [],
            "created_at": datetime.now().isoformat()
        }
        self.circles.append(new_circle)
        return new_circle

    def join_circle(self, circle_id: str, user_id: str) -> Dict:
        circle = self.get_circle(circle_id)
        if not circle:
            return {"error": "Circle not found"}
            
        if user_id in circle["members"]:
            return {"message": "Already a member"}
            
        if len(circle["members"]) >= circle["max_members"]:
            return {"error": "Circle is full"}
            
        circle["members"].append(user_id)
        return {"success": True, "circle": circle}

    def get_messages(self, circle_id: str) -> List[Dict]:
        return self.messages.get(circle_id, [])

    def send_message(self, circle_id: str, message_data: Dict) -> Dict:
        if circle_id not in self.messages:
            self.messages[circle_id] = []
            
        new_message = {
            "id": f"msg_{len(self.messages[circle_id]) + 1}",
            "user_id": message_data.get("user_id"),
            "username": message_data.get("username"),
            "content": message_data.get("content"),
            "timestamp": datetime.now().isoformat(),
            "is_anonymous": message_data.get("is_anonymous", False)
        }
        
        self.messages[circle_id].append(new_message)
        return new_message

peer_circle_service = PeerCircleService()

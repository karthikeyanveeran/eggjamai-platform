from typing import Dict, List, Optional

class ParentMediationService:
    def __init__(self):
        self.templates = [
            {
                "id": 1,
                "situation": "Discussing Grades",
                "original": "My grades are bad and it's your fault for pressuring me!",
                "improved": "I'm struggling with my grades and feeling overwhelmed by the pressure. Can we talk about what support I need?"
            },
            {
                "id": 2,
                "situation": "Setting Boundaries",
                "original": "Stop controlling everything I do!",
                "improved": "I appreciate your concern, but I'd like more independence in some areas. Can we discuss which decisions I can make on my own?"
            },
            {
                "id": 3,
                "situation": "Asking for Help",
                "original": "I can't handle this anymore.",
                "improved": "I'm feeling really stressed and could use your support. Can we talk about what's been difficult for me?"
            }
        ]

    def analyze_tone(self, message: str) -> Dict:
        lower_text = message.lower()
        aggressive = ['fault', 'never', 'always', 'hate', 'stupid']
        defensive = ['but', 'not my fault', 'you said']
        open_words = ['feel', 'need', 'help', 'understand', 'together']
        
        if any(w in lower_text for w in aggressive):
            return {"type": "aggressive", "color": "#ef4444", "label": "🔴 Aggressive"}
        elif any(w in lower_text for w in defensive):
            return {"type": "defensive", "color": "#f59e0b", "label": "🟡 Defensive"}
        elif any(w in lower_text for w in open_words):
            return {"type": "constructive", "color": "#10b981", "label": "🟢 Constructive"}
        
        return {"type": "neutral", "color": "#6b7280", "label": "⚪ Neutral"}

    def improve_message(self, message: str) -> Dict:
        # Simple rule-based improvement
        improved = message
        improved = improved.replace("your fault", "the situation")
        improved = improved.replace("you never", "sometimes I notice")
        improved = improved.replace("you always", "often")
        improved = improved.replace("I hate", "I find it challenging")
        
        if "i feel" not in improved.lower():
            improved = f"I feel {improved}"
            
        return {
            "original": message,
            "improved": improved,
            "changes": ["Softened language", "Added 'I feel' statement"]
        }

    def get_templates(self) -> List[Dict]:
        return self.templates

parent_mediation_service = ParentMediationService()

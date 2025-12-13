from typing import List, Tuple
from models.assessment import (
    AssessmentQuestion, AssessmentAnswer, AssessmentType, 
    SeverityLevel, AssessmentResult
)
from datetime import datetime
import uuid


class AssessmentService:
    """Service for mental health assessments (PHQ-9, GAD-7)."""
    
    # PHQ-9 Questions (Depression Screening)
    PHQ9_QUESTIONS = [
        "Little interest or pleasure in doing things",
        "Feeling down, depressed, or hopeless",
        "Trouble falling or staying asleep, or sleeping too much",
        "Feeling tired or having little energy",
        "Poor appetite or overeating",
        "Feeling bad about yourself - or that you are a failure or have let yourself or your family down",
        "Trouble concentrating on things, such as reading or watching television",
        "Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
        "Thoughts that you would be better off dead, or of hurting yourself in some way"
    ]
    
    # GAD-7 Questions (Anxiety Screening)
    GAD7_QUESTIONS = [
        "Feeling nervous, anxious, or on edge",
        "Not being able to stop or control worrying",
        "Worrying too much about different things",
        "Trouble relaxing",
        "Being so restless that it is hard to sit still",
        "Becoming easily annoyed or irritable",
        "Feeling afraid, as if something awful might happen"
    ]
    
    RESPONSE_OPTIONS = [
        "Not at all (0)",
        "Several days (1)",
        "More than half the days (2)",
        "Nearly every day (3)"
    ]
    
    def get_questions(self, assessment_type: AssessmentType) -> List[AssessmentQuestion]:
        """Get questions for an assessment type."""
        if assessment_type == AssessmentType.PHQ9:
            questions = self.PHQ9_QUESTIONS
        elif assessment_type == AssessmentType.GAD7:
            questions = self.GAD7_QUESTIONS
        else:
            return []
        
        return [
            AssessmentQuestion(
                id=i + 1,
                question=q,
                options=self.RESPONSE_OPTIONS
            )
            for i, q in enumerate(questions)
        ]
    
    def calculate_score(
        self, 
        assessment_type: AssessmentType,
        answers: List[AssessmentAnswer]
    ) -> Tuple[int, SeverityLevel, str, List[str], bool]:
        """
        Calculate assessment score and provide interpretation.
        
        Returns:
            (total_score, severity_level, interpretation, recommendations, needs_help)
        """
        total_score = sum(answer.score for answer in answers)
        
        if assessment_type == AssessmentType.PHQ9:
            return self._interpret_phq9(total_score)
        elif assessment_type == AssessmentType.GAD7:
            return self._interpret_gad7(total_score)
        else:
            return (0, SeverityLevel.MINIMAL, "Unknown assessment type", [], False)
    
    def _interpret_phq9(self, score: int) -> Tuple[SeverityLevel, str, List[str], bool]:
        """Interpret PHQ-9 depression score."""
        if score >= 20:
            severity = SeverityLevel.SEVERE
            interpretation = "Your responses indicate severe depression symptoms."
            recommendations = [
                "Immediate professional help is strongly recommended",
                "Consider talking to a psychiatrist or mental health professional",
                "Reach out to your school counselor immediately",
                "Don't hesitate to contact crisis helplines if needed"
            ]
            needs_help = True
        elif score >= 15:
            severity = SeverityLevel.MODERATELY_SEVERE
            interpretation = "Your responses suggest moderately severe depression."
            recommendations = [
                "Professional mental health support is recommended",
                "Schedule an appointment with a counselor or therapist",
                "Practice self-care and maintain social connections",
                "Consider evidence-based therapies like CBT"
            ]
            needs_help = True
        elif score >= 10:
            severity = SeverityLevel.MODERATE
            interpretation = "Your responses indicate moderate depression symptoms."
            recommendations = [
                "Consider talking to a school counselor or therapist",
                "Engage in regular physical activity and healthy sleep habits",
                "Stay connected with supportive friends and family",
                "Practice mindfulness and relaxation techniques"
            ]
            needs_help = True
        elif score >= 5:
            severity = SeverityLevel.MILD
            interpretation = "Your responses suggest mild depression symptoms."
            recommendations = [
                "Monitor your mood and symptoms over time",
                "Practice self-care: exercise, sleep, healthy eating",
                "Stay socially connected",
                "Consider talking to someone if symptoms persist"
            ]
            needs_help = False
        else:
            severity = SeverityLevel.MINIMAL
            interpretation = "Your responses indicate minimal or no depression symptoms."
            recommendations = [
                "Continue your healthy habits",
                "Stay aware of your mental health",
                "Reach out for support if things change"
            ]
            needs_help = False
        
        return (severity, interpretation, recommendations, needs_help)
    
    def _interpret_gad7(self, score: int) -> Tuple[SeverityLevel, str, List[str], bool]:
        """Interpret GAD-7 anxiety score."""
        if score >= 15:
            severity = SeverityLevel.SEVERE
            interpretation = "Your responses indicate severe anxiety symptoms."
            recommendations = [
                "Professional mental health support is strongly recommended",
                "Consider seeing a psychiatrist or therapist specializing in anxiety",
                "Learn and practice anxiety management techniques",
                "Reach out to your school counselor"
            ]
            needs_help = True
        elif score >= 10:
            severity = SeverityLevel.MODERATE
            interpretation = "Your responses suggest moderate anxiety."
            recommendations = [
                "Consider talking to a mental health professional",
                "Practice relaxation techniques (deep breathing, meditation)",
                "Regular exercise can help manage anxiety",
                "Limit caffeine and maintain good sleep habits"
            ]
            needs_help = True
        elif score >= 5:
            severity = SeverityLevel.MILD
            interpretation = "Your responses indicate mild anxiety symptoms."
            recommendations = [
                "Practice stress management techniques",
                "Maintain regular sleep schedule and exercise",
                "Talk to trusted friends or family",
                "Monitor symptoms and seek help if they worsen"
            ]
            needs_help = False
        else:
            severity = SeverityLevel.MINIMAL
            interpretation = "Your responses indicate minimal or no anxiety symptoms."
            recommendations = [
                "Continue practicing healthy coping strategies",
                "Stay mindful of your mental health",
                "Reach out for support if needed"
            ]
            needs_help = False
        
        return (severity, interpretation, recommendations, needs_help)


# Global instance
assessment_service = AssessmentService()

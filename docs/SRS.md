# **Software Requirements Specification (SRS)**

# **EggJam.ai - Student Mental Health Platform**

**Version:** 1.0  
**Date:** December 2023  
**Author:** Product Team  
**Status:** Development

**Development Team:**

- Author: Karthikeyan Veeran
- Developer: Karthikeyan Veeran
- Email: mydearkarthikeyan@gmail.com
- Date of Development: From November 2023 onwards

---

## **Table of Contents**

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [System Features](#3-system-features)
4. [External Interface Requirements](#4-external-interface-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Other Requirements](#6-other-requirements)

---

## **1. Introduction**

### **1.1 Purpose**

EggJam.ai is an AI-powered mental health platform designed specifically for Indian students across all age groups and educational levels. The platform provides accessible, culturally-sensitive mental health support through conversational AI, personalized interventions, and connection to human resources.

### **1.2 Scope**

The system will provide:

- AI-powered mental health conversations in all major Indian languages
- Age-appropriate therapeutic interventions
- Crisis detection and intervention protocols
- School integration and counselor dashboards
- Progress tracking and analytics
- Multi-platform accessibility (web, mobile, voice)

### **1.3 Definitions & Acronyms**

- **AI Agent**: Conversational AI providing mental health support
- **CBT**: Cognitive Behavioral Therapy
- **STT**: Speech-to-Text
- **TTS**: Text-to-Speech
- **LLM**: Large Language Model
- **PII**: Personally Identifiable Information
- **FERPA**: Family Educational Rights and Privacy Act

### **1.4 References**

- Indian Mental Healthcare Act, 2017
- NEP 2020 Mental Health Guidelines
- APA Telepsychology Guidelines
- GDPR/Data Protection Standards

---

## **2. Overall Description**

### **2.1 Product Perspective**

EggJam.ai operates as a standalone platform integrating with school systems, healthcare providers, and emergency services.

### **2.2 Product Functions**

- Multi-lingual AI mental health support
- Crisis detection and intervention
- Progress monitoring and reporting
- School counselor coordination
- Parental involvement (where appropriate)
- Resource connection and referral

### **2.3 User Characteristics**

| User Type             | Characteristics                                   | Primary Needs                                            |
| --------------------- | ------------------------------------------------- | -------------------------------------------------------- |
| **Students (3-12)**   | Limited attention span, simple language needs     | Emotion recognition, basic coping skills                 |
| **Students (13-18)**  | Academic stress, social anxiety, identity issues  | CBT techniques, peer support, academic stress management |
| **College Students**  | Career anxiety, relationship issues, independence | Career counseling, advanced therapy, life skills         |
| **School Counselors** | Overworked, need efficiency                       | Student monitoring, alert system, intervention tools     |
| **Parents**           | Concerned, need reassurance                       | Progress updates, resource guidance, warning signs       |
| **Administrators**    | Compliance, reporting needs                       | Analytics, compliance reports, ROI metrics               |

### **2.4 Constraints**

- Must support all 22 scheduled Indian languages
- Compliance with Indian data protection laws
- Integration with existing school systems
- Bandwidth limitations in rural areas
- Cultural sensitivity requirements

### **2.5 Assumptions**

- Schools will provide counselor integration
- Parents will consent for under-18 usage
- Emergency services are available regionally
- Internet connectivity is generally available

---

## **3. System Features**

### **3.1 Module 1: AI Conversation Core**

#### **3.1.1 Multi-Lingual Voice AI**

**Requirements:**

- R1.1.1: Support real-time voice conversations in 22 Indian languages
- R1.1.2: Auto-detect user's preferred language
- R1.1.3: Code-mixing support (Hindi-English, Tamil-English, etc.)
- R1.1.4: Emotion detection from voice tone
- R1.1.5: Background noise suppression

#### **3.1.2 Therapeutic AI Models**

**Requirements:**

- R1.2.1: Age-appropriate conversation styles
- R1.2.2: Evidence-based therapeutic techniques (CBT, DBT, Mindfulness)
- R1.2.3: Cultural adaptation for Indian context
- R1.2.4: Personality matching (extrovert/introvert preferences)
- R1.2.5: Session memory and context retention

### **3.2 Module 2: Safety & Crisis Management**

#### **3.2.1 Crisis Detection**

**Requirements:**

- R2.1.1: Real-time risk assessment from conversation content
- R2.1.2: Multi-level risk scoring (low, medium, high, critical)
- R2.1.3: Regional crisis resource database
- R2.1.4: Escalation protocols based on risk level
- R2.1.5: False positive minimization

#### **3.2.2 Intervention System**

**Requirements:**

- R2.2.1: Immediate crisis de-escalation techniques
- R2.2.2: Connection to local emergency services
- R2.2.3: School counselor alert system
- R2.2.4: Parent notification (configurable)
- R2.2.5: Follow-up protocol implementation

### **3.3 Module 3: User Management & Profiles**

#### **3.3.1 Student Profiles**

**Requirements:**

- R3.1.1: Age-appropriate profile creation
- R3.1.2: Academic level and stress tracking
- R3.1.3: Mental health history (optional)
- R3.1.4: Preference and learning style storage
- R3.1.5: Progress and achievement tracking

#### **3.3.2 Access Control**

**Requirements:**

- R3.2.1: Role-based permissions (student, counselor, admin, parent)
- R3.2.2: Age-based content filtering
- R3.2.3: Parental consent management
- R3.2.4: Single sign-on with school systems
- R3.2.5: Privacy level configurations

### **3.4 Module 4: Assessment & Analytics**

#### **3.4.1 Mental Health Assessment**

**Requirements:**

- R4.1.1: PHQ-9, GAD-7 adaptation for Indian context
- R4.1.2: Age-appropriate assessment tools
- R4.1.3: Continuous mood tracking
- R4.1.4: Academic performance correlation
- R4.1.5: Progress visualization

#### **3.4.2 Analytics Dashboard**

**Requirements:**

- R4.2.1: School-wide mental health trends
- R4.2.2: Early warning system for at-risk students
- R4.2.3: Intervention effectiveness tracking
- R4.2.4: Regional mental health insights
- R4.2.5: Custom report generation

### **3.5 Module 5: Content & Interventions**

#### **3.5.1 Therapeutic Content Library**

**Requirements:**

- R5.1.1: Age-specific coping strategies
- R5.1.2: Cultural-appropriate mindfulness exercises
- R5.1.3: Academic stress management techniques
- R5.1.4: Social skills training modules
- R5.1.5: Parent guidance resources

#### **3.5.2 Personalized Interventions**

**Requirements:**

- R5.2.1: Custom therapy plans based on assessment
- R5.2.2: Progress-adaptive content delivery
- R5.2.3: Gamified engagement elements
- R5.2.4: Peer support group matching
- R5.2.5: Skill-building exercises

### **3.6 Module 6: School Integration**

#### **3.6.1 Counselor Dashboard**

**Requirements:**

- R6.1.1: Student risk level overview
- R6.1.2: Session notes and history
- R6.1.3: Intervention planning tools
- R6.1.4: Parent communication system
- R6.1.5: Resource allocation optimization

#### **3.6.2 Administration Tools**

**Requirements:**

- R6.2.1: School-wide analytics
- R6.2.2: Compliance reporting
- R6.2.3: Staff management
- R6.2.4: System configuration
- R6.2.5: Integration with school management systems

### **3.7 Module 7: Multi-Platform Delivery**

#### **3.7.1 Mobile Application**

**Requirements:**

- R7.1.1: iOS and Android native apps
- R7.1.2: Offline functionality for basic features
- R7.1.3: Push notifications for check-ins
- R7.1.4: Low-bandwidth optimization
- R7.1.5: Voice-only interface option

#### **3.7.2 Web Platform**

**Requirements:**

- R7.2.1: Responsive design for all devices
- R7.2.2: Progressive Web App (PWA) capabilities
- R7.2.3: Cross-browser compatibility
- R7.2.4: Accessibility compliance (WCAG 2.1)
- R7.2.5: Performance optimization

---

## **4. External Interface Requirements**

### **4.1 User Interfaces**

**Web Interface:**

- Dashboard with mental health metrics
- Conversation interface with AI agent
- Progress tracking visualization
- Resource library access

**Mobile Interface:**

- Simplified conversation-first design
- Quick access to crisis resources
- Offline coping strategies
- Push notification system

**Voice Interface:**

- Hands-free conversation mode
- Voice commands for quick help
- Audio-based exercises and meditations

### **4.2 Hardware Interfaces**

- Microphone/speaker for voice conversations
- Camera for video sessions (future)
- Mobile device sensors for activity tracking

### **4.3 Software Interfaces**

**AI Services Integration:**

- Pipecat.ai/Agora for voice infrastructure (Both are required)
- OpenAI/GPT-4 for conversation AI
- Google Cloud Speech for STT/TTS
- Azure Face API for emotion detection (future)

**School Systems Integration:**

- Learning Management Systems (LMS)
- Student Information Systems (SIS)
- Single Sign-On (SSO) providers

**Emergency Services:**

- Local crisis helplines database
- Emergency contact systems
- Hospital and clinic referral networks

### **4.4 Communication Interfaces**

- HTTPS/REST APIs for web services
- WebSocket for real-time communication
- SMS for emergency notifications
- Email for reports and updates

---

## **5. Non-Functional Requirements**

### **5.1 Performance Requirements**

- Response time: <200ms for AI responses
- Voice latency: <100ms for real-time conversation
- System availability: 99.9% uptime
- Concurrent users: Support 10,000+ simultaneous conversations
- Data processing: Real-time analytics with <1 second delay

### **5.2 Safety Requirements**

- Zero data leakage of sensitive conversations
- Immediate crisis response within 60 seconds
- Redundant systems for high-risk scenarios
- Regular security audits and penetration testing
- Emergency service integration testing

### **5.3 Security Requirements**

- End-to-end encryption for all conversations
- HIPAA/FERPA compliance for data protection
- Regular security patches and updates
- Multi-factor authentication for staff accounts
- Data anonymization for analytics

### **5.4 Software Quality Attributes**

- **Reliability:** 99.9% service availability
- **Maintainability:** Modular architecture with clear APIs
- **Portability:** Cross-platform compatibility
- **Scalability:** Horizontal scaling capability
- **Usability:** Intuitive interface for all age groups

### **5.5 Cultural Requirements**

- Respect for regional customs and traditions
- Age-appropriate content for different student groups
- Gender-sensitive conversation approaches
- Family-inclusive where culturally appropriate
- Religious and cultural neutrality

---

## **6. Other Requirements**

### **6.1 Development Requirements**

**Technology Stack:**

- **Backend:** Python/FastAPI, Redis, PostgreSQL
- **AI Infrastructure:** Pipecat.ai, OpenAI, Google Speech
- **Frontend:** React Native, React.js
- **DevOps:** Docker, Kubernetes, AWS/Azure
- **Monitoring:** Prometheus, Grafana, ELK Stack

### **6.2 Legal and Compliance**

- Indian Mental Healthcare Act compliance
- Data protection and privacy laws adherence
- Minor protection and consent requirements
- Educational institution compliance standards
- Medical device regulations (if applicable)

### **6.3 Documentation Requirements**

- User manuals for all stakeholder groups
- API documentation for integration partners
- Technical documentation for developers
- Compliance and audit documentation
- Training materials for school staff

### **6.4 Training Requirements**

- Counselor training program
- Administrator orientation sessions
- Parent guidance materials
- Student onboarding experience
- Technical support training

### **6.5 Deployment Requirements**

- Cloud-based SaaS deployment model
- On-premise option for sensitive environments
- Mobile app store distribution
- School district rollout planning
- Phased deployment strategy

---

## **Appendices**

### **Appendix A: Supported Indian Languages**

1. Hindi (हिन्दी)
2. Bengali (বাংলা)
3. Telugu (తెలుగు)
4. Marathi (मराठी)
5. Tamil (தமிழ்)
6. Urdu (اردو)
7. Gujarati (ગુજરાતી)
8. Kannada (ಕನ್ನಡ)
9. Malayalam (മലയാളം)
10. Odia (ଓଡ଼ିଆ)
11. Punjabi (ਪੰਜਾਬੀ)
12. Assamese (অসমীয়া)
13. Maithili (मैथिली)
14. Santali (संताली)
15. Kashmiri (कॉशुर)
16. Nepali (नेपाली)
17. Sindhi (सिन्धी)
18. Konkani (कोंकणी)
19. Dogri (डोगरी)
20. Manipuri (মৈতৈলোন্)
21. Bodo (बड़ो)
22. Sanskrit (संस्कृतम्)

### **Appendix B: Crisis Response Protocol**

**Immediate Response Flow:**

1. Risk detection and verification
2. Crisis de-escalation attempt
3. Emergency contact notification
4. Professional service connection
5. Follow-up and monitoring

### **Appendix C: Data Retention Policy**

- Conversation data: 30 days (encrypted)
- Assessment data: 1 year (anonymized after 6 months)
- User profiles: Active + 2 years
- Analytics data: Indefinite (fully anonymized)
- Crisis intervention records: 7 years (secured)

---

**Document Approval:**

- Product Manager: ********\_\_\_\_********
- Technical Lead: ********\_\_\_\_********
- Legal Counsel: ********\_\_\_\_********
- Security Officer: ********\_\_\_\_********

**Revision History:**
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Dec 2023 | Product Team | Initial SRS Draft |

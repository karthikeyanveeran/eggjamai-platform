# 🎭 EggJam.ai - Demo Credentials & Testing Guide

## 📋 Quick Start

### 1. Initialize Database & Seed Demo Data

```bash
# Navigate to backend directory
cd backend

# Install dependencies (if not already done)
pip install -r requirements.txt

# Initialize database tables
python init_db.py

# Seed demo data
python seed_demo_data.py
```

### 2. Start Backend Server

```bash
# In backend directory
python main.py
# or
uvicorn main:app --reload
```

Backend will run at: **http://localhost:8000**

### 3. Start Frontend Server

```bash
# In frontend directory
cd ../frontend
npm run dev
```

Frontend will run at: **http://localhost:5173**

---

## 🔐 Demo Credentials

All demo accounts use the password: **`demo123`**

### 👨‍🎓 Student Accounts

| Email               | Name          | Grade | Use Case                  |
| ------------------- | ------------- | ----- | ------------------------- |
| `student@demo.com`  | Alex Student  | 10    | Primary student testing   |
| `student2@demo.com` | Sarah Johnson | 9     | Secondary student         |
| `student3@demo.com` | Michael Chen  | 11    | Advanced features testing |

**Student Features to Test:**

- ✅ AI Chat sessions
- ✅ Mood tracking
- ✅ Mental health assessments (GAD-7, PHQ-9)
- ✅ Video chat with counselors
- ✅ Breathing exercises
- ✅ Daily challenges
- ✅ Achievements & gamification
- ✅ Peer circles
- ✅ Digital detox tools
- ✅ Exam anxiety therapy
- ✅ Academic tutoring
- ✅ Purpose discovery

---

### 👨‍👩‍👧 Parent Accounts

| Email              | Name          | Use Case               |
| ------------------ | ------------- | ---------------------- |
| `parent@demo.com`  | John Parent   | Primary parent testing |
| `parent2@demo.com` | Mary Williams | Multi-parent scenarios |

**Parent Features to Test:**

- ✅ View child's progress
- ✅ Mood trend analytics
- ✅ Parent-child mediation tools
- ✅ Communication with school
- ✅ Alert notifications
- ✅ Resource library access

---

### 🏫 School Admin Account

| Email            | Name                | Role                 |
| ---------------- | ------------------- | -------------------- |
| `admin@demo.com` | Dr. Principal Kumar | School Administrator |

**Admin Features to Test:**

- ✅ School-wide dashboard
- ✅ Student risk monitoring
- ✅ Counselor workload management
- ✅ Analytics & reports
- ✅ Trend analysis
- ✅ Export data (PDF/CSV)
- ✅ Student filtering & search
- ✅ Alert management

---

### 🎓 LD Specialist Account

| Email                 | Name                | Role                           |
| --------------------- | ------------------- | ------------------------------ |
| `specialist@demo.com` | Dr. Lisa Specialist | Learning Disability Specialist |

**LD Specialist Features to Test:**

- ✅ Student assessments
- ✅ IEP management
- ✅ Progress tracking
- ✅ Specialized interventions
- ✅ Parent communication

---

### 🩺 Counselor Account

| Email                | Name               | Role             |
| -------------------- | ------------------ | ---------------- |
| `counselor@demo.com` | Ms. Emma Counselor | School Counselor |

**Counselor Features to Test:**

- ✅ Student case management
- ✅ Crisis intervention
- ✅ Session scheduling
- ✅ Video consultations
- ✅ Progress notes

---

### 👨‍🏫 Teacher Account

| Email              | Name              | Role    |
| ------------------ | ----------------- | ------- |
| `teacher@demo.com` | Mr. David Teacher | Teacher |

**Teacher Features to Test:**

- ✅ Student wellbeing overview
- ✅ Classroom mood trends
- ✅ Referral system
- ✅ Resource sharing

---

## 🧪 Testing Workflows

### Workflow 1: Student Mental Health Journey

1. **Login as Student** (`student@demo.com`)
2. **Complete Initial Assessment**
   - Navigate to Assessments
   - Take GAD-7 (Anxiety) assessment
   - Take PHQ-9 (Depression) assessment
3. **Track Daily Mood**
   - Go to Mood Tracker
   - Log current mood
   - Add notes
4. **Chat with AI**
   - Open AI Chat
   - Discuss feelings/concerns
   - Test crisis detection
5. **Complete Breathing Exercise**
   - Navigate to Breathing
   - Follow guided exercise
6. **Join Peer Circle**
   - Go to Peer Circles
   - Join a support group
7. **Check Achievements**
   - View earned badges
   - Track progress

### Workflow 2: Parent Monitoring

1. **Login as Parent** (`parent@demo.com`)
2. **View Child Dashboard**
   - Check mood trends
   - Review recent activities
3. **Use Parent Mediator**
   - Navigate to Mediator
   - Practice communication scenarios
4. **Review Alerts**
   - Check any risk notifications
   - Review recommendations

### Workflow 3: School Admin Analytics

1. **Login as Admin** (`admin@demo.com`)
2. **Review School Overview**
   - Check total students
   - Monitor high-risk students
   - View engagement metrics
3. **Filter Students**
   - Use risk level filters
   - Search by grade
   - View individual details
4. **Export Reports**
   - Generate PDF report
   - Export CSV data
5. **Monitor Counselor Workload**
   - Check counselor capacity
   - View active cases

### Workflow 4: Crisis Detection & Response

1. **Login as Student** (`student@demo.com`)
2. **Trigger Crisis Alert**
   - In AI Chat, mention self-harm or suicidal thoughts
   - System should detect and show crisis alert
3. **Review Crisis Resources**
   - Check emergency contacts
   - View support options
4. **Login as Admin** (`admin@demo.com`)
5. **Check Alert Dashboard**
   - Verify crisis alert was logged
   - Review intervention options

---

## 🎯 Key Features to Test

### Authentication & Authorization

- ✅ Login with different roles
- ✅ Logout functionality
- ✅ Session persistence
- ✅ Role-based access control

### UI/UX Elements

- ✅ Responsive design (resize browser)
- ✅ Sidebar navigation
- ✅ Smooth animations
- ✅ Loading states
- ✅ Error handling
- ✅ Form validation

### Real-time Features (if implemented)

- ✅ Live chat
- ✅ Video calls (Agora)
- ✅ Notifications
- ✅ Socket.io connections

### Data Visualization

- ✅ Mood trend charts
- ✅ Progress graphs
- ✅ Analytics dashboards
- ✅ Risk distribution charts

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to backend"

**Solution:**

- Ensure backend is running on port 8000
- Check `.env` file in frontend has correct `VITE_API_URL`
- Verify CORS settings in backend

### Issue: "Login fails with 401"

**Solution:**

- Ensure demo data was seeded successfully
- Check password is exactly `demo123`
- Verify database connection

### Issue: "CSS not loading"

**Solution:**

- Clear browser cache
- Restart Vite dev server
- Check for CSS import errors in console

### Issue: "Video chat not working"

**Solution:**

- Add Agora App ID to `.env`
- Check camera/microphone permissions
- Verify Agora SDK integration

---

## 📊 Testing Checklist

### Frontend Testing

- [ ] All pages load without errors
- [ ] Navigation works smoothly
- [ ] Forms validate correctly
- [ ] Responsive on mobile/tablet
- [ ] Animations are smooth
- [ ] No console errors

### Backend Testing

- [ ] API endpoints respond correctly
- [ ] Authentication works
- [ ] Database queries execute
- [ ] Error handling works
- [ ] CORS configured properly

### Integration Testing

- [ ] Frontend connects to backend
- [ ] Data saves to database
- [ ] Real-time features work
- [ ] File uploads work (if applicable)

### Role-Based Testing

- [ ] Students see student features only
- [ ] Parents see parent dashboard
- [ ] Admins see admin panel
- [ ] Proper access restrictions

---

## 🚀 Performance Testing

### Load Testing Scenarios

1. **Multiple concurrent users**

   - Open 5+ browser tabs
   - Login with different accounts
   - Navigate simultaneously

2. **Data-heavy operations**

   - Load dashboards with lots of data
   - Export large reports
   - View analytics with date ranges

3. **Real-time features**
   - Multiple chat sessions
   - Simultaneous video calls
   - Live notifications

---

## 📝 Feedback & Bug Reporting

When testing, note:

- **What you were doing** (steps to reproduce)
- **What you expected** (expected behavior)
- **What happened** (actual behavior)
- **Browser & OS** (environment details)
- **Screenshots** (if applicable)

---

## 🎨 Design Review Points

### Visual Quality

- [ ] Colors are consistent
- [ ] Typography is readable
- [ ] Spacing is uniform
- [ ] Icons are clear
- [ ] Images load properly

### User Experience

- [ ] Navigation is intuitive
- [ ] Actions have feedback
- [ ] Error messages are helpful
- [ ] Loading states are clear
- [ ] Success confirmations work

### Accessibility

- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast is sufficient
- [ ] Focus indicators visible
- [ ] ARIA labels present

---

## 🔄 Reset Demo Data

If you need to reset the demo data:

```bash
# In backend directory
python -c "from database import engine, Base; Base.metadata.drop_all(bind=engine)"
python init_db.py
python seed_demo_data.py
```

---

## 📞 Support

For issues or questions:

- Check console logs (F12 in browser)
- Review backend logs
- Check network tab for API errors
- Verify environment variables

---

**Happy Testing! 🎉**

Remember: All demo accounts use password `demo123`

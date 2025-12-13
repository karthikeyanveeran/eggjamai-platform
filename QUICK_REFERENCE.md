# 🎯 Quick Reference - Demo Credentials

## Password for ALL accounts: `demo123`

### Quick Login Credentials

```
⭐ Platform Admin: platformadmin@demo.com / demo123  (System-wide access)

Student:          student@demo.com       / demo123
Parent:           parent@demo.com        / demo123
School Admin:     admin@demo.com         / demo123
LD Specialist:    specialist@demo.com    / demo123
Counselor:        counselor@demo.com     / demo123
Teacher:          teacher@demo.com       / demo123
```

### URLs

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

### Quick Commands

```bash
# Start Backend
cd backend && python main.py

# Start Frontend
cd frontend && npm run dev

# Add Platform Admin (if needed)
cd backend && python add_platform_admin.py

# Reset Database
cd backend
python -c "from database import engine, Base; Base.metadata.drop_all(bind=engine)"
python init_db.py
python seed_demo_data.py
python add_platform_admin.py
```

### Total Demo Accounts: 10

- 1 Platform Admin (system-wide)
- 3 Students
- 2 Parents
- 1 School Admin
- 1 LD Specialist
- 1 Counselor
- 1 Teacher

### Files Created

- ✅ `DEMO_SETUP_COMPLETE.md` - Full setup summary
- ✅ `DEMO_CREDENTIALS.md` - Detailed testing guide
- ✅ `QUICK_START.md` - Setup instructions
- ✅ `seed_demo_data.py` - Demo data seeder
- ✅ `add_platform_admin.py` - Platform admin creator
- ✅ All frontend CSS files
- ✅ App.jsx with routing
- ✅ SQLite database configured

**Everything is ready to test!** 🚀

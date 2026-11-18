from sqlalchemy import func
from sqlalchemy.orm import Session
from app.database.session import engine, Base, SessionLocal
from app.models.admin import Admin
from app.models.event import Event
from app.models.member import Member
from app.models.gallery import GalleryImage
from app.models.certificate import Certificate
from app.models.activity import Activity, Achievement
from app.models.settings import Announcement, WebsiteSetting
from app.core.config import settings
from app.core.security import hash_password

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # 1. Safe, Idempotent, Env-Driven Admin Seeding (Never logs passwords or secrets)
        if settings.ADMIN_USERNAME and settings.ADMIN_EMAIL and settings.ADMIN_PASSWORD:
            existing_admin = db.query(Admin).filter(
                (func.lower(Admin.username) == settings.ADMIN_USERNAME.lower()) |
                (func.lower(Admin.email) == settings.ADMIN_EMAIL.lower())
            ).first()

            if not existing_admin and db.query(Admin).count() == 0:
                admin = Admin(
                    username=settings.ADMIN_USERNAME,
                    email=settings.ADMIN_EMAIL,
                    hashed_password=hash_password(settings.ADMIN_PASSWORD),
                    full_name=settings.ADMIN_FULL_NAME,
                    role="SUPER_ADMIN",
                    is_active=True
                )
                db.add(admin)
                db.commit()
                print(f"[+] Provisioned initial administrator account ({settings.ADMIN_USERNAME})")
            elif existing_admin and settings.ENVIRONMENT == "development" and settings.RESET_ADMIN_ON_STARTUP:
                existing_admin.username = settings.ADMIN_USERNAME
                existing_admin.email = settings.ADMIN_EMAIL
                existing_admin.hashed_password = hash_password(settings.ADMIN_PASSWORD)
                existing_admin.is_active = True
                db.commit()
                print(f"[+] Synchronized development administrator credentials ({settings.ADMIN_USERNAME})")
        else:
            if db.query(Admin).count() == 0:
                print("[!] No admin account exists. Configure ADMIN_USERNAME, ADMIN_EMAIL, and ADMIN_PASSWORD to provision one.")

        # 2. Seed Official Events
        if db.query(Event).count() == 0:
            events_data = [
                {
                    "title": "GDG on Campus – RIT Hassan Inauguration",
                    "slug": "gdg-club-inauguration",
                    "category": "CLUB INAUGURATION",
                    "description": "The official inauguration marked the beginning of a student-driven developer community focused on technology, innovation, collaboration, and practical learning.",
                    "event_date": "2026-09-23",
                    "event_time": "10:00 AM - 01:00 PM",
                    "venue": "Civil Block Seminar Hall, RIT Hassan",
                    "registration_deadline": "2026-09-22",
                    "max_participants": 200,
                    "current_participants": 180,
                    "agenda": "• Official inauguration ceremony\n• Introduction to GDG on Campus\n• Club vision and mission presentation\n• Introduction of faculty and student coordinators\n• Keynote on student developer opportunities\n• Networking and Q&A session",
                    "speakers": "Dr. Suresha D (HOD-CSE), Prof. Dinesh S (Event Coordinator)",
                    "coordinators": "Yashawantha H M (Student Lead), Yashwanth Gowda S N",
                    "eligibility": "Open to all students and faculty of Rajeev Institute of Technology",
                    "rules": "Formal college attire required. Carry college ID card.",
                    "faqs": '[{"q": "Was there any registration fee?", "a": "No, GDG on Campus events are completely free for all students."}, {"q": "Who attended?", "a": "Students across all CSE and engineering departments along with distinguished faculty."}]',
                    "poster_url": "https://kcrr7fi9yiqpfvun.public.blob.vercel-storage.com/gdg-cms/23808f2a-751f-4d68-9ee8-fcdbee15ce81.jpg",
                    "is_published": True,
                    "registration_open": False
                },
                {
                    "title": "CODESTORM 2026 – NOVEMBER EDITION",
                    "slug": "codestorm-2026",
                    "category": "TECHNICAL CHALLENGE",
                    "description": "A community-driven technical challenge encouraging students to grow their technical knowledge, creativity, problem-solving abilities, teamwork, and innovation.\n\n🚀 CODESTORM 2026 – Coding Competition 💻\nThink. Code. Compete. Conquer. Challenge yourself, compete with peers, and build real-world software solutions.",
                    "event_date": "2026-11-18",
                    "event_time": "09:00 AM - 05:00 PM",
                    "venue": "ME Block, Seminar Hall, RIT Hassan",
                    "registration_deadline": "2026-11-18",
                    "max_participants": 150,
                    "current_participants": 74,
                    "agenda": "• 09:00 AM - Registration & Welcome Address\n• 09:30 AM - Problem Statements Released\n• 10:00 AM - Round 1: Algorithmic & Problem Solving Sprint\n• 01:00 PM - Networking Lunch\n• 02:00 PM - Round 2: Solution Implementation & Prototype Build\n• 04:00 PM - Project Demos & Judging\n• 04:45 PM - Award Ceremony & Certificates",
                    "speakers": "Prof. Dinesh S, Dr. Suresha D, Yashawantha H M",
                    "coordinators": "Yashawantha H M (Lead Coordinator), Dhanyatha SM, Jnanavi H H",
                    "eligibility": "Individual and team participation (Up to 4 members). Beginner to advanced levels welcome.",
                    "rules": "1. Bring your own laptops with development environments set up.\n2. Original code must be pushed to a public GitHub repository.\n3. Plagiarism results in immediate disqualification.\n4. Decisions of the jury are final.",
                    "faqs": '[{"q": "Can beginners participate?", "a": "Yes! CODESTORM features tracks suited for beginners up to advanced programmers."}, {"q": "Is team participation allowed?", "a": "Yes, you can register individually or as a team of up to 4 members."}, {"q": "Will certificates be provided?", "a": "Yes, verified digital participation certificates will be awarded to all registered attendees."}]',
                    "poster_url": "https://kcrr7fi9yiqpfvun.public.blob.vercel-storage.com/gdg-cms/f3318c5c-fd2f-4555-921d-620a442832b9.jpg",
                    "is_published": True,
                    "registration_open": True
                },
                {
                    "title": "Challenge 01: Website Building Challenge",
                    "slug": "website-building-challenge",
                    "category": "WEB DEVELOPMENT",
                    "description": "Don't Just Imagine It. Build It. Launch It. Build a professional, responsive, and fully functional website that solves a real-world requirement or demonstrates an innovative idea.",
                    "event_date": "Date to be announced",
                    "event_time": "Full Day Hackathon",
                    "venue": "Computer Labs 1 & 2, CSE Department, RIT Hassan",
                    "registration_deadline": "TBD",
                    "max_participants": 100,
                    "current_participants": 0,
                    "agenda": "• Frontend UI/UX Design\n• Backend & Database Integration\n• Responsive Design Execution\n• Live Deployment on Vercel/Netlify\n• Source Code Evaluation",
                    "speakers": "Yashawantha H M (Student Lead)",
                    "coordinators": "Yashas M J, Umme Habeeba, Vikas D",
                    "eligibility": "All students interested in Frontend, Backend, or Full Stack Web Development",
                    "rules": "Modern web stacks permitted (React, Next.js, FastAPI, Node, etc.). Must be fully responsive.",
                    "faqs": '[{"q": "Can we use templates?", "a": "Original custom designs receive higher scoring for UI/UX criteria."}]',
                    "poster_url": "https://kcrr7fi9yiqpfvun.public.blob.vercel-storage.com/gdg-cms/d1ec8652-f866-4579-9f5c-fbbbcd8c6688.jpg",
                    "is_published": True,
                    "registration_open": True
                },
                {
                    "title": "Challenge 02: Real-World Problem & Solution",
                    "slug": "real-world-problem-solution",
                    "category": "INNOVATION",
                    "description": "Find a Problem. Create a Solution. Make an Impact. Identify a genuine challenge in healthcare, agriculture, smart cities, education or sustainability and propose an innovative technology-based solution.",
                    "event_date": "Date to be announced",
                    "event_time": "10:00 AM - 04:00 PM",
                    "venue": "Seminar Hall, CSE Dept, RIT Hassan",
                    "registration_deadline": "TBD",
                    "max_participants": 80,
                    "current_participants": 0,
                    "agenda": "• Problem Pitch Presentations\n• Technical Feasibility Review\n• Prototype Evaluation\n• Feedback from Faculty Mentors",
                    "speakers": "Dr. Suresha D, Prof. Dinesh S",
                    "coordinators": "Spoorthi, Muhammed Sibtain, Amrutha M",
                    "eligibility": "Open to all engineering streams",
                    "rules": "Submissions must include problem statement, architecture diagram, prototype and impact forecast.",
                    "faqs": '[{"q": "What problem domains are accepted?", "a": "Agriculture, Healthcare, Education, Traffic/Smart Cities, Women Safety, and Social Impact."}]',
                    "poster_url": "https://kcrr7fi9yiqpfvun.public.blob.vercel-storage.com/gdg-cms/debb9f86-dc30-45de-a88f-1eb80ba5bdbb.jpg",
                    "is_published": True,
                    "registration_open": True
                }
            ]
            for ev in events_data:
                db.add(Event(**ev))
            db.commit()
            print("[+] Seeded 4 official events")

        # 3. Seed 12 Authentic Team Members
        if db.query(Member).count() == 0:
            members_data = [
                {
                    "name": "Prof. Dinesh S",
                    "role": "Event Coordinator",
                    "category": "FACULTY",
                    "department": "Computer Science and Engineering",
                    "academic_year": None,
                    "bio": "Faculty Event Coordinator for GDG on Campus at Rajeev Institute of Technology, guiding students in organizing cutting-edge technical events and academic excellence.",
                    "photo_url": None,
                    "email": "dineshs@rit.ac.in",
                    "linkedin_url": None,
                    "github_url": None,
                    "sort_order": 1,
                    "is_active": True
                },
                {
                    "name": "Dr. Suresha D",
                    "role": "HEAD OF THE DEPARTMENT-CSE",
                    "category": "FACULTY",
                    "department": "Computer Science and Engineering",
                    "academic_year": None,
                    "bio": "Dr. Suresha D is Professor & Head of the Department of Computer Science and Engineering at RIT Hassan with over 20+ years of teaching and research experience. Holds B.E. from Kuvempu University, M.Tech. from VTU Belagavi, and Ph.D. in CSE from VTU Belagavi. Research focuses on Image & Video Processing, Pattern Recognition, Machine Learning, Computer Vision, and AI. Life Member of CSI and ISTE.",
                    "photo_url": "https://kcrr7fi9yiqpfvun.public.blob.vercel-storage.com/gdg-cms/3f6b8cbe-684d-48fc-a932-1ed9a9d29766.jpg",
                    "email": "hodcse@rit.ac.in",
                    "linkedin_url": None,
                    "github_url": "https://github.com/D-Suresha/D-Suresha",
                    "sort_order": 2,
                    "is_active": True
                },
                {
                    "name": "Yashawantha H M",
                    "role": "Student Lead Coordinator",
                    "category": "LEADERSHIP",
                    "department": "Computer Science and Engineering",
                    "academic_year": "Final Year",
                    "bio": "Computer Science and Engineering student passionate about Full Stack Development, Artificial Intelligence, Python, and Open Source technologies. Enjoys building innovative projects, exploring new technologies, and organizing technical community events.",
                    "photo_url": "https://kcrr7fi9yiqpfvun.public.blob.vercel-storage.com/gdg-cms/bc78e65e-cfcb-4d40-bad1-fdc910832511.png",
                    "email": "yashuhmy@gmail.com",
                    "linkedin_url": "https://www.linkedin.com/in/yashawantha-h-m-48813833a",
                    "github_url": "https://github.com/Yashawantha26",
                    "sort_order": 3,
                    "is_active": True
                },
                {
                    "name": "Yashwanth Gowda S N",
                    "role": "Student Coordinator",
                    "category": "STUDENT",
                    "department": "Computer Science and Engineering",
                    "academic_year": "3rd Year",
                    "bio": "Enthusiastic developer and student coordinator passionate about collaborative engineering, hackathons, and empowering peers through open tech.",
                    "photo_url": "https://kcrr7fi9yiqpfvun.public.blob.vercel-storage.com/gdg-cms/a086b4b5-47cb-46d5-a0a8-f1e9ae3fd5c9.png",
                    "email": "yashwanthgowdayashu689@gmail.com",
                    "linkedin_url": "https://www.linkedin.com/in/yashwanth-yashu-414b00431",
                    "github_url": "https://github.com/yashwanthgowdayashu689-yashu",
                    "sort_order": 4,
                    "is_active": True
                },
                {
                    "name": "Dhanyatha SM",
                    "role": "Student Coordinator",
                    "category": "STUDENT",
                    "department": "Computer Science and Engineering",
                    "academic_year": "3rd Year",
                    "bio": "GDG on Campus student community coordinator helping peers improve technical skills, master modern stacks, and build lasting friendships in tech.",
                    "photo_url": "https://kcrr7fi9yiqpfvun.public.blob.vercel-storage.com/gdg-cms/2c844c63-97f0-4548-b6bc-db0e2e031097.jpg",
                    "email": "dhanyasm697@gmail.com",
                    "linkedin_url": "https://www.linkedin.com/in/dhanyatha-sm-3a8104398",
                    "github_url": "https://github.com/dhanyatha005",
                    "sort_order": 5,
                    "is_active": True
                },
                {
                    "name": "Jnanavi H H",
                    "role": "Student Coordinator",
                    "category": "STUDENT",
                    "department": "Computer Science and Engineering",
                    "academic_year": "3rd Year",
                    "bio": "Enthusiastic CSE student interested in emerging tech, learning new frameworks, organizing campus coding events, and connecting developers.",
                    "photo_url": "https://kcrr7fi9yiqpfvun.public.blob.vercel-storage.com/gdg-cms/371580f1-f3a8-4d1c-9729-a857d8060801.jpg",
                    "email": "jnanavihiranna@gmail.com",
                    "linkedin_url": "https://www.linkedin.com/in/jnanavi-gowda-383148398",
                    "github_url": "https://github.com/jnanavihiranna-lab",
                    "sort_order": 6,
                    "is_active": True
                },
                {
                    "name": "Yashas M J",
                    "role": "Design Lead & Social Media Coordinator",
                    "category": "STUDENT",
                    "department": "Computer Science and Engineering",
                    "academic_year": "3rd Year",
                    "bio": "Design lead, visual storyteller, and content coordinator crafting engaging branding, poster designs, and social presence for GDG on Campus RIT.",
                    "photo_url": "https://kcrr7fi9yiqpfvun.public.blob.vercel-storage.com/gdg-cms/dafee13c-95f7-4a9d-aaa4-8cc86423f2b5.jpg",
                    "email": "yashashmj11@gmail.com",
                    "linkedin_url": "https://www.linkedin.com/in/yashas-mj-0a983834a",
                    "github_url": None,
                    "sort_order": 7,
                    "is_active": True
                },
                {
                    "name": "Amrutha M",
                    "role": "Student Coordinator",
                    "category": "STUDENT",
                    "department": "Computer Science and Engineering",
                    "academic_year": "3rd Year",
                    "bio": "Active community organizer focused on student participation, technical mentorship, and fostering an inclusive environment for women in technology.",
                    "photo_url": "https://kcrr7fi9yiqpfvun.public.blob.vercel-storage.com/gdg-cms/60e5be6c-a23d-4677-87d2-33b85a2af7d9.jpg",
                    "email": "amruthamahadevammus@gmail.com",
                    "linkedin_url": "https://www.linkedin.com/in/amrutha-mahadev-4385ba429",
                    "github_url": "https://github.com/amruthamahadevammus-hub",
                    "sort_order": 8,
                    "is_active": True
                },
                {
                    "name": "Umme Habeeba",
                    "role": "Student Coordinator",
                    "category": "STUDENT",
                    "department": "Computer Science and Engineering",
                    "academic_year": "3rd Year",
                    "bio": "Computer Science student passionate about web technologies, teamwork, and coordinating impactful educational sessions for campus developers.",
                    "photo_url": "https://kcrr7fi9yiqpfvun.public.blob.vercel-storage.com/gdg-cms/949b25a0-7696-4b09-be46-b6596d785b0a.png",
                    "email": "ummehabeeba80730@gmail.com",
                    "linkedin_url": "https://www.linkedin.com/in/umme-habeeba-4b833a3a0",
                    "github_url": "https://github.com/Habeeba908",
                    "sort_order": 9,
                    "is_active": True
                },
                {
                    "name": "Vikas D",
                    "role": "Student Coordinator",
                    "category": "STUDENT",
                    "department": "Computer Science and Engineering",
                    "academic_year": "3rd Year",
                    "bio": "Dedicated CSE student committed to building developer resources, coordinating logistics for coding challenges, and open source exploration.",
                    "photo_url": "https://kcrr7fi9yiqpfvun.public.blob.vercel-storage.com/gdg-cms/27c3c72a-31b4-4065-b3d2-475b2bd0ff56.jpg",
                    "email": "vikasdvikas04@gmail.com",
                    "linkedin_url": "https://www.linkedin.com/in/vikas-vikki-9559b0440",
                    "github_url": "https://github.com/Vikasviki04",
                    "sort_order": 10,
                    "is_active": True
                },
                {
                    "name": "Spoorthi",
                    "role": "Student Coordinator",
                    "category": "STUDENT",
                    "department": "Computer Science and Engineering",
                    "academic_year": "3rd Year",
                    "bio": "Computer Science student interested in programming, web development, machine learning, and organizing hands-on workshops.",
                    "photo_url": "https://kcrr7fi9yiqpfvun.public.blob.vercel-storage.com/gdg-cms/552c1900-b7ec-4aba-a75c-6edd6bbb7128.jpg",
                    "email": "spoorthispoorthi718@gmail.com",
                    "linkedin_url": "https://www.linkedin.com/in/spoorthi-spoorthi-765744342",
                    "github_url": None,
                    "sort_order": 11,
                    "is_active": True
                },
                {
                    "name": "Muhammed Sibtain",
                    "role": "Student Coordinator",
                    "category": "STUDENT",
                    "department": "Computer Science and Engineering",
                    "academic_year": "3rd Year",
                    "bio": "Passionate about full-stack web technologies, developer tooling, and supporting students during technical competitions and projects.",
                    "photo_url": "https://kcrr7fi9yiqpfvun.public.blob.vercel-storage.com/gdg-cms/38f7dfbd-4b21-4d3f-beed-7e102c4109a4.jpg",
                    "email": "sibtainraza575@gmail.com",
                    "linkedin_url": "https://www.linkedin.com/in/muhammed-sibtain-14149533b",
                    "github_url": "https://github.com/sibtainraza575-web",
                    "sort_order": 12,
                    "is_active": True
                }
            ]
            for m in members_data:
                db.add(Member(**m))
            db.commit()
            print("[+] Seeded 12 authentic team members")

        # 4. Seed Authentic Gallery Photographs
        if db.query(GalleryImage).count() == 0:
            gallery_data = [
                {
                    "title": "GDG On Campus – Inauguration Ceremony",
                    "description": "The GDG On Campus – RIT Hassan chapter was officially inaugurated on 23 Sept 2026 at Civil Block Seminar Hall, RIT Hassan. A new chapter of learning, building and innovating together.",
                    "category": "INAUGURATION",
                    "image_url": "https://kcrr7fi9yiqpfvun.public.blob.vercel-storage.com/gdg-cms/23808f2a-751f-4d68-9ee8-fcdbee15ce81.jpg",
                    "upload_date": "2026-09-23"
                },
                {
                    "title": "Activity Program – On Stage Launch",
                    "description": "The GDG On Campus – RIT Hassan Activity Program kick-started on stage with an inspiring address and poster unveiling for Poster Design, Pick & Speech, and Blooket Game.",
                    "category": "ACTIVITIES",
                    "image_url": "https://kcrr7fi9yiqpfvun.public.blob.vercel-storage.com/gdg-cms/d60e4e6c-bdf8-4b75-83df-00155d6b8076.jpg",
                    "upload_date": "2026-10-15"
                },
                {
                    "title": "Activity Program – Students Participation",
                    "description": "Students actively participating in the GDG On Campus – RIT Hassan Activity Program showcasing creativity, confidence, and teamwork.",
                    "category": "ACTIVITIES",
                    "image_url": "https://kcrr7fi9yiqpfvun.public.blob.vercel-storage.com/gdg-cms/1f2b8666-c500-47aa-be20-11900f162930.jpg",
                    "upload_date": "2026-10-15"
                },
                {
                    "title": "CODESTORM 2026 – Flagship Event",
                    "description": "CODESTORM 2026 – Hack Fast. Build Real. Ship Projects. Flagship coding competition organized by GDG On Campus, RIT Hassan.",
                    "category": "COMPETITIONS",
                    "image_url": "https://kcrr7fi9yiqpfvun.public.blob.vercel-storage.com/gdg-cms/debb9f86-dc30-45de-a88f-1eb80ba5bdbb.jpg",
                    "upload_date": "2026-11-01"
                },
                {
                    "title": "CODESTORM 2026 – Club Challenge Poster",
                    "description": "Website Building Challenge organized by GDG on Campus - RIT Hassan, Department of CSE. Students showcase modern UI/UX and full stack development.",
                    "category": "COMPETITIONS",
                    "image_url": "https://kcrr7fi9yiqpfvun.public.blob.vercel-storage.com/gdg-cms/d1ec8652-f866-4579-9f5c-fbbbcd8c6688.jpg",
                    "upload_date": "2026-11-05"
                },
                {
                    "title": "Our GDG on Campus Community",
                    "description": "Students and faculty of RIT Hassan gathered for a landmark community photo celebrating developer spirit.",
                    "category": "COMMUNITY",
                    "image_url": "/assets/gdg-logo.jpeg",
                    "upload_date": "2026-09-23"
                }
            ]
            for g in gallery_data:
                db.add(GalleryImage(**g))
            db.commit()
            print("[+] Seeded authentic gallery images")

        # 5. Seed Activities & Achievements
        if db.query(Activity).count() == 0:
            acts = [
                {
                    "title": "Interactive Activity Program: Poster Design & Tech Pitch",
                    "category": "WORKSHOP",
                    "description": "Hands-on student engagement program featuring Poster Design, Pick & Speech on emerging tech trends, and interactive tech quiz sessions.",
                    "date": "15 October 2026",
                    "highlights": "Over 120 students participated, 15 creative technical posters submitted, 3 top presentations recognized.",
                    "image_url": "https://kcrr7fi9yiqpfvun.public.blob.vercel-storage.com/gdg-cms/1f2b8666-c500-47aa-be20-11900f162930.jpg"
                },
                {
                    "title": "Full-Stack Web Architecture Bootcamp",
                    "category": "SESSIONS",
                    "description": "Intensive hands-on session introducing modern React, TypeScript, APIs, and cloud hosting for engineering students.",
                    "date": "28 October 2026",
                    "highlights": "Live coding session, 85 attendees, hands-on repository cloning and Vercel deployment.",
                    "image_url": "https://kcrr7fi9yiqpfvun.public.blob.vercel-storage.com/gdg-cms/d1ec8652-f866-4579-9f5c-fbbbcd8c6688.jpg"
                }
            ]
            for a in acts:
                db.add(Activity(**a))

            achs = [
                {
                    "title": "Official GDG on Campus Chapter Recognition",
                    "category": "MILESTONES",
                    "recipient_name": "GDG on Campus – RIT Hassan",
                    "date": "23 September 2026",
                    "description": "Successfully established and recognized as the official Google Developer Groups on Campus chapter for Rajeev Institute of Technology, Hassan.",
                    "proof_url": "https://kcrr7fi9yiqpfvun.public.blob.vercel-storage.com/gdg-cms/23808f2a-751f-4d68-9ee8-fcdbee15ce81.jpg"
                },
                {
                    "title": "Excellence in Student Community Building",
                    "category": "AWARDS",
                    "recipient_name": "Department of Computer Science & Engineering",
                    "date": "October 2026",
                    "description": "Recognized by institution leadership for highest student engagement in technical extra-curriculars and peer mentoring.",
                    "proof_url": None
                }
            ]
            for ach in achs:
                db.add(Achievement(**ach))
            db.commit()
            print("[+] Seeded activities and achievements")

        # 6. Seed Verifiable Certificates
        if db.query(Certificate).count() == 0:
            certs = [
                {
                    "certificate_code": "CODESTORM2026-001",
                    "student_name": "Yashawantha H M",
                    "usn": "4RA22CS001",
                    "event_name": "CODESTORM 2026 – NOVEMBER EDITION",
                    "issue_date": "18 November 2026",
                    "status": "VERIFIED",
                    "pdf_url": None,
                    "verification_count": 5
                },
                {
                    "certificate_code": "INAUG2026-042",
                    "student_name": "Dhanyatha SM",
                    "usn": "4RA22CS042",
                    "event_name": "GDG on Campus – RIT Hassan Inauguration",
                    "issue_date": "23 September 2026",
                    "status": "VERIFIED",
                    "pdf_url": None,
                    "verification_count": 3
                },
                {
                    "certificate_code": "CHALLENGE-2026-015",
                    "student_name": "Vikas D",
                    "usn": "4RA22CS015",
                    "event_name": "Website Building Challenge",
                    "issue_date": "05 November 2026",
                    "status": "VERIFIED",
                    "pdf_url": None,
                    "verification_count": 2
                }
            ]
            for c in certs:
                db.add(Certificate(**c))
            db.commit()
            print("[+] Seeded verifiable certificates")

        # 7. Seed Announcements & Website Settings
        if db.query(Announcement).count() == 0:
            anns = [
                {
                    "title": "CODESTORM 2026 Registration Open!",
                    "content": "Participate in the flagship coding competition on 18 November 2026. Free entry, win exciting rewards!",
                    "badge": "UPCOMING EVENT",
                    "link_url": "/events/codestorm-2026",
                    "is_active": True
                },
                {
                    "title": "Welcome to GDG on Campus RIT Hassan",
                    "content": "Connect with passionate student builders, explore AI/ML, Web, and Cloud technologies.",
                    "badge": "COMMUNITY",
                    "link_url": "/about",
                    "is_active": True
                }
            ]
            for an in anns:
                db.add(Announcement(**an))
            db.commit()

        # Settings
        default_settings = {
            "club_name": "GDG on Campus – RIT Hassan",
            "institution": "Rajeev Institute of Technology, Hassan",
            "department": "Computer Science and Engineering",
            "tagline": "Learn. Build. Connect. Innovate.",
            "hero_headline": "Building Tomorrow's Technology, Together.",
            "hero_subheadline": "A community of curious minds, creative developers and future innovators. Learn new technologies, build real-world projects and grow together.",
            "mission": "Make modern technology more approachable through hands-on learning, collaboration, and a welcoming campus community.",
            "vision": "Help students turn curiosity into skills, ideas into projects, and collaboration into lasting growth.",
            "official_email": "gdgoncampusgdgclubrit@gmail.com",
            "instagram_handle": "@gdg_club_rit",
            "whatsapp_link": "https://chat.whatsapp.com/Ep2J8GpmRBoF0Fj3A5eks1",
            "codestorm_whatsapp": "https://chat.whatsapp.com/IbvN7a5LEGpGqVoffjDWPw?s=cl&p=a&iam=2",
            "github_repo": "https://github.com/Yashawantha26/codestorm-2026.git"
        }
        for k, v in default_settings.items():
            if not db.query(WebsiteSetting).filter(WebsiteSetting.key == k).first():
                db.add(WebsiteSetting(key=k, value=v, description=k.replace('_', ' ').title()))
        db.commit()
        print("[+] Seeded website settings")

    except Exception as e:
        db.rollback()
        print(f"[-] Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()

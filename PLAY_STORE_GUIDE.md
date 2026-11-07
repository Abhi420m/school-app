# 🚀 Google Play Store Publishing Guide - VidyaSetu School Parent App

Google Play Store par app live karne ke liye poora step-by-step process aur zaroori jankari yahan di gayi hai:

---

## 📋 1. Play Store Ke Liye Zaroori Cheezein (Checklist)

1. **Google Play Console Account**:
   - Google ka developer account hona zaroori hai: [play.google.com/console/signup](https://play.google.com/console/signup)
   - One-time fee: **$25 (lagbhag ₹2,100)** Google ko deni hoti hai (lifetime ke liye).
   - Identity verification ke liye PAN Card / Aadhaar / Passport lagta hai.

2. **App Format (`.aab` file)**:
   - Google Play Store par ab `.apk` upload nahi hoti, Google **Android App Bundle (`.aab`)** mangta hai.

3. **Privacy Policy Link (अनिवार्य)**:
   - Humne aapke project mein Privacy Policy bana di hai: `privacy-policy.html`
   - Play Store mein ye link daalna: `https://[Aapka-Live-URL]/privacy-policy.html`

---

## 📦 2. Play Store ke liye `.aab` Bundle Kaise Banayein (2 Aasan Tarike)

### Tarika A: PWABuilder (Google & Microsoft ka Official Free Tool - 2 Minute)
1. Jab aapki app Vercel ya Netlify par live ho jaye (e.g. `https://school-app-abhi.vercel.app`), to:
2. **[pwabuilder.com](https://www.pwabuilder.com)** kholein.
3. Apna live URL daalein aur **"Start"** dabayein.
4. **"Package for Stores"** par click karein aur **"Android"** select karein.
5. Package ID set karein: `com.vidyasetu.parentapp`
6. **"Generate Bundle"** par click karein.
7. Aapko ek signed **`.aab` file** download karne ke liye mil jayegi! Ye direct Google Play Console par upload hoti hai!

### Tarika B: Flutter / Android Studio Se
Agar aap native code se banana chahte hain:
```bash
cd flutter_app
flutter build appbundle --release
```
Isse `build/app/outputs/bundle/release/app-release.aab` ban jayegi.

---

## 📝 3. Play Store Listing Content (Copy-Paste Text)

Google Play Console mein form bharte waqt ye text use karein:

### App Name (ऐप का नाम):
`VidyaSetu - School Parent App`

### Short Description (संक्षिप्त विवरण - 80 characters max):
`Real-time school attendance, report cards, homework & teacher contact for parents.`

### Full Description (पूरा विवरण):
```
VidyaSetu is a comprehensive School Management & Parent Portal application designed to keep parents seamlessly connected with their child's school daily.

Key Features for Parents:
• 📅 Real-Time Attendance: Instant notification as soon as your child arrives at school. Track monthly attendance percentage and authorized leaves.
• 📜 Academic Results & Marksheets: View term-wise examination scores, class rank, subject grades, and download official CBSE/State board report cards.
• 📞 Direct Teacher Contact: Reach out to your child's class teacher directly via phone call or WhatsApp.
• 📚 Daily Homework & Diary: Stay updated with daily homework assignments, project deadlines, and teacher remarks.
• 💳 Fee Status & Receipts: Check annual tuition fees, pending balance, and download official payment receipts.
• 📢 School Circulars & Notices: Never miss Parent-Teacher Meetings (PTM), upcoming holidays, or exam datesheets.
• 👨‍👩‍👧 Multiple Children Support: Switch between siblings studying in different classes within a single account.

Strict Privacy & Security:
VidyaSetu enforces complete tenant isolation. Student academic data is confidential and accessible only to verified parents and designated school faculty.

Supported Curriculum: CBSE, ICSE, State Boards.
```

---

## ⚙️ 4. Google Play Console Form Answers (App Content)

Console mein aapse sawal puche jayenge, wahan ye select karein:
* **Target Audience**: Parents / 18 and over
* **App Category**: Education
* **Contains Ads?**: **NO** (App does not contain ads)
* **App Access**: All functionality is available without restrictions (Provide demo login: `xavier@school.com` / `123`)
* **Financial Features**: No financial transactions within app (or select Education/School fees if applicable)
* **Data Safety (डेटा सुरक्षा)**:
  - Data collected: Name, Phone number, Student academic info
  - Is data encrypted in transit?: **YES (SSL/TLS)**
  - Do you sell data?: **NO**
  - Can users request data deletion?: **YES**

---

## 🚀 5. App Upload & Launch

1. Play Console mein **"Production"** ya **"Testing"** section mein jayein.
2. **"Create new release"** par click karein.
3. Apni **`.aab` file** drag and drop karke upload karein.
4. **"Next" ➔ "Save" ➔ "Review and roll out to production"** par click karein.
5. Google ki team 2-3 din mein app review karke approve kar degi, aur aapki app **Google Play Store par live** ho jayegi!

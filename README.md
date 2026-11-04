# VidyaSetu - Multi-School ERP with User Login & Data Privacy (विद्यासेतु)

A complete School Management ERP system with **User Login, Password Authentication, and Strict School Privacy (एक स्कूल का यूजर दूसरे स्कूल का डेटा नहीं देख सकता)**.

---

## 🔒 डेटा सुरक्षा व लॉगिन प्रणाली (How School User Privacy Works)

### "एक स्कूल का यूजर दूसरे स्कूल का डेटा नहीं देख सकता"
1. **सुरक्षित लॉगिन (Secure Sign In)**:
   - हर स्कूल के पास अपना अलग **Admin Email** और **Password** होता है।
   - जब कोई स्कूल एडमिन लॉगिन करता है, तो उसे **सिर्फ और सिर्फ उसके अपने स्कूल का डेटा** (कक्षाएं, छात्र, अध्यापक, हाजिरी, अंक, फीस) दिखाई देता है।
   - किसी भी दूसरे स्कूल का नाम, छात्र या कोई भी जानकारी बिल्कुल भी दिखाई नहीं देगी।

2. **नया स्कूल अकाउंट रजिस्टर करना (Register New School with Admin Account)**:
   - लॉगिन स्क्रीन पर **"+ Register New School"** टैब पर क्लिक करें।
   - स्कूल की जानकारी और अपना **Admin Login Password** सेट करें।
   - रजिस्टर करते ही वह स्कूल स्वतः लॉगिन हो जाएगा और उसका एक बिल्कुल नया, सुरक्षित डेटाबेस तैयार हो जाएगा।

3. **सुरक्षित लॉगआउट (Secure Logout)**:
   - काम पूरा होने पर टॉप बार से **"Logout (लॉगआउट)"** बटन दबाकर लॉगआउट करें।

---

## 🔑 त्वरित परीक्षण खाते (Demo Login Accounts)

परीक्षण (Testing) के लिए लॉगिन स्क्रीन पर **1-Click Direct Buttons** भी दिए गए हैं, या आप मैन्युअली ये क्रेडेंशियल्स डाल सकते हैं:

| स्कूल / यूजर (Account) | लॉगिन आईडी (Email / Phone) | पासवर्ड (Password) | क्या दिखेगा? (Scope) |
| :--- | :--- | :--- | :--- |
| **स्कूल 1 (St. Xavier's Admin)** | `xavier@school.com` | `123` | सिर्फ St. Xavier's का पूरा डेटा |
| **स्कूल 2 (DPS Gurugram Admin)** | `dps@school.com` | `123` | सिर्फ DPS Gurugram का पूरा डेटा |
| **स्कूल 3 (Saraswati Vidya Mandir)**| `svm@school.com` | `123` | सिर्फ Saraswati Vidya Mandir का डेटा |
| **शिक्षक खाता (Teacher Login)** | `rajesh@school.com` | `123` | शिक्षक का हाजिरी व परीक्षा पोर्टल |
| **अभिभावक खाता (Parent Login)** | `9871122334` | `123` | सिर्फ अपने बच्चे (आरव) का रिपोर्ट कार्ड व हाजिरी |

---

## 🚀 सॉफ्टवेयर चलाने का तरीका (How to Run)
1. `Start-School-Software.bat` पर डबल-क्लिक करें।
2. ब्राउज़र में `http://localhost:3000` या `http://localhost:3001` खुलेगा।
3. लॉगिन स्क्रीन पर अपना स्कूल अकाउंट लॉगिन करें!

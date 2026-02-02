# 🛒 E-Commerce Web Project

E-Commerce web project built using HTML + CSS (Tailwind CLI) + JavaScript (ES Modules), with support for Light / Dark Theme.


# 🧱 tools

HTML5

CSS3

Tailwind CSS (CLI)

JavaScript (ES6 Modules)

LocalStorage

REST API

Git & GitHub


# 📁 Project structure

ecommerce-web/
│
├── index.html
│
├── html/
│   ├── products.html
│   ├── product-details.html
│   ├── cart.html
│   ├── login.html
│   └── register.html
│
├── css/
│   ├── output.css
│   └── main.css
│
├── js/
│   ├── config/
│   ├── utils/
│   ├── api/
│   ├── services/
│   ├── ui/
│   ├── pages/
│   └── main.js
│
├── assets/
│   ├── images/
│   └── fonts/
│
├── .gitignore
├── package.json
├── tailwind.config.js
└── README.md


# Run (terminaml)

npx tailwindcss -i ./css/main.css -o ./css/output.css --watch






#####

## 📄 ملفات HTML

# المسؤولية

تمثل صفحات الموقع فقط

تحتوي على الهيكل (HTML Structure) دون أي منطق برمجي

لا تحتوي على:

    Fetch

    LocalStorage

    Business Logic

أمثلة

index.html → الصفحة الرئيسية

products.html → قائمة المنتجات

product-details.html → تفاصيل المنتج

cart.html → سلة المشتريات

login.html / register.html → تسجيل الدخول / التسجيل

# 📌 كل صفحة تستدعي ملف JavaScript خاص بها من مجلد js/pages



## 🎨 CSS & Tailwind

# 📄 css/main.css

ملف المصدر (Source File)

يحتوي على:

Tailwind Directives

الخطوط (Fonts)

متغيرات CSS

دعم Light / Dark Theme

أي تنسيقات مخصصة


## مهم مهم مهم
# استخدام الالوان والخطوط و المسافات بالمتغيرات

class="dark" === للثيم

<link rel="stylesheet" href="../css/output.css"> === استدعاء ملف التصميم

bg-(--bg) === لون الخلفية 
border-(--onbg) === لون البوردر 
p-(--s32) === مسافات
text-(length:--fs64) === التحكم في حجم الخط 
font-(family-name:--fprim) === نوع الخط 

<!DOCTYPE html>
<html lang="en" class="dark">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="../css/output.css">
    <title> E-Commerce 🛒</title>
</head>

<body class="bg-(--bg) min-h-screen flex items-center justify-center">
    <div class="border border-(--onbg) bg-(--bgsecond) p-(--s32) w-fit">
        <h1 class="text-(--onbg) text-(length:--fs64) font-(family-name:--fsecond)">
            Welcome to E-Commerce Site!
        </h1>
    </div>
</body>

</html>



# ✅ الملف الوحيد الذي يتم التعديل عليه يدويًا 


# 📄 css/output.css

ملف ناتج (Build Output)

يتم توليده تلقائيًا باستخدام Tailwind CLI

❌ لا يتم التعديل عليه يدويًا

❌ لا يتم رفعه على GitHub =====> تم وضعه في .gitignore حتي لا يرفع




## 🧠 هيكل JavaScript

# js/config/

إعدادات عامة

API Base URL

مفاتيح LocalStorage

قيم ثابتة


# js/utils/

أدوات مساعدة عامة

التعامل مع DOM

LocalStorage Helpers

Validation

التحكم في Light / Dark Theme

لا تعتمد على صفحة معينة


# js/api/

التعامل مع الـ API

Fetch Wrapper

Endpoints

Error Handling

❌ بدون DOM


# js/services/

منطق التطبيق (Business Logic)

Cart Logic

Auth Logic

Product Logic

❌ بدون UI أو DOM


# js/ui/

عرض البيانات

إنشاء عناصر HTML

التعامل مع Events

تحديث الواجهة

❌ بدون API


# js/pages/

ربط جميع الأجزاء معًا

يتم استدعاؤها داخل صفحات HTML

تربط بين:

    Services

    UI

    API


# js/main.js

كود عام مشترك

Header / Footer

تهيئة Theme

Global Event Listeners

Auth State



## 🌙 الوضع الفاتح / الداكن (Light / Dark Theme)

يتم التحكم فيه عبر إضافة أو إزالة class="dark" على عنصر <html>

الألوان معرفة باستخدام CSS Variables

التغيير سيتم عبر JavaScript

سيتم حفظ الحالة في LocalStorage




## 🔄 تدفق البيانات (Data Flow)

Page JS
 ↓
Service
 ↓
API
 ↓
Server ملناش دعوة بيه اخرنا api 


## عرض البيانات

Service
 ↓
UI
 ↓
DOM




###
## team  rules

كل فولدر له مسؤولية واحدة واضحة تم ذكرها

ممنوع تعديل ملفات خارج نطاق مسؤوليتك بدون تنسيق

نكتب كمنتات واضحة علي كل سطر لو لزم عشان منتهش في شغل بعض

*** js
ممنوع كتابة كود كبير في ملف واحد 

ممنوع استخدام متغيرات global مش معروف الاسكوب بتعها 

مفيش تكرار للكود 

اسماء المتغيرات واضحة بتعمل ايه 

*** الفصل 
نفصل بين المنطق والواجهه 

*** tailwind 
التعديل بس في main.css (input file)

مفيش تعديل في output.css

نستخدم css variables الي في root عشان التصميم يكون موحد. ونلتزم ب الديزين

*** git 
main pranch ثابت محدش يعدل فيه 

نعمل برانش جيد لك فيتشر عندنا

commits مختصره وواضح

محدش يدمج علي main pranch الاساسي مباشر لازم حد تاني يراجع 


*** light / dark theme
التغير بيتم باضافة class dark او ازالته

عدم كتابة الوان مباشة في js استخدم css variables

*** التغير المعماري
لو فيه اي تغيير معماري لازم نتناقش فيه 

اهم حاجة نسأل بعض 

### بيقولك الكود يقرأ كثر مما يكتب 
عشان كده عوزين كود بسيط واضح 


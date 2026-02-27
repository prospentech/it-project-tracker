PROSPEN HUB – IT & Design Project Tracker

Version: 2.0.0
License: Proprietary
Firebase: 12.9.0
Languages Supported: 11

📋 Overview

Prospen Hub is a comprehensive IT and Design project management system designed for internal team use at Prospen Africa.

It provides a unified dashboard for tracking projects, tasks, team duties, meeting minutes, client work, analytics, and more — with full support for 11 South African languages.

📁 Project Structure
IT PROJECT TRACKER/
│
├── 📁 components/                     (Reusable HTML components)
│   ├── chatbot.html                   – NEXA AI chatbot interface
│   ├── footer.html                    – Footer with language selector
│   ├── header.html                    – Header with user controls
│   └── modals.html                    – All modal dialogs
│
├── 📁 pages/                          (Application pages)
│   ├── admin.html                     – User management (admin only)
│   ├── all-projects.html              – Complete project list
│   ├── all-updates.html               – All team updates
│   ├── client-projects.html           – Client project management
│   ├── email-banners.html             – Email banner tracking
│   ├── enquiries.html                 – Suggestions management
│   ├── meeting-minutes.html           – IT meeting records
│   ├── profile.html                   – User profile
│   ├── settings.html                  – Theme customization
│   ├── statistics.html                – System analytics
│   ├── tasks.html                     – Task management
│   ├── team-duties.html               – Team responsibilities
│   ├── tech-news.html                 – Tech news feed
│   └── version-board.html             – Version tracking
│
├── 📄 Core JavaScript Files
│   ├── auth.js                        – Authentication system
│   ├── chatbot.js                     – NEXA chatbot logic
│   ├── clocking.js                    – Clock in/out system
│   ├── firebase-config.js             – Firebase initialization
│   ├── firebase-service.js            – Firebase service layer
│   ├── i18n.js                        – Internationalization (11 languages)
│   ├── index.html                     – Main dashboard
│   ├── login.html                     – Login page
│   ├── main.js                        – Main application logic
│   ├── modal.js                       – Modal management
│   ├── projects.js                    – Project CRUD operations
│   ├── stats.js                       – Statistics and analytics
│   ├── style.css                      – Main stylesheet
│   ├── tasks.js                       – Task management
│   ├── team-duties.js                 – Team duties management
│   ├── theme.js                       – Theme customization
│   └── updates.js                     – Updates feed management
✨ Features
🔐 Authentication

Secure login system with Firebase Authentication

Session management with auto clock-out on logout

Role-based access (Admin vs Team Member)

🌍 Multilingual Support (11 Languages)

English

Afrikaans

isiZulu

isiXhosa

Sepedi

Sesotho

Setswana

isiNdebele

siSwati

Tshivenda

Xitsonga

📊 Core Modules
Projects Management

Create, edit, delete projects

Track status, timeline, and progress

Budget and expense tracking

Team member assignment

Task allocation within projects

Tasks Management

Full CRUD operations

Priority levels (Low, Medium, High, Urgent)

Status tracking (Active, Completed, On Hold, Cancelled)

Assignment to team members

Project linking

Overdue task highlighting

Team Duties

Define roles and responsibilities

Task-based duty management

User-specific duty views

Admin overview

Updates Feed

Post updates with priority levels

Like and comment functionality

Real-time updates

Priority indicators

Clocking System

Clock in/out functionality

Working hours tracking (Mon–Fri, 7:30 AM – 4:30 PM)

Early/late notifications

Session duration tracking

Clocking history

Statistics & Analytics

Real-time system statistics

User activity tracking

Project completion rates

Task completion metrics

Clocking statistics

Export functionality

Client Projects

Client onboarding questionnaire

Requirement gathering

Timeline estimation

Budget tracking

Status management

Email Banners

Track banner assignments

Duration tracking

Click counting

Expiration notifications

Meeting Minutes

IT meeting documentation

Attendee tracking

Decision logging

Next meeting scheduling

Version Board

Version tracking

Feature release planning

Progress monitoring

Implementation dates

Tech News Feed

Curated technology news

Categories (AI, Web Dev, Cybersecurity, etc.)

External article links

NEXA AI Chatbot

Multilingual AI assistant

Suggestion collection

Quick answers

Task & project retrieval

Theme Customization

Dark/Light mode toggle

20+ font families

Custom background, card, and accent colors

Live preview

🚀 Getting Started
Prerequisites

Modern web browser

Firebase account

Installation
Clone Repository
git clone https://github.com/your-username/prospen-hub.git
cd prospen-hub
Firebase Setup

Create Firebase project

Enable Email/Password Authentication

Set up Realtime Database

Configure Storage

Update firebase-config.js

Configure Users

Add users in Firebase Authentication:

admin

Junior

Buhle

AJay

Default Users
Username	Email	Role
admin	admin@prospen.co.za
	Administrator
Junior	techsupport@prospen.co.za
	Team Member
Buhle	buhle@prospen.co.za
	Team Member
AJay	infotech@prospen.co.za
	Team Member
🔧 Configuration
Firebase Database Rules

(Insert your JSON rules here)

Default Theme Settings

darkMode: true

cardColor: #1e293b

accentColor: #38bdf8

fontFamily: 'Inter', sans-serif

bgColor: #020617

📱 Responsive Design

Supports:

Desktop

Tablet

Mobile

Small Mobile

🧩 Plugin Architecture

Each module follows a consistent structure:

init()

loadData()

render()

create()

update()

delete()

handleEvent()

subscribeToUpdates()

🌐 Internationalization

Translations managed in i18n.js using data-i18n attributes.

🔒 Security

Firebase Authentication

Realtime Database security rules

Session management

Admin-only routes

Input sanitization

XSS protection

🛠️ Development
Adding a New Page

Create HTML file in /pages

Include Firebase scripts

Import modules

Initialize on DOMContentLoaded

Creating a New Module

Create JS file

Follow module pattern

Export module

Make globally accessible for onclick handlers

📄 License

Proprietary software for internal use at Prospen Africa only.

👥 Team

Development: ProspenTech
Design: Prospen Creative Team
Project Management: IT Department

📞 Support

Email: Infotech@prospen.co.za

Internal: IT Helpdesk

🙏 Acknowledgments

Firebase

Font Awesome

Google Fonts

All team members for testing and feedback

© 2026 Prospen Africa. All rights reserved.

💡 Pro tip for future updates:

You can do this sequence every time you update files:

git add .
git commit -m "Describe changes"
git push origin main

No extra steps needed unless someone else updated the repo, then you’d git pull origin main first.

🔥 Quick Full Fix Command

If you want to make sure EVERYTHING updates:

git add -A
git commit -m "Full sync update"
git push origin main
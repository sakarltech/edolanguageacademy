# Edo Language Academy - Project TODO

## Core Pages
- [x] Home page with hero section and course overview
- [x] Courses main page with level comparison
- [x] Course detail pages (Beginner, Intermediary, Proficient)
- [x] Pricing page with clear pricing tiers and bundle offer
- [x] Schedule page with class timetable and upcoming cohorts
- [x] About page with mission and instructor information
- [x] FAQ page with common questions
- [x] Contact page with contact form
- [x] Registration page with enrollment form and payment integration

## Design & Styling
- [ ] Implement modern color palette (white, deep reds, warm golds)
- [ ] Set up typography and fonts
- [ ] Create reusable UI components
- [ ] Implement responsive design (mobile-first)
- [ ] Add micro-animations and transitions

## Features
- [ ] Navigation menu (responsive)
- [ ] Course information display
- [ ] Pricing calculator/display
- [ ] Class schedule calendar
- [ ] Contact form functionality
- [ ] Registration form with Stripe payment
- [ ] SEO optimization (meta tags, structured data)

## Content
- [ ] Populate all course content
- [ ] Add pricing information
- [ ] Include class schedule details
- [ ] Add FAQ content
- [ ] Include testimonials (placeholder if needed)
- [ ] Add cultural imagery and branding elements

## Technical
- [ ] Database schema for contact forms and registrations
- [ ] Stripe payment integration
- [ ] Email notifications for registrations
- [ ] Form validation
- [ ] Error handling
- [ ] Performance optimization

## Current Focus
- [x] Build detailed course pages with full content (Beginner, Intermediary, Proficient)

## Next Phase
- [x] Build Pricing, Schedule, About, FAQ, Contact, and Register pages with full content

## New Feature Request
- [x] Implement AI chatbot that answers questions based on website content
- [x] Configure chatbot to send out-of-scope questions to owner's email
- [x] Add chatbot UI component that appears on all pages

## Design Updates
- [x] Rename chatbot to "Efosa"
- [x] Update color scheme: white and warm gold predominant, deep red as accent only

## Payment Integration
- [x] Add Stripe payment feature to the project
- [x] Integrate Stripe checkout in registration page
- [x] Set up payment confirmation and email notifications
- [x] Create enrollment database schema
- [x] Set up Stripe webhook handler
- [x] Create enrollment success page

## Student Dashboard
- [x] Create protected student dashboard with authentication
- [x] Display enrolled courses and current progress
- [x] Add access to class recordings and materials
- [x] Show upcoming classes and schedule
- [x] Display assessment results and certificates
- [x] Add course completion tracking
- [x] Add database schema for course materials and student progress
- [x] Create student router with progress tracking API
- [x] Build dashboard UI with progress overview, materials access, and certificate download

## Admin Panel
- [x] Create admin dashboard with authentication
- [x] Add course materials upload and management
- [x] Implement enrollment management interface
- [x] Add student progress update functionality
- [x] Create certificate generation and issuance system
- [x] Add analytics dashboard for enrollment and completion trends

## Automated Reminders
- [x] Set up email notification system
- [x] Implement class reminder emails (24 hours before)
- [x] Add weekly progress summary emails
- [x] Create incomplete week alert notifications
- [x] Add milestone congratulations emails

## Discussion Forum
- [x] Create forum database schema
- [x] Build forum router with CRUD operations
- [x] Implement forum UI with threads and replies
- [x] Add instructor Q&A functionality (instructor badge on replies)
- [x] Build thread detail page with reply functionality

## Stripe Integration Update
- [x] Update Stripe Price IDs to use customer's actual Stripe products

## Website Refinement Updates
- [x] Add smooth scroll animations (fade-in/slide-up effects)
- [x] Create curriculum data structure with all module-week mappings
- [x] Update Beginner curriculum with module-week mapping
- [x] Update Intermediary curriculum with module-week mapping
- [x] Update Proficient curriculum with module-week mapping
- [ ] Restructure dashboard to show module-based content (notes, videos, workbooks, assessments)
- [ ] Make all teaching content non-downloadable (view-only/stream-only)
- [ ] Implement admin-triggered certificate generation with PDF template
- [ ] Add automatic certificate email delivery to students
- [ ] Remove "Most Popular" tags from pricing page
- [ ] Update schedule with 11 AM GMT and 11 AM CST time slots
- [ ] Add timezone conversions for UK, Nigeria, Europe, North America
- [ ] Implement automatic rolling cohort logic (Dec 6th start, then every 10 weeks)
- [ ] Update FAQs with new class duration, schedule, and access information
- [ ] Remove learner's age field from registration form
- [ ] Add WhatsApp group link automation in enrollment confirmation emails

## Schedule & Cohort System Updates
- [x] Implement dual time slots (11 AM GMT and 11 AM CST)
- [x] Add automatic timezone conversions (UK, Nigeria, Europe, North America)
- [x] Create automatic rolling cohort logic (Dec 6th start, then every 10 weeks)
- [x] Update schedule page with new time slot information
- [x] Clarify that learners only need to attend one time slot
- [x] Remove age-specific class time differences (same for all ages)

## Pricing Page Update
- [x] Remove "Most Popular" badges from all course cards
- [x] Ensure all course levels are presented equally

## FAQ Page Updates
- [x] Update class duration to 60 minutes (remove 60-75 minute references)
- [x] Add information about dual time slot options (11 AM GMT and 11 AM CST)
- [x] Clarify that students only need to attend one time slot
- [x] Update information about module-based curriculum structure
- [x] Clarify that materials are non-downloadable and accessed through dashboard
- [x] Update cohort information (new cohorts every 10 weeks starting Dec 6th)
- [x] Add new FAQ categories for Learning Materials & Access and Community & Support

## Registration Form Updates
- [x] Remove "Learner's Age" field from registration form
- [x] Add "Preferred Time Slot" dropdown (11 AM GMT or 11 AM CST)
- [x] Add optional WhatsApp number field for group link delivery
- [x] Update enrollment database schema to include timeSlot and whatsappNumber
- [x] Update enrollment router to handle new fields
- [x] Update Admin page to display timeSlot instead of ageGroup

## WhatsApp Group Link Management
- [x] Create database schema for storing WhatsApp group links
- [x] Create admin router for managing WhatsApp group links
- [x] Build admin UI for adding/editing WhatsApp group links
- [x] Update enrollment confirmation email to include WhatsApp group link
- [x] Add WhatsApp group link to enrollment success page

## Enhanced Student Dashboard with Module Structure
- [x] Restructure dashboard to display 4 modules instead of 8 weeks
- [x] Update database schema to track module completion (4 modules)
- [x] Implement view-only access for teaching notes (no downloads)
- [x] Implement stream-only access for videos (no downloads)
- [x] Add visual progress tracking with module completion checkboxes
- [x] Update admin interface to upload materials by module instead of week
- [x] Create module-based content tabs in student dashboard
- [x] Add progress percentage indicator based on module completion

## Certificate Generation System
- [x] Create PDF certificate template with Edo branding
- [x] Build certificate generation function with student name, course level, completion date, and assessment scores
- [x] Add admin procedure to trigger certificate generation for eligible students
- [x] Store certificate URLs in database for dashboard access
- [x] Add certificate management tab in admin panel
- [x] Update student dashboard to display certificate download link
- [x] Add certificate issuance tracking
- [ ] Implement automatic email delivery of certificates to students (requires email service integration)

## Enrollment Flow Refactor (New User Requirements)
- [x] Update Dashboard to show course catalog when user has no enrollment
- [x] Add enrollment dialog to collect time slot and contact info before checkout
- [x] Implement dashboard-based enrollment flow (user selects course from dashboard)
- [x] Ensure Register page is simple account creation only (no course selection)
- [x] Update all public page CTAs to point to /register (already done)
- [x] Migrate Stripe integration to use environment variables for Price IDs
- [ ] Update Stripe webhook to create enrollment AFTER payment success (already implemented)
- [ ] Implement one-level-at-a-time enforcement in dashboard (UI message added, backend enforcement needed)
- [ ] Test complete enrollment flow: Register → Login → Dashboard → Select Course → Pay → Unlock
- [ ] Update enrollment success page to redirect to dashboard
- [ ] Add success message in dashboard after enrollment

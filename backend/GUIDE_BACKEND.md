1. Core Setup (Must Do First)
API Base URL: http://localhost:5000/api

Use POSTMAN or Thunder Client to test API

Authentication:

Login/Register: After POST /api/auth/login or POST /api/auth/register, you will get a token and a user object.

Save Token: Save this token (in localStorage or state).

Save Role: Save the user.role ('student', 'teacher', 'admin').

Send Token: For all protected routes, you must send this in the header: Authorization: Bearer <your_token_here>

Role-Based UI: Use the saved user.role to show/hide buttons.

'teacher'/'admin' sees "Create Course".

'admin' sees "Admin Panel".

'student' sees "Enroll Now".

2. Public Pages (No Login Needed)
Page: Register
Goal: Create a new user.

Form: name, email, password, role (dropdown).

API: POST /api/auth/register

Body: { "name": "...", "email": "...", "password": "...", "role": "student" }

Action: On success, save the token and user object. Redirect to dashboard.

Page: Login
Goal: Log in a user.

Form: email, password.

API: POST /api/auth/login

Body: { "email": "...", "password": "..." }

Action: On success, save the token and user object. Redirect to dashboard.

Page: All Courses (Home)
Goal: Show all courses.

API: GET /api/courses

Search Feature: GET /api/courses?keyword=...

Action: Display courses as cards. Each card links to Course Details Page.

Page: Course Details
Goal: Show one course's info.

API: GET /api/courses/:id

Action:

Show course title, description, teacher.name.

If user.role === 'student', show "Enroll Now" button.

If user.role === 'teacher' or user is enrolled, show "View Content" button.

3. Student Features (Login Required)
Feature: Enroll in Course
Goal: Enroll the logged-in student.

Trigger: "Enroll Now" button click.

API: POST /api/courses/:id/enroll

Action: After success, change button to "Enrolled" or "View Content".

Page: Course Player (Watching Lessons)
Layout: Sidebar with lesson list, main area for video/text.

1. Load Lessons (for Sidebar):

API: GET /api/courses/:courseId/lessons

Action: List lessons in the sidebar.

2. Load Progress (for checkmarks):

API: GET /api/courses/:courseId/progress

Response: { completedCount, totalCount, percentage, completedLessons: [...] }

Action: Show percentage in a progress bar. Put a (✓) next to lessons found in the completedLessons array.

3. Mark Lesson Complete:

Trigger: "Mark as Complete" button click.

API: POST /api/courses/:courseId/lessons/:lessonId/complete

Action: After success, re-call the "Load Progress" API to update the UI.

Page: Take Quiz
1. Load Quiz Questions:

API: GET /api/quizzes/:id

Action: Display the questions and options using radio buttons.

2. Submit Answers:

Trigger: "Submit Quiz" button click.

API: POST /api/quizzes/:id/attempt

Body: { "answers": [0, 2, 1] } (Array of indexes of the chosen options).

Response: { score, total }

Action: Show the user their score (e.g., "You scored 2 out of 3").

4. Discussion Forum (Login Required)
Page: Course Forum
1. Load Threads:

API: GET /api/forum/course/:courseId

Action: Show list of all threads.

2. Create New Thread:

Form: title, body.

API: POST /api/forum

Body: { "title": "...", "body": "...", "courseId": "..." }

Note: If you get a 400 Bad Request, show the message (it's the badWordsFilter).

3. Add Reply (on Thread Details):

Form: body (textarea).

API: POST /api/forum/:threadId/reply

Body: { "body": "..." }

Action: On success, refresh the replies list.

5. User Profile (Login Required)
Page: Profile
1. Load Profile:

API: GET /api/users/profile/me

Action: Fill forms with name, email, bio.

2. Update Profile:

Form: name, bio.

API: PUT /api/users/profile/me

Body: { "name": "...", "bio": "..." }

3. Change Password:

Form: oldPassword, newPassword.

API: PUT /api/users/profile/change-password

Body: { "oldPassword": "...", "newPassword": "..." }

6. Teacher Features (Teacher/Admin Role)
Page: Create Course
Form: title, description, category.

API: POST /api/courses

Body: { "title": "...", "description": "...", "category": "..." }

Page: Edit Course / Add Lessons
Form: title, content (text), videoUrl.

API: POST /api/courses/:courseId/lessons

Body: { "title": "...", "content": "...", "videoUrl": "..." }

Page: Create Quiz
Form: title + dynamic "Add Question" button.

API: POST /api/quizzes

Body (Complex):

JSON

{
  "title": "Quiz 1",
  "courseId": "...",
  "questions": [
    {
      "text": "Question 1?",
      "options": [
        { "text": "Option A", "correct": false },
        { "text": "Option B", "correct": true }
      ]
    }
  ]
}
7. Admin Panel (Admin Role Only)
Page: User Management
1. Load All Users:

API: GET /api/users

Action: Display users in a table.

2. Delete User:

Trigger: "Delete" button next to a user.

API: DELETE /api/users/:id

Action: On success, re-load the user list.
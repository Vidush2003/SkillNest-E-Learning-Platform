const quizzes = [
  // --- Lesson l3001: HTML Basics ---
  { "quizId": "q5001", "lessonId": "l3001", "question": "What does HTML stand for?", "options": ["Hyper Text Markup Language", "High Text Machine Language", "Hyperlink and Text Markup Language"], "correctAnswer": "Hyper Text Markup Language" },
  { "quizId": "q5002", "lessonId": "l3001", "question": "Which tag is used to create a hyperlink?", "options": ["<link>", "<a>", "<href>"], "correctAnswer": "<a>" },
  { "quizId": "q5003", "lessonId": "l3001", "question": "What is the correct tag for the largest heading?", "options": ["<h6>", "<h1>", "<head>"], "correctAnswer": "<h1>" },
  { "quizId": "q5004", "lessonId": "l3001", "question": "Which tag is used to insert a line break?", "options": ["<br>", "<break>", "<lb>"], "correctAnswer": "<br>" },
  { "quizId": "q5005", "lessonId": "l3001", "question": "Which tag is used to define an unordered list?", "options": ["<ol>", "<ul>", "<li>"], "correctAnswer": "<ul>" },
  { "quizId": "q5006", "lessonId": "l3001", "question": "Which tag is used to define a table row?", "options": ["<td>", "<tr>", "<th>"], "correctAnswer": "<tr>" },
  { "quizId": "q5007", "lessonId": "l3001", "question": "What is the semantic HTML tag for navigation?", "options": ["<nav>", "<div>", "<navbar>"], "correctAnswer": "<nav>" },
  { "quizId": "q5008", "lessonId": "l3001", "question": "Which tag defines the document's title?", "options": ["<head>", "<meta>", "<title>"], "correctAnswer": "<title>" },
  { "quizId": "q5009", "lessonId": "l3001", "question": "How do you add a comment in HTML?", "options": ["", "// Comment", "/* Comment */"], "correctAnswer": "" },
  { "quizId": "q5010", "lessonId": "l3001", "question": "Which tag is used for block-level content?", "options": ["<span>", "<div>", "<p>"], "correctAnswer": "<div>" },

  // --- Lesson l3002: CSS Fundamentals ---
  { "quizId": "q5011", "lessonId": "l3002", "question": "What does CSS stand for?", "options": ["Cascading Style Sheets", "Creative Style Sheets", "Computer Style Sheets"], "correctAnswer": "Cascading Style Sheets" },
  { "quizId": "q5012", "lessonId": "l3002", "question": "How do you insert a comment in a CSS file?", "options": ["// this is a comment", "", "/* this is a comment */"], "correctAnswer": "/* this is a comment */" },
  { "quizId": "q5013", "lessonId": "l3002", "question": "Which property is used to change the background color?", "options": ["color", "bgcolor", "background-color"], "correctAnswer": "background-color" },
  { "quizId": "q5014", "lessonId": "l3002", "question": "How do you select an element with id 'demo'?", "options": [".demo", "#demo", "demo"], "correctAnswer": "#demo" },
  { "quizId": "q5015", "lessonId": "l3002", "question": "How do you select elements with class name 'test'?", "options": [".test", "#test", "test"], "correctAnswer": ".test" },
  { "quizId": "q5016", "lessonId": "l3002", "question": "What is the default value of the 'position' property?", "options": ["static", "relative", "absolute"], "correctAnswer": "static" },
  { "quizId": "q5017", "lessonId": "l3002", "question": "Which property is used to change the font of an element?", "options": ["font-style", "font-family", "font-weight"], "correctAnswer": "font-family" },
  { "quizId": "q5018", "lessonId": "l3002", "question": "What does 'padding' in CSS refer to?", "options": ["Space outside the border", "Space inside the border", "Space between elements"], "correctAnswer": "Space inside the border" },
  { "quizId": "q5019", "lessonId": "l3002", "question": "What does 'margin' in CSS refer to?", "options": ["Space outside the border", "Space inside the border", "Space between elements"], "correctAnswer": "Space outside the border" },
  { "quizId": "q5020", "lessonId": "l3002", "question": "How do you make text bold in CSS?", "options": ["font-weight: bold;", "text-style: bold;", "font: bold;"], "correctAnswer": "font-weight: bold;" },

  // --- Lesson l3003: Introduction to JavaScript ---
  { "quizId": "q5021", "lessonId": "l3003", "question": "Inside which HTML element do we put the JavaScript?", "options": ["<js>", "<scripting>", "<script>"], "correctAnswer": "<script>" },
  { "quizId": "q5022", "lessonId": "l3003", "question": "How do you write 'Hello World' in an alert box?", "options": ["alert('Hello World');", "msg('Hello World');", "alertBox('Hello World');"], "correctAnswer": "alert('Hello World');" },
  { "quizId": "q5023", "lessonId": "l3003", "question": "How do you create a variable in JavaScript?", "options": ["var myName;", "variable myName;", "v myName;"], "correctAnswer": "var myName;" },
  { "quizId": "q5024", "lessonId": "l3003", "question": "How do you call a function named 'myFunction'?", "options": ["call myFunction()", "myFunction()", "call:myFunction()"], "correctAnswer": "myFunction()" },
  { "quizId": "q5025", "lessonId": "l3003", "question": "How to write an IF statement in JavaScript?", "options": ["if i = 5 then", "if (i == 5)", "if i == 5"], "correctAnswer": "if (i == 5)" },
  { "quizId": "q5026", "lessonId": "l3003", "question": "How to write a single line comment in JS?", "options": ["", "// Comment", "/* Comment */"], "correctAnswer": "// Comment" },
  { "quizId": "q5027", "lessonId": "l3003", "question": "What is the correct way to write a JavaScript array?", "options": ["var colors = ['red', 'green']", "var colors = (1:'red', 2:'green')", "var colors = 'red', 'green'"], "correctAnswer": "var colors = ['red', 'green']" },
  { "quizId": "q5028", "lessonId": "l3003", "question": "Which operator is used to assign a value to a variable?", "options": ["=", "*", "x"], "correctAnswer": "=" },
  { "quizId": "q5029", "lessonId": "l3003", "question": "What will '2' + 2 return?", "options": ["4", "22", "Error"], "correctAnswer": "22" },
  { "quizId": "q5030", "lessonId": "l3003", "question": "Which keyword is used to declare a constant?", "options": ["const", "let", "var"], "correctAnswer": "const" },

  // --- Lesson l3004: Responsive Design ---
  { "quizId": "q5031", "lessonId": "l3004", "question": "What is Responsive Web Design (RWD)?", "options": ["Making websites fast", "Making websites work on all devices", "Making websites secure"], "correctAnswer": "Making websites work on all devices" },
  { "quizId": "q5032", "lessonId": "l3004", "question": "What is the CSS 'viewport' meta tag for?", "options": ["Setting the initial zoom level", "Blocking robots", "Setting the website width"], "correctAnswer": "Setting the initial zoom level" },
  { "quizId": "q5033", "lessonId": "l3004", "question": "What does 'Mobile-First' mean?", "options": ["Designing for mobile before desktop", "Designing only for mobile", "Designing for desktop first"], "correctAnswer": "Designing for mobile before desktop" },
  { "quizId": "q5034", "lessonId": "l3004", "question": "Which CSS feature is used for RWD layouts?", "options": ["Media Queries", "JavaScript", "HTML"], "correctAnswer": "Media Queries" },
  { "quizId": "q5035", "lessonId": "l3004", "question": "What is a common 'breakpoint' for mobile phones?", "options": ["320px", "1200px", "1920px"], "correctAnswer": "320px" },
  { "quizId": "q5036", "lessonId": "l3004", "question": "What is a 'fluid grid'?", "options": ["A grid that uses pixel widths", "A grid that uses percentage widths", "A grid that animates"], "correctAnswer": "A grid that uses percentage widths" },
  { "quizId": "q5037", "lessonId": "l3004", "question": "Which unit is relative to the viewport width?", "options": ["%", "px", "vw"], "correctAnswer": "vw" },
  { "quizId": "q5038", "lessonId": "l3004", "question": "Which is NOT a good practice for RWD?", "options": ["Using flexible images", "Using large, fixed-width elements", "Using media queries"], "correctAnswer": "Using large, fixed-width elements" },
  { "quizId": "q5039", "lessonId": "l3004", "question": "CSS Flexbox and Grid are used for...?", "options": ["Layouts", "Animations", "Fonts"], "correctAnswer": "Layouts" },
  { "quizId": "q5040", "lessonId": "l3004", "question": "What is the 'max-width' media query for?", "options": ["Styles apply *below* this width", "Styles apply *above* this width", "Styles apply *at* this width"], "correctAnswer": "Styles apply *below* this width" },

  // --- Lesson l3005: DOM Manipulation ---
  { "quizId": "q5041", "lessonId": "l3005", "question": "What does DOM stand for?", "options": ["Document Object Model", "Data Object Model", "Document Order Model"], "correctAnswer": "Document Object Model" },
  { "quizId": "q5042", "lessonId": "l3005", "question": "What is the DOM?", "options": ["A JavaScript library", "A representation of the HTML document", "A CSS framework"], "correctAnswer": "A representation of the HTML document" },
  { "quizId": "q5043", "lessonId": "l3005", "question": "Which method selects an element by its ID?", "options": ["document.getElementByName()", "document.getElementById()", "document.getElementByClass()"], "correctAnswer": "document.getElementById()" },
  { "quizId": "q5044", "lessonId": "l3005", "question": "Which method selects the *first* element matching a CSS selector?", "options": ["document.querySelector()", "document.querySelectorAll()", "document.getElement()"], "correctAnswer": "document.querySelector()" },
  { "quizId": "q5045", "lessonId": "l3005", "question": "How do you change the text content of an element?", "options": ["element.text = 'new text'", "element.textContent = 'new text'", "element.content = 'new text'"], "correctAnswer": "element.textContent = 'new text'" },
  { "quizId": "q5046", "lessonId": "l3005", "question": "How do you add a CSS class 'new-class' to an element?", "options": ["element.class.add('new-class')", "element.classList.add('new-class')", "element.style.add('new-class')"], "correctAnswer": "element.classList.add('new-class')" },
  { "quizId": "q5047", "lessonId": "l3005", "question": "Which method creates a new HTML element (e.g., 'p')?", "options": ["document.createElement('p')", "document.create('p')", "document.new('p')"], "correctAnswer": "document.createElement('p')" },
  { "quizId": "q5048", "lessonId": "l3005", "question": "How do you add a new element (newEl) inside another (parentEl)?", "options": ["parentEl.add(newEl)", "parentEl.appendChild(newEl)", "parentEl.attach(newEl)"], "correctAnswer": "parentEl.appendChild(newEl)" },
  { "quizId": "q5049", "lessonId": "l3005", "question": "What is 'innerHTML' used for?", "options": ["To get or set the HTML content inside an element", "To get the outer HTML", "To get the text only"], "correctAnswer": "To get or set the HTML content inside an element" },
  { "quizId": "q5050", "lessonId": "l3005", "question": "What is an 'Event Listener'?", "options": ["A function that waits for an event (like 'click')", "A CSS property", "An HTML tag"], "correctAnswer": "A function that waits for an event (like 'click')" }
];

module.exports = quizzes;
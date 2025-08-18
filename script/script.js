document.addEventListener('DOMContentLoaded', () => {

    // Screen elements
    const screens = {
        login: document.getElementById('login-screen'),
        register: document.getElementById('register-screen'),
        schedule: document.getElementById('schedule-screen'),
        feedback: document.getElementById('feedback-screen'),
    };

    // Form elements
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const scheduleForm = document.getElementById('schedule-form');
    const feedbackForm = document.getElementById('feedback-form');

    // Links/Buttons for navigation
    const goToRegisterLink = document.getElementById('go-to-register');
    const goToLoginLink = document.getElementById('go-to-login');

    // --- UTILITY FUNCTIONS ---

    // Function to show a specific screen
    const showScreen = (screenName) => {
        Object.values(screens).forEach(screen => screen.classList.add('hidden'));
        screens[screenName].classList.remove('hidden');
    };

    // --- LOCALSTORAGE HANDLING ---

    // Get users from localStorage or initialize an empty array
    const getUsers = () => JSON.parse(localStorage.getItem('naf_users')) || [];

    // Save users to localStorage
    const saveUsers = (users) => localStorage.setItem('naf_users', JSON.stringify(users));

    // --- NAVIGATION LOGIC ---

    goToRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        showScreen('register');
    });

    goToLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showScreen('login');
    });

    // --- FORM SUBMISSION LOGIC ---

    // Registration
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;

        if (password !== confirmPassword) {
            alert('As senhas não coincidem!');
            return;
        }

        const users = getUsers();
        if (users.find(user => user.email === email)) {
            alert('Este e-mail já está cadastrado.');
            return;
        }

        users.push({ name, email, password });
        saveUsers(users);

        alert('Cadastro realizado com sucesso!');
        registerForm.reset();
        showScreen('login');
    });

    // Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Pre-fill schedule form with logged in user's data
            document.getElementById('schedule-name').value = user.name;
            document.getElementById('schedule-email').value = user.email;
            
            showScreen('schedule');
        } else {
            alert('E-mail ou senha inválidos.');
        }
    });

    // Scheduling
    scheduleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const appointment = {
            name: document.getElementById('schedule-name').value,
            email: document.getElementById('schedule-email').value,
            date: document.getElementById('schedule-date').value,
            time: document.getElementById('schedule-time').value,
        };

        let appointments = JSON.parse(localStorage.getItem('naf_appointments')) || [];
        appointments.push(appointment);
        localStorage.setItem('naf_appointments', JSON.stringify(appointments));

        showScreen('feedback');
    });

    // Feedback
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const feedback = {
            rating: document.getElementById('feedback-rating').value,
            timestamp: new Date().toISOString(),
        };

        let feedbacks = JSON.parse(localStorage.getItem('naf_feedbacks')) || [];
        feedbacks.push(feedback);
        localStorage.setItem('naf_feedbacks', JSON.stringify(feedbacks));

        alert('Feedback enviado com sucesso! Obrigado.');
        showScreen('schedule');
    });

    // --- INITIALIZATION ---

    // Populate time slots
    const timeSelect = document.getElementById('schedule-time');
    const availableTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
    availableTimes.forEach(time => {
        const option = document.createElement('option');
        option.value = time;
        option.textContent = time;
        timeSelect.appendChild(option);
    });
    
    // Set min date for date picker to today
    document.getElementById('schedule-date').min = new Date().toISOString().split("T")[0];


    // Register service worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }

    // Start on the login screen
    showScreen('login');
});


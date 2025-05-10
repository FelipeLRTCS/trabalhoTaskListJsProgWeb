document.addEventListener('DOMContentLoaded', () => {
    const loginView = document.getElementById('loginView');
    const signupView = document.getElementById('signupView');
    const showSignupLink = document.getElementById('showSignupLink');
    const showLoginLink = document.getElementById('showLoginLink');

    const formLogin = document.getElementById('formLogin');
    const formSignup = document.getElementById('formSignup');
    const authMessageDiv = document.getElementById('authMessage');

    const USERS_STORAGE_KEY = 'todoAppUsers';

    function getUsers() {
        const users = localStorage.getItem(USERS_STORAGE_KEY);
        return users ? JSON.parse(users) : [];
    }

    function saveUsers(users) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }

    function showMessage(message, type) {
        authMessageDiv.textContent = message;
        authMessageDiv.className = `auth-message ${type}`;
        authMessageDiv.style.display = 'block';
    }
    
    function clearMessage() {
        authMessageDiv.textContent = '';
        authMessageDiv.className = 'auth-message';
        authMessageDiv.style.display = 'none';
    }

    showSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginView.classList.remove('active-view');
        signupView.classList.add('active-view');
        clearMessage();
        formLogin.reset();
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        signupView.classList.remove('active-view');
        loginView.classList.add('active-view');
        clearMessage();
        formSignup.reset();
    });

    formSignup.addEventListener('submit', (e) => {
        e.preventDefault();
        clearMessage();

        const nome = document.getElementById('signupNome').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;

        if (!nome || !email || !password || !confirmPassword) {
            showMessage('Todos os campos são obrigatórios.', 'error');
            return;
        }

        if (password.length < 6) {
            showMessage('A senha deve ter pelo menos 6 caracteres.', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showMessage('As senhas não coincidem.', 'error');
            return;
        }

        let users = getUsers();

        if (users.find(user => user.email === email)) {
            showMessage('Este email já está cadastrado.', 'error');
            return;
        }

        const newUser = { nome, email, password };
        users.push(newUser);
        saveUsers(users);

        showMessage('Perfil criado com sucesso! Você já pode fazer login.', 'success');
        formSignup.reset();
        setTimeout(() => {
             signupView.classList.remove('active-view');
             loginView.classList.add('active-view');
             clearMessage();
        }, 2000);
    });

    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        clearMessage();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            showMessage('Email e senha são obrigatórios.', 'error');
            return;
        }

        const users = getUsers();
        const foundUser = users.find(user => user.email === email && user.password === password);

        if (foundUser) {
            showMessage(`Login bem-sucedido! Bem-vindo(a), ${foundUser.nome}.`, 'success');
            formLogin.reset();
            window.location.replace("index.html");
        } else {
            showMessage('Email ou senha inválidos.', 'error');
        }
    });
});
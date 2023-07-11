if(window.location.pathname == '/signin.html'){
    const formSignin = document.getElementById('form-signin');
    formSignin.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(formSignin);
        try {
            const response = await axios.post('http://localhost:3000/signin', {
                usuario: formData.get('usuario'),
                senha: formData.get('senha'),
            });
            const { token } = response.data;
            window.location.assign('index.html');
            document.cookie = `token=${token};Path=/;max-age=3600;`;
            alert('A conta foi logada.');
        } catch (error) {
            const statusCode = error.response.status;
            if(statusCode == 401){
                alert('Usuário ou senha incorreta.');
            }
            if(statusCode == 404){
                alert('Usuário não encontrado.');
            }
            if(statusCode == 500){
                alert('Erro no servidor.');
            }
        }
    });
}
if(window.location.pathname == '/signup.html'){
    const formSignup = document.getElementById('form-signup');
    formSignup.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(formSignup);
        try {
            await axios.post('http://localhost:3000/signup', {
                usuario: formData.get('usuario'),
                senha: formData.get('senha'),
            });
            window.location.assign('signin.html');
            alert('A conta foi criada.');
        } catch (error) {
            const statusCode = error.response.status;
            if(statusCode == 409){
                alert('Usuário já cadastrado.');
            }
            if(statusCode == 500){
                alert('Erro no servidor.');
            }
        }
    });
}

if(window.location.pathname == '/index.html'){
    if(document.cookie){
        document.getElementById('button-signin').style.display = 'none';
        document.getElementById('button-signup').style.display = 'none';
        document.getElementById('button-signout').style.display = 'block';
    }
    const signout = document.getElementById('button-signout');
    signout.addEventListener('click', () => {
        document.cookie = `token=;Path=/;max-age=0;`;
        window.location.assign('index.html');
        document.getElementById('button-signin').style.display = 'block';
        document.getElementById('button-signup').style.display = 'block';
        document.getElementById('button-signout').style.display = 'none';
        alert('Sua conta foi deslogada.');
    });
}



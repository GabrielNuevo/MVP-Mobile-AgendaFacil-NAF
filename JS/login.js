document.addEventListener('DOMContentLoaded', function () {
    const formularioLogin = document.getElementById('formularioLogin');

    formularioLogin.addEventListener('submit', function (evento) {
        evento.preventDefault(); // Evita o comportamento padrão do envio do formulário

        // Usando os IDs corretos do HTML
        const email = document.getElementById('loginEmail').value;
        const senha = document.getElementById('loginSenha').value;

        // Faz a requisição POST para a API de login
        fetch('http://localhost:3000/api/usuarios/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha }),
        })
            .then((resposta) => {
                if (!resposta.ok) {
                    return resposta.text().then((texto) => {
                        throw new Error(texto);
                    });
                }
                return resposta.text(); // Retorna a mensagem da API
            })
            .then((dados) => {
                alert(dados); // Exibe mensagem de boas-vindas
                window.location.href = 'agendamento.html'; // Redireciona para a página de agendamento
            })
            .catch((erro) => {
                alert(`Erro no login: ${erro.message}`); // Exibe erros
            });
    });
});

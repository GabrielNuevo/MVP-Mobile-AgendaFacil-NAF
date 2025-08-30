document.addEventListener('DOMContentLoaded', function () {
    const formularioCadastro = document.getElementById('cadastroForm'); // ID corrigido

    formularioCadastro.addEventListener('submit', function (evento) {
        evento.preventDefault(); // Evita o comportamento padrão do envio do formulário

        const nome = document.getElementById('cadastroName').value; // ID corrigido
        const email = document.getElementById('cadastroEmail').value; // ID corrigido
        const senha = document.getElementById('cadastroPassword').value; // ID corrigido
        const senhaConfirmacao = document.getElementById('confirmPassword').value; // ID corrigido

        // Validação de senha
        if (senha !== senhaConfirmacao) {
            alert('As senhas não coincidem!');
            return;
        }

        // Faz a requisição POST para a API de cadastro
        fetch('http://localhost:3000/api/usuarios/cadastrar', { // Endpoint corrigido
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha }),
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
                alert(dados); // Exibe mensagem de sucesso
                window.location.href = 'login.html'; // Redireciona para a página de login
            })
            .catch((erro) => {
                alert(`Erro no cadastro: ${erro.message}`); // Exibe erros
            });
    });
});

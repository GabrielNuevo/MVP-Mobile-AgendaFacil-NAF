function enviarFeedback() {
    const avaliacao = document.getElementById("avaliacao").value;
    const comentario = document.getElementById("comentario").value;

    console.log("Avaliação: " + avaliacao);
    console.log("Comentário: " + comentario);
    document.getElementById("formularioFeedback").reset();
    alert("Obrigado pelo Feedback :) \nAguardamos você no horário agendado! Clique em OK para sair.");
    window.location.href = "login.html"; // Redireciona para a página de login
}

document.addEventListener('DOMContentLoaded', function () {
    const listaAgendamentos = document.getElementById('listaAgendamentos');

    fetch('http://localhost:3000/api/agendamentos')
        .then(res => res.json())
        .then(agendamentos => {
            listaAgendamentos.innerHTML = ''; // Limpa o "Carregando..."

            if (agendamentos.length === 0) {
                listaAgendamentos.innerHTML = "<p>Nenhum agendamento encontrado.</p>";
                return;
            }

            agendamentos.forEach(item => {
                const card = document.createElement('div');
                card.innerHTML = `
                    <strong>Nome:</strong> ${item.nome}<br>
                    <strong>Email:</strong> ${item.email}<br>
                    <strong>Data:</strong> ${item.dia}<br>
                    <strong>Horário:</strong> ${item.horario}
                `;
                listaAgendamentos.appendChild(card);
            });
        })
        .catch(err => {
            listaAgendamentos.innerHTML = `<p>Erro ao carregar agendamentos: ${err.message}</p>`;
        });
});

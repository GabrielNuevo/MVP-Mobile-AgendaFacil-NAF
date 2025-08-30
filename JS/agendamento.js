document.addEventListener('DOMContentLoaded', function () {
    const formularioAgendamento = document.getElementById('formularioAgendamento');
    const campoData = document.getElementById('dia');
    const campoHorario = document.getElementById('horario');

    // Função para formatar a data para o formato DD/MM/AAAA
    function formatarData(data) {
        const opcoes = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(data).toLocaleDateString('pt-BR', opcoes);
    }

    // Função para carregar as datas e horários disponíveis
    function carregarDatasEHorariosDisponiveis() {
        fetch('http://localhost:3000/api/agendamentos/disponiveis')
            .then(resposta => resposta.json())
            .then(horariosDisponiveis => {
                const datasDisponiveis = horariosDisponiveis
                    .map(horario => horario.dia)
                    .filter(dia => isDataDentroDosProximos15Dias(dia));

                // Garantir que as datas não se repitam
                const datasAdicionadas = new Set();

                // Adiciona as opções de data no formato DD/MM/AAAA
                datasDisponiveis.forEach(dia => {
                    const dataFormatada = formatarData(new Date(new Date().getFullYear(), new Date().getMonth(), dia));

                    // Se a data já foi adicionada, ignore
                    if (!datasAdicionadas.has(dataFormatada)) {
                        const opcao = document.createElement('option');
                        opcao.value = dia;
                        opcao.textContent = dataFormatada;
                        campoData.appendChild(opcao);
                        datasAdicionadas.add(dataFormatada); // Adiciona a data ao Set
                    }
                });

                if (horariosDisponiveis.length > 0) {
                    carregarHorariosDisponiveis(horariosDisponiveis);
                }
            })
            .catch(erro => {
                alert('Erro ao carregar horários disponíveis: ' + erro.message);
            });
    }

    // Função para verificar se a data está dentro dos próximos 15 dias
    function isDataDentroDosProximos15Dias(dia) {
        const hoje = new Date();
        const dataLimite = new Date();
        dataLimite.setDate(hoje.getDate() + 15); // 15 dias a partir de hoje

        const dataSelecionada = new Date(new Date().getFullYear(), new Date().getMonth(), dia);

        return dataSelecionada >= hoje && dataSelecionada <= dataLimite;
    }

    function carregarHorariosDisponiveis(horariosDisponiveis) {
        const dataSelecionada = campoData.value;

        const horariosFiltrados = horariosDisponiveis.filter(horario => horario.dia === parseInt(dataSelecionada));
        campoHorario.innerHTML = ''; // Limpa as opções anteriores

        horariosFiltrados.forEach(horario => {
            const opcao = document.createElement('option');
            opcao.value = horario.hora;
            opcao.textContent = horario.hora;
            campoHorario.appendChild(opcao);
        });
    }

    carregarDatasEHorariosDisponiveis();

    campoData.addEventListener('change', function () {
        carregarHorariosDisponiveis();
    });

    formularioAgendamento.addEventListener('submit', function (evento) {
        evento.preventDefault();
    
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const dia = campoData.value;
        const horario = campoHorario.value;
    
        fetch('http://localhost:3000/api/agendamentos/criar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, dia, horario })
        })
        .then(resposta => {
            if (!resposta.ok) {
                return resposta.json().then(dados => { throw new Error(dados.message); });
            }
            return resposta.json(); // Converte a resposta para JSON
        })
        .then(dados => {
            // Exibe a mensagem de sucesso
            alert(dados.message); // Exibe a mensagem de sucesso no alert
            window.location.href = 'feedback.html'; // Redireciona para a página de feedback
        })
        .catch(erro => {
            alert(`Atenção: ${erro.message}`); // Exibe o erro, caso haja
        });
    });
});

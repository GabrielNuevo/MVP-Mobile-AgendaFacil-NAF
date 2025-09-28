document.addEventListener('DOMContentLoaded', function () {
    const formularioAgendamento = document.getElementById('formularioAgendamento');
    const campoData = document.getElementById('dia');
    const campoHorario = document.getElementById('horario');

    let horariosGlobais = []; // guardo os horários aqui

    // Função para formatar a data (DD/MM/AAAA)
    function formatarData(data) {
        const opcoes = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(data).toLocaleDateString('pt-BR', opcoes);
    }

    // Carregar as datas e horários disponíveis
    function carregarDatasEHorariosDisponiveis() {
        fetch('http://localhost:3000/api/agendamentos/disponiveis')
            .then(resposta => resposta.json())
            .then(horariosDisponiveis => {
                horariosGlobais = horariosDisponiveis;

                campoData.innerHTML = '<option value="">Selecione uma data</option>';
                const datasAdicionadas = new Set();

                horariosDisponiveis.forEach(item => {
                    const dataFormatada = formatarData(new Date(item.dia));

                    if (!datasAdicionadas.has(item.dia)) {
                        const opcao = document.createElement('option');
                        opcao.value = item.dia;
                        opcao.textContent = dataFormatada;
                        campoData.appendChild(opcao);
                        datasAdicionadas.add(item.dia);
                    }
                });
            })
            .catch(erro => {
                alert('Erro ao carregar horários disponíveis: ' + erro.message);
            });
    }



    // Carregar os horários de acordo com a data selecionada
    function carregarHorariosDisponiveis() {
        const dataSelecionada = campoData.value;
        campoHorario.innerHTML = '<option value="">Selecione um horário</option>';

        if (!dataSelecionada) return;

        const horariosFiltrados = horariosGlobais.filter(horario => horario.dia === dataSelecionada);

        horariosFiltrados.forEach(horario => {
            const opcao = document.createElement('option');
            opcao.value = horario.hora;
            opcao.textContent = horario.hora;
            campoHorario.appendChild(opcao);
        });
    }

    carregarDatasEHorariosDisponiveis();

    campoData.addEventListener('change', carregarHorariosDisponiveis);

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
            return resposta.json();
        })
        .then(dados => {
            alert(dados.message);
            window.location.href = 'feedback.html';
        })
        .catch(erro => {
            alert(`Atenção: ${erro.message}`);
        });
    });
});

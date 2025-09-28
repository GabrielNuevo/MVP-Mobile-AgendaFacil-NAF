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
                horariosGlobais = horariosDisponiveis; // salvo para usar depois

                // limpar select de datas e adicionar placeholder
                campoData.innerHTML = '<option value="">Selecione uma data</option>';

                const datasAdicionadas = new Set();

                horariosDisponiveis.forEach(item => {
                    // item.dia pode ser número (28) ou string ("2025-09-28")
                    let dataObj = isNaN(item.dia)
                        ? new Date(item.dia)
                        : new Date(new Date().getFullYear(), new Date().getMonth(), item.dia);

                    if (isDataDentroDosProximos15Dias(dataObj)) {
                        const dataFormatada = formatarData(dataObj);

                        if (!datasAdicionadas.has(dataFormatada)) {
                            const opcao = document.createElement('option');
                            opcao.value = dataObj.toISOString().split("T")[0]; // yyyy-mm-dd
                            opcao.textContent = dataFormatada;
                            campoData.appendChild(opcao);
                            datasAdicionadas.add(dataFormatada);
                        }
                    }
                });
            })
            .catch(erro => {
                alert('Erro ao carregar horários disponíveis: ' + erro.message);
            });
    }

    // Verificar se a data está dentro dos próximos 15 dias
    function isDataDentroDosProximos15Dias(dataObj) {
        const hoje = new Date();
        const dataLimite = new Date();
        dataLimite.setDate(hoje.getDate() + 15);
        return dataObj >= hoje && dataObj <= dataLimite;
    }

    // Carregar os horários de acordo com a data selecionada
    function carregarHorariosDisponiveis() {
        const dataSelecionada = campoData.value;
        campoHorario.innerHTML = '<option value="">Selecione um horário</option>';

        if (!dataSelecionada) return;

        const horariosFiltrados = horariosGlobais.filter(horario => {
            const dataAPI = isNaN(horario.dia)
                ? new Date(horario.dia).toISOString().split("T")[0]
                : new Date(new Date().getFullYear(), new Date().getMonth(), horario.dia).toISOString().split("T")[0];

            return dataAPI === dataSelecionada;
        });

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

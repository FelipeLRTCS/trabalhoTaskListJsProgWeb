document.addEventListener('DOMContentLoaded', () => {
    const formNovaTask = document.getElementById('formNovaTask');
    const tasksContainer = document.getElementById('tasksContainer');
    const TASKS_STORAGE_KEY = 'minhasTasksApp';

    let tasks = [];

    function carregarTasks() {
        const tasksSalvas = localStorage.getItem(TASKS_STORAGE_KEY);
        if (tasksSalvas) {
            tasks = JSON.parse(tasksSalvas);
            tasks.forEach(task => renderizarTask(task));
        }
    }

    function salvarTasks() {
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    }

    formNovaTask.addEventListener('submit', adicionarTask);

    function adicionarTask(event) {
        event.preventDefault();

        const nomeInput = document.getElementById('nomeTask');
        const descricaoInput = document.getElementById('descricaoTask');
        const urgenciaInput = document.getElementById('urgenciaTask');

        const nome = nomeInput.value.trim();
        const descricao = descricaoInput.value.trim();
        const urgencia = urgenciaInput.value;

        if (!nome) {
            alert('Por favor, insira o nome da task.');
            return;
        }

        const agora = new Date();
        const dataCriacao = agora.toLocaleDateString('pt-BR');
        const horaCriacao = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        const novaTask = {
            id: Date.now(),
            nome: nome,
            descricao: descricao,
            urgencia: urgencia,
            data: dataCriacao,
            hora: horaCriacao,
            completed: false
        };

        tasks.push(novaTask);
        salvarTasks();
        renderizarTask(novaTask);

        nomeInput.value = '';
        descricaoInput.value = '';
        urgenciaInput.value = 'baixa';
    }

    function renderizarTask(task) {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item', `urgencia-${task.urgencia}`);
        taskItem.setAttribute('data-id', task.id);
        if (task.completed) {
            taskItem.classList.add('task-completed');
        }

        const nomeTask = document.createElement('h3');
        nomeTask.textContent = task.nome;

        const descricaoTask = document.createElement('p');
        descricaoTask.textContent = task.descricao || 'Sem descrição.';

        const metaInfo = document.createElement('div');
        metaInfo.classList.add('meta-info');

        const dataHoraCriacao = document.createElement('span');
        dataHoraCriacao.textContent = `Criada em: ${task.data} às ${task.hora}`;

        const urgenciaSpan = document.createElement('span');
        urgenciaSpan.classList.add('urgencia');
        urgenciaSpan.textContent = task.urgencia;

        metaInfo.appendChild(dataHoraCriacao);
        metaInfo.appendChild(urgenciaSpan);

        const acoesDiv = document.createElement('div');
        acoesDiv.classList.add('task-acoes');

        const btnFinalizar = document.createElement('button');
        btnFinalizar.classList.add('btn-acao', 'btn-finalizar');
        btnFinalizar.textContent = task.completed ? 'Refazer' : 'Finalizar';
        btnFinalizar.addEventListener('click', () => toggleFinalizarTask(task.id));

        const btnExcluir = document.createElement('button');
        btnExcluir.classList.add('btn-acao', 'btn-excluir');
        btnExcluir.textContent = 'Excluir';
        btnExcluir.addEventListener('click', () => excluirTask(task.id));

        acoesDiv.appendChild(btnFinalizar);
        acoesDiv.appendChild(btnExcluir);

        taskItem.appendChild(nomeTask);
        taskItem.appendChild(descricaoTask);
        taskItem.appendChild(metaInfo);
        taskItem.appendChild(acoesDiv);

        tasksContainer.appendChild(taskItem);
    }

    function toggleFinalizarTask(taskId) {
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex > -1) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed;
            salvarTasks();

            const taskItemElement = tasksContainer.querySelector(`[data-id="${taskId}"]`);
            if (taskItemElement) {
                taskItemElement.classList.toggle('task-completed');
                const btnFinalizarElement = taskItemElement.querySelector('.btn-finalizar');
                if (btnFinalizarElement) {
                    btnFinalizarElement.textContent = tasks[taskIndex].completed ? 'Refazer' : 'Finalizar';
                }
            }
        }
    }

    function excluirTask(taskId) {
        tasks = tasks.filter(t => t.id !== taskId)
        salvarTasks();

        const taskItemElement = tasksContainer.querySelector(`[data-id="${taskId}"]`);
        if (taskItemElement) {
            taskItemElement.remove();
        }

        if (tasks.length === 0) {
            tasksContainer.innerHTML = '';
        }
    }

    carregarTasks();
});
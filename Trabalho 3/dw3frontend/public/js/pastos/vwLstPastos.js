document.addEventListener('DOMContentLoaded', function() {
  if (!dw3IsLogged()) {
    return;
  }

  var listagem = document.getElementById('pastosListagem');
  var alertBox = document.getElementById('pastosAlert');

  if (!listagem) {
    return;
  }

  carregarPastos(listagem.dataset.servidorDw3, alertBox);
});

async function carregarPastos(servidorDw3, alertBox) {
  try {
    if (!servidorDw3) {
      throw new Error('Endereco do servidor backend nao configurado.');
    }

    var response = await fetch(servidorDw3 + '/getAllPastos', {
      headers: dw3MontarHeadersAutenticacao()
    });

    if (!response.ok) {
      throw new Error('Nao foi possivel carregar a lista de pastos.');
    }

    var data = await response.json();

    if (!dw3TratarRespostaAutenticacao(data)) {
      return;
    }

    if (data.status !== 'ok' || !Array.isArray(data.registro)) {
      throw new Error('Resposta invalida do servidor backend.');
    }

    inicializarTabelaPastos(data.registro);
  } catch (error) {
    exibirErro(alertBox, error.message || 'Erro ao carregar pastos.');
    inicializarTabelaPastos([]);
  }
}

function inicializarTabelaPastos(pastos) {
  new DataTable('#tblPastos', {
    data: pastos,
    columns: [
      { data: 'pastoid', defaultContent: '', render: DataTable.render.text() },
      { data: 'descricao', defaultContent: '', render: DataTable.render.text() },
      { data: 'areatotal', defaultContent: '', render: function(data, type) { return type === 'display' ? Number(data).toLocaleString('pt-BR', { maximumFractionDigits: 4 }) : data; } },
      {
        data: null,
        orderable: false,
        searchable: false,
        render: function(data, type, row) {
          if (type !== 'display') {
            return '';
          }

          var pastoId = escaparHtml(row.pastoid || '');

          return [
            '<div class="btn-group btn-group-sm" role="group" aria-label="Operacoes do pasto">',
            '<a class="btn btn-outline-primary" href="/pastos/form?oper=Re&pastoid=' + pastoId + '" title="Visualizar" aria-label="Visualizar"><i class="bi bi-eye"></i></a>',
            '<a class="btn btn-outline-secondary" href="/pastos/form?oper=Up&pastoid=' + pastoId + '" title="Atualizar" aria-label="Atualizar"><i class="bi bi-pencil-square"></i></a>',
            '<a class="btn btn-outline-danger" href="/pastos/form?oper=De&pastoid=' + pastoId + '" title="Remover" aria-label="Remover"><i class="bi bi-trash"></i></a>',
            '</div>'
          ].join('');
        }
      }
    ],
    language: {
      emptyTable: 'Nenhum pasto cadastrado.',
      info: 'Mostrando _START_ ate _END_ de _TOTAL_ registros',
      infoEmpty: 'Mostrando 0 ate 0 de 0 registros',
      infoFiltered: '(filtrado de _MAX_ registros no total)',
      lengthMenu: 'Mostrar _MENU_ registros',
      loadingRecords: 'Carregando...',
      processing: 'Processando...',
      search: 'Pesquisar:',
      zeroRecords: 'Nenhum registro encontrado',
      paginate: {
        first: 'Primeiro',
        last: 'Ultimo',
        next: 'Proximo',
        previous: 'Anterior'
      }
    }
  });
}

function escaparHtml(valor) {
  return String(valor)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function exibirErro(alertBox, mensagem) {
  if (!alertBox) {
    return;
  }

  alertBox.textContent = mensagem;
  alertBox.classList.add('alert-danger');
  alertBox.classList.remove('d-none');
}

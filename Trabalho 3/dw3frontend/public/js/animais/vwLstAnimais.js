document.addEventListener('DOMContentLoaded', function() {
  if (!dw3IsLogged()) {
    return;
  }

  var listagem = document.getElementById('animaisListagem');
  var alertBox = document.getElementById('animaisAlert');

  if (!listagem) {
    return;
  }

  carregarAnimais(listagem.dataset.servidorDw3, alertBox);
});

async function carregarAnimais(servidorDw3, alertBox) {
  try {
    if (!servidorDw3) {
      throw new Error('Endereco do servidor backend nao configurado.');
    }

    var response = await fetch(servidorDw3 + '/getAllAnimais', {
      headers: dw3MontarHeadersAutenticacao()
    });

    if (!response.ok) {
      throw new Error('Nao foi possivel carregar a lista de animais.');
    }

    var data = await response.json();

    if (!dw3TratarRespostaAutenticacao(data)) {
      return;
    }

    if (data.status !== 'ok' || !Array.isArray(data.registro)) {
      throw new Error('Resposta invalida do servidor backend.');
    }

    inicializarTabelaAnimais(data.registro);
  } catch (error) {
    exibirErro(alertBox, error.message || 'Erro ao carregar animais.');
    inicializarTabelaAnimais([]);
  }
}

function inicializarTabelaAnimais(animais) {
  new DataTable('#tblAnimais', {
    data: animais,
    columns: [
      { data: 'animalid', defaultContent: '', render: DataTable.render.text() },
      { data: 'nome', defaultContent: '', render: DataTable.render.text() },
      { data: 'datanasc', defaultContent: '', render: function(data, type) { return type === 'display' ? dw3FormatarData(data) : data; } },
      {
        data: null,
        orderable: false,
        searchable: false,
        render: function(data, type, row) {
          if (type !== 'display') {
            return '';
          }

          var animalId = escaparHtml(row.animalid || '');

          return [
            '<div class="btn-group btn-group-sm" role="group" aria-label="Operacoes do animal">',
            '<a class="btn btn-outline-primary" href="/animais/form?oper=Re&animalid=' + animalId + '" title="Visualizar" aria-label="Visualizar"><i class="bi bi-eye"></i></a>',
            '<a class="btn btn-outline-secondary" href="/animais/form?oper=Up&animalid=' + animalId + '" title="Atualizar" aria-label="Atualizar"><i class="bi bi-pencil-square"></i></a>',
            '<a class="btn btn-outline-danger" href="/animais/form?oper=De&animalid=' + animalId + '" title="Remover" aria-label="Remover"><i class="bi bi-trash"></i></a>',
            '</div>'
          ].join('');
        }
      }
    ],
    language: {
      emptyTable: 'Nenhum animal cadastrado.',
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

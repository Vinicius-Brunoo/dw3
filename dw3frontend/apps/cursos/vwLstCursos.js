document.addEventListener('DOMContentLoaded', function() {
  if (!dw3IsLogged()) {
    return;
  }

  var listagem = document.getElementById('cursosListagem');
  var alertBox = document.getElementById('cursosAlert');

  if (!listagem) {
    return;
  }

  carregarCursos(listagem.dataset.servidorDw3, alertBox);
});

async function carregarCursos(servidorDw3, alertBox) {
  try {
    if (!servidorDw3) {
      throw new Error('Endereco do servidor backend nao configurado.');
    }

    var response = await fetch(servidorDw3 + '/getAllCursos', {
      headers: dw3MontarHeadersAutenticacao()
    });

    if (!response.ok) {
      throw new Error('Nao foi possivel carregar a lista de cursos.');
    }

    var data = await response.json();

    if (!dw3TratarRespostaAutenticacao(data)) {
      return;
    }

    if (data.status !== 'ok' || !Array.isArray(data.registro)) {
      throw new Error('Resposta invalida do servidor backend.');
    }

    inicializarTabelaCursos(data.registro);
  } catch (error) {
    exibirErro(alertBox, error.message || 'Erro ao carregar cursos.');
    inicializarTabelaCursos([]);
  }
}

function inicializarTabelaCursos(cursos) {
  new DataTable('#tblCursos', {
    data: cursos,
    columns: [
      { data: 'cursoid', defaultContent: '' },
      { data: 'codigo', defaultContent: '' },
      { data: 'descricao', defaultContent: '' },
      {
        data: 'ativo',
        defaultContent: '',
        render: function(data) {
          return data ? 'Sim' : 'Nao';
        }
      },
      {
        data: null,
        orderable: false,
        searchable: false,
        render: function(data, type, row) {
          if (type !== 'display') {
            return '';
          }

          var cursoId = escaparHtml(row.cursoid || '');

          return [
            '<div class="btn-group btn-group-sm" role="group" aria-label="Operacoes do curso">',
            '<a class="btn btn-outline-primary" href="/cursos/form?oper=Re&cursoid=' + cursoId + '" title="Visualizar" aria-label="Visualizar"><i class="bi bi-eye"></i></a>',
            '<a class="btn btn-outline-secondary" href="/cursos/form?oper=Up&cursoid=' + cursoId + '" title="Atualizar" aria-label="Atualizar"><i class="bi bi-pencil-square"></i></a>',
            '<a class="btn btn-outline-danger" href="/cursos/form?oper=De&cursoid=' + cursoId + '" title="Remover" aria-label="Remover"><i class="bi bi-trash"></i></a>',
            '</div>'
          ].join('');
        }
      }
    ],
    language: {
      emptyTable: 'Nenhum curso cadastrado.',
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

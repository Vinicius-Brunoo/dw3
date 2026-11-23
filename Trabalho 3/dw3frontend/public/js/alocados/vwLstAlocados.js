document.addEventListener('DOMContentLoaded', function() {
  if (!dw3IsLogged()) {
    return;
  }

  var listagem = document.getElementById('alocadosListagem');
  var alertBox = document.getElementById('alocadosAlert');

  if (!listagem) {
    return;
  }

  carregarAlocados(listagem.dataset.servidorDw3, alertBox);
});

async function carregarAlocados(servidorDw3, alertBox) {
  try {
    if (!servidorDw3) {
      throw new Error('Endereco do servidor backend nao configurado.');
    }

    var response = await fetch(servidorDw3 + '/getAllAlocados', {
      headers: dw3MontarHeadersAutenticacao()
    });

    if (!response.ok) {
      throw new Error('Nao foi possivel carregar a lista de alocados.');
    }

    var data = await response.json();

    if (!dw3TratarRespostaAutenticacao(data)) {
      return;
    }

    if (data.status !== 'ok' || !Array.isArray(data.registro)) {
      throw new Error('Resposta invalida do servidor backend.');
    }

    var respostaAnimais = await fetch(servidorDw3 + '/getAllAnimais', { headers: dw3MontarHeadersAutenticacao() });
    var animais = await respostaAnimais.json();
    if (!dw3TratarRespostaAutenticacao(animais)) return;
    if (!respostaAnimais.ok || animais.status !== 'ok') throw new Error('Não foi possível carregar animais.');
    data.registro.forEach(function(registro) {
      var relacionado = animais.registro.find(function(item) { return item.animalid === registro.animalidifk; });
      registro.animalNome = relacionado ? relacionado.nome : 'Animal removido';
    });

    var respostaPiquetes = await fetch(servidorDw3 + '/getAllPiquetes', { headers: dw3MontarHeadersAutenticacao() });
    var piquetes = await respostaPiquetes.json();
    if (!dw3TratarRespostaAutenticacao(piquetes)) return;
    if (!respostaPiquetes.ok || piquetes.status !== 'ok') throw new Error('Não foi possível carregar piquetes.');
    data.registro.forEach(function(registro) {
      var relacionado = piquetes.registro.find(function(item) { return item.piqueteid === registro.piqueteidfk; });
      registro.piqueteDescricao = relacionado ? relacionado.descricao : 'Piquete removido';
    });

    inicializarTabelaAlocados(data.registro);
  } catch (error) {
    exibirErro(alertBox, error.message || 'Erro ao carregar alocados.');
    inicializarTabelaAlocados([]);
  }
}

function inicializarTabelaAlocados(alocados) {
  new DataTable('#tblAlocados', {
    data: alocados,
    columns: [
      { data: 'alocadoid', defaultContent: '', render: DataTable.render.text() },
      { data: 'animalNome', defaultContent: '', render: DataTable.render.text() },
      { data: 'piqueteDescricao', defaultContent: '', render: DataTable.render.text() },
      { data: 'datainicio', defaultContent: '', render: function(data, type) { return type === 'display' ? dw3FormatarData(data) : data; } },
      { data: 'datafinal', defaultContent: '', render: function(data, type) { return type === 'display' ? (data ? dw3FormatarData(data) : 'Em andamento') : data; } },
      {
        data: null,
        orderable: false,
        searchable: false,
        render: function(data, type, row) {
          if (type !== 'display') {
            return '';
          }

          var alocadoId = escaparHtml(row.alocadoid || '');

          return [
            '<div class="btn-group btn-group-sm" role="group" aria-label="Operacoes do alocado">',
            '<a class="btn btn-outline-primary" href="/alocados/form?oper=Re&alocadoid=' + alocadoId + '" title="Visualizar" aria-label="Visualizar"><i class="bi bi-eye"></i></a>',
            '<a class="btn btn-outline-secondary" href="/alocados/form?oper=Up&alocadoid=' + alocadoId + '" title="Atualizar" aria-label="Atualizar"><i class="bi bi-pencil-square"></i></a>',
            '<a class="btn btn-outline-danger" href="/alocados/form?oper=De&alocadoid=' + alocadoId + '" title="Remover" aria-label="Remover"><i class="bi bi-trash"></i></a>',
            '</div>'
          ].join('');
        }
      }
    ],
    language: {
      emptyTable: 'Nenhum alocado cadastrado.',
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

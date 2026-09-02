document.addEventListener('DOMContentLoaded', function() {
  if (!dw3IsLogged()) {
    return;
  }

  var form = document.getElementById('frmAlunos');

  if (!form) {
    return;
  }

  var oper = form.dataset.oper || 'Cr';
  var servidorDw3 = form.dataset.servidorDw3;
  var alunoId = form.dataset.alunoid;

  inicializarSelectCursos();
  configurarBotoesAluno(oper, alunoId);
  carregarCursosToAlunos(servidorDw3).then(function() {
    if (oper !== 'Cr') {
      carregarAlunoByID(servidorDw3, alunoId, oper);
    }
  });
});

function inicializarSelectCursos() {
  $('#cursoid').select2({
    theme: 'bootstrap-5',
    placeholder: 'Selecione um curso',
    width: '100%'
  });
}

function configurarBotoesAluno(oper, alunoId) {
  var btnInserir = document.getElementById('btnInserirAluno');
  var btnAtualizar = document.getElementById('btnAtualizarAluno');
  var btnRemover = document.getElementById('btnRemoverAluno');
  var form = document.getElementById('frmAlunos');

  if (oper === 'Cr') {
    dw3OcultarBotao('btnAtualizarAluno');
    dw3OcultarBotao('btnRemoverAluno');
  }

  if (oper === 'Re') {
    dw3OcultarBotao('btnInserirAluno');
    dw3OcultarBotao('btnAtualizarAluno');
    dw3OcultarBotao('btnRemoverAluno');
    dw3DesabilitarCampos(form);
  }

  if (oper === 'Up') {
    dw3OcultarBotao('btnInserirAluno');
    dw3OcultarBotao('btnRemoverAluno');
  }

  if (oper === 'De') {
    dw3OcultarBotao('btnInserirAluno');
    dw3OcultarBotao('btnAtualizarAluno');
  }

  if (btnInserir) {
    btnInserir.addEventListener('click', function() {
      vwInsertAluno();
    });
  }

  if (btnAtualizar) {
    btnAtualizar.addEventListener('click', function() {
      vwUpdateAluno(alunoId);
    });
  }

  if (btnRemover) {
    btnRemover.addEventListener('click', function() {
      vwDeleteAluno(alunoId);
    });
  }
}

async function carregarCursosToAlunos(servidorDw3) {
  try {
    if (!servidorDw3) {
      throw new Error('Endereco do servidor backend nao configurado.');
    }

    var response = await fetch(servidorDw3 + '/getCursosToAlunos', {
      headers: dw3MontarHeadersAutenticacao()
    });

    if (!response.ok) {
      throw new Error('Nao foi possivel carregar os cursos.');
    }

    var data = await response.json();

    if (!dw3TratarRespostaAutenticacao(data)) {
      return;
    }

    if (data.status !== 'ok' || !Array.isArray(data.registro)) {
      throw new Error('Resposta invalida do servidor backend.');
    }

    preencherSelectCursos(data.registro);
  } catch (error) {
    alert(error.message || 'Erro ao carregar cursos.');
  }
}

async function carregarAlunoByID(servidorDw3, alunoId, oper) {
  try {
    var response = await fetch(servidorDw3 + '/getAlunoByID/' + alunoId, {
      headers: dw3MontarHeadersAutenticacao()
    });

    if (!response.ok) {
      throw new Error('Nao foi possivel carregar o aluno.');
    }

    var data = await response.json();

    if (!dw3TratarRespostaAutenticacao(data)) {
      return;
    }

    if (data.status !== 'ok' || !Array.isArray(data.registro) || data.registro.length === 0) {
      throw new Error('Aluno nao encontrado.');
    }

    preencherFormularioAluno(data.registro[0]);

    if (oper === 'Re') {
      dw3DesabilitarCampos(document.getElementById('frmAlunos'));
    }
  } catch (error) {
    alert(error.message || 'Erro ao carregar aluno.');
  }
}

function preencherSelectCursos(cursos) {
  var cursoSelect = document.getElementById('cursoid');

  if (!cursoSelect) {
    return;
  }

  cursoSelect.innerHTML = '<option value="">Selecione um curso</option>';

  cursos.forEach(function(curso) {
    var option = document.createElement('option');
    option.value = curso.cursoid;
    option.textContent = curso.descricao;
    cursoSelect.appendChild(option);
  });

  $('#cursoid').trigger('change');
}

function preencherFormularioAluno(aluno) {
  document.getElementById('alunoid').value = aluno.alunoid || '';
  document.getElementById('prontuario').value = aluno.prontuario || '';
  document.getElementById('nome').value = aluno.nome || '';
  document.getElementById('endereco').value = aluno.endereco || '';
  document.getElementById('rendafamiliar').value = aluno.rendafamiliar || '';
  document.getElementById('datanascimento').value = aluno.datanascimento || '';
  document.getElementById('cursoid').value = aluno.cursoid || '';
  document.getElementById('deleted').value = aluno.deleted ? 'true' : 'false';
  $('#cursoid').trigger('change');
}

async function vwInsertAluno() {
  var form = document.getElementById('frmAlunos');
  var btnInserir = document.getElementById('btnInserirAluno');

  try {
    if (!form.reportValidity()) {
      return;
    }

    var servidorDw3 = form.dataset.servidorDw3;

    if (btnInserir) {
      btnInserir.disabled = true;
    }

    var response = await fetch(servidorDw3 + '/insertAluno', {
      method: 'POST',
      headers: dw3MontarHeadersAutenticacao({
        'content-type': 'application/json'
      }),
      body: JSON.stringify(montarAlunoDoFormulario())
    });

    await tratarRespostaCrud(response, 'Nao foi possivel inserir o aluno.');
    window.location.href = '/alunos';
  } catch (error) {
    alert(error.message || 'Erro ao inserir aluno.');
  } finally {
    if (btnInserir) {
      btnInserir.disabled = false;
    }
  }
}

async function vwUpdateAluno(alunoId) {
  var form = document.getElementById('frmAlunos');
  var btnAtualizar = document.getElementById('btnAtualizarAluno');

  try {
    if (!form.reportValidity()) {
      return;
    }

    if (btnAtualizar) {
      btnAtualizar.disabled = true;
    }

    var response = await fetch(form.dataset.servidorDw3 + '/updateAluno/' + alunoId, {
      method: 'PUT',
      headers: dw3MontarHeadersAutenticacao({
        'content-type': 'application/json'
      }),
      body: JSON.stringify(montarAlunoDoFormulario())
    });

    await tratarRespostaCrud(response, 'Nao foi possivel atualizar o aluno.');
    window.location.href = '/alunos';
  } catch (error) {
    alert(error.message || 'Erro ao atualizar aluno.');
  } finally {
    if (btnAtualizar) {
      btnAtualizar.disabled = false;
    }
  }
}

async function vwDeleteAluno(alunoId) {
  var form = document.getElementById('frmAlunos');
  var btnRemover = document.getElementById('btnRemoverAluno');

  try {
    if (!confirm('Confirma a remocao deste aluno?')) {
      return;
    }

    if (btnRemover) {
      btnRemover.disabled = true;
    }

    var response = await fetch(form.dataset.servidorDw3 + '/deleteAluno/' + alunoId, {
      method: 'DELETE',
      headers: dw3MontarHeadersAutenticacao()
    });

    await tratarRespostaCrud(response, 'Nao foi possivel remover o aluno.');
    window.location.href = '/alunos';
  } catch (error) {
    alert(error.message || 'Erro ao remover aluno.');
  } finally {
    if (btnRemover) {
      btnRemover.disabled = false;
    }
  }
}

async function tratarRespostaCrud(response, mensagemErro) {
  if (!response.ok) {
    throw new Error(mensagemErro);
  }

  var data = await response.json();

  if (!dw3TratarRespostaAutenticacao(data)) {
    throw new Error('Sessao expirada.');
  }

  if (data.status !== 'ok') {
    throw new Error(data.status || mensagemErro);
  }
}

function montarAlunoDoFormulario() {
  return {
    prontuario: document.getElementById('prontuario').value,
    nome: document.getElementById('nome').value,
    endereco: document.getElementById('endereco').value,
    rendafamiliar: document.getElementById('rendafamiliar').value,
    datanascimento: document.getElementById('datanascimento').value,
    cursoid: document.getElementById('cursoid').value,
    deleted: document.getElementById('deleted').value === 'true'
  };
}

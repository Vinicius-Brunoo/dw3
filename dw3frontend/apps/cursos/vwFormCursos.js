document.addEventListener('DOMContentLoaded', function() {
  if (!dw3IsLogged()) {
    return;
  }

  var form = document.getElementById('frmCursos');

  if (!form) {
    return;
  }

  var oper = form.dataset.oper || 'Cr';
  var cursoId = form.dataset.cursoid;

  configurarBotoesCurso(oper, cursoId);

  if (oper !== 'Cr') {
    carregarCursoByID(form.dataset.servidorDw3, cursoId, oper);
  }
});

function configurarBotoesCurso(oper, cursoId) {
  var btnInserir = document.getElementById('btnInserirCurso');
  var btnAtualizar = document.getElementById('btnAtualizarCurso');
  var btnRemover = document.getElementById('btnRemoverCurso');
  var form = document.getElementById('frmCursos');

  if (oper === 'Cr') {
    dw3OcultarBotao('btnAtualizarCurso');
    dw3OcultarBotao('btnRemoverCurso');
  }

  if (oper === 'Re') {
    dw3OcultarBotao('btnInserirCurso');
    dw3OcultarBotao('btnAtualizarCurso');
    dw3OcultarBotao('btnRemoverCurso');
    dw3DesabilitarCampos(form);
  }

  if (oper === 'Up') {
    dw3OcultarBotao('btnInserirCurso');
    dw3OcultarBotao('btnRemoverCurso');
  }

  if (oper === 'De') {
    dw3OcultarBotao('btnInserirCurso');
    dw3OcultarBotao('btnAtualizarCurso');
  }

  if (btnInserir) {
    btnInserir.addEventListener('click', function() {
      vwInsertCurso();
    });
  }

  if (btnAtualizar) {
    btnAtualizar.addEventListener('click', function() {
      vwUpdateCurso(cursoId);
    });
  }

  if (btnRemover) {
    btnRemover.addEventListener('click', function() {
      vwDeleteCurso(cursoId);
    });
  }
}

async function carregarCursoByID(servidorDw3, cursoId, oper) {
  try {
    var response = await fetch(servidorDw3 + '/getCursoByID/' + cursoId, {
      headers: dw3MontarHeadersAutenticacao()
    });

    if (!response.ok) {
      throw new Error('Nao foi possivel carregar o curso.');
    }

    var data = await response.json();

    if (!dw3TratarRespostaAutenticacao(data)) {
      return;
    }

    if (data.status !== 'ok' || !Array.isArray(data.registro) || data.registro.length === 0) {
      throw new Error('Curso nao encontrado.');
    }

    preencherFormularioCurso(data.registro[0]);

    if (oper === 'Re') {
      dw3DesabilitarCampos(document.getElementById('frmCursos'));
    }
  } catch (error) {
    alert(error.message || 'Erro ao carregar curso.');
  }
}

function preencherFormularioCurso(curso) {
  document.getElementById('cursoid').value = curso.cursoid || '';
  document.getElementById('codigo').value = curso.codigo || '';
  document.getElementById('descricao').value = curso.descricao || '';
  document.getElementById('ativo').checked = Boolean(curso.ativo);
  document.getElementById('deleted').value = curso.deleted ? 'true' : 'false';
}

async function vwInsertCurso() {
  var form = document.getElementById('frmCursos');
  var btnInserir = document.getElementById('btnInserirCurso');

  try {
    if (!form.reportValidity()) {
      return;
    }

    if (btnInserir) {
      btnInserir.disabled = true;
    }

    var response = await fetch(form.dataset.servidorDw3 + '/insertCurso', {
      method: 'POST',
      headers: dw3MontarHeadersAutenticacao({
        'content-type': 'application/json'
      }),
      body: JSON.stringify(montarCursoDoFormulario())
    });

    await tratarRespostaCrudCurso(response, 'Nao foi possivel inserir o curso.');
    window.location.href = '/cursos';
  } catch (error) {
    alert(error.message || 'Erro ao inserir curso.');
  } finally {
    if (btnInserir) {
      btnInserir.disabled = false;
    }
  }
}

async function vwUpdateCurso(cursoId) {
  var form = document.getElementById('frmCursos');
  var btnAtualizar = document.getElementById('btnAtualizarCurso');

  try {
    if (!form.reportValidity()) {
      return;
    }

    if (btnAtualizar) {
      btnAtualizar.disabled = true;
    }

    var response = await fetch(form.dataset.servidorDw3 + '/updateCurso/' + cursoId, {
      method: 'PUT',
      headers: dw3MontarHeadersAutenticacao({
        'content-type': 'application/json'
      }),
      body: JSON.stringify(montarCursoDoFormulario())
    });

    await tratarRespostaCrudCurso(response, 'Nao foi possivel atualizar o curso.');
    window.location.href = '/cursos';
  } catch (error) {
    alert(error.message || 'Erro ao atualizar curso.');
  } finally {
    if (btnAtualizar) {
      btnAtualizar.disabled = false;
    }
  }
}

async function vwDeleteCurso(cursoId) {
  var form = document.getElementById('frmCursos');
  var btnRemover = document.getElementById('btnRemoverCurso');

  try {
    if (!confirm('Confirma a remocao deste curso?')) {
      return;
    }

    if (btnRemover) {
      btnRemover.disabled = true;
    }

    var response = await fetch(form.dataset.servidorDw3 + '/deleteCurso/' + cursoId, {
      method: 'DELETE',
      headers: dw3MontarHeadersAutenticacao()
    });

    await tratarRespostaCrudCurso(response, 'Nao foi possivel remover o curso.');
    window.location.href = '/cursos';
  } catch (error) {
    alert(error.message || 'Erro ao remover curso.');
  } finally {
    if (btnRemover) {
      btnRemover.disabled = false;
    }
  }
}

async function tratarRespostaCrudCurso(response, mensagemErro) {
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

function montarCursoDoFormulario() {
  return {
    codigo: document.getElementById('codigo').value,
    descricao: document.getElementById('descricao').value,
    ativo: document.getElementById('ativo').checked,
    deleted: document.getElementById('deleted').value === 'true'
  };
}

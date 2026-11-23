document.addEventListener('DOMContentLoaded', function() {
  if (!dw3IsLogged()) {
    return;
  }

  var form = document.getElementById('frmPastos');

  if (!form) {
    return;
  }

  var oper = form.dataset.oper || 'Cr';
  var pastoId = form.dataset.pastoid;

  configurarBotoesPasto(oper, pastoId);

  if (oper !== 'Cr') {
    carregarPastoByID(form.dataset.servidorDw3, pastoId, oper);
  }
});

function configurarBotoesPasto(oper, pastoId) {
  var btnInserir = document.getElementById('btnInserirPasto');
  var btnAtualizar = document.getElementById('btnAtualizarPasto');
  var btnRemover = document.getElementById('btnRemoverPasto');
  var form = document.getElementById('frmPastos');

  if (oper === 'Cr') {
    dw3OcultarBotao('btnAtualizarPasto');
    dw3OcultarBotao('btnRemoverPasto');
  }

  if (oper === 'Re') {
    dw3OcultarBotao('btnInserirPasto');
    dw3OcultarBotao('btnAtualizarPasto');
    dw3OcultarBotao('btnRemoverPasto');
    dw3DesabilitarCampos(form);
  }

  if (oper === 'Up') {
    dw3OcultarBotao('btnInserirPasto');
    dw3OcultarBotao('btnRemoverPasto');
  }

  if (oper === 'De') {
    dw3OcultarBotao('btnInserirPasto');
    dw3OcultarBotao('btnAtualizarPasto');
  }

  if (btnInserir) {
    btnInserir.addEventListener('click', function() {
      vwInsertPasto();
    });
  }

  if (btnAtualizar) {
    btnAtualizar.addEventListener('click', function() {
      vwUpdatePasto(pastoId);
    });
  }

  if (btnRemover) {
    btnRemover.addEventListener('click', function() {
      vwDeletePasto(pastoId);
    });
  }
}

async function carregarPastoByID(servidorDw3, pastoId, oper) {
  try {
    var response = await fetch(servidorDw3 + '/getPastoByID/' + pastoId, {
      headers: dw3MontarHeadersAutenticacao()
    });

    if (!response.ok) {
      throw new Error('Nao foi possivel carregar o pasto.');
    }

    var data = await response.json();

    if (!dw3TratarRespostaAutenticacao(data)) {
      return;
    }

    if (data.status !== 'ok' || !Array.isArray(data.registro) || data.registro.length === 0) {
      throw new Error('Pasto nao encontrado.');
    }

    preencherFormularioPasto(data.registro[0]);

    if (oper === 'Re') {
      dw3DesabilitarCampos(document.getElementById('frmPastos'));
    }
  } catch (error) {
    alert(error.message || 'Erro ao carregar pasto.');
  }
}

function preencherFormularioPasto(registro) {
  document.getElementById('pastoid').value = registro.pastoid ?? '';
  document.getElementById('descricao').value = registro.descricao ?? '';
  document.getElementById('areatotal').value = registro.areatotal ?? '';
}

async function vwInsertPasto() {
  var form = document.getElementById('frmPastos');
  var btnInserir = document.getElementById('btnInserirPasto');

  try {
    if (!form.reportValidity()) {
      return;
    }

    if (btnInserir) {
      btnInserir.disabled = true;
    }

    var response = await fetch(form.dataset.servidorDw3 + '/insertPasto', {
      method: 'POST',
      headers: dw3MontarHeadersAutenticacao({
        'content-type': 'application/json'
      }),
      body: JSON.stringify(montarPastoDoFormulario())
    });

    await tratarRespostaCrudPasto(response, 'Nao foi possivel inserir o pasto.');
    window.location.href = '/pastos';
  } catch (error) {
    alert(error.message || 'Erro ao inserir pasto.');
  } finally {
    if (btnInserir) {
      btnInserir.disabled = false;
    }
  }
}

async function vwUpdatePasto(pastoId) {
  var form = document.getElementById('frmPastos');
  var btnAtualizar = document.getElementById('btnAtualizarPasto');

  try {
    if (!form.reportValidity()) {
      return;
    }

    if (btnAtualizar) {
      btnAtualizar.disabled = true;
    }

    var response = await fetch(form.dataset.servidorDw3 + '/updatePasto/' + pastoId, {
      method: 'PUT',
      headers: dw3MontarHeadersAutenticacao({
        'content-type': 'application/json'
      }),
      body: JSON.stringify(montarPastoDoFormulario())
    });

    await tratarRespostaCrudPasto(response, 'Nao foi possivel atualizar o pasto.');
    window.location.href = '/pastos';
  } catch (error) {
    alert(error.message || 'Erro ao atualizar pasto.');
  } finally {
    if (btnAtualizar) {
      btnAtualizar.disabled = false;
    }
  }
}

async function vwDeletePasto(pastoId) {
  var form = document.getElementById('frmPastos');
  var btnRemover = document.getElementById('btnRemoverPasto');

  try {
    if (!confirm('Confirma a remocao deste pasto?')) {
      return;
    }

    if (btnRemover) {
      btnRemover.disabled = true;
    }

    var response = await fetch(form.dataset.servidorDw3 + '/deletePasto/' + pastoId, {
      method: 'DELETE',
      headers: dw3MontarHeadersAutenticacao()
    });

    await tratarRespostaCrudPasto(response, 'Nao foi possivel remover o pasto.');
    window.location.href = '/pastos';
  } catch (error) {
    alert(error.message || 'Erro ao remover pasto.');
  } finally {
    if (btnRemover) {
      btnRemover.disabled = false;
    }
  }
}

async function tratarRespostaCrudPasto(response, mensagemErro) {
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

function montarPastoDoFormulario() {
  return {
    descricao: document.getElementById('descricao').value,
    areatotal: document.getElementById('areatotal').value
  };
}

document.addEventListener('DOMContentLoaded', async function() {
  if (!dw3IsLogged()) {
    return;
  }

  var form = document.getElementById('frmPiquetes');

  if (!form) {
    return;
  }

  try {
    var respostapastoidfk = await fetch(form.dataset.servidorDw3 + '/getAllPastos', { headers: dw3MontarHeadersAutenticacao() });
    var dadospastoidfk = await respostapastoidfk.json();
    if (!dw3TratarRespostaAutenticacao(dadospastoidfk)) return;
    if (!respostapastoidfk.ok || dadospastoidfk.status !== 'ok') throw new Error('Não foi possível carregar pastos.');
    dadospastoidfk.registro.forEach(function(item) {
      document.getElementById('pastoidfk').add(new Option(item.descricao, item.pastoid));
    });
  } catch (error) {
    alert(error.message);
    dw3DesabilitarCampos(form);
    return;
  }

  var oper = form.dataset.oper || 'Cr';
  var piqueteId = form.dataset.piqueteid;

  configurarBotoesPiquete(oper, piqueteId);

  if (oper !== 'Cr') {
    carregarPiqueteByID(form.dataset.servidorDw3, piqueteId, oper);
  }
});

function configurarBotoesPiquete(oper, piqueteId) {
  var btnInserir = document.getElementById('btnInserirPiquete');
  var btnAtualizar = document.getElementById('btnAtualizarPiquete');
  var btnRemover = document.getElementById('btnRemoverPiquete');
  var form = document.getElementById('frmPiquetes');

  if (oper === 'Cr') {
    dw3OcultarBotao('btnAtualizarPiquete');
    dw3OcultarBotao('btnRemoverPiquete');
  }

  if (oper === 'Re') {
    dw3OcultarBotao('btnInserirPiquete');
    dw3OcultarBotao('btnAtualizarPiquete');
    dw3OcultarBotao('btnRemoverPiquete');
    dw3DesabilitarCampos(form);
  }

  if (oper === 'Up') {
    dw3OcultarBotao('btnInserirPiquete');
    dw3OcultarBotao('btnRemoverPiquete');
  }

  if (oper === 'De') {
    dw3OcultarBotao('btnInserirPiquete');
    dw3OcultarBotao('btnAtualizarPiquete');
  }

  if (btnInserir) {
    btnInserir.addEventListener('click', function() {
      vwInsertPiquete();
    });
  }

  if (btnAtualizar) {
    btnAtualizar.addEventListener('click', function() {
      vwUpdatePiquete(piqueteId);
    });
  }

  if (btnRemover) {
    btnRemover.addEventListener('click', function() {
      vwDeletePiquete(piqueteId);
    });
  }
}

async function carregarPiqueteByID(servidorDw3, piqueteId, oper) {
  try {
    var response = await fetch(servidorDw3 + '/getPiqueteByID/' + piqueteId, {
      headers: dw3MontarHeadersAutenticacao()
    });

    if (!response.ok) {
      throw new Error('Nao foi possivel carregar o piquete.');
    }

    var data = await response.json();

    if (!dw3TratarRespostaAutenticacao(data)) {
      return;
    }

    if (data.status !== 'ok' || !Array.isArray(data.registro) || data.registro.length === 0) {
      throw new Error('Piquete nao encontrado.');
    }

    preencherFormularioPiquete(data.registro[0]);

    if (oper === 'Re') {
      dw3DesabilitarCampos(document.getElementById('frmPiquetes'));
    }
  } catch (error) {
    alert(error.message || 'Erro ao carregar piquete.');
  }
}

function preencherFormularioPiquete(registro) {
  document.getElementById('piqueteid').value = registro.piqueteid ?? '';
  document.getElementById('descricao').value = registro.descricao ?? '';
  document.getElementById('latitude').value = registro.latitude ?? '';
  document.getElementById('longitude').value = registro.longitude ?? '';
  document.getElementById('pastoidfk').value = registro.pastoidfk ?? '';
}

async function vwInsertPiquete() {
  var form = document.getElementById('frmPiquetes');
  var btnInserir = document.getElementById('btnInserirPiquete');

  try {
    if (!form.reportValidity()) {
      return;
    }

    if (btnInserir) {
      btnInserir.disabled = true;
    }

    var response = await fetch(form.dataset.servidorDw3 + '/insertPiquete', {
      method: 'POST',
      headers: dw3MontarHeadersAutenticacao({
        'content-type': 'application/json'
      }),
      body: JSON.stringify(montarPiqueteDoFormulario())
    });

    await tratarRespostaCrudPiquete(response, 'Nao foi possivel inserir o piquete.');
    window.location.href = '/piquetes';
  } catch (error) {
    alert(error.message || 'Erro ao inserir piquete.');
  } finally {
    if (btnInserir) {
      btnInserir.disabled = false;
    }
  }
}

async function vwUpdatePiquete(piqueteId) {
  var form = document.getElementById('frmPiquetes');
  var btnAtualizar = document.getElementById('btnAtualizarPiquete');

  try {
    if (!form.reportValidity()) {
      return;
    }

    if (btnAtualizar) {
      btnAtualizar.disabled = true;
    }

    var response = await fetch(form.dataset.servidorDw3 + '/updatePiquete/' + piqueteId, {
      method: 'PUT',
      headers: dw3MontarHeadersAutenticacao({
        'content-type': 'application/json'
      }),
      body: JSON.stringify(montarPiqueteDoFormulario())
    });

    await tratarRespostaCrudPiquete(response, 'Nao foi possivel atualizar o piquete.');
    window.location.href = '/piquetes';
  } catch (error) {
    alert(error.message || 'Erro ao atualizar piquete.');
  } finally {
    if (btnAtualizar) {
      btnAtualizar.disabled = false;
    }
  }
}

async function vwDeletePiquete(piqueteId) {
  var form = document.getElementById('frmPiquetes');
  var btnRemover = document.getElementById('btnRemoverPiquete');

  try {
    if (!confirm('Confirma a remocao deste piquete?')) {
      return;
    }

    if (btnRemover) {
      btnRemover.disabled = true;
    }

    var response = await fetch(form.dataset.servidorDw3 + '/deletePiquete/' + piqueteId, {
      method: 'DELETE',
      headers: dw3MontarHeadersAutenticacao()
    });

    await tratarRespostaCrudPiquete(response, 'Nao foi possivel remover o piquete.');
    window.location.href = '/piquetes';
  } catch (error) {
    alert(error.message || 'Erro ao remover piquete.');
  } finally {
    if (btnRemover) {
      btnRemover.disabled = false;
    }
  }
}

async function tratarRespostaCrudPiquete(response, mensagemErro) {
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

function montarPiqueteDoFormulario() {
  return {
    descricao: document.getElementById('descricao').value,
    latitude: document.getElementById('latitude').value,
    longitude: document.getElementById('longitude').value,
    pastoidfk: document.getElementById('pastoidfk').value
  };
}

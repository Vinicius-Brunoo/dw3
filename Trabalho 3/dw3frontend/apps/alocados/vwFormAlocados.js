document.addEventListener('DOMContentLoaded', async function() {
  if (!dw3IsLogged()) {
    return;
  }

  var form = document.getElementById('frmAlocados');

  if (!form) {
    return;
  }

  try {
    var respostaanimalidifk = await fetch(form.dataset.servidorDw3 + '/getAllAnimais', { headers: dw3MontarHeadersAutenticacao() });
    var dadosanimalidifk = await respostaanimalidifk.json();
    if (!dw3TratarRespostaAutenticacao(dadosanimalidifk)) return;
    if (!respostaanimalidifk.ok || dadosanimalidifk.status !== 'ok') throw new Error('Não foi possível carregar animais.');
    dadosanimalidifk.registro.forEach(function(item) {
      document.getElementById('animalidifk').add(new Option(item.nome, item.animalid));
    });
    var respostapiqueteidfk = await fetch(form.dataset.servidorDw3 + '/getAllPiquetes', { headers: dw3MontarHeadersAutenticacao() });
    var dadospiqueteidfk = await respostapiqueteidfk.json();
    if (!dw3TratarRespostaAutenticacao(dadospiqueteidfk)) return;
    if (!respostapiqueteidfk.ok || dadospiqueteidfk.status !== 'ok') throw new Error('Não foi possível carregar piquetes.');
    dadospiqueteidfk.registro.forEach(function(item) {
      document.getElementById('piqueteidfk').add(new Option(item.descricao, item.piqueteid));
    });
  } catch (error) {
    alert(error.message);
    dw3DesabilitarCampos(form);
    return;
  }

  var oper = form.dataset.oper || 'Cr';
  var alocadoId = form.dataset.alocadoid;

  configurarBotoesAlocado(oper, alocadoId);

  if (oper !== 'Cr') {
    carregarAlocadoByID(form.dataset.servidorDw3, alocadoId, oper);
  }
});

function configurarBotoesAlocado(oper, alocadoId) {
  var btnInserir = document.getElementById('btnInserirAlocado');
  var btnAtualizar = document.getElementById('btnAtualizarAlocado');
  var btnRemover = document.getElementById('btnRemoverAlocado');
  var form = document.getElementById('frmAlocados');

  if (oper === 'Cr') {
    dw3OcultarBotao('btnAtualizarAlocado');
    dw3OcultarBotao('btnRemoverAlocado');
  }

  if (oper === 'Re') {
    dw3OcultarBotao('btnInserirAlocado');
    dw3OcultarBotao('btnAtualizarAlocado');
    dw3OcultarBotao('btnRemoverAlocado');
    dw3DesabilitarCampos(form);
  }

  if (oper === 'Up') {
    dw3OcultarBotao('btnInserirAlocado');
    dw3OcultarBotao('btnRemoverAlocado');
  }

  if (oper === 'De') {
    dw3OcultarBotao('btnInserirAlocado');
    dw3OcultarBotao('btnAtualizarAlocado');
  }

  if (btnInserir) {
    btnInserir.addEventListener('click', function() {
      vwInsertAlocado();
    });
  }

  if (btnAtualizar) {
    btnAtualizar.addEventListener('click', function() {
      vwUpdateAlocado(alocadoId);
    });
  }

  if (btnRemover) {
    btnRemover.addEventListener('click', function() {
      vwDeleteAlocado(alocadoId);
    });
  }
}

async function carregarAlocadoByID(servidorDw3, alocadoId, oper) {
  try {
    var response = await fetch(servidorDw3 + '/getAlocadoByID/' + alocadoId, {
      headers: dw3MontarHeadersAutenticacao()
    });

    if (!response.ok) {
      throw new Error('Nao foi possivel carregar o alocado.');
    }

    var data = await response.json();

    if (!dw3TratarRespostaAutenticacao(data)) {
      return;
    }

    if (data.status !== 'ok' || !Array.isArray(data.registro) || data.registro.length === 0) {
      throw new Error('Alocado nao encontrado.');
    }

    preencherFormularioAlocado(data.registro[0]);

    if (oper === 'Re') {
      dw3DesabilitarCampos(document.getElementById('frmAlocados'));
    }
  } catch (error) {
    alert(error.message || 'Erro ao carregar alocado.');
  }
}

function preencherFormularioAlocado(registro) {
  document.getElementById('alocadoid').value = registro.alocadoid ?? '';
  document.getElementById('animalidifk').value = registro.animalidifk ?? '';
  document.getElementById('piqueteidfk').value = registro.piqueteidfk ?? '';
  document.getElementById('datainicio').value = registro.datainicio ?? '';
  document.getElementById('datafinal').value = registro.datafinal ?? '';
}

async function vwInsertAlocado() {
  var form = document.getElementById('frmAlocados');
  var btnInserir = document.getElementById('btnInserirAlocado');

  try {
    if (!form.reportValidity()) {
      return;
    }

    if (btnInserir) {
      btnInserir.disabled = true;
    }

    var response = await fetch(form.dataset.servidorDw3 + '/insertAlocado', {
      method: 'POST',
      headers: dw3MontarHeadersAutenticacao({
        'content-type': 'application/json'
      }),
      body: JSON.stringify(montarAlocadoDoFormulario())
    });

    await tratarRespostaCrudAlocado(response, 'Nao foi possivel inserir o alocado.');
    window.location.href = '/alocados';
  } catch (error) {
    alert(error.message || 'Erro ao inserir alocado.');
  } finally {
    if (btnInserir) {
      btnInserir.disabled = false;
    }
  }
}

async function vwUpdateAlocado(alocadoId) {
  var form = document.getElementById('frmAlocados');
  var btnAtualizar = document.getElementById('btnAtualizarAlocado');

  try {
    if (!form.reportValidity()) {
      return;
    }

    if (btnAtualizar) {
      btnAtualizar.disabled = true;
    }

    var response = await fetch(form.dataset.servidorDw3 + '/updateAlocado/' + alocadoId, {
      method: 'PUT',
      headers: dw3MontarHeadersAutenticacao({
        'content-type': 'application/json'
      }),
      body: JSON.stringify(montarAlocadoDoFormulario())
    });

    await tratarRespostaCrudAlocado(response, 'Nao foi possivel atualizar o alocado.');
    window.location.href = '/alocados';
  } catch (error) {
    alert(error.message || 'Erro ao atualizar alocado.');
  } finally {
    if (btnAtualizar) {
      btnAtualizar.disabled = false;
    }
  }
}

async function vwDeleteAlocado(alocadoId) {
  var form = document.getElementById('frmAlocados');
  var btnRemover = document.getElementById('btnRemoverAlocado');

  try {
    if (!confirm('Confirma a remocao deste alocado?')) {
      return;
    }

    if (btnRemover) {
      btnRemover.disabled = true;
    }

    var response = await fetch(form.dataset.servidorDw3 + '/deleteAlocado/' + alocadoId, {
      method: 'DELETE',
      headers: dw3MontarHeadersAutenticacao()
    });

    await tratarRespostaCrudAlocado(response, 'Nao foi possivel remover o alocado.');
    window.location.href = '/alocados';
  } catch (error) {
    alert(error.message || 'Erro ao remover alocado.');
  } finally {
    if (btnRemover) {
      btnRemover.disabled = false;
    }
  }
}

async function tratarRespostaCrudAlocado(response, mensagemErro) {
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

function montarAlocadoDoFormulario() {
  return {
    animalidifk: document.getElementById('animalidifk').value,
    piqueteidfk: document.getElementById('piqueteidfk').value,
    datainicio: document.getElementById('datainicio').value,
    datafinal: document.getElementById('datafinal').value
  };
}

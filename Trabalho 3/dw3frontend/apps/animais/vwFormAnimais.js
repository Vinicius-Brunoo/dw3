document.addEventListener('DOMContentLoaded', function() {
  if (!dw3IsLogged()) {
    return;
  }

  var form = document.getElementById('frmAnimais');

  if (!form) {
    return;
  }

  var oper = form.dataset.oper || 'Cr';
  var animalId = form.dataset.animalid;

  configurarBotoesAnimal(oper, animalId);

  if (oper !== 'Cr') {
    carregarAnimalByID(form.dataset.servidorDw3, animalId, oper);
  }
});

function configurarBotoesAnimal(oper, animalId) {
  var btnInserir = document.getElementById('btnInserirAnimal');
  var btnAtualizar = document.getElementById('btnAtualizarAnimal');
  var btnRemover = document.getElementById('btnRemoverAnimal');
  var form = document.getElementById('frmAnimais');

  if (oper === 'Cr') {
    dw3OcultarBotao('btnAtualizarAnimal');
    dw3OcultarBotao('btnRemoverAnimal');
  }

  if (oper === 'Re') {
    dw3OcultarBotao('btnInserirAnimal');
    dw3OcultarBotao('btnAtualizarAnimal');
    dw3OcultarBotao('btnRemoverAnimal');
    dw3DesabilitarCampos(form);
  }

  if (oper === 'Up') {
    dw3OcultarBotao('btnInserirAnimal');
    dw3OcultarBotao('btnRemoverAnimal');
  }

  if (oper === 'De') {
    dw3OcultarBotao('btnInserirAnimal');
    dw3OcultarBotao('btnAtualizarAnimal');
  }

  if (btnInserir) {
    btnInserir.addEventListener('click', function() {
      vwInsertAnimal();
    });
  }

  if (btnAtualizar) {
    btnAtualizar.addEventListener('click', function() {
      vwUpdateAnimal(animalId);
    });
  }

  if (btnRemover) {
    btnRemover.addEventListener('click', function() {
      vwDeleteAnimal(animalId);
    });
  }
}

async function carregarAnimalByID(servidorDw3, animalId, oper) {
  try {
    var response = await fetch(servidorDw3 + '/getAnimalByID/' + animalId, {
      headers: dw3MontarHeadersAutenticacao()
    });

    if (!response.ok) {
      throw new Error('Nao foi possivel carregar o animal.');
    }

    var data = await response.json();

    if (!dw3TratarRespostaAutenticacao(data)) {
      return;
    }

    if (data.status !== 'ok' || !Array.isArray(data.registro) || data.registro.length === 0) {
      throw new Error('Animal nao encontrado.');
    }

    preencherFormularioAnimal(data.registro[0]);

    if (oper === 'Re') {
      dw3DesabilitarCampos(document.getElementById('frmAnimais'));
    }
  } catch (error) {
    alert(error.message || 'Erro ao carregar animal.');
  }
}

function preencherFormularioAnimal(registro) {
  document.getElementById('animalid').value = registro.animalid ?? '';
  document.getElementById('nome').value = registro.nome ?? '';
  document.getElementById('datanasc').value = registro.datanasc ?? '';
}

async function vwInsertAnimal() {
  var form = document.getElementById('frmAnimais');
  var btnInserir = document.getElementById('btnInserirAnimal');

  try {
    if (!form.reportValidity()) {
      return;
    }

    if (btnInserir) {
      btnInserir.disabled = true;
    }

    var response = await fetch(form.dataset.servidorDw3 + '/insertAnimal', {
      method: 'POST',
      headers: dw3MontarHeadersAutenticacao({
        'content-type': 'application/json'
      }),
      body: JSON.stringify(montarAnimalDoFormulario())
    });

    await tratarRespostaCrudAnimal(response, 'Nao foi possivel inserir o animal.');
    window.location.href = '/animais';
  } catch (error) {
    alert(error.message || 'Erro ao inserir animal.');
  } finally {
    if (btnInserir) {
      btnInserir.disabled = false;
    }
  }
}

async function vwUpdateAnimal(animalId) {
  var form = document.getElementById('frmAnimais');
  var btnAtualizar = document.getElementById('btnAtualizarAnimal');

  try {
    if (!form.reportValidity()) {
      return;
    }

    if (btnAtualizar) {
      btnAtualizar.disabled = true;
    }

    var response = await fetch(form.dataset.servidorDw3 + '/updateAnimal/' + animalId, {
      method: 'PUT',
      headers: dw3MontarHeadersAutenticacao({
        'content-type': 'application/json'
      }),
      body: JSON.stringify(montarAnimalDoFormulario())
    });

    await tratarRespostaCrudAnimal(response, 'Nao foi possivel atualizar o animal.');
    window.location.href = '/animais';
  } catch (error) {
    alert(error.message || 'Erro ao atualizar animal.');
  } finally {
    if (btnAtualizar) {
      btnAtualizar.disabled = false;
    }
  }
}

async function vwDeleteAnimal(animalId) {
  var form = document.getElementById('frmAnimais');
  var btnRemover = document.getElementById('btnRemoverAnimal');

  try {
    if (!confirm('Confirma a remocao deste animal?')) {
      return;
    }

    if (btnRemover) {
      btnRemover.disabled = true;
    }

    var response = await fetch(form.dataset.servidorDw3 + '/deleteAnimal/' + animalId, {
      method: 'DELETE',
      headers: dw3MontarHeadersAutenticacao()
    });

    await tratarRespostaCrudAnimal(response, 'Nao foi possivel remover o animal.');
    window.location.href = '/animais';
  } catch (error) {
    alert(error.message || 'Erro ao remover animal.');
  } finally {
    if (btnRemover) {
      btnRemover.disabled = false;
    }
  }
}

async function tratarRespostaCrudAnimal(response, mensagemErro) {
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

function montarAnimalDoFormulario() {
  return {
    nome: document.getElementById('nome').value,
    datanasc: document.getElementById('datanasc').value
  };
}

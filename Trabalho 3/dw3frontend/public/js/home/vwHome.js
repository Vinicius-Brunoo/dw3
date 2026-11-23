document.addEventListener('DOMContentLoaded', async function() {
  if (!dw3IsLogged()) return;

  var resumo = document.getElementById('resumo');
  var modulos = ['Pastos', 'Piquetes', 'Animais', 'Alocados'];
  var registros = {};

  try {
    for (var modulo of modulos) {
      var response = await fetch(resumo.dataset.servidorDw3 + '/getAll' + modulo, {
        headers: dw3MontarHeadersAutenticacao()
      });
      var data = await response.json();
      if (!dw3TratarRespostaAutenticacao(data)) return;
      if (!response.ok || data.status !== 'ok') {
        throw new Error('Não foi possível carregar os dados da propriedade.');
      }
      registros[modulo] = data.registro;
      document.getElementById('total' + modulo).textContent = data.registro.length;
    }

    mostrarUltimasAlocacoes(registros);
  } catch (error) {
    var alerta = document.getElementById('homeAlert');
    alerta.textContent = error.message || 'Não foi possível carregar a visão geral.';
    alerta.classList.remove('d-none');
    document.getElementById('ultimasAlocacoes').textContent = 'Os dados não estão disponíveis. Tente novamente em instantes.';
  }
});

function mostrarUltimasAlocacoes(registros) {
  var lista = document.getElementById('ultimasAlocacoes');
  lista.replaceChildren();

  if (registros.Alocados.length === 0) {
    lista.innerHTML = '<div class="empty-state"><i class="bi bi-arrow-left-right" aria-hidden="true"></i><h3>O próximo manejo começa aqui</h3><p>Depois de cadastrar seus pastos, piquetes e animais, registre a primeira alocação.</p><a class="text-link" href="/alocados/form?oper=Cr">Criar uma alocação <i class="bi bi-arrow-right" aria-hidden="true"></i></a></div>';
    return;
  }

  var ultimas = registros.Alocados.slice(-4).reverse();
  for (var alocado of ultimas) {
    var animal = registros.Animais.find(function(item) { return item.animalid === alocado.animalidifk; });
    var piquete = registros.Piquetes.find(function(item) { return item.piqueteid === alocado.piqueteidfk; });
    var link = document.createElement('a');
    link.className = 'allocation-item';
    link.href = '/alocados/form?oper=Re&alocadoid=' + encodeURIComponent(alocado.alocadoid);
    link.innerHTML = '<span class="allocation-icon"><i class="bi bi-arrow-left-right" aria-hidden="true"></i></span><div><strong></strong><small></small></div><span class="allocation-period"></span>';
    link.querySelector('strong').textContent = animal ? animal.nome : 'Animal #' + alocado.animalidifk;
    link.querySelector('small').textContent = piquete ? piquete.descricao : 'Piquete #' + alocado.piqueteidfk;
    link.querySelector('.allocation-period').textContent = formatarData(alocado.datainicio) + ' → ' + (alocado.datafinal ? formatarData(alocado.datafinal) : 'Sem data final');
    lista.appendChild(link);
  }
}

function formatarData(valor) {
  return valor.split('-').reverse().join('/');
}

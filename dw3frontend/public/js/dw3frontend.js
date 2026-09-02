function dw3IsLogged() {
  const isLogged = document.cookie
    .split(';')
    .some((cookie) => cookie.trim().startsWith('IsLogged='));

  if (!isLogged) {
    window.location.href = '/login';
    return false;
  }

  return true;
}

function dw3ClearIsLoggedCookie() {
  var isLogged = document.cookie
    .split(';')
    .some((cookie) => cookie.trim().startsWith('IsLogged='));

  if (isLogged) {
    document.cookie = 'IsLogged=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}

function dw3MontarHeadersAutenticacao(headers) {
  var token = localStorage.getItem('token');
  var finalHeaders = headers || {};

  if (token) {
    finalHeaders.Authorization = 'Bearer ' + token;
  }

  return finalHeaders;
}

function dw3OcultarBotao(id) {
  var botao = document.getElementById(id);

  if (botao) {
    botao.classList.add('d-none');
  }
}

function dw3DesabilitarCampos(form) {
  Array.prototype.forEach.call(form.elements, function(campo) {
    if (campo.tagName !== 'BUTTON') {
      campo.disabled = true;
    }
  });
}

function dw3TratarRespostaAutenticacao(data) {
  if (data.auth === false) {
    localStorage.removeItem('token');
    dw3ClearIsLoggedCookie();
    alert(data.message || 'Sessao expirada. Faca login novamente.');
    window.location.href = '/login';
    return false;
  }

  return true;
}

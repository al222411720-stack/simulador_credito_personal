document.getElementById('btn-calcular').addEventListener('click', procesarSimulacion);

function procesarSimulacion() {
  const montoInput = parseFloat(document.getElementById('monto').value);
  const tasaAnualInput = parseFloat(document.getElementById('tasa').value) / 100;
  const plazoMeses = parseInt(document.getElementById('plazo').value);
  const IVA_VALOR = 0.16;

  if (isNaN(montoInput) || isNaN(tasaAnualInput) || montoInput <= 0) {
    alert('Ingrese parámetros numéricos válidos e intente nuevamente.');
    return;
  }

  const amortizacionCapital = montoInput / plazoMeses;
  const tasaMensualEquivalente = tasaAnualInput / 12;

  let saldoInsoluto = montoInput;
  const tablaBody = document.querySelector('#tabla-amortizacion tbody');
  tablaBody.innerHTML = '';

  let acumuladoPagos = 0;
  let acumuladoInteres = 0;
  let acumuladoIVA = 0;
  let primerPago = null;

  for (let periodo = 1; periodo <= plazoMeses; periodo++) {
    const interesDelPeriodo = saldoInsoluto * tasaMensualEquivalente;
    const ivaSobreInteres = interesDelPeriodo * IVA_VALOR;
    const pagoMensualTotal = amortizacionCapital + interesDelPeriodo + ivaSobreInteres;

    acumuladoPagos += pagoMensualTotal;
    acumuladoInteres += interesDelPeriodo;
    acumuladoIVA += ivaSobreInteres;

    if (periodo === 1) {
      primerPago = pagoMensualTotal;
    }

    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${periodo}</td>
      <td>${formatoMoneda(saldoInsoluto)}</td>
      <td>${formatoMoneda(amortizacionCapital)}</td>
      <td>${formatoMoneda(interesDelPeriodo)}</td>
      <td>${formatoMoneda(ivaSobreInteres)}</td>
      <td>${formatoMoneda(pagoMensualTotal)}</td>
    `;
    tablaBody.appendChild(fila);

    saldoInsoluto -= amortizacionCapital;
  }

  document.getElementById('res-primer-pago').textContent = formatoMoneda(primerPago);
  document.getElementById('res-total-interes').textContent = formatoMoneda(acumuladoInteres);
  document.getElementById('res-total-iva').textContent = formatoMoneda(acumuladoIVA);
  document.getElementById('res-total-pagar').textContent = formatoMoneda(acumuladoPagos);

  actualizarComposicion(montoInput, acumuladoInteres, acumuladoIVA, acumuladoPagos);

  document.getElementById('panel-resultado').hidden = false;
  document.getElementById('panel-resultado').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function actualizarComposicion(capital, interes, iva, total) {
  const pctCapital = (capital / total) * 100;
  const pctInteres = (interes / total) * 100;
  const pctIVA = (iva / total) * 100;

  document.getElementById('seg-capital').style.width = pctCapital + '%';
  document.getElementById('seg-interes').style.width = pctInteres + '%';
  document.getElementById('seg-iva').style.width = pctIVA + '%';
}

function formatoMoneda(valor) {
  return valor.toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

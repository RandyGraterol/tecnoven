const ping = require('ping');

async function checkCanales(canales) {
  const resultados = [];

  for (let canal of canales) {
    const res = await ping.promise.probe(canal.ip, { timeout: 3 });
    resultados.push({ canal, isAlive: res.alive });
  }

  return resultados;
}

module.exports = { checkCanales };

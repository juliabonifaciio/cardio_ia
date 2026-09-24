export function classificarPressao(sistolica, diastolica) {
  const s = Number(sistolica)
  const d = Number(diastolica)

  if (!Number.isFinite(s) || !Number.isFinite(d)) {
    return {
      nivel: 'vazio',
      rotulo: 'Sem classificação',
    }
  }

  if (s >= 180 || d >= 120) {
    return {
      nivel: 'crise',
      rotulo: 'Crise',
    }
  }

  if (s >= 140 || d >= 90) {
    return {
      nivel: 'alta',
      rotulo: 'Alta',
    }
  }

  if (s >= 130 || d >= 85) {
    return {
      nivel: 'limite',
      rotulo: 'Limite',
    }
  }

  if (s >= 120 || d >= 80) {
    return {
      nivel: 'atencao',
      rotulo: 'Atenção',
    }
  }

  return {
    nivel: 'normal',
    rotulo: 'Normal',
  }
}
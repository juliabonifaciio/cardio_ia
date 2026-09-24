import { classificarPressao } from './classificarPressao.js'

const ordem = {
  vazio: 0,
  normal: 1,
  atencao: 2,
  limite: 3,
  alta: 4,
  crise: 5,
}

export function analisarPerfil(afericoes) {
  if (!afericoes.length) {
    return {
      nivel: 'vazio',
      rotulo: 'Sem dados',
      texto:
        'Registre uma ou mais aferições para montar o perfil educacional.',
    }
  }

  const classes = afericoes.map((item) =>
    classificarPressao(item.sistolica, item.diastolica),
  )

  const pior = classes.reduce(
    (acc, item) =>
      ordem[item.nivel] > ordem[acc.nivel] ? item : acc,
    classes[0],
  )

  const criticas = classes.filter(
    (item) => item.nivel === 'crise',
  ).length

  const altas = classes.filter(
    (item) => item.nivel === 'alta',
  ).length

  if (criticas) {
    return {
      nivel: 'crise',
      rotulo: 'Atenção máxima',
      texto: `${criticas} aferição(ões) foram classificadas como crise neste recorte educacional.`,
    }
  }

  if (altas) {
    return {
      nivel: 'alta',
      rotulo: 'Pressão elevada no histórico',
      texto: `${altas} aferição(ões) foram classificadas como alta. Observe o histórico e considere avaliação profissional.`,
    }
  }

  if (pior.nivel === 'limite') {
    return {
      nivel: 'limite',
      rotulo: 'Faixa de atenção',
      texto:
        'Há registros em faixa de limite neste recorte. Acompanhe a evolução das próximas aferições.',
    }
  }

  if (pior.nivel === 'atencao') {
    return {
      nivel: 'atencao',
      rotulo: 'Atenção',
      texto:
        'Há registros acima da faixa considerada normal neste recorte educacional.',
    }
  }

  return {
    nivel: 'normal',
    rotulo: 'Sem alterações no recorte',
    texto:
      'As aferições registradas ficaram na faixa normal segundo a regra educacional deste projeto.',
  }
}
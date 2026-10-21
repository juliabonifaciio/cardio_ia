
import { lerEstado, salvarEstado } from '../utils/storage.js'
import { codificarSenha, senhaConfere } from '../utils/senha.js'

function gravar(estado) {
  salvarEstado(estado)
  return estado
}

export function carregarEstado() {
  return lerEstado()
}

export function cadastrarUsuario(dados) {
  const estado = lerEstado()
  const usuario = dados.usuario.trim().toLowerCase()

  const existe = estado.usuarios.some(
    (item) => item.usuario === usuario,
  )

  if (existe) {
    return {
      ok: false,
      erro: 'Este usuário já está cadastrado neste navegador.',
    }
  }

  const novo = {
    id: crypto.randomUUID(),
    nome: dados.nome,
    usuario,
    senha: codificarSenha(dados.senha),
    criadoEm: new Date().toISOString(),
  }

  return {
    ok: true,
    estado: gravar({
      ...estado,
      usuarios: [novo, ...estado.usuarios],
      sessaoUsuarioId: novo.id,
    }),
  }
}

export function entrar(dados) {
  const estado = lerEstado()
  const usuario = dados.usuario.trim().toLowerCase()

  const encontrado = estado.usuarios.find(
    (item) => item.usuario === usuario,
  )

  if (
    !encontrado ||
    !senhaConfere(dados.senha, encontrado.senha)
  ) {
    return {
      ok: false,
      erro: 'Usuário ou senha inválidos.',
    }
  }

  return {
    ok: true,
    estado: gravar({
      ...estado,
      sessaoUsuarioId: encontrado.id,
    }),
  }
}

export function sair() {
  const estado = lerEstado()

  return gravar({
    ...estado,
    sessaoUsuarioId: null,
  })
}

export function selecionarPaciente(id) {
  const estado = lerEstado()

  return gravar({
    ...estado,
    pacienteAtualId: id,
  })
}

export function criarPaciente(dados) {
  const estado = lerEstado()

  const novo = {
    id: crypto.randomUUID(),
    ...dados,
    criadoEm: new Date().toISOString(),
  }

  return gravar({
    ...estado,
    pacientes: [novo, ...estado.pacientes],
    pacienteAtualId: novo.id,
  })
}

export function atualizarPaciente(id, dados) {
  const estado = lerEstado()

  return gravar({
    ...estado,
    pacientes: estado.pacientes.map((item) =>
      item.id === id ? { ...item, ...dados } : item,
    ),
  })
}

export function removerPaciente(id) {
  const estado = lerEstado()

  return gravar({
    ...estado,
    pacientes: estado.pacientes.filter(
      (item) => item.id !== id,
    ),
    afericoes: estado.afericoes.filter(
      (item) => item.pacienteId !== id,
    ),
    pacienteAtualId:
      estado.pacienteAtualId === id
        ? null
        : estado.pacienteAtualId,
  })
}

export function criarAfericao(dados) {
  const estado = lerEstado()

  if (!estado.pacienteAtualId) {
    return estado
  }

  const nova = {
    id: crypto.randomUUID(),
    pacienteId: estado.pacienteAtualId,
    ...dados,
    registradoEm: new Date().toISOString(),
  }

  return gravar({
    ...estado,
    afericoes: [nova, ...estado.afericoes],
  })
}

export function removerAfericao(id) {
  const estado = lerEstado()

  return gravar({
    ...estado,
    afericoes: estado.afericoes.filter(
      (item) => item.id !== id,
    ),
  })
}
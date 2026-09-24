import { useEffect, useState } from 'react'
import {
    Navigate,
    Route,
    Routes,
    useLocation,
    useNavigate,
} from 'react-router-dom'

import Layout from './components/Layout.jsx'
import RotaProtegida from './components/RotaProtegida.jsx'

import Home from './pages/Home.jsx'
import Pacientes from './pages/Pacientes.jsx'
import Afericoes from './pages/Afericoes.jsx'
import Perfil from './pages/Perfil.jsx'
import Login from './pages/Login.jsx'
import Cadastro from './pages/Cadastro.jsx'

import { lerEstado, salvarEstado } from './utils/storage.js'
import { codificarSenha, senhaConfere } from './utils/senha.js'

import './App.css'

export default function App() {
    const [inicial] = useState(lerEstado)

    const [usuarios, setUsuarios] = useState(inicial.usuarios)
    const [sessaoUsuarioId, setSessaoUsuarioId] = useState(
        inicial.sessaoUsuarioId,
    )
    const [pacientes, setPacientes] = useState(inicial.pacientes)
    const [pacienteAtualId, setPacienteAtualId] = useState(
        inicial.pacienteAtualId,
    )
    const [afericoes, setAfericoes] = useState(inicial.afericoes)

    const navigate = useNavigate()
    const local = useLocation()

    const usuarioAtual =
        usuarios.find((i) => i.id === sessaoUsuarioId) ?? null

    const logado = Boolean(usuarioAtual)

    const pacienteAtual =
        pacientes.find((i) => i.id === pacienteAtualId) ?? null

    const afericoesDoPaciente = afericoes.filter(
        (i) => i.pacienteId === pacienteAtualId,
    )

    useEffect(() => {
        const titulos = {
            '/': 'CardioIA',
            '/pacientes': 'Pacientes | CardioIA',
            '/afericoes': 'Aferições | CardioIA',
            '/perfil': 'Perfil | CardioIA',
            '/login': 'Entrar | CardioIA',
            '/cadastro': 'Criar acesso | CardioIA',
        }

        document.title = titulos[local.pathname] ?? 'CardioIA'
    }, [local.pathname])

    useEffect(() => {
        salvarEstado({
            usuarios,
            sessaoUsuarioId,
            pacientes,
            pacienteAtualId,
            afericoes,
        })
    }, [
        usuarios,
        sessaoUsuarioId,
        pacientes,
        pacienteAtualId,
        afericoes,
    ])

    function cadastrarUsuario(dados) {
        const usuario = dados.usuario.trim().toLowerCase()

        if (usuarios.some((i) => i.usuario === usuario)) {
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

        setUsuarios((p) => [novo, ...p])
        setSessaoUsuarioId(novo.id)
        navigate('/')

        return { ok: true }
    }

    function entrar(dados) {
        const usuario = dados.usuario.trim().toLowerCase()
        const encontrado = usuarios.find((i) => i.usuario === usuario)

        if (
            !encontrado ||
            !senhaConfere(dados.senha, encontrado.senha)
        ) {
            return {
                ok: false,
                erro: 'Usuário ou senha inválidos.',
            }
        }

        setSessaoUsuarioId(encontrado.id)
        navigate('/')

        return { ok: true }
    }

    function sair() {
        setSessaoUsuarioId(null)
        navigate('/login')
    }

    function salvarPaciente(dados) {
        const novo = {
            id: crypto.randomUUID(),
            ...dados,
            criadoEm: new Date().toISOString(),
        }

        setPacientes((p) => [novo, ...p])
        setPacienteAtualId(novo.id)
    }

    function editarPaciente(id, dados) {
        setPacientes((p) =>
            p.map((i) => (i.id === id ? { ...i, ...dados } : i)),
        )
    }

    function removerPaciente(id) {
        setPacientes((p) => p.filter((i) => i.id !== id))
        setAfericoes((p) => p.filter((i) => i.pacienteId !== id))
        setPacienteAtualId((atual) => (atual === id ? null : atual))
    }

    function salvarAfericao(dados) {
        if (!pacienteAtualId) return

        const nova = {
            id: crypto.randomUUID(),
            pacienteId: pacienteAtualId,
            ...dados,
            registradoEm: new Date().toISOString(),
        }

        setAfericoes((p) => [nova, ...p])
    }

    function removerAfericao(id) {
        setAfericoes((p) => p.filter((i) => i.id !== id))
    }

    return (
        <Routes>
            <Route
                path="/login"
                element={
                    logado ? (
                        <Navigate to="/" replace />
                    ) : (
                        <Login onEntrar={entrar} />
                    )
                }
            />

            <Route
                path="/cadastro"
                element={
                    logado ? (
                        <Navigate to="/" replace />
                    ) : (
                        <Cadastro onCadastrar={cadastrarUsuario} />
                    )
                }
            />

            <Route
                element={
                    <RotaProtegida logado={logado}>
                        <Layout
                            usuario={usuarioAtual}
                            pacienteAtual={pacienteAtual}
                            onSair={sair}
                        />
                    </RotaProtegida>
                }
            >
                <Route
                    path="/"
                    element={
                        <Home
                            usuario={usuarioAtual}
                            totalPacientes={pacientes.length}
                            totalAfericoes={afericoes.length}
                            pacienteAtual={pacienteAtual}
                        />
                    }
                />

                <Route
                    path="/pacientes"
                    element={
                        <Pacientes
                            pacientes={pacientes}
                            pacienteAtualId={pacienteAtualId}
                            afericoes={afericoes}
                            onSalvar={salvarPaciente}
                            onEditar={editarPaciente}
                            onRemover={removerPaciente}
                            onSelecionar={setPacienteAtualId}
                        />
                    }
                />

                <Route
                    path="/afericoes"
                    element={
                        <Afericoes
                            paciente={pacienteAtual}
                            afericoes={afericoesDoPaciente}
                            onSalvar={salvarAfericao}
                            onRemover={removerAfericao}
                        />
                    }
                />

                <Route
                    path="/perfil"
                    element={
                        <Perfil
                            paciente={pacienteAtual}
                            afericoes={afericoesDoPaciente}
                        />
                    }
                />
            </Route>

            <Route
                path="*"
                element={
                    <Navigate
                        to={logado ? '/' : '/login'}
                        replace
                    />
                }
            />
        </Routes>
    )
}
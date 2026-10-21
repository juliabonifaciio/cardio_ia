
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

import {
    atualizarPaciente,
    cadastrarUsuario as apiCadastrarUsuario,
    carregarEstado,
    criarAfericao,
    criarPaciente,
    entrar as apiEntrar,
    removerAfericao as apiRemoverAfericao,
    removerPaciente as apiRemoverPaciente,
    sair as apiSair,
    selecionarPaciente,
} from './api/cardioiaApi.js'

import './App.css'

export default function App() {
    const [inicial] = useState(carregarEstado)

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

    function aplicar(estado) {
        setUsuarios(estado.usuarios)
        setSessaoUsuarioId(estado.sessaoUsuarioId)
        setPacientes(estado.pacientes)
        setPacienteAtualId(estado.pacienteAtualId)
        setAfericoes(estado.afericoes)
    }

    function cadastrarUsuario(dados) {
        const resultado = apiCadastrarUsuario(dados)

        if (!resultado.ok) return resultado

        aplicar(resultado.estado)
        navigate('/')

        return { ok: true }
    }

    function entrar(dados) {
        const resultado = apiEntrar(dados)

        if (!resultado.ok) return resultado

        aplicar(resultado.estado)
        navigate('/')

        return { ok: true }
    }

    function sair() {
        aplicar(apiSair())
        navigate('/login')
    }

    function salvarPaciente(dados) {
        aplicar(criarPaciente(dados))
    }

    function editarPaciente(id, dados) {
        aplicar(atualizarPaciente(id, dados))
    }

    function removerPaciente(id) {
        aplicar(apiRemoverPaciente(id))
    }

    function escolherPaciente(id) {
        aplicar(selecionarPaciente(id))
    }

    function salvarAfericao(dados) {
        aplicar(criarAfericao(dados))
    }

    function removerAfericao(id) {
        aplicar(apiRemoverAfericao(id))
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
                            onSelecionar={escolherPaciente}
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
import { Navigate } from 'react-router-dom'

export default function RotaProtegida({
    logado,
    children,
}) {
    return logado ? (
        children
    ) : (
        <Navigate to="/login" replace />
    )
}
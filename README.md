# CardioIA

## Rodar

```bash
npm install
npm run dev
```

Abra `http://localhost:5173/`.

## Funcionalidades

- Cadastro e login local do profissional
- Rotas protegidas com React Router
- Persistência em `localStorage` na chave `cardioia-dados-v2`
- Cadastro, seleção, edição e exclusão em cascata de pacientes
- Aferições isoladas por `pacienteId`
- Perfil e histórico educacionais
- UI clínica responsiva com Lucide

> A senha usa Base64 apenas para fins didáticos. Não é criptografia e não deve ser usada assim em produção.

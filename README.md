# SmartFeedback Influx

O **SmartFeedback Influx** é um aplicativo mobile de comunicação pedagógica desenvolvido em **React Native com Expo**, criado como um **protótipo acadêmico** para apoiar professores na organização e aplicação de feedbacks pedagógicos em boletins escolares. O aplicativo utiliza armazenamento local, funcionando offline, e tem como objetivo validar a solução antes de uma possível implementação definitiva pela instituição.

---

## 🛠 Tecnologias Utilizadas

- React Native  
- Expo  
- JavaScript  
- AsyncStorage (persistência de dados local)

---

## 📋 Visão Geral do Aplicativo

O SmartFeedback Influx foi projetado para atender dois perfis de usuários:

### 👩‍🏫 Professor
O professor pode criar, editar e excluir modelos de feedback reutilizáveis, aplicar feedbacks aos alunos utilizando o número de matrícula e consultar o histórico completo de avaliações de cada aluno.

### 🎓 Aluno
O aluno acessa o aplicativo utilizando seu número de matrícula e pode visualizar todos os feedbacks recebidos, organizados do mais recente para o mais antigo.

---

## ▶️ Como rodar o projeto no computador

### 1️⃣ Instalar o Node.js
Acesse https://nodejs.org e baixe a versão **LTS**.  
Após a instalação, reinicie o computador.

Verifique se deu certo executando no terminal:

```bash
node -v
npm -v
```

## ▶️ Como rodar o projeto no computador

### 2️⃣ Clonar o repositório
git clone https://github.com/SEU-USUARIO/smarfeedback-influx.git


Entre na pasta do projeto:
```bash
cd smarfeedback-influx
```

### 3️⃣ Instalar as dependências
```bash
npm install
```

### 4️⃣ Executar o projeto com Expo
```bash
npx expo start
```
Uma página será aberta no navegador com um QR Code.

### 5️⃣ Visualizar o aplicativo

Instale o aplicativo Expo Go (Android ou iOS).

Abra o Expo Go e escaneie o QR Code.

### ℹ️ Observações Importantes

O aplicativo utiliza armazenamento local, portanto os dados ficam salvos apenas no dispositivo onde está sendo executado.

Não há integração com servidor ou banco de dados externo.

Este projeto é um protótipo acadêmico, desenvolvido para fins educacionais e de validação junto à comunidade escolar.

# Desafio ACC Front

Aplicação web para gestão de empresas e fornecedores.

## O que o sistema faz

O sistema permite:

- Cadastrar, listar, editar e remover empresas.
- Cadastrar, listar, editar e remover fornecedores.
- Validar CEP no cadastro de fornecedor por integração com ViaCEP.
- Aplicar regras de negócio para pessoa física no cadastro de fornecedor.
- Vincular fornecedores a uma empresa.
- Consultar fornecedores por empresa em tela dedicada.
- Buscar fornecedores por documento (CPF/CNPJ) ou por nome.

## Tecnologias

![Angular](https://img.shields.io/badge/Angular-19-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![RxJS](https://img.shields.io/badge/RxJS-7-B7178C?logo=reactivex&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CSS-CC6699?logo=sass&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-runtime-339933?logo=nodedotjs&logoColor=white)

## Estrutura funcional

- Módulo Empresa
  - Cadastro de empresa
  - Listagem de empresas
  - Adicionar fornecedores à empresa
  - Fornecedores por empresa

- Módulo Fornecedor
  - Cadastro de fornecedor com máscaras e validações
  - Listagem com paginação, busca e ações de editar/remover

## Como executar o projeto

Pré-requisitos:

- Node.js instalado
- NPM instalado

Passos:

1. Instalar dependências

	npm install

2. Executar a aplicação em desenvolvimento

	npm start

3. Acessar no navegador

	http://localhost:4200

## Scripts disponíveis

- npm start: inicia o servidor de desenvolvimento
- npm run build: gera build de produção
- npm test: executa os testes

## Observações

- A aplicação depende de uma API backend para persistência.
- A validação de CEP utiliza o serviço público ViaCEP.

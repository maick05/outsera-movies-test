<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="100" alt="NestJS Logo" />
</p>

<h2 align="center">API Golden Raspberry Awards</h2>

<p align="center">
  Projeto em NestJS que lê um arquivo CSV contendo a lista de indicados e vencedores do prêmio <strong>Pior Filme</strong> (Golden Raspberry Awards), armazena os dados em memória e expõe uma API RESTful para análise dos intervalos máximos e mínimos de vitórias do prêmio.
</p>

---

## 🚀 Tecnologias Utilizadas

- Node.js
- NestJS
- TypeScript
- SQLite (em memória)
- TypeORM
- csv-parser
- Supertest

---

## 📂 Estrutura e Fonte de Dados

O arquivo CSV utilizado fica em:

data/movielist.csv


> ⚠️ Esse é o único arquivo utilizado nos testes de integração. Ele é carregado automaticamente ao iniciar a aplicação.
Se desejar alterá-lo, mantenha o formato original, com separador ; e a mesma estrutura de colunas.

---

## 🛠️ Instalação

```bash
npm install
```
## ▶️ Executando o Projeto
```bash
# Desenvolvimento
npm run start:dev

# Start sem reload
npm run start

```
A API estará disponível em:
```bash
GET http://localhost:3000/producers/intervals
```
## 🧪 Executando os Testes de Integração
```bash
npm run test:e2e
```
Esse comando irá:

- Subir a aplicação com banco em memória

- Carregar o arquivo data/movielist.csv

- Realizar chamadas reais à API

- Verificar se o endpoint /producers/intervals retorna os dados corretos, com base nos produtores vencedores

## ⚠️ Pontos de Atenção
- Apenas filmes com winner = yes são considerados.

- A aplicação trata múltiplos produtores por filme (separados por "," ou "and").

- O banco de dados é em memória, portanto os dados são recarregados a cada execução.

- Os testes de integração não devem ser executados com arquivos CSV diferentes, pois, a verificação é feita contra valores fixos.

- O CSV deve manter o mesmo padrão do arquivo inicial fornecido com a distribuição de colunas iguais e separado por ";".

- Os intervalos considerados serão somente dos produtores que tiveram ao menos duas vitórias, não sendo considerados produtores que obtiveram nenhuma ou somente uma vitória.

- Após mudar o arquivo CSV, deve-se realizar novamente o start da aplicação para realizar o load de dados novos.
## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).


# Expense Tracker App

Este é um aplicativo de rastreamento de despesas desenvolvido em React Native. Ele permite que o usuário registre, visualize e acompanhe as despesas em um gráfico, utilizando armazenamento local para manter o histórico dos lançamentos.

## Funcionalidades

- **Cadastro de Despesas**: Registra o valor, a descrição e a data de cada despesa.
- **Visualização de Histórico**: Exibe uma lista de despesas com data, descrição e valor.
- **Gráfico de Resumo**: Gera um gráfico das despesas diárias acumuladas para uma visualização mais fácil dos gastos.
- **Armazenamento Local**: Utiliza AsyncStorage para salvar e carregar os dados das despesas, persistindo-os localmente.

## Tecnologias e Dependências

- **React Native**: Framework para desenvolvimento mobile multiplataforma.
- **react-native-chart-kit**: Biblioteca de gráficos para exibir os dados das despesas.
- **moment**: Biblioteca para manipulação e formatação de datas.
- **@react-navigation**: Navegação entre telas.
- **@react-native-async-storage/async-storage**: Armazenamento de dados no dispositivo.

## Estrutura dos Componentes

- **AppNavigator**: Configura a navegação entre as telas de despesas e resumo.
- **ExpenseScreen**: Tela principal para adicionar novas despesas e visualizar a lista.
- **SummaryScreen**: Tela de resumo que exibe o gráfico com o total acumulado de despesas por dia.

## Como Executar o Projeto

1. **Clone o Repositório**:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd <NOME_DO_DIRETORIO>

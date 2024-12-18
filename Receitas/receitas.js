// Classe para o Banco de Dados com Identificação pelo Nome
class BancoDeDados {
    constructor(nome) {
        this.nome = nome; // Identificador do banco
        this.dados = JSON.parse(localStorage.getItem(this.nome)) || { receitas: [], despesas: [] };
    }

    // Salva os dados no localStorage usando o nome como chave
    salvarDados() {
        localStorage.setItem(this.nome, JSON.stringify(this.dados));
    }

    // Adiciona uma receita
    adicionarReceita(nomeReceita, valor) {
        this.dados.receitas.push({ nome: nomeReceita, valor });
        this.salvarDados();
    }

    // Adiciona uma despesa
    adicionarDespesa(nomeDespesa, valor) {
        this.dados.despesas.push({ nome: nomeDespesa, valor });
        this.salvarDados();
    }

    // Reseta os dados (apaga receitas e despesas)
    resetarDados() {
        this.dados = { receitas: [], despesas: [] };
        this.salvarDados();
    }

    // Calcula o total de receitas
    calcularTotalReceitas() {
        return this.dados.receitas.reduce((total, receita) => total + receita.valor, 0);
    }

    // Calcula o total de despesas
    calcularTotalDespesas() {
        return this.dados.despesas.reduce((total, despesa) => total + despesa.valor, 0);
    }

    // Calcula o saldo
    calcularSaldo() {
        return this.calcularTotalReceitas() - this.calcularTotalDespesas();
    }
}

// Variável global do banco de dados ou orçamento
let banco, orçamento;

function inicializarBanco() {
    const nomeBanco = document.getElementById("nomeBanco").value.trim();
    if (!nomeBanco) {
        alert("Por favor, insira um nome para o banco de dados.");
        return;
    }

    banco = new BancoDeDados(nomeBanco);
    banco.salvarDados();  // Salva o nome no localStorage

    // Abre uma nova aba com a nova página
    window.open("pagina_detalhes.html", "_blank");
}


// Função para inicializar o orçamento global
function inicializarOrcamento() {
    orçamento = { receitas: [], despesas: [] };
    atualizarInterface();
}

// Função para atualizar a interface com os dados do banco ou orçamento
function atualizarInterface() {
    if (banco) {
        const saldo = banco.calcularSaldo();
        document.getElementById("saldo").textContent = `R$ ${saldo.toFixed(2)}`;
        document.getElementById("totalReceitas").textContent = `R$ ${banco.calcularTotalReceitas().toFixed(2)}`;
        document.getElementById("totalDespesas").textContent = `R$ ${banco.calcularTotalDespesas().toFixed(2)}`;
    } else if (orçamento) {
        const saldo = calcularSaldo();
        document.getElementById("saldo").textContent = `R$ ${saldo.toFixed(2)}`;
        document.getElementById("totalReceitas").textContent = `R$ ${calcularTotalReceitas().toFixed(2)}`;
        document.getElementById("totalDespesas").textContent = `R$ ${calcularTotalDespesas().toFixed(2)}`;
    }
}

// Função para adicionar uma transação
function adicionarTransacao() {
    if (!banco && !orçamento) {
        alert("Inicialize o banco de dados ou o orçamento antes de adicionar transações.");
        return;
    }

    const nome = document.getElementById("nome").value;
    const valor = parseFloat(document.getElementById("valor").value);
    const tipo = document.getElementById("tipo").value;

    if (!nome || isNaN(valor)) {
        alert("Cuidado para não preencher os valores incorretamente.");
        return;
    }

    // Adiciona no banco de dados ou orçamento
    if (tipo === "receita") {
        if (banco) {
            banco.adicionarReceita(nome, valor);
        } else {
            adicionarReceita(nome, valor);
        }
    } else if (tipo === "despesa") {
        if (banco) {
            banco.adicionarDespesa(nome, valor);
        } else {
            adicionarDespesa(nome, valor);
        }
    } else {
        alert("Tipo de transação inválido.");
        return;
    }

    atualizarInterface();
    limparCampos();
}

// Função para adicionar uma receita ao orçamento global
function adicionarReceita(nome, valor) {
    if (!orçamento) {
        inicializarOrcamento();
    }
    orçamento.adicionarReceita(nome, valor);
    atualizarInterface();
}

// Função para adicionar uma despesa ao orçamento global
function adicionarDespesa(nome, valor) {
    if (!orçamento) {
        inicializarOrcamento();
    }
    orçamento.adicionarDespesa(nome, valor);
    atualizarInterface();
}

// Função para calcular o saldo do orçamento global
function calcularSaldo() {
    if (orçamento) {
        return orçamento.calcularTotalSaldo();
    }
    return 0;
}

// Função para listar todas as transações do orçamento
function listarTransacoes() {
    if (banco) {
        banco.listarTransacoes();
    } else if (orçamento) {
        console.log("Receitas:");
        orçamento.receitas.forEach(receita => {
            console.log(`Nome: ${receita.nome}, Valor: R$ ${receita.valor.toFixed(2)}`);
        });

        console.log("Despesas:");
        orçamento.despesas.forEach(despesa => {
            console.log(`Nome: ${despesa.nome}, Valor: R$ ${despesa.valor.toFixed(2)}`);
        });
    }
}

// Função para resetar valores
function resetarValores() {
    if (banco) {
        banco.resetarDados();
    } else if (orçamento) {
        orçamento.receitas = [];
        orçamento.despesas = [];
    }

    atualizarInterface();
    limparCampos();
}

// Função para limpar os campos do formulário
function limparCampos() {
    document.getElementById("nome").value = "";
    document.getElementById("valor").value = "";
}

// Carregar interface ao iniciar a página
window.onload = function () {
    const nomeBanco = localStorage.getItem("nomeBanco");
    if (nomeBanco) {
        banco = new BancoDeDados(nomeBanco);
    } else {
        inicializarOrcamento();
    }
    atualizarInterface();
};

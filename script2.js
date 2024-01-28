class Vez {
    static valorInicial = 1;

    constructor(element) {
        this.element = element;
        this.trueOrFalse = false;
        this.soma = 0;
        let self = this;

        // Adiciona um ouvinte de evento de clique para o elemento
        this.element.addEventListener("mousedown", function () {
            self.marcar();
        });
    }

    marcar() {
        // Lógica para marcar o elemento com "X" ou "O"
        if (this.trueOrFalse === false && Vez.valorInicial === 1) {
            this.trueOrFalse = true;
            this.element.classList.add("xiz");
            Vez.valorInicial = 2;
            this.soma = 1;

            // Lógica para verificar se algum jogador venceu ou se deu velha
            for (const bkName in instanciaPorBloco) {
                if (instanciaPorBloco.hasOwnProperty(bkName) && bkName.startsWith("bk")) {
                    let bk = instanciaPorBloco[bkName];
                    let velha = bk.velhinha;
                    if (bk.velhinha === 0) {
                        setTimeout(() => {
                            somar(3, bkName);
                        }, 100);
                    }
                    setTimeout(() => {
                        if (bk.velhinha === 0) {
                            deuVelha(bkName, velha);
                        }
                    }, 200);
                }
            }
        } else if (this.trueOrFalse === false && Vez.valorInicial === 2) {
            this.trueOrFalse = true;
            this.element.classList.add("bolinha");
            Vez.valorInicial = 1;
            this.soma = -1;

            // Lógica para verificar se algum jogador venceu ou se deu velha
            for (const bkName in instanciaPorBloco) {
                if (instanciaPorBloco.hasOwnProperty(bkName) && bkName.startsWith("bk")) {
                    let bk = instanciaPorBloco[bkName];
                    let velha = bk.velhinha;
                    if (bk.velhinha === 0) {
                        setTimeout(() => {
                            somar(-3, bkName);
                        }, 100);
                    }
                    setTimeout(() => {
                        if (bk.velhinha === 0) {
                            deuVelha(bkName, velha);
                        }
                    }, 200);
                }
            }
        }
    }
}

function arrayNoObjeto(blocosEntrada) {
    // Objeto para armazenar arrays de instâncias por ID do bloco
    let arraysObject = {};

    // Itera sobre cada bloco na variável blocosEntrada
    blocosEntrada.forEach(function (bloco) {
        // Obtém o ID do bloco
        let blockID = bloco.id;
        
        // Cria um objeto chamado velhinha, com a propriedade velhinha = 0, para cada um dos blocos
        let velhinha = 0;

        // Cria um array vazio no objeto arraysObject associado ao ID do bloco atual
        arraysObject[blockID] = [];

        // Adiciona o objeto "velhinha" no objeto em atual
        arraysObject[blockID].velhinha = velhinha;

        // Seleciona todos os quadradinhos ".local"
        let quadradinhos = bloco.querySelectorAll(".local");

        // Itera sobre cada quadradinho, criando instâncias da classe Vez e os adiciona ao array associado ao ID do bloco.
        quadradinhos.forEach(function (quadradinho) {
            arraysObject[blockID].push(new Vez(quadradinho));
        });
    });

    // Retorna o objeto que contém arrays de instâncias de Peoes associadas a cada ID de bloco
    return arraysObject;
}

let todosOsBlocos = document.querySelectorAll(".block");
let instanciaPorBloco = arrayNoObjeto(todosOsBlocos);

// Itera sobre instanciaPorBloco para adicionar a cada bloco uma propriedade chamada indice, com valor de 2 a 10
function adicionarIndice(element) {
    let i = 0;
    for (const ind in element) {
        element[ind].indice = i++;
    }

    for (const ind in element) {
        i = 0;
        lista = element[ind];
        lista.forEach(function (quadradinho) {
            quadradinho.indice = i++;
        });
    }
}

adicionarIndice(instanciaPorBloco); // Adiciona um indice para cada bloco e para cada quadradinho

// Adiciona um indice para cada quadradinho

function somar(x, nomeBk) {
    const bk = instanciaPorBloco[nomeBk]; // Armazena a lista de objetos do "bk(?)" atual, dentro da constante "bk".

    if (
        (bk[0].soma + bk[1].soma + bk[2].soma) === x ||
        (bk[3].soma + bk[4].soma + bk[5].soma) === x ||
        (bk[6].soma + bk[7].soma + bk[8].soma) === x ||
        (bk[0].soma + bk[3].soma + bk[6].soma) === x ||
        (bk[1].soma + bk[4].soma + bk[7].soma) === x ||
        (bk[2].soma + bk[5].soma + bk[8].soma) === x ||
        (bk[0].soma + bk[4].soma + bk[8].soma) === x ||
        (bk[2].soma + bk[4].soma + bk[6].soma) === x
    ) {
        let fundoCinza = document.createElement("div"); // Cria um elemento "Div", para adicionar uma classe para tampar os elementos de fundo
        fundoCinza.classList.add("blur"); // Adiciona a classe "blur" que vai tampar os elementos de fundo, com um background cinza.

        let point = document.querySelector("#" + nomeBk); // Seleciona o bloco atual

        if (x > 0) {
            bk.velhinha = 1;
            alert("X marcou um ponto!"); // Alerta que um jogador fez um ponto
            let div = document.createElement("div"); // Cria um elemento "Div", para adicionar uma classe que possua o "X.png"
            div.classList.add("x-point"); // Adiciona a classe "x-point" que vai ter o "X.png"
            point.appendChild(fundoCinza); // Adiciona o fundo cinza ao bloco atual
            point.appendChild(div); // Adiciona a "Div"(Símbolo de "X") ao bloco atual. 
        } else {
            bk.velhinha = -1;
            alert("Bolinha marcou um ponto!");
            let div = document.createElement("div"); // Cria um elemento "Div", para adicionar uma classe que possua o "bolinha.png"
            div.classList.add("bolinha-point");
            point.appendChild(fundoCinza);
            point.appendChild(div);
        }
    }
}

function deuVelha(nomeBk, velha) {
    let bk = instanciaPorBloco[nomeBk]; // Armazena a lista de objetos do "bk(?)" atual, dentro da constante "bk".

    let bList = bk.slice(1, 9); // Pega os itens de "bk(?)" atual do índice 1 a 9, ignorando o "velhinha"
    let todosZero = bList.every(function (elemento) { // Every verifica se todos os itens do array aceitam a condição da função callback.
        return elemento.soma !== 0; // Essa é a condição. Se todos os quadradinhos possuem soma diferente de 0. Se sim, retorna "True".
    });

    let fundoCinza = document.createElement("div"); // Cria um elemento "Div", para adicionar uma classe para tampar os elementos de fundo
    fundoCinza.classList.add("blur"); // Adiciona a classe "blur" que vai tampar os elementos de fundo, com um background cinza.

    let point = document.querySelector("#" + nomeBk); // Seleciona o bloco atual

    if (todosZero && velha === 0) {
        alert("Deu velha aqui!");
        bk.velhinha = "null";

        let div = document.createElement("div");
        div.classList.add("velha-point");

        point.appendChild(fundoCinza);
        point.appendChild(div);
    }
}

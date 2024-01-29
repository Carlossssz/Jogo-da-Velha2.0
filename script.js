function playSound(audioName){
    let som = new Audio(audioName);
    som.play();
}

var total = 0; //Variável que enquanto for igual a Zero, o jogo ainda está acontecendo, caso contrário, acabou!
class Vez{
    static valorInicial = 1;
    constructor(element){
        this.element = element;
        this.trueOrFalse = false;
        this.soma = 0;
        let self = this;

        this.element.addEventListener("mousedown", function(){
            self.marcar();

            
            backgroundColorEHover(instanciaPorBloco);
            
            setTimeout(() =>{
                velhaTotal(instanciaPorBloco);
            }, 100)
        })
    }

    marcar(){
        /*Tenho que adicionar algo que ao clicar no quadradinho expecífico, o bloco com o valor igual ficará verde
         e tenho que validar isso com um If, para que não seja clicável outros blocos.
        Tbm tenho que tirar a cor verde assim que clicar em um quadradinho que seja de valor diferente.
        Caso clique no quadradinho e marque um velhinha, terei que definir uma passagem livre para clicar em qualquer bloco que queira.*/
        
        if(this.trueOrFalse === false && Vez.valorInicial === 1){
            this.trueOrFalse = true;
            this.element.classList.add("xiz"); 
            this.element.style.color = "transparent"; //Define o texto de cada elemento para transparente.
            Vez.valorInicial = 2
            this.soma = 1;
            playSound("audios/xSong.mp3"); //Executa o audio

            //Esse for é apenas para verificar se algum dos blocos marcarou ponto ou se deu velha
            for (const bkName in instanciaPorBloco) {
                if (bkName.startsWith("bk")) {
                    let blocoAtual = instanciaPorBloco[bkName];
                    let velha = blocoAtual.velhinha

                    if (blocoAtual.velhinha === 0) {
                            somar(3, bkName);
                    }

                    if (blocoAtual.velhinha === 0){
                        deuVelha(bkName, velha);
                    }

                }
            }

            blocoJogada(this, instanciaPorBloco);

        }else if(this.trueOrFalse === false && Vez.valorInicial === 2){
            this.trueOrFalse = true;
            this.element.classList.add("bolinha");
            this.element.style.color = "transparent";
            Vez.valorInicial = 1;
            this.soma = -1;
            playSound("audios/boing.mp3"); //Executa o audio

            //Esse for é apenas para verificar se algum dos blocos marcarou ponto ou se deu velha
            for (const bkName in instanciaPorBloco) { //bkName === nome de cada elemento dentro de instanciaPorBloco. ex: "bk1"
                if (bkName.startsWith("bk")) {
                    let blocoAtual = instanciaPorBloco[bkName]; //BlocoAtual recebe o array do bloco atual
                    let velha = blocoAtual.velhinha

                    if (blocoAtual.velhinha === 0) {
                            somar(-3, bkName);
                    }

                    if (blocoAtual.velhinha === 0){
                        deuVelha(bkName, velha);
                    }
                    
                }
            }
            blocoJogada(this, instanciaPorBloco);
        }
    }
}


function arrayNoObjeto(blocosEntrada){
    // Objeto para armazenar arrays de instâncias por ID do bloco
    let arraysObject = {}

    // Iterar sobre cada bloco na variável blocosEntrada
    blocosEntrada.forEach(function(bloco){
        //obtem o ID do bloco
        let blockID = bloco.id;
        
        // cria um objeto chamado velhinha, com a propriedade velhinha = 0, para cada um dos blocos
        let velhinha = 0;
  

        //cria um array vazio no objeto arraysObject associado ao ID do bloco atual
        arraysObject[blockID] = [];

        //adiciona o abjeto "velhinha" no objeto em atual
        arraysObject[blockID].velhinha = velhinha; //Basicamente ".velhinha" é para criar uma propriedade "velhinha" para o array que também se comporta como objeto

        //Seleciona todos os quadradinhos ".local"
        let quadradinhos = bloco.querySelectorAll(".local");

        //Itera sobre cada quadradinho, criando instâncias da classe Vez e os adiciona ao array associado ao ID do block.
        quadradinhos.forEach(function(quadradinho){
            arraysObject[blockID].push(new Vez(quadradinho))
            
        })
    })

    //Retornar o objeto que contém arrays de instâncias de Peoes associadas a cada ID de bloco;
    return arraysObject;
}

let todosOsBlocos = document.querySelectorAll(".block");
let instanciaPorBloco = arrayNoObjeto(todosOsBlocos);

//Vou ter que iterar sobre o instanciaPorBloco para adicionar a cada bloco uma propriedade chamada indice, com valor de 2 a 10;
function adicionarIndice(objeto){
    //adiciona indice para cada bloco
    let i = 1;
    for (const ind in objeto){       //ind  representa cada elemento de "element", (for...in) para objetos, forEach() para arrays;
        objeto[ind].indice = i++;    //Adiciona um indice para cada bloco dentro de instanciaPorBloco;
    }

    //adiciona indice para cada quadradinho
    for (const ind in objeto){ //ind o nome de cada propriedade do objeto;
        i = 1;
        let lista = objeto[ind];  //lista recebe o array de cada ind de element. recebe a lista de quadradinhos que está em cada "bk(?)";
        lista.forEach(function(quadradinho){
            quadradinho.indice = i++;       //Itera sobre cada elemento dentro dos arrays "bk1", "bk2"... que está sendo representado por "lista";
        })
    }
}
adicionarIndice(instanciaPorBloco); //Adiciona um indice para cada bloco e para cada quadradinho



//Adiciona um indice para cada quadradinho;

/*vou ter que iterar sobre cada bloco, adicionar a ele a regra para ver quem
ganhou o bloco. para isso vou ter que adicionar um cálculo de valores para cada 
quadradinho do bloco em questão e quando sair o vencedor, o bloco recebe um valor
que também será calculado no final do jogo, para ver quem venceu a partida. vou iterar os blocos
pelo instanciaPorBlocos e adicionar o soma em cada um dos blocos "bk".

Também vou ter que adicionar a regra de que, quando clicado em um canto, o jogador
terá que mudar de tabuleiro. Para isso vou ter que atibuir um valor para cada
quadradinho que, quando clicado, passará esse valor para um validador que determinará
qual o bloco que possui o valor igual, com condição que esse bloco já não tenha
terminado, o que resetará o valor do validador.
*/

function somar(x, nomeBk){
    const bk = instanciaPorBloco[nomeBk]; //Armazena a lista de objetos do "bk(?)" atual, dentro da constante "bk".
    
    if (
        (bk[0].soma + bk[1].soma + bk[2].soma) === x ||
        (bk[3].soma + bk[4].soma + bk[5].soma) === x ||
        (bk[6].soma + bk[7].soma + bk[8].soma) === x ||
        (bk[0].soma + bk[3].soma + bk[6].soma) === x ||
        (bk[1].soma + bk[4].soma + bk[7].soma) === x ||
        (bk[2].soma + bk[5].soma + bk[8].soma) === x ||
        (bk[0].soma + bk[4].soma + bk[8].soma) === x ||
        (bk[2].soma + bk[4].soma + bk[6].soma) === x) {

            let fundoCinza = document.createElement("div"); //Cria um elemento "Div", para adicionar uma classe para tampar os elementos de fundo;
            fundoCinza.classList.add("blur"); //Adiciona a classe "blur" que vai tampar os elementos de fundo, com um background cinza.

            let point = document.querySelector("#" + nomeBk); //Seleciona o bloco atual

            if(x > 0){
                bk.velhinha = 1;
                let div = document.createElement("div"); //Cria um elemento "Div", para adicionar uma classe que possua o "X.png"
                
                div.classList.add("x-point") //adiciona a classe "x-point" que vai ter o "X.png"
                point.appendChild(fundoCinza); //Adiciona o fundo cinza ao bloco atual
                point.appendChild(div); //Adiciona a "Div"(Simbolo de "X") ao bloco atual. 
               
                somaTotal(3, instanciaPorBloco);
                
            }else{
                bk.velhinha = -1;
                let div = document.createElement("div"); //Cria um elemento "Div", para adicionar uma classe que possua o "bolinha.png"
                div.classList.add("bolinha-point");
                point.appendChild(fundoCinza);
                point.appendChild(div);

                somaTotal(-3, instanciaPorBloco);
            }

            playSound("audios/win.mp3");
    }
}

//Soma o resultado do Jogo Total, End Game!
function somaTotal(x, objeto){
    let ob = objeto;
    if(
        (ob["bk1"].velhinha + ob["bk2"].velhinha + ob["bk3"].velhinha === x) ||
        (ob["bk4"].velhinha + ob["bk5"].velhinha + ob["bk6"].velhinha === x) ||
        (ob["bk7"].velhinha + ob["bk8"].velhinha + ob["bk9"].velhinha === x) ||
        (ob["bk1"].velhinha + ob["bk4"].velhinha + ob["bk7"].velhinha === x) ||
        (ob["bk2"].velhinha + ob["bk5"].velhinha + ob["bk8"].velhinha === x) ||
        (ob["bk3"].velhinha + ob["bk6"].velhinha + ob["bk9"].velhinha === x) ||
        (ob["bk1"].velhinha + ob["bk5"].velhinha + ob["bk9"].velhinha === x) ||
        (ob["bk3"].velhinha + ob["bk5"].velhinha + ob["bk7"].velhinha === x)) {
            if(x > 0){
                placar("X");
            }else{
                placar("O");
            }
        total = 1;
        playSound("audios/aplausos.mp3");
        
        placarAparece();
    }
}

//Quando der Velha para cada bloco.
function deuVelha(nomeBk, velha){
    let bk = instanciaPorBloco[nomeBk]; //Armazena a lista de objetos do "bk(?)" atual, dentro da constante "bk".

    //let bList = bk.slice(1, 9) //Pega os itens de "bk(?)" atual do índice 1 a 9, ignorando o "velhinha"
    let todosZero = bk.every(function(elemento){ //Every verifica se todos os itens do array aceitam a condição da função callback.
        return elemento.soma !== 0; //Esse é a condição. Se todos os quadradinhos possuem soma diferente de 0. Se sim, retorna "True".
    })

    let fundoCinza = document.createElement("div"); //Cria um elemento "Div", para adicionar uma classe para tampar os elementos de fundo;
    fundoCinza.classList.add("blur"); //Adiciona a classe "blur" que vai tampar os elementos de fundo, com um background cinza.

    let point = document.querySelector("#" + nomeBk); //Seleciona o bloco atual

    if(todosZero && velha === 0){
        playSound("audios/failMenor.mp3");
        bk.velhinha = "velha";

        let div = document.createElement("div");
        div.classList.add("velha-point");

        point.appendChild(fundoCinza);
        point.appendChild(div);
    }
}

//Velha Total
function velhaTotal(objeto){
    if(todos(objeto) && total === 0){
        playSound("audios/fail.mp3")
        placarAparece()
    }
}

//Verifica se todos os valores são diferentes de 0.
function todos(objeto){
    var simOuNao = [];
    for(const bloco in objeto){
        let blocoAtual = objeto[bloco];
        simOuNao.push(blocoAtual.velhinha !== 0);
    }
    return simOuNao.every(function(element){
        return element;
    });
}

//Função para definir qual bloco será jogável com base em qual quadradinho foi clicado;
function blocoJogada(quadradinho, objeto){
    let quadradoIndice = quadradinho.indice;

    //iterar sobre cada quadradinho e transformar todos os trueOrFalse em true;
    for(const ind in objeto){
        let blocoAtual = objeto[ind];
        blocoAtual.forEach(function(element){
            element.trueOrFalse = true
        })
    }

    //itera sobre cada quadradinho e muda a cor deles para cinza escuro;
    for(const ind in objeto){
        let blocoAtual = objeto[ind];
        blocoAtual.forEach(function(element){
            element.element.style.backgroundColor = "rgb(68, 68, 68)"
        })

        //retorna qual será o próximo bloco, com base no quadradinho que foi clicado
        let ProximoBloco = function(){
            if(blocoAtual.indice === quadradoIndice){
                return blocoAtual
            }
        }
        let resultadoProximoBloco = ProximoBloco();

        if(blocoAtual.indice === quadradoIndice && resultadoProximoBloco.velhinha === 0){ /*Encontra o bloco que possui o indice igual ao do quadradinho. Se ele tiver "velhinha" === 0, o que significa que ainda não deu velha nela, será marcado apenas aquele bloco;
        Do contrário, liberará para todos os blocos serem clicados */
        
        //iterar sobre o bloco que possui o indice aceitável, e definir os quadradinhos como false, exceto os quadrados preenchidos, os preenchidos é só verificar se "soma === 0"
            blocoAtual.forEach(function(element){ //Itera sobre cada quadradinho;
                if(element.soma === 0){ //verifica se o quadradinho tem o valor de igual a zero. Ou seja, verifica se ele ainda não foi clicado antes.
                    element.trueOrFalse = false;
                }
            })
        }else if(blocoAtual.indice === quadradoIndice && resultadoProximoBloco.velhinha !== 0){ 
            pontoNoCanto(instanciaPorBloco);
        }
    }
}

//Muda o estilo dos quadradinhos com trueOrFalse === false;
//Essa função deve ser executada a cada clique.

//cor atual do quadradinho, o cinza escuro ou cinza claro.
let corOriginal = "";
function backgroundColorEHover(objeto){
    for(const bk in objeto){
        let blocoAtual = objeto[bk];

        blocoAtual.forEach(function(element){
            let elemento = element.element;
            
            if(element.trueOrFalse === false){ //verifica se trueOrFalse === false;
                elemento.style.backgroundColor = "rgb(120, 120, 120)"

                elemento.addEventListener("mouseenter", function () {
                    if (element.trueOrFalse === false) {
                        corOriginal = elemento.style.backgroundColor;

                        setTimeout(() =>{
                            elemento.style.backgroundColor = (Vez.valorInicial === 1) ? "plum" : "green";
                        }, 0);
                        
                    }
                });
                

                //Adiciona um mouse out para deixar o quadradinho cinza novamente quando tirar o mouse de cima;
                elemento.addEventListener("mouseleave", function(){
                    if(element.trueOrFalse === false){
                        elemento.style.backgroundColor = corOriginal || "rgb(120, 120, 120)"
                    }
                })
            }
        })
    }
}

//Para quando alguém marcar ponto em um quadradinho que possua o mesmo indice do bloco. Para possibilitar o próximo clique em qualquer outro quadrado.
//Essa função deve ser chamada dentro da função que indica uma pontuação. Ou não! kkk
function pontoNoCanto(objeto){
    for(const bloco in objeto){
        let blocoAtual = objeto[bloco];
        blocoAtual.forEach(function(quadrado){
            if(quadrado.soma === 0){
                quadrado.trueOrFalse = false;
            }
        })
    }
}

function reset(){
    total = 0;
    Vez.valorInicial = 1;
    let menosBlur = [...document.querySelectorAll(".blur")];
    let menosXPoint = [...document.querySelectorAll(".x-point")];
    let menosBolinha = [...document.querySelectorAll(".bolinha-point")];

    let todasDivs = [...menosBlur, ...menosXPoint, ...menosBolinha]
    

    todasDivs.forEach(function(div){
        div.parentNode.removeChild(div);
    })

    let quadradinho = document.querySelectorAll(".local");
    quadradinho.forEach(function(element){
        element.style.backgroundImage = "";
        element.style.color = "white";
    })

    for(const bloco in instanciaPorBloco){
        let blocoAtual = instanciaPorBloco[bloco];
        blocoAtual.velhinha = 0;

        blocoAtual.forEach(function(quadrado){
            quadrado.trueOrFalse = false;
            quadrado.soma = 0;

            //seleciona o quadradinho no DOM
            let quadradoDOM = quadrado.element
            //verifica se o quadradinho tem pelo menos 2 classes:
            if(quadradoDOM.classList.length >=2){
                //remove a segunda classe (indice 1, porque o indice começa em 0):
                quadradoDOM.classList.remove(quadradoDOM.classList.item(1));
            }

            quadradoDOM.style.backgroundColor = ""; //define os quadradinhos para cor padão do css

            quadradoDOM.addEventListener("mouseleave", function(){ //define o mouseLeave para a cor padrão// provavelmente no futuro vc não vai entender oq isso significa kkk, mas o mouseLeave da função backgroundColorEHover interfere depois de resetar o jogo, pq ele continua funcionando e deixando tudo cinza claro. Essaa parte do código faz com que o mouseLeave perca o cinza claro, tornando nenhum quadradinho devidamente cinza claro
                if(quadrado.trueOrFalse === false){
                    quadradoDOM.style.backgroundColor = "";
                }
            })
        })
    }
    
    //Placar Some
    let fimFundo = document.querySelector("#fimFundo");
    let fimDeJogo = document.querySelector("#fimDeJogo");
    fimFundo.style.display = "none";
    fimDeJogo.style.display = "none";
}

let jogadorX = 0;
let jogadorO = 0;
function placar(quemFoi){
    let xPonto = document.querySelector("#xPonto");
    let oPonto = document.querySelector("#oPonto");
    let hText = document.querySelector("#vencedor h1");

    if(quemFoi === "X"){
        jogadorX = jogadorX + 1;
        xPonto.textContent = jogadorX;
        hText.innerHTML = "JOGADOR X</br>GANHOU!"
    }else if(quemFoi === "O"){
        jogadorO = jogadorO + 1;
        oPonto.textContent = jogadorO;
        hText.innerHTML = "BOLINHA </br> GANHOU!"
    }
}

function placarAparece(){
    let fimFundo = document.querySelector("#fimFundo");
    fimFundo.style.display = "flex"; 

    let fimDeJogo = document.querySelector("#fimDeJogo");
    fimDeJogo.style.display = "flex"
}
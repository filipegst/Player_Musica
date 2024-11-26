
const nomeMusica = document.getElementById('nomedamusica')
const nomeBanda = document.getElementById ('nomedabanda')
const capa = document.getElementById ('capa')
const som = document.getElementById('audio')
const play = document.getElementById('play')
const voltar = document.getElementById ('voltar')
const avacar =document.getElementById('avancar')
const barraProgresso = document.getElementById('barraProgresso')
const containerProgresso = document.getElementById("containerProgresso")
const aleatorio = document.getElementById('embaralhar')
const repetir = document.getElementById('repetir')
const tempo = document.getElementById('tempo')
const tempoFim = document.getElementById('tempoFim')
const like = document.getElementById('like')

let tocando = false
let ordem = false
let repet = false

// musicas
const newMagicWand = {
    nomeMusica : 'NEW MAGIC WAND',
    nomeBanda : 'Tyler, The Creator',
    file : 'NEW MAGIC WAND',
    gostei: true

}

const kingKunta = {
    nomeMusica : 'King Kunta',
    nomeBanda : 'Kendrick Lammar',
    file : 'King Kunta',
    gostei: false

}

const samurai = {
    nomeMusica : 'Samurai',
    nomeBanda : 'Djavan',
    file : 'Samurai',
    gostei: false

}

const playlist = JSON.parse(localStorage.getItem('playlist')) ??  [newMagicWand, kingKunta, samurai ]
let playlistAleatoria = [...playlist]

let index = 0



// funçoes
function tocar(){ 
    play.querySelector('.bi').classList.remove('bi-play-circle-fill')
    play.querySelector('.bi').classList.add('bi-pause-circle-fill')
    som.play()
    tocando = true
}

function pausar(){ 
    play.querySelector('.bi').classList.remove('bi-pause-circle-fill')
    play.querySelector('.bi').classList.add('bi-play-circle-fill')
    som.pause()
    tocando = false
}

function playPause(){
    if (tocando == false){
        tocar()
    }else{
        pausar()
    } 
}


function carregarMusica(){
    nomeMusica.innerText = `${playlistAleatoria[index].nomeMusica}`
    nomeBanda.innerText = `${playlistAleatoria[index].nomeBanda}`
    som.src = `/musicas/${playlistAleatoria[index].file}.mp3`
    capa.src= `/capas/${playlistAleatoria[index].file}.jpg`
    botaoLike()
}

function voltarMusica(){
    if(index === 0){
        index = playlistAleatoria.length -1
    } else{
        index -= 1
    }
    carregarMusica()
    tocar()
}

function passarMusica(){
    if(index === playlistAleatoria.length -1){
        index =0
    } else{
        index += 1
    }
    carregarMusica()
    tocar()
}

function atualizarProgresso(){
    const barraWidth = (som.currentTime/som.duration)*100;
    barraProgresso.style.setProperty('--progresso', `${barraWidth}%`)
    tempo.innerText = converteTempo(som.currentTime)

}

function pular(event){
   const width = containerProgresso.clientWidth
   const clickPosicao = event.offsetX
   const pularPara = (clickPosicao/width) * som.duration
   som.currentTime = pularPara
}

function embaralharArray (arrayOrdenado){
   const tamanho = arrayOrdenado.length
   let indexAtual = tamanho -1
   while (indexAtual > 0){
    let indexAleatorio = Math.floor(Math.random()* tamanho)
    let aux = arrayOrdenado [indexAtual]
    arrayOrdenado [index] = arrayOrdenado[indexAleatorio]
    arrayOrdenado [indexAleatorio] = aux
    indexAtual -= 1
   }
}

function clicarAleatorio(){
    if (ordem === false){
        ordem = true
        embaralharArray(playlistAleatoria)
        aleatorio.classList.add('botaoAtivo')
    } else {
        ordem = false
        playlistAleatoria = [...playlist]
        aleatorio.classList.remove('botaoAtivo')
    }

}


function clicarRepetir(){
     if (repet === false){
        repet = true
        repetir.classList.add('botaoAtivo')
     } else {
        repet = false
        repetir.classList.remove('botaoAtivo')
     }
}

function passaOuRepete(){
    if (repet === false){
        passarMusica()
    } else{
        tocar()
    }
}

function converteTempo(tempoOriginal){
    let horas = Math.floor(tempoOriginal /3600)
    let min = Math.floor((tempoOriginal - horas * 3600 ) / 60)
    let sec = Math.floor(tempoOriginal - horas *3600 - min * 60)

    return `${horas.toString().padStart(2,'0')}:${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
    

}

function atualizarTempoFim(){
    tempoFim.innerText = converteTempo(som.duration)
}

function botaoLike(){
    if (playlistAleatoria [index].gostei === true){
        like.querySelector('.bi').classList.remove('bi-heart')
        like.querySelector('.bi').classList.add('bi-heart-fill')
        like.classList.add('botaoAtivo')
    } else{
        like.querySelector('.bi').classList.remove('bi-heart-fill')
        like.querySelector('.bi').classList.add('bi-heart')
        like.classList.remove('botaoAtivo')
    }
}

function clicarLike(){
      if (playlistAleatoria[index].gostei === false){
        playlistAleatoria[index].gostei = true
      } else {
        playlistAleatoria[index].gostei = false
      }
      botaoLike()
      localStorage.setItem("playlist", JSON.stringify(playlist))
    }



// inicializando
carregarMusica()
play.addEventListener('click', playPause)
voltar.addEventListener('click',voltarMusica)
avacar.addEventListener('click',passarMusica)
som.addEventListener('timeupdate',atualizarProgresso)
som.addEventListener('ended', passaOuRepete)
som.addEventListener('loadedmetadata',atualizarTempoFim)
containerProgresso.addEventListener("click", pular)
aleatorio.addEventListener('click', clicarAleatorio)
repetir.addEventListener('click', clicarRepetir)
like.addEventListener('click', clicarLike)
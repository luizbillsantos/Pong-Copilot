let bolaImagem;
let jogadorImagem;
let computadorImagem;
let fundoImagem;
let bounceSound;
let goalSound;
let pontosJogador = 0;
let pontosComputador = 0;

class Raquete {
    constructor(x) {
        this.x = x;
        this.y = height / 2;
        this.w = 10;
        this.h = 60;
    }

    update() {
        if (this.x < width / 2) {
            this.y = mouseY;
        } else {
            if (bola.y < this.y) {
                this.y -= 5;
            } else {
                this.y += 5;
            }
        }

        this.y = constrain(this.y, 0, height - this.h);
    }

    draw() {
        if (this.x < width / 2) {
            image(jogadorImagem, this.x, this.y, this.w, this.h);
        } else {
            image(computadorImagem, this.x, this.y, this.w, this.h);
        }
    }
}

class Bola {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.resetVelocity();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.angulo += Math.sqrt(this.vx * this.vx + this.vy * this.vy) / 20;

        if (this.x < this.r || this.x > width - this.r) {
            this.vx *= -1;
            this.x = width / 2;
            this.y = height / 2;
            if (this.x < this.r) {
                pontosJogador++;
            } else {
                pontosComputador++;
            }

            goalSound.play();
            falaPontos();
            this.resetVelocity();
        }

        if (this.y < this.r || this.y > height - this.r) {
            this.vy *= -1;
        }

        if (
            colideRetanguloCirculo(
                this.x,
                this.y,
                this.r,
                jogador.x,
                jogador.y,
                jogador.w,
                jogador.h
            ) ||
            colideRetanguloCirculo(
                this.x,
                this.y,
                this.r,
                computador.x,
                computador.y,
                computador.w,
                computador.h
            )
        ) {
            bounceSound.play();
            this.vx *= -1;
            this.vx *= 1.1;
            this.vy *= 1.1;
        }
    }

    draw() {
        push();
        translate(this.x, this.y);
        rotate(this.angulo);
        imageMode(CENTER);
        image(bolaImagem, 0, 0, this.r * 2, this.r * 2);
        pop();
    }

    resetVelocity() {
        const velocidadeMax = 5;
        this.vx = Math.random() * velocidadeMax * 2 - velocidadeMax;
        this.vy = Math.random() * velocidadeMax * 2 - velocidadeMax;
        this.angulo = 0;
    }
}

function colideRetanguloCirculo(cx, cy, raio, x, y, w, h) {
    if (cx + raio < x || cx - raio > x + w) {
        return false;
    }

    if (cy + raio < y || cy - raio > y + h) {
        return false;
    }
    return true;
}

let bola;
let jogador;
let computador;

function falaPontos() {
    let fala = new SpeechSynthesisUtterance();
    fala.lang = 'pt-BR';
    fala.text = `Jogador ${pontosJogador} a ${pontosComputador} Computador`;
    speechSynthesis.speak(fala);
}

function preload() {
    bolaImagem = loadImage('/images/bola.png');
    jogadorImagem = loadImage('/images/barra01.png');
    computadorImagem = loadImage('/images/barra02.png');
    fundoImagem = loadImage('/images/fundo2.png');
    bounceSound = loadSound('/sounds/446100__justinvoke__bounce.wav');
    goalSound = loadSound('/sounds/274178__littlerobotsoundfactory__jingle_win_synth_02.wav');
}

function setup() {
    createCanvas(800, 400);
    background(0);
    bola = new Bola(200, 200, 12);
    jogador = new Raquete(30);
    computador = new Raquete(width - 30 - 10);
}

function draw() {
    let aspectRatio = fundoImagem.width / fundoImagem.height;
    let canvasAspectRatio = width / height;
    let scale = 1;
    if (aspectRatio > canvasAspectRatio) {
        scale = height / fundoImagem.height;
    } else {
        scale = width / fundoImagem.width;
    }
    let x = (width - fundoImagem.width * scale) / 2;
    let y = (height - fundoImagem.height * scale) / 2;
    image(fundoImagem, x, y, fundoImagem.width * scale, fundoImagem.height * scale);

    bola.update();
    bola.draw();
    jogador.update();
    jogador.draw();
    computador.update();
    computador.draw();
}

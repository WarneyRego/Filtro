const produtos = [
    { id: 1, nome: "Mouse Gamer", img:"./public/images/mouse.webp", categoria: "Periféricos", preco: 120, avaliacao: 4.5, estoque: 15 },
    { id: 2, nome: "Teclado Mecânico", img:"./public/images/teclado.png", categoria: "Periféricos", preco: 250, avaliacao: 4.8, estoque: 8 },
    { id: 3, nome: "Monitor 24\" ", img:"./public/images/monitor.jpg", categoria: "Monitores", preco: 899, avaliacao: 4.6, estoque: 5 },
    { id: 4, nome: "Cadeira Gamer", img:"./public/images/cadeiraa.webp", categoria: "Móveis", preco: 1299, avaliacao: 4.7, estoque: 3 },
    { id: 5, nome: "Headset RGB", img:"./public/images/headset.jpg", categoria: "Áudio", preco: 320, avaliacao: 4.3, estoque: 12 },
    { id: 6, nome: "Notebook i5", img:"./public/images/notebook.jpg", categoria: "Computadores", preco: 3899, avaliacao: 4.9, estoque: 2 },
    { id: 7, nome: "Mousepad Grande", img:"./public/images/mousepad.jpg", categoria: "Periféricos", preco: 85, avaliacao: 4.0, estoque: 20 },
    { id: 8, nome: "Caixa de Som Bluetooth", img:"./public/images/caixadesom.jpg", categoria: "Áudio", preco: 210, avaliacao: 4.2, estoque: 10 },
    { id: 9, nome: "Webcam HD", img:"./public/images/webcam.jpg", categoria: "Periféricos", preco: 180, avaliacao: 4.1, estoque: 7 },
    { id: 10, nome: "SSD 1TB", img:"./public/images/ssd.jpg", categoria: "Armazenamento", preco: 550, avaliacao: 4.8, estoque: 6 },
    { id: 11, nome: "HD Externo 2TB", img:"./public/images/hdexterno.webp", categoria: "Armazenamento", preco: 470, avaliacao: 4.5, estoque: 9 },
    { id: 12, nome: "Placa de Vídeo RTX 3060", img:"./public/images/placa.png", categoria: "Componentes", preco: 2399, avaliacao: 4.9, estoque: 4 },
    { id: 13, nome: "Processador Ryzen 5", img:"./public/images/ryzen5.jpg", categoria: "Componentes", preco: 1050, avaliacao: 4.7, estoque: 5 },
    { id: 14, nome: "Memória RAM 16GB", img:"./public/images/memoria.webp", categoria: "Componentes", preco: 320, avaliacao: 4.6, estoque: 11 },
    { id: 15, nome: "Suporte de Monitor", img:"./public/images/suporte.png", categoria: "Móveis", preco: 130, avaliacao: 4.2, estoque: 8 },
];

// Elementos do DOM
const conteinerdeProdutos = document.getElementById('produtos');
const filtroNome = document.getElementById('filtro-nome');
const filtroCategoria = document.getElementById('filtro-categoria');
const totalProdutos = document.getElementById('total-produtos');
const valorTotal = document.getElementById('valor-total');
const contadorCarrinho = document.querySelector('.contador-carrinho');
const btnAplicarFiltro = document.querySelector('.btn-apply-filter');

// Estado do carrinho
let carrinho = [];

// Função para gerar as estrelas de avaliação
function gerarEstrelas(avaliacao) {
    const estrelaCheia = '<span class="estrela-cheia">★</span>';
    const estrelaVazia = '<span class="estrela-vazia">☆</span>';
    const estrelaMetade = '<span class="estrela-metade">★</span>';
    
    let estrelas = '';
    const avaliacaoInteira = Math.floor(avaliacao);
    const temMetade = avaliacao % 1 >= 0.5;
    
    // Adiciona estrelas cheias
    for (let i = 0; i < avaliacaoInteira; i++) {
        estrelas += estrelaCheia;
    }
    
    // Adiciona meia estrela se necessário
    if (temMetade) {
        estrelas += estrelaMetade;
    }
    
    // Completa com estrelas vazias
    const estrelasVazias = 5 - Math.ceil(avaliacao);
    for (let i = 0; i < estrelasVazias; i++) {
        estrelas += estrelaVazia;
    }
    
    return estrelas;
}

function mostrarProdutos(produtosFiltrados = produtos) {
    conteinerdeProdutos.innerHTML = '';
    
    if (produtosFiltrados.length === 0) {
        conteinerdeProdutos.innerHTML = '<div class="mensagem">Nenhum Produto encontrado</div>';
        atualizarEstatisticas(produtosFiltrados);
        return;
    }
    
    produtosFiltrados.forEach(produto => {
        const estoqueTexto = produto.estoque > 0 
            ? `<span class="estoque disponivel"><i class="fas fa-check-circle"></i> Em estoque: ${produto.estoque} unidades</span>` 
            : '<span class="estoque indisponivel"><i class="fas fa-times-circle"></i> Sem estoque</span>';
            
        const elementoProduto = document.createElement('div');
        elementoProduto.className = 'produto';
        elementoProduto.innerHTML = `
            <div class="produto-badge">${produto.id <= 5 ? '<span class="destaque">Destaque</span>' : ''}</div>
            <img src="${produto.img || './public/images/sem-imagem.jpg'}" alt="${produto.nome}">
            <h3>${produto.nome}</h3>
            <div class="avaliacao">
                ${gerarEstrelas(produto.avaliacao)}
                <span class="nota">(${produto.avaliacao.toFixed(1)})</span>
            </div>
            <div class="detalhes">
                <span class="categoria">${produto.categoria}</span>
                <span class="preco">R$ ${produto.preco.toFixed(2)}</span>
                ${estoqueTexto}
            </div>
            <button class="comprar" onclick="adicionarAoCarrinho(${produto.id})" ${produto.estoque <= 0 ? 'disabled' : ''}>
                ${produto.estoque > 0 
                    ? '<i class="fas fa-shopping-cart"></i> Adicionar ao Carrinho' 
                    : '<i class="fas fa-bell"></i> Avise-me quando chegar'}
            </button>
        `;
        conteinerdeProdutos.appendChild(elementoProduto);
    });
    
    atualizarEstatisticas(produtosFiltrados);
}

// Função para adicionar ao carrinho
function adicionarAoCarrinho(idProduto) {
    const produto = produtos.find(p => p.id === idProduto);
    if (produto && produto.estoque > 0) {
        // Verifica se o produto já está no carrinho
        const itemNoCarrinho = carrinho.find(item => item.id === idProduto);
        
        if (itemNoCarrinho) {
            // Incrementa a quantidade se já estiver no carrinho
            itemNoCarrinho.quantidade += 1;
        } else {
            // Adiciona novo item ao carrinho
            carrinho.push({
                id: produto.id,
                nome: produto.nome,
                preco: produto.preco,
                quantidade: 1
            });
        }
        
        // Atualiza o contador do carrinho
        atualizarContadorCarrinho();
        
        // Anima o botão do carrinho
        const botaoCarrinho = document.querySelector('.botao-carrinho');
        botaoCarrinho.classList.add('animar-carrinho');
        setTimeout(() => {
            botaoCarrinho.classList.remove('animar-carrinho');
        }, 500);
        
        // Mostra mensagem de sucesso
        mostrarMensagem(`<i class="fas fa-check-circle"></i> ${produto.nome} adicionado ao carrinho!`, 'sucesso');
    }
}

// Função para atualizar o contador do carrinho
function atualizarContadorCarrinho() {
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    contadorCarrinho.textContent = totalItens;
    
    // Adiciona animação ao contador
    contadorCarrinho.classList.add('pulsar');
    setTimeout(() => {
        contadorCarrinho.classList.remove('pulsar');
    }, 300);
}

// Função para mostrar mensagem
function mostrarMensagem(texto, tipo = 'info') {
    // Cria o elemento de mensagem
    const mensagem = document.createElement('div');
    mensagem.className = `mensagem-toast ${tipo}`;
    mensagem.innerHTML = texto;
    
    // Adiciona ao body
    document.body.appendChild(mensagem);
    
    // Anima a entrada da mensagem
    setTimeout(() => {
        mensagem.classList.add('show');
    }, 10);
    
    // Remove após alguns segundos
    setTimeout(() => {
        mensagem.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(mensagem);
        }, 300);
    }, 3000);
}

// Animação para mostrar produtos
function animarProdutos() {
    const elementosProdutos = document.querySelectorAll('.produto');
    elementosProdutos.forEach((produto, indice) => {
        produto.style.opacity = '0';
        produto.style.transform = 'translateY(20px)';
        setTimeout(() => {
            produto.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            produto.style.opacity = '1';
            produto.style.transform = 'translateY(0)';
        }, indice * 100);
    });
}

function filtrarProdutos() {
    const termoBusca = filtroNome.value.toLowerCase();
    const categoriaSelecionada = filtroCategoria.value;
    
    const produtosFiltrados = produtos.filter(produto => {
        const nomeCorresponde = produto.nome.toLowerCase().includes(termoBusca);
        const categoriaCorresponde = categoriaSelecionada === '' || produto.categoria === categoriaSelecionada;
        
        return nomeCorresponde && categoriaCorresponde;
    });
    
    mostrarProdutos(produtosFiltrados);
    animarProdutos();
}

function filtrarAutomaticamente() {
    filtrarProdutos();
}

function atualizarEstatisticas(produtosFiltrados) {
    totalProdutos.textContent = produtosFiltrados.length;
    
    const soma = produtosFiltrados.reduce((total, produto) => total + produto.preco, 0);
    valorTotal.textContent = `R$ ${soma.toFixed(2)}`;
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    mostrarProdutos();
    animarProdutos();
    
    // Event listeners
    filtroCategoria.addEventListener('change', filtrarProdutos);
    if (btnAplicarFiltro) {
        btnAplicarFiltro.addEventListener('click', filtrarProdutos);
    }
    
    // Adiciona animação aos links do menu
    const linksNavegacao = document.querySelectorAll('.nav-links a');
    linksNavegacao.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove a classe active de todos os links
            linksNavegacao.forEach(l => l.classList.remove('active'));
            
            // Adiciona a classe active ao link clicado
            this.classList.add('active');
        });
    });
});
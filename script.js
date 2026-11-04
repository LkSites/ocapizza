// Base de dados do Cardápio
const menuItems = [
    {
        id: 1,
        title: "Calabresa Especial",
        category: "tradicionais",
        price: 48.00,
        desc: "Molho de tomate caseiro, muçarela, calabresa fatiada, cebola e azeitonas pretas.",
        img: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        title: "Quatro Queijos",
        category: "tradicionais",
        price: 52.00,
        desc: "Molho artesanal, muçarela, provolone, gorgonzola e catupiry original.",
        img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        title: "Costela com Barbecue (Oca)",
        category: "especiais",
        price: 64.00,
        desc: "Costela desfiada lentamente, muçarela, molho barbecue e finalizado com agrião.",
        img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4,
        title: "Frango com Catupiry",
        category: "tradicionais",
        price: 50.00,
        desc: "Peito de frango desfiado temperado, milho verde e catupiry cremoso.",
        img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 5,
        title: "Chocolate com Morango",
        category: "doces",
        price: 45.00,
        desc: "Chocolate ao leite nobre coberto com morangos frescos fatiados.",
        img: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 6,
        title: "Coca-Cola 2L",
        category: "bebidas",
        price: 14.00,
        desc: "Garrafa de 2 Litros gelada.",
        img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80"
    }
];

let cart = [];

// Elementos do DOM
const menuGrid = document.getElementById('menuGrid');
const tabBtns = document.querySelectorAll('.tab-btn');
const openCartBtn = document.getElementById('openCartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const closeCartOverlay = document.getElementById('closeCartOverlay');
const cartModal = document.getElementById('cartModal');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');

// Inicializar Cardápio
function renderMenu(category = 'todos') {
    menuGrid.innerHTML = '';
    const filteredItems = category === 'todos' 
        ? menuItems 
        : menuItems.filter(item => item.category === category);

    filteredItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'pizza-card';
        card.innerHTML = `
            <img src="${item.img}" alt="${item.title}" class="pizza-img">
            <div class="pizza-info">
                <h3 class="pizza-title">${item.title}</h3>
                <p class="pizza-desc">${item.desc}</p>
                <div class="pizza-bottom">
                    <span class="pizza-price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                    <button class="add-btn" onclick="addToCart(${item.id})"><i class="fas fa-plus"></i></button>
                </div>
            </div>
        `;
        menuGrid.appendChild(card);
    });
}

// Filtro por Categoria
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderMenu(btn.dataset.category);
    });
});

// Adicionar ao Carrinho
function addToCart(id) {
    const item = menuItems.find(p => p.id === id);
    if (item) {
        cart.push(item);
        updateCart();
        openCart();
    }
}

// Atualizar Drawer do Carrinho
function updateCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Seu carrinho está vazio.</p>';
    } else {
        cart.forEach((item, index) => {
            total += item.price;
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div>
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
                </div>
                <button onclick="removeFromCart(${index})" style="background:none; border:none; color: var(--accent-red); cursor:pointer;"><i class="fas fa-trash"></i></button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
    }

    cartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    cartCount.textContent = cart.length;
}

// Remover do Carrinho
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// Controlar Abertura/Fechamento do Carrinho
function openCart() {
    cartModal.classList.add('open');
}

function closeCart() {
    cartModal.classList.remove('open');
}

openCartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
closeCartOverlay.addEventListener('click', closeCart);

// Finalizar Pedido no WhatsApp
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    let text = "Olá, Oca Pizza! Gostaria de fazer o seguinte pedido:\n\n";
    let total = 0;
    
    cart.forEach((item, i) => {
        text += `${i + 1}. *${item.title}* - R$ ${item.price.toFixed(2).replace('.', ',')}\n`;
        total += item.price;
    });

    text += `\n*Total:* R$ ${total.toFixed(2).replace('.', ',')}`;
    text += "\n\nCidade: Santa Rosa - RS";

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/5555999999999?text=${encodedText}`;
    
    window.open(whatsappUrl, '_blank');
});

// Renderização inicial
renderMenu();
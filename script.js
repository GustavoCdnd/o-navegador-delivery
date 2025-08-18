const menu = document.getElementById("menu")
const combos = document.getElementById("combos")
const entradas = document.getElementById("entradas")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal")
const cartCounter = document.getElementById("cart-count")
const adressInput = document.getElementById("adress")
const adressWarn = document.getElementById("adress-warn")
const ClientName = document.getElementById("client-name")


let cart = [];

// Abrir o carrinho//

cartBtn.addEventListener("click", function() {
    updateCartModal();
    cartModal.style.display = "flex"
    

})

//fechamento do carrinho//
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")
    
    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        addToCart(name, price)
    }

})
combos.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")
    
    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        addToCart(name, price)
    }


})


function addToCart(name, price){

    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        existingItem.quantity += 1;

    }else{
        cart.push({
            name,
            price,
            quantity: 1,
    })

    }

    

    updateCartModal()

}

function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        
        <div class="flex items-center justify-between">
        <div>
            <p class="font-bold">${item.name}</p>
            <p>Qtd:${item.quantity}</p>
            <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
        
        
        </div>

            <button class="remove-from-cart-btn" data-name="${item.name}">
            Remover
            </button>

        </div>
        
        `
        total += item.price * item.quantity;
        
        cartItemsContainer.appendChild(cartItemElement)

    })
    cartTotal.textContent = total.toLocaleString("pt-BR",{
        style: "currency",
        currency:"BRL"
    });

    cartCounter.innerHTML = cart.length;

}

cartItemsContainer.addEventListener("click", function (event){
    if(event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name")
        removeItemCart(name);
        // vazio, mas sintaticamente correto
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);
    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}


adressInput.addEventListener("input", function(event){
    let inpuValue = event.target.value;
    if(inpuValue !== ""){
        adressInput.classList.remove("border-red-500")
        adressWarn.classList.add("hidden")
    }

})

document.addEventListener("DOMContentLoaded", function () {
  const checkoutBtn = document.getElementById("checkout-btn");
  const adressInput = document.getElementById("adress");
  const adressWarn = document.getElementById("adress-warn");
  const clientNameInput = document.getElementById("client-name");

  checkoutBtn.addEventListener("click", function () {
    const aberto = checkRestaurantOpen();

    if (!aberto) {
      Toastify({
  text: "Restaurante Fechado",
  duration: 3000,
  destination: "https://github.com/apvarun/toastify-js",
  newWindow: true,
  close: true,
  gravity: "top", // `top` or `bottom`
  position: "right", // `left`, `center` or `right`
  stopOnFocus: true, // Prevents dismissing of toast on hover
  style: {
    background: "linear-gradient(to right, #b30000)",
  },
  onClick: function(){} // Callback after click
}).showToast();
      
      return;
    }
    

    if (cart.length === 0) {
      alert("Carrinho vazio.");
      return;
    }

    if (clientNameInput.value.trim() === "") {
      alert("Por favor, informe seu nome.");
      clientNameInput.focus();
      return;
    }

    if (adressInput.value.trim() === "") {
      adressWarn.classList.remove("hidden");
      adressInput.classList.add("border-red-500");
      return;
    } else {
      adressWarn.classList.add("hidden");
      adressInput.classList.remove("border-red-500");
    }

    // Monta os itens do carrinho com formato estilizado
    const cartItems = cart.map(item =>
      `- ${item.name} (Qtd: ${item.quantity}) - R$${item.price.toFixed(2)}`
    ).join("\n");

    // Calcula o total do pedido
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Monta a mensagem completa formatada para o WhatsApp, incluindo o nome
    const fullMessage = 
`👋 Olá! Meu nome é ${clientNameInput.value.trim()} e gostaria deste pedido:

${cartItems}

💰 Total: R$ ${total.toFixed(2)} + taxa de entrega

🏠 Endereço: ${adressInput.value}

Obrigado! 😊`;

    // Codifica a mensagem para URL
    const encoded = encodeURIComponent(fullMessage);

    // Número do WhatsApp com DDI e DDD
    const phone = "5595984128590";

    // URL para abrir o WhatsApp com mensagem preenchida
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`;

    // Abre o WhatsApp em nova aba
    window.open(url, "_blank");
  });
});

  // Função para verificar se restaurante está aberto
  function checkRestaurantOpen() {
    const agora = new Date();
    const hora = agora.getHours();
    return hora >= 18 && hora < 24; // aberto das 18h até 23:59
  }
;


// Função loja aberta ou fechada//


  const dateSpan = document.getElementById("date-span");

  if (dateSpan) {
    const aberto = checkRestaurantOpen();

    // Garante que só tenha uma cor ativa
    dateSpan.classList.remove("bg-green-600", "bg-red-500");

    if (aberto) {
      dateSpan.classList.add("bg-green-600");
    } else {
      dateSpan.classList.add("bg-red-500");
    }
  }


 document.addEventListener("DOMContentLoaded", function () {
    const navBar = document.getElementById("nav-bar");
    let lastScroll = window.pageYOffset;

    window.addEventListener("scroll", () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > lastScroll) {
        // rolando para baixo → MOSTRAR navbar
        navBar.classList.remove("-translate-y-full");
        navBar.classList.add("translate-y-0");
      } else if (currentScroll < lastScroll) {
        // rolando para cima → ESCONDER navbar
        navBar.classList.add("-translate-y-full");
        navBar.classList.remove("translate-y-0");
      }

      lastScroll = currentScroll <= 0 ? 0 : currentScroll;
    });
  });


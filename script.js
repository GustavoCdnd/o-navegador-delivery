    // --- Elementos do DOM ---
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
    const deliveryArea = document.getElementById("delivery-area")
    const paymentMethod = document.getElementById("payment-method")
    const changeSection = document.getElementById("change-section")
    const cashGivenInput = document.getElementById("cash-given")
    const combos = document.getElementById("combos")
    const dateSpan = document.getElementById("date-span")
    // --- Listas ---
    const drinksList = ["Coca Zero", "Fanta Laranja", "Sprite", "Fanta Uva"]

    const burgersList = [
    {name:"Clássico do Porto", price:18},
    {name:"Maré Dupla", price:28},
    {name:"X Salada", extra:15},
    {name:"Rings do Galeão", extra:5}
    ]

    const friesList = [
    {name:"Batata Frita", extra:0},
    {name:"Onion Rings", extra:0},
    {name:"Batata Especial", extra:5}
    ]

    // --- Modal de combos ---
    const drinkModal = document.getElementById("drink-modal")
    const drinkOptions = document.getElementById("drink-options")
    const cancelDrinkBtn = document.getElementById("cancel-drink")
    const comboItemsContainer = document.getElementById("combo-items")
    const comboTotalElement = document.getElementById("combo-total")
    let pendingCombo = null
    let selectedDrinks = []
    let selectedBurgers = {}
    let selectedFries = []

    let confirmDrinkBtn = document.getElementById("confirm-drink")
    if(!confirmDrinkBtn){
    confirmDrinkBtn = document.createElement("button")
    confirmDrinkBtn.id = "confirm-drink"
    confirmDrinkBtn.className = "mt-4 w-full bg-gray-500 text-white py-2 rounded hover:bg-green-600 transition-colors"
    confirmDrinkBtn.textContent = "Confirmar"
    drinkModal.querySelector("div").appendChild(confirmDrinkBtn)
    }

    // --- Abrir modal combo ---
    function openComboModal(combo){
    pendingCombo = combo
    selectedBurgers = {}
    selectedFries = []
    selectedDrinks = []

    comboItemsContainer.innerHTML = ""
    comboTotalElement.textContent = combo.price.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})

    // --- Burgers ---
    if(combo.name==="Tripulação a 2" || combo.name==="Combo da Tripulação"){
        burgersList.forEach(burger=>{
        // Regras de seleção por combo
        if(combo.name==="Tripulação a 2" && !["X Salada","Rings do Galeão"].includes(burger.name)) return
        if(combo.name==="Combo da Tripulação" && !["Clássico do Porto","Maré Dupla","X Salada"].includes(burger.name)) return

        const itemDiv = document.createElement("div")
        itemDiv.className="flex justify-between items-center mb-2 border-b pb-1"

        const nameSpan = document.createElement("span")
        if(combo.name==="Tripulação a 2" && burger.name==="Rings do Galeão") nameSpan.textContent=`${burger.name} (+R$5 se selecionar 2)`
        else if(combo.name==="Combo da Tripulação" && burger.extra) nameSpan.textContent=`${burger.name} (+R$${burger.extra})`
        else nameSpan.textContent = burger.name

        const controlsDiv = document.createElement("div")
        controlsDiv.className="flex items-center gap-2"

        const minusBtn = document.createElement("button")
        minusBtn.textContent="-"
        minusBtn.className="bg-red-500 text-white px-2 rounded"

        const qtySpan = document.createElement("span")
        qtySpan.textContent="0"
        qtySpan.className="burger-qty font-bold"

        const plusBtn = document.createElement("button")
        plusBtn.textContent="+"
        plusBtn.className="bg-green-500 text-white px-2 rounded"

        controlsDiv.appendChild(minusBtn)
        controlsDiv.appendChild(qtySpan)
        controlsDiv.appendChild(plusBtn)
        itemDiv.appendChild(nameSpan)
        itemDiv.appendChild(controlsDiv)
        comboItemsContainer.appendChild(itemDiv)

        selectedBurgers[burger.name] = 0

        plusBtn.addEventListener("click",()=>{
            const totalSelected = Object.entries(selectedBurgers).filter(([n])=>n!=="X Salada").reduce((acc,[_,v])=>acc+v,0)
            let canAdd = true

            if(combo.name==="Tripulação a 2"){
            if(totalSelected>=2) canAdd=false
            if(burger.name==="Rings do Galeão" && selectedBurgers["Rings do Galeão"]>=2) canAdd=false
            if(burger.name==="X Salada" && selectedBurgers["X Salada"]>=2) canAdd=false
            }

            if(combo.name==="Combo da Tripulação"){
            const classicoQty = selectedBurgers["Clássico do Porto"] || 0
            const mareQty = selectedBurgers["Maré Dupla"] || 0
            if(burger.name==="Clássico do Porto" && classicoQty>=2) canAdd=false
            if(burger.name==="Maré Dupla" && mareQty>=4) canAdd=false
            if(["Clássico do Porto","Maré Dupla"].includes(burger.name) && totalSelected>=4) canAdd=false
            if(burger.name==="X Salada" && selectedBurgers["X Salada"]>=1) canAdd=false
            }

            if(canAdd){
            selectedBurgers[burger.name]+=1
            qtySpan.textContent = selectedBurgers[burger.name]
            updateComboTotal()
            }
        })

        minusBtn.addEventListener("click",()=>{
            if(selectedBurgers[burger.name]>0){
            selectedBurgers[burger.name]-=1
            qtySpan.textContent = selectedBurgers[burger.name]
            updateComboTotal()
            }
        })
        })
    }

    // --- marca o horario e nao aceita pedidos ---

    function atualizarStatusCombo() {
    const comboBtn = document.getElementById('date-span')
    const statusSpan = document.getElementById('date-span')
    const agora = new Date()
    const hora = agora.getHours()

    if(hora >= 18 && hora < 24) { // 18:00 até 23:59
        comboBtn.disabled = false
        comboBtn.classList.remove('bg-red-500')
        comboBtn.classList.add('bg-green-500')
        statusSpan.textContent = 'Funcionamento das 18h às 00h'
        statusSpan.classList.add('text-white')
    } else { // Antes das 18h ou após 23:59
        comboBtn.disabled = true
        comboBtn.classList.remove('bg-green-500')
        comboBtn.classList.add('bg-red-500')
        statusSpan.textContent = 'FECHADO'
        statusSpan.classList.add('text-white')
    }
    }

    // Função de verificação antes do checkout
    function verificarLojaAberta() {
    const agora = new Date()
    const hora = agora.getHours()
    if(hora < 18 || hora >= 24) {
        alert("Loja fechada! Funcionamento das 18h às 23h.")
        return false
    }
    return true
    }

    // Chame verificarLojaAberta() antes do checkout
    checkoutBtn.addEventListener("click", () => {
    if(!verificarLojaAberta()) return
    // resto do código de checkout aqui...
    })

    // Atualiza status a cada minuto
    setInterval(atualizarStatusCombo, 60000)
    // Atualiza imediatamente ao carregar
    atualizarStatusCombo()

    // Atualiza a cada minuto
    setInterval(atualizarStatusCombo, 60000)
    // Atualiza imediatamente ao carregar
    atualizarStatusCombo()


    // Atualiza a cada minuto
    setInterval(atualizarStatusCombo, 60000)
    // Atualiza imediatamente ao carregar
    atualizarStatusCombo()

    

  if(combo.name==="Tripulação a 2" || combo.name==="Combo da Tripulação"){
    const friesDiv = document.createElement("div")
    friesDiv.className="mb-4"
    const title = document.createElement("p")
    title.textContent = "Escolha um acompanhamento"
    title.className="font-bold text-lg text-gray-800 mb-3 border-b pb-1"
    friesDiv.appendChild(title)

    friesList.forEach(f=>{
        const btn = document.createElement("button")
        btn.textContent = f.name
        btn.className="fries-option border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-700 font-medium text-sm text-center shadow-sm mr-2 mb-2 hover:border-green-400 hover:bg-green-50 transition-all duration-200"
        btn.addEventListener("click",()=>{
            if(selectedFries.includes(f.name)){
                selectedFries = selectedFries.filter(x=>x!==f.name)
                btn.classList.remove("bg-green-500","text-white")
            } else {
                if(selectedFries.length<1){
                    selectedFries.push(f.name)
                    btn.classList.add("bg-green-500","text-white")
                } else {
                    alert("Você só pode escolher 1 acompanhamento")
                }
            }
            updateComboTotal()
        })
        friesDiv.appendChild(btn)
    })
    comboItemsContainer.appendChild(friesDiv)
}

// --- Bebidas ---
drinkOptions.innerHTML=""
selectedDrinks = []
let maxDrinks = combo.name==="Tripulação a 2"?2:1
drinksList.forEach(drink=>{
    const btn = document.createElement("button")
    btn.textContent = drink
    btn.className="drink-option border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-700 font-medium text-sm text-center shadow-sm mr-2 mb-2 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
    btn.dataset.drink = drink
    btn.addEventListener("click",()=>{
        if(selectedDrinks.includes(drink)){
            selectedDrinks = selectedDrinks.filter(d=>d!==drink)
            btn.classList.remove("bg-green-500","text-white")
        }else if(selectedDrinks.length < maxDrinks){
            selectedDrinks.push(drink)
            btn.classList.add("bg-green-500","text-white")
        }
        updateComboTotal()
    })
    drinkOptions.appendChild(btn)
})

drinkModal.classList.remove("hidden")
}

// --- Atualiza total ---
function updateComboTotal(){
    if(!pendingCombo) return
    let total = pendingCombo.price

    if(pendingCombo.name==="Tripulação a 2"){
        const ringsQty = selectedBurgers["Rings do Galeão"] || 0
        if(ringsQty===2) total += 5
        if(selectedFries.includes("Batata Especial")) total += 5
    }

    if(pendingCombo.name==="Combo da Tripulação"){
        const classicoQty = selectedBurgers["Clássico do Porto"] || 0
        const mareQty = selectedBurgers["Maré Dupla"] || 0
        const xSaladaQty = selectedBurgers["X Salada"] || 0

        if(mareQty>2) total += (mareQty-2)*10
        if(xSaladaQty>0) total += xSaladaQty*15
        if(selectedFries.includes("Batata Especial")) total += 5
    }

    comboTotalElement.textContent = total.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})
}




    // --- Confirmar seleção ---
    confirmDrinkBtn.addEventListener("click",()=>{
    if(!pendingCombo) return

    const burgersArray = []
    for(const [name, qty] of Object.entries(selectedBurgers)){
        if(qty>0) burgersArray.push(`${name} x${qty}`)
    }

    addToCart(
        pendingCombo.name,
        parseFloat(comboTotalElement.textContent.replace("R$","").replace(".","").replace(",",".").trim()),
        selectedDrinks,
        burgersArray,
        selectedFries.join(", ")
    )

    pendingCombo = null
    selectedBurgers = {}
    selectedDrinks = []
    selectedFries = []
    drinkModal.classList.add("hidden")
    })

    // --- Cancelar modal ---
    cancelDrinkBtn.addEventListener("click",()=>{
    pendingCombo=null
    selectedBurgers={}
    selectedDrinks=[]
    selectedFries=[]
    drinkModal.classList.add("hidden")
    })
    drinkModal.addEventListener("click",(e)=>{if(e.target===drinkModal){pendingCombo=null; selectedBurgers={}; selectedDrinks=[]; selectedFries=[]; drinkModal.classList.add("hidden")}})

    // --- Carrinho ---
    let cart=[]
    function addToCart(name,price,drinks=[],burgers=[],fries=null){
    cart.push({name,price,quantity:1,drinks,burgers,fries})
    updateCartModal()
    }


    function updateCartModal(){
    cartItemsContainer.innerHTML = ""
    let subtotal = 0

    cart.forEach(item=>{
        const div = document.createElement("div")
        div.className="flex justify-between items-center mb-4 border-b pb-2"

        let drinksHtml = item.drinks.length>0 ? `<p class="text-sm text-gray-500">Bebidas: ${item.drinks.join(", ")}</p>` : ""
        let burgersHtml = item.burgers.length>0 ? `<p class="text-sm text-gray-500">Burgers: ${item.burgers.join(", ")}</p>` : ""
        let friesHtml = item.fries ? `<p class="text-sm text-gray-500">Acompanhamento: ${item.fries}</p>` : ""

        div.innerHTML=`
        <div>
            <p class="font-bold">${item.name}</p>
            ${burgersHtml}${friesHtml}${drinksHtml}
            <p class="font-medium mt-1">R$ ${item.price.toFixed(2)}</p>
        </div>
        <div class="flex items-center gap-2">
            <button class="decrease-btn bg-red-500 text-white px-2 rounded" data-index="${cart.indexOf(item)}">-</button>
            <span class="font-bold">${item.quantity}</span>
            <button class="increase-btn bg-green-500 text-white px-2 rounded" data-index="${cart.indexOf(item)}">+</button>
        </div>
        `
        subtotal += item.price*item.quantity
        cartItemsContainer.appendChild(div)
    })

    let taxaEntrega = 0
    if(deliveryArea && deliveryArea.value){
        const [,taxaStr] = deliveryArea.value.split("|")
        taxaEntrega = Number(taxaStr) || 0
    }

    const total = subtotal + taxaEntrega
    cartTotal.textContent = total.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})
    cartCounter.innerText = cart.length
    }

    // --- atualizar total quando mudar o bairro ---
    deliveryArea.addEventListener("change", updateCartModal)

    // --- Inputs endereço ---
    adressInput.addEventListener("input",()=>{
    if(adressInput.value.trim()!==""){
        adressInput.classList.remove("border-red-500")
        adressWarn.classList.add("hidden")
    }
    })

    // --- Troco ---
    paymentMethod.addEventListener("change",()=>{
    if(paymentMethod.value==="dinheiro") changeSection.classList.remove("hidden")
    else { changeSection.classList.add("hidden"); if(cashGivenInput) cashGivenInput.value="" }
    })

    // --- Abrir/fechar carrinho ---
    cartBtn.addEventListener("click",()=>{updateCartModal(); cartModal.classList.remove("hidden")})
    closeModalBtn.addEventListener("click",()=>cartModal.classList.add("hidden"))
    cartModal.addEventListener("click",(e)=>{if(e.target===cartModal) cartModal.classList.add("hidden")})

    // --- Clique combos ---
    document.querySelectorAll('#combos > div').forEach(card=>{
    card.addEventListener("click",(e)=>{
        if(e.target.closest('button')) return
        const btn = card.querySelector('.add-to-cart-btn')
        const name = btn.dataset.name
        const price = parseFloat(btn.dataset.price)
        let drinksAllowed = 1
        if(name==="Tripulação a 2") drinksAllowed=2
        openComboModal({name,price,drinksAllowed})
    })
    })

    cartBtn.addEventListener("click", function() {
        updateCartModal();
        cartModal.style.display = "flex"
    })

    // --- Fechar carrinho clicando fora ---
    cartModal.addEventListener("click", function(event){
        if(event.target === cartModal){
            cartModal.style.display = "none"
        }
    })

    // --- Fechar carrinho botão ---
    closeModalBtn.addEventListener("click", function(){
        cartModal.style.display = "none"
    })

    // --- Adicionar ao carrinho (menu / combos) ---
    menu.addEventListener("click", handleAddToCart);
    combos.addEventListener("click", handleAddToCart);

    function handleAddToCart(event) {
        let parentButton = event.target.closest(".add-to-cart-btn")
        if(parentButton){
            const name = parentButton.getAttribute("data-name")
            const price = parseFloat(parentButton.getAttribute("data-price"))
            addToCart(name, price)
        }
    }

    function addToCart(name, price){
        const existingItem = cart.find(item => item.name === name)
        if(existingItem){
            existingItem.quantity += 1;
        } else {
            cart.push({ name, price, quantity: 1 })
        }
        updateCartModal()
    }

    // --- Atualiza modal ---
    function updateCartModal(){
        cartItemsContainer.innerHTML = "";
        let total = 0;

        cart.forEach(item => {
            const cartItemElement = document.createElement("div");
            cartItemElement.classList.add("flex", "justify-between", "items-center", "mb-4", "border-b", "pb-2");

            cartItemElement.innerHTML = `
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p class="font-medium mt-1">R$ ${item.price.toFixed(2)}</p>
                </div>

                <div class="flex items-center gap-2">
                    <button class="decrease-btn bg-red-500 text-white px-2 rounded" data-name="${item.name}">-</button>
                    <span class="font-bold">${item.quantity}</span>
                    <button class="increase-btn bg-green-500 text-white px-2 rounded" data-name="${item.name}">+</button>
                </div>
            `;

            total += item.price * item.quantity;
            cartItemsContainer.appendChild(cartItemElement)
        });

        cartTotal.textContent = total.toLocaleString("pt-BR",{ style: "currency", currency:"BRL" });
        cartCounter.innerHTML = cart.length;
    }
    

    // --- Eventos dos botões ➕ e ➖ ---
    cartItemsContainer.addEventListener("click", function (event){
        const name = event.target.getAttribute("data-name");

        if(event.target.classList.contains("decrease-btn")) {
            removeItemCart(name);
        }

        if(event.target.classList.contains("increase-btn")) {
            const item = cart.find(i => i.name === name);
            if(item){
                item.quantity += 1;
                updateCartModal();
            }
        }
    })

    // ======= Substituir por este bloco (único addToCart / updateCartModal / listener) =======

/**
 * Compara arrays (independente da ordem)
 */
function arraysEqualUnordered(a, b) {
  a = Array.isArray(a) ? [...a].map(String) : [];
  b = Array.isArray(b) ? [...b].map(String) : [];
  if (a.length !== b.length) return false;
  a.sort(); b.sort();
  return a.every((v, i) => v === b[i]);
}

/**
 * Adiciona ao carrinho: aceita name, price, drinks[], burgers[], fries (string|null)
 * Se já existir item com MESMAS opções, incrementa quantity; senão cria novo item com id único.
 */
function addToCart(name, price, drinks = [], burgers = [], fries = null) {
  drinks = Array.isArray(drinks) ? drinks.slice() : [];
  burgers = Array.isArray(burgers) ? burgers.slice() : [];
  fries = fries || null;

  const existingIndex = cart.findIndex(it =>
    it.name === name &&
    arraysEqualUnordered(it.drinks || [], drinks) &&
    arraysEqualUnordered(it.burgers || [], burgers) &&
    (it.fries || null) === fries
  );

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += 1;
  } else {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
    cart.push({ id, name, price, quantity: 1, drinks, burgers, fries });
  }

  updateCartModal();
}

/**
 * Atualiza visual do modal do carrinho mostrando burgers, acompanhamentos e bebidas.
 */
function updateCartModal() {
  cartItemsContainer.innerHTML = "";

  cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "flex justify-between items-center mb-4 border-b pb-2";

    const drinksHtml = item.drinks && item.drinks.length ? `<p class="text-sm text-gray-500">Bebidas: ${item.drinks.join(", ")}</p>` : "";
    const burgersHtml = item.burgers && item.burgers.length ? `<p class="text-sm text-gray-500">Burgers: ${item.burgers.join(", ")}</p>` : "";
    const friesHtml = item.fries ? `<p class="text-sm text-gray-500">Acompanhamento: ${item.fries}</p>` : "";

    div.innerHTML = `
      <div>
        <p class="font-bold">${item.name}</p>
        ${burgersHtml}${friesHtml}${drinksHtml}
        <p class="font-medium mt-1">R$ ${item.price.toFixed(2)}</p>
      </div>

      <div class="flex items-center gap-2">
        <button class="decrease-btn bg-red-500 text-white px-2 rounded" data-id="${item.id}">-</button>
        <span class="font-bold">${item.quantity}</span>
        <button class="increase-btn bg-green-500 text-white px-2 rounded" data-id="${item.id}">+</button>
      </div>
    `;

    cartItemsContainer.appendChild(div);
  });

  // Atualiza total (usa funções já existentes getSubtotal e getTaxaEntrega)
  updateTotalDisplay();

  // Atualiza contador (quantidade de entradas distintas)
  cartCounter.innerText = cart.length;
}

/**
 * Listener unificado para os botões + / - (usa data-id)
 */
cartItemsContainer.addEventListener("click", function (event) {
  const id = event.target.dataset.id;
  if (!id) return;

  const idx = cart.findIndex(i => i.id === id);
  if (idx === -1) return;

  if (event.target.classList.contains("decrease-btn")) {
    if (cart[idx].quantity > 1) {
      cart[idx].quantity -= 1;
    } else {
      cart.splice(idx, 1);
    }
    updateCartModal();
  }

  if (event.target.classList.contains("increase-btn")) {
    cart[idx].quantity += 1;
    updateCartModal();
  }
});

// =======================================================================================




    // --- Remover item ---
    function removeItemCart(name){
        const index = cart.findIndex(item => item.name === name);
        if(index !== -1){
            const item = cart[index];
            if(item.quantity > 1){
                item.quantity -= 1;
            } else {
                cart.splice(index, 1);
            }
            updateCartModal();
        }
    }

    // --- Endereço ---
    adressInput.addEventListener("input", function(event){
        let inpuValue = event.target.value;
        if(inpuValue !== ""){
            adressInput.classList.remove("border-red-500")
            adressWarn.classList.add("hidden")
        }
    })

    // --- Checkout WhatsApp ---
    checkoutBtn.addEventListener("click",()=>{
    if(cart.length===0){ alert("Carrinho vazio"); return }
    if(ClientName.value.trim()===""){ alert("Informe seu nome"); ClientName.focus(); return }
    if(adressInput.value.trim()===""){ adressWarn.classList.remove("hidden"); adressInput.classList.add("border-red-500"); return }
    if(!deliveryArea.value){ alert("Selecione o bairro"); return }
    if(!paymentMethod.value){ alert("Selecione a forma de pagamento"); return }

    const cartItems = cart.map(item=>{
        return `- ${item.name} (Qtd: ${item.quantity})`+
            (item.burgers.length>0?` | Burgers: ${item.burgers.join(", ")}`:"")+
            (item.fries?` | Batata: ${item.fries}`:"")+
            (item.drinks.length>0?` | Bebidas: ${item.drinks.join(", ")}`:"")+
            ` - R$${item.price.toFixed(2)}`
    }).join("\n")

    const subtotal = cart.reduce((a,i)=>a+i.price*i.quantity,0)
    const [bairro,taxaStr] = deliveryArea.value.split("|")
    const taxaEntrega = Number(taxaStr)||0
    const total = subtotal+taxaEntrega

    let pagamentoMsg = ""
    if(paymentMethod.value==="dinheiro"){
        const valorPago = Number(cashGivenInput.value.replace(",",".")||0)
        const troco = Math.max(0,valorPago-total)
        pagamentoMsg = valorPago>0 ? `Dinheiro (entregue: R$${valorPago.toFixed(2)} | troco: R$${troco.toFixed(2)})` : "Dinheiro (sem troco)"
    }else pagamentoMsg = paymentMethod.value==="cartao"?"Cartão (crédito/débito)":"Pix"

    const fullMessage =
    `👋 Olá! Meu nome é ${ClientName.value.trim()} e gostaria deste pedido:

    ${cartItems}

    🧾 Subtotal: R$${subtotal.toFixed(2)}
    🚚 Bairro: ${bairro} | Taxa: R$${taxaEntrega.toFixed(2)}
    💰 Total: R$${total.toFixed(2)}
    💳 Pagamento: ${pagamentoMsg}

    🏠 Endereço: ${adressInput.value}

    Obrigado! 😊`;

    const encoded = encodeURIComponent(fullMessage)
    const phone = "5595984128590"
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`,"_blank")
    })

    const BRL = (v) => (Number(v) || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    // --- Subtotal ---
    function getSubtotal() {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    }

    // --- Taxa ---
    function getTaxaEntrega() {
    if (!deliveryArea || !deliveryArea.value) return 0;
    const [, taxa] = deliveryArea.value.split("|");
    return Number(taxa) || 0;
    }

    // --- Atualiza total ---
    function updateTotalDisplay() {
    const total = getSubtotal() + getTaxaEntrega();
    cartTotal.textContent = total.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // --- Troco ---
    paymentMethod?.addEventListener("change", () => {
    if (paymentMethod.value === "dinheiro") {
        changeSection?.classList.remove("hidden");
    } else {
        changeSection?.classList.add("hidden");
        if (cashGivenInput) cashGivenInput.value = "";
    }
    });

    // --- Recalcular total ---
    deliveryArea?.addEventListener("change", updateTotalDisplay);
    updateTotalDisplay();







const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItensContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("adress");
const bairro = document.getElementById("bairro");
const complemento = document.getElementById("complemento");
const addressWarn = document.getElementById("adress-warn");
<<<<<<< HEAD
const paymentOptions = document.querySelectorAll('input[name="payment-method"]');
=======
const paymentOptions = document.querySelectorAll(
  'input[name="payment-method"]'
);
>>>>>>> f6a243e (Primeiro commit após a formatação do PC)
const pixSection = document.getElementById("pix-section");
const cardSection = document.getElementById("card-section");

let cart = [];

<<<<<<< HEAD
=======
// Adicionar este código no início do arquivo
document.addEventListener("DOMContentLoaded", function () {
  // Limpa o carrinho ao carregar a página
  localStorage.removeItem("cart-items");

  // Atualiza o contador do carrinho para zero
  updateCartCount();
});

>>>>>>> f6a243e (Primeiro commit após a formatação do PC)
// ABRIR O MODAL CARRINHO
cartBtn.addEventListener("click", () => {
  updateCartModal();
  cartModal.style.display = "flex";
});

// FECHAR MODAL CARRINHO
cartModal.addEventListener("click", (event) => {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});
closeModalBtn.addEventListener("click", () => {
  cartModal.style.display = "none";
});

// ADICIONAR ITENS AO CARRINHO
menu.addEventListener("click", (event) => {
  let parentButton = event.target.closest(".add-to-cart-btn");
  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));
    addToCart(name, price);
  }
});

// FUNÇÃO PARA ADICIONAR NO CARRINHO
function addToCart(name, price) {
<<<<<<< HEAD
  const existingItem = cart.find((item) => item.name === name);
  if (existingItem) {
    existingItem.quantidade += 1;
  } else {
    cart.push({ name, price, quantidade: 1 });
  }
  updateCartModal();
=======
  const cartItems = JSON.parse(localStorage.getItem("cart-items")) || [];

  const existingItem = cartItems.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({
      name,
      price: parseFloat(price),
      quantity: 1,
    });
  }

  localStorage.setItem("cart-items", JSON.stringify(cartItems));
  updateCartModal();

  // Atualiza o QR code se o PIX estiver selecionado
  const selectedPayment = document.querySelector(
    'input[name="payment-method"]:checked'
  );
  if (selectedPayment && selectedPayment.value === "Pix") {
    updatePixQRCode();
  }

  // Mostra notificação de sucesso
  Toastify({
    text: "Item adicionado ao carrinho!",
    duration: 3000,
    gravity: "top",
    position: "right",
    backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
  }).showToast();
>>>>>>> f6a243e (Primeiro commit após a formatação do PC)
}

// ATUALIZA O CARRINHO
function updateCartModal() {
<<<<<<< HEAD
  cartItensContainer.innerHTML = "";
  let total = 0;
  cart.forEach((item) => {
    const cartElement = document.createElement("div");
    cartElement.classList.add("flex", "justify-between", "mb-4", "flex-col");
    cartElement.innerHTML = `
      <div class="flex-col items-center justify-between">
        <div>
          <h2 class=" p-1 rounded text-center w-1/6 bg-yellow-400 font-bold">${item.name}</h2>
          <p class=" font-bold mt-2">R$ ${item.price.toFixed(2)}</p>
          <p class="font-bold text-red-600">Quantidade: ${item.quantidade}</p>
        </div>
        <div>
          <button class="remove-from-cart-btn" data-name="${item.name}">Remover</button>
        </div>
      </div>
    `;
    cartItensContainer.appendChild(cartElement);
    total += item.price * item.quantidade;
  });
  cartCounter.innerHTML = cart.length;
  cartTotal.innerHTML = total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
=======
  const cartItems = JSON.parse(localStorage.getItem("cart-items")) || [];
  const cartItemsContainer = document.getElementById("cart-items");
  const cartCountSpan = document.getElementById("cart-count");
  const cartTotalSpan = document.getElementById("cart-total");

  // Atualiza o contador do carrinho
  cartCountSpan.textContent = cartItems.length;

  // Limpa o container de itens
  cartItemsContainer.innerHTML = "";

  // Adiciona os itens ao modal
  cartItems.forEach((item, index) => {
    const itemElement = document.createElement("div");
    itemElement.className = "flex items-center justify-between p-2 border-b";
    itemElement.innerHTML = `
        <div>
        <p class="font-bold">${item.name}</p>
        <p>R$ ${item.price.toFixed(2)} x ${item.quantity}</p>
        </div>
      <div class="flex items-center gap-2">
        <button class="quantity-btn" data-action="decrease" data-index="${index}">-</button>
        <span>${item.quantity}</span>
        <button class="quantity-btn" data-action="increase" data-index="${index}">+</button>
        <button class="remove-item-btn" data-index="${index}">🗑️</button>
      </div>
    `;
    cartItemsContainer.appendChild(itemElement);
  });

  // Calcula e atualiza o total
  const total = calculateTotal();
  cartTotalSpan.textContent = `R$ ${total.toFixed(2)}`;

  // Atualiza o QR code se o PIX estiver selecionado
  const selectedPayment = document.querySelector(
    'input[name="payment-method"]:checked'
  );
  if (selectedPayment && selectedPayment.value === "Pix") {
    updatePixQRCode();
  }
>>>>>>> f6a243e (Primeiro commit após a formatação do PC)
}

// REMOVER ITEM DO CARRINHO
cartItensContainer.addEventListener("click", (event) => {
<<<<<<< HEAD
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name");
    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);
  if (index !== -1) {
    const item = cart[index];
    if (item.quantidade > 1) {
      item.quantidade -= 1;
    } else {
      cart.splice(index, 1);
    }
=======
  if (event.target.classList.contains("remove-item-btn")) {
    const index = parseInt(event.target.dataset.index);
    removeItemCart(index);
  }
});

function removeItemCart(index) {
  const cartItems = JSON.parse(localStorage.getItem("cart-items")) || [];
  if (index >= 0 && index < cartItems.length) {
    const item = cartItems[index];
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cartItems.splice(index, 1);
    }
    localStorage.setItem("cart-items", JSON.stringify(cartItems));
>>>>>>> f6a243e (Primeiro commit após a formatação do PC)
    updateCartModal();
  }
}

// ENDEREÇO DIGITADO
addressInput.addEventListener("input", () => {
  if (addressInput.value !== "") {
    addressWarn.classList.add("hidden");
    addressInput.classList.remove("border-red-500");
  }
});

// FINALIZAR CARRINHO
checkoutBtn.addEventListener("click", () => {
  const isOpen = checkRestauranteOpen();
  if (!isOpen) {
<<<<<<< HEAD
    showToast("Ops! A hamburgueria está fechada!", "linear-gradient(to right, #ff5f6d, #ffc371)");
=======
    showToast(
      "Ops! A hamburgueria está fechada!",
      "linear-gradient(to right, #ff5f6d, #ffc371)"
    );
>>>>>>> f6a243e (Primeiro commit após a formatação do PC)
    return;
  }

  if (cart.length === 0) return;

  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }

<<<<<<< HEAD
  const cartItems = cart.map((item) => `${item.name} Quantidade: ${item.quantidade} Preço: R$ ${item.price}`).join(" | ");
  const message = encodeURIComponent(cartItems);
  const phone = "5543996114268";
  window.open(`https://wa.me/${phone}?text=${message} ENDEREÇO: Rua: ${addressInput.value} Bairro: ${bairro.value} Complemento: ${complemento.value}`, "_blank");
=======
  const cartItems = cart
    .map(
      (item) =>
        `${item.name} Quantidade: ${item.quantidade} Preço: R$ ${item.price}`
    )
    .join(" | ");
  const message = encodeURIComponent(cartItems);
  const phone = "5543996114268";
  window.open(
    `https://wa.me/${phone}?text=${message} ENDEREÇO: Rua: ${addressInput.value} Bairro: ${bairro.value} Complemento: ${complemento.value}`,
    "_blank"
  );
>>>>>>> f6a243e (Primeiro commit após a formatação do PC)
  cart.length = 0;
  updateCartModal();
});

// VERIFICA HORÁRIO DE FUNCIONAMENTO
function checkRestauranteOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 11 && hora < 23;
}

// NOTIFICAR SOBRE HORÁRIO DE FUNCIONAMENTO
const spanItem = document.getElementById("date-span");
const isOpen = checkRestauranteOpen();
if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-500");
} else {
  spanItem.classList.remove("bg-green-500");
  spanItem.classList.add("bg-red-500");
}

// FORMAS DE PAGAMENTO
paymentOptions.forEach((option) => {
  option.addEventListener("change", () => {
    if (option.value === "Pix") {
      pixSection.classList.remove("hidden");
      cardSection.classList.add("hidden");
    } else if (option.value === "Cartão") {
      pixSection.classList.add("hidden");
      cardSection.classList.remove("hidden");
    }
  });
});

// MOSTRAR TOAST NOTIFICATION
function showToast(message, backgroundColor) {
  Toastify({
    text: message,
    duration: 3000,
    gravity: "top",
    position: "right",
    style: {
      background: backgroundColor,
    },
  }).showToast();
}

<<<<<<< HEAD
// GERA QR CODE PIX
async function generatePixQRCode() {
  // Dados do cliente, itens e envio
  const bodyData = {
    reference_id: "ex-00001",
    customer: { name: "Jose da Silva", email: "email@test.com", tax_id: "12345678909" },
    items: [{ name: "item.name", quantity: 1, unit_amount: 500 }],
    shipping: {
      address: {
        street: "Avenida Brigadeiro Faria Lima",
        number: "1384",
        complement: "apto 12",
        locality: "Pinheiros",
        city: "São Paulo",
        region_code: "SP",
        country: "BRA",
        postal_code: "01452002",
      },
    },
    notification_urls: ["https://meusite.com/notificacoes"],
  };

  try {
    const response = await fetch("https://sandbox.api.pagseguro.com/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer YOUR_ACCESS_TOKEN",
      },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error generating Pix QR Code:", errorData);
      return;
    }

    const data = await response.json();
    const qrCodeUrl = data.qr_codes[0].links[0].href;
    document.getElementById("pix-qr-code").innerHTML = `<img src="${qrCodeUrl}" alt="QR Code Pix">`;
  } catch (error) {
    console.error("Error:", error);
  }
}

// GERA QR CODE PIX AUTOMATICAMENTE
generatePixQRCode();
=======
// Função para calcular o total atual do carrinho
function calculateTotal() {
  const cartItems = JSON.parse(localStorage.getItem("cart-items")) || [];
  return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
}

// Função para atualizar o QR Code com o valor correto
function updatePixQRCode() {
  const qrcodeContainer = document.getElementById("pix-qr-code");
  if (!qrcodeContainer) return;

  // Pega o valor total atual do carrinho
  const currentTotal = calculateTotal();

  // Formata o valor para o padrão PIX (2 casas decimais, sem ponto)
  const formattedValue = currentTotal.toFixed(2).replace(".", "");

  // Cria o QR code
  const qr = qrcode(0, "L");

  // Monta o payload PIX com o valor dinâmico
  const pixData = {
    pixKey: "space.burguer@email.com.br", // Substitua pela sua chave PIX
    merchantName: "Space Burguer",
    merchantCity: "Jacarezinho",
    txid: "***",
  };

  // Monta a string do PIX incluindo o valor formatado
  const payload = `00020126580014BR.GOV.BCB.PIX0136${pixData.pixKey}5204000053039865802BR5915${pixData.merchantName}6008${pixData.merchantCity}62070503${pixData.txid}5303986${formattedValue}6304`;

  try {
    qr.addData(payload);
    qr.make();

    // Aumentei ainda mais o tamanho do QR code e melhorei o espaçamento
    const qrImage = qr.createImgTag(12);

    qrcodeContainer.innerHTML = `
        <div class="flex flex-col items-center">
            <div class="bg-white p-8 rounded-lg shadow-lg mb-4">
                ${qrImage}
            </div>
            <p class="text-xl font-bold mb-2" id="pix-amount">Valor a pagar: R$ ${currentTotal.toFixed(
              2
            )}</p>
            <p class="text-gray-600 text-center">Escaneie o QR Code para pagar</p>
            <p class="text-gray-500 text-sm text-center mt-1">O código será atualizado conforme você adiciona ou remove itens</p>
        </div>
    `;
  } catch (err) {
    qrcodeContainer.innerHTML =
      '<p class="text-red-500">Erro ao gerar QR Code</p>';
    console.error("Erro ao gerar QR Code:", err);
  }
}

// Função para mostrar/esconder seções de pagamento
function togglePaymentSections() {
  const pixSection = document.getElementById("pix-section");
  const cardSection = document.getElementById("card-section");
  const selectedPayment = document.querySelector(
    'input[name="payment-method"]:checked'
  );

  if (selectedPayment) {
    if (selectedPayment.value === "Pix") {
      pixSection.classList.remove("hidden");
      cardSection.classList.add("hidden");
      const total = calculateTotal();
      generatePixQRCode(total);
    } else {
      pixSection.classList.add("hidden");
      cardSection.classList.remove("hidden");
    }
  }
}

// Função para gerar QR Code do PIX
function generatePixQRCode(total) {
  const qrcodeContainer = document.getElementById("pix-qr-code");
  qrcodeContainer.innerHTML = ""; // Limpa o conteúdo anterior

  // Cria o QR code
  const qr = qrcode(0, "L");
  // Substitua esta string pelo seu código PIX real
  const pixData = `00020126580014BR.GOV.BCB.PIX0136space.burguer@email.com.br52040000530398654040.005802BR5915Space Burguer6008Jacarezi62070503***6304`;

  try {
    qr.addData(pixData);
    qr.make();

    // Cria a imagem do QR code com tamanho maior
    const qrImage = qr.createImgTag(8); // Aumentei o tamanho do QR code

    // Adiciona o QR code e o valor em um container centralizado
    qrcodeContainer.innerHTML = `
            <div class="flex flex-col items-center">
                ${qrImage}
                <p class="mt-4 font-bold text-lg">Valor a pagar: R$ ${total.toFixed(
                  2
                )}</p>
                <p class="mt-2 text-sm text-gray-600">Escaneie o QR Code acima para pagar</p>
            </div>
        `;
  } catch (err) {
    qrcodeContainer.innerHTML =
      '<p class="text-red-500">Erro ao gerar QR Code</p>';
    console.error("Erro ao gerar QR Code:", err);
  }
}

// Event listeners para os botões de quantidade
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("quantity-btn")) {
    const index = parseInt(e.target.dataset.index);
    const action = e.target.dataset.action;
    const cartItems = JSON.parse(localStorage.getItem("cart-items")) || [];

    if (cartItems[index]) {
      if (action === "increase") {
        cartItems[index].quantity += 1;
      } else if (action === "decrease" && cartItems[index].quantity > 1) {
        cartItems[index].quantity -= 1;
      }

      localStorage.setItem("cart-items", JSON.stringify(cartItems));
      updateCartModal();
    }
  }
});

// Adicione os event listeners quando o documento carregar
document.addEventListener("DOMContentLoaded", () => {
  // Event listeners para os radio buttons de método de pagamento
  const paymentMethodInputs = document.querySelectorAll(
    'input[name="payment-method"]'
  );
  paymentMethodInputs.forEach((input) => {
    input.addEventListener("change", togglePaymentSections);
  });

  // Esconde ambas as seções de pagamento inicialmente
  const pixSection = document.getElementById("pix-section");
  const cardSection = document.getElementById("card-section");
  pixSection.classList.add("hidden");
  cardSection.classList.add("hidden");

  // ... outros event listeners existentes ...
});

// Modifique a função de checkout existente
async function checkout() {
  const address = document.getElementById("adress").value;
  const bairro = document.getElementById("bairro").value;
  const complemento = document.getElementById("complemento").value;
  const selectedPayment = document.querySelector(
    'input[name="payment-method"]:checked'
  );

  if (!address || !bairro || !complemento) {
    document.getElementById("adress-warn").classList.remove("hidden");
    return;
  }

  if (!selectedPayment) {
    document.getElementById("payment-warn").classList.remove("hidden");
    return;
  }

  const cartItems = JSON.parse(localStorage.getItem("cart-items")) || [];
  const total = calculateTotal();

  // Monta a mensagem para o WhatsApp
  const items = cartItems
    .map((item) => `${item.quantity}x ${item.name}`)
    .join("\n");
  const paymentMethod = selectedPayment.value;
  const paymentStatus =
    paymentMethod === "Pix"
      ? "Pagamento via PIX efetuado"
      : "Pagamento será feito na entrega via cartão";

  const message =
    `🍔 *Novo Pedido Space Burguer* 🍔\n\n` +
    `*Itens do Pedido:*\n${items}\n\n` +
    `*Endereço de Entrega:*\n${address}, ${bairro}\n${complemento}\n\n` +
    `*Total do Pedido:* R$ ${total.toFixed(2)}\n` +
    `*Forma de Pagamento:* ${paymentMethod}\n` +
    `*Status do Pagamento:* ${paymentStatus}`;

  // Número do WhatsApp da loja (substitua pelo número correto)
  const phoneNumber = "5543991234567";

  // Codifica a mensagem para URL
  const encodedMessage = encodeURIComponent(message);

  // Abre o WhatsApp com a mensagem
  window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");

  // Limpa o carrinho
  localStorage.removeItem("cart-items");
  updateCartModal();
  closeModal();
}
>>>>>>> f6a243e (Primeiro commit após a formatação do PC)

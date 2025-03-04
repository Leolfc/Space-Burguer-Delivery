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
const paymentOptions = document.querySelectorAll(
  'input[name="payment-method"]'
);
const pixSection = document.getElementById("pix-section");
const cardSection = document.getElementById("card-section");
const pixQrCode = document.getElementById("pix-qr-code");
const confirmPixPaymentBtn = document.getElementById("confirm-pix-payment");

let cart = [];
let pixPaid = false;

// ABRIR O MODAL CARRINHO
cartBtn.addEventListener("click", () => {
  updateCartModal();
  cartModal.style.display = "flex";
  // Reset payment status when opening modal
  pixPaid = false;
  // Hide payment sections initially
  pixSection.classList.add("hidden");
  cardSection.classList.add("hidden");
  // Uncheck payment options
  paymentOptions.forEach((option) => (option.checked = false));
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
  const existingItem = cart.find((item) => item.name === name);
  if (existingItem) {
    existingItem.quantidade += 1;
  } else {
    cart.push({ name, price, quantidade: 1 });
  }
  updateCartModal();

  // Mostra notificação de sucesso
  Toastify({
    text: "Item adicionado ao carrinho!",
    duration: 3000,
    gravity: "top",
    position: "right",
    backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
  }).showToast();
}

// ATUALIZA O CARRINHO
function updateCartModal() {
  cartItensContainer.innerHTML = "";
  let total = 0;
  cart.forEach((item) => {
    const cartElement = document.createElement("div");
    cartElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col",
      "bg-gray-50",
      "p-4",
      "rounded-lg",
      "shadow-sm"
    );
    cartElement.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <div class="flex items-center justify-between mb-2">
            <h2 class="p-2 rounded text-center bg-yellow-400 font-bold w-[80%]">${
              item.name
            }</h2>
            <button class="delete-item-btn text-red-500 hover:text-red-700 transition-colors" data-name="${
              item.name
            }">
              <i class="fa fa-trash text-xl"></i>
            </button>
          </div>
          <p class="font-bold text-gray-700">R$ ${item.price.toFixed(2)}</p>
        </div>
        <div class="flex items-center gap-2 ml-4">
          <button class="decrease-quantity-btn bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors" data-name="${
            item.name
          }">-</button>
          <span class="font-bold text-lg w-8 text-center">${
            item.quantidade
          }</span>
          <button class="increase-quantity-btn bg-green-500 hover:bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors" data-name="${
            item.name
          }">+</button>
        </div>
      </div>
    `;
    cartItensContainer.appendChild(cartElement);
    total += item.price * item.quantidade;
  });
  cartCounter.innerHTML = cart.length;
  cartTotal.innerHTML = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  // Reset payment status when cart is updated
  pixPaid = false;
}

// ATUALIZAR QUANTIDADE E REMOVER ITENS
cartItensContainer.addEventListener("click", (event) => {
  const name = event.target.closest("button")?.getAttribute("data-name");
  if (!name) return;

  if (event.target.closest(".decrease-quantity-btn")) {
    removeItemCart(name);
  } else if (event.target.closest(".increase-quantity-btn")) {
    const item = cart.find((item) => item.name === name);
    if (item) {
      item.quantidade += 1;
      updateCartModal();
    }
  } else if (event.target.closest(".delete-item-btn")) {
    const index = cart.findIndex((item) => item.name === name);
    if (index !== -1) {
      cart.splice(index, 1);
      updateCartModal();
      showToast(
        "Item removido do carrinho!",
        "linear-gradient(to right, #ff5f6d, #ffc371)"
      );
    }
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
    updateCartModal();
  }
}

// Gerar QR Code do PIX
function updatePixQRCode(total) {
  const pixKey = "+5543996114268"; // Sua chave PIX

  try {
    // Limpa o QR code anterior
    const pixQrCodeContainer = document.getElementById("pix-qr-code");
    pixQrCodeContainer.innerHTML = "";

    // Cria o texto do PIX com as informações essenciais
    const pixText = `PIX para: Space Burguer\nChave: ${pixKey}\nValor: R$ ${total.toFixed(
      2
    )}`;

    // Cria um novo QR Code
    new QRCode(pixQrCodeContainer, {
      text: pixText,
      width: 256,
      height: 256,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });

    // Atualiza o texto do valor
    const pixTotal = document.getElementById("pix-total");
    pixTotal.textContent = `Valor a pagar: ${total.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}`;

    // Adiciona informações adicionais
    const pixInfo = document.createElement("div");
    pixInfo.className = "mt-4 text-center";
    pixInfo.innerHTML = `
      <p class="font-bold mb-2">Chave PIX (Telefone):</p>
      <p class="text-lg select-all">${pixKey}</p>
    `;
    pixQrCodeContainer.appendChild(pixInfo);

    // Mostra mensagem de sucesso
    showToast(
      "QR Code PIX gerado! Escaneie para pagar.",
      "linear-gradient(to right, #00b09b, #96c93d)"
    );
  } catch (error) {
    console.error("Erro ao gerar QR Code:", error);
    showToast(
      "Erro ao gerar QR Code. Tente novamente.",
      "linear-gradient(to right, #ff5f6d, #ffc371)"
    );
  }
}

// Confirmar pagamento PIX
confirmPixPaymentBtn.addEventListener("click", () => {
  pixPaid = true;
  showToast(
    "Pagamento PIX confirmado!",
    "linear-gradient(to right, #00b09b, #96c93d)"
  );
  confirmPixPaymentBtn.disabled = true;
  confirmPixPaymentBtn.classList.add("opacity-50", "cursor-not-allowed");
});

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
    showToast(
      "Ops! A hamburgueria está fechada!",
      "linear-gradient(to right, #ff5f6d, #ffc371)"
    );
    return;
  }

  if (cart.length === 0) return;

  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }

  const paymentMethod = document.querySelector(
    'input[name="payment-method"]:checked'
  );

  if (!paymentMethod) {
    showToast(
      "Por favor, selecione uma forma de pagamento!",
      "linear-gradient(to right, #ff5f6d, #ffc371)"
    );
    return;
  }

  if (paymentMethod.value === "Pix" && !pixPaid) {
    showToast(
      "Por favor, confirme o pagamento PIX antes de finalizar!",
      "linear-gradient(to right, #ff5f6d, #ffc371)"
    );
    return;
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantidade,
    0
  );
  const paymentStatus =
    paymentMethod.value === "Pix"
      ? "✅ Pago via PIX"
      : "🕒 Pagamento na entrega via Cartão";

  const message = `🍔 *NOVO PEDIDO SPACE BURGUER* 🍔\n\n${cart
    .map(
      (item) =>
        `• ${item.name} (${item.quantidade}x) - R$ ${item.price.toFixed(2)}`
    )
    .join("\n")}\n\n💰 *Total: R$ ${total.toFixed(
    2
  )}*\n\n💳 *Pagamento:* ${paymentStatus}\n\n📍 *Endereço de entrega:*\nRua: ${
    addressInput.value
  }\nBairro: ${bairro.value}\nComplemento: ${complemento.value}`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappLink = `https://wa.me/5543996915903?text=${encodedMessage}`;
  window.open(whatsappLink, "_blank");

  // Limpa o carrinho após finalizar o pedido
  cart = [];
  updateCartModal();
  cartModal.style.display = "none";
});

// Verifica se o restaurante está aberto
function checkRestauranteOpen() {
  const date = new Date();
  const hora = date.getHours();
  return hora >= 19 && hora < 23;
}

// Função para mostrar toast
function showToast(message, backgroundColor) {
  Toastify({
    text: message,
    duration: 3000,
    gravity: "top",
    position: "right",
    backgroundColor,
  }).showToast();
}

// Eventos para alternar entre PIX e Cartão
paymentOptions.forEach((option) => {
  option.addEventListener("change", () => {
    // Reset payment status when changing payment method
    pixPaid = false;
    confirmPixPaymentBtn.disabled = false;
    confirmPixPaymentBtn.classList.remove("opacity-50", "cursor-not-allowed");

    if (option.value === "Pix") {
      pixSection.classList.remove("hidden");
      cardSection.classList.add("hidden");

      // Calcula o total atual
      const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantidade,
        0
      );

      // Pequeno delay para garantir que a seção PIX esteja visível
      setTimeout(() => {
        updatePixQRCode(total);
      }, 100);
    } else {
      pixSection.classList.add("hidden");
      cardSection.classList.remove("hidden");
    }
  });
});

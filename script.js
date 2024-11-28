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
const paymentOptions = document.querySelectorAll('input[name="payment-method"]');
const pixSection = document.getElementById("pix-section");
const cardSection = document.getElementById("card-section");

let cart = [];

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
  const existingItem = cart.find((item) => item.name === name);
  if (existingItem) {
    existingItem.quantidade += 1;
  } else {
    cart.push({ name, price, quantidade: 1 });
  }
  updateCartModal();
}

// ATUALIZA O CARRINHO
function updateCartModal() {
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
}

// REMOVER ITEM DO CARRINHO
cartItensContainer.addEventListener("click", (event) => {
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
    showToast("Ops! A hamburgueria está fechada!", "linear-gradient(to right, #ff5f6d, #ffc371)");
    return;
  }

  if (cart.length === 0) return;

  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }

  const cartItems = cart.map((item) => `${item.name} Quantidade: ${item.quantidade} Preço: R$ ${item.price}`).join(" | ");
  const message = encodeURIComponent(cartItems);
  const phone = "5543996114268";
  window.open(`https://wa.me/${phone}?text=${message} ENDEREÇO: Rua: ${addressInput.value} Bairro: ${bairro.value} Complemento: ${complemento.value}`, "_blank");
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

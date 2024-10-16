const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItensContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("adress");
const addressWarn = document.getElementById("adress-warn");
const paymentOptions = document.querySelectorAll('input[name="payment-method"]');
const pixSection = document.getElementById('pix-section');
const cardSection = document.getElementById('card-section');



let cart = [];
//ABRIR O MODAL CARRINHO
cartBtn.addEventListener("click", function () {
  updateCartModal();
  cartModal.style.display = "flex";
});

//FECHAR CARDE MODAL CARRINHO
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});
closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

menu.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-cart-btn");
  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));
    addToCart(name, price);
    //ADICIONAR NO CARRINHO
  }
});
//FUNÇÃO PARA ADICIONAR NO CARRINHO///

function addToCart(name, price) {
  const existeItem = cart.find((item) => item.name === name);
  if (existeItem) {
    existeItem.quantidade += 1;
  } else {
    cart.push({
      name,
      price,
      quantidade: 1,
    });
  }

  updateCartModal();
}

//ATUALIZA CARRINHO

function updateCartModal() {
  cartItensContainer.innerHTML = "";
  let total = 0;
  cart.forEach((item) => {
    const cartElement = document.createElement("div");
    cartElement.classList.add("flex", "justify-between", "mb-4", "flex-col");
    cartElement.innerHTML = `
        <div class="flex-col items-center justify-between >
        <div>
        <h2 class="text-red-600">${item.name}</h2>
        <p class="mt-2">R$ ${item.price.toFixed(2)}</p>
        <p class="font-bold text-red-600">Quantidade: ${item.quantidade}</p>
        </div>
        <div>
        
        <button class= "remove-from-cart-btn" data-name="${
          item.name
        }">Remover</button>
        </div>
        </div>
        `;
    cartItensContainer.appendChild(cartElement);
    total += item.price * item.quantidade;

    cartCounter.innerHTML = cart.length;
  });
  cartTotal.innerHTML = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

//FUNÇÃO PARA REMOVER ITEM DO CARRINHO//

cartItensContainer.addEventListener("click", function (event) {
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
      updateCartModal();
      return;
    }
    cart.splice(index, 1);
    updateCartModal();
  }
}
//ENDEREÇO DIGITADO
addressInput.addEventListener("input", function (event) {
let inputValue = event.target.value;
  if (inputValue !== "") {
    addressWarn.classList.add("hidden")
    addressInput.classList.remove('border-red-500')
  }
})

//FINALIZR CARRINHO///
checkoutBtn.addEventListener('click', function(){

const isOpen = checkRestauranteOpen()
if(!isOpen){
  Toastify({
    text: "Ops! A hamburgueria esta fechada!",
    duration: 3000,
    destination: "https://github.com/apvarun/toastify-js",
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
    
  }).showToast();

  return;
}

  if(cart.length===0) return;
  if(addressInput.value ===""){
    addressWarn.classList.remove("hidden")
    addressInput.classList.add('border-red-500')
    return;
  }
//ENVIAR API PARA WHATSAPP//
const cartItens = cart.map((item)=>{
  return(
    `${item.name} Quantidade: ${item.quantidade} Preço: R$ ${item.price} |   `
  )
}).join("")
const message = encodeURIComponent(cartItens)
const phone = "5543996114268"

window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}, Obrigado pela prefência!`,'_blank')
cart.length=0
updateCartModal
})

//verificaçao de  checkrestaurante HORÁRIO//

function checkRestauranteOpen(){
  const data  =new Date();
  const hora = data.getHours();
  return hora >=19  && hora < 23; 

}
const spanItem=document.getElementById('date-span')
const isOpen = checkRestauranteOpen()

if(isOpen){
  spanItem.classList.remove('bg-red-500')
  spanItem.classList.add('bg-green-500')
}else{
  spanItem.classList.remove('bg-green-500')
  spanItem.classList.add('bg-red-500')
}

//FORMAS DE PAGAME


paymentOptions.forEach((option) => {
  option.addEventListener('change', function () {
    if (this.value === 'Pix') {
      pixSection.classList.remove('hidden');
      cardSection.classList.add('hidden');
    } else if (this.value === 'Cartão') {
      pixSection.classList.add('hidden');
      cardSection.classList.remove('hidden');
    }
  });
});

async function generatePixQRCode(amount) {
  // Exemplo de API para gerar QR Code Pix
  const response = await fetch('https://api.example.com/generate-pix', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount }),
  });
  const data = await response.json();
  const qrCodeUrl = data.qr_code_url;

  const qrCodeContainer = document.getElementById('pix-qr-code');
  qrCodeContainer.innerHTML = `<img src="${qrCodeUrl}" alt="QR Code Pix">`;
}


document.getElementById('card-form').addEventListener('submit', async function (event) {
  event.preventDefault();

  const cardNumber = document.getElementById('card-number').value;
  const cardExpiry = document.getElementById('card-expiry').value;
  const cardCvc = document.getElementById('card-cvc').value;

  // Aqui você deve chamar uma API de pagamento com cartão
  // Este é um exemplo hipotético
  const response = await fetch('https://api.example.com/process-card-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cardNumber,
      cardExpiry,
      cardCvc,
    }),
  });

  const result = await response.json();
  if (result.success) {
    alert('Pagamento realizado com sucesso!');
    // Limpar o carrinho ou redirecionar o usuário
  } else {
    alert('Erro ao processar pagamento. Tente novamente.');
  }
});



checkoutBtn.addEventListener('click', function() {
  const isOpen = checkRestauranteOpen();
  if (!isOpen) {
    Toastify({
      text: "Ops! A hamburgueria está fechada!",
      duration: 3000,
      gravity: "top",
      position: "right",
      style: {
        background: "linear-gradient(to right, #ff5f6d, #ffc371)",
      },
    }).showToast();
    return;
  }

  if (cart.length === 0) return;

  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add('border-red-500');
    return;
  }

  const paymentMethod = getSelectedPaymentMethod();
  if (!paymentMethod) {
    paymentWarn.classList.remove("hidden");
    return;
  }

  if (paymentMethod === 'Pix') {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantidade), 0);
    generatePixQRCode(total);
  } else if (paymentMethod === 'Cartão') {
    // Exibir formulário de pagamento com cartão
    cardSection.classList.remove('hidden');
  }
});

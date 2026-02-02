
import * as productServices from '../services/product_services.js';
import { getCurrentUser } from '../services/auth_services.js';
import { massage } from '../Utilites/helpers.js';
const currentUser = getCurrentUser();
let cart = [];
if (currentUser) {
    cart = await productServices.getCart(currentUser.email)
} else {
    cart = await productServices.getCart('guest')
}

let currentDiscount = 0;

export function displayCartItems() {
    const container = document.getElementById('cartItems');
    const emptyMsg = document.getElementById('emptyCart');

    if (!container) return;

    container.innerHTML = '';

    if (cart.length === 0) {
        if (emptyMsg) emptyMsg.classList.remove('hidden');
        updateSummary();
        return;
    }

    if (emptyMsg) emptyMsg.classList.add('hidden');

    cart.forEach(item => {
        container.innerHTML += `
            <div class="flex border rounded-lg p-4 mb-4 bg-(--sec-bg)  shadow-md shadow-cyan-100 transition-colors duration-300">
                <img src="${item.mainImage || ''}" class="w-24 h-24 object-cover rounded" alt="${item.name || 'Product'}">
                <div class="ml-4 grow">
                    <h3 class="font-bold text-(--onbg) ">${item.name || 'Unnamed Product'}</h3>
                    <p class="text-base text-gray-500 ">Size: ${item.size || 'N/A'} | Color: ${item.color || 'N/A'}</p>
                    <p class="font-bold mt-2 text-(--onbg)">$${item.price || 0}</p>
                </div>
                <div class="flex flex-col items-end justify-between">
                    <button onclick="removeItem('${item.productId}')" class="text-red-500 hover:scale-110 transition">
                        <i class="fa-solid fa-trash-can"></i>  <!-- لو أضفت Font Awesome -->
                        <!-- أو استخدم: <i class='bx bx-trash'></i> لو Boxicons -->
                    </button>
                    <div class="flex items-center mt-4 text-black border rounded-full px-2 py-1 bg-gray-50  transition-colors duration-300">
                        <button class="px-2 font-bold text-black " onclick="updateQuantity('${item.productId}', -1)">-</button>
                        <span class="px-4 font-medium text-black ">${item.qty || 1}</span>
                        <button class="px-2 font-bold text-black " onclick="updateQuantity('${item.productId}', 1)">+</button>
                    </div>
                </div>
            </div>
        `;
    });

    updateSummary();
}

function updateSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
    const delivery = subtotal > 0 ? 10 : 0;
    const discountAmount = subtotal * currentDiscount;
    const total = subtotal - discountAmount + delivery;

    const elements = {
        subtotal: document.getElementById('subtotal'),
        discount: document.getElementById('discount'),
        delivery: document.getElementById('delivery'),
        total: document.getElementById('total')
    };

    if (elements.subtotal) elements.subtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (elements.discount) elements.discount.textContent = `-$${discountAmount.toFixed(2)}`;
    if (elements.delivery) elements.delivery.textContent = `$${delivery.toFixed(2)}`;
    if (elements.total) elements.total.textContent = `$${total.toFixed(2)}`;


}

window.removeItem = function (productId) {
    cart = cart.filter(item => item.productId != productId);
    if (currentUser) {
        productServices.updateCart(currentUser.email, cart)
    } else {
        productServices.updateCart('guest', cart)
    }
    displayCartItems();
};

window.updateQuantity = function (productId, change) {
    const item = cart.find(item => item.productId == productId);
    if (item) {
        item.qty = (item.qty || 1) + change;
        if (item.qty < 1) item.qty = 1;
    }
    if (currentUser) {
        productServices.updateCart(currentUser.email, cart)
    } else {
        productServices.updateCart('guest', cart)
    }
    displayCartItems();
};

document.getElementById('applyPromo')?.addEventListener('click', () => {
    const code = document.getElementById('promoCode')?.value;

    if (code === "ITI2026") {
        currentDiscount = 0.10;
        localStorage.setItem('appliedDiscount', JSON.stringify(currentDiscount));

        massage('Promo code applied! 10% off', 'success');
    } else if (code === "ITI.NET") {
        currentDiscount = 0.20;
        localStorage.setItem('appliedDiscount', JSON.stringify(currentDiscount));

        massage('Promo code applied! 20% off', 'success');
    }
    
    else {
        currentDiscount = 0;
        massage('Invalid promo code', 'error');

    }
    updateSummary();
});

document.getElementById("checkoutBtn").addEventListener("click", async () => {
    if (!currentUser) {
        massage('Please login first', 'error');
        window.location.hash = "#login"; // بدل href
        return;
    }

    if (cart.length === 0) {
        massage('Your cart is empty', 'error');
        return;
    }

    window.location.hash = "#checkout";
});


displayCartItems();
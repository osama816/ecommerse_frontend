import { getAllProducts, getAllReviews } from "../services/product_services.js";

// Fade In Fade Out Slider
let images = document.querySelectorAll(".slider img");
let currentIndex = 0;
function nextImage() {
  images[currentIndex].classList.replace("opacity-100", "opacity-0");
  currentIndex = (currentIndex + 1) % images.length;
  images[currentIndex].classList.replace("opacity-0", "opacity-100");
}
setInterval(nextImage, 1500);

const container = document.getElementById("newsTicker");
const wrapper = document.getElementById("tickerWrapper");

// 1. Prepare for infinite loop by cloning items
// We clone the entire set of items to ensure seamless transition
const originalItems = Array.from(wrapper.children);
originalItems.forEach((item) => {
  const clone = item.cloneNode(true);
  wrapper.appendChild(clone);
});

// 2. Animation Variables
let scrollPos = 0;
let isPaused = false;
const speed = 0.8;
/*
 * Main animation loop
 */
function step() {
  if (!isPaused) {
    scrollPos -= speed;

    // Reset when the first half (original set) has completely scrolled out
    const resetPoint = wrapper.scrollWidth / 2;

    if (Math.abs(scrollPos) >= resetPoint) {
      scrollPos = 0;
    }

    wrapper.style.transform = `translateX(${scrollPos}px)`;
  }
  requestAnimationFrame(step);
}

// 3. Interaction Listeners
// Pause on hover for better readability
container.addEventListener("mouseenter", () => (isPaused = true));
container.addEventListener("mouseleave", () => (isPaused = false));

// Mobile touch support
container.addEventListener("touchstart", () => (isPaused = true), {
  passive: true,
});
container.addEventListener("touchend", () => (isPaused = false), {
  passive: true,
});

// 4. Start Animation
requestAnimationFrame(step);

// New Arrival
let productsContainer = document.querySelector("#new-arrivals");
let allProducts = await getAllProducts();

let newArrival = allProducts.filter((e) => e.stock >= 40);

newArrival.slice(0, 5).map((product) => {
  let p = `
  <div class="product-link group shrink-0 mb-4 rounded-2xl border border-(--border) overflow-hidden" key=${product.id}> 
    <a href="#product?id=${product.id}">
      <div class="overflow-hidden h-60">
        <img class="h-full w-full mb-2 group-hover:scale-110 transition duration-500" src="../../${product.mainImage}" alt="${product.name}"/>
      </div>
      <div class="p-3">
        <h3 class="w-40 h-9 mb-3 font-semibold text-sm truncate">${product.name}</h3>
        <div class="flex items-center gap-2 mb-3">
          <div class="rating" style="--rating: ${product.rating}"></div>
          <span class="text-sm opacity-60">${product.rating} / 5</span>
        </div>
        <p class="flex items-center gap-2 mt-3 font-bold">$${product.discountPercentage > 0
      ? parseInt(product.price - (product.price * product.discountPercentage) / 100)
      : product.price
    } <span class="text-sm font-normal opacity-40 line-through">${product.discountPercentage > 0 ? "$" + product.price : ""
    }</span>
        ${product.discountPercentage > 0
      ? `<span class="inline-block bg-red-100 dark:bg-red-900/30 p-1 text-[10px] rounded text-red-600 dark:text-red-400 ml-auto"> -${product.discountPercentage}% </span>`
      : ""
    }</p>
      </div>
    </a>
  </div>`;
  productsContainer.innerHTML += p;
});

// Top Selling
let topProductsContainer = document.querySelector("#top");

let topSelling = allProducts.filter((e) => e.rating >= 4.7);

topSelling.slice(0, 5).map((product) => {
  let p = `
  <div class="product-link group shrink-0 mb-4 rounded-2xl border border-(--border) overflow-hidden" key=${product.id}> 
    <a href="#product?id=${product.id}">
      <div class="overflow-hidden h-60">
        <img class="h-full w-full mb-2 group-hover:scale-110 transition duration-500" src="../../${product.mainImage}" alt="${product.name}"/>
      </div>
      <div class="p-3">
        <h3 class="w-40 h-9 mb-3 font-semibold text-sm truncate">${product.name}</h3>
        <div class="flex items-center gap-2 mb-3">
          <div class="rating" style="--rating: ${product.rating}"></div>
          <span class="text-sm opacity-60">${product.rating} / 5</span>
        </div>
        <p class="flex items-center gap-2 mt-3 font-bold">$${product.discountPercentage > 0
      ? parseInt(product.price - (product.price * product.discountPercentage) / 100)
      : product.price
    } <span class="text-sm font-normal opacity-40 line-through">${product.discountPercentage > 0 ? "$" + product.price : ""
    }</span>
        ${product.discountPercentage > 0
      ? `<span class="inline-block bg-red-100 dark:bg-red-900/30 p-1 text-[10px] rounded text-red-600 dark:text-red-400 ml-auto"> -${product.discountPercentage}% </span>`
      : ""
    }</p>
      </div>
    </a>
  </div>`;
  topProductsContainer.innerHTML += p;
});

// Reviews
let revContainer = document.querySelector("#rev");
let reviews = await getAllReviews();

reviews.slice(0, 5).map((review) => {
  let p = `
  <div class="shrink-0 border border-(--border) rounded-3xl p-6 w-80 mb-5 bg-(--bg)" key=${review.id || review.createdAt}>
    <div class="flex justify-between items-start mb-3">
        <div class="text-yellow-400 text-sm">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</div>
    </div>
    <div class="flex items-center mb-2">
        <h4 class="font-bold text-base mr-2">${review.userName || review.name}</h4>
        <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
    </div>
    <p class="text-(--onbg) opacity-70 text-sm leading-relaxed truncate-2-lines italic">"${review.comment}"</p>
  </div>`;
  revContainer.innerHTML += p;
});

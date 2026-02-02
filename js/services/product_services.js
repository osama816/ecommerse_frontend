let cachedProducts = null;
let cachedCategories = null;

// get all products from json file [Used in main,home,products]
export async function getAllProducts() {
  //   if (window.location.hash.includes("products")) {
  //     const params = new URLSearchParams(
  //       window.location.hash.split("?")[1]
  //     );
  //     const query = params.get("query");
  //     if (query) {
  //       const products = await getAllProducts();
  //       return products.filter((product) => 
  //         product.name.toLowerCase().includes(query.toLowerCase())
  //       );
  //     }
  //   }
  //   else {

  // }

  if (cachedProducts) return cachedProducts;
  const response = await fetch(`./data/product.json`);
  cachedProducts = await response.json();
  return cachedProducts;
}

//get all categories from json [used in chatbot,products]
export async function getAllCategories() {
  if (cachedCategories) return cachedCategories;
  const response = await fetch("./data/categories.json");
  cachedCategories = await response.json();
  return cachedCategories;
}

// get product by id [Used in product details]
export async function getProductById(id) {
  const products = await getAllProducts();
  return products.find((product) => product.id == id);
}

// get products by categoryId [Used in chatbot,product details,product]
export async function getProductsByCategoryId(categoryId) {
  const products = await getAllProducts()
  const filteredProducts = products.filter(product => product.categoryId == categoryId)
  return filteredProducts;
}
//get category by name [Not used anywhere]
export async function getCategoryByName(categoryName) {
  const categories = await getAllCategories();
  return categories.find((category) => category.name == categoryName);
}

// get all reviews [Used in home]
export async function getAllReviews() {
  const products = await getAllProducts();
  let jsonReviews = [];
  products.forEach((product) => {
    if (product.reviews && Array.isArray(product.reviews)) {
      jsonReviews = jsonReviews.concat(product.reviews);
    }
  });

  const localReviews = JSON.parse(localStorage.getItem("reviews") || "[]");
  return [...jsonReviews, ...localReviews];
}

//get reviews (local storage & json file) for specific product  [Used in product details]
export async function getReviewsByProductId(productId) {
  const products = await getAllProducts();
  const product = products.find((p) => p.id == productId);
  const jsonReviews = product ? (product.reviews || []) : [];

  const localReviews = JSON.parse(localStorage.getItem("reviews") || "[]");
  const filteredLocalReviews = localReviews.filter((r) => r.productId == productId);

  return [...jsonReviews, ...filteredLocalReviews];
}

// get product by count [Not Used]
export async function getProductByCount(start, end) {
  const products = await getAllProducts();
  return products.slice(start, end);
}

//Used in product details
export async function countReviews(productId) {
  const reviews = await getReviewsByProductId(productId);
  return reviews.length;
}

// get discount [Not Used]
export async function getDiscount(productId) {
  const product = await getProductById(productId);
  return product ? product.discount : 0;
}
// Used in products
export async function getCategoryById(categoryId) {
  const categories = await getAllCategories();
  return categories.find((category) => category.id == categoryId);
}

// Calculate discounted price [Used in product details]
export function calculateDiscountedPrice(price, discountPercentage) {
  if (!discountPercentage) return price;
  return price - price * (discountPercentage / 100);
}

//get cart [Used in cart,checkout,product details]
export async function getCart(userEmail) {
  const cart = localStorage.getItem(userEmail);
  return cart ? JSON.parse(cart) : [];
}

//update cart [Used in cart, product details]
export async function updateCart(userEmail, cart) {
  localStorage.setItem(userEmail, JSON.stringify(cart));
}

//get product id from url [Used in product details]
export function getProductId() {
  const hash = (location.hash || "").split("?")[1];
  if (!hash) return null;
  return new URLSearchParams(hash).get("id");
}

//add review [Used in product details]
export function addReview(review) {
  let reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
  if (!Array.isArray(reviews)) {
    reviews = [];
  }
  reviews.push(review);
  localStorage.setItem("reviews", JSON.stringify(reviews));
}
// merge guest cart to user cart  ==> elsefy
// [Used in login]
export async function mergeGuestCartToUser(userEmail) {
  const guestCart = await getCart("guest");

  if (guestCart.length === 0) return;

  let userCart = await getCart(userEmail);

  guestCart.forEach((guestItem) => {
    const existingItem = userCart.find(
      (uItem) => uItem.productId === guestItem.productId
    );

    if (existingItem) {
      existingItem.qty = (existingItem.qty || 1) + (guestItem.qty || 1);
    } else {
      userCart.push(guestItem);
    }
  });

  await updateCart(userEmail, userCart);

  localStorage.removeItem("guest");
}

// Fetch all products [Not used]
export function renderProducts(products, container) {
  products.map((product) => {
    let p = `
  <div class="product-link group shrink-0 mb-4 rounded-2xl border border-(--border) overflow-hidden" key=${product.id
      } > 
  <div class="overflow-hidden h-60">
    <img class="h-full w-full mb-2 group-hover:scale-110 transition duration-500" src="../../${product.mainImage
      }" alt="${product.name}"/>
  </div>
  <div class="p-3">
    <h3 class="w-40 h-9 mb-3 font-semibold text-sm">${product.name}</h3>
    <div class="flex items-center gap-2 mb-3">
      <div class="rating" style="--rating: ${product.rating}"></div>
      <span id="ratingText" class="text-sm opacity-80">${product.rating} / 5</span>
    </div>
    <p class="flex items-center gap-2 mt-3 font-bold">$${product.discountPercentage > 0
        ? parseInt(
          product.price - (product.price * product.discountPercentage) / 100
        )
        : product.price
      } <span class="text-sm font-normal opacity-40 line-through">${product.discountPercentage > 0 ? "$" + product.price : ""
      }</span>
    ${product.discountPercentage > 0
        ? `<span class="inline-block bg-red-100 dark:bg-red-900/30 p-1 text-[10px] rounded text-red-600 dark:text-red-400 ml-auto"> ${product.discountPercentage > 0
          ? "-" + product.discountPercentage + "%"
          : ""
        } </span>`
        : ""
      }</p>
  
  </div>
    </div>`;

    container.innerHTML += p;
  });
}

// make product on click go to product details page

export function makeLink(arr) {
  arr.forEach((e) => {
    e.addEventListener("click", () => {
      window.location.href = `#product?id=${e.getAttribute("key")}`;
    });
  });
}

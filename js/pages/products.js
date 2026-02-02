import * as productService from "../services/product_services.js"


//Toggle filter items
document.querySelectorAll('.section-header').forEach(button => {
    button.addEventListener('click', function () {
        const sectionId = this.getAttribute('data-section');
        const content = document.getElementById(sectionId);

        // Toggle collapsed state
        this.classList.toggle('collapsed');
        content.classList.toggle('collapsed');
    });
});

/* =========> Get All Categories  <=========  */

var categories = await productService.getAllCategories();
const categoryContainer = document.getElementById("categories");
(function showCategories() {
    categories.forEach(c => {
        categoryContainer.innerHTML += ` 
                           <li class=" flex justify-between items-center p-3.5  cursor-pointer text-(--main-text) opacity-70 text-sm category"
                        data-value="${c.id}">
                        <span>${c.name}</span><span><i class="fa-solid fa-angle-right"></i></span>
                    </li>`
    })
})();

/* =========> Apply Filtration  <=========  */
//Default Values
let filters = {
    minPrice: 50,
    maxPrice: 1000,
    categoryId: null,
    dressStyle: [],
    size: []
};

//1. ===== Price Slider Track [Determine price] =====

const minRange = document.getElementById("minRange");
const maxRange = document.getElementById("maxRange");
let minPrice = document.getElementById("minPrice");
let maxPrice = document.getElementById("maxPrice");
const sliderTrack = document.getElementById("sliderTrack");
const maxGap = 10;

function updateSlider() {
    let minVal = parseInt(minRange.value);
    let maxVal = parseInt(maxRange.value);
    const min = parseInt(minRange.min);
    const max = parseInt(minRange.max);

    //Validation Range Inputs
    if (maxVal - minVal < maxGap) {
        if (event?.target === minRange) {
            minRange.value = maxVal - maxGap;
        } else {
            maxRange.value = minVal + maxGap;
        }
        minVal = minRange.value;
        maxVal = maxRange.value;
    }

    //Pass the values
    minPrice.value = minVal;
    maxPrice.value = maxVal;


    //Fill sliderTrack
    const minPercent = ((minVal - min) / (max - min)) * 100;
    const maxPercent = ((maxVal - min) / (max - min)) * 100;

    sliderTrack.style.background = `
    linear-gradient(
      to right,
      #ddd ${minPercent}%,
      #000 ${minPercent}%,
      #000 ${maxPercent}%,
      #ddd ${maxPercent}%
    )
  `;

    minPrice.textContent = `$ ${minVal}`;
    maxPrice.textContent = `$ ${maxVal}`;
    filters.minPrice = minVal
    filters.maxPrice = maxVal;
    console.log(filters);



}

minRange.addEventListener("input", updateSlider);
maxRange.addEventListener("input", updateSlider);

//in case the user does not change the price values
updateSlider();

//2. ======= Determine the size ========
const sizeButtons = document.querySelectorAll(".size-item");


sizeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const value = btn.dataset.value;
        btn.classList.toggle("active");

        if (btn.classList.contains("active")) {
            // ADD
            if (!filters.size.includes(value)) {
                filters.size.push(value);
            }
        } else {
            // REMOVE
            filters.size = filters.size.filter(size => size !== value);
        }

        console.log(filters.size);
    });
});

//3. ======= Determine the dress style =======

const dressItems = document.querySelectorAll(".style");

dressItems.forEach(btn => {
    btn.addEventListener("click", () => {
        const value = btn.dataset.value;

        btn.classList.toggle("active");

        if (btn.classList.contains("active")) {
            // ADD
            if (!filters.dressStyle.includes(value)) {
                filters.dressStyle.push(value);
            }
        } else {
            // REMOVE
            filters.dressStyle = filters.dressStyle.filter(
                dress => dress !== value
            );
        }

        console.log(filters.dressStyle);
    });
});


//4. Filter by category
const allProducts = await productService.getAllProducts();
const selectedCategoryContainer = document.querySelectorAll(".selectedCategory");

let selectedCategory = null;

const category = document.querySelectorAll(".category");
category.forEach(btn => {
    btn.addEventListener("click", async () => {
        category.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedCategory = Number(btn.dataset.value);
        filters.categoryId = selectedCategory;
        const categoryName = await productService.getCategoryById(selectedCategory);

        selectedCategoryContainer.forEach(i => i.innerHTML = categoryName.name)
        loadPage();

    })
});

function renderProducts(allProducts) {
    var productsContainer = document.querySelector(".product-items");
    productsContainer.innerHTML = ""

    if (allProducts.length > 0) {
        allProducts.forEach(item => {
            productsContainer.innerHTML += `
            <div class="group ">
                <a href="index.html#product?id=${item.id}" class="cursor-pointer">
                <div class="bg-[#F0EEED] rounded-3xl overflow-hidden mb-4 relative aspect-[1/1.1]">
                    <img src="${item.mainImage}" alt="Product"
                        class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                </div>
                <h3 class="font-bold text-base md:text-lg mb-1 truncate">${item.name}</h3>
                 <div class="flex items-center gap-2 mb-3">
                                        <div class="rating" style="--rating: ${item.rating}"></div>
                                        <span id="ratingText" class="text-xl">${item.rating} / 5</span>
                  </div>
                    ${item.discountPercentage ? `<div class="flex items-center space-x-2">
                    <span class="font-bold text-xl">$${parseInt(item.price - item.price * item.discountPercentage / 100)}</span>
                    <span class="text-gray-400 font-bold line-through">$${parseInt(item.price)}</span>
                    <span class="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">-${item.discountPercentage}%</span>
                </div>` : `<div class="font-bold text-xl ">$${parseInt(item.price)}</div>`}
                </a>
            </div>
            `

        })
    } else {
        toggleEmptyState(false);
    }
}
// render pagination buttons
let selectedSort = "default";
let currentPage = 1;
const pageSize = 6;
function renderPagination(meta) {
    var pageIndexContainer = document.querySelector(".page-index");
    pageIndexContainer.innerHTML = ""
    for (let i = 1; i <= meta.totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;

        let btnStyles = ["text-gray-500", "py-3", "px-3", "cursor-pointer", "rounded-4xl"]
        btn.classList.add(...btnStyles);

        if (i === meta.page) {
            btn.disabled = true;
            btn.classList.remove("text-gray-500")
            btn.classList.add("bg-gray-300", "text-black")
        }

        btn.onclick = () => {
            currentPage = i;
            loadPage();
        };

        pageIndexContainer.append(btn)
    }
    document.getElementById("prevBtn").disabled = !meta.hasPreviousPage;
    document.getElementById("nextBtn").disabled = !meta.hasNextPage;
}
function paginate(items, page = 1, pageSize = 6) {

    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const data = items.slice(startIndex, endIndex);

    return {
        page,
        pageSize,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        data
    };
}
function getFinalPrice(product) {
    if (product.discountPercentage) {
        return product.price - (product.price * product.discountPercentage / 100);
    }
    return product.price;
}

function sortProducts(products, sortType) {
    const sorted = [...products];

    switch (sortType) {
        case "price-asc":
            return sorted.sort(
                (a, b) => getFinalPrice(a) - getFinalPrice(b)
            );
        case "price-desc":
            return sorted.sort(
                (a, b) => getFinalPrice(b) - getFinalPrice(a)
            );
        case "rating":
            return sorted.sort((a, b) => b.rating - a.rating);
        case "name-asc":
            return sorted.sort((a, b) =>
                a.name.localeCompare(b.name)
            );
        case "name-desc":
            return sorted.sort((a, b) =>
                b.name.localeCompare(a.name)
            );

        default:
            return sorted;
    }
}

async function loadPage() {
    let baseProducts = allProducts;

    if (filters.categoryId !== null) {
        baseProducts = await productService.getProductsByCategoryId(filters.categoryId);
    }
    let filteredProducts = filterProducts(baseProducts, filters);
    filteredProducts = sortProducts(filteredProducts, selectedSort);

    toggleEmptyState(filteredProducts.length > 0);

    const result = paginate(filteredProducts, currentPage, pageSize);

    renderProducts(result.data);
    renderPagination(result);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
function changeSorting(sortType) {
    selectedSort = sortType;
    currentPage = 1;
    loadPage();
}
const sort = document.getElementById("sort");
sort.addEventListener("change", function () {
    changeSorting(this.value)
})
document.getElementById("prevBtn").onclick = () => {
    if (currentPage > 1) {
        currentPage--;
        loadPage();
    }
};
document.getElementById("nextBtn").onclick = () => {
    const totalPages = Math.ceil(allProducts.length / pageSize);
    if (currentPage < totalPages) {
        currentPage++;
        loadPage();
    }
};
loadPage();


document.getElementById("btnFilter").addEventListener("click", function () {
    currentPage = 1;
    loadPage();
})


function filterProducts(products, filters) {
    return products.filter(product => {

        // Category
        if (filters.categoryId !== null &&
            product.categoryId !== filters.categoryId) {
            return false;
        }

        // Size
        if (filters.size && filters.size.length > 0) {
            const hasSize = product.sizes.some(size =>
                filters.size.includes(size)
            );
            if (!hasSize) return false;
        }

        // Style
        if (filters.dressStyle.length > 0) {
            const productStyle = product.style.toLowerCase();
            const selectedStyles = filters.dressStyle.map(s => s.toLowerCase());

            if (!selectedStyles.includes(productStyle)) {
                return false;
            }
        }

        // Price
        const finalPrice = getFinalPrice(product);
        if ((filters.minPrice !== null && finalPrice < filters.minPrice) ||
            (filters.maxPrice !== null && finalPrice > filters.maxPrice)) {
            return false;
        }
        return true;
    });
}
function toggleEmptyState(hasProducts) {
    const emptyState = document.getElementById("emptyState");
    const productsGrid = document.querySelector(".product-items");
    const pagination = document.querySelector(".pagination")

    if (hasProducts) {
        emptyState.classList.add("hidden");
        productsGrid.classList.remove("hidden");
        pagination.classList.remove("hidden")
    } else {
        emptyState.classList.remove("hidden");
        productsGrid.classList.add("hidden");
        pagination.classList.add("hidden")

    }
}
document.getElementById("clearFiltersBtn").addEventListener("click", () => {
    filters = {
        minPrice: 50,
        maxPrice: 350,
        categoryId: null,
        dressStyle: [],
        size: []
    };
    window.location.reload();
    minRange.value = 50;
    maxRange.value = 350;
    updateSlider();

});


var showFilter = document.getElementById("settings");
var filterSideBar = document.querySelector(".filters");
var overlay = document.getElementById("overlay");

showFilter.addEventListener("click", function () {
    overlay.classList.add("overlay");
    filterSideBar.classList.toggle("show-filter");
});
var closeBtn = document.getElementById("closeBtn");
closeBtn.addEventListener("click", function () {
    overlay.classList.remove("overlay");

    filterSideBar.classList.remove("show-filter")

})







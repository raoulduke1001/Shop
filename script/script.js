document.addEventListener("DOMContentLoaded", () => {
    const search = document.querySelector('.search');
    const cartBtn = document.getElementById('cart');
    const wishListBtn = document.getElementById('wishlist');
    const goodsWrapper = document.querySelector('.goods-wrapper');
    const cart = document.querySelector('.cart');
    const category = document.querySelector('.category');
    const cartCounter = cartBtn.querySelector('.counter');
    const wishListCounter = wishListBtn.querySelector('.counter');
    let wishList = [];

    const loading = () => {
        goodsWrapper.innerHTML = `<div id="spinner"><div class="spinner-loading"><div><div><div></div>
        </div><div><div></div></div><div><div></div></div><div><div></div></div></div></div></div>`
    }

    const createCardGoods = (id, title, price, img) => {
        const card = document.createElement('div');
        card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
        card.innerHTML = `<div class="card">
            <div class="card-img-wrapper">
            <img class="card-img-top" src="${img}" alt="">
            <button class="card-add-wishlist ${wishList.includes(id) ? 'active' : ''}"
            data-goods-id="${id}"></button>
            </div>
            <div class="card-body justify-content-between">
            <a href="#" class="card-title">"${title}"</a>
            <div class="card-price">${price}</div>
            <div>
            <button class="card-add-cart"
            data-goods-id="${id}">Добавить в корзину</button>
            </div>
            </div>
            </div>`;
        return card;
    };

    const closeCart = (e) => {
        const target = e.target;
        if (target === cart ||
            target.classList.contains('cart-close') ||
            e.key === 'Escape') {
            cart.style.display = '';
            document.removeEventListener('keydown', closeCart);
        }
    };

    const openCart = (e) => {
        e.preventDefault();
        cart.style.display = 'flex';
        document.addEventListener('keydown', closeCart);
    };

    const renderCard = (items) => {
        goodsWrapper.textContent = "";
        if (items.length) {
            items.forEach(({
                id,
                title,
                price,
                imgMin
            }) => {
                goodsWrapper.appendChild(createCardGoods(id, title, price, imgMin));
            })
        } else {
            goodsWrapper.textContent = " 🤯 Nothing! Maybe you'll try again? 🤨 ";
        }

    };

    const getGoods = (handler, filter) => {
        loading();
        fetch('db/db.json')
            .then(response => response.json())
            .then(filter)
            .then(handler);
    };

    const randomSort = (item) => {
        return item.sort(() => Math.random() - 0.5)
    };

    const choiceCategory = (event) => {
        event.preventDefault();
        const target = event.target;
        if (target.classList.contains('category-item')) {
            const category = target.dataset.category;
            getGoods(renderCard, goods =>
                goods.filter(item =>
                    item.category.includes(category))
            )
        }
    };

    const searchGoods = event => {
        event.preventDefault();
        const input = event.target.elements.searchGoods;
        const inputValue = input.value.trim();
        if (inputValue !== '') {
            const searchString = new RegExp(inputValue, 'i')
            getGoods(renderCard, goods => goods.filter(item => searchString.test(item.title)));
        } else {
            search.classList.add('error');
            setTimeout(() => {
                search.classList.remove('error');
            }, 2000)
        }
        input.value = '';
    };

    const checkCount = () => {
        wishListCounter.textContent = wishList.length;
    }

    const storageQuery = (get) => {
        if (get) {
            return localStorage.getItem('wishlist')
        } else {
            localStorage.setItem('wishlist', JSON.stringify(wishList));
        }
    }

    const toggleWishList = (id, elem) => {
        if (wishList.includes(id)) {
            wishList.splice(wishList.indexOf(id), 1);
            elem.classList.remove('active')
        } else {
            wishList.push(id);
            elem.classList.add('active')

        }
        checkCount()
        storageQuery()
    };

    const handlerGoods = event => {
        const target = event.target;

        if (target.classList.contains('card-add-wishlist')) {
            toggleWishList(target.dataset.goodsId, target);
        }

    }

    cartBtn.addEventListener('click', openCart);
    cart.addEventListener('click', closeCart);
    category.addEventListener('click', choiceCategory);
    search.addEventListener('submit', searchGoods);
    goodsWrapper.addEventListener('click', handlerGoods);

    getGoods(renderCard, randomSort);
});
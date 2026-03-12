document.addEventListener('DOMContentLoaded', () => {
    const itemsContainer = document.getElementById('items-container');
    const addBtn = document.getElementById('add-btn');
    const clearBtn = document.getElementById('clear-btn');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIconLight = document.getElementById('theme-icon-light');
    const themeIconDark = document.getElementById('theme-icon-dark');

    let itemCount = 2; // We start with 2 items

    // --- Dark Mode Logic ---
    const updateThemeIcon = (isDark) => {
        if (isDark) {
            themeIconDark.classList.add('hidden');
            themeIconLight.classList.remove('hidden');
        } else {
            themeIconDark.classList.remove('hidden');
            themeIconLight.classList.add('hidden');
        }
    };

    updateThemeIcon(document.documentElement.classList.contains('dark'));

    themeToggleBtn.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark');
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            updateThemeIcon(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            updateThemeIcon(true);
        }
    });

    // Function to calculate and update UI
    const calculateBestDeal = () => {
        const itemCards = document.querySelectorAll('.item-card');
        let validItems = [];

        itemCards.forEach((card, index) => {
            const id = card.getAttribute('data-id');
            const priceInput = card.querySelector('.price-input').value;
            const amountInput = card.querySelector('.amount-input').value;
            const unitPriceDisplay = card.querySelector('.unit-price-display span');
            const winnerBadge = card.querySelector('.winner-badge');

            // Reset styles
            card.classList.remove('best-deal-highlight');
            winnerBadge.classList.add('hidden');

            if (priceInput && amountInput && parseFloat(priceInput) > 0 && parseFloat(amountInput) > 0) {
                const price = parseFloat(priceInput);
                const amount = parseFloat(amountInput);
                const unitPrice = price / amount;

                // Format unit price to exactly 2 decimal places
                unitPriceDisplay.textContent = unitPrice.toLocaleString('th-TH', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }) + ' บาท';

                validItems.push({
                    id: id,
                    index: index + 1,
                    card: card,
                    unitPrice: unitPrice,
                    price: price,
                    amount: amount
                });
            } else {
                unitPriceDisplay.textContent = '-';
            }
        });

        if (validItems.length >= 2) {
            // Sort by unit price ascending
            validItems.sort((a, b) => a.unitPrice - b.unitPrice);

            const bestItem = validItems[0];

            // Highlight best item
            bestItem.card.classList.add('best-deal-highlight');
            const badge = bestItem.card.querySelector('.winner-badge');
            
            badge.innerHTML = `✨ คุ้มที่สุด`;
            
            badge.classList.remove('hidden');
        }
    };

    const attachListeners = (card) => {
        const inputs = card.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', calculateBestDeal);
        });
    };

    document.querySelectorAll('.item-card').forEach(attachListeners);

    addBtn.addEventListener('click', () => {
        itemCount++; 
        const newItemId = itemCount;
        const displayNum = document.querySelectorAll('.item-card').length + 1;

        const newCardHTML = `
            <div class="item-card bg-white dark:bg-gray-800 border-2 border-transparent shadow-sm rounded-xl p-2 transition-all duration-300 relative group transform scale-95 opacity-0" data-id="${newItemId}">
                <div class="grid grid-cols-[auto_1fr_1fr_auto] gap-x-2 items-center">
                    <div class="w-6 text-center">
                        <span class="text-xs font-bold text-gray-500 item-number bg-gray-100 dark:bg-gray-700 w-6 h-6 inline-flex items-center justify-center rounded-full">${displayNum}</span>
                    </div>
                    <div>
                        <input type="number" min="0" step="0.01" class="price-input w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-2 py-1.5 text-sm transition-colors placeholder:text-gray-400" placeholder="0.00">
                    </div>
                    <div>
                        <input type="number" min="0" step="0.01" class="amount-input w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-2 py-1.5 text-sm transition-colors placeholder:text-gray-400" placeholder="1.00">
                    </div>
                    <div class="w-6 flex justify-center items-center">
                        <button class="delete-btn text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-1 rounded-lg transition-colors" title="ลบรายการ">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="flex justify-between items-center mt-1.5 pl-[2.25rem] pr-1">
                    <div class="unit-price-display text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                        <span class="font-bold text-gray-800 dark:text-gray-200 text-xs">-</span>
                    </div>
                    <div class="winner-badge hidden text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                        ✨ คุ้มที่สุด
                    </div>
                </div>
            </div>
        `;

        itemsContainer.insertAdjacentHTML('beforeend', newCardHTML);
        const newCard = itemsContainer.lastElementChild;

        // Trigger reflow for animation
        void newCard.offsetWidth;
        newCard.classList.remove('scale-95', 'opacity-0');
        newCard.classList.add('scale-100', 'opacity-100');

        attachListeners(newCard);

        const deleteBtn = newCard.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            newCard.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                newCard.remove();
                reindexCards();
                calculateBestDeal();
            }, 300);
        });

        // Scroll to new item gently
        newCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    clearBtn.addEventListener('click', () => {
        const allCards = document.querySelectorAll('.item-card');
        for (let i = 2; i < allCards.length; i++) {
            allCards[i].remove();
        }

        itemCount = 2;
        reindexCards();

        document.querySelectorAll('.item-card').forEach(card => {
            card.querySelector('.price-input').value = '';
            card.querySelector('.amount-input').value = '';
        });

        calculateBestDeal();
    });

    const reindexCards = () => {
        let displayIndex = 1;
        document.querySelectorAll('.item-card').forEach((card) => {
            const numberSpan = card.querySelector('.item-number');
            if (numberSpan) {
                numberSpan.textContent = displayIndex;
            }
            displayIndex++;
        });
    };
});

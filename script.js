document.addEventListener('DOMContentLoaded', () => {
    const itemsContainer = document.getElementById('items-container');
    const addBtn = document.getElementById('add-btn');
    const clearBtn = document.getElementById('clear-btn');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIconLight = document.getElementById('theme-icon-light');
    const themeIconDark = document.getElementById('theme-icon-dark');
    const resultText = document.getElementById('result-text');
    const resultSubtext = document.getElementById('result-subtext');

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

    // Initial icon state
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
            winnerBadge.classList.remove('badge-winner');

            if (priceInput && amountInput && parseFloat(priceInput) > 0 && parseFloat(amountInput) > 0) {
                const price = parseFloat(priceInput);
                const amount = parseFloat(amountInput);
                const unitPrice = price / amount;
                
                // Format unit price for display
                unitPriceDisplay.textContent = unitPrice.toLocaleString('th-TH', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 6 
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

        // Determine the best deal
        if (validItems.length >= 2) {
            // Sort by unit price ascending
            validItems.sort((a, b) => a.unitPrice - b.unitPrice);
            
            const bestItem = validItems[0];
            const secondBestItem = validItems[1]; // for calculating savings
            
            // Highlight best item
            bestItem.card.classList.add('best-deal-highlight');
            const badge = bestItem.card.querySelector('.winner-badge');
            badge.classList.remove('hidden');
            
            // Trigger reflow to restart animation
            void badge.offsetWidth;
            badge.classList.add('badge-winner');

            // Update result text
            resultText.textContent = `สินค้าชิ้นที่ ${bestItem.index} คุ้มที่สุด! 🎉`;
            
            // Calculate how much cheaper it is compared to second best
            if (secondBestItem.unitPrice > bestItem.unitPrice) {
                const diffPerc = ((secondBestItem.unitPrice - bestItem.unitPrice) / secondBestItem.unitPrice) * 100;
                resultSubtext.textContent = `ประหยัดกว่าประมาณ ${diffPerc.toFixed(1)}% ต่อหน่วย`;
                resultSubtext.classList.remove('opacity-0');
            } else {
                resultSubtext.textContent = 'ราคาต่อหน่วยเท่ากัน';
                resultSubtext.classList.remove('opacity-0');
            }

        } else if (validItems.length === 1) {
            resultText.textContent = 'รอข้อมูลอีกรายการ...';
            resultSubtext.classList.add('opacity-0');
        } else {
            resultText.textContent = 'รอข้อมูล...';
            resultSubtext.classList.add('opacity-0');
        }
    };

    // Attach event listeners to existing inputs
    const attachListeners = (card) => {
        const inputs = card.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', calculateBestDeal);
        });
    };

    // Initialize existing cards
    document.querySelectorAll('.item-card').forEach(attachListeners);

    // Handle Adding new items
    addBtn.addEventListener('click', () => {
        itemCount++;
        const newItemId = itemCount;
        
        const newCardHTML = `
            <div class="item-card relative bg-white dark:bg-slate-800 rounded-2xl p-5 border-2 border-slate-100 dark:border-slate-700 shadow-sm transition-all duration-300 transform scale-95 opacity-0 animate-fadeIn" data-id="${newItemId}">
                <div class="absolute top-4 right-4 winner-badge hidden bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    ✨ คุ้มที่สุด
                </div>
                
                <h3 class="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                    <span class="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 w-6 h-6 rounded-full flex items-center justify-center text-sm">${newItemId}</span>
                    สินค้าชิ้นที่ ${newItemId}
                </h3>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">ราคา (บาท)</label>
                        <input type="number" min="0" step="0.01" class="price-input w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-colors" placeholder="เช่น 150">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">ปริมาณ/จำนวน</label>
                        <input type="number" min="0" step="0.01" class="amount-input w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-colors" placeholder="เช่น 100">
                    </div>
                </div>
                <!-- Delete Button Container -->
                <div class="mt-3 flex justify-between items-center">
                    <button class="delete-btn flex items-center gap-1 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-sm" aria-label="Delete item">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        ลบ
                    </button>
                    <!-- Unit Price display inside flex container -->
                    <div class="text-right text-sm text-slate-400 dark:text-slate-500 unit-price-display">
                        ราคาต่อหน่วย: <span class="font-medium text-slate-600 dark:text-slate-300">-</span>
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

        // Attach listeners to new inputs
        attachListeners(newCard);
        
        // Setup delete button
        const deleteBtn = newCard.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            // Animate out
            newCard.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                newCard.remove();
                reindexCards();
                calculateBestDeal();
            }, 300); // Wait for transition
        });

        // Scroll to new item gently
        newCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    // Clear Button Logic
    clearBtn.addEventListener('click', () => {
        // Remove extra cards beyond the first 2
        const allCards = document.querySelectorAll('.item-card');
        for (let i = 2; i < allCards.length; i++) {
            allCards[i].remove();
        }
        
        // Reset count
        itemCount = 2;
        reindexCards();

        // Clear values in remaining cards
        document.querySelectorAll('.item-card').forEach(card => {
            card.querySelector('.price-input').value = '';
            card.querySelector('.amount-input').value = '';
        });

        calculateBestDeal();
    });

    // Helper to re-number the cards displayed (e.g. 1, 2, 3...) when one is deleted
    const reindexCards = () => {
        let displayIndex = 1;
        document.querySelectorAll('.item-card').forEach((card) => {
            // Update the number in the circle badge
            const circleBadge = card.querySelector('h3 span');
            if(circleBadge) circleBadge.textContent = displayIndex;
            
            // Update the text node part of the H3 header carefully without breaking HTML structure
            const h3 = card.querySelector('h3');
            
            h3.childNodes.forEach(node => {
                // If it's a direct text node starting with our prefix
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().startsWith('สินค้าชิ้นที่')) {
                    node.textContent = ` สินค้าชิ้นที่ ${displayIndex} `;
                } 
            });
            displayIndex++;
        });
        // We do *not* decrement itemCount, just reindex display numbers so internal IDs stay unique
    };
});

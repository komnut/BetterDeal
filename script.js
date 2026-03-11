document.addEventListener('DOMContentLoaded', () => {
    const itemsContainer = document.getElementById('items-container');
    const addBtn = document.getElementById('add-btn');
    const resultText = document.getElementById('result-text');
    const resultSubtext = document.getElementById('result-subtext');

    let itemCount = 2; // We start with 2 items

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
            <div class="item-card relative bg-white rounded-2xl p-5 border-2 border-slate-100 shadow-sm transition-all duration-300 transform scale-95 opacity-0 animate-fadeIn" data-id="${newItemId}">
                <div class="absolute top-4 right-4 winner-badge hidden bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    ✨ คุ้มที่สุด
                </div>
                
                <h3 class="font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <span class="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-sm">${newItemId}</span>
                    สินค้าชิ้นที่ ${newItemId}
                </h3>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-500 mb-1">ราคา (บาท)</label>
                        <input type="number" min="0" step="0.01" class="price-input w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors" placeholder="เช่น 150">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-500 mb-1">ปริมาณ/จำนวน</label>
                        <input type="number" min="0" step="0.01" class="amount-input w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors" placeholder="เช่น 100">
                    </div>
                </div>
                <div class="mt-3 flex justify-between items-center">
                    <button class="delete-btn flex items-center gap-1 text-slate-400 hover:text-red-500 transition-colors px-2 py-1 rounded-lg hover:bg-red-50 text-sm" aria-label="Delete item">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        ลบ
                    </button>
                    <div class="text-right text-sm text-slate-400 unit-price-display">
                        ราคาต่อหน่วย: <span class="font-medium text-slate-600">-</span>
                    </div>
                </div>
            </div>
        `;

        // Temporarily append HTML, then add animation classes
        itemsContainer.insertAdjacentHTML('beforeend', newCardHTML);
        const newCard = itemsContainer.lastElementChild;
        
        // Trigger reflow
        void newCard.offsetWidth;
        newCard.classList.remove('scale-95', 'opacity-0');
        newCard.classList.add('scale-100', 'opacity-100');

        // Attach listeners to new elements
        attachListeners(newCard);
        
        // Attach delete listener
        newCard.querySelector('.delete-btn').addEventListener('click', () => {
            // Animate out
            newCard.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                newCard.remove();
                reindexCards();
                calculateBestDeal();
            }, 300); // Wait for transition
        });

        // Scroll to the new item smoothly if not fully in view
        newCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    // Helper to re-number the cards displayed (e.g. 1, 2, 3...) when one is deleted
    const reindexCards = () => {
        const titleSpans = document.querySelectorAll('.item-card h3 span');
        const titleNodes = document.querySelectorAll('.item-card h3');
        
        let displayIndex = 1;
        document.querySelectorAll('.item-card').forEach((card) => {
            // Re-number badge
            const circleBadge = card.querySelector('h3 span');
            if(circleBadge) circleBadge.textContent = displayIndex;
            
            // Re-number text, preserving internal HTML structure
            // Need to carefully update just the text node part
            const h3 = card.querySelector('h3');
            
            // We know the pattern: h3 contains:
            // 1. span / button elements
            // 2. text node "สินค้าชิ้นที่ X"
            // Let's just grab the flex container if it exists (for new items) or the h3 itself (for old)
            // A simpler way: we just let the numbering circle act as the index, and leave the text alone to avoid breaking DOM.
            // Oh wait, I want "สินค้าชิ้นที่ X" to be updated.
            
            // Let's replace the text content carefully by traversing childnodes
            h3.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().startsWith('สินค้าชิ้นที่')) {
                    node.textContent = ` สินค้าชิ้นที่ ${displayIndex} `;
                } else if (node.nodeType === 1 && node.classList.contains('flex')) {
                    // For dynamically added items, it's wrapped in a flex div
                    node.childNodes.forEach(child => {
                        if (child.nodeType === Node.TEXT_NODE && child.textContent.trim().startsWith('สินค้าชิ้นที่')) {
                            child.textContent = ` สินค้าชิ้นที่ ${displayIndex}`;
                        }
                    });
                }
            });
            displayIndex++;
        });
        
        // Don't reset itemCount though, so internal IDs stay unique
    };

});

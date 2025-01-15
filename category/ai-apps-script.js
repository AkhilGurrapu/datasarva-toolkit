import aiTools from '../js/ai-tools-data.js';

const app = {
    async init() {
        this.toolsGrid = document.getElementById('toolsGrid');
        this.searchInput = document.getElementById('searchInput');
        this.featuredContainer = document.querySelector('.featured-tools-container');
        this.tools = aiTools;
        
        this.bindEvents();
        this.initFeaturedSlider();
        this.updateDisplay();
    },

    bindEvents() {
        this.searchInput.addEventListener('input', () => this.updateDisplay());
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => 
                    b.classList.remove('active')
                );
                e.target.classList.add('active');
                this.updateDisplay(e.target.dataset.filter);
            });
        });

        // Slider controls
        document.querySelector('.slider-btn.prev').addEventListener('click', () => this.slideFeatured(-1));
        document.querySelector('.slider-btn.next').addEventListener('click', () => this.slideFeatured(1));

        // Add mouse enter/leave events for the slider
        this.featuredContainer.addEventListener('mouseenter', () => this.stopAutoSlide());
        this.featuredContainer.addEventListener('mouseleave', () => this.startAutoSlide());
        
        // Add touch events for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.featuredContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            this.stopAutoSlide();
        });
        
        this.featuredContainer.addEventListener('touchmove', (e) => {
            touchEndX = e.touches[0].clientX;
        });
        
        this.featuredContainer.addEventListener('touchend', () => {
            const difference = touchStartX - touchEndX;
            if (Math.abs(difference) > 50) { // Minimum swipe distance
                this.slideFeatured(difference > 0 ? 1 : -1);
            }
            this.startAutoSlide();
        });
    },

    initFeaturedSlider() {
        const featuredTools = this.tools.slice(0, 5);
        // Create more clones for smoother infinite scroll
        const clonedTools = [
            ...featuredTools.slice(-2),
            ...featuredTools,
            ...featuredTools,
            ...featuredTools.slice(0, 2)
        ];
        
        const featuredHtml = clonedTools.map(tool => `
            <a href="${tool.link}" target="_blank" rel="noopener noreferrer" class="featured-tool-card">
                <div class="tool-header">
                    <img src="${tool.icon}" alt="${tool.name}" class="tool-icon">
                    <h3>${tool.name}</h3>
                </div>
                <p class="description">${tool.description}</p>
                <div class="category-tag">${tool.category}</div>
            </a>
        `).join('');
        
        this.featuredContainer.innerHTML = featuredHtml;
        this.currentIndex = featuredTools.length + 2;
        this.isTransitioning = false;
        this.cardWidth = 320;
        this.updateSliderPosition();
        this.startAutoSlide();
        this.updateActiveCards();
    },

    updateSliderPosition() {
        const offset = this.currentIndex * -this.cardWidth;
        this.featuredContainer.style.transform = `translateX(${offset}px)`;
        this.updateActiveCards();
    },

    updateActiveCards() {
        const cards = this.featuredContainer.querySelectorAll('.featured-tool-card');
        const middleIndex = Math.floor(cards.length / 2);
        cards.forEach((card, index) => {
            // Make the middle card active
            card.classList.toggle('active', index === this.currentIndex + 2);
        });
    },

    startAutoSlide() {
        this.stopAutoSlide();
        this.slideInterval = setInterval(() => {
            this.slideFeatured(1);
        }, 1500); // Even faster interval - slide every 1.5 seconds
    },

    stopAutoSlide() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
        }
    },

    slideFeatured(direction) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        this.stopAutoSlide();

        this.currentIndex += direction;
        this.featuredContainer.style.transition = 'transform 0.15s ease-out';
        this.updateSliderPosition();

        setTimeout(() => {
            this.featuredContainer.style.transition = 'none';
            if (this.currentIndex >= this.tools.length * 2) {
                this.currentIndex = this.tools.length;
                this.updateSliderPosition();
            } else if (this.currentIndex <= 1) {
                this.currentIndex = this.tools.length;
                this.updateSliderPosition();
            }
            this.isTransitioning = false;
            this.startAutoSlide();
        }, 150); // Match the transition duration
    },

    async updateDisplay(category = 'all') {
        let filteredTools = this.tools;
        
        // Apply search filter
        const searchTerm = this.searchInput.value.toLowerCase();
        if (searchTerm) {
            filteredTools = filteredTools.filter(tool => {
                return tool.name.toLowerCase().includes(searchTerm) ||
                       tool.description.toLowerCase().includes(searchTerm) ||
                       tool.category.toLowerCase().includes(searchTerm) ||
                       tool.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            });
        }
        
        // Apply category filter
        if (category !== 'all') {
            filteredTools = filteredTools.filter(tool => 
                tool.category === category
            );
        }   
        
        // Show no results message if no tools found
        if (filteredTools.length === 0) {
            this.toolsGrid.innerHTML = `
                <div class="no-results">
                    <p>No AI tools found matching your criteria</p>
                </div>`;
            return;
        }
        
        // Render filtered tools with updated card design
        const toolsHtml = filteredTools
            .map(tool => `
                <a href="${tool.link}" target="_blank" rel="noopener noreferrer" class="tool-card">
                    <div class="tool-header">
                        <div class="tool-icon-wrapper">
                            <img src="${tool.icon || tool.image}" alt="${tool.name}" class="tool-icon"
                                onerror="this.src='../assets/images/default-tool.jpg'">
                        </div>
                        <span class="category-tag">${tool.category}</span>
                    </div>
                    <div class="tool-content">
                        <h3>${tool.name}</h3>
                        <p class="description">${tool.description}</p>
                        <span class="tool-link">Learn More →</span>
                    </div>
                </a>
            `)
            .join('');
        
        this.toolsGrid.innerHTML = toolsHtml;
    }
};

document.addEventListener('DOMContentLoaded', () => app.init()); 
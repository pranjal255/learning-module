// Main Application Logic for Learning Hub PWA
class LearningHubApp {
    constructor() {
        this.currentModule = null;
        this.currentPath = null;
        this.isLoading = false;
        this.searchTimeout = null;
        
        this.init();
    }

    async init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        console.log('Initializing Learning Hub PWA...');
        
        // Initialize components
        this.initializeEventListeners();
        this.initializeTheme();
        this.initializeSettings();
        this.loadWelcomeScreen();
        this.hideLoadingScreen();
        
        // Handle URL parameters
        this.handleUrlParameters();
        
        console.log('Learning Hub PWA initialized successfully!');
    }

    initializeEventListeners() {
        // Menu toggle
        const menuBtn = document.getElementById('menu-btn');
        const sidebar = document.getElementById('sidebar');
        
        if (menuBtn && sidebar) {
            menuBtn.addEventListener('click', () => this.toggleSidebar());
        }

        // Search functionality
        const searchBtn = document.getElementById('search-btn');
        const searchOverlay = document.getElementById('search-overlay');
        const searchClose = document.getElementById('search-close');
        const searchInput = document.getElementById('search-input');

        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.showSearch());
        }
        
        if (searchClose) {
            searchClose.addEventListener('click', () => this.hideSearch());
        }
        
        if (searchOverlay) {
            searchOverlay.addEventListener('click', (e) => {
                if (e.target === searchOverlay) this.hideSearch();
            });
        }
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.hideSearch();
            });
        }

        // Bookmarks
        const bookmarkBtn = document.getElementById('bookmark-btn');
        if (bookmarkBtn) {
            bookmarkBtn.addEventListener('click', () => this.showBookmarks());
        }

        // Settings
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.showSettings());
        }

        // Modal close handlers
        this.initializeModalHandlers();
        
        // Content navigation
        this.initializeContentNavigation();
        
        // Keyboard shortcuts
        this.initializeKeyboardShortcuts();
    }

    initializeModalHandlers() {
        // Settings modal
        const settingsModal = document.getElementById('settings-modal');
        const settingsClose = document.getElementById('settings-close');
        
        if (settingsClose) {
            settingsClose.addEventListener('click', () => this.hideSettings());
        }
        
        if (settingsModal) {
            settingsModal.addEventListener('click', (e) => {
                if (e.target === settingsModal) this.hideSettings();
            });
        }

        // Bookmarks modal
        const bookmarksModal = document.getElementById('bookmarks-modal');
        const bookmarksClose = document.getElementById('bookmarks-close');
        
        if (bookmarksClose) {
            bookmarksClose.addEventListener('click', () => this.hideBookmarks());
        }
        
        if (bookmarksModal) {
            bookmarksModal.addEventListener('click', (e) => {
                if (e.target === bookmarksModal) this.hideBookmarks();
            });
        }
    }

    initializeContentNavigation() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const bookmarkCurrentBtn = document.getElementById('bookmark-current');
        const markCompleteBtn = document.getElementById('mark-complete');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.navigateToPrevious());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.navigateToNext());
        }
        
        if (bookmarkCurrentBtn) {
            bookmarkCurrentBtn.addEventListener('click', () => this.toggleCurrentBookmark());
        }
        
        if (markCompleteBtn) {
            markCompleteBtn.addEventListener('click', () => this.toggleCurrentCompletion());
        }
    }

    initializeKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only handle shortcuts when not typing in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            switch (e.key) {
                case '/':
                    e.preventDefault();
                    this.showSearch();
                    break;
                case 'Escape':
                    this.hideAllModals();
                    break;
                case 'ArrowLeft':
                    if (e.altKey) {
                        e.preventDefault();
                        this.navigateToPrevious();
                    }
                    break;
                case 'ArrowRight':
                    if (e.altKey) {
                        e.preventDefault();
                        this.navigateToNext();
                    }
                    break;
                case 'b':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.toggleCurrentBookmark();
                    }
                    break;
                case 'm':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.toggleSidebar();
                    }
                    break;
            }
        });
    }

    initializeTheme() {
        // Apply saved theme
        const savedTheme = window.storageManager.getSetting('theme');
        const savedFontSize = window.storageManager.getSetting('fontSize');
        const savedFontFamily = window.storageManager.getSetting('fontFamily');
        const savedLineSpacing = window.storageManager.getSetting('lineSpacing');

        this.applyTheme(savedTheme);
        this.applyFontSize(savedFontSize);
        this.applyFontFamily(savedFontFamily);
        this.applyLineSpacing(savedLineSpacing);

        // Detect system theme preference
        if (savedTheme === 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.applyTheme('dark');
        }
    }

    initializeSettings() {
        // Theme selector
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            themeSelect.value = window.storageManager.getSetting('theme');
            themeSelect.addEventListener('change', (e) => {
                this.applyTheme(e.target.value);
                window.storageManager.setSetting('theme', e.target.value);
            });
        }

        // Font size controls
        const fontDecrease = document.getElementById('font-decrease');
        const fontIncrease = document.getElementById('font-increase');
        const fontSizeDisplay = document.getElementById('font-size-display');

        if (fontDecrease && fontIncrease && fontSizeDisplay) {
            this.updateFontSizeDisplay();
            
            fontDecrease.addEventListener('click', () => this.decreaseFontSize());
            fontIncrease.addEventListener('click', () => this.increaseFontSize());
        }

        // Font family selector
        const fontFamilySelect = document.getElementById('font-family-select');
        if (fontFamilySelect) {
            fontFamilySelect.value = window.storageManager.getSetting('fontFamily');
            fontFamilySelect.addEventListener('change', (e) => {
                this.applyFontFamily(e.target.value);
                window.storageManager.setSetting('fontFamily', e.target.value);
            });
        }

        // Line spacing selector
        const lineSpacingSelect = document.getElementById('line-spacing-select');
        if (lineSpacingSelect) {
            lineSpacingSelect.value = window.storageManager.getSetting('lineSpacing');
            lineSpacingSelect.addEventListener('change', (e) => {
                this.applyLineSpacing(e.target.value);
                window.storageManager.setSetting('lineSpacing', e.target.value);
            });
        }

        // Data management buttons
        const exportDataBtn = document.getElementById('export-data');
        const importDataBtn = document.getElementById('import-data');
        const resetProgressBtn = document.getElementById('reset-progress');

        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => this.exportData());
        }
        
        if (importDataBtn) {
            importDataBtn.addEventListener('click', () => this.importData());
        }
        
        if (resetProgressBtn) {
            resetProgressBtn.addEventListener('click', () => this.resetProgress());
        }
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            const app = document.getElementById('app');
            
            if (loadingScreen && app) {
                loadingScreen.classList.add('hidden');
                app.classList.remove('hidden');
            }
        }, 1000); // Show loading for 1 second
    }

    loadWelcomeScreen() {
        this.showWelcomeScreen();
        this.loadSidebarContent();
        this.updateStats();
    }

    showWelcomeScreen() {
        const welcomeScreen = document.getElementById('welcome-screen');
        const contentArea = document.getElementById('content-area');
        
        if (welcomeScreen && contentArea) {
            welcomeScreen.classList.remove('hidden');
            contentArea.classList.add('hidden');
        }
        
        this.currentModule = null;
        this.updateProgress();
    }

    loadSidebarContent() {
        const dsaModules = document.getElementById('dsa-modules');
        const infrastructureModules = document.getElementById('infrastructure-modules');

        if (dsaModules) {
            dsaModules.innerHTML = this.generateModulesList('dsa');
        }
        
        if (infrastructureModules) {
            infrastructureModules.innerHTML = this.generateModulesList('infrastructure');
        }

        // Add path header click handlers
        document.querySelectorAll('.path-header').forEach(header => {
            header.addEventListener('click', () => {
                const pathId = header.dataset.path;
                this.togglePathModules(pathId);
            });
        });
    }

    generateModulesList(pathId) {
        const modules = window.contentManager.getModules(pathId);
        
        return modules.map(module => {
            const progress = window.storageManager.getProgress(module.id);
            const isBookmarked = window.storageManager.isBookmarked(module.id);
            const statusClass = progress.completed ? 'completed' : '';
            const bookmarkIcon = isBookmarked ? '📌' : '';
            
            return `
                <div class="module-item ${statusClass}" data-module-id="${module.id}">
                    <div class="module-title">
                        ${module.title} ${bookmarkIcon}
                        <div class="module-status ${progress.completed ? 'completed' : ''}">
                            ${progress.completed ? '✓' : '○'}
                        </div>
                    </div>
                    <div class="module-description">${module.description}</div>
                    <div class="module-meta">
                        <span class="module-time">${module.estimatedTime}</span>
                        <span class="module-difficulty">${module.difficulty}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    togglePathModules(pathId) {
        const modulesContainer = document.getElementById(`${pathId}-modules`);
        const pathHeader = document.querySelector(`[data-path="${pathId}"]`);
        
        if (modulesContainer && pathHeader) {
            modulesContainer.classList.toggle('expanded');
            pathHeader.classList.toggle('active');
            
            // Add click handlers for modules
            if (modulesContainer.classList.contains('expanded')) {
                modulesContainer.querySelectorAll('.module-item').forEach(item => {
                    item.addEventListener('click', () => {
                        const moduleId = item.dataset.moduleId;
                        this.loadModule(moduleId);
                        this.hideSidebar();
                    });
                });
            }
        }
    }

    async loadModule(moduleId) {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoadingIndicator();
        
        try {
            const module = window.contentManager.getModule(moduleId);
            if (!module) {
                throw new Error('Module not found');
            }

            this.currentModule = module;
            window.storageManager.setCurrentModule(moduleId);
            
            // Update progress tracking
            const progress = window.storageManager.getProgress(moduleId);
            window.storageManager.setProgress(moduleId, {
                ...progress,
                lastAccessed: Date.now()
            });

            this.showContentArea();
            this.renderModuleContent(module);
            this.updateBreadcrumb(module);
            this.updateNavigationButtons();
            this.updateBookmarkButton();
            this.updateCompletionButton();
            
            // Scroll to top
            const contentArea = document.getElementById('content-area');
            if (contentArea) {
                contentArea.scrollTop = 0;
            }
            
        } catch (error) {
            console.error('Error loading module:', error);
            this.showError('Failed to load module. Please try again.');
        } finally {
            this.isLoading = false;
            this.hideLoadingIndicator();
        }
    }

    showContentArea() {
        const welcomeScreen = document.getElementById('welcome-screen');
        const contentArea = document.getElementById('content-area');
        
        if (welcomeScreen && contentArea) {
            welcomeScreen.classList.add('hidden');
            contentArea.classList.remove('hidden');
        }
    }

    renderModuleContent(module) {
        const contentBody = document.getElementById('content-body');
        if (!contentBody) return;

        // Convert markdown to HTML
        const htmlContent = window.contentManager.markdownToHtml(module.content);
        contentBody.innerHTML = htmlContent;
        
        // Add syntax highlighting if available
        if (window.Prism) {
            window.Prism.highlightAll();
        }
        
        // Add copy buttons to code blocks
        this.addCopyButtonsToCodeBlocks();
    }

    addCopyButtonsToCodeBlocks() {
        const codeBlocks = document.querySelectorAll('pre code');
        
        codeBlocks.forEach(block => {
            const button = document.createElement('button');
            button.className = 'copy-btn';
            button.textContent = 'Copy';
            button.addEventListener('click', () => {
                navigator.clipboard.writeText(block.textContent).then(() => {
                    button.textContent = 'Copied!';
                    setTimeout(() => {
                        button.textContent = 'Copy';
                    }, 2000);
                });
            });
            
            block.parentElement.style.position = 'relative';
            block.parentElement.appendChild(button);
        });
    }

    updateBreadcrumb(module) {
        const breadcrumb = document.getElementById('breadcrumb');
        if (!breadcrumb) return;

        const pathParts = module.path.split(' > ');
        const breadcrumbHtml = pathParts.map((part, index) => {
            const isLast = index === pathParts.length - 1;
            const className = isLast ? 'breadcrumb-item current' : 'breadcrumb-item';
            
            if (isLast) {
                return `<span class="${className}">${part}</span>`;
            } else {
                return `<a href="#" class="${className}">${part}</a><span class="breadcrumb-separator">></span>`;
            }
        }).join('');
        
        breadcrumb.innerHTML = breadcrumbHtml;
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        if (!this.currentModule) return;

        const prevModule = window.contentManager.getPreviousModule(this.currentModule.id);
        const nextModule = window.contentManager.getNextModule(this.currentModule.id);

        if (prevBtn) {
            prevBtn.disabled = !prevModule;
            if (prevModule) {
                prevBtn.title = `Previous: ${prevModule.title}`;
            }
        }
        
        if (nextBtn) {
            nextBtn.disabled = !nextModule;
            if (nextModule) {
                nextBtn.title = `Next: ${nextModule.title}`;
            }
        }
    }

    updateBookmarkButton() {
        const bookmarkBtn = document.getElementById('bookmark-current');
        if (!bookmarkBtn || !this.currentModule) return;

        const isBookmarked = window.storageManager.isBookmarked(this.currentModule.id);
        bookmarkBtn.classList.toggle('active', isBookmarked);
        bookmarkBtn.title = isBookmarked ? 'Remove bookmark' : 'Add bookmark';
    }

    updateCompletionButton() {
        const completeBtn = document.getElementById('mark-complete');
        if (!completeBtn || !this.currentModule) return;

        const progress = window.storageManager.getProgress(this.currentModule.id);
        completeBtn.classList.toggle('active', progress.completed);
        completeBtn.title = progress.completed ? 'Mark as incomplete' : 'Mark as complete';
    }

    navigateToPrevious() {
        if (!this.currentModule) return;
        
        const prevModule = window.contentManager.getPreviousModule(this.currentModule.id);
        if (prevModule) {
            this.loadModule(prevModule.id);
        }
    }

    navigateToNext() {
        if (!this.currentModule) return;
        
        const nextModule = window.contentManager.getNextModule(this.currentModule.id);
        if (nextModule) {
            this.loadModule(nextModule.id);
        }
    }

    toggleCurrentBookmark() {
        if (!this.currentModule) return;

        const isBookmarked = window.storageManager.isBookmarked(this.currentModule.id);
        
        if (isBookmarked) {
            window.storageManager.removeBookmark(this.currentModule.id);
        } else {
            const snippet = this.currentModule.content.substring(0, 200);
            window.storageManager.addBookmark(
                this.currentModule.id,
                this.currentModule.title,
                this.currentModule.path,
                snippet
            );
        }
        
        this.updateBookmarkButton();
        this.updateStats();
        this.loadSidebarContent(); // Refresh sidebar to show bookmark icon
    }

    toggleCurrentCompletion() {
        if (!this.currentModule) return;

        const progress = window.storageManager.getProgress(this.currentModule.id);
        
        if (progress.completed) {
            window.storageManager.markModuleIncomplete(this.currentModule.id);
        } else {
            window.storageManager.markModuleComplete(this.currentModule.id);
        }
        
        this.updateCompletionButton();
        this.updateStats();
        this.updateProgress();
        this.loadSidebarContent(); // Refresh sidebar to show completion status
    }

    // Search functionality
    showSearch() {
        const searchOverlay = document.getElementById('search-overlay');
        const searchInput = document.getElementById('search-input');
        
        if (searchOverlay && searchInput) {
            searchOverlay.classList.remove('hidden');
            searchInput.focus();
        }
    }

    hideSearch() {
        const searchOverlay = document.getElementById('search-overlay');
        const searchInput = document.getElementById('search-input');
        
        if (searchOverlay && searchInput) {
            searchOverlay.classList.add('hidden');
            searchInput.value = '';
            this.clearSearchResults();
        }
    }

    handleSearch(query) {
        clearTimeout(this.searchTimeout);
        
        if (query.length < 2) {
            this.clearSearchResults();
            return;
        }

        this.searchTimeout = setTimeout(() => {
            const results = window.contentManager.searchContent(query);
            this.displaySearchResults(results);
        }, 300);
    }

    displaySearchResults(results) {
        const searchResults = document.getElementById('search-results');
        if (!searchResults) return;

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
            return;
        }

        const resultsHtml = results.map(result => `
            <div class="search-result" data-module-id="${result.module.id}">
                <div class="search-result-title">${result.module.title}</div>
                <div class="search-result-snippet">${result.snippet}...</div>
                <div class="search-result-path">${result.path}</div>
            </div>
        `).join('');

        searchResults.innerHTML = resultsHtml;

        // Add click handlers
        searchResults.querySelectorAll('.search-result').forEach(item => {
            item.addEventListener('click', () => {
                const moduleId = item.dataset.moduleId;
                this.loadModule(moduleId);
                this.hideSearch();
            });
        });
    }

    clearSearchResults() {
        const searchResults = document.getElementById('search-results');
        if (searchResults) {
            searchResults.innerHTML = '';
        }
    }

    // Sidebar functionality
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const menuBtn = document.getElementById('menu-btn');
        
        if (sidebar && menuBtn) {
            sidebar.classList.toggle('open');
            menuBtn.classList.toggle('active');
        }
    }

    hideSidebar() {
        const sidebar = document.getElementById('sidebar');
        const menuBtn = document.getElementById('menu-btn');
        
        if (sidebar && menuBtn) {
            sidebar.classList.remove('open');
            menuBtn.classList.remove('active');
        }
    }

    // Settings functionality
    showSettings() {
        const settingsModal = document.getElementById('settings-modal');
        if (settingsModal) {
            settingsModal.classList.remove('hidden');
        }
    }

    hideSettings() {
        const settingsModal = document.getElementById('settings-modal');
        if (settingsModal) {
            settingsModal.classList.add('hidden');
        }
    }

    // Bookmarks functionality
    showBookmarks() {
        const bookmarksModal = document.getElementById('bookmarks-modal');
        const bookmarksList = document.getElementById('bookmarks-list');
        
        if (bookmarksModal && bookmarksList) {
            this.loadBookmarksList();
            bookmarksModal.classList.remove('hidden');
        }
    }

    hideBookmarks() {
        const bookmarksModal = document.getElementById('bookmarks-modal');
        if (bookmarksModal) {
            bookmarksModal.classList.add('hidden');
        }
    }

    loadBookmarksList() {
        const bookmarksList = document.getElementById('bookmarks-list');
        if (!bookmarksList) return;

        const bookmarks = window.storageManager.getBookmarks();
        
        if (bookmarks.length === 0) {
            bookmarksList.innerHTML = '<div class="no-bookmarks">No bookmarks yet. Start bookmarking your favorite modules!</div>';
            return;
        }

        const bookmarksHtml = bookmarks.map(bookmark => `
            <div class="bookmark-item" data-module-id="${bookmark.moduleId}">
                <div class="bookmark-title">${bookmark.title}</div>
                <div class="bookmark-path">${bookmark.path}</div>
                <div class="bookmark-content">${bookmark.content}</div>
                <div class="bookmark-date">${window.storageManager.formatRelativeTime(bookmark.createdAt)}</div>
            </div>
        `).join('');

        bookmarksList.innerHTML = bookmarksHtml;

        // Add click handlers
        bookmarksList.querySelectorAll('.bookmark-item').forEach(item => {
            item.addEventListener('click', () => {
                const moduleId = item.dataset.moduleId;
                this.loadModule(moduleId);
                this.hideBookmarks();
            });
        });
    }

    // Theme and appearance
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Add transition class temporarily
        document.body.classList.add('theme-transitioning');
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);
    }

    applyFontSize(size) {
        document.documentElement.setAttribute('data-font-size', size);
        this.updateFontSizeDisplay();
    }

    applyFontFamily(family) {
        document.documentElement.setAttribute('data-font', family);
    }

    applyLineSpacing(spacing) {
        document.documentElement.setAttribute('data-line-spacing', spacing);
    }

    updateFontSizeDisplay() {
        const fontSizeDisplay = document.getElementById('font-size-display');
        if (fontSizeDisplay) {
            const currentSize = window.storageManager.getSetting('fontSize');
            const sizeNames = {
                'small': 'Small',
                'medium': 'Medium',
                'large': 'Large',
                'extra-large': 'Extra Large'
            };
            fontSizeDisplay.textContent = sizeNames[currentSize] || 'Medium';
        }
    }

    decreaseFontSize() {
        const sizes = ['small', 'medium', 'large', 'extra-large'];
        const currentSize = window.storageManager.getSetting('fontSize');
        const currentIndex = sizes.indexOf(currentSize);
        
        if (currentIndex > 0) {
            const newSize = sizes[currentIndex - 1];
            this.applyFontSize(newSize);
            window.storageManager.setSetting('fontSize', newSize);
        }
    }

    increaseFontSize() {
        const sizes = ['small', 'medium', 'large', 'extra-large'];
        const currentSize = window.storageManager.getSetting('fontSize');
        const currentIndex = sizes.indexOf(currentSize);
        
        if (currentIndex < sizes.length - 1) {
            const newSize = sizes[currentIndex + 1];
            this.applyFontSize(newSize);
            window.storageManager.setSetting('fontSize', newSize);
        }
    }

    // Data management
    exportData() {
        try {
            window.storageManager.exportData();
            this.showNotification('Data exported successfully!', 'success');
        } catch (error) {
            console.error('Export failed:', error);
            this.showNotification('Failed to export data', 'error');
        }
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            try {
                await window.storageManager.importData(file);
                this.showNotification('Data imported successfully!', 'success');
                this.updateStats();
                this.updateProgress();
                this.loadSidebarContent();
            } catch (error) {
                console.error('Import failed:', error);
                this.showNotification('Failed to import data', 'error');
            }
        };
        
        input.click();
    }

    resetProgress() {
        if (window.storageManager.resetAllData()) {
            this.showNotification('All data reset successfully!', 'success');
            this.updateStats();
            this.updateProgress();
            this.loadSidebarContent();
            this.showWelcomeScreen();
        }
    }

    // Statistics and progress
    updateStats() {
        const analytics = window.storageManager.getAnalytics();
        
        // Update welcome screen stats
        const totalModulesEl = document.getElementById('total-modules');
        const completedModulesEl = document.getElementById('completed-modules');
        const bookmarkedCountEl = document.getElementById('bookmarked-count');
        const studyStreakEl = document.getElementById('study-streak');

        if (totalModulesEl) totalModulesEl.textContent = analytics.totalModules;
        if (completedModulesEl) completedModulesEl.textContent = analytics.completedModules;
        if (bookmarkedCountEl) bookmarkedCountEl.textContent = analytics.bookmarksCount;
        if (studyStreakEl) studyStreakEl.textContent = analytics.studyStreak;

        // Update sidebar progress
        this.updateSidebarProgress();
    }

    updateSidebarProgress() {
        const analytics = window.storageManager.getAnalytics();
        
        // Overall progress
        const overallProgressEl = document.getElementById('overall-progress-text');
        if (overallProgressEl) {
            overallProgressEl.textContent = `${analytics.completionRate}%`;
        }

        // Path-specific progress
        const dsaProgress = this.calculatePathProgress('dsa');
        const infrastructureProgress = this.calculatePathProgress('infrastructure');

        const dsaProgressEl = document.getElementById('dsa-progress');
        const infrastructureProgressEl = document.getElementById('infrastructure-progress');

        if (dsaProgressEl) dsaProgressEl.textContent = `${dsaProgress}%`;
        if (infrastructureProgressEl) infrastructureProgressEl.textContent = `${infrastructureProgress}%`;
    }

    calculatePathProgress(pathId) {
        const modules = window.contentManager.getModules(pathId);
        if (modules.length === 0) return 0;

        const completedCount = modules.filter(module => {
            const progress = window.storageManager.getProgress(module.id);
            return progress.completed;
        }).length;

        return Math.round((completedCount / modules.length) * 100);
    }

    updateProgress() {
        // Update reading progress bar based on scroll position
        const contentArea = document.getElementById('content-area');
        const progressBar = document.getElementById('reading-progress');
        
        if (contentArea && progressBar) {
            const updateProgressBar = () => {
                const scrollTop = contentArea.scrollTop;
                const scrollHeight = contentArea.scrollHeight - contentArea.clientHeight;
                const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
                progressBar.style.width = `${Math.min(progress, 100)}%`;
            };

            contentArea.addEventListener('scroll', updateProgressBar);
            updateProgressBar(); // Initial update
        }
    }

    // Utility functions
    handleUrlParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const path = urlParams.get('path');
        const moduleId = urlParams.get('module');
        const view = urlParams.get('view');

        if (moduleId) {
            this.loadModule(moduleId);
        } else if (path) {
            this.togglePathModules(path);
        } else if (view === 'bookmarks') {
            this.showBookmarks();
        }
    }

    showLoadingIndicator() {
        // Add loading indicator to current content area
        const contentBody = document.getElementById('content-body');
        if (contentBody) {
            contentBody.innerHTML = '<div class="loading-content"><div class="loading-spinner"></div><p>Loading...</p></div>';
        }
    }

    hideLoadingIndicator() {
        // Loading indicator will be replaced by content
    }

    showError(message) {
        const contentBody = document.getElementById('content-body');
        if (contentBody) {
            contentBody.innerHTML = `<div class="error-message"><h2>Error</h2><p>${message}</p></div>`;
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Hide and remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    hideAllModals() {
        this.hideSearch();
        this.hideSettings();
        this.hideBookmarks();
    }

    // Global functions for HTML onclick handlers
    showPath(pathId) {
        this.togglePathModules(pathId);
        this.hideSidebar();
    }

    showBookmarksFromWelcome() {
        this.showBookmarks();
    }

    showSettingsFromWelcome() {
        this.showSettings();
    }
}

// Global functions for HTML onclick handlers
window.showPath = function(pathId) {
    if (window.app) {
        window.app.showPath(pathId);
    }
};

window.showBookmarks = function() {
    if (window.app) {
        window.app.showBookmarksFromWelcome();
    }
};

window.showSettings = function() {
    if (window.app) {
        window.app.showSettingsFromWelcome();
    }
};

// Initialize the app
window.app = new LearningHubApp();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LearningHubApp;
}

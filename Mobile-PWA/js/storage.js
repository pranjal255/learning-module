// Storage Management for Learning Hub PWA
class StorageManager {
    constructor() {
        this.storageKey = 'learning-hub-data';
        this.defaultData = {
            progress: {},
            bookmarks: [],
            settings: {
                theme: 'light',
                fontSize: 'medium',
                fontFamily: 'inter',
                lineSpacing: 'normal'
            },
            stats: {
                totalModules: 0,
                completedModules: 0,
                studyStreak: 0,
                lastStudyDate: null
            },
            currentModule: null,
            lastAccessed: Date.now()
        };
        this.data = this.loadData();
        this.initializeEventListeners();
    }

    // Load data from localStorage
    loadData() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Merge with defaults to ensure all properties exist
                return { ...this.defaultData, ...parsed };
            }
        } catch (error) {
            console.error('Error loading data from localStorage:', error);
        }
        return { ...this.defaultData };
    }

    // Save data to localStorage
    saveData() {
        try {
            this.data.lastAccessed = Date.now();
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            this.dispatchStorageEvent('data-saved', this.data);
        } catch (error) {
            console.error('Error saving data to localStorage:', error);
        }
    }

    // Progress Management
    getProgress(moduleId) {
        return this.data.progress[moduleId] || {
            completed: false,
            completedAt: null,
            timeSpent: 0,
            lastAccessed: null
        };
    }

    setProgress(moduleId, progressData) {
        if (!this.data.progress[moduleId]) {
            this.data.progress[moduleId] = {
                completed: false,
                completedAt: null,
                timeSpent: 0,
                lastAccessed: null
            };
        }
        
        Object.assign(this.data.progress[moduleId], progressData);
        this.data.progress[moduleId].lastAccessed = Date.now();
        
        // Update stats
        this.updateStats();
        this.saveData();
        this.dispatchStorageEvent('progress-updated', { moduleId, progress: this.data.progress[moduleId] });
    }

    markModuleComplete(moduleId) {
        const now = Date.now();
        this.setProgress(moduleId, {
            completed: true,
            completedAt: now
        });
        
        // Update study streak
        this.updateStudyStreak();
        this.dispatchStorageEvent('module-completed', { moduleId, completedAt: now });
    }

    markModuleIncomplete(moduleId) {
        this.setProgress(moduleId, {
            completed: false,
            completedAt: null
        });
        this.updateStats();
        this.dispatchStorageEvent('module-uncompleted', { moduleId });
    }

    // Bookmark Management
    addBookmark(moduleId, title, path, content = '') {
        const bookmark = {
            id: Date.now().toString(),
            moduleId,
            title,
            path,
            content: content.substring(0, 200), // Store snippet
            createdAt: Date.now()
        };
        
        // Check if bookmark already exists
        const existingIndex = this.data.bookmarks.findIndex(b => b.moduleId === moduleId);
        if (existingIndex !== -1) {
            this.data.bookmarks[existingIndex] = bookmark;
        } else {
            this.data.bookmarks.unshift(bookmark);
        }
        
        this.saveData();
        this.dispatchStorageEvent('bookmark-added', bookmark);
        return bookmark;
    }

    removeBookmark(moduleId) {
        const index = this.data.bookmarks.findIndex(b => b.moduleId === moduleId);
        if (index !== -1) {
            const removed = this.data.bookmarks.splice(index, 1)[0];
            this.saveData();
            this.dispatchStorageEvent('bookmark-removed', removed);
            return removed;
        }
        return null;
    }

    getBookmarks() {
        return [...this.data.bookmarks].sort((a, b) => b.createdAt - a.createdAt);
    }

    isBookmarked(moduleId) {
        return this.data.bookmarks.some(b => b.moduleId === moduleId);
    }

    // Settings Management
    getSetting(key) {
        return this.data.settings[key];
    }

    setSetting(key, value) {
        this.data.settings[key] = value;
        this.saveData();
        this.dispatchStorageEvent('setting-changed', { key, value });
    }

    getSettings() {
        return { ...this.data.settings };
    }

    updateSettings(newSettings) {
        Object.assign(this.data.settings, newSettings);
        this.saveData();
        this.dispatchStorageEvent('settings-updated', this.data.settings);
    }

    // Stats Management
    updateStats() {
        const completedCount = Object.values(this.data.progress).filter(p => p.completed).length;
        this.data.stats.completedModules = completedCount;
        
        // Calculate total modules (this would be set by the content loader)
        if (window.learningContent) {
            this.data.stats.totalModules = this.getTotalModulesCount();
        }
    }

    getTotalModulesCount() {
        // This will be implemented when content is loaded
        return this.data.stats.totalModules || 0;
    }

    updateStudyStreak() {
        const today = new Date().toDateString();
        const lastStudyDate = this.data.stats.lastStudyDate;
        
        if (!lastStudyDate) {
            // First study session
            this.data.stats.studyStreak = 1;
        } else {
            const lastDate = new Date(lastStudyDate).toDateString();
            const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
            
            if (lastDate === today) {
                // Already studied today, no change
                return;
            } else if (lastDate === yesterday) {
                // Consecutive day
                this.data.stats.studyStreak += 1;
            } else {
                // Streak broken
                this.data.stats.studyStreak = 1;
            }
        }
        
        this.data.stats.lastStudyDate = today;
        this.saveData();
    }

    getStats() {
        return { ...this.data.stats };
    }

    // Current Module Management
    setCurrentModule(moduleId) {
        this.data.currentModule = moduleId;
        this.saveData();
        this.dispatchStorageEvent('current-module-changed', moduleId);
    }

    getCurrentModule() {
        return this.data.currentModule;
    }

    // Data Export/Import
    exportData() {
        const exportData = {
            ...this.data,
            exportedAt: Date.now(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `learning-hub-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.dispatchStorageEvent('data-exported', exportData);
    }

    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    
                    // Validate imported data
                    if (this.validateImportedData(importedData)) {
                        // Merge with current data (keeping current settings if preferred)
                        const shouldMerge = confirm('Do you want to merge with existing data? Click Cancel to replace all data.');
                        
                        if (shouldMerge) {
                            // Merge progress and bookmarks
                            this.data.progress = { ...this.data.progress, ...importedData.progress };
                            this.data.bookmarks = [...this.data.bookmarks, ...importedData.bookmarks];
                            // Remove duplicates
                            this.data.bookmarks = this.data.bookmarks.filter((bookmark, index, self) =>
                                index === self.findIndex(b => b.moduleId === bookmark.moduleId)
                            );
                        } else {
                            // Replace all data
                            this.data = { ...this.defaultData, ...importedData };
                        }
                        
                        this.updateStats();
                        this.saveData();
                        this.dispatchStorageEvent('data-imported', this.data);
                        resolve(this.data);
                    } else {
                        reject(new Error('Invalid data format'));
                    }
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    validateImportedData(data) {
        // Basic validation
        return data && 
               typeof data === 'object' &&
               (data.progress || data.bookmarks || data.settings);
    }

    // Reset all data
    resetAllData() {
        if (confirm('Are you sure you want to reset all progress, bookmarks, and settings? This cannot be undone.')) {
            this.data = { ...this.defaultData };
            this.saveData();
            this.dispatchStorageEvent('data-reset', this.data);
            return true;
        }
        return false;
    }

    // Search functionality
    searchBookmarks(query) {
        const lowercaseQuery = query.toLowerCase();
        return this.data.bookmarks.filter(bookmark =>
            bookmark.title.toLowerCase().includes(lowercaseQuery) ||
            bookmark.path.toLowerCase().includes(lowercaseQuery) ||
            bookmark.content.toLowerCase().includes(lowercaseQuery)
        );
    }

    // Get learning analytics
    getAnalytics() {
        const progress = Object.values(this.data.progress);
        const completedModules = progress.filter(p => p.completed);
        const totalTimeSpent = progress.reduce((total, p) => total + (p.timeSpent || 0), 0);
        
        return {
            totalModules: this.data.stats.totalModules,
            completedModules: completedModules.length,
            completionRate: this.data.stats.totalModules > 0 ? 
                (completedModules.length / this.data.stats.totalModules * 100).toFixed(1) : 0,
            totalTimeSpent,
            averageTimePerModule: completedModules.length > 0 ? 
                Math.round(totalTimeSpent / completedModules.length) : 0,
            studyStreak: this.data.stats.studyStreak,
            bookmarksCount: this.data.bookmarks.length,
            lastStudyDate: this.data.stats.lastStudyDate,
            recentActivity: this.getRecentActivity()
        };
    }

    getRecentActivity() {
        const activities = [];
        
        // Recent completions
        Object.entries(this.data.progress)
            .filter(([_, progress]) => progress.completed && progress.completedAt)
            .sort((a, b) => b[1].completedAt - a[1].completedAt)
            .slice(0, 5)
            .forEach(([moduleId, progress]) => {
                activities.push({
                    type: 'completion',
                    moduleId,
                    timestamp: progress.completedAt,
                    description: `Completed module`
                });
            });
        
        // Recent bookmarks
        this.data.bookmarks
            .slice(0, 3)
            .forEach(bookmark => {
                activities.push({
                    type: 'bookmark',
                    moduleId: bookmark.moduleId,
                    timestamp: bookmark.createdAt,
                    description: `Bookmarked: ${bookmark.title}`
                });
            });
        
        return activities
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 10);
    }

    // Event system for reactive updates
    initializeEventListeners() {
        this.eventListeners = {};
    }

    addEventListener(event, callback) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(callback);
    }

    removeEventListener(event, callback) {
        if (this.eventListeners[event]) {
            const index = this.eventListeners[event].indexOf(callback);
            if (index > -1) {
                this.eventListeners[event].splice(index, 1);
            }
        }
    }

    dispatchStorageEvent(event, data) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in storage event listener for ${event}:`, error);
                }
            });
        }
        
        // Also dispatch as custom DOM event
        window.dispatchEvent(new CustomEvent(`storage:${event}`, { detail: data }));
    }

    // Utility methods
    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }

    formatDate(timestamp) {
        return new Date(timestamp).toLocaleDateString();
    }

    formatRelativeTime(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else {
            return 'Just now';
        }
    }
}

// Initialize storage manager
window.storageManager = new StorageManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
}

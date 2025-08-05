# Learning Hub PWA 🎓

A complete Progressive Web App for accessing your DSA/C++ and Infrastructure/SRE learning materials on mobile devices.

## 🌟 Features

### 📱 Mobile-First Design
- **Responsive layout** that works perfectly on phones and tablets
- **Touch-friendly interface** with large tap targets
- **Swipe gestures** for navigation
- **Optimized for one-handed use**

### 🔄 Progressive Web App
- **Offline functionality** - access content without internet
- **Install on home screen** like a native app
- **Background sync** for progress tracking
- **Push notifications** (future feature)
- **Fast loading** with service worker caching

### 🎨 Customizable Experience
- **4 themes**: Light, Dark, Sepia, High Contrast
- **4 font sizes**: Small, Medium, Large, Extra Large
- **3 font families**: Inter, System, Serif, Monospace
- **3 line spacings**: Compact, Normal, Relaxed
- **Accessibility features** for better usability

### 📚 Learning Features
- **Progress tracking** with completion status
- **Bookmarking system** for favorite content
- **Search functionality** across all materials
- **Reading progress indicator**
- **Study streak tracking**
- **Module navigation** with previous/next buttons

### 💾 Data Management
- **Local storage** for offline access
- **Export/import** progress data
- **Backup and restore** functionality
- **Cross-device sync** (manual)

## 🚀 Getting Started

### Option 1: Direct Access
1. Open `index.html` in your mobile browser
2. Tap the "Add to Home Screen" option when prompted
3. Launch the app from your home screen

### Option 2: Local Server (Recommended)
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` on your mobile device.

### Option 3: GitHub Pages
1. Push the `Mobile-PWA` folder to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Access via the provided GitHub Pages URL

## 📁 Project Structure

```
Mobile-PWA/
├── index.html              # Main app entry point
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker for offline functionality
├── css/
│   ├── app.css            # Main application styles
│   └── themes.css         # Theme variations
├── js/
│   ├── app.js             # Main application logic
│   ├── content.js         # Learning content data
│   └── storage.js         # Local storage management
├── icons/
│   ├── generate-icons.html # Icon generator utility
│   └── icon-*.png         # PWA icons (generate these)
└── README.md              # This file
```

## 🛠️ Setup Instructions

### 1. Generate Icons
1. Open `icons/generate-icons.html` in your browser
2. Right-click and save each generated icon
3. Save them in the `icons/` folder with the correct names

### 2. Customize Content
Edit `js/content.js` to add your own learning materials:

```javascript
// Add new modules to existing paths
window.learningContent.dsa.modules.push({
    id: 'your-module-id',
    title: 'Your Module Title',
    description: 'Module description',
    path: 'DSA & C++ > Category > Module',
    category: 'Category',
    estimatedTime: '2-3 hours',
    difficulty: 'Beginner',
    content: `# Your Content Here
    
    Write your content in markdown format...`
});
```

### 3. Deploy
Choose your preferred deployment method:

- **GitHub Pages**: Push to GitHub and enable Pages
- **Netlify**: Drag and drop the folder
- **Vercel**: Connect your GitHub repository
- **Firebase Hosting**: Use Firebase CLI
- **Your own server**: Upload files via FTP/SSH

## 📱 Mobile Installation

### iOS (Safari)
1. Open the PWA in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Confirm installation

### Android (Chrome)
1. Open the PWA in Chrome
2. Tap the menu (three dots)
3. Select "Add to Home screen"
4. Confirm installation

### Alternative: Manual Bookmark
If PWA installation isn't available:
1. Bookmark the page
2. Add bookmark to home screen
3. Access via bookmark

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `/` | Open search |
| `Escape` | Close modals |
| `Alt + ←` | Previous module |
| `Alt + →` | Next module |
| `Ctrl/Cmd + B` | Toggle bookmark |
| `Ctrl/Cmd + M` | Toggle sidebar |

## 🎯 Usage Tips

### For Students
- **Start with welcome screen** to see your progress
- **Use bookmarks** to save important modules
- **Track completion** to monitor your learning journey
- **Search content** to find specific topics quickly
- **Adjust settings** for comfortable reading

### For Instructors
- **Customize content** in `content.js`
- **Add new learning paths** by extending the content structure
- **Monitor usage** through browser developer tools
- **Export student progress** for assessment

## 🔧 Customization

### Adding New Themes
Edit `css/themes.css`:

```css
[data-theme="your-theme"] {
    --primary-color: #your-color;
    --bg-primary: #your-bg;
    /* Add more variables */
}
```

### Adding New Content Categories
Extend the content structure in `js/content.js`:

```javascript
window.learningContent.newPath = {
    id: 'new-path',
    title: 'New Learning Path',
    description: 'Description',
    modules: [/* your modules */]
};
```

### Modifying UI Components
- **Styles**: Edit `css/app.css`
- **Layout**: Modify `index.html`
- **Functionality**: Update `js/app.js`

## 🐛 Troubleshooting

### PWA Not Installing
- Ensure HTTPS or localhost
- Check manifest.json validity
- Verify service worker registration
- Clear browser cache

### Content Not Loading
- Check browser console for errors
- Verify content.js syntax
- Ensure all files are accessible
- Test with browser developer tools

### Offline Mode Issues
- Check service worker status
- Verify cached resources
- Clear application data and retry
- Test network connectivity

### Performance Issues
- Optimize images and content
- Minimize JavaScript execution
- Use browser performance tools
- Consider content pagination

## 🔒 Privacy & Security

- **Local storage only** - no data sent to external servers
- **No tracking** or analytics by default
- **Offline-first** approach protects privacy
- **User controls** all data export/import

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on mobile devices
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review browser console errors
3. Test on different devices/browsers
4. Create an issue with detailed information

## 🚀 Future Enhancements

- [ ] Push notifications for study reminders
- [ ] Cloud sync for cross-device progress
- [ ] Interactive code editor
- [ ] Video content support
- [ ] Collaborative features
- [ ] Advanced analytics
- [ ] Multiple language support
- [ ] Voice navigation

---

**Happy Learning!** 🎓📱

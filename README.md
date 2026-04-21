# Realme X7 Max Community Archive (V2) 🍱

A modern, high-performance community file hosting site for the **Realme X7 Max / GT Neo** family (RMX3031, RMX3350). This version features a premium "Bento" design with dynamic data fetching and a full-featured administrative backend.

## 🚀 Live Links

- **Main Website:** [rmx3031-archive.pages.dev](https://rmx3031-archive.pages.dev)
- **Admin Management:** [rmx3031-archive.pages.dev/admin.html](https://rmx3031-archive.pages.dev/admin.html)
- **File Storage:** [Internet Archive (xCaptaiN09)](https://archive.org/details/@xcaptain09)

---

## ✨ Features

- **Dynamic Bento UI:** Interactive cards for ROMs, Kernels, and Recoveries with 3D tilt effects.
- **Auto-Sorting:** All entries are automatically sorted by release date (newest first).
- **Live Transmission Feed:** A high-impact showcase of the 8 most recent ROM builds.
- **Searchable Archive:** Tabbed navigation and accordions to browse through 65+ preserved files.
- **Universal Admin Panel:** A standalone management tool that commits directly to GitHub via API.
- **Data-Driven:** The entire site is powered by a single `public/index.json` file.

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS + Shadcn UI
- **Animations:** GSAP + CSS Transforms
- **Hosting:** Cloudflare Pages
- **Database:** JSON (GitHub Hosted)

---

## 👨‍💻 Administrative Workflow

### 1. Uploading Files
All actual build files are hosted on the **Internet Archive** to ensure they never die.
```bash
ia upload item-id filename.zip --metadata="creator:xCaptaiN09"
```

### 2. Updating the Site
1. Open the [Admin Panel](https://rmx3031-archive.pages.dev/admin.html).
2. Connect using your **GitHub Personal Access Token**.
3. Add, Edit, or Delete entries. 
4. The panel will commit changes to `public/index.json`, and Cloudflare will automatically rebuild the site in ~60 seconds.

---

## 📜 Development

To run the project locally for testing:

**Maintained by [xCaptaiN09](https://github.com/xCaptaiN09)**  
*For the Realme X7 Max Community.*

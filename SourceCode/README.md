# **Svelte & NW\.js for Windows XP**

This repository provides a **template** for creating **Windows XP-compatible** software using **NW\.js 15.4** (the last XP-supported version) and **SvelteKit** for a lightweight and efficient UI framework.

---

## **🔧 Prerequisites**

### **1️⃣ Node.js & NVM Setup**

- Install **NVM** and **Node.js v6.2.2** (matching NW\.js 0.15.4’s internal Node.js version).
- This ensures that incompatible code is **detected early**.

### **2️⃣ Folder Structure**

```
BuiltApp/
└── XPlor/
    ├── locales/
    ├── package.nw/
    │   ├── fonts/
    │   ├── images/
    │   ├── public/
    │   │   ├── build/
    │   │   ├── data/
    │   │   ├── ignore/
    │   │   ├── images/
    │   │   ├── scripts_compiled/
NW_Cache/
├── nwjs-sdk-v0.15.4-win-ia32/
│   ├── locales/
│   ├── pnacl/
├── nwjs-sdk-v0.93.0-win-x64/
│   ├── locales/
│   ├── swiftshader/
├── nwjs-v0.12.3-win-ia32/
│   ├── locales/
├── NWTemp/
│   ├── nwjs-sdk-v0.15.4-win-ia32/
│   │   ├── locales/
│   │   ├── pnacl/
│   ├── nwjs-v0.12.3-win-ia32/
│   │   ├── locales/
│   ├── nwjs-v0.15.4-win-ia32/
│       ├── locales/
├── package.nw/
│   ├── public/
│   │   ├── scripts/
│   │       ├── executables/
SourceCode/   <== 🗂 This Repository
├── rollup.config.js
├── package.json
├── CompileBabel.js
├── BuildApp.js
├── .env
├── .gitignore
├── BuildAppTools/
│   ├── npmInstall.cmd
├── fonts/
├── images/
├── lib/
│   ├── dts/
│   │   ├── jquery/
├── node_modules/
├── public/
│   ├── index.html
│   ├── package.json
│   ├── global.css
│   ├── devTools.js
│   ├── build/
│   │   ├── bundle.js
│   │   ├── bundle.css
│   ├── scripts_compiled/
│   │   ├── executables/
│   │   ├── main/
│   │   ├── modules/
├── src/
│   ├── main.js
│   ├── App.svelte
│   ├── components/
│   ├── scripts/
│   │   ├── main/
│   │   ├── modules/

```

---

## **🚀 Development Workflow**

### **1️⃣ Start Development Mode**

```sh
npm run dev
```

- This compiles `src/` into `public/build/bundle.js`
- Refresh the app to see changes.

### **2️⃣ Building for Release**

```sh
node BuildApp.js
```

- Modify `BuildApp.js` before running.
- Output location:
  ```
  BuiltApp/{YourProjectName}/{YourProjectName}.exe
  ```

---

## **📦 Running Multiple Instances**

Include **multipleInstances.js** in **index.html**:

```html
<script src="multipleInstances.js"></script>
```

**Why?**

- NW\.js prevents multiple instances of the same package.json **by default**.
- This script generates a **UUID-based** app name per run.

**⚠ Issue:** NW\.js fills `%LOCALAPPDATA%` with `{AppName}-{RandomNumber}` folders.\
**Solution:** Use the following launch parameter:

```sh
--user-data-dir=./NWProfile
```

- This **anchors all profiles** into `NWProfile/`, avoiding clutter.

---

## **🔒 Packing & Hiding Source Code**

To **hide your source code** inside the executable:

1. Navigate to `package.nw`
2. **Select all files → Zip them**
3. \**Rename **`package.zip`**** → \***`package.nw`**
4. **Merge into the executable**:
   ```sh
   copy /b YourProject.exe+package.nw FinalExecutable.exe
   ```
5. **Done!** Your code is now **embedded** in the EXE.

> **⚠ Warning:** NW\.js **extracts the package on launch**, so this **slows down startup**\
> depending on **file count and size**.

---

## **⚠ Important Notes About NW\.js & Windows XP**

Any NW\.js version **higher than 0.12.3** has an issue on **Windows XP**:

- If you use `child_process`, `http`, or `https`, and there is **no internet**, the application will **crash**.
- **For offline applications, use NW\.js 0.12.3**.
- **For online applications, use NW\.js 0.15.4**.

---

## **🛠 Built-in Utilities**

| File                       | Description                                      |
| -------------------------- | ------------------------------------------------ |
| **`element.js`**           | Utility functions for HTML element calculations. |
| **`multipleInstances.js`** | Enables **multiple NW\.js instances** at once.   |

---

## **🛠 Developer Instructions**

### **📌 Setting Up NW\.js Versions**.

1. Open **`package.json`**, add available **NW\.js versions**.
2. Set the **desired version** in **`.env`** (set `APPLICATION_NAME` here).
3. Run:
   ```sh
   npm run dev
   ```

### **📌 JavaScript Modules**

If you're using **custom .js scripts**:

#### **1️⃣ Write Your Scripts**

- Place them inside:
  ```
  src/scripts/**/*
  ```

#### **2️⃣ Watch & Compile JS**

```sh
npm run watch_js_modules
```

#### **3️⃣ File Output**

- **For NW\.js `0.15.4` and earlier** → **Transpiled with Babel**\
  → Stored in `public/scripts_compiled/**/*`
- **For NW\.js `0.16+`** → **Only copied**, no transpilation.

#### **4️⃣ Include Scripts**

```html
<script src="public/scripts_compiled/my_script.js"></script>
```

---

## **📦 Creating a Portable Build**

1. Modify `public/package.json`
2. Adjust & run:
   ```sh
   node BuildApp.js
   ```
3. Final **portable version** in:
   ```
   BuiltApp/{YourProjectName}/
   ```
4. **Optional:** Create an **installer** in the **root directory**.
   - Configure `.env` with `APPLICATION_NAME`
   - Use `Inno Setup` or similar to package everything.
   - For reference, check the XPCode repository.

---

## **📢 Future Improvements**

- **SCSS support**
- **Enhanced build automation**
- **Better XP compatibility**

## [See also](/SourcesAndDocs.md)
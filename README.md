# 3D Product Customizer

An interactive 3D product customizer featuring a shoe model with real-time color and material customization. Built with **Next.js** and **Three.js**.

![Product Viewer](https://via.placeholder.com/800x400?text=3D+Product+Customizer)

## Features

- 🎨 **Color Customization**: 5 color swatches (Mint, Purple, Grey, Black, Pink)
- ✨ **Material Options**: Plain and Textured material variants
- 🔄 **360° View**: Orbit controls for full product viewing
- 🎬 **Auto-Rotation**: Slow rotation animation that pauses during interaction
- 📱 **Responsive**: Works on desktop and mobile devices
- ⚡ **Performance Optimized**: Pixel ratio capping, efficient rendering loop

## Tech Stack

- **Next.js 15** - React framework with App Router
- **Three.js** - 3D graphics library
- **TypeScript** - Type safety
- **CSS Modules** - Scoped styling

## Project Structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Main page
│   └── globals.css      # Global styles
├── components/
│   ├── ProductViewer.tsx    # Main 3D viewer wrapper
│   ├── ColorPalette.tsx     # Color swatch component
│   ├── MaterialPalette.tsx  # Material options component
│   └── ResetButton.tsx      # Reset button component
└── core/
    ├── App.js               # Main Three.js orchestrator
    ├── RendererManager.js   # WebGL renderer setup
    ├── SceneManager.js      # Scene & pedestal
    ├── CameraManager.js     # Camera configuration
    ├── LightingManager.js   # Lighting setup
    ├── ControlsManager.js   # OrbitControls
    ├── ModelManager.js      # GLTF loading & materials
    └── AnimationManager.js  # Rotation animation
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Product-Viewer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- **Rotate View**: Click and drag on the 3D canvas
- **Zoom**: Scroll wheel or pinch gesture
- **Change Color**: Click on any color swatch
- **Change Material**: Click "Plain" or "Textured"
- **Reset**: Click the reset button to restore initial state

## Model

The shoe model is loaded from the [glTF Sample Models repository](https://github.com/pushmatrix/glTF-Sample-Models/tree/master/2.0/MaterialsVariantsShoe).

## Color Palette

| Color  | Hex       |
|--------|-----------|
| Mint   | `#90b89b` |
| Purple | `#ada2ff` |
| Grey   | `#7a7a7a` |
| Black  | `#333333` |
| Pink   | `#ffbfe2` |

## Architecture

The application uses a clean separation between React (UI layer) and Three.js (3D rendering):

- **React Components**: Handle UI state and user interactions
- **Three.js Core**: Modular ES6 classes managing different aspects of 3D rendering
- **Communication**: Direct method calls via React refs

## Performance Considerations

- Pixel ratio capped at 2 for high-DPI displays
- No object recreation in animation loop
- Proper cleanup on component unmount
- Efficient shadow mapping configuration

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## License

MIT

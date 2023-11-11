# watcher

## Introduction

**watcher** is a JavaScript script for collecting usage data from browser-generated events. It centralizes its functionality into a global object named `watcher`. It sends its events to a running instance of a [watcher-server](https://github.com/pedrorv/watcher-server) and the events can be seen as data visualizations using the [watcher-dashboard](https://github.com/pedrorv/watcher-dashboard).

## Features

- Utilizes `DragTracker`, `KeyboardTracker`, `MouseTracker`, `UITracker`, and `WindowTracker`. Check each tracker's code to see the tracked events;
- Employs `MutationObserver` to monitor DOM changes for UI tracking;
- Manages event listeners for user interaction tracking.

## Installation

1. Clone the repository to your local machine.
2. Navigate to the project directory and run npm install to install all dependencies.
3. Build the project using npm run build. This will create a bundled file named watcher.js in the dist directory.
4. Add the dist/watcher.js file to the web page where you want to collect data.

## Usage

Initialize `watcher` with your application ID and server URL. The server URL must be a running instance of [watcher-server](https://github.com/pedrorv/watcher-server). The application ID should be a UUID [generated by you](https://www.uuidtools.com/v4).

### Initializing the Script

For effective tracking, initialize watcher upon page load. The init function returns a Promise, which can be awaited if necessary.

```javascript
import { init, stop, getSessionId } from "path/to/watcher";

window.addEventListener("load", async () => {
  await init("your-app-id", "your-watcher-server-url");

  // Optional: Retrieve the session ID
  const sessionId = getSessionId();
});
```

To stop the tracking, use the `stop` function:

```javascript
stop();
```

## Contributing

Contributions are welcome! Fork the repository and submit a pull request with your changes.

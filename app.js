document.addEventListener('DOMContentLoaded', function() {
    // Initialize the Gameboy
    const canvas = document.getElementById('screen');
    const soundToggle = document.getElementById('sound-toggle');
    const zoomSelect = document.getElementById('zoom-select');
    
    // Create drop zone for ROM files
    const container = document.querySelector('.container');
    const dropZone = new GameboyJS.RomDropFileReader(container);
    
    // Configure the gameboy with appropriate options
    const gameboy = new GameboyJS.Gameboy(canvas, {
        pad: {
            class: GameboyJS.Keyboard
        },
        zoom: parseInt(zoomSelect.value, 10),
        romReaders: [dropZone]
    });
    
    // Set up sound toggle
    soundToggle.addEventListener('change', function() {
        gameboy.setSoundEnabled(this.checked);
    });
    
    // Set up zoom selector
    zoomSelect.addEventListener('change', function() {
        gameboy.setScreenZoom(parseInt(this.value, 10));
    });
    
    // Set up touch controls for mobile devices
    setupTouchControls();
    
    // Initialize bootROM
    loadBootROM(gameboy.cpu);
    
    // Setup keyboard events (using the built-in keyboard handler)
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space') {
            // Example of pausing/unpausing the game with spacebar
            if (gameboy.cpu.isPaused) {
                gameboy.pause(false);
            } else {
                gameboy.pause(true);
            }
        }
    });
    
    function setupTouchControls() {
        const buttons = {
            'btn-up': 'UP',
            'btn-down': 'DOWN',
            'btn-left': 'LEFT',
            'btn-right': 'RIGHT',
            'btn-a': 'A',
            'btn-b': 'B',
            'btn-start': 'START',
            'btn-select': 'SELECT'
        };
        
        for (const [id, action] of Object.entries(buttons)) {
            const button = document.getElementById(id);
            
            // Touch events for mobile
            button.addEventListener('touchstart', function(e) {
                e.preventDefault();
                gameboy.input.pressKey(action);
            });
            
            button.addEventListener('touchend', function(e) {
                e.preventDefault();
                gameboy.input.releaseKey(action);
            });
            
            // Mouse events for desktop
            button.addEventListener('mousedown', function() {
                gameboy.input.pressKey(action);
            });
            
            button.addEventListener('mouseup', function() {
                gameboy.input.releaseKey(action);
            });
            
            // Prevent context menu on right-click
            button.addEventListener('contextmenu', function(e) {
                e.preventDefault();
            });
        }
    }
    
    function loadBootROM(cpu) {
        loadboot(cpu);
        cpu.run();
    }
});


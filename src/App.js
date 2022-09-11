import './App.css';
import * as React from 'react';

function App() {
  // add canvas 
  const canvasRef = React.useRef(null);
  const contextRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 300;
    canvas.height = 300;
    canvas.style.width = `300px`;
    canvas.style.height = `300px`;
      
    const context = canvas.getContext('2d');
    context.scale(2, 2);
    // add rectangle
    context.fillStyle = 'green';
    context.fillRect(40, 40, 100, 150);

    contextRef.current = context;
  }, []);

  // skew rectangle on joystick movement
  // x and y are values between -1 and 1
  // 0 is the center
  // -1 is the top or left
  // 1 is the bottom or right
  const handleJoystickMove = (event, data) => {
    const { x, y } = data;
    const context = contextRef.current;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, 300, 300);
    context.fillStyle = 'green';
    context.transform(1, 0, y, 1, 0, 0);
    context.transform(0, x, 0, 1, 0, 0);
    context.fillRect(40, 40, 100, 150);
  };

  // add event listener
  // skew rectangle on mouse move
  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    const { top, left } = canvasRef.current.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;

    // scale x and y down between -1 and 1
    const x1 = (x - 150) / 150;
    const y1 = (y - 150) / 150;

    contextRef.current.setTransform(1, 0, 0, 1, 0, 0);
    contextRef.current.clearRect(0, 0, 300, 300);
    contextRef.current.transform(1, y1, x1, 1, 0, 0);
    contextRef.current.fillStyle = 'green';
    contextRef.current.fillRect(40, 40, 100, 150);
  };

  const gameLoop = () => {
    // skew rectangle on axes change
    // x and y are values between -1 and 1
    //
    // 0 is the center
    //

    const gamepad = navigator.getGamepads()[0];
    if (gamepad) {
      const { axes } = gamepad;
      const x = axes[0];
      const y = axes[1];
      contextRef.current.setTransform(1, 0, 0, 1, 0, 0);
      contextRef.current.clearRect(0, 0, 300, 300);
      contextRef.current.transform(1, y, x, 1, 0, 0);
      contextRef.current.fillStyle = 'green';
      contextRef.current.fillRect(40, 40, 100, 150);
    }

    requestAnimationFrame(gameLoop);
  };

  const handleGamepadConnected = (event) => {
    const gp = navigator.getGamepads()[event.gamepad.index];
    const a = `Gamepad connected at index ${gp.index}: ${gp.id}. It has ${gp.buttons.length} buttons and ${gp.axes.length} axes.`;

    console.log(a);

    gameLoop();
  };

  React.useEffect(() => {
    //const canvas = canvasRef.current;
    // use joystick
    window.addEventListener('gamepadconnected', handleGamepadConnected);
    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
    };
  }, []);

  return (
    <div className="App">
      <canvas ref={canvasRef} />
    </div>
  );
}

export default App;

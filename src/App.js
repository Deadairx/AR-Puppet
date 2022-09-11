import './App.css';
import * as React from 'react';

function App() {
  // add canvas 
  const canvasRef = React.useRef(null);
  const contextRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 600;
    canvas.height = 600;
    canvas.style.width = `600px`;
    canvas.style.height = `600px`;
      
    const context = canvas.getContext('2d');
    // add rectangle
    context.fillStyle = 'green';
    context.fillRect(40, 40, 100, 150);

    context.fillStyle = 'teal';
    context.fillRect(340, 40, 100, 150);

    contextRef.current = context;
  }, []);

  const gameLoop = () => {
    // skew rectangle on axes change
    // x and y are values between -1 and 1
    //
    // 0 is the center
    //

    const gamepad = navigator.getGamepads()[0];
    if (gamepad) {
      const { axes } = gamepad;
      const lx = axes[0];
      const ly = axes[1];
      contextRef.current.setTransform(1, 0, 0, 1, 0, 0);
      contextRef.current.clearRect(0, 0, 600, 600);
      contextRef.current.transform(1, 0, 0+(lx * 0.3), 1+(ly * 0.3), 0, 0);
      contextRef.current.fillStyle = 'green';
      contextRef.current.fillRect(40, 40, 100, 150);

      const rx = axes[2];
      const ry = axes[3];
      contextRef.current.transform(1, 0, 0+(rx * 0.3), 1+(ry * 0.3), 0, 0);
      contextRef.current.fillStyle = 'teal';
      contextRef.current.fillRect(340, 40, 100, 150);
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

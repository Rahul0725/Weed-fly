/**
 * Native Gamepad API Controller integration with analog flight and haptic rumble
 */

export class GamepadController {
  private isConnected: boolean = false;
  private prevJumpPressed: boolean = false;

  constructor() {
    window.addEventListener('gamepadconnected', () => {
      this.isConnected = true;
    });
    window.addEventListener('gamepaddisconnected', () => {
      this.isConnected = false;
    });
  }

  public poll(onJump: () => void, onPause: () => void) {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const pad = gamepads[0];
    if (!pad) return;

    // Button 0 = A (Xbox) / X (PlayStation) / B (Switch)
    // Button 7 = Right Trigger
    const isJumpPressed = pad.buttons[0]?.pressed || pad.buttons[7]?.pressed;
    const isPausePressed = pad.buttons[9]?.pressed; // Start/Options button

    if (isJumpPressed && !this.prevJumpPressed) {
      onJump();
      this.triggerHaptic(0.2, 0.4, 80);
    }
    this.prevJumpPressed = !!isJumpPressed;

    if (isPausePressed) {
      onPause();
    }
  }

  public triggerHaptic(weakMagnitude: number = 0.3, strongMagnitude: number = 0.6, durationMs: number = 100) {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const pad = gamepads[0];
    if (pad && pad.vibrationActuator && pad.vibrationActuator.playEffect) {
      try {
        pad.vibrationActuator.playEffect('dual-rumble', {
          startDelay: 0,
          duration: durationMs,
          weakMagnitude,
          strongMagnitude
        });
      } catch {}
    }
  }

  public getIsConnected(): boolean {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    return !!gamepads[0];
  }
}

export const gamepadController = new GamepadController();

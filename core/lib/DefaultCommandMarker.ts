import BrowserContext from './BrowserContext';
import ICommandMarker from '../interfaces/ICommandMarker';

export class DefaultCommandMarker implements ICommandMarker {
  public get lastId(): number {
    return this.commandMarkerId;
  }

  public actions: string[] = [];

  private commandMarkerId = 0;
  private waitForLocationStartingMark = 0;

  constructor(readonly browserContext: BrowserContext) {}

  incrementMark(action: string): void {
    this.commandMarkerId += 1;
    const last = this.actions[this.actions.length - 1];
    if (last?.startsWith('waitFor')) {
      // handle cases like waitForLocation two times in a row
      if (!action.startsWith('waitFor') || action === 'waitForLocation') {
        this.waitForLocationStartingMark = this.commandMarkerId;
      }
    }
    if (action === 'goto') {
      this.waitForLocationStartingMark = this.commandMarkerId;
    }
    this.actions.push(action);
  }

  getStartingCommandIdFor(marker: 'waitForLocation'): number {
    if (marker === 'waitForLocation') {
      return this.waitForLocationStartingMark;
    }
    return 0;
  }
}

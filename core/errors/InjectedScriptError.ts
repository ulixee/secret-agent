import { IPathStep } from '@bureau/interfaces/IJsPath';

export default class InjectedScriptError extends Error {
  private readonly pathState: { step: IPathStep; index: number };
  constructor(message: string, pathState?: { step: IPathStep; index: number }) {
    super(message);
    this.pathState = pathState;
    this.name = 'InjectedScriptError';
  }

  public toJSON(): object {
    return {
      message: this.message,
      pathState: this.pathState,
    };
  }
}

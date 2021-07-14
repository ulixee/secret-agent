import IFileChooserPrompt from '@ulixee/hero-interfaces/IFileChooserPrompt';
import * as Fs from 'fs';
import AwaitedPath, { IJsPath } from 'awaited-dom/base/AwaitedPath';
import { createHTMLInputElement } from 'awaited-dom/impl/create';
import { IHTMLInputElement } from 'awaited-dom/base/interfaces/official';
import * as Path from 'path';
import CoreFrameEnvironment from './CoreFrameEnvironment';

export default class FileChooser {
  public acceptsMultipleFiles: boolean;
  public inputElement: IHTMLInputElement;

  readonly #jsPath: IJsPath;
  readonly #coreFrame: Promise<CoreFrameEnvironment>;

  constructor(coreFrame: Promise<CoreFrameEnvironment>, event: IFileChooserPrompt) {
    const awaitedPath = new AwaitedPath(null, ...event.jsPath);

    this.inputElement = createHTMLInputElement(awaitedPath, { coreFrame });
    this.acceptsMultipleFiles = event.selectMultiple;
    this.#jsPath = event.jsPath;
    this.#coreFrame = coreFrame;
  }

  public async chooseFiles(...files: (string | { name: string; data: Buffer })[]): Promise<void> {
    if (!files.length) throw new Error(`No files were provided to send to this input`);
    if (files.length > 1 && !this.acceptsMultipleFiles) {
      throw new Error(
        `This input only supports a single file input, but ${files.length} files were supplied`,
      );
    }
    const frame = await this.#coreFrame;
    const finalFiles: { name: string; data: Buffer }[] = [];
    for (const file of files) {
      if (typeof file === 'string') {
        const buffer = await Fs.promises.readFile(file);
        finalFiles.push({ data: buffer, name: Path.basename(file) });
      } else {
        finalFiles.push(file);
      }
    }
    await frame.setFileInputFiles(this.#jsPath, finalFiles);
  }
}

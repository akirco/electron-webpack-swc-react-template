import { desktopCapturer, protocol } from 'electron';
import fs from 'fs/promises';
import path from 'path';

export const captureScreen = async () => {
  const sources = desktopCapturer.getSources({
    types: ['screen'],
  });
  for await (const source of await sources) {
    const thumbnail = source.thumbnail.toPNG({ scaleFactor: 1 });
    fs.writeFile(
      path.join(process.cwd(), 'resources', `${source.name}.png`),
      thumbnail,
      {
        encoding: 'utf-8',
      }
    ).then(() => {
      console.log('completed!');
    });
  }
};

export async function registerProtocol(): Promise<void> {
  protocol.registerFileProtocol('images', (request, callback) => {
    const url = request.url.substring(7);
    callback(decodeURI(path.normalize(url)));
  });
}

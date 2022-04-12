import fs from 'fs';

export async function log(line: string) {
  await appendFile(line)
}

export async function appendFile(line: string) {
  return new Promise((resolve, reject) => {
    const date = new Date();
    fs.appendFile(
      `./src/db/log.txt`,
      `${date
        .toISOString()
        .replace('T', ' ')
        .replace('Z', '')
        .slice(0, -4)} - ${line}\n`,
      (error) => {
        if (!error) {
          resolve('ok');
        }
        reject(error);
      },
    );
  });
}

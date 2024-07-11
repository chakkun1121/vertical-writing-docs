export async function writeFile(fileHandle: FileSystemFileHandle, contents: string) {
  const writable = await fileHandle.createWritable();
  await writable.write(contents);
  await writable.close();
}

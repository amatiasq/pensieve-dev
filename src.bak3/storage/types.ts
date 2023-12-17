export type Integer = number;
export type FilePath = '[snowflake FilePath]';
export type FileFullPath = '[snowflake FileFullPath]';
export type FileHeader = '[snowflake FileHeader]';
export type FileContent = '[snowflake FileContent]';
export type FileMimeType = 'text/plain' | 'text/javascript';

export function FilePath(value: string): FilePath {
  return value as FilePath;
}

export function FileContent(value: string): FileContent {
  return value as FileContent;
}

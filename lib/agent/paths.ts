import path from 'node:path';

/**
 * All local tool file access is resolved from the project root so the tools
 * behave the same regardless of where the Next.js server was started.
 */
export const projectRoot = process.cwd();

export const dataDir = path.join(projectRoot, 'data');
export const outputDir = path.join(projectRoot, 'output');

/** Turns an absolute path into a project-relative path for safe display in the UI. */
export function toRelativePath(absolutePath: string): string {
  return path.relative(projectRoot, absolutePath);
}

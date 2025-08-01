import chalk from 'chalk';

export class Logger {
  private isDebug: boolean;

  constructor() {
    this.isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG === 'true';
  }

  info(message: string, ...args: any[]): void {
    console.log(chalk.blue(`[INFO] ${message}`), ...args);
  }

  warn(message: string, ...args: any[]): void {
    console.log(chalk.yellow(`[WARN] ${message}`), ...args);
  }

  error(message: string, ...args: any[]): void {
    console.error(chalk.red(`[ERROR] ${message}`), ...args);
  }

  debug(message: string, ...args: any[]): void {
    if (this.isDebug) {
      console.log(chalk.gray(`[DEBUG] ${message}`), ...args);
    }
  }

  success(message: string, ...args: any[]): void {
    console.log(chalk.green(`[SUCCESS] ${message}`), ...args);
  }

  setDebug(enabled: boolean): void {
    this.isDebug = enabled;
  }

  logProgress(current: number, total: number, message: string = 'Processing'): void {
    const percentage = Math.round((current / total) * 100);
    const progressBar = this.createProgressBar(percentage);
    process.stdout.write(`\r${chalk.cyan(`[${message}] ${progressBar} ${percentage}% (${current}/${total})`)}`);
    
    if (current === total) {
      process.stdout.write('\n');
    }
  }

  private createProgressBar(percentage: number, width: number = 20): string {
    const filled = Math.round((percentage / 100) * width);
    const empty = width - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  }
} 
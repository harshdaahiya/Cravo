export class LoggerService {
  public static log(message: string, ...optionalParams: any[]): void {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`, ...optionalParams);
  }

  public static error(message: string, ...optionalParams: any[]): void {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, ...optionalParams);
  }

  public static warn(message: string, ...optionalParams: any[]): void {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, ...optionalParams);
  }

  public static info(message: string, ...optionalParams: any[]): void {
    this.log(message, ...optionalParams);
  }
}

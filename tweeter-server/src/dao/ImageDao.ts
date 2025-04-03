export interface ImageDao {
  putImage(fileName: string, imageStringBase64Encoded: string): Promise<string>;
}

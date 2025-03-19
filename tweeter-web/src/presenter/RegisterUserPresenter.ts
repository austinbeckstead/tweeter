import { UserPresenter } from "./UserPresenter";
import { Buffer } from "buffer";

export class RegisterUserPresenter extends UserPresenter {
  private imageBytes = new Uint8Array();
  private _imageUrl = "";
  private _imageFileExtension = "";
  private _firstName = "";
  private _lastName = "";

  public registerUser(alias: string, password: string) {
    this.authenticateUser(
      alias,
      password,
      async (alias: string, password: string) => {
        return this.service.register(
          this.firstName,
          this.lastName,
          alias,
          password,
          this.imageBytes,
          this._imageFileExtension
        );
      },
      () => {
        return "register user";
      },
      () => {
        this.view.navigate("/");
      }
    );
  }

  //For abstraction implementation
  /*
  protected async authenticate(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    return this.service.register(
      this.firstName,
      this.lastName,
      alias,
      password,
      this.imageBytes,
      this._imageFileExtension
    );
  }
  protected getMessageString(): string {
    return "register user";
  }
  protected navigate(): void {
    this.view.navigate("/");
  }
  */

  //Image handling unique to register
  handleImageFile = (file: File | undefined) => {
    if (file) {
      this._imageUrl = URL.createObjectURL(file);

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this.imageBytes = bytes;
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this._imageFileExtension = fileExtension;
      }
    } else {
      this._imageUrl = "";
      this.imageBytes = new Uint8Array();
    }
  };
  private getFileExtension = (file: File): string | undefined => {
    return file.name.split(".").pop();
  };
  public get imageUrl() {
    return this._imageUrl;
  }
  public get imageFileExtension() {
    return this._imageFileExtension;
  }
  public setFirstName(value: string) {
    this._firstName = value;
  }
  public get firstName(): string {
    return this._firstName;
  }
  public setLastName(value: string) {
    this._lastName = value;
  }
  public get lastName(): string {
    return this._lastName;
  }
}

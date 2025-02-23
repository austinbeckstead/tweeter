import { UserService } from "../model/service/UserService";
import { UserPresenter, UserView } from "./UserPresenter";
import { Buffer } from "buffer";

export class RegisterUserPresenter extends UserPresenter {
  private userService: UserService;
  private imageBytes = new Uint8Array();
  private _imageUrl = "";
  private _imageFileExtension = "";

  public constructor(view: UserView, originalUrl?: string) {
    super(view, originalUrl);
    this.userService = new UserService();
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string
  ) {
    this.doFailureReportingOperation(async () => {
      this.isLoading = true;
      const [user, authToken] = await this.userService.register(
        firstName,
        lastName,
        alias,
        password,
        this.imageBytes,
        this._imageFileExtension
      );
      this.view.updateUserInfo(user, user, authToken, this.rememberMe);
      this.view.navigate("/");
    }, "register user");
    this.isLoading = false;
  }
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
}

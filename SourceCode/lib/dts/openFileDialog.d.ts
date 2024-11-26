type OpenFileExtensions = "." | ".png" | ".jpg"
type OpenFileDialogType = "Text Files" | "Images" | "All Files" | "Folders"

type filePickerConfig = {
    title: string,
    fileType: OpenFileDialogType,
    extension: OpenFileExtensions,
    multiselect: boolean
}
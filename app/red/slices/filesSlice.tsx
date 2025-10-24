import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FileInfo {
    name: string;
    size: number;
    type: string;
    lastModified: number;
}

interface FileState {
    files: FileInfo[];
    uploadStatus: 'idle' | 'uploading' | 'success' | 'error';
    uploadProgress: number;
}

const initialState: FileState = {
    files: [],
    uploadStatus: 'idle',
    uploadProgress: 0
};

const fileSlice = createSlice({
    name: 'files',
    initialState,
    reducers: {
        addFiles(state, action: PayloadAction<FileInfo[]>) {
            state.files.push(...action.payload);
        },
        clearFiles(state) {
            state.files = [];
        },
        setUploadStatus(state, action: PayloadAction<FileState['uploadStatus']>) {
            state.uploadStatus = action.payload;
        },
        setUploadProgress(state, action: PayloadAction<number>) {
            state.uploadProgress = action.payload;
        }
    }
});

export const { addFiles, clearFiles, setUploadStatus, setUploadProgress } = fileSlice.actions;
export default fileSlice.reducer;
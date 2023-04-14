export type AlbumPhoto = string;

export type Album = AlbumPhoto[]

export type AlbumCollection = {
    [key: string]: Album
}

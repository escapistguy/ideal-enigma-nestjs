export interface ProfileResponseInterface {
    profile: {
        id: number,
        username: string,
        bio: string,
        image: string,
        following: boolean
    }
};
export interface PlantInfo {
    deviceId: string
    name: string
    description?: string
    avatarImgUrl?: string
    location?: string
    sinceMonth?: number;
    sinceYear?: number;
}

export const getDefaultPlantInfo = (): PlantInfo => {
    const today = new Date();
    return {
        deviceId: '',
        name: '',
        location: '',
        sinceMonth: today.getMonth(),
        sinceYear: today.getFullYear(),
        avatarImgUrl: 'https://placehold.co/128x128?text=No+Avatar',
    }
}
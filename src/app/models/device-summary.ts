export interface DeviceSummary {
    id: string
    name?: string
    description?: string
    userId: string,
    eTag: string
    deviceETag: string
    status: string
    connectionState: string
    lastActivityTime: string
}

export interface DeviceTwinSummary extends DeviceSummary {
    tags?: Record<string, any>
    properties?: Record<string, any>
}
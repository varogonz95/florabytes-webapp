import signalR from '@microsoft/signalr';

export class TelemetryHubHttpClient extends signalR.HttpClient {

    constructor(private readonly endpoint: string, private readonly clientId: string) {
        super();
    }

    override send(request: signalR.HttpRequest): Promise<signalR.HttpResponse> {
        request.headers = { 'Content-Type': 'application/json' }
        request.content = JSON.stringify({ clientId: this.clientId })
        return this.post(this.endpoint, request)
    }
}

import { HttpClient, provideHttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_ENVIRONMENT } from '../../../core/providers/app-environment.provider';
import { IAppEnvironment } from '../../../core/providers/app-environment';
import { catchError, map, throwError } from 'rxjs';

export interface CollectionsResponse {
    collections: CollectionItem[]
}

export interface CollectionItem {
    id: string
    itemCount: number
    knownCollectionType: string | "ImageDefault",
    collectionPage: CollectionPageItem
}

export interface CollectionPage {
    items: CollectionPageItem[]
}

export interface CollectionPageItem {
    collectionItemId: string,
    itemType: string | "Generic",
    content: CollectionPageItemContent
}

export interface CollectionPageItemContent {
    contentId: string,
    customData: string,
    contentType: string | "Image",
    url: string,
    thumbnails: Thumbnail[]
}

export interface Thumbnail {
    thumbnailUrl: string
}

@Injectable({
    providedIn: 'root',
    deps: [provideHttpClient()]
})
export class AIGenImageProviderService {

    private getCollectionsUrl = () => `${this.env.imageProvider.baseUrl}/get`;

    constructor(
        @Inject(APP_ENVIRONMENT)
        private readonly env: IAppEnvironment,
        private readonly httpClient: HttpClient
    ) { }

    public getCollections() {
        const queryParams = this.toQueryParams(this.env.imageProvider.getCollectionsQueryParams ?? {});
        return this.httpClient
            .get(this.getCollectionsUrl() + '?' + queryParams)
            .pipe(
                catchError((err, caught) => {
                    console.error(err, caught);
                    return throwError(() => err)
                }),
                map(response => response as CollectionsResponse),
            );
    }

    private toQueryParams(queryParams: Record<string, any>) {
        return Object.keys(queryParams).map(key => `${key}=${queryParams[key]}`).join('&');
    }
}

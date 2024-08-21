import { EnvironmentInjector, Injectable, ViewContainerRef, createComponent } from '@angular/core';
import { ImageSelectorComponent } from '../../components/image-selector/image-selector.component';

export interface ImageSelectorCreateOptions {
    asSingleton?: boolean
    inputs?: Record<string, any>
}

@Injectable()
export class ImageSelectorService {
    constructor(
        private readonly envInjector: EnvironmentInjector,
    ) { }

    public create(containerRef: ViewContainerRef, options?: ImageSelectorCreateOptions) {

        const component = createComponent(ImageSelectorComponent, { environmentInjector: this.envInjector });

        if (options?.inputs) {
            const inputs = options.inputs!;
            component.changeDetectorRef.detach();

            Object.keys(options.inputs).forEach(key => {
                const inputValue = inputs[key];
                component.setInput(key, inputValue)
            });

            component.changeDetectorRef.detectChanges();
        }

        containerRef.insert(component.hostView);

        return new ImageSelectorProxy(component.instance);
    }
}

export class ImageSelectorProxy {
    constructor(private readonly component: ImageSelectorComponent) {
    }

    public show() {
        this.component.show();
    }

    public hide() {
        this.component.hide();
    }
}

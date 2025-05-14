import { StaticResponse } from "cypress/types/net-stubbing";

export function interceptHandler(isStubbed: boolean, staticResponse: StaticResponse) {
    return req => {
        if (isStubbed) {
            req.reply(staticResponse);
        }
        else {
            req.continue(res => {
                res.body = staticResponse.body ?? res.body;
                res.send();
            });
        }
    };
}
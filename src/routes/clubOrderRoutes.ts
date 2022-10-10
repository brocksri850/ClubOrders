import { Router } from "express";
import { routerResponse } from "../common/responseQuery"
import clubOrderService from "../services/clubOrderService";


export class ClubOrderRouter {

    public router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.post("/import", this.clubOrderImport);
    }

    public clubOrderImport(req: any, res: any) {

        clubOrderService.clubOrderImport(req, function (err, response) {
            var commonResponse = routerResponse.objResponse(err, response, req, res)
            res.send(commonResponse)
        })
    }

}

var clubOrderRouter = new ClubOrderRouter();
const router = clubOrderRouter.router
export default router
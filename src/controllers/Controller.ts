import e, {Response} from "express";

class Controller {
    public sendResponse (res: Response, message: string, data?: any, code?: number): e.Response
    {
        return res.status(code||200).json({
            success: true,
            data: data,
            message: message
        });
    }

    public sendError (res: Response, message: string, error?: any, code?: number): e.Response
    {
        return res.status(code||400).json({
            success: false,
            error: error,
            message: message
        });
    }

    public send401 (res: Response): e.Response
    {
        return res.status(401).json({
            success: false,
            message: "unauthorized."
        });
    }

    public send403 (res: Response): e.Response
    {
        return res.status(403).json({
            success: false,
            message: "forbidden."
        });
    }

    public send404 (res: Response): e.Response
    {
        return res.status(404).json({
            success: false,
            message: "no records found."
        });
    }

    public send500 (res: Response, e: any): e.Response
    {
        console.log(e);

        return res.status(500).json({
            success: false,
            error: e,
            message: e.message || "server error."
        });
    }
}

export default Controller;
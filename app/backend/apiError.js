export default class ApiError extends Error {
    constructor(msg, status=400) {
        super(msg);
        this.msg = msg;
        this.status = status;
    }
}
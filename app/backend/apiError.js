export default class ApiError extends Error {
    constructor(msg, id, status=400) {
        super(msg);
        this.msg = msg;
        this.id = id;
        this.status = status;
    }
}
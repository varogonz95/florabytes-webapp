export interface IResult<T extends object> {
    errors?: Error[]
    data: T
}
namespace Template.Server.Helpers;

public static class ResultHelpers
{
    public static Result<T> Ok<T>(T data) =>
        new(HttpStatusCode.OK, Data: data);

    public static Result<T> BadRequest<T>(string message) =>
        new(HttpStatusCode.BadRequest, ErrorMessage: message);

    public static Result<T> NotFound<T>(string message) =>
        new(HttpStatusCode.NotFound, ErrorMessage: message);

    public static Result<T> Unauthorized<T>(string message) =>
        new(HttpStatusCode.Unauthorized, ErrorMessage: message);
}

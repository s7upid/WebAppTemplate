namespace Template.Server.Extensions;

public static class ControllerExtensions
{
    /// <summary>
    /// Converts a Result to an appropriate IActionResult, handling ValidationProblemDetails when FieldErrors are present.
    /// </summary>
    public static IActionResult ToActionResult<T>(this ControllerBase controller, Result<T> result)
    {
        if (result.IsSuccessful)
        {
            return controller.StatusCode((int)result.StatusCode, result.Data);
        }

        if (result.FieldErrors != null && result.FieldErrors.Count > 0)
        {
            var problemDetails = new ValidationProblemDetails(result.FieldErrors)
            {
                Title = "Validation failed",
                Status = (int)result.StatusCode
            };

            return controller.BadRequest(problemDetails);
        }

        return controller.StatusCode((int)result.StatusCode, result.ErrorMessage);
    }
}


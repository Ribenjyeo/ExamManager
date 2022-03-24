using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace ExamManager.Extensions
{
    public static class ModelStateExtensions
    {
        public static void AddErrors(this ModelStateDictionary modelState, Dictionary<string, List<string>> errors)
        {
            foreach (var error in errors)
            {
                foreach (var errorMessage in error.Value)
                {
                    modelState.AddModelError(error.Key, errorMessage);
                }
            }
        }
    }
}

using System.ComponentModel.DataAnnotations;

namespace QAProject.User.Questions;

public class UpdateQuestionDto
{
    [Required]
    public required string Title { get; set; }
    [Required]
    public required string Content { get; set; }
}
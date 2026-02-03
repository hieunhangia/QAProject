using System.ComponentModel.DataAnnotations;

namespace QAProject.User.Questions;

public class UpdateQuestionDto
{
    public required string Title { get; set; }
    public required string Content { get; set; }
}
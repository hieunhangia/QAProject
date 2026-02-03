using System;
using System.ComponentModel.DataAnnotations;

namespace QAProject.User.Questions;

public class CreateQuestionDto
{
    [Required]
    public required string Title { get; set; }
    [Required]
    public required string Content { get; set; }
    [Required]
    public Guid AssigneeId { get; set; }
}
using System;
using System.ComponentModel.DataAnnotations;

namespace QAProject.User.Questions;

public class CreateQuestionDto
{
    public required string Title { get; set; }
    public required string Content { get; set; }
    public Guid AssigneeId { get; set; }
}
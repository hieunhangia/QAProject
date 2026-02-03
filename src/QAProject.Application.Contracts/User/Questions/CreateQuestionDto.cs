using System;
using System.ComponentModel.DataAnnotations;
using QAProject.Questions;

namespace QAProject.User.Questions;

public class CreateQuestionDto
{
    [Required]
    [MaxLength(QuestionConsts.QuestionTitleMaxLength)]
    public required string Title { get; set; }
    
    [Required]
    [MaxLength(QuestionConsts.QuestionContentMaxLength)]
    public required string Content { get; set; }
    [Required]
    public Guid AssigneeId { get; set; }
}
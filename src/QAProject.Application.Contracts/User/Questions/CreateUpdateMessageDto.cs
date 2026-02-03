using System.ComponentModel.DataAnnotations;
using QAProject.Questions;

namespace QAProject.User.Questions;

public class CreateUpdateMessageDto
{
    [Required]
    [MaxLength(QuestionConsts.MessageContentMaxLength)]
    public required string Content { get; set; }
}
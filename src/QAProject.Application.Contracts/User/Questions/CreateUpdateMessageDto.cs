using System.ComponentModel.DataAnnotations;

namespace QAProject.User.Questions;

public class CreateUpdateMessageDto
{
    [Required]
    public required string Content { get; set; }
}
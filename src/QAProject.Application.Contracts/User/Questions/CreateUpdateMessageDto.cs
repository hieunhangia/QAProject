using System.ComponentModel.DataAnnotations;

namespace QAProject.User.Questions;

public class CreateUpdateMessageDto
{
    public required string Content { get; set; }
}
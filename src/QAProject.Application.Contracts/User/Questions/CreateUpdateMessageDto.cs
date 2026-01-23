using System.ComponentModel.DataAnnotations;

namespace QAProject.User.Questions;

public class CreateUpdateMessageDto
{
    [Required(ErrorMessage = "Nội dung tin nhắn không được để trống.")]
    public required string Content { get; set; }
}
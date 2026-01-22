using System.ComponentModel.DataAnnotations;

namespace QAProject.User.Questions;

public class UpdateQuestionDto
{
    [Required(ErrorMessage = "Tiêu đề câu hỏi không được để trống.")]
    public required string Title { get; set; }
    [Required(ErrorMessage = "Nội dung câu hỏi không được để trống.")]
    public required string Content { get; set; }
}
using System;
using System.ComponentModel.DataAnnotations;

namespace QAProject.User.Questions;

public class CreateQuestionDto
{
    [Required(ErrorMessage = "Tiêu đề câu hỏi không được để trống.")]
    public required string Title { get; set; }
    [Required(ErrorMessage = "Nội dung câu hỏi không được để trống.")]
    public required string Content { get; set; }
    [Required(ErrorMessage = "Người được giao nhiệm vụ trả lời không được để trống.")]
    public Guid AssigneeId { get; set; }
}
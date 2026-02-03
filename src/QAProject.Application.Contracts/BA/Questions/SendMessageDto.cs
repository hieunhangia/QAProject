using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace QAProject.BA.Questions
{
    public class SendMessageDto
    {
        public Guid QuestionId { get; set; }
        public required string Content { get; set; }
    }
}

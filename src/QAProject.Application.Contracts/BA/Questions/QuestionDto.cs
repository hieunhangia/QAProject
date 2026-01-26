using QAProject.Questions;
using System;
using System.Collections.Generic;
using System.Text;
using Volo.Abp.Application.Dtos;

namespace QAProject.BA.Questions
{
    public class QuestionDto : AuditedEntityDto<Guid>
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public Guid? AssigneeId { get; set; }
        public string AssigneeName { get; set; } // Nếu muốn hiển thị tên người được giao
        public QaStatus Status { get; set; }
    }
}

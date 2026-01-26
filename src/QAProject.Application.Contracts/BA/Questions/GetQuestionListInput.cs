using QAProject.Questions;
using System;
using System.Collections.Generic;
using System.Text;
using Volo.Abp.Application.Dtos;

namespace QAProject.BA.Questions
{
    public class GetQuestionListInput : PagedAndSortedResultRequestDto
    {
        public Guid? AssigneeId { get; set; }
        // Bạn có thể thêm filter theo Status nếu muốn
        public QaStatus? Status { get; set; }
    }
}

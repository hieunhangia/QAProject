using QAProject.Questions;
using System;
using System.Collections.Generic;
using System.Text;
using Volo.Abp.Application.Dtos;

namespace QAProject.BA.Questions
{
    public class GetQuestionListInput : PagedAndSortedResultRequestDto
    {
      
        public QaStatus? Status { get; set; }
    }
}

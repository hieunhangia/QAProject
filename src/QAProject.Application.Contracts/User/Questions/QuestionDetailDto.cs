using System;
using System.Collections.Generic;
using QAProject.Questions;
using Volo.Abp.Application.Dtos;

namespace QAProject.User.Questions;

public class QuestionDetailDto : AuditedEntityDto<Guid>
{
    public string? Title { get; set; }
    public string? Content { get; set; }
    public QaStatus Status { get; set; }
    public DateTime? ClosedAt { get; set; }
    public string? AssigneeName { get; set; }

    public string? CreatorName { get; set; }
    public IEnumerable<MessageDto>? Messages { get; set; }
}
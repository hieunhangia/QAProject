using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace QAProject.Questions;

public class Comment : CreationAuditedEntity<Guid>
{
    public Guid QuestionId { get; set; }
    public required string Content { get; set; }
}
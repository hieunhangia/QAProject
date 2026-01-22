using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.Identity;

namespace QAProject.Questions;

public class Comment : CreationAuditedEntity<Guid>
{
    public Guid QuestionId { get; set; }
    public required string Content { get; set; }
    
    public IdentityUser? Creator { get; set; }
}
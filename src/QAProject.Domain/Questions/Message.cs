using System;
using System.Collections.Generic;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.Identity;

namespace QAProject.Questions;

public class Message : CreationAuditedEntity<Guid>
{
    public Guid QuestionId { get; set; }
    public required string Content { get; set; }
    
    public ICollection<string> ContentUpdateHistory { get; set; } = new List<string>();
    
    public void UpdateContent(string newContent)
    {
        ContentUpdateHistory.Add(Content);
        Content = newContent;
    }
    
    public IdentityUser? Creator { get; set; }
}
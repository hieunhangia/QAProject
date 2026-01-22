using System;
using System.Collections.Generic;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.Identity;

namespace QAProject.Questions;

public class Question : AuditedAggregateRoot<Guid>
{
    public required string Title { get; set; }
    public required string Content { get; set; }
    public Guid? AssigneeId { get; set; }
    public IdentityUser? Creator { get; set; }
    public IdentityUser? LastModifier { get; set; }
    public IdentityUser? Assignee { get; set; }
    public QaStatus Status { get; set; } = QaStatus.Open;
    public DateTime? ClosedAt { get; set; }
    public ICollection<Comment> Comments { get; } = new List<Comment>();

    public void AddComment(string content) => Comments.Add(new Comment { Content = content });

    public void Reopen()
    {
        Status = QaStatus.Open;
        ClosedAt = null;
    }

    public void Close()
    {
        Status = QaStatus.Closed;
        ClosedAt = DateTime.Now;
    }
}
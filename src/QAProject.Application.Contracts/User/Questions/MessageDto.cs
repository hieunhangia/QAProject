using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace QAProject.User.Questions;

public class MessageDto : CreationAuditedEntityDto<Guid>
{
    public string? Content { get; set; }
    public string? CreatorName { get; set; }
    public IEnumerable<string>? ContentUpdateHistory { get; set; }
}
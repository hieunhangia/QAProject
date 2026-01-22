using System;
using Volo.Abp.Application.Dtos;

namespace QAProject.User.Questions;

public class MessageDto : EntityDto<Guid>
{
    public string? Content { get; set; }
    public string? CreatorName { get; set; }
}
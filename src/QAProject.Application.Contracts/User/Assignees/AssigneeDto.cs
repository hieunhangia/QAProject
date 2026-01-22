using System;
using Volo.Abp.Application.Dtos;

namespace QAProject.User.Assignees;

public class AssigneeDto : EntityDto<Guid>
{
    public required string Name { get; set; }
}
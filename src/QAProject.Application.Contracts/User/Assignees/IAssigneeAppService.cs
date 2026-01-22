using System;
using Volo.Abp.Application.Services;

namespace QAProject.User.Assignees;

public interface IAssigneeAppService : IReadOnlyAppService<AssigneeDto, Guid, GetAssigneeDto>;
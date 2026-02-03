using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QAProject.Constants;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;

namespace QAProject.User.Assignees;

[Route("api/user")]
[Authorize(Roles = Roles.User)]
public class AssigneeAppService(
    IRepository<IdentityUser, Guid> repository,
    IRepository<IdentityRole, Guid> roleRepository)
    : ReadOnlyAppService<IdentityUser, AssigneeDto, Guid, GetAssigneeDto>(repository),
        IAssigneeAppService
{
    [HttpGet("assignee/{id:guid}")]
    public override Task<AssigneeDto> GetAsync(Guid id) => base.GetAsync(id);

    [HttpGet("assignees")]
    public override async Task<PagedResultDto<AssigneeDto>> GetListAsync(GetAssigneeDto input)
    {
        var query = await CreateFilteredQueryAsync(input);
        var assigneeName = input.AssigneeName?.Trim();
        if (!string.IsNullOrEmpty(assigneeName))
        {
            query = query.Where(x => x.Name.Contains(assigneeName));
        }

        var assigneeRole = await roleRepository.FirstOrDefaultAsync(r => r.Name == Roles.BA);
        query = query.Where(u => u.Roles.Any(r => r.RoleId == assigneeRole!.Id));

        var totalCount = await AsyncExecuter.CountAsync(query);

        var entityDtos = new List<AssigneeDto>();

        if (totalCount > 0)
        {
            query = query.OrderBy(u => u.Name);
            query = ApplyPaging(query, input);

            var entities = await AsyncExecuter.ToListAsync(query);
            entityDtos = await MapToGetListOutputDtosAsync(entities);
        }

        return new PagedResultDto<AssigneeDto>(
            totalCount,
            entityDtos
        );
    }
}